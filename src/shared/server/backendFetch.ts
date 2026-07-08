import { NextRequest } from "next/server";
import { API_BASE } from "@/shared/server/env";
import type { ApiErrorBody } from "@/shared/types/api.types";
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    type AuthTokens,
    isAuthTokens,
} from "@/shared/server/authCookies";

interface BackendFetchOptions extends Omit<RequestInit, "headers"> {
    headers?: HeadersInit;
    auth?: boolean;
    retryOnUnauthorized?: boolean;
}

export interface BackendFetchResult<T> {
    ok: boolean;
    status: number;
    data: T | ApiErrorBody | null;
    tokens?: AuthTokens;
    clearAuthCookies?: boolean;
}

function createApiErrorBody(
    statusCode: number,
    message: string,
    error: string,
    path: string,
): ApiErrorBody {
    return { statusCode, message, error, path };
}

async function readJson<T>(response: Response): Promise<T | null> {
    if (response.status === 204) return null;

    return response.json().catch(() => null) as Promise<T | null>;
}

async function refreshAuthTokens(
    refreshToken: string,
): Promise<AuthTokens | null> {
    const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data: unknown = await response.json().catch(() => null);

    return isAuthTokens(data) ? data : null;
}

function isFormDataBody(body: BodyInit | null | undefined): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData;
}

async function callBackend(
    path: string,
    options: Omit<BackendFetchOptions, "auth" | "retryOnUnauthorized">,
    accessToken: string | null,
): Promise<Response> {
    const headers = new Headers(options.headers);

    if (
        options.body !== undefined &&
        !isFormDataBody(options.body) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });
}

export async function backendFetch<T>(
    request: NextRequest,
    path: string,
    options: BackendFetchOptions = {},
): Promise<BackendFetchResult<T>> {
    const {
        auth = false,
        retryOnUnauthorized = true,
        ...requestOptions
    } = options;

    let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
    let refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
    let refreshedTokens: AuthTokens | undefined;

    if (auth && !accessToken && refreshToken) {
        const tokens = await refreshAuthTokens(refreshToken);

        if (!tokens) {
            return {
                ok: false,
                status: 401,
                data: createApiErrorBody(
                    401,
                    "Session expired",
                    "UnauthorizedException",
                    path,
                ),
                clearAuthCookies: true,
            };
        }

        refreshedTokens = tokens;
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
    }

    if (auth && !accessToken) {
        return {
            ok: false,
            status: 401,
            data: createApiErrorBody(
                401,
                "No active session",
                "UnauthorizedException",
                path,
            ),
            clearAuthCookies: true,
        };
    }

    let backendResponse = await callBackend(
        path,
        requestOptions,
        auth ? accessToken : null,
    );

    if (
        auth &&
        retryOnUnauthorized &&
        backendResponse.status === 401 &&
        refreshToken
    ) {
        const tokens = await refreshAuthTokens(refreshToken);

        if (!tokens) {
            return {
                ok: false,
                status: 401,
                data: createApiErrorBody(
                    401,
                    "Session expired",
                    "UnauthorizedException",
                    path,
                ),
                clearAuthCookies: true,
            };
        }

        refreshedTokens = tokens;

        backendResponse = await callBackend(
            path,
            requestOptions,
            tokens.accessToken,
        );
    }

    if (auth && backendResponse.status === 401 && !refreshToken) {
        return {
            ok: false,
            status: 401,
            data: createApiErrorBody(
                401,
                "Session expired",
                "UnauthorizedException",
                path,
            ),
            clearAuthCookies: true,
        };
    }

    const data = await readJson<T | ApiErrorBody>(backendResponse);

    return {
        ok: backendResponse.ok,
        status: backendResponse.status,
        data,
        tokens: refreshedTokens,
    };
}

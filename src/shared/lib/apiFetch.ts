import { useAuthStore } from "@/features/auth/model/auth.store";
import type {
    ApiErrorBody,
    AuthSessionResponse,
} from "@/shared/types/api.types";

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public error: string,
        public path: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

let refreshPromise: Promise<void> | null = null;

function isApiPath(path: string): boolean {
    return path.startsWith("/api/");
}

function isAuthPath(path: string): boolean {
    return path.startsWith("/api/auth");
}

function isFormDataBody(body: BodyInit | null | undefined): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData;
}

function toErrorBody(body: unknown, fallbackPath: string): ApiErrorBody {
    if (!body || typeof body !== "object") {
        return {
            statusCode: 500,
            message: "Unknown error",
            error: "",
            path: fallbackPath,
        };
    }

    const candidate = body as Partial<ApiErrorBody>;

    return {
        statusCode:
            typeof candidate.statusCode === "number"
                ? candidate.statusCode
                : 500,
        message:
            typeof candidate.message === "string"
                ? candidate.message
                : "Unknown error",
        error: typeof candidate.error === "string" ? candidate.error : "",
        path:
            typeof candidate.path === "string" ? candidate.path : fallbackPath,
    };
}

async function doRefresh(): Promise<void> {
    const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "same-origin",
    });

    if (!response.ok) {
        throw new Error("Refresh failed");
    }

    const data: AuthSessionResponse = await response.json();

    useAuthStore.getState().setSession(data);
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit & { _isRetry?: boolean } = {},
): Promise<T> {
    if (!isApiPath(path)) {
        throw new Error("apiFetch only supports local BFF /api/* paths");
    }

    const { _isRetry, headers: extraHeaders, ...restOptions } = options;

    const headers = new Headers(extraHeaders);

    if (
        restOptions.body !== undefined &&
        !isFormDataBody(restOptions.body) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(path, {
        ...restOptions,
        headers,
        credentials: restOptions.credentials ?? "same-origin",
    });

    if (response.status === 401 && !_isRetry && !isAuthPath(path)) {
        try {
            if (!refreshPromise) {
                refreshPromise = doRefresh().finally(() => {
                    refreshPromise = null;
                });
            }

            await refreshPromise;

            return apiFetch<T>(path, {
                ...options,
                _isRetry: true,
            });
        } catch {
            useAuthStore.getState().clear();

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }

            throw new ApiError(
                401,
                "Session expired",
                "UnauthorizedException",
                path,
            );
        }
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const errorBody = toErrorBody(body, path);

        throw new ApiError(
            errorBody.statusCode,
            errorBody.message,
            errorBody.error,
            errorBody.path,
        );
    }

    return body as T;
}

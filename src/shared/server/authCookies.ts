import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 15;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const BASE_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
};

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export function isAuthTokens(value: unknown): value is AuthTokens {
    if (!value || typeof value !== "object") return false;

    const candidate = value as Partial<AuthTokens>;

    return (
        typeof candidate.accessToken === "string" &&
        typeof candidate.refreshToken === "string"
    );
}

export function setAuthCookies(
    response: NextResponse,
    tokens: AuthTokens,
): void {
    response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
}

export function clearAuthCookies(response: NextResponse): void {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
}

export function applyAuthCookieUpdate(
    response: NextResponse,
    tokens?: AuthTokens,
    shouldClear = false,
): void {
    if (shouldClear) {
        clearAuthCookies(response);
        return;
    }

    if (tokens) {
        setAuthCookies(response, tokens);
    }
}

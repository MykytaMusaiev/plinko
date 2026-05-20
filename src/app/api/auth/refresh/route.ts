import { NextRequest, NextResponse } from "next/server";
import type { AuthSessionResponse, UserMe } from "@/shared/types/api.types";
import {
    REFRESH_TOKEN_COOKIE,
    clearAuthCookies,
    isAuthTokens,
    setAuthCookies,
} from "@/shared/server/authCookies";
import { API_BASE } from "@/shared/server/env";

async function fetchUserMe(accessToken: string): Promise<UserMe> {
    const response = await fetch(`${API_BASE}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json() as Promise<UserMe>;
}

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
        const response = NextResponse.json(
            { message: "No session" },
            { status: 401 },
        );

        clearAuthCookies(response);

        return response;
    }

    try {
        const backendResponse = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!backendResponse.ok) {
            const response = NextResponse.json(
                { message: "Session expired" },
                { status: 401 },
            );

            clearAuthCookies(response);

            return response;
        }

        const tokens: unknown = await backendResponse.json();

        if (!isAuthTokens(tokens)) {
            const response = NextResponse.json(
                { message: "Invalid auth response" },
                { status: 502 },
            );

            clearAuthCookies(response);

            return response;
        }

        const user = await fetchUserMe(tokens.accessToken);

        const response = NextResponse.json({
            user,
        } satisfies AuthSessionResponse);

        setAuthCookies(response, tokens);

        return response;
    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

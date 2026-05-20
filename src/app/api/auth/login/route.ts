import { NextRequest, NextResponse } from "next/server";
import type { AuthSessionResponse, UserMe } from "@/shared/types/api.types";
import { isAuthTokens, setAuthCookies } from "@/shared/server/authCookies";
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
    try {
        const body: unknown = await req.json();

        const backendResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!backendResponse.ok) {
            const errorBody: unknown = await backendResponse
                .json()
                .catch(() => null);

            return NextResponse.json(errorBody, {
                status: backendResponse.status,
            });
        }

        const tokens: unknown = await backendResponse.json();

        if (!isAuthTokens(tokens)) {
            return NextResponse.json(
                { message: "Invalid auth response" },
                { status: 502 },
            );
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

import { NextRequest, NextResponse } from "next/server";
import type { AuthSessionResponse, UserMe } from "@/shared/types/api.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

export async function GET(req: NextRequest) {
    const result = await backendFetch<UserMe>(req, "/api/v1/users/me", {
        method: "GET",
        auth: true,
    });

    if (!result.ok) {
        const response = NextResponse.json(result.data, {
            status: result.status,
        });

        applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

        return response;
    }

    const response = NextResponse.json({
        user: result.data as UserMe,
    } satisfies AuthSessionResponse);

    applyAuthCookieUpdate(response, result.tokens);

    return response;
}

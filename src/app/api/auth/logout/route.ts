import { NextRequest, NextResponse } from "next/server";
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    clearAuthCookies,
} from "@/shared/server/authCookies";
import { API_BASE } from "@/shared/server/env";

export async function POST(req: NextRequest) {
    const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (accessToken && refreshToken) {
        await fetch(`${API_BASE}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ refreshToken }),
        }).catch(() => {
            // best-effort logout: local cookies are cleared regardless
        });
    }

    const response = new NextResponse(null, { status: 204 });

    clearAuthCookies(response);

    return response;
}

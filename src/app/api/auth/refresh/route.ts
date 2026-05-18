import { NextRequest, NextResponse } from "next/server";
import type { UserMe } from "@/shared/types/api.types";

const API = process.env.API_BASE ?? "https://plinko-be-stanish.fly.dev";

const REFRESH_COOKIE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
};

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: "No session" }, { status: 401 });
    }

    try {
        const beRes = await fetch(`${API}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!beRes.ok) {
            const response = NextResponse.json(
                { message: "Session expired" },
                { status: 401 },
            );
            response.cookies.delete("refreshToken");
            return response;
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await beRes.json();

        const userRes = await fetch(`${API}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user: UserMe = await userRes.json();

        const response = NextResponse.json({ accessToken, user });
        response.cookies.set("refreshToken", newRefreshToken, REFRESH_COOKIE);
        return response;
    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

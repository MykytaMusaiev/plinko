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

async function fetchUserMe(accessToken: string): Promise<UserMe> {
    const res = await fetch(`${API}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const beRes = await fetch(`${API}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!beRes.ok) {
            const err = await beRes.json();
            return NextResponse.json(err, { status: beRes.status });
        }

        const { accessToken, refreshToken } = await beRes.json();
        const user = await fetchUserMe(accessToken);

        const response = NextResponse.json({ accessToken, user });
        response.cookies.set("refreshToken", refreshToken, REFRESH_COOKIE);
        return response;
    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

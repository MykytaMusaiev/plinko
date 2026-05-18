import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_BASE ?? "https://plinko-be-stanish.fly.dev";

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const authorization = req.headers.get("Authorization");

    if (refreshToken && authorization) {
        await fetch(`${API}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
            },
            body: JSON.stringify({ refreshToken }),
        }).catch(() => {
            // best-effort: always clear cookie regardless
        });
    }

    const response = new NextResponse(null, { status: 204 });
    response.cookies.delete("refreshToken");
    return response;
}

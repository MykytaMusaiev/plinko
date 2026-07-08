import { NextRequest, NextResponse } from "next/server";
import type { BetListResponse, BetResponse } from "@/shared/types/api.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

const BETS_PATH = "/api/v1/bets";

function createBackendBetsPath(req: NextRequest): string {
    const query = req.nextUrl.searchParams.toString();

    return query ? `${BETS_PATH}?${query}` : BETS_PATH;
}

export async function POST(req: NextRequest) {
    const body: unknown = await req.json();

    const result = await backendFetch<BetResponse>(req, BETS_PATH, {
        method: "POST",
        auth: true,
        body: JSON.stringify(body),
    });

    const response = NextResponse.json(result.data, {
        status: result.status,
    });

    applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

    return response;
}

export async function GET(req: NextRequest) {
    const result = await backendFetch<BetListResponse>(
        req,
        createBackendBetsPath(req),
        {
            method: "GET",
            auth: true,
        },
    );

    const response = NextResponse.json(result.data, {
        status: result.status,
    });

    applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

    return response;
}

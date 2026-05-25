import { NextRequest, NextResponse } from "next/server";
import type { ClaimRewardResponse } from "@/features/progression/types/progression.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

const DAILY_CLAIM_PATH = "/api/v1/progression/daily/claim";

export async function POST(req: NextRequest) {
    const result = await backendFetch<ClaimRewardResponse>(
        req,
        DAILY_CLAIM_PATH,
        {
            method: "POST",
            auth: true,
        },
    );

    const response = NextResponse.json(result.data, {
        status: result.status,
    });

    applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

    return response;
}

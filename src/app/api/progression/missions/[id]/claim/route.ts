import { NextRequest, NextResponse } from "next/server";
import type { ClaimRewardResponse } from "@/features/progression/types/progression.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const result = await backendFetch<ClaimRewardResponse>(
        req,
        `/api/v1/progression/missions/${encodeURIComponent(id)}/claim`,
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

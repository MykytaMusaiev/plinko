import { NextRequest, NextResponse } from "next/server";
import type { ProgressionResponse } from "@/features/progression/types/progression.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

const PROGRESSION_ME_PATH = "/api/v1/progression/me";

export async function GET(req: NextRequest) {
    const result = await backendFetch<ProgressionResponse>(
        req,
        PROGRESSION_ME_PATH,
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

import { NextRequest, NextResponse } from "next/server";
import type {
    ProfileResponse,
    UpdateProfileDto,
} from "@/features/profile/types/profile.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

const PROFILE_ME_PATH = "/api/v1/profile/me";

export async function GET(req: NextRequest) {
    const result = await backendFetch<ProfileResponse>(req, PROFILE_ME_PATH, {
        method: "GET",
        auth: true,
    });

    const response = NextResponse.json(result.data, {
        status: result.status,
    });

    applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

    return response;
}

export async function PATCH(req: NextRequest) {
    const body: UpdateProfileDto = await req.json();

    const result = await backendFetch<ProfileResponse>(req, PROFILE_ME_PATH, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(body),
    });

    const response = NextResponse.json(result.data, {
        status: result.status,
    });

    applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

    return response;
}

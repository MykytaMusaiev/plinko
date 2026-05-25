import { NextRequest, NextResponse } from "next/server";
import type { AvatarUploadResponse } from "@/features/profile/types/profile.types";
import { backendFetch } from "@/shared/server/backendFetch";
import { applyAuthCookieUpdate } from "@/shared/server/authCookies";

const PROFILE_AVATAR_PATH = "/api/v1/profile/avatar";

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const result = await backendFetch<AvatarUploadResponse>(
        req,
        PROFILE_AVATAR_PATH,
        {
            method: "POST",
            auth: true,
            body: formData,
        },
    );

    const response = NextResponse.json(result.data, {
        status: result.status,
    });

    applyAuthCookieUpdate(response, result.tokens, result.clearAuthCookies);

    return response;
}

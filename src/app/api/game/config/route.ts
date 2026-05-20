import { NextRequest, NextResponse } from "next/server";
import type { GameConfig } from "@/shared/types/api.types";
import { backendFetch } from "@/shared/server/backendFetch";

const GAME_CONFIG_PATH = "/api/v1/game/config";

export async function GET(req: NextRequest) {
    const result = await backendFetch<GameConfig>(req, GAME_CONFIG_PATH, {
        method: "GET",
        auth: false,
        cache: "force-cache",
    });

    if (!result.ok) {
        return NextResponse.json(
            result.data ?? { message: "Failed to load game config" },
            { status: result.status },
        );
    }

    return NextResponse.json(result.data);
}

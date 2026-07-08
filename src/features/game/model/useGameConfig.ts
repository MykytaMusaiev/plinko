import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/lib/apiFetch";
import type { GameConfig } from "@/shared/types/api.types";

export function useGameConfig() {
    return useQuery<GameConfig>({
        queryKey: ["game-config"],
        queryFn: () => apiFetch("/api/game/config"),
        staleTime: Infinity,
    });
}

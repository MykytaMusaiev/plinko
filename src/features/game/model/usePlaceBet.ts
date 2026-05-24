import { useMutation } from "@tanstack/react-query";
import { betsApi } from "../api/bets.api";
import { useGameStore } from "./game.store";
import type { CreateBetDto, BetResponse } from "@/shared/types/api.types";

interface UsePlaceBetOptions {
    onError?: (err: Error) => void;
}

export function usePlaceBet({ onError }: UsePlaceBetOptions = {}) {
    const { setPlaying, startRound } = useGameStore();

    return useMutation<BetResponse, Error, CreateBetDto>({
        mutationFn: betsApi.place,
        onSuccess: (result) => {
            startRound(result);
        },
        onError: (err) => {
            setPlaying(false);
            onError?.(err);
        },
    });
}

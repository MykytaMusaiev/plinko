import { useMutation } from "@tanstack/react-query";
import { betsApi } from "../api/bets.api";
import { useGameStore } from "./game.store";
import type { CreateBetDto, BetResponse } from "@/shared/types/api.types";

interface UsePlaceBetOptions {
    onError?: (err: Error) => void;
}

export function usePlaceBet({ onError }: UsePlaceBetOptions = {}) {
    const { setPlaying, setLastResult, addResult, setWinningBucketIndex } =
        useGameStore();

    return useMutation<BetResponse, Error, CreateBetDto>({
        mutationFn: betsApi.place,
        onSuccess: (result) => {
            setWinningBucketIndex(null); // clear previous highlight
            addResult(result);
            setLastResult(result);
            setPlaying(true);
        },
        onError: (err) => {
            setPlaying(false);
            onError?.(err);
        },
    });
}

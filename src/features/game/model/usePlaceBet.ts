import { useMutation } from "@tanstack/react-query";
import { betsApi } from "../api/bets.api";
import { useGameStore } from "./game.store";
import { useAuthStore } from "@/features/auth/model/auth.store";
import type { CreateBetDto, BetResponse } from "@/shared/types/api.types";
import { useGameAudio } from "./useGameAudio";

interface UsePlaceBetOptions {
    onError?: (err: Error) => void;
}

export function usePlaceBet({ onError }: UsePlaceBetOptions = {}) {
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const { enqueueVisualRound, playbackMode, setBetRequestInFlight } = useGameStore();
    const { playSound } = useGameAudio();

    return useMutation<BetResponse, Error, CreateBetDto>({
        mutationFn: betsApi.place,
        onMutate: () => {
            setBetRequestInFlight(true);
            playSound("bet-start");
        },
        onSuccess: (result) => {
            enqueueVisualRound(result, "manual");
            if (playbackMode === "normal") {
                playSound("ball-drop");
            }

            if (user) {
                setUser({ ...user, balance: result.balanceAfter });
            }
        },
        onError: (err) => {
            onError?.(err);
        },
        onSettled: () => {
            setBetRequestInFlight(false);
        },
    });
}

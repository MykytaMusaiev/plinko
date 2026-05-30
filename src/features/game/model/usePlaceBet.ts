import { useMutation } from "@tanstack/react-query";
import { betsApi } from "../api/bets.api";
import { useGameStore } from "./game.store";
import { useAuthStore } from "@/features/auth/model/auth.store";
import type { CreateBetDto, BetResponse } from "@/shared/types/api.types";

interface UsePlaceBetOptions {
    onError?: (err: Error) => void;
}

export function usePlaceBet({ onError }: UsePlaceBetOptions = {}) {
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const { enqueueVisualRound, setBetRequestInFlight } = useGameStore();

    return useMutation<BetResponse, Error, CreateBetDto>({
        mutationFn: betsApi.place,
        onMutate: () => {
            setBetRequestInFlight(true);
        },
        onSuccess: (result) => {
            enqueueVisualRound(result, "manual");

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

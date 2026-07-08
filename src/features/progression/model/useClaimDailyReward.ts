import { useMutation, useQueryClient } from "@tanstack/react-query";
import { progressionApi } from "../api/progression.api";
import { applyRewardClaimCacheUpdate } from "./rewardCache";
import type { ClaimRewardResponse } from "../types/progression.types";

export function useClaimDailyReward() {
    const queryClient = useQueryClient();

    return useMutation<ClaimRewardResponse, Error>({
        mutationFn: progressionApi.claimDaily,
        onSuccess: (result) => {
            applyRewardClaimCacheUpdate(queryClient, result);
        },
    });
}

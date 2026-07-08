import { useMutation, useQueryClient } from "@tanstack/react-query";
import { progressionApi } from "../api/progression.api";
import { applyRewardClaimCacheUpdate } from "./rewardCache";
import type { ClaimRewardResponse } from "../types/progression.types";

export function useClaimMissionReward() {
    const queryClient = useQueryClient();

    return useMutation<ClaimRewardResponse, Error, string>({
        mutationFn: progressionApi.claimMission,
        onSuccess: (result) => {
            applyRewardClaimCacheUpdate(queryClient, result);
        },
    });
}

import { useAuthStore } from "@/features/auth/model/auth.store";
import { profileQueryKeys } from "@/features/profile/model/queryKeys";
import type { QueryClient } from "@tanstack/react-query";
import type { ClaimRewardResponse } from "../types/progression.types";
import { progressionQueryKeys } from "./queryKeys";

export function applyRewardClaimCacheUpdate(
    queryClient: QueryClient,
    result: ClaimRewardResponse,
): void {
    queryClient.setQueryData(progressionQueryKeys.me, result.progression);
    void queryClient.invalidateQueries({ queryKey: profileQueryKeys.me });

    const { user, setUser } = useAuthStore.getState();

    if (user) {
        setUser({ ...user, balance: result.reward.balanceAfter });
    }
}

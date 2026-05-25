import { apiFetch } from "@/shared/lib/apiFetch";
import type {
    ClaimRewardResponse,
    ProgressionResponse,
} from "../types/progression.types";

const PROGRESSION_ME_API_PATH = "/api/progression/me";
const DAILY_CLAIM_API_PATH = "/api/progression/daily/claim";

export const progressionApi = {
    me: (): Promise<ProgressionResponse> =>
        apiFetch<ProgressionResponse>(PROGRESSION_ME_API_PATH),

    claimDaily: (): Promise<ClaimRewardResponse> =>
        apiFetch<ClaimRewardResponse>(DAILY_CLAIM_API_PATH, {
            method: "POST",
        }),

    claimMission: (id: string): Promise<ClaimRewardResponse> =>
        apiFetch<ClaimRewardResponse>(
            `/api/progression/missions/${encodeURIComponent(id)}/claim`,
            {
                method: "POST",
            },
        ),
};

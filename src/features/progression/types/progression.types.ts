export interface ProgressionRewardResponse {
    credits: string;
    xp: number;
}

export interface ProgressionDailyResponse {
    reward: ProgressionRewardResponse;
    canClaim: boolean;
    streak: number;
    nextClaimAt: string;
}

export interface ProgressionMissionResponse {
    creditReward: string;
    id: string | null;
    key: string;
    type: unknown;
    title: string;
    description: string;
    periodKey: string;
    target: number;
    progress: number;
    status: unknown;
    xpReward: number;
    claimable: boolean;
    completedAt: string | null;
    claimedAt: string | null;
}

export interface ProgressionMissionsResponse {
    daily: ProgressionMissionResponse[];
    starter: ProgressionMissionResponse[];
}

export interface ProgressionResponse {
    daily: ProgressionDailyResponse;
    missions: ProgressionMissionsResponse;
    level: number;
    xp: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpIntoCurrentLevel: number;
}

export type RewardSource = "DAILY_BONUS" | "MISSION";

export interface ClaimedRewardResponse {
    source: RewardSource;
    missionId?: string;
    missionKey?: string;
    credits: string;
    balanceAfter: string;
    sourceKey: string;
    periodKey: string;
    xp: number;
    levelBefore: number;
    levelAfter: number;
}

export interface ClaimRewardResponse {
    reward: ClaimedRewardResponse;
    progression: ProgressionResponse;
}

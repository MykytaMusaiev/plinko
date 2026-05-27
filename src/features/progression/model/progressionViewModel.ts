import { formatCredits } from "@/shared/lib/bigint";
import type {
    ProgressionDailyResponse,
    ProgressionMissionResponse,
    ProgressionResponse,
} from "../types/progression.types";

export type DailyClaimState = "claimable" | "pending" | "later";
export type MissionClaimState =
    | "claimable"
    | "pending"
    | "claimed"
    | "incomplete"
    | "unavailable";

export interface LevelProgressViewModel {
    level: number;
    totalXp: number;
    xpIntoCurrentLevel: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpToNextLevel: number;
    levelProgressTotal: number;
    levelProgressPercent: number;
}

export interface DailyRewardViewModel {
    credits: string;
    xp: number;
    streak: number;
    canClaim: boolean;
    nextClaimAt: string;
    nextClaimLabel: string;
}

export interface MissionViewModel {
    id: string | null;
    key: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    progressLabel: string;
    progressPercent: number;
    percentLabel: string;
    creditReward: string;
    xpReward: number;
    claimable: boolean;
    claimedAt: string | null;
}

export function clampPercent(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, value));
}

export function getLevelProgressTotal(
    progression: Pick<ProgressionResponse, "xpForCurrentLevel" | "xpForNextLevel">,
): number {
    return Math.max(
        0,
        progression.xpForNextLevel - progression.xpForCurrentLevel,
    );
}

export function getLevelProgressPercent(
    progression: Pick<
        ProgressionResponse,
        "xpForCurrentLevel" | "xpForNextLevel" | "xpIntoCurrentLevel"
    >,
): number {
    const total = getLevelProgressTotal(progression);
    if (total <= 0) return 100;

    return clampPercent((progression.xpIntoCurrentLevel / total) * 100);
}

export function toLevelProgressViewModel(
    progression: ProgressionResponse,
): LevelProgressViewModel {
    const levelProgressTotal = getLevelProgressTotal(progression);
    const levelProgressPercent = getLevelProgressPercent(progression);
    const xpToNextLevel = Math.max(
        0,
        levelProgressTotal - progression.xpIntoCurrentLevel,
    );

    return {
        level: progression.level,
        totalXp: progression.xp,
        xpIntoCurrentLevel: progression.xpIntoCurrentLevel,
        xpForCurrentLevel: progression.xpForCurrentLevel,
        xpForNextLevel: progression.xpForNextLevel,
        xpToNextLevel,
        levelProgressTotal,
        levelProgressPercent,
    };
}

export function formatNextClaimAt(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Available later";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function toDailyRewardViewModel(
    daily: ProgressionDailyResponse,
): DailyRewardViewModel {
    return {
        credits: formatCredits(daily.reward.credits),
        xp: daily.reward.xp,
        streak: daily.streak,
        canClaim: daily.canClaim,
        nextClaimAt: daily.nextClaimAt,
        nextClaimLabel: daily.canClaim
            ? "Available now"
            : formatNextClaimAt(daily.nextClaimAt),
    };
}

export function getMissionProgressPercent(
    mission: Pick<ProgressionMissionResponse, "progress" | "target">,
): number {
    if (mission.target <= 0) return 100;
    return clampPercent((mission.progress / mission.target) * 100);
}

export function toMissionViewModel(
    mission: ProgressionMissionResponse,
): MissionViewModel {
    const progressPercent = getMissionProgressPercent(mission);

    return {
        id: mission.id,
        key: mission.key,
        title: mission.title,
        description: mission.description,
        progress: mission.progress,
        target: mission.target,
        progressLabel: `${mission.progress} / ${mission.target}`,
        progressPercent,
        percentLabel: `${Math.round(progressPercent)}%`,
        creditReward: formatCredits(mission.creditReward),
        xpReward: mission.xpReward,
        claimable: mission.claimable,
        claimedAt: mission.claimedAt,
    };
}

export function getDailyClaimState(
    daily: Pick<DailyRewardViewModel, "canClaim">,
    isPending: boolean,
): DailyClaimState {
    if (isPending) return "pending";
    if (daily.canClaim) return "claimable";
    return "later";
}

export function getDailyClaimLabel(state: DailyClaimState): string {
    if (state === "pending") return "Claiming...";
    if (state === "claimable") return "Claim";
    return "Available later";
}

export function getMissionClaimState(
    mission: Pick<MissionViewModel, "id" | "claimable" | "claimedAt">,
    pendingMissionId: string | null,
): MissionClaimState {
    if (mission.id && pendingMissionId === mission.id) return "pending";
    if (mission.claimedAt !== null) return "claimed";
    if (mission.claimable && mission.id) return "claimable";
    if (mission.claimable && !mission.id) return "unavailable";
    return "incomplete";
}

export function getMissionClaimLabel(state: MissionClaimState): string {
    if (state === "pending") return "Claiming...";
    if (state === "claimed") return "Claimed";
    if (state === "claimable") return "Claim";
    if (state === "unavailable") return "Unavailable";
    return "In progress";
}

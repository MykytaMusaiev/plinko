import type { ProfileProgressionSummary } from "../types/profile.types";

export function getAvatarInitial(nickname: string, email: string): string {
    const source = nickname.trim() || email.trim();
    return source.charAt(0).toUpperCase() || "P";
}

export function getLevelProgressTotal(
    progression: ProfileProgressionSummary,
): number {
    return Math.max(
        0,
        progression.xpForNextLevel - progression.xpForCurrentLevel,
    );
}

export function getLevelProgressPercent(
    progression: ProfileProgressionSummary,
): number {
    const total = getLevelProgressTotal(progression);
    if (total <= 0) return 100;

    const percent = (progression.xpIntoCurrentLevel / total) * 100;
    return Math.min(100, Math.max(0, percent));
}

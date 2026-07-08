export interface ProfileProgressionSummary {
    level: number;
    xp: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpIntoCurrentLevel: number;
    dailyStreak: number;
}

export interface ProfileResponse {
    id: string;
    email: string;
    nickname: string;
    avatarUrl: string | null;
    balance: string;
    progression: ProfileProgressionSummary;
}

export interface UpdateProfileDto {
    nickname: string;
}

export type AvatarUploadResponse = ProfileResponse;

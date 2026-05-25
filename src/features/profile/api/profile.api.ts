import { apiFetch } from "@/shared/lib/apiFetch";
import type {
    AvatarUploadResponse,
    ProfileResponse,
    UpdateProfileDto,
} from "../types/profile.types";

const PROFILE_ME_API_PATH = "/api/profile/me";
const PROFILE_AVATAR_API_PATH = "/api/profile/avatar";
const AVATAR_IMAGE_FIELD = "image";

export const profileApi = {
    me: (): Promise<ProfileResponse> =>
        apiFetch<ProfileResponse>(PROFILE_ME_API_PATH),

    updateMe: (dto: UpdateProfileDto): Promise<ProfileResponse> =>
        apiFetch<ProfileResponse>(PROFILE_ME_API_PATH, {
            method: "PATCH",
            body: JSON.stringify(dto),
        }),

    uploadAvatar: (image: File): Promise<AvatarUploadResponse> => {
        const formData = new FormData();
        formData.set(AVATAR_IMAGE_FIELD, image);

        return apiFetch<AvatarUploadResponse>(PROFILE_AVATAR_API_PATH, {
            method: "POST",
            body: formData,
        });
    },
};

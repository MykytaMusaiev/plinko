import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { profileQueryKeys } from "./queryKeys";
import type {
    AvatarUploadResponse,
    ProfileResponse,
} from "../types/profile.types";

export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation<AvatarUploadResponse, Error, File>({
        mutationFn: profileApi.uploadAvatar,
        onSuccess: (profile) => {
            queryClient.setQueryData<ProfileResponse>(
                profileQueryKeys.me,
                profile,
            );
        },
    });
}

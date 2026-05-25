import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { profileQueryKeys } from "./queryKeys";
import type {
    ProfileResponse,
    UpdateProfileDto,
} from "../types/profile.types";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation<ProfileResponse, Error, UpdateProfileDto>({
        mutationFn: profileApi.updateMe,
        onSuccess: (profile) => {
            queryClient.setQueryData(profileQueryKeys.me, profile);
        },
    });
}

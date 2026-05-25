import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { profileQueryKeys } from "./queryKeys";
import type { ProfileResponse } from "../types/profile.types";

export function useProfile() {
    return useQuery<ProfileResponse>({
        queryKey: profileQueryKeys.me,
        queryFn: profileApi.me,
    });
}

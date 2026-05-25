import { useQuery } from "@tanstack/react-query";
import { progressionApi } from "../api/progression.api";
import { progressionQueryKeys } from "./queryKeys";
import type { ProgressionResponse } from "../types/progression.types";

export function useProgression() {
    return useQuery<ProgressionResponse>({
        queryKey: progressionQueryKeys.me,
        queryFn: progressionApi.me,
    });
}

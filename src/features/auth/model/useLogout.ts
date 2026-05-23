"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "./auth.store";

interface UseLogoutOptions {
    onUnexpectedError?: () => void;
}

export function useLogout({ onUnexpectedError }: UseLogoutOptions = {}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const clearSession = useAuthStore((state) => state.clear);

    return useMutation<void, Error>({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearSession();
            queryClient.clear();
            router.replace("/login");
        },
        onError: () => {
            onUnexpectedError?.();
        },
    });
}

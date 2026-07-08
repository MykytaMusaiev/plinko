"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "./auth.store";
import { ApiError } from "@/shared/lib/apiFetch";

interface LoginVariables {
    email: string;
    password: string;
}

interface UseLoginOptions {
    onInvalidCredentials: () => void;
    onUnexpectedError: () => void;
}

export function useLogin({
    onInvalidCredentials,
    onUnexpectedError,
}: UseLoginOptions) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation<void, Error, LoginVariables>({
        mutationFn: async ({ email, password }) => {
            const data = await authApi.login(email, password);
            setSession(data);
        },
        onSuccess: () => {
            router.push(searchParams.get("from") ?? "/game");
        },
        onError: (err) => {
            if (err instanceof ApiError && err.statusCode === 401) {
                onInvalidCredentials();
            } else {
                onUnexpectedError();
            }
        },
    });
}

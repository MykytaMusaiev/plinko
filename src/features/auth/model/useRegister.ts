"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "./auth.store";
import { ApiError } from "@/shared/lib/apiFetch";

interface RegisterVariables {
    email: string;
    password: string;
}

interface UseRegisterOptions {
    onEmailTaken: () => void;
    onUnexpectedError: () => void;
}

export function useRegister({
    onEmailTaken,
    onUnexpectedError,
}: UseRegisterOptions) {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation<void, Error, RegisterVariables>({
        mutationFn: async ({ email, password }) => {
            const data = await authApi.register(email, password);
            setAuth(data);
        },
        onSuccess: () => {
            router.push("/game");
        },
        onError: (err) => {
            if (err instanceof ApiError && err.statusCode === 409) {
                onEmailTaken();
            } else {
                onUnexpectedError();
            }
        },
    });
}

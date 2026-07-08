import { apiFetch } from "@/shared/lib/apiFetch";
import type { AuthSessionResponse } from "@/shared/types/api.types";

export const authApi = {
    login: (email: string, password: string) =>
        apiFetch<AuthSessionResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    register: (email: string, password: string) =>
        apiFetch<AuthSessionResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    logout: () =>
        apiFetch<void>("/api/auth/logout", {
            method: "POST",
        }),

    session: () => apiFetch<AuthSessionResponse>("/api/auth/session"),
};

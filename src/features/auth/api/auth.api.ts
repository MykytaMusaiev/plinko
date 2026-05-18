import { apiFetch } from "@/shared/lib/apiFetch";
import type { BffAuthResponse } from "@/shared/types/api.types";

export const authApi = {
    login: (email: string, password: string) =>
        apiFetch<BffAuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    register: (email: string, password: string) =>
        apiFetch<BffAuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    logout: (accessToken: string) =>
        apiFetch<void>("/api/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
        }),
};

import { create } from "zustand";
import type { UserMe, BffAuthResponse } from "@/shared/types/api.types";

interface AuthState {
    user: UserMe | null;
    accessToken: string | null;
    isHydrated: boolean;

    setUser: (user: UserMe) => void;
    setAccessToken: (token: string) => void;
    setAuth: (data: BffAuthResponse) => void;
    clear: () => void;
    hydrateFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isHydrated: false,

    setUser: (user) => set({ user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setAuth: ({ accessToken, user }) => set({ accessToken, user }),

    clear: () => set({ user: null, accessToken: null }),

    hydrateFromStorage: async () => {
        try {
            // BFF reads the httpOnly refreshToken cookie — no JS token needed here
            const res = await fetch("/api/auth/refresh", { method: "POST" });
            if (!res.ok) throw new Error("No session");
            const data: BffAuthResponse = await res.json();
            set({
                accessToken: data.accessToken,
                user: data.user,
                isHydrated: true,
            });
        } catch {
            set({ isHydrated: true });
        }
    },
}));

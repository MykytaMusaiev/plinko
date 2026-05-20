import { create } from "zustand";
import type { AuthSessionResponse, UserMe } from "@/shared/types/api.types";

interface AuthState {
    user: UserMe | null;
    isHydrated: boolean;

    setUser: (user: UserMe) => void;
    setSession: (data: AuthSessionResponse) => void;
    clear: () => void;
    hydrateFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isHydrated: false,

    setUser: (user) => set({ user }),
    setSession: ({ user }) => set({ user }),

    clear: () => set({ user: null }),

    hydrateFromStorage: async () => {
        try {
            const response = await fetch("/api/auth/session", {
                method: "GET",
                credentials: "same-origin",
            });

            if (!response.ok) {
                throw new Error("No active session");
            }

            const data: AuthSessionResponse = await response.json();

            set({
                user: data.user,
                isHydrated: true,
            });
        } catch {
            set({
                user: null,
                isHydrated: true,
            });
        }
    },
}));

import { create } from "zustand";
import type { BetResponse } from "@/shared/types/api.types";

const MAX_RECENT_RESULTS = 20;

interface GameState {
    isPlaying: boolean;
    recentResults: BetResponse[];

    setPlaying: (value: boolean) => void;
    addResult: (result: BetResponse) => void;
    clearResults: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    isPlaying: false,
    recentResults: [],

    setPlaying: (value) => set({ isPlaying: value }),

    addResult: (result) =>
        set((state) => ({
            recentResults: [result, ...state.recentResults].slice(
                0,
                MAX_RECENT_RESULTS,
            ),
        })),

    clearResults: () => set({ recentResults: [] }),
}));

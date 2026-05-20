import { create } from "zustand";
import type { BetResponse, Risk } from "@/shared/types/api.types";
import { MIN_BET } from "@/shared/lib/bigint";

export type GameMode = "manual" | "auto";

interface GameState {
    mode: GameMode;
    isPlaying: boolean;
    recentResults: BetResponse[];
    lastResult: BetResponse | null;
    winningBucketIndex: number | null;

    // Bet controls state — shared with MultiplierBar for hover tooltip
    betAmount: bigint;
    risk: Risk;
    selectedRows: number;

    setMode: (mode: GameMode) => void;
    setPlaying: (value: boolean) => void;
    addResult: (result: BetResponse) => void;
    setLastResult: (result: BetResponse | null) => void;
    setWinningBucketIndex: (idx: number | null) => void;
    setBetAmount: (amount: bigint) => void;
    setRisk: (risk: Risk) => void;
    setSelectedRows: (rows: number) => void;
    clearResults: () => void;
}

const MAX_RECENT = 20;

export const useGameStore = create<GameState>((set) => ({
    mode: "manual",
    isPlaying: false,
    recentResults: [],
    lastResult: null,
    winningBucketIndex: null,

    betAmount: MIN_BET,
    risk: "LOW",
    selectedRows: 8,

    setMode: (mode) => set({ mode }),
    setPlaying: (isPlaying) => set({ isPlaying }),
    addResult: (result) =>
        set((s) => ({
            recentResults: [result, ...s.recentResults].slice(0, MAX_RECENT),
        })),
    setLastResult: (lastResult) => set({ lastResult }),
    setWinningBucketIndex: (winningBucketIndex) => set({ winningBucketIndex }),
    setBetAmount: (betAmount) => set({ betAmount }),
    setRisk: (risk) => set({ risk }),
    setSelectedRows: (selectedRows) => set({ selectedRows }),
    clearResults: () => set({ recentResults: [] }),
}));

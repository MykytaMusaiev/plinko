import { create } from "zustand";
import type { BetResponse, Risk } from "@/shared/types/api.types";
import { MIN_BET } from "@/shared/lib/bigint";

export type GameMode = "manual" | "auto";
export type PlaybackMode = "normal" | "fast";

interface GameState {
    mode: GameMode;
    playbackMode: PlaybackMode;
    isPlaying: boolean;
    recentResults: BetResponse[];
    lastResult: BetResponse | null;
    winningBucketIndex: number | null;
    revealedBetId: string | null;

    // Bet controls state — shared with MultiplierBar for hover tooltip
    betAmount: bigint;
    risk: Risk;
    selectedRows: number;

    setMode: (mode: GameMode) => void;
    setPlaybackMode: (mode: PlaybackMode) => void;
    setPlaying: (value: boolean) => void;
    addResult: (result: BetResponse) => void;
    setLastResult: (result: BetResponse | null) => void;
    setWinningBucketIndex: (idx: number | null) => void;
    startRound: (result: BetResponse) => void;
    completeRound: (result: BetResponse) => boolean;
    clearReveal: (betId: string) => void;
    setBetAmount: (amount: bigint) => void;
    setRisk: (risk: Risk) => void;
    setSelectedRows: (rows: number) => void;
    clearResults: () => void;
}

const MAX_RECENT = 20;
export const REVEAL_MS = 600;

export const useGameStore = create<GameState>((set, get) => ({
    mode: "manual",
    playbackMode: "normal",
    isPlaying: false,
    recentResults: [],
    lastResult: null,
    winningBucketIndex: null,
    revealedBetId: null,

    betAmount: MIN_BET,
    risk: "LOW",
    selectedRows: 8,

    setMode: (mode) => set({ mode }),
    setPlaybackMode: (playbackMode) => set({ playbackMode }),
    setPlaying: (isPlaying) => set({ isPlaying }),
    addResult: (result) =>
        set((s) => ({
            recentResults: [result, ...s.recentResults].slice(0, MAX_RECENT),
        })),
    setLastResult: (lastResult) => set({ lastResult }),
    setWinningBucketIndex: (winningBucketIndex) => set({ winningBucketIndex }),
    startRound: (result) =>
        set((s) => ({
            recentResults: [result, ...s.recentResults].slice(0, MAX_RECENT),
            lastResult: result,
            isPlaying: true,
            winningBucketIndex: null,
            revealedBetId: null,
        })),
    completeRound: (result) => {
        const state = get();

        if (!state.isPlaying || state.lastResult?.betId !== result.betId) {
            return false;
        }

        set({
            winningBucketIndex: result.bucketIndex,
            revealedBetId: result.betId,
            isPlaying: false,
            lastResult: null,
        });

        return true;
    },
    clearReveal: (betId) =>
        set((s) =>
            s.revealedBetId === betId
                ? { winningBucketIndex: null, revealedBetId: null }
                : s,
        ),
    setBetAmount: (betAmount) => set({ betAmount }),
    setRisk: (risk) => set({ risk }),
    setSelectedRows: (selectedRows) => set({ selectedRows }),
    clearResults: () => set({ recentResults: [] }),
}));

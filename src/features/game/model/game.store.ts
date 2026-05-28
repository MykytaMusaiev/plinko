import { create } from "zustand";
import type { BetResponse, Risk } from "@/shared/types/api.types";
import { MIN_BET } from "@/shared/lib/bigint";
import { clampAutoBetCount } from "./autoMode.utils";
import type {
    AutoRuntime,
    AutoSettings,
    AutoStopReason,
    AutoRunStatus,
} from "./autoMode.types";

export type GameMode = "manual" | "auto";
export type PlaybackMode = "normal" | "fast";
export type VisualRoundStatus = "active" | "revealed";

export interface VisualRound {
    roundId: string;
    result: BetResponse;
    status: VisualRoundStatus;
    createdAt: number;
    completedAt: number | null;
}

export interface VisualReveal {
    roundId: string;
    betId: string;
    bucketIndex: number;
}

interface GameState {
    mode: GameMode;
    playbackMode: PlaybackMode;
    isBetRequestInFlight: boolean;
    activeVisualRounds: VisualRound[];
    latestReveal: VisualReveal | null;
    recentResults: BetResponse[];
    autoSettings: AutoSettings;
    autoRuntime: AutoRuntime;

    // Bet controls state — shared with MultiplierBar for hover tooltip
    betAmount: bigint;
    risk: Risk;
    selectedRows: number;

    setMode: (mode: GameMode) => void;
    setPlaybackMode: (mode: PlaybackMode) => void;
    setBetRequestInFlight: (value: boolean) => void;
    enqueueVisualRound: (result: BetResponse) => VisualRound;
    completeVisualRound: (roundId: string) => boolean;
    pruneVisualRound: (roundId: string) => void;
    clearReveal: (roundId: string) => void;
    setBetAmount: (amount: bigint) => void;
    setRisk: (risk: Risk) => void;
    setSelectedRows: (rows: number) => void;
    setAutoNumberOfBets: (value: number) => void;
    setAutoStopOnProfit: (value: string) => void;
    setAutoStopOnLoss: (value: string) => void;
    startAutoRun: (input: {
        targetCount: number;
        startedBalance: string;
        baseBetAmount: bigint;
    }) => void;
    markAutoRequestStarted: (amount: bigint) => void;
    markAutoResultResolved: () => void;
    setAutoCurrentBetAmount: (amount: bigint) => void;
    setAutoStatus: (status: AutoRunStatus) => void;
    finishAutoRun: (reason: AutoStopReason, lastError?: string | null) => void;
    resetAutoRuntime: () => void;
    clearResults: () => void;
}

const MAX_RECENT = 20;
export const REVEAL_MS = 600;
const DEFAULT_AUTO_SETTINGS: AutoSettings = {
    numberOfBets: 10,
    stopOnProfit: "0.00",
    stopOnLoss: "0.00",
};

const DEFAULT_AUTO_RUNTIME: AutoRuntime = {
    status: "idle",
    requestedCount: 0,
    resolvedCount: 0,
    targetCount: 0,
    startedBalance: null,
    baseBetAmount: null,
    currentBetAmount: null,
    stopReason: null,
    lastError: null,
};

export const useGameStore = create<GameState>((set, get) => ({
    mode: "manual",
    playbackMode: "normal",
    isBetRequestInFlight: false,
    activeVisualRounds: [],
    latestReveal: null,
    recentResults: [],
    autoSettings: DEFAULT_AUTO_SETTINGS,
    autoRuntime: DEFAULT_AUTO_RUNTIME,

    betAmount: MIN_BET,
    risk: "LOW",
    selectedRows: 8,

    setMode: (mode) => set({ mode }),
    setPlaybackMode: (playbackMode) => set({ playbackMode }),
    setBetRequestInFlight: (isBetRequestInFlight) => set({ isBetRequestInFlight }),
    enqueueVisualRound: (result) => {
        const round: VisualRound = {
            roundId: `${result.betId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            result,
            status: "active",
            createdAt: Date.now(),
            completedAt: null,
        };

        set((s) => ({
            activeVisualRounds: [...s.activeVisualRounds, round],
            recentResults: [result, ...s.recentResults].slice(0, MAX_RECENT),
        }));

        return round;
    },
    completeVisualRound: (roundId) => {
        const state = get();
        const round = state.activeVisualRounds.find((item) => item.roundId === roundId);

        if (!round || round.status !== "active") {
            return false;
        }

        set((s) => ({
            activeVisualRounds: s.activeVisualRounds.map((item) =>
                item.roundId === roundId
                    ? { ...item, status: "revealed", completedAt: Date.now() }
                    : item,
            ),
            latestReveal: {
                roundId,
                betId: round.result.betId,
                bucketIndex: round.result.bucketIndex,
            },
        }));

        return true;
    },
    pruneVisualRound: (roundId) =>
        set((s) => ({
            activeVisualRounds: s.activeVisualRounds.filter(
                (round) => round.roundId !== roundId,
            ),
            latestReveal:
                s.latestReveal?.roundId === roundId ? null : s.latestReveal,
        })),
    clearReveal: (roundId) =>
        set((s) => ({
            latestReveal: s.latestReveal?.roundId === roundId ? null : s.latestReveal,
        })),
    setBetAmount: (betAmount) => set({ betAmount }),
    setRisk: (risk) => set({ risk }),
    setSelectedRows: (selectedRows) => set({ selectedRows }),
    setAutoNumberOfBets: (numberOfBets) =>
        set((s) => ({
            autoSettings: {
                ...s.autoSettings,
                numberOfBets: clampAutoBetCount(numberOfBets),
            },
        })),
    setAutoStopOnProfit: (stopOnProfit) =>
        set((s) => ({
            autoSettings: {
                ...s.autoSettings,
                stopOnProfit,
            },
        })),
    setAutoStopOnLoss: (stopOnLoss) =>
        set((s) => ({
            autoSettings: {
                ...s.autoSettings,
                stopOnLoss,
            },
        })),
    startAutoRun: ({ targetCount, startedBalance, baseBetAmount }) =>
        set({
            autoRuntime: {
                status: "running",
                requestedCount: 0,
                resolvedCount: 0,
                targetCount,
                startedBalance,
                baseBetAmount,
                currentBetAmount: baseBetAmount,
                stopReason: null,
                lastError: null,
            },
        }),
    markAutoRequestStarted: (amount) =>
        set((s) => ({
            autoRuntime: {
                ...s.autoRuntime,
                requestedCount: s.autoRuntime.requestedCount + 1,
                currentBetAmount: amount,
            },
        })),
    markAutoResultResolved: () =>
        set((s) => ({
            autoRuntime: {
                ...s.autoRuntime,
                resolvedCount: s.autoRuntime.resolvedCount + 1,
            },
        })),
    setAutoCurrentBetAmount: (currentBetAmount) =>
        set((s) => ({
            autoRuntime: {
                ...s.autoRuntime,
                currentBetAmount,
            },
        })),
    setAutoStatus: (status) =>
        set((s) => ({
            autoRuntime: {
                ...s.autoRuntime,
                status,
            },
        })),
    finishAutoRun: (reason, lastError = null) =>
        set((s) => ({
            autoRuntime: {
                ...s.autoRuntime,
                status: reason === "request_error" ? "error" : "completed",
                stopReason: reason,
                lastError,
            },
        })),
    resetAutoRuntime: () =>
        set({
            autoRuntime: DEFAULT_AUTO_RUNTIME,
        }),
    clearResults: () => set({ recentResults: [] }),
}));

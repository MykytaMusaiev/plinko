import { useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { betsApi } from "../api/bets.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import type { BetResponse, CreateBetDto, GameConfig } from "@/shared/types/api.types";
import { getAutoRequestPaceMs } from "../lib/visualPlaybackPolicy";
import {
    clampBetAmount,
    getAutoStopReason,
    parseOptionalCreditInput,
} from "./autoMode.utils";
import { useGameStore } from "./game.store";
import type { AutoStartInput, AutoStopReason } from "./autoMode.types";
import { useGameAudio } from "./useGameAudio";

interface UseAutoModeInput {
    config: GameConfig;
    onError?: (err: Error) => void;
}

function wait(ms: number): Promise<void> {
    if (ms <= 0) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

export function useAutoMode({ config, onError }: UseAutoModeInput) {
    const loopActiveRef = useRef(false);
    const stopRequestedRef = useRef(false);
    const autoStopSoundPlayedRef = useRef(false);
    const setUser = useAuthStore((s) => s.setUser);
    const autoRuntime = useGameStore((s) => s.autoRuntime);
    const { playSound } = useGameAudio();
    const mutation = useMutation<BetResponse, Error, CreateBetDto>({
        mutationFn: betsApi.place,
    });

    const configMin = config.minBet ? BigInt(config.minBet) : 0n;
    const configMax = config.maxBet ? BigInt(config.maxBet) : null;

    const finishAutoRunWithSound = useCallback(
        (
            state: ReturnType<typeof useGameStore.getState>,
            reason: AutoStopReason,
            lastError?: string | null,
        ) => {
            state.finishAutoRun(reason, lastError);

            if (!autoStopSoundPlayedRef.current) {
                playSound("auto-stop");
                autoStopSoundPlayedRef.current = true;
            }
        },
        [playSound],
    );

    const stopAuto = useCallback(() => {
        stopRequestedRef.current = true;

        const state = useGameStore.getState();

        if (state.autoRuntime.status !== "running") {
            return;
        }

        if (state.isBetRequestInFlight) {
            state.setAutoStatus("stopping");
            return;
        }

        finishAutoRunWithSound(state, "stopped_by_user");
    }, [finishAutoRunWithSound]);

    const startAuto = useCallback(
        ({ amount, rows, risk }: AutoStartInput): boolean => {
            const initialState = useGameStore.getState();
            const user = useAuthStore.getState().user;

            if (
                loopActiveRef.current ||
                initialState.isBetRequestInFlight ||
                initialState.autoRuntime.status === "running" ||
                initialState.autoRuntime.status === "stopping"
            ) {
                return false;
            }

            if (!user) {
                const error = new Error("No active session");
                onError?.(error);
                return false;
            }

            const maxBet = configMax ?? BigInt(user.balance);
            const baseBetAmount = clampBetAmount(amount, configMin, maxBet);
            const startedBalance = BigInt(user.balance);

            try {
                parseOptionalCreditInput(initialState.autoSettings.stopOnProfit);
                parseOptionalCreditInput(initialState.autoSettings.stopOnLoss);
            } catch {
                const error = new Error("Check stop profit/loss values");
                onError?.(error);
                return false;
            }

            initialState.startAutoRun({
                targetCount: initialState.autoSettings.numberOfBets,
                startedBalance: user.balance,
                baseBetAmount,
            });

            loopActiveRef.current = true;
            stopRequestedRef.current = false;
            autoStopSoundPlayedRef.current = false;
            playSound("auto-start");
            let currentBetAmount = baseBetAmount;

            const runAutoLoop = async () => {
                try {
                    while (true) {
                        const state = useGameStore.getState();
                        const runtime = state.autoRuntime;

                        if (
                            stopRequestedRef.current ||
                            runtime.status === "stopping"
                        ) {
                            finishAutoRunWithSound(state, "stopped_by_user");
                            break;
                        }

                        if (runtime.resolvedCount >= runtime.targetCount) {
                            finishAutoRunWithSound(state, "completed");
                            break;
                        }

                        const currentUser = useAuthStore.getState().user;
                        const currentBalance = BigInt(
                            currentUser?.balance ?? runtime.startedBalance ?? "0",
                        );

                        if (currentBetAmount > currentBalance) {
                            finishAutoRunWithSound(state, "insufficient_balance");
                            break;
                        }

                        state.markAutoRequestStarted(currentBetAmount);
                        state.setBetRequestInFlight(true);

                        let result: BetResponse;

                        try {
                            result = await mutation.mutateAsync({
                                amount: Number(currentBetAmount),
                                rows,
                                risk,
                            });
                        } finally {
                            useGameStore.getState().setBetRequestInFlight(false);
                        }

                        const latestUser = useAuthStore.getState().user;

                        state.enqueueVisualRound(result, "auto");
                        if (latestUser) {
                            setUser({ ...latestUser, balance: result.balanceAfter });
                        }

                        state.markAutoResultResolved();

                        const nextState = useGameStore.getState();
                        const resolvedCount = nextState.autoRuntime.resolvedCount;
                        const stopReason = getAutoStopReason({
                            settings: nextState.autoSettings,
                            startedBalance,
                            balanceAfter: BigInt(result.balanceAfter),
                        });

                        if (stopReason) {
                            finishAutoRunWithSound(nextState, stopReason);
                            break;
                        }

                        if (stopRequestedRef.current) {
                            finishAutoRunWithSound(nextState, "stopped_by_user");
                            break;
                        }

                        if (resolvedCount >= nextState.autoRuntime.targetCount) {
                            finishAutoRunWithSound(nextState, "completed");
                            break;
                        }

                        currentBetAmount = baseBetAmount;
                        nextState.setAutoCurrentBetAmount(currentBetAmount);

                        await wait(getAutoRequestPaceMs(nextState.playbackMode));
                    }
                } catch (err) {
                    const error = err instanceof Error ? err : new Error("Auto bet failed");
                    finishAutoRunWithSound(
                        useGameStore.getState(),
                        "request_error",
                        error.message,
                    );
                    onError?.(error);
                } finally {
                    loopActiveRef.current = false;
                    stopRequestedRef.current = false;
                    useGameStore.getState().setBetRequestInFlight(false);
                }
            };

            void runAutoLoop();

            return true;
        },
        [configMax, configMin, finishAutoRunWithSound, mutation, onError, playSound, setUser],
    );

    useEffect(() => {
        return () => {
            stopRequestedRef.current = true;
        };
    }, []);

    return {
        startAuto,
        stopAuto,
        isAutoActive:
            autoRuntime.status === "running" || autoRuntime.status === "stopping",
        isAutoRequestPending: mutation.isPending,
    };
}

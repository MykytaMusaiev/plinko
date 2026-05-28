import { useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { betsApi } from "../api/bets.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import type { BetResponse, CreateBetDto, GameConfig } from "@/shared/types/api.types";
import {
    clampBetAmount,
    getAutoStopReason,
    parseOptionalCreditInput,
} from "./autoMode.utils";
import { useGameStore } from "./game.store";
import type { AutoStartInput } from "./autoMode.types";

interface UseAutoModeInput {
    config: GameConfig;
    onError?: (err: Error) => void;
}

export function useAutoMode({ config, onError }: UseAutoModeInput) {
    const loopActiveRef = useRef(false);
    const stopRequestedRef = useRef(false);
    const setUser = useAuthStore((s) => s.setUser);
    const autoRuntime = useGameStore((s) => s.autoRuntime);
    const mutation = useMutation<BetResponse, Error, CreateBetDto>({
        mutationFn: betsApi.place,
    });

    const configMin = config.minBet ? BigInt(config.minBet) : 0n;
    const configMax = config.maxBet ? BigInt(config.maxBet) : null;

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

        state.finishAutoRun("stopped_by_user");
    }, []);

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
                            state.finishAutoRun("stopped_by_user");
                            break;
                        }

                        if (runtime.resolvedCount >= runtime.targetCount) {
                            state.finishAutoRun("completed");
                            break;
                        }

                        const currentUser = useAuthStore.getState().user;
                        const currentBalance = BigInt(
                            currentUser?.balance ?? runtime.startedBalance ?? "0",
                        );

                        if (currentBetAmount > currentBalance) {
                            state.finishAutoRun("insufficient_balance");
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

                        state.enqueueVisualRound(result);
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
                            nextState.finishAutoRun(stopReason);
                            break;
                        }

                        if (stopRequestedRef.current) {
                            nextState.finishAutoRun("stopped_by_user");
                            break;
                        }

                        if (resolvedCount >= nextState.autoRuntime.targetCount) {
                            nextState.finishAutoRun("completed");
                            break;
                        }

                        currentBetAmount = baseBetAmount;
                        nextState.setAutoCurrentBetAmount(currentBetAmount);

                        await Promise.resolve();
                    }
                } catch (err) {
                    const error = err instanceof Error ? err : new Error("Auto bet failed");
                    useGameStore.getState().finishAutoRun("request_error", error.message);
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
        [configMax, configMin, mutation, onError, setUser],
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

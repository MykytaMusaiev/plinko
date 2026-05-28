import type { Risk } from "@/shared/types/api.types";

export type AutoRunStatus = "idle" | "running" | "stopping" | "completed" | "error";

export type AutoStopReason =
    | "completed"
    | "stopped_by_user"
    | "stop_on_profit"
    | "stop_on_loss"
    | "insufficient_balance"
    | "request_error";

export interface AutoSettings {
    numberOfBets: number;
    stopOnProfit: string;
    stopOnLoss: string;
}

export interface AutoRuntime {
    status: AutoRunStatus;
    requestedCount: number;
    resolvedCount: number;
    targetCount: number;
    startedBalance: string | null;
    baseBetAmount: bigint | null;
    currentBetAmount: bigint | null;
    stopReason: AutoStopReason | null;
    lastError: string | null;
}

export interface AutoStartInput {
    amount: bigint;
    rows: number;
    risk: Risk;
}

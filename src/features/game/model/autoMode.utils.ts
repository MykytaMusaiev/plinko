import { parseCredits } from "@/shared/lib/bigint";
import type {
    AutoSettings,
    AutoStopReason,
} from "./autoMode.types";

export const AUTO_BET_COUNT_MIN = 1;
export const AUTO_BET_COUNT_MAX = 1000;

export function clampAutoBetCount(value: number): number {
    if (!Number.isFinite(value)) return AUTO_BET_COUNT_MIN;

    return Math.min(
        Math.max(Math.trunc(value), AUTO_BET_COUNT_MIN),
        AUTO_BET_COUNT_MAX,
    );
}

export function parseOptionalCreditInput(value: string): bigint {
    const trimmed = value.trim();

    if (!trimmed) return 0n;

    return parseCredits(trimmed);
}

export function clampBetAmount(value: bigint, minBet: bigint, maxBet: bigint): bigint {
    if (value < minBet) return minBet;
    if (value > maxBet) return maxBet;

    return value;
}

export function getAutoStopReason({
    settings,
    startedBalance,
    balanceAfter,
}: {
    settings: AutoSettings;
    startedBalance: bigint;
    balanceAfter: bigint;
}): AutoStopReason | null {
    const profitTarget = parseOptionalCreditInput(settings.stopOnProfit);
    const lossTarget = parseOptionalCreditInput(settings.stopOnLoss);
    const delta = balanceAfter - startedBalance;

    if (profitTarget > 0n && delta >= profitTarget) {
        return "stop_on_profit";
    }

    if (lossTarget > 0n && -delta >= lossTarget) {
        return "stop_on_loss";
    }

    return null;
}

export function getAutoStopReasonLabel(reason: AutoStopReason | null): string {
    switch (reason) {
        case "completed":
            return "Completed";
        case "stopped_by_user":
            return "Stopped";
        case "stop_on_profit":
            return "Stop on profit";
        case "stop_on_loss":
            return "Stop on loss";
        case "insufficient_balance":
            return "Insufficient balance";
        case "request_error":
            return "Request error";
        default:
            return "";
    }
}

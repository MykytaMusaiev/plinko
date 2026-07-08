import { formatCredits } from "@/shared/lib/bigint";
import type { BetListItemResponse, Risk } from "@/shared/types/api.types";

export type RiskFilter = Risk | "ALL";
export type RowsFilter = number | "ALL";

export const RISK_OPTIONS: RiskFilter[] = ["ALL", "LOW", "MEDIUM", "HIGH"];
export const ROW_OPTIONS: RowsFilter[] = [
    "ALL",
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
];
export const HISTORY_LIMIT = 50;

export interface BetHistoryRowViewModel {
    id: string;
    date: string;
    riskLabel: string;
    amount: string;
    rows: number;
    multiplier: string;
    payout: string;
    payoutTone: string;
    bucketIndex: number;
    balanceAfter: string;
}

export function formatRisk(risk: Risk): string {
    return risk.charAt(0) + risk.slice(1).toLowerCase();
}

export function formatHistoryDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export function getPayoutTone(
    bet: Pick<BetListItemResponse, "amount" | "payout">,
): string {
    const payout = BigInt(bet.payout);
    const amount = BigInt(bet.amount);

    if (payout > amount) return "text-emerald-400";
    if (payout < amount) return "text-red-400";
    return "text-neutral-200";
}

export function filterBetsByRisk(
    bets: BetListItemResponse[],
    riskFilter: RiskFilter,
): BetListItemResponse[] {
    if (riskFilter === "ALL") return bets;

    return bets.filter((bet) => bet.risk === riskFilter);
}

export function parseRiskFilterValue(value: string): RiskFilter {
    if (value === "LOW" || value === "MEDIUM" || value === "HIGH") return value;

    return "ALL";
}

export function parseRowsFilterValue(value: string): RowsFilter {
    if (value === "ALL") return "ALL";

    const rows = Number(value);
    return ROW_OPTIONS.includes(rows) ? rows : "ALL";
}

export function toBetHistoryRowViewModel(
    bet: BetListItemResponse,
): BetHistoryRowViewModel {
    return {
        id: bet.betId,
        date: formatHistoryDate(bet.createdAt),
        riskLabel: formatRisk(bet.risk),
        amount: formatCredits(bet.amount),
        rows: bet.rows,
        multiplier: `${bet.multiplier}x`,
        payout: formatCredits(bet.payout),
        payoutTone: getPayoutTone(bet),
        bucketIndex: bet.bucketIndex,
        balanceAfter: formatCredits(bet.balanceAfter),
    };
}

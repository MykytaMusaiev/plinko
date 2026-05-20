"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Filter, RefreshCw } from "lucide-react";
import { historyApi } from "../api/history.api";
import { formatCredits } from "@/shared/lib/bigint";
import type { BetListItemResponse, Risk } from "@/shared/types/api.types";

const RISK_OPTIONS: Array<Risk | "ALL"> = ["ALL", "LOW", "MEDIUM", "HIGH"];
const ROW_OPTIONS: Array<number | "ALL"> = ["ALL", 8, 9, 10, 11, 12, 13, 14, 15, 16];
const HISTORY_LIMIT = 50;

function formatRisk(risk: Risk): string {
    return risk.charAt(0) + risk.slice(1).toLowerCase();
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getPayoutTone(bet: BetListItemResponse): string {
    const payout = BigInt(bet.payout);
    const amount = BigInt(bet.amount);

    if (payout > amount) return "text-emerald-400";
    if (payout < amount) return "text-red-400";
    return "text-neutral-200";
}

function BetMobileCard({ bet }: { bet: BetListItemResponse }) {
    return (
        <article className="rounded-lg border border-white/10 bg-[#151b27] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-neutral-500">
                        {bet.betId}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                        {formatDate(bet.createdAt)}
                    </p>
                </div>

                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                    {formatRisk(bet.risk)}
                </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <dt className="text-xs text-neutral-500">Amount</dt>
                    <dd className="font-mono text-neutral-100">
                        {formatCredits(bet.amount)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-neutral-500">Payout</dt>
                    <dd className={`font-mono ${getPayoutTone(bet)}`}>
                        {formatCredits(bet.payout)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-neutral-500">Rows</dt>
                    <dd className="font-mono text-neutral-100">{bet.rows}</dd>
                </div>
                <div>
                    <dt className="text-xs text-neutral-500">Multiplier</dt>
                    <dd className="font-mono text-neutral-100">{bet.multiplier}x</dd>
                </div>
                <div>
                    <dt className="text-xs text-neutral-500">Bucket</dt>
                    <dd className="font-mono text-neutral-100">{bet.bucketIndex}</dd>
                </div>
                <div>
                    <dt className="text-xs text-neutral-500">Balance</dt>
                    <dd className="font-mono text-neutral-100">
                        {formatCredits(bet.balanceAfter)}
                    </dd>
                </div>
            </dl>
        </article>
    );
}

function BetDesktopRows({ bets }: { bets: BetListItemResponse[] }) {
    return (
        <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-[#151b27] md:block">
            <table className="w-full table-fixed text-left text-sm">
                <thead className="border-b border-white/10 bg-[#111722] text-xs text-neutral-400">
                    <tr>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Risk</th>
                        <th className="px-4 py-3 font-medium">Rows</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Multiplier</th>
                        <th className="px-4 py-3 font-medium">Payout</th>
                        <th className="px-4 py-3 font-medium">Bucket</th>
                        <th className="px-4 py-3 font-medium">Balance After</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {bets.map((bet) => (
                        <tr key={bet.betId} className="text-neutral-200">
                            <td className="px-4 py-3 text-neutral-300">
                                {formatDate(bet.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                                <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                                    {formatRisk(bet.risk)}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-mono">{bet.rows}</td>
                            <td className="px-4 py-3 font-mono">
                                {formatCredits(bet.amount)}
                            </td>
                            <td className="px-4 py-3 font-mono">{bet.multiplier}x</td>
                            <td className={`px-4 py-3 font-mono ${getPayoutTone(bet)}`}>
                                {formatCredits(bet.payout)}
                            </td>
                            <td className="px-4 py-3 font-mono">{bet.bucketIndex}</td>
                            <td className="px-4 py-3 font-mono">
                                {formatCredits(bet.balanceAfter)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function BetTable() {
    const [riskFilter, setRiskFilter] = useState<Risk | "ALL">("ALL");
    const [rowsFilter, setRowsFilter] = useState<number | "ALL">("ALL");

    const query = useQuery({
        queryKey: ["bet-history", rowsFilter],
        queryFn: () =>
            historyApi.listBets({
                limit: HISTORY_LIMIT,
                rows: rowsFilter === "ALL" ? undefined : rowsFilter,
            }),
    });

    const filteredBets = useMemo(() => {
        const bets = query.data?.items ?? [];

        if (riskFilter === "ALL") return bets;

        return bets.filter((bet) => bet.risk === riskFilter);
    }, [query.data?.items, riskFilter]);

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
            <div className="rounded-lg border border-white/10 bg-[#171d2a] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                        <Filter size={16} className="text-neutral-400" />
                        Filters:
                    </div>

                    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-neutral-500 sm:max-w-36">
                        Risk
                        <select
                            value={riskFilter}
                            onChange={(event) =>
                                setRiskFilter(event.target.value as Risk | "ALL")
                            }
                            className="h-10 rounded-md border border-white/10 bg-[#0f141d] px-3 text-sm text-white outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                        >
                            {RISK_OPTIONS.map((risk) => (
                                <option key={risk} value={risk}>
                                    {risk === "ALL" ? "All" : formatRisk(risk)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-neutral-500 sm:max-w-36">
                        Rows
                        <select
                            value={rowsFilter}
                            onChange={(event) => {
                                const value = event.target.value;
                                setRowsFilter(value === "ALL" ? "ALL" : Number(value));
                            }}
                            className="h-10 rounded-md border border-white/10 bg-[#0f141d] px-3 text-sm text-white outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                        >
                            {ROW_OPTIONS.map((rows) => (
                                <option key={rows} value={rows}>
                                    {rows === "ALL" ? "All" : rows}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            {query.isPending && (
                <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
                    Loading bet history...
                </div>
            )}

            {query.isError && (
                <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
                    <AlertCircle size={24} className="text-red-400" />
                    <p className="text-sm text-red-300">Failed to load bet history.</p>
                    <button
                        type="button"
                        onClick={() => void query.refetch()}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#171d2a] px-3 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-[#1d2636] hover:text-white"
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
            )}

            {query.isSuccess && filteredBets.length === 0 && (
                <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
                    No bets found
                </div>
            )}

            {query.isSuccess && filteredBets.length > 0 && (
                <>
                    <div className="grid gap-3 md:hidden">
                        {filteredBets.map((bet) => (
                            <BetMobileCard key={bet.betId} bet={bet} />
                        ))}
                    </div>

                    <BetDesktopRows bets={filteredBets} />
                </>
            )}
        </section>
    );
}

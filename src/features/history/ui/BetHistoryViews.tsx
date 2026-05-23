import type { ReactNode } from "react";
import type { BetHistoryRowViewModel } from "../model/betHistory.model";

interface BetHistoryRowsProps {
    bets: BetHistoryRowViewModel[];
}

function RiskBadge({
    label,
    variant,
}: {
    label: string;
    variant: "mobile" | "desktop";
}) {
    const className =
        variant === "mobile"
            ? "rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300"
            : "rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300";

    return <span className={className}>{label}</span>;
}

function BetMetric({
    label,
    value,
    valueClassName = "text-neutral-100",
}: {
    label: string;
    value: ReactNode;
    valueClassName?: string;
}) {
    return (
        <div>
            <dt className="text-xs text-neutral-500">{label}</dt>
            <dd className={`font-mono ${valueClassName}`}>{value}</dd>
        </div>
    );
}

function BetMobileCard({ bet }: { bet: BetHistoryRowViewModel }) {
    return (
        <article className="rounded-lg border border-white/10 bg-[#151b27] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-neutral-500">
                        {bet.id}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{bet.date}</p>
                </div>

                <RiskBadge label={bet.riskLabel} variant="mobile" />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <BetMetric label="Amount" value={bet.amount} />
                <BetMetric
                    label="Payout"
                    value={bet.payout}
                    valueClassName={bet.payoutTone}
                />
                <BetMetric label="Rows" value={bet.rows} />
                <BetMetric label="Multiplier" value={bet.multiplier} />
                <BetMetric label="Bucket" value={bet.bucketIndex} />
                <BetMetric label="Balance" value={bet.balanceAfter} />
            </dl>
        </article>
    );
}

export function BetHistoryMobileList({ bets }: BetHistoryRowsProps) {
    return (
        <div className="grid gap-3 md:hidden">
            {bets.map((bet) => (
                <BetMobileCard key={bet.id} bet={bet} />
            ))}
        </div>
    );
}

export function BetHistoryDesktopTable({ bets }: BetHistoryRowsProps) {
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
                        <tr key={bet.id} className="text-neutral-200">
                            <td className="px-4 py-3 text-neutral-300">{bet.date}</td>
                            <td className="px-4 py-3">
                                <RiskBadge label={bet.riskLabel} variant="desktop" />
                            </td>
                            <td className="px-4 py-3 font-mono">{bet.rows}</td>
                            <td className="px-4 py-3 font-mono">{bet.amount}</td>
                            <td className="px-4 py-3 font-mono">{bet.multiplier}</td>
                            <td className={`px-4 py-3 font-mono ${bet.payoutTone}`}>
                                {bet.payout}
                            </td>
                            <td className="px-4 py-3 font-mono">{bet.bucketIndex}</td>
                            <td className="px-4 py-3 font-mono">{bet.balanceAfter}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


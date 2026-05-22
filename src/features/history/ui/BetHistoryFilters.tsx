import { Filter } from "lucide-react";
import { formatRisk } from "../model/betHistory.model";
import type { RiskFilter, RowsFilter } from "../model/betHistory.model";

interface BetHistoryFiltersProps {
    riskOptions: RiskFilter[];
    rowsOptions: RowsFilter[];
    riskFilter: RiskFilter;
    rowsFilter: RowsFilter;
    onRiskFilterChange: (value: string) => void;
    onRowsFilterChange: (value: string) => void;
}

export function BetHistoryFilters({
    riskOptions,
    rowsOptions,
    riskFilter,
    rowsFilter,
    onRiskFilterChange,
    onRowsFilterChange,
}: BetHistoryFiltersProps) {
    return (
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
                        onChange={(event) => onRiskFilterChange(event.target.value)}
                        className="h-10 rounded-md border border-white/10 bg-[#0f141d] px-3 text-sm text-white outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                    >
                        {riskOptions.map((risk) => (
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
                        onChange={(event) => onRowsFilterChange(event.target.value)}
                        className="h-10 rounded-md border border-white/10 bg-[#0f141d] px-3 text-sm text-white outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                    >
                        {rowsOptions.map((rows) => (
                            <option key={rows} value={rows}>
                                {rows === "ALL" ? "All" : rows}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}


"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { historyApi } from "../api/history.api";
import {
    filterBetsByRisk,
    HISTORY_LIMIT,
    parseRiskFilterValue,
    parseRowsFilterValue,
    RISK_OPTIONS,
    ROW_OPTIONS,
    toBetHistoryRowViewModel,
} from "../model/betHistory.model";
import { BetHistoryFilters } from "./BetHistoryFilters";
import {
    BetHistoryDesktopTable,
    BetHistoryMobileList,
} from "./BetHistoryViews";
import {
    BetHistoryEmptyState,
    BetHistoryErrorState,
    BetHistoryLoadingState,
} from "./BetHistoryStates";
import type { RiskFilter, RowsFilter } from "../model/betHistory.model";

export function BetTable() {
    const [riskFilter, setRiskFilter] = useState<RiskFilter>("ALL");
    const [rowsFilter, setRowsFilter] = useState<RowsFilter>("ALL");

    const query = useQuery({
        queryKey: ["bet-history", rowsFilter],
        queryFn: () =>
            historyApi.listBets({
                limit: HISTORY_LIMIT,
                rows: rowsFilter === "ALL" ? undefined : rowsFilter,
            }),
    });
    const { data, isError, isPending, isSuccess, refetch } = query;

    const handleRiskFilterChange = useCallback((value: string) => {
        setRiskFilter(parseRiskFilterValue(value));
    }, []);

    const handleRowsFilterChange = useCallback((value: string) => {
        setRowsFilter(parseRowsFilterValue(value));
    }, []);

    const handleRetry = useCallback(() => {
        void refetch();
    }, [refetch]);

    const filteredBets = useMemo(() => {
        return filterBetsByRisk(data?.items ?? [], riskFilter);
    }, [data?.items, riskFilter]);

    const betRows = useMemo(
        () => filteredBets.map(toBetHistoryRowViewModel),
        [filteredBets],
    );

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
            <BetHistoryFilters
                riskOptions={RISK_OPTIONS}
                rowsOptions={ROW_OPTIONS}
                riskFilter={riskFilter}
                rowsFilter={rowsFilter}
                onRiskFilterChange={handleRiskFilterChange}
                onRowsFilterChange={handleRowsFilterChange}
            />

            {isPending && <BetHistoryLoadingState />}

            {isError && <BetHistoryErrorState onRetry={handleRetry} />}

            {isSuccess && betRows.length === 0 && <BetHistoryEmptyState />}

            {isSuccess && betRows.length > 0 && (
                <>
                    <BetHistoryMobileList bets={betRows} />
                    <BetHistoryDesktopTable bets={betRows} />
                </>
            )}
        </section>
    );
}

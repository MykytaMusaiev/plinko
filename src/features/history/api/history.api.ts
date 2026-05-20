import { betsApi } from "@/features/game/api/bets.api";

interface HistoryListParams {
    limit?: number;
    rows?: number;
}

export const historyApi = {
    listBets: (params?: HistoryListParams) => betsApi.list(params),
};

import { apiFetch } from "@/shared/lib/apiFetch";
import type {
    BetResponse,
    BetListResponse,
    CreateBetDto,
} from "@/shared/types/api.types";

interface BetListParams {
    limit?: number;
    cursor?: string;
    rows?: number;
}

export const betsApi = {
    place: (dto: CreateBetDto): Promise<BetResponse> =>
        apiFetch("/api/v1/bets", {
            method: "POST",
            body: JSON.stringify(dto),
        }),

    list: (params?: BetListParams): Promise<BetListResponse> => {
        const query = new URLSearchParams();
        if (params?.limit !== undefined)
            query.set("limit", String(params.limit));
        if (params?.cursor) query.set("cursor", params.cursor);
        if (params?.rows !== undefined) query.set("rows", String(params.rows));
        const qs = query.toString();
        return apiFetch(`/api/v1/bets${qs ? `?${qs}` : ""}`);
    },
};

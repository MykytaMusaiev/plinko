import { apiFetch } from "@/shared/lib/apiFetch";
import type {
    BetResponse,
    BetListResponse,
    CreateBetDto,
} from "@/shared/types/api.types";

const BETS_API_PATH = "/api/bets";

interface BetListParams {
    limit?: number;
    cursor?: string;
    rows?: number;
}

function createBetListQuery(params?: BetListParams): string {
    const query = new URLSearchParams();

    if (params?.limit !== undefined) {
        query.set("limit", String(params.limit));
    }

    if (params?.cursor) {
        query.set("cursor", params.cursor);
    }

    if (params?.rows !== undefined) {
        query.set("rows", String(params.rows));
    }

    const queryString = query.toString();

    return queryString ? `?${queryString}` : "";
}

export const betsApi = {
    place: (dto: CreateBetDto): Promise<BetResponse> =>
        apiFetch<BetResponse>(BETS_API_PATH, {
            method: "POST",
            body: JSON.stringify(dto),
        }),

    list: (params?: BetListParams): Promise<BetListResponse> =>
        apiFetch<BetListResponse>(
            `${BETS_API_PATH}${createBetListQuery(params)}`,
        ),
};

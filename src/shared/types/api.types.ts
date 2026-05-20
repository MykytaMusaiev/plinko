export interface ApiErrorBody {
    statusCode: number;
    message: string;
    error: string;
    path: string;
}

export interface UserMe {
    id: string;
    email: string;
    balance: string;
    createdAt: string;
}

export type Risk = "LOW" | "MEDIUM" | "HIGH";

export interface GameConfig {
    rows: number[];
    risks: Risk[];
    minBet: string;
    maxBet: string;
    payoutTables: Record<Risk, Record<string, number[]>>;
}

export interface CreateBetDto {
    amount: number;
    rows: number;
    risk: Risk;
}

export interface BetSeedRef {
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
}

// Verified against real POST /api/v1/bets response
// TODO(types): Re-verify full shape after GET /api/v1/bets is tested — fields may expand
export interface BetResponse {
    betId: string;
    amount: string;
    rows: number;
    risk: Risk;
    path: string;
    bucketIndex: number;
    multiplier: string;
    payout: string;
    balanceAfter: string;
    createdAt?: string; // present in list responses, absent in POST response
    seed: BetSeedRef;
}

export interface BetListResponse {
    items: BetResponse[];
    nextCursor: string | null;
}

export interface ActiveSeedResponse {
    id: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
}

export interface RevealedSeedResponse {
    id: string;
    serverSeed: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
}

export interface AuthSessionResponse {
    user: UserMe;
}

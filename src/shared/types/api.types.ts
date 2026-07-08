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

interface BetFields {
    betId: string;
    amount: string;
    rows: number;
    risk: Risk;
    path: string;
    bucketIndex: number;
    multiplier: string;
    payout: string;
    balanceAfter: string;
}

// Verified against real POST /api/v1/bets response
export interface BetResponse extends BetFields {
    seed: BetSeedRef;
}

// Verified against real authenticated GET /api/bets response
export interface BetListItemResponse extends BetFields {
    createdAt: string;
}

export interface BetListResponse {
    items: BetListItemResponse[];
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

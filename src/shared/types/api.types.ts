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

// Partially known — will be extended after first real bet test
export interface BetResponse {
    id: string;
    amount: number;
    rows: number;
    risk: Risk;
    path: string;
    bucketIndex: number;
    multiplier: number;
    payout: string;
    balanceAfter: string;
    createdAt: string;
    seed?: BetSeedRef;
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

// BFF auth responses (enriched by Route Handlers)
export interface BffAuthResponse {
    accessToken: string;
    user: UserMe;
}

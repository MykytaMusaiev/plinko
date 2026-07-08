export const MIN_BET = 1_000_000n; // 1 credit
export const MAX_BET = 1_000_000_000_000n; // 1M credits

export function formatCredits(raw: string): string {
    const v = BigInt(raw);
    const whole = v / 1_000_000n;
    const frac = (v % 1_000_000n).toString().padStart(6, "0").slice(0, 2);
    return `${whole.toLocaleString()}.${frac}`;
}

export function parseCredits(input: string): bigint {
    const [w, f = ""] = input.replace(/[, ]/g, "").split(".");
    const whole = BigInt(w || "0") * 1_000_000n;
    const frac = BigInt((f + "000000").slice(0, 6));
    return whole + frac;
}

export function creditsToNumber(raw: string): number {
    const v = BigInt(raw);
    return Number(v / 1_000_000n) + Number(v % 1_000_000n) / 1_000_000;
}

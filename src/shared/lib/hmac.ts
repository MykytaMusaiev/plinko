async function hmacSha256Hex(key: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const sig = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        enc.encode(message),
    );
    return Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Reproduces the ball path for a given bet.
 * Algorithm: HMAC-SHA256(serverSeed, `${clientSeed}:${nonce}`)
 * Each byte of the hash determines one step: even → L, odd → R.
 *
 * TODO: Verify exact algorithm against backend source before shipping Fair page.
 */
export async function verifyBetPath(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    rows: number,
): Promise<string> {
    const hash = await hmacSha256Hex(serverSeed, `${clientSeed}:${nonce}`);
    const path: string[] = [];
    for (let i = 0; i < rows; i++) {
        const byte = parseInt(hash.slice(i * 2, i * 2 + 2), 16);
        path.push(byte % 2 === 0 ? "L" : "R");
    }
    return path.join("");
}

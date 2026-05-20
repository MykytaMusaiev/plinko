import "server-only";

const apiBase = process.env.API_BASE;

if (!apiBase) {
    throw new Error("Missing required environment variable: API_BASE");
}

export const API_BASE = apiBase;

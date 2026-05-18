import { useAuthStore } from "@/features/auth/model/auth.store";

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public error: string,
        public path: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "https://plinko-be-stanish.fly.dev";

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) throw new Error("Refresh failed");
    const data: { accessToken: string } = await res.json();
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit & { _isRetry?: boolean } = {},
): Promise<T> {
    const isBff = path.startsWith("/api/auth");
    const url = isBff ? path : `${API_BASE}${path}`;

    const { accessToken } = useAuthStore.getState();
    const { _isRetry, headers: extraHeaders, ...restOptions } = options;

    const headers: Record<string, string> = {
        ...(restOptions.body !== undefined
            ? { "Content-Type": "application/json" }
            : {}),
        ...(!isBff && accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        ...(extraHeaders as Record<string, string> | undefined),
    };

    const res = await fetch(url, { ...restOptions, headers });

    if (res.status === 401 && !_isRetry && !isBff) {
        try {
            if (!refreshPromise) {
                refreshPromise = doRefresh().finally(() => {
                    refreshPromise = null;
                });
            }
            const newToken = await refreshPromise;
            return apiFetch(path, {
                ...options,
                _isRetry: true,
                headers: {
                    ...(extraHeaders as Record<string, string> | undefined),
                    Authorization: `Bearer ${newToken}`,
                },
            });
        } catch {
            useAuthStore.getState().clear();
            if (typeof window !== "undefined") window.location.href = "/login";
            throw new ApiError(
                401,
                "Session expired",
                "UnauthorizedException",
                path,
            );
        }
    }

    if (res.status === 204) return undefined as T;

    const body = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(
            body?.statusCode ?? res.status,
            body?.message ?? "Unknown error",
            body?.error ?? "",
            body?.path ?? path,
        );
    }

    return body as T;
}

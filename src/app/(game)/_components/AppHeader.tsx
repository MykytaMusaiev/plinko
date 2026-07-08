"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Logout } from "@/features/auth/ui/Logout";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AudioToggle } from "@/features/game/ui/AudioToggle";
import { formatCredits } from "@/shared/lib/bigint";

export function AppHeader() {
    const user = useAuthStore((s) => s.user);
    const balance = user?.balance ?? "0";

    const prevBalance = useRef(balance);
    const [flash, setFlash] = useState<"win" | "loss" | null>(null);

    useEffect(() => {
        if (prevBalance.current === balance) return;
        const prev = BigInt(prevBalance.current);
        const curr = BigInt(balance);
        setFlash(curr > prev ? "win" : "loss");
        prevBalance.current = balance;
        const t = setTimeout(() => setFlash(null), 700);
        return () => clearTimeout(t);
    }, [balance]);

    return (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-5">
            <span className="text-sm font-semibold tracking-wide text-white">Plinko</span>

            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-neutral-400">Balance:</span>
                <span
                    className={clsx(
                        "font-mono text-sm font-semibold transition-colors duration-300",
                        flash === "win" && "text-emerald-400",
                        flash === "loss" && "text-red-400",
                        !flash && "text-white",
                    )}
                >
                    {formatCredits(balance)}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <AudioToggle />
                <Logout />
            </div>
        </header>
    );
}

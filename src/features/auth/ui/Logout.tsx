"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "../model/useLogout";

export function Logout() {
    const { mutate, isPending } = useLogout({
        onUnexpectedError: () =>
            toast.error("Could not log out. Please try again."),
    });

    return (
        <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Log out"
            aria-busy={isPending}
        >
            <LogOut size={14} aria-hidden />
            <span>{isPending ? "Logging out" : "Logout"}</span>
        </button>
    );
}

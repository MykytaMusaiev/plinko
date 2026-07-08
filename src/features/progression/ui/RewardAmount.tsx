import { CircleDollarSign, Sparkles } from "lucide-react";

export function RewardAmount({
    credits,
    xp,
    compact = false,
}: {
    credits: string;
    xp: number;
    compact?: boolean;
}) {
    return (
        <div
            className={
                compact
                    ? "flex flex-wrap items-center gap-2 text-xs"
                    : "grid grid-cols-2 gap-2 text-sm"
            }
        >
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono font-semibold text-emerald-300">
                <CircleDollarSign size={14} aria-hidden />
                <span className="truncate">{credits}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 font-mono font-semibold text-blue-300">
                <Sparkles size={14} aria-hidden />
                <span className="truncate">+{xp} XP</span>
            </span>
        </div>
    );
}

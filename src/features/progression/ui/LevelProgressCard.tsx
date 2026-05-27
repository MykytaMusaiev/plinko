import { TrendingUp } from "lucide-react";
import type { LevelProgressViewModel } from "../model/progressionViewModel";
import { ProgressBar } from "./ProgressBar";

export function LevelProgressCard({
    level,
}: {
    level: LevelProgressViewModel;
}) {
    return (
        <section className="rounded-lg border border-white/10 bg-[#151b27] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                        <TrendingUp size={16} aria-hidden />
                        Level {level.level}
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-normal text-white">
                        {level.totalXp.toLocaleString()} XP
                    </h1>
                    <p className="mt-1 text-sm text-neutral-400">Total experience</p>
                </div>
                <div className="shrink-0 rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-right">
                    <p className="font-mono text-sm font-semibold text-neutral-100">
                        {level.xpIntoCurrentLevel} / {level.levelProgressTotal}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">level XP</p>
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-neutral-400">
                    <span>{level.xpToNextLevel} XP to next level</span>
                    <span>{Math.round(level.levelProgressPercent)}%</span>
                </div>
                <ProgressBar
                    label={`Level ${level.level} progress`}
                    percent={level.levelProgressPercent}
                />
            </div>
        </section>
    );
}

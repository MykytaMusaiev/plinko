import { Check } from "lucide-react";
import {
    getLevelProgressPercent,
    getLevelProgressTotal,
} from "../model/profileViewModel";
import type { ProfileProgressionSummary } from "../types/profile.types";

export function ProfileLevelProgress({
    progression,
}: {
    progression: ProfileProgressionSummary;
}) {
    const progressTotal = getLevelProgressTotal(progression);
    const progressPercent = getLevelProgressPercent(progression);

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex min-w-0 items-center gap-2 font-semibold text-neutral-200">
                    <Check size={15} className="text-blue-400" aria-hidden />
                    <span className="truncate">
                        Level {progression.level} Progress
                    </span>
                </span>
                <span className="shrink-0 font-mono text-xs text-neutral-400">
                    {progression.xpIntoCurrentLevel} / {progressTotal} XP
                </span>
            </div>
            <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-950"
                aria-label={`Level progress ${Math.round(progressPercent)}%`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressPercent)}
            >
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}

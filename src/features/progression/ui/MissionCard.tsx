import { CheckCircle2, Clock3, Target, Zap } from "lucide-react";
import { clsx } from "clsx";
import {
    getMissionClaimLabel,
    type MissionClaimState,
    type MissionViewModel,
} from "../model/progressionViewModel";
import { ClaimButton } from "./ClaimButton";
import { ProgressBar } from "./ProgressBar";
import { RewardAmount } from "./RewardAmount";

function MissionStateBadge({ state }: { state: MissionClaimState }) {
    const isClaimed = state === "claimed";
    const isClaimable = state === "claimable" || state === "pending";

    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold",
                isClaimed &&
                    "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
                isClaimable &&
                    "border-blue-400/25 bg-blue-400/10 text-blue-300",
                !isClaimed &&
                    !isClaimable &&
                    "border-white/10 bg-white/5 text-neutral-400",
            )}
        >
            {isClaimed ? (
                <CheckCircle2 size={13} aria-hidden />
            ) : isClaimable ? (
                <Zap size={13} aria-hidden />
            ) : (
                <Clock3 size={13} aria-hidden />
            )}
            {getMissionClaimLabel(state)}
        </span>
    );
}

export function MissionCard({
    mission,
    state,
    onClaim,
}: {
    mission: MissionViewModel;
    state: MissionClaimState;
    onClaim: (missionId: string) => void;
}) {
    const canClaim = state === "claimable" && mission.id !== null;

    return (
        <article className="rounded-lg border border-white/10 bg-[#151b27] p-4 transition-colors hover:border-white/15 sm:p-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-400/20 bg-blue-400/10 text-blue-300">
                            <Target size={15} aria-hidden />
                        </span>
                        <h3 className="min-w-0 text-base font-bold tracking-normal text-white">
                            {mission.title}
                        </h3>
                        <MissionStateBadge state={state} />
                    </div>
                    <p className="mt-2 text-sm text-neutral-400">
                        {mission.description}
                    </p>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                    <RewardAmount
                        credits={mission.creditReward}
                        xp={mission.xpReward}
                        compact
                    />
                    <ClaimButton
                        disabled={!canClaim}
                        label={getMissionClaimLabel(state)}
                        onClick={() => {
                            if (mission.id) {
                                onClaim(mission.id);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-neutral-400">
                    <span className="font-mono">{mission.progressLabel}</span>
                    <span>{mission.percentLabel}</span>
                </div>
                <ProgressBar
                    label={`${mission.title} mission progress`}
                    percent={mission.progressPercent}
                />
            </div>
        </article>
    );
}

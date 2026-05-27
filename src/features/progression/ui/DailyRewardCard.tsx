import { CalendarClock, Flame, Gift } from "lucide-react";
import {
    getDailyClaimLabel,
    type DailyClaimState,
    type DailyRewardViewModel,
} from "../model/progressionViewModel";
import { ClaimButton } from "./ClaimButton";
import { RewardAmount } from "./RewardAmount";

export function DailyRewardCard({
    daily,
    claimState,
    onClaim,
}: {
    daily: DailyRewardViewModel;
    claimState: DailyClaimState;
    onClaim: () => void;
}) {
    const claimLabel = getDailyClaimLabel(claimState);
    const isDisabled = claimState !== "claimable";

    return (
        <section className="rounded-lg border border-orange-400/20 bg-[linear-gradient(135deg,rgba(251,146,60,0.16),rgba(244,63,94,0.10)_55%,rgba(21,27,39,0.95))] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                        <Gift size={16} aria-hidden />
                        Daily Reward
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-normal text-white">
                        Keep the streak alive
                    </h2>
                    <p className="mt-1 text-sm text-neutral-400">
                        Claim credits and XP once per daily reward window.
                    </p>
                </div>
                <RewardAmount credits={daily.credits} xp={daily.xp} compact />
            </div>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-neutral-950/55 p-3">
                    <p className="inline-flex items-center gap-2 text-neutral-400">
                        <Flame size={15} className="text-orange-300" aria-hidden />
                        Current streak
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-white">
                        {daily.streak} day{daily.streak === 1 ? "" : "s"}
                    </p>
                </div>
                <div className="rounded-md border border-white/10 bg-neutral-950/55 p-3">
                    <p className="inline-flex items-center gap-2 text-neutral-400">
                        <CalendarClock
                            size={15}
                            className="text-blue-300"
                            aria-hidden
                        />
                        Next claim
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-white">
                        {daily.nextClaimLabel}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <ClaimButton
                    disabled={isDisabled}
                    label={claimLabel}
                    onClick={onClaim}
                />
            </div>
        </section>
    );
}

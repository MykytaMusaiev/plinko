"use client";

import { toast } from "sonner";
import { useClaimDailyReward } from "../model/useClaimDailyReward";
import { useClaimMissionReward } from "../model/useClaimMissionReward";
import { useProgression } from "../model/useProgression";
import {
    getDailyClaimState,
    toDailyRewardViewModel,
    toLevelProgressViewModel,
    toMissionViewModel,
} from "../model/progressionViewModel";
import { DailyRewardCard } from "./DailyRewardCard";
import { LevelProgressCard } from "./LevelProgressCard";
import { MissionSection } from "./MissionSection";
import { ProgressionErrorState } from "./ProgressionErrorState";
import { ProgressionLoadingState } from "./ProgressionLoadingState";

export function ProgressionPageContent() {
    const { data: progression, isError, isPending, refetch } = useProgression();
    const dailyClaim = useClaimDailyReward();
    const missionClaim = useClaimMissionReward();

    if (isPending) {
        return <ProgressionLoadingState />;
    }

    if (isError || !progression) {
        return <ProgressionErrorState onRetry={() => void refetch()} />;
    }

    const level = toLevelProgressViewModel(progression);
    const daily = toDailyRewardViewModel(progression.daily);
    const dailyMissions = progression.missions.daily.map(toMissionViewModel);
    const starterMissions = progression.missions.starter.map(toMissionViewModel);
    const dailyClaimState = getDailyClaimState(daily, dailyClaim.isPending);
    const pendingMissionId = missionClaim.isPending
        ? missionClaim.variables ?? null
        : null;

    const claimDailyReward = () => {
        if (!progression.daily.canClaim || dailyClaim.isPending) return;

        dailyClaim.mutate(undefined, {
            onSuccess: () => {
                toast.success("Daily reward claimed.");
            },
            onError: () => {
                toast.error("Could not claim daily reward.");
            },
        });
    };

    const claimMissionReward = (missionId: string) => {
        missionClaim.mutate(missionId, {
            onSuccess: () => {
                toast.success("Mission reward claimed.");
            },
            onError: () => {
                toast.error("Could not claim mission reward.");
            },
        });
    };

    return (
        <main className="min-h-full bg-[#111620] px-4 py-6 text-white sm:px-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-4">
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold leading-none tracking-normal text-white">
                        Progression
                    </h1>
                    <p className="max-w-2xl text-sm text-neutral-400">
                        Track level progress, collect daily rewards, and claim
                        completed mission payouts.
                    </p>
                </header>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <LevelProgressCard level={level} />
                    <DailyRewardCard
                        daily={daily}
                        claimState={dailyClaimState}
                        onClaim={claimDailyReward}
                    />
                </div>

                <MissionSection
                    title="Daily Missions"
                    description="Resetting objectives for today's play session."
                    emptyLabel="No daily missions are available right now."
                    missions={dailyMissions}
                    pendingMissionId={pendingMissionId}
                    onClaim={claimMissionReward}
                />

                <MissionSection
                    title="Starter Missions"
                    description="One-time objectives that help build early progress."
                    emptyLabel="No starter missions are available right now."
                    missions={starterMissions}
                    pendingMissionId={pendingMissionId}
                    onClaim={claimMissionReward}
                />
            </div>
        </main>
    );
}

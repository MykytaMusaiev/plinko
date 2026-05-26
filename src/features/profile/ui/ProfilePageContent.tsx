"use client";

import { useProfile } from "../model/useProfile";
import { ProfileErrorState } from "./ProfileErrorState";
import { ProfileLoadingState } from "./ProfileLoadingState";
import { ProfileStats } from "./ProfileStats";
import { ProfileSummaryCard } from "./ProfileSummaryCard";

export function ProfilePageContent() {
    const { data: profile, isError, isPending, refetch } = useProfile();

    if (isPending) {
        return <ProfileLoadingState />;
    }

    if (isError || !profile) {
        return <ProfileErrorState onRetry={() => void refetch()} />;
    }

    return (
        <main className="min-h-full bg-[#111620] px-4 py-6 text-white sm:px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-4">
                <ProfileSummaryCard profile={profile} />
                <ProfileStats profile={profile} />
            </div>
        </main>
    );
}

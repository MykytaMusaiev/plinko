import { Check, Trophy } from "lucide-react";
import { getLevelProgressTotal } from "../model/profileViewModel";
import type { ProfileResponse } from "../types/profile.types";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileStats({ profile }: { profile: ProfileResponse }) {
    const progressTotal = getLevelProgressTotal(profile.progression);
    const xpRemaining = Math.max(
        0,
        progressTotal - profile.progression.xpIntoCurrentLevel,
    );

    return (
        <section className="grid gap-3 sm:grid-cols-2">
            <ProfileStatCard
                label="Total XP"
                value={String(profile.progression.xp)}
                icon={<Trophy size={18} className="text-yellow-300" aria-hidden />}
            />
            <ProfileStatCard
                label="XP To Next Level"
                value={String(xpRemaining)}
                icon={<Check size={18} className="text-blue-300" aria-hidden />}
            />
        </section>
    );
}

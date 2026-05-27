import type {
    MissionClaimState,
    MissionViewModel,
} from "../model/progressionViewModel";
import { getMissionClaimState } from "../model/progressionViewModel";
import { MissionCard } from "./MissionCard";

export function MissionSection({
    title,
    description,
    emptyLabel,
    missions,
    pendingMissionId,
    onClaim,
}: {
    title: string;
    description: string;
    emptyLabel: string;
    missions: MissionViewModel[];
    pendingMissionId: string | null;
    onClaim: (missionId: string) => void;
}) {
    return (
        <section className="flex flex-col gap-3">
            <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-neutral-300">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">{description}</p>
            </div>

            {missions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 bg-[#151b27] p-5 text-sm text-neutral-500">
                    {emptyLabel}
                </div>
            ) : (
                <div className="grid gap-3">
                    {missions.map((mission) => {
                        const state: MissionClaimState = getMissionClaimState(
                            mission,
                            pendingMissionId,
                        );

                        return (
                            <MissionCard
                                key={mission.id ?? mission.key}
                                mission={mission}
                                state={state}
                                onClaim={onClaim}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}

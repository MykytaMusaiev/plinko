import type { ReactNode } from "react";

interface ProfileStatCardProps {
    label: string;
    value: string;
    icon?: ReactNode;
}

export function ProfileStatCard({
    label,
    value,
    icon,
}: ProfileStatCardProps) {
    return (
        <article className="rounded-lg border border-white/10 bg-[#151b27] p-4">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-neutral-500">
                    {label}
                </span>
                {icon}
            </div>
            <p className="mt-2 truncate text-2xl font-bold tracking-normal text-white">
                {value}
            </p>
        </article>
    );
}

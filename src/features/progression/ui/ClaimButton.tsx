import { clsx } from "clsx";

export function ClaimButton({
    disabled,
    label,
    onClick,
}: {
    disabled: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                "inline-flex h-10 min-w-28 items-center justify-center rounded-md px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                disabled
                    ? "cursor-not-allowed border border-white/10 bg-white/5 text-neutral-500"
                    : "bg-emerald-400 text-neutral-950 hover:bg-emerald-300 active:bg-emerald-500",
            )}
        >
            <span className="truncate">{label}</span>
        </button>
    );
}

export function ProgressBar({
    label,
    percent,
}: {
    label: string;
    percent: number;
}) {
    const roundedPercent = Math.round(percent);

    return (
        <div
            className="h-2 overflow-hidden rounded-full bg-neutral-950"
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={roundedPercent}
        >
            <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

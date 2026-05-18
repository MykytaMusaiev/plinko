export function multiplierBg(m: number): string {
    if (m >= 10) return "bg-red-500";
    if (m >= 3) return "bg-orange-500";
    if (m >= 1) return "bg-yellow-500";
    if (m >= 0.5) return "bg-green-500";
    return "bg-green-800";
}

export function multiplierText(m: number): string {
    if (m >= 10) return "text-red-400";
    if (m >= 3) return "text-orange-400";
    if (m >= 1) return "text-yellow-400";
    return "text-green-400";
}

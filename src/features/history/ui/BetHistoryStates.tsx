import { AlertCircle, RefreshCw } from "lucide-react";

export function BetHistoryLoadingState() {
    return (
        <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
            Loading bet history...
        </div>
    );
}

export function BetHistoryEmptyState() {
    return (
        <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
            No bets found
        </div>
    );
}

export function BetHistoryErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
            <AlertCircle size={24} className="text-red-400" />
            <p className="text-sm text-red-300">Failed to load bet history.</p>
            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#171d2a] px-3 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-[#1d2636] hover:text-white"
            >
                <RefreshCw size={14} />
                Retry
            </button>
        </div>
    );
}


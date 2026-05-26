import { AlertCircle, RefreshCw } from "lucide-react";

export function ProfileErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <main className="flex min-h-full items-center justify-center bg-[#111620] px-4 py-8 text-white">
            <section className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border border-white/10 bg-[#151b27] p-6 text-center">
                <AlertCircle size={26} className="text-red-400" aria-hidden />
                <div>
                    <h1 className="text-xl font-bold tracking-normal">
                        Profile unavailable
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400">
                        We could not load your profile right now.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#1b2331] px-3 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:bg-[#222c3d]"
                >
                    <RefreshCw size={15} aria-hidden />
                    Retry
                </button>
            </section>
        </main>
    );
}

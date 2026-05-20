import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BetTable } from "@/features/history/ui/BetTable";

export default function HistoryPage() {
    return (
        <main className="min-h-screen bg-[#111620] text-white">
            <header className="flex min-h-16 flex-col gap-3 border-b border-white/5 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
                <Link
                    href="/game"
                    className="inline-flex h-11 w-fit items-center gap-2 rounded-lg border border-white/10 bg-[#171d2a] px-4 text-sm font-semibold text-neutral-200 transition-colors hover:bg-[#1d2636] hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back to Game
                </Link>

                <h1 className="text-2xl font-bold leading-none tracking-normal text-white">
                    Bet History
                </h1>
            </header>

            <BetTable />
        </main>
    );
}

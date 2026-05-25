import { BetTable } from "@/features/history/ui/BetTable";

export default function HistoryPage() {
    return (
        <main className="min-h-full bg-[#111620] text-white">
            <header className="flex min-h-16 items-center border-b border-white/5 px-4 py-3 sm:px-5">
                <h1 className="text-2xl font-bold leading-none tracking-normal text-white">
                    Bet History
                </h1>
            </header>

            <BetTable />
        </main>
    );
}

export function ProgressionLoadingState() {
    return (
        <main className="min-h-full bg-[#111620] px-4 py-6 text-white sm:px-6">
            <section className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                <div className="h-36 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                <div className="h-44 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                <div className="grid gap-3">
                    <div className="h-28 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                    <div className="h-28 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                    <div className="h-28 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                </div>
            </section>
        </main>
    );
}

export function ProfileLoadingState() {
    return (
        <main className="min-h-full bg-[#111620] px-4 py-6 text-white sm:px-6">
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                <div className="h-48 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="h-24 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                    <div className="h-24 animate-pulse rounded-lg border border-white/10 bg-[#151b27]" />
                </div>
            </section>
        </main>
    );
}

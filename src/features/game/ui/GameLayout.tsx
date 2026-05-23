'use client';

import { CheckCircle } from 'lucide-react';
import { useGameConfig } from '../model/useGameConfig';
import { BetControls } from './BetControls';
import { GameBoard } from './GameBoard';
import { UserHeader } from './UserHeader';

export function GameLayout() {
  const { data: config, isLoading, isError } = useGameConfig();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <span className="animate-pulse text-sm text-neutral-500">Loading...</span>
      </div>
    );
  }

  if (isError || !config) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <span className="text-sm text-red-400">Failed to load game config.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <UserHeader />

      <main className="grid min-h-[calc(100vh-57px)] grid-cols-1 lg:h-[calc(100vh-57px)] lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:overflow-hidden">
        <section
          aria-label="Bet controls"
          className="order-2 w-full lg:order-1 lg:w-auto [&>aside]:h-auto [&>aside]:w-full [&>aside]:border-r-0 [&>aside]:border-t [&>aside]:border-white/5 lg:[&>aside]:h-full lg:[&>aside]:w-55 lg:[&>aside]:border-r lg:[&>aside]:border-t-0"
        >
          <BetControls config={config} />
        </section>

        <section
          aria-label="Game board"
          className="order-1 flex min-w-0 flex-col overflow-visible lg:order-2 lg:min-h-0"
        >
          <div className="flex min-h-0 w-full flex-1 items-start justify-center px-3 py-4 sm:px-6 sm:py-6 lg:items-center">
            <GameBoard config={config} />
          </div>

          <div className="shrink-0 px-4 py-3">
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 text-xs text-emerald-500/70 transition-colors hover:text-emerald-400">
                <CheckCircle size={13} />
                Provably Fair
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

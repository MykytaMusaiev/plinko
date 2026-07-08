'use client';

import { CheckCircle } from 'lucide-react';
import { useGameConfig } from '../model/useGameConfig';
import { useBetControlsModel } from '../model/useBetControlsModel';
import { BetControls } from './BetControls';
import { GameBoard } from './GameBoard';
import { MobileBetHud } from './MobileBetHud';
import { MobileRowsSelector } from './MobileRowsSelector';
import type { GameConfig } from '@/shared/types/api.types';

export function GameLayout() {
  const { data: config, isLoading, isError } = useGameConfig();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center bg-neutral-950">
        <span className="animate-pulse text-sm text-neutral-500">Loading...</span>
      </div>
    );
  }

  if (isError || !config) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center bg-neutral-950">
        <span className="text-sm text-red-400">Failed to load game config.</span>
      </div>
    );
  }

  return <GameLayoutContent config={config} />;
}

function GameLayoutContent({ config }: { config: GameConfig }) {
  const betControls = useBetControlsModel({ config });

  return (
    <div className="flex h-full min-h-0 flex-col overflow-x-hidden bg-neutral-950 text-white">
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[13.75rem_minmax(0,1fr)]">
        <section
          aria-label="Bet controls"
          className="hidden lg:order-1 lg:block lg:w-auto lg:[&>aside]:h-full lg:[&>aside]:w-55 lg:[&>aside]:border-r lg:[&>aside]:border-t-0"
        >
          <BetControls model={betControls} />
        </section>

        <section
          aria-label="Game board"
          className="order-1 flex min-h-0 min-w-0 flex-col overflow-hidden lg:order-2"
        >
          <div className="relative flex min-h-0 w-full min-w-0 flex-1 items-center justify-center overflow-hidden px-1.5 pb-1 pt-2 sm:px-6 sm:py-5 lg:p-6">
            <GameBoard config={config} />
            <MobileRowsSelector model={betControls} />
          </div>

          <div className="shrink-0 lg:hidden">
            <MobileBetHud model={betControls} />
          </div>

          <div className="hidden shrink-0 px-4 py-3 lg:block">
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

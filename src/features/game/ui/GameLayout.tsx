'use client';

import { CheckCircle } from 'lucide-react';
import { useGameConfig } from '../model/useGameConfig';
import { BetControls } from './BetControls';
import { GameBoard } from './GameBoard';
import { MultiplierBar } from './MultiplierBar';
import { UserHeader } from './UserHeader';

export function GameLayout() {
  const { data: config, isLoading, isError } = useGameConfig();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <span className="text-neutral-500 text-sm animate-pulse">Loading…</span>
      </div>
    );
  }

  if (isError || !config) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <span className="text-red-400 text-sm">Failed to load game config.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">
      <UserHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — controls */}
        <BetControls config={config} />

        {/* Main area */}
        <main className="flex flex-col flex-1 overflow-hidden">
          <GameBoard />
          <MultiplierBar config={config} />

          {/* Provably Fair */}
          <div className="flex justify-end p-3">
            <button className="flex items-center gap-1.5 text-xs text-emerald-500/70 hover:text-emerald-400 transition-colors">
              <CheckCircle size={13} />
              Provably Fair
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
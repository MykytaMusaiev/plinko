'use client';

import { GameBoard } from './GameBoard';
import { MultiplierBar } from './MultiplierBar';

export function GameLayout() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-950 px-4 py-6">
      {/* Multiplier buckets row */}
      <MultiplierBar />

      {/* Peg grid + ball animation */}
      <GameBoard />
    </main>
  );
}
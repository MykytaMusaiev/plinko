'use client';

import { PegGrid } from './PegGrid';

export function GameBoard() {
  return (
    <section className="relative w-full max-w-md">
      <PegGrid rows={8} />
    </section>
  );
}
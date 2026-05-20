'use client';

import { useGameStore } from '../model/game.store';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { PegGrid } from './PegGrid';
import type { BetResponse } from '@/shared/types/api.types';

export function GameBoard() {
  const { selectedRows, lastResult, setPlaying, setLastResult, setWinningBucketIndex } =
    useGameStore();
  const { user, setUser } = useAuthStore();

  const handleAnimationComplete = (result: BetResponse) => {
    // Update balance from server response
    if (user) setUser({ ...user, balance: result.balanceAfter });
    // Highlight winning bucket
    setWinningBucketIndex(result.bucketIndex);
    setPlaying(false);
    setLastResult(null);

    // Clear highlight after 2.5s
    setTimeout(() => setWinningBucketIndex(null), 2500);
  };

  return (
    <section className="flex-1 flex items-start justify-center pt-6 overflow-hidden">
      <PegGrid
        rows={selectedRows}
        lastResult={lastResult}
        onAnimationComplete={handleAnimationComplete}
      />
    </section>
  );
}
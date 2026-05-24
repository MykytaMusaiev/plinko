'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../model/game.store';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { createBoardGeometry } from '../lib/boardGeometry';
import { MultiplierBar } from './MultiplierBar';
import { PegGrid } from './PegGrid';
import type { BetResponse, GameConfig } from '@/shared/types/api.types';

interface GameBoardProps {
  config: GameConfig;
}

const MOBILE_BOARD_MAX_WIDTH = 640;

export function GameBoard({ config }: GameBoardProps) {
  const { selectedRows, lastResult, setPlaying, setLastResult, setWinningBucketIndex } =
    useGameStore();
  const { user, setUser } = useAuthStore();
  const frameRef = useRef<HTMLDivElement>(null);
  const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const resizeTarget = frame.parentElement ?? frame;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);

      setAvailableSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    });

    resizeObserver.observe(resizeTarget);

    return () => resizeObserver.disconnect();
  }, []);

  const geometry = useMemo(
    () =>
      createBoardGeometry({
        rows: selectedRows,
        availableWidth: availableSize.width,
        availableHeight: availableSize.height,
        layout:
          availableSize.width > 0 && availableSize.width < MOBILE_BOARD_MAX_WIDTH
            ? 'mobile'
            : 'default',
      }),
    [availableSize.height, availableSize.width, selectedRows],
  );

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
    <div ref={frameRef} className="w-full min-w-0">
      <div className="mx-auto flex flex-col items-center" style={{ width: geometry.width }}>
        <PegGrid
          geometry={geometry}
          lastResult={lastResult}
          onAnimationComplete={handleAnimationComplete}
        />
        <MultiplierBar config={config} geometry={geometry} />
      </div>
    </div>
  );
}

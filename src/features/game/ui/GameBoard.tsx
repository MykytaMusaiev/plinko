'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { REVEAL_MS, useGameStore } from '../model/game.store';
import { createBoardGeometry } from '../lib/boardGeometry';
import { MultiplierBar } from './MultiplierBar';
import { PegGrid } from './PegGrid';
import type { GameConfig } from '@/shared/types/api.types';
import type { VisualRound } from '../model/game.store';

interface GameBoardProps {
  config: GameConfig;
}

const MOBILE_BOARD_MAX_WIDTH = 640;

export function GameBoard({ config }: GameBoardProps) {
  const {
    selectedRows,
    playbackMode,
    activeVisualRounds,
    completeVisualRound,
    pruneVisualRound,
  } = useGameStore();
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

  const completePlayback = useCallback(
    (round: VisualRound) => {
      const didComplete = completeVisualRound(round.roundId);

      if (!didComplete) return;

      window.setTimeout(() => pruneVisualRound(round.roundId), REVEAL_MS);
    },
    [completeVisualRound, pruneVisualRound],
  );

  useEffect(() => {
    if (playbackMode !== 'fast') return;

    activeVisualRounds
      .filter((round) => round.status === 'active')
      .forEach((round) => completePlayback(round));
  }, [activeVisualRounds, completePlayback, playbackMode]);

  const animatingRounds =
    playbackMode === 'normal'
      ? activeVisualRounds.filter((round) => round.status === 'active')
      : [];

  return (
    <div ref={frameRef} className="w-full min-w-0">
      <div className="mx-auto flex flex-col items-center" style={{ width: geometry.width }}>
        <PegGrid
          geometry={geometry}
          rounds={animatingRounds}
          onAnimationComplete={completePlayback}
        />
        <MultiplierBar config={config} geometry={geometry} />
      </div>
    </div>
  );
}

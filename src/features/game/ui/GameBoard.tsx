'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { REVEAL_MS, useGameStore } from '../model/game.store';
import { getCanvasRoundPlayback } from '../lib/canvasRoundPlaybackPolicy';
import { PlinkoCanvasStage } from './PlinkoCanvasStage';
import { RecentResults } from './RecentResults';
import type { GameConfig } from '@/shared/types/api.types';
import type { VisualRound } from '../model/game.store';
import { useGameAudio } from '../model/useGameAudio';

interface GameBoardProps {
  config: GameConfig;
}

export function GameBoard({ config }: GameBoardProps) {
  const {
    risk,
    selectedRows,
    playbackMode,
    activeVisualRounds,
    autoRuntime,
    completeVisualRound,
    pruneVisualRound,
  } = useGameStore();
  const { playResultSound } = useGameAudio();
  const bucketMultipliers = useMemo(
    () => config.payoutTables[risk]?.[String(selectedRows)] ?? [],
    [config.payoutTables, risk, selectedRows],
  );

  const completePlayback = useCallback(
    (round: VisualRound) => {
      const didComplete = completeVisualRound(round.roundId);

      if (!didComplete) return;

      playResultSound({
        source: round.source,
        playbackMode,
        result: round.result,
        resolvedCount: autoRuntime.resolvedCount,
      });

      window.setTimeout(() => pruneVisualRound(round.roundId), REVEAL_MS);
    },
    [autoRuntime.resolvedCount, completeVisualRound, playbackMode, playResultSound, pruneVisualRound],
  );

  useEffect(() => {
    const timeoutIds = activeVisualRounds
      .filter(
        (round) =>
          round.status === 'active' &&
          getCanvasRoundPlayback({
            playbackMode,
            playbackStyle: round.playbackStyle,
            source: round.source,
          }) === 'quick-settle',
      )
      .map((round) => window.setTimeout(() => completePlayback(round), 40));

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [activeVisualRounds, completePlayback, playbackMode]);

  const animatingRounds = activeVisualRounds.filter((round) => {
    if (round.status !== 'active') {
      return false;
    }

    const canvasPlayback = getCanvasRoundPlayback({
      playbackMode,
      playbackStyle: round.playbackStyle,
      source: round.source,
    });

    return canvasPlayback === 'normal-canvas';
  });

  const bucketFeedbackRounds = activeVisualRounds.filter((round) => {
    if (round.status !== 'active') {
      return false;
    }

    return (
      getCanvasRoundPlayback({
        playbackMode,
        playbackStyle: round.playbackStyle,
        source: round.source,
      }) === 'bucket-feedback'
    );
  });

  return (
    <div className="relative flex h-full min-h-[19rem] w-full min-w-0 flex-1 items-stretch">
      <PlinkoCanvasStage
        bucketFeedbackRounds={bucketFeedbackRounds}
        bucketMultipliers={bucketMultipliers}
        risk={risk}
        rowsCount={selectedRows}
        rounds={animatingRounds}
        onAnimationComplete={completePlayback}
      />
      <RecentResults />
    </div>
  );
}

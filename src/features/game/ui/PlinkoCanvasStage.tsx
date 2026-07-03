'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createCanvasPlinkoRenderer } from '../renderer';
import { toPlinkoRendererRound } from '../lib/plinkoCanvasAdapter';
import type { Risk } from '@/shared/types/api.types';
import type {
  PlinkoRenderer,
  PlinkoRendererOptions,
  PlinkoRendererRound,
} from '../renderer';
import type { VisualRound } from '../model/game.store';

interface PlinkoCanvasStageProps {
  bucketFeedbackRounds: readonly VisualRound[];
  bucketMultipliers: readonly number[];
  onAnimationComplete: (round: VisualRound) => void;
  risk: Risk;
  rounds: readonly VisualRound[];
  rowsCount: number;
}

export function PlinkoCanvasStage({
  bucketFeedbackRounds,
  bucketMultipliers,
  onAnimationComplete,
  risk,
  rounds,
  rowsCount,
}: PlinkoCanvasStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<PlinkoRenderer | null>(null);
  const dispatchedRoundIdsRef = useRef(new Set<string>());
  const terminalRoundIdsRef = useRef(new Set<string>());
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const roundMapRef = useRef(new Map<string, VisualRound>());

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    roundMapRef.current = new Map(
      [...rounds, ...bucketFeedbackRounds].map((round) => [round.roundId, round]),
    );
  }, [bucketFeedbackRounds, rounds]);

  const rendererOptions = useMemo<PlinkoRendererOptions>(
    () => ({
      board: {
        bucketMultipliers,
        risk,
        rowsCount,
      },
      onRoundSettled: (rendererRound) => {
        terminalRoundIdsRef.current.add(rendererRound.id);
        const visualRound = roundMapRef.current.get(rendererRound.id);

        if (visualRound) {
          onAnimationCompleteRef.current(visualRound);
        }
      },
    }),
    [bucketMultipliers, risk, rowsCount],
  );

  const dispatchRound = useCallback(
    (rendererRound: PlinkoRendererRound) => {
      const renderer = rendererRef.current;

      if (!renderer || terminalRoundIdsRef.current.has(rendererRound.id)) {
        return;
      }

      const acknowledgement = renderer.visualizeRound(rendererRound);

      if (
        acknowledgement.status === 'accepted' ||
        acknowledgement.status === 'already-active'
      ) {
        dispatchedRoundIdsRef.current.add(rendererRound.id);
        return;
      }

      terminalRoundIdsRef.current.add(rendererRound.id);
      const visualRound = roundMapRef.current.get(rendererRound.id);

      if (visualRound) {
        onAnimationCompleteRef.current(visualRound);
      }
    },
    [],
  );

  const rendererRounds = useMemo(
    () =>
      rounds.map((round) =>
        toPlinkoRendererRound({
          acceptedAt: round.createdAt,
          result: round.result,
          roundId: round.roundId,
          turboEnabled: false,
        }),
      ),
    [rounds],
  );
  const bucketFeedbackRendererRounds = useMemo(
    () =>
      bucketFeedbackRounds.map((round) =>
        toPlinkoRendererRound({
          acceptedAt: round.createdAt,
          result: round.result,
          roundId: round.roundId,
          turboEnabled: false,
        }),
      ),
    [bucketFeedbackRounds],
  );

  useEffect(() => {
    const renderer = rendererRef.current;

    if (renderer) {
      renderer.setOptions(rendererOptions);
    }
  }, [rendererOptions]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const renderer = createCanvasPlinkoRenderer({
      container,
      ...rendererOptions,
    });
    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, [rendererOptions]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const container = containerRef.current;

    if (!renderer || !container || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(() => renderer.resize());
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    for (const rendererRound of rendererRounds) {
      if (
        dispatchedRoundIdsRef.current.has(rendererRound.id) ||
        terminalRoundIdsRef.current.has(rendererRound.id)
      ) {
        continue;
      }

      dispatchRound(rendererRound);
    }
  }, [dispatchRound, rendererRounds]);

  useEffect(() => {
    const renderer = rendererRef.current;

    for (const rendererRound of bucketFeedbackRendererRounds) {
      if (
        dispatchedRoundIdsRef.current.has(rendererRound.id) ||
        terminalRoundIdsRef.current.has(rendererRound.id)
      ) {
        continue;
      }

      if (!renderer) {
        const visualRound = roundMapRef.current.get(rendererRound.id);

        if (visualRound) {
          onAnimationCompleteRef.current(visualRound);
        }

        continue;
      }

      const acknowledgement = renderer.showBucketFeedback(rendererRound);

      if (acknowledgement.status === 'accepted') {
        dispatchedRoundIdsRef.current.add(rendererRound.id);
        continue;
      }

      terminalRoundIdsRef.current.add(rendererRound.id);
      const visualRound = roundMapRef.current.get(rendererRound.id);

      if (visualRound) {
        onAnimationCompleteRef.current(visualRound);
      }
    }
  }, [bucketFeedbackRendererRounds]);

  return (
    <div
      aria-label="Plinko renderer surface"
      className="relative min-h-[19rem] w-full min-w-0 flex-1 overflow-hidden sm:min-h-[25rem] lg:min-h-0"
      ref={containerRef}
    />
  );
}

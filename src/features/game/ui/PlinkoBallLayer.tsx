'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import type { BoardGeometry } from '../lib/boardGeometry';
import { createVisualAnimationPlan } from '../lib/visualWaypoints';
import type { VisualRound } from '../model/game.store';
import { Ball } from './Ball';

interface PlinkoBallLayerProps {
  geometry: BoardGeometry;
  rounds: VisualRound[];
  onAnimationComplete: (round: VisualRound) => void;
}

interface PlannedBallProps {
  geometry: BoardGeometry;
  round: VisualRound;
  onAnimationComplete: (round: VisualRound) => void;
}

function OverflowReveal({
  round,
  onAnimationComplete,
}: {
  round: VisualRound;
  onAnimationComplete: (round: VisualRound) => void;
}) {
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onAnimationCompleteRef.current(round);
    }, 40);

    return () => window.clearTimeout(timeoutId);
  }, [round]);

  return null;
}

function FullPlannedBall({ geometry, round, onAnimationComplete }: PlannedBallProps) {
  const plan = useMemo(
    () =>
      createVisualAnimationPlan({
        result: round.result,
        geometry,
        style: round.playbackStyle,
        source: round.source,
      }),
    [geometry, round.playbackStyle, round.result, round.source],
  );

  return (
    <Ball
      geometry={geometry}
      plan={plan}
      onComplete={() => onAnimationComplete(round)}
    />
  );
}

function PlannedBall({ geometry, round, onAnimationComplete }: PlannedBallProps) {
  if (round.playbackStyle === 'compressed') {
    return (
      <OverflowReveal
        round={round}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }

  return (
    <FullPlannedBall
      geometry={geometry}
      round={round}
      onAnimationComplete={onAnimationComplete}
    />
  );
}

function PlinkoBallLayerComponent({
  geometry,
  rounds,
  onAnimationComplete,
}: PlinkoBallLayerProps) {
  return (
    <AnimatePresence>
      {rounds.map((round) => (
        <PlannedBall
          key={round.roundId}
          geometry={geometry}
          round={round}
          onAnimationComplete={onAnimationComplete}
        />
      ))}
    </AnimatePresence>
  );
}

export const PlinkoBallLayer = memo(PlinkoBallLayerComponent);

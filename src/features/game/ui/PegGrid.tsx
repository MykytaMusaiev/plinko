'use client';

import type { BoardGeometry } from '../lib/boardGeometry';
import type { VisualRound } from '../model/game.store';
import { PegLayer } from './PegLayer';
import { PlinkoBallLayer } from './PlinkoBallLayer';

interface PegGridProps {
  geometry: BoardGeometry;
  rounds: VisualRound[];
  onAnimationComplete: (round: VisualRound) => void;
}

export function PegGrid({ geometry, rounds, onAnimationComplete }: PegGridProps) {
  return (
    <div
      style={{ width: geometry.width, height: geometry.pegGridHeight }}
      className="relative mx-auto shrink-0 select-none"
    >
      <PegLayer geometry={geometry} />
      <PlinkoBallLayer
        geometry={geometry}
        rounds={rounds}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}

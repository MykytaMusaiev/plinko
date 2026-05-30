'use client';

import { memo } from 'react';
import type { BoardGeometry } from '../lib/boardGeometry';

interface PegLayerProps {
  geometry: BoardGeometry;
}

function PegLayerComponent({ geometry }: PegLayerProps) {
  return (
    <>
      {geometry.pegs.map(({ row, peg, x, y }) => (
        <div
          key={`${row}-${peg}`}
          className="absolute rounded-full bg-neutral-500/85"
          style={{
            width: geometry.pegRadius * 2,
            height: geometry.pegRadius * 2,
            left: x - geometry.pegRadius,
            top: y - geometry.pegRadius,
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.18)',
          }}
        />
      ))}
    </>
  );
}

export const PegLayer = memo(PegLayerComponent);

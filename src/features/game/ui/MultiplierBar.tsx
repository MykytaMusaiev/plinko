'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import { useGameStore } from '../model/game.store';
import { multiplierBg } from '@/shared/lib/multiplierColor';
import { formatCredits } from '@/shared/lib/bigint';
import type { GameConfig } from '@/shared/types/api.types';
import type { BoardGeometry } from '../lib/boardGeometry';

interface MultiplierBarProps {
  config: GameConfig;
  geometry: BoardGeometry;
}

export function MultiplierBar({ config, geometry }: MultiplierBarProps) {
  const { risk, selectedRows, winningBucketIndex, betAmount } = useGameStore();
  const multipliers: number[] = config.payoutTables[risk]?.[String(selectedRows)] ?? [];

  return (
    <div className="w-full" style={{ width: geometry.width, height: geometry.bucketHeight }}>
      <Tooltip.Provider delayDuration={150}>
        <div className="relative h-full w-full">
          {multipliers.map((m, i) => {
            const isWinner = winningBucketIndex === i;
            const potentialPayout = formatCredits(String(BigInt(Math.round(Number(betAmount) * m))));
            const isDarkBucket = m < 0.5;
            const bucket = geometry.buckets[i];
            const fontSize = Math.max(9, Math.min(12, bucket?.width ? bucket.width * 0.32 : 11));

            if (!bucket) return null;

            return (
              <Tooltip.Root key={i}>
                <Tooltip.Trigger asChild>
                  <div
                    className={clsx(
                      'absolute flex items-center justify-center rounded-md px-1 py-1.5 text-center font-black leading-none shadow-sm',
                      'border border-white/10 transition-all duration-300 cursor-default select-none',
                      multiplierBg(m),
                      isDarkBucket ? 'text-white' : 'text-neutral-950',
                      isWinner
                        ? 'scale-105 shadow-[0_0_18px_5px_rgba(255,255,255,0.28)] ring-2 ring-white/70 z-10'
                        : 'opacity-95 hover:opacity-100',
                    )}
                    style={{
                      animation: isWinner ? 'pulse 0.6s ease-out' : undefined,
                      height: bucket.height,
                      left: bucket.left,
                      fontSize,
                      top: bucket.top,
                      width: bucket.width,
                    }}
                  >
                    <span className="block truncate">{m}x</span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="rounded border border-white/10 bg-neutral-800 px-2 py-1 text-xs text-white shadow-lg"
                  >
                    {potentialPayout}
                    <Tooltip.Arrow className="fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </div>
      </Tooltip.Provider>
    </div>
  );
}

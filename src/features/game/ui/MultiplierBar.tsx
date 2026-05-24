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

const COMPACT_BUCKET_LABEL_WIDTH = 20;

export function MultiplierBar({ config, geometry }: MultiplierBarProps) {
  const { risk, selectedRows, winningBucketIndex, betAmount } = useGameStore();
  const multipliers: number[] = config.payoutTables[risk]?.[String(selectedRows)] ?? [];

  return (
    <div className="w-full" style={{ width: geometry.width, height: geometry.bucketHeight }}>
      <Tooltip.Provider delayDuration={150}>
        <div className="relative h-full w-full">
          <style>
            {`
              @keyframes result-bucket-label {
                0% {
                  opacity: 0;
                  transform: translate(-50%, calc(-100% - 0.125rem)) scale(0.9);
                }
                40% {
                  opacity: 1;
                  transform: translate(-50%, calc(-100% - 0.375rem)) scale(1.08);
                }
                100% {
                  opacity: 1;
                  transform: translate(-50%, calc(-100% - 0.375rem)) scale(1);
                }
              }
            `}
          </style>
          {multipliers.map((m, i) => {
            const isWinner = winningBucketIndex === i;
            const potentialPayout = formatCredits(String(BigInt(Math.round(Number(betAmount) * m))));
            const isDarkBucket = m < 0.5;
            const bucket = geometry.buckets[i];

            if (!bucket) return null;

            const isCompactBucket = bucket.width < COMPACT_BUCKET_LABEL_WIDTH;
            const fullLabel = `${m}x`;
            const bucketLabel = isCompactBucket ? String(m) : fullLabel;
            const fontSize = isCompactBucket
              ? Math.max(8, Math.min(9.5, bucket.height * 0.3))
              : Math.max(9, Math.min(12, bucket.width * 0.32));

            return (
              <Tooltip.Root key={i}>
                <Tooltip.Trigger asChild>
                  <div
                    className={clsx(
                      'absolute flex items-center justify-center overflow-hidden rounded-md px-1 py-1.5 text-center font-black leading-none shadow-sm',
                      'border border-white/10 transition-all duration-500 cursor-default select-none',
                      multiplierBg(m),
                      isDarkBucket ? 'text-white' : 'text-neutral-950',
                      isWinner
                        ? 'shadow-[0_0_18px_5px_rgba(255,255,255,0.28)] ring-2 ring-white/70 z-10'
                        : 'opacity-95 hover:opacity-100',
                    )}
                    style={{
                      height: bucket.height,
                      left: bucket.left,
                      fontSize,
                      top: bucket.top,
                      transform: isWinner ? 'translateY(-2px) scale(1.04)' : undefined,
                      width: bucket.width,
                      paddingInline: isCompactBucket ? 0 : undefined,
                    }}
                    aria-label={`${fullLabel} multiplier`}
                  >
                    <span
                      className="block max-w-full truncate"
                      style={
                        isCompactBucket
                          ? {
                              maxWidth: bucket.height - 4,
                              transform: 'rotate(-90deg)',
                              transformOrigin: 'center',
                              whiteSpace: 'nowrap',
                            }
                          : undefined
                      }
                    >
                      {bucketLabel}
                    </span>
                  </div>
                </Tooltip.Trigger>
                {isWinner && isCompactBucket && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute z-20 rounded-full border border-white/70 bg-neutral-950/95 px-1.5 py-0.5 text-[10px] font-black leading-none text-white shadow-[0_0_16px_rgba(255,255,255,0.32)]"
                    style={{
                      animation: 'result-bucket-label 500ms ease-out',
                      left: bucket.centerX,
                      top: bucket.top,
                      transform: 'translate(-50%, calc(-100% - 0.375rem))',
                    }}
                  >
                    {fullLabel}
                  </div>
                )}
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

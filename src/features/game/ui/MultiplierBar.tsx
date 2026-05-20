'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import { useGameStore } from '../model/game.store';
import { multiplierBg, multiplierText } from '@/shared/lib/multiplierColor';
import { formatCredits } from '@/shared/lib/bigint';
import type { GameConfig } from '@/shared/types/api.types';

interface MultiplierBarProps {
  config: GameConfig;
}

export function MultiplierBar({ config }: MultiplierBarProps) {
  const { risk, selectedRows, winningBucketIndex, betAmount } = useGameStore();
  const multipliers: number[] = config.payoutTables[risk]?.[String(selectedRows)] ?? [];

  return (
    <div className="flex justify-center gap-1 mt-3">
      <Tooltip.Provider delayDuration={150}>
        {multipliers.map((m, i) => {
          const isWinner = winningBucketIndex === i;
          const potentialPayout = formatCredits(String(BigInt(Math.round(Number(betAmount) * m))));

          return (
            <Tooltip.Root key={i}>
              <Tooltip.Trigger asChild>
                <div
                  className={clsx(
                    'flex items-center justify-center rounded-md text-xs font-bold px-2 py-1.5 min-w-[44px]',
                    'border transition-all duration-300 cursor-default select-none',
                    multiplierBg(m),
                    multiplierText(m),
                    isWinner
                      ? 'scale-110 shadow-[0_0_16px_4px_rgba(255,255,255,0.25)] border-white/60 z-10'
                      : 'border-transparent opacity-90 hover:opacity-100',
                  )}
                  style={
                    isWinner
                      ? { animation: 'pulse 0.6s ease-out' }
                      : undefined
                  }
                >
                  {m}×
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="bg-neutral-800 border border-white/10 text-white text-xs px-2 py-1 rounded shadow-lg"
                >
                  {potentialPayout}
                  <Tooltip.Arrow className="fill-neutral-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </Tooltip.Provider>
    </div>
  );
}
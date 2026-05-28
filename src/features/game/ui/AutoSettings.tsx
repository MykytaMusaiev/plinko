'use client';

import { clsx } from 'clsx';
import { Play, Square } from 'lucide-react';
import type { BetControlsModel } from '../model/useBetControlsModel';

interface AutoSettingsProps {
  model: BetControlsModel;
  onStarted?: () => void;
}

export function AutoSettings({ model, onStarted }: AutoSettingsProps) {
  const isRunning = model.isAutoActive;
  const canStart = !model.isAutoSettingsLocked;

  const handleStart = async () => {
    const didStart = await model.handleStartAuto();

    if (didStart) {
      onStarted?.();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-neutral-500">Auto</span>
        <span className="font-mono text-xs font-bold text-emerald-300">
          {model.autoProgressLabel}
        </span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-neutral-400">Number of Bets</span>
        <input
          type="number"
          min={1}
          max={1000}
          step={1}
          value={model.autoSettings.numberOfBets}
          onChange={(event) => model.setAutoNumberOfBets(Number(event.target.value))}
          disabled={model.isAutoSettingsLocked}
          className={inputClassName}
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-neutral-400">Stop on Profit</span>
          <input
            type="text"
            inputMode="decimal"
            value={model.autoSettings.stopOnProfit}
            onChange={(event) => model.setAutoStopOnProfit(event.target.value)}
            disabled={model.isAutoSettingsLocked}
            className={inputClassName}
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-neutral-400">Stop on Loss</span>
          <input
            type="text"
            inputMode="decimal"
            value={model.autoSettings.stopOnLoss}
            onChange={(event) => model.setAutoStopOnLoss(event.target.value)}
            disabled={model.isAutoSettingsLocked}
            className={inputClassName}
          />
        </label>
      </div>

      {isRunning ? (
        <button
          type="button"
          onClick={model.handleStopAuto}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-500 text-sm font-black uppercase text-white transition-colors hover:bg-red-400"
        >
          <Square size={15} aria-hidden />
          Stop Auto ({model.autoProgressLabel})
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void handleStart()}
          disabled={!canStart}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-500 text-sm font-black uppercase text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Play size={15} aria-hidden />
          Start Auto
        </button>
      )}
    </div>
  );
}

const inputClassName = clsx(
  'h-9 w-full rounded-md border border-white/10 bg-neutral-950 px-3',
  'font-mono text-sm font-semibold text-white outline-none transition-colors',
  'focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40',
  'disabled:cursor-not-allowed disabled:opacity-45',
);

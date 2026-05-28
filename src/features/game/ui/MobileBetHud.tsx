'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { DollarSign } from 'lucide-react';
import {
  MODES,
  PLAYBACK_MODES,
  RISKS,
  type BetControlsModel,
} from '../model/useBetControlsModel';
import { MobileAutoSheet } from './MobileAutoSheet';

interface MobileBetHudProps {
  model: BetControlsModel;
}

export function MobileBetHud({ model }: MobileBetHudProps) {
  const [isAutoSheetOpen, setAutoSheetOpen] = useState(false);
  const primaryLabel = model.isAutoActive
    ? 'Stop'
    : model.isPending
      ? 'Placing'
      : 'Bet';

  return (
    <section
      aria-label="Mobile bet controls"
      className="mx-auto flex w-full max-w-md flex-col gap-2 border-t border-white/10 bg-[#111722]/95 px-2 py-2 shadow-[0_-18px_36px_rgba(0,0,0,0.28)]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] items-end gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="px-1 text-[10px] font-semibold uppercase text-neutral-500">
            Risk
          </span>
          <div className="grid gap-1 rounded-md bg-neutral-950/75 p-1">
            {RISKS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => model.setRisk(r)}
                disabled={model.isDisabled}
                className={clsx(
                  'h-6 rounded px-2 text-left text-[10px] font-semibold transition-colors',
                  model.risk === r
                    ? 'bg-emerald-400 text-neutral-950'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
                  'disabled:cursor-not-allowed disabled:opacity-45',
                )}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={model.isAutoActive ? model.handleStopAuto : model.handleBet}
          disabled={model.isAutoActive ? false : model.isBetDisabled}
          className={clsx(
            'mx-auto flex h-20 w-20 items-center justify-center rounded-full border text-sm font-black uppercase tracking-wide transition-all',
            model.isAutoActive
              ? 'border-red-300/50 bg-red-500 text-white shadow-[0_0_22px_rgba(239,68,68,0.24)] hover:bg-red-400 active:scale-[0.96]'
              : model.isBetDisabled
              ? 'border-emerald-800/40 bg-neutral-900 text-emerald-800'
              : 'border-emerald-300/50 bg-emerald-500 text-neutral-950 shadow-[0_0_22px_rgba(52,211,153,0.24)] hover:bg-emerald-400 active:scale-[0.96]',
          )}
          aria-label={model.isAutoActive ? 'Stop Auto' : 'Place bet'}
        >
          <span>{primaryLabel}</span>
        </button>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="px-1 text-right text-[10px] font-semibold uppercase text-neutral-500">
            Mode
          </span>
          <div className="grid gap-1 rounded-md bg-neutral-950/75 p-1">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  model.setMode(m);

                  if (m === 'auto') {
                    setAutoSheetOpen(true);
                  }
                }}
                disabled={model.isAutoActive && m === 'manual'}
                className={clsx(
                  'flex h-6 items-center justify-between rounded px-2 text-[10px] font-semibold capitalize transition-colors',
                  model.mode === m
                    ? 'bg-emerald-400 text-neutral-950'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
                  'disabled:cursor-not-allowed disabled:opacity-45',
                )}
              >
                <span>{m.charAt(0).toUpperCase() + m.slice(1)}</span>
                {m === 'auto' && (
                  <span className="text-[9px] uppercase">
                    {model.isAutoActive ? model.autoProgressLabel : 'Set'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-md bg-neutral-950/75 p-1">
        {PLAYBACK_MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => model.setPlaybackMode(m)}
            disabled={model.areControlsDisabled}
            className={clsx(
              'h-7 rounded text-[10px] font-semibold capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-45',
              model.playbackMode === m
                ? 'bg-emerald-400 text-neutral-950'
                : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[2.45rem_2.45rem_minmax(0,1fr)_2.45rem_2.45rem] overflow-hidden rounded-md border border-white/10 bg-neutral-950">
        <button
          type="button"
          onClick={model.setToMin}
          disabled={model.isDisabled}
          className="h-9 border-r border-white/10 text-[10px] font-bold text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          MIN
        </button>
        <button
          type="button"
          onClick={model.half}
          disabled={model.isDisabled}
          className="h-9 border-r border-white/10 text-sm font-bold text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Halve bet amount"
        >
          {'\u00bd'}
        </button>
        <div className="flex min-w-0 items-center gap-1.5 px-2">
          <DollarSign size={13} className="shrink-0 text-emerald-400" aria-hidden />
          <input
            type="text"
            inputMode="decimal"
            value={model.displayValue}
            onChange={(e) => model.setEditingAmount(e.target.value)}
            onBlur={model.handleAmountBlur}
            disabled={model.isDisabled}
            aria-label="Bet amount"
            className="min-w-0 flex-1 bg-transparent text-center font-mono text-sm font-bold text-white outline-none disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={model.double}
          disabled={model.isDisabled}
          className="h-9 border-l border-white/10 text-sm font-bold text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Double bet amount"
        >
          {'2\u00d7'}
        </button>
        <button
          type="button"
          onClick={model.max}
          disabled={model.isDisabled}
          className="h-9 border-l border-white/10 text-[10px] font-bold text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          MAX
        </button>
      </div>
      <MobileAutoSheet
        model={model}
        open={isAutoSheetOpen}
        onOpenChange={setAutoSheetOpen}
      />
    </section>
  );
}

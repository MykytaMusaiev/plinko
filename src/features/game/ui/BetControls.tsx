'use client';

import * as Slider from '@radix-ui/react-slider';
import { clsx } from 'clsx';
import { DollarSign } from 'lucide-react';
import {
  MODES,
  PLAYBACK_MODES,
  RISKS,
  type BetControlsModel,
} from '../model/useBetControlsModel';

interface BetControlsProps {
  model: BetControlsModel;
}

export function BetControls({ model }: BetControlsProps) {
  return (
    <aside className="flex flex-col gap-5 w-55 shrink-0 p-4 bg-[#141924] border-r border-white/5 h-full">
      {/* Mode tabs */}
      <div className="flex rounded-lg overflow-hidden bg-neutral-900 p-0.5 gap-0.5">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => model.setMode(m)}
            disabled={m === 'auto'}
            className={clsx(
              'flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors',
              model.mode === m
                ? 'bg-neutral-700 text-white'
                : 'text-neutral-500 cursor-not-allowed',
            )}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-400 font-medium">Playback</span>
        <div className="flex rounded-lg overflow-hidden bg-neutral-900 p-0.5 gap-0.5">
          {PLAYBACK_MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => model.setPlaybackMode(m)}
              disabled={model.isDisabled}
              className={clsx(
                'flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                model.playbackMode === m
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-neutral-500 hover:text-neutral-300',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Bet amount */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-medium">Bet Amount</span>
          <span className="text-xs text-neutral-300 font-mono">
            {model.userBalanceLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2">
          <DollarSign size={13} className="text-neutral-500 shrink-0" />
          <input
            type="text"
            inputMode="decimal"
            value={model.displayValue}
            onChange={(e) => model.setEditingAmount(e.target.value)}
            onBlur={model.handleAmountBlur}
            disabled={model.isDisabled}
            className="bg-transparent text-white text-sm font-mono w-full outline-none disabled:opacity-50"
          />
        </div>

        <div className="flex gap-1.5">
          {[
            ['\u00bd', model.half],
            ['2\u00d7', model.double],
            ['MAX', model.max],
          ].map(([label, fn]) => (
            <button
              key={label as string}
              type="button"
              onClick={fn as () => void}
              disabled={model.isDisabled}
              className="flex-1 py-1 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors disabled:opacity-40"
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      {/* Risk */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-400 font-medium">Risk</span>
        <div className="flex gap-1.5">
          {RISKS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => model.setRisk(r)}
              disabled={model.isDisabled}
              className={clsx(
                'flex-1 py-1.5 text-xs font-medium rounded-md border transition-all',
                model.risk === r
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-neutral-900 border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-300',
                'disabled:opacity-40',
              )}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-medium">Rows</span>
          <span className="text-xs font-mono font-semibold text-white bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded">
            {model.selectedRows}
          </span>
        </div>

        <Slider.Root
          min={model.rowMin}
          max={model.rowMax}
          step={1}
          value={[model.selectedRows]}
          onValueChange={([v]) => model.setSelectedRows(v)}
          disabled={model.isDisabled}
          className="relative flex items-center select-none touch-none h-5"
        >
          <Slider.Track className="bg-neutral-800 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-emerald-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-40 transition-transform hover:scale-110" />
        </Slider.Root>

        <div className="flex justify-between text-[10px] text-neutral-600">
          <span>{model.rowMin}</span>
          <span>{model.rowMax}</span>
        </div>
      </div>

      {/* Bet button */}
      <button
        type="button"
        onClick={model.handleBet}
        disabled={model.isDisabled}
        className={clsx(
          'mt-auto w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all',
          model.isDisabled
            ? 'bg-emerald-700/40 text-emerald-700 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-900 active:scale-[0.97] shadow-[0_0_20px_rgba(52,211,153,0.3)]',
        )}
      >
        {model.isPending ? 'Placing\u2026' : 'Bet'}
      </button>

      {/* Bottom icons */}
      <div className="flex justify-between items-center pt-1">
        <button className="text-neutral-600 hover:text-neutral-400 transition-colors" aria-label="Expand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
        <button className="text-neutral-600 hover:text-neutral-400 transition-colors" aria-label="Settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

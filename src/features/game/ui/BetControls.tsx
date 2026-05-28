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
import { AutoSettings } from './AutoSettings';

interface BetControlsProps {
  model: BetControlsModel;
}

export function BetControls({ model }: BetControlsProps) {
  return (
    <aside className="flex h-full w-55 shrink-0 flex-col gap-5 overflow-y-auto border-r border-white/5 bg-[#141924] p-4">
      {/* Mode tabs */}
      <div className="flex rounded-lg overflow-hidden bg-neutral-900 p-0.5 gap-0.5">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => model.setMode(m)}
            disabled={model.isAutoActive && m !== model.mode}
            className={clsx(
              'flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors',
              model.mode === m
                ? 'bg-neutral-700 text-white'
                : 'text-neutral-500 hover:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-45',
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
              disabled={model.areControlsDisabled}
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

      {model.mode === 'auto' ? (
        <AutoSettings model={model} />
      ) : (
        <button
          type="button"
          onClick={model.handleBet}
          disabled={model.isBetDisabled}
          className={clsx(
            'mt-auto w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all',
            model.isBetDisabled
              ? 'bg-emerald-700/40 text-emerald-700 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-900 active:scale-[0.97] shadow-[0_0_20px_rgba(52,211,153,0.3)]',
          )}
        >
          {model.isPending ? 'Placing\u2026' : 'Bet'}
        </button>
      )}
    </aside>
  );
}

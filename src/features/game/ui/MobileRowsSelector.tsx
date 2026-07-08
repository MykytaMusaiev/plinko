'use client';

import { clsx } from 'clsx';
import type { BetControlsModel } from '../model/useBetControlsModel';

interface MobileRowsSelectorProps {
  model: BetControlsModel;
}

export function MobileRowsSelector({ model }: MobileRowsSelectorProps) {
  return (
    <div className="pointer-events-none absolute right-1 top-[42%] z-10 -translate-y-1/2 lg:hidden sm:right-4">
      <div className="pointer-events-auto flex w-9 flex-col items-center gap-1 border-l border-white/10 bg-neutral-950/35 py-2 pl-1 pr-0.5 shadow-[12px_0_28px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <span className="text-[8px] font-bold uppercase leading-none text-neutral-500">
          Lines
        </span>
        <div className="relative flex flex-col items-center gap-1 py-1">
          <span
            aria-hidden
            className="absolute bottom-2 top-2 w-px rounded-full bg-white/10"
          />
          {model.rowValues.map((rows) => (
            <button
              key={rows}
              type="button"
              onClick={() => model.setSelectedRows(rows)}
              disabled={model.isDisabled}
              className={clsx(
                'relative flex h-5 w-7 items-center justify-center rounded-full text-[9px] font-bold leading-none transition-colors',
                model.selectedRows === rows
                  ? 'bg-emerald-400 text-neutral-950 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                  : 'bg-neutral-950/70 text-neutral-400 ring-1 ring-white/10 hover:bg-white/10 hover:text-white',
                'disabled:cursor-not-allowed disabled:opacity-45',
              )}
              aria-pressed={model.selectedRows === rows}
              aria-label={`${rows} lines`}
            >
              {rows}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

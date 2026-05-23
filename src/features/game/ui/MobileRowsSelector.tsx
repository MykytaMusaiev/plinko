'use client';

import { clsx } from 'clsx';
import type { BetControlsModel } from '../model/useBetControlsModel';

interface MobileRowsSelectorProps {
  model: BetControlsModel;
}

export function MobileRowsSelector({ model }: MobileRowsSelectorProps) {
  return (
    <div className="pointer-events-none absolute right-0 top-1 z-10 lg:hidden sm:right-3 sm:top-4">
      <div className="pointer-events-auto flex w-[4.25rem] flex-col items-center gap-1 rounded-md border border-white/10 bg-neutral-950/65 p-1 shadow-lg backdrop-blur">
        <span className="text-[8px] font-bold uppercase leading-none text-neutral-500">
          Lines
        </span>
        <div className="grid grid-cols-3 gap-0.5">
          {model.rowValues.map((rows) => (
            <button
              key={rows}
              type="button"
              onClick={() => model.setSelectedRows(rows)}
              disabled={model.isDisabled}
              className={clsx(
                'flex h-[1.125rem] w-5 items-center justify-center rounded text-[9px] font-bold leading-none transition-colors',
                model.selectedRows === rows
                  ? 'bg-emerald-400 text-neutral-950 shadow-[0_0_10px_rgba(52,211,153,0.28)]'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-white',
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

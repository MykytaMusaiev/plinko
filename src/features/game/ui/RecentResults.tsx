'use client';

import { clsx } from 'clsx';
import { useGameStore } from '../model/game.store';
import type { PlinkoResultTone, PlinkoStoryEntry } from '../model/resultFeedback.model';

const FEEDBACK_TONE_CLASSES: Record<PlinkoResultTone, string> = {
  'break-even': 'border-amber-300/35 bg-amber-300/12 text-amber-100',
  loss: 'border-red-400/35 bg-red-500/12 text-red-100',
  win: 'border-emerald-300/35 bg-emerald-400/12 text-emerald-100',
};

export function RecentResults() {
  const storyEntries = useGameStore((s) => s.storyEntries);
  const latestResultFeedback = useGameStore((s) => s.latestResultFeedback);

  if (storyEntries.length === 0 && !latestResultFeedback) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <style>
        {`
          @keyframes plinko-story-entry {
            0% { opacity: 0; transform: translateY(-8px) scale(0.94); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          @keyframes plinko-result-cue {
            0% { opacity: 0; transform: translateY(8px) scale(0.96); }
            16% { opacity: 1; transform: translateY(0) scale(1); }
            72% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-8px) scale(0.98); }
          }
        `}
      </style>

      <div
        aria-label="Recent Plinko results"
        className="absolute right-2 top-2 flex w-14 flex-col items-stretch gap-1.5 sm:right-4 sm:top-4 sm:w-16"
      >
        {storyEntries.map((entry) => (
          <StoryPill entry={entry} key={entry.id} />
        ))}
      </div>

      {latestResultFeedback ? (
        <ResultCue entry={latestResultFeedback} key={latestResultFeedback.id} />
      ) : null}
    </div>
  );
}

function StoryPill({ entry }: { entry: PlinkoStoryEntry }) {
  return (
    <span
      className="flex h-7 items-center justify-center rounded-md border px-1.5 text-[10px] font-black leading-none sm:h-8 sm:text-xs"
      style={{
        animation: 'plinko-story-entry 160ms ease-out both',
        background: entry.bucketStyle.background,
        borderColor: entry.bucketStyle.borderColor,
        boxShadow: `0 0 18px ${entry.bucketStyle.shadowColor}`,
        color: entry.bucketStyle.color,
      }}
      title={`${entry.deltaLabel} credits`}
    >
      {entry.multiplierLabel}
    </span>
  );
}

function ResultCue({ entry }: { entry: PlinkoStoryEntry }) {
  return (
    <div
      aria-live="polite"
      className={clsx(
        'absolute left-2 top-2 rounded-md border px-2.5 py-1.5 shadow-[0_14px_32px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:left-4 sm:top-4',
        FEEDBACK_TONE_CLASSES[entry.tone],
      )}
      style={{ animation: 'plinko-result-cue 1400ms ease-out both' }}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-sm font-black leading-none sm:text-base">
          {entry.deltaLabel}
        </span>
        <span className="text-[10px] font-black uppercase leading-none tracking-wide opacity-75 sm:text-xs">
          {entry.multiplierLabel}
        </span>
      </div>
    </div>
  );
}

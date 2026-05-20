'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import type { BetResponse } from '@/shared/types/api.types';

const PEG_GAP = 36;
const ROW_H = 40;
const PEG_R = 4;
const BALL_R = 9;
const PAD_TOP = 20;
const STEP_MS = 62;

interface Waypoint {
  x: number;
  y: number;
  hitRow?: number;
  hitPeg?: number;
}

function buildWaypoints(path: string, centerX: number): Waypoint[] {
  const rows = path.length;
  const wps: Waypoint[] = [];

  wps.push({ x: centerX, y: PAD_TOP - BALL_R - 6 });

  let rCount = 0;
  for (let r = 0; r < rows; r++) {
    const pegX = centerX + (rCount - (r + 1) / 2) * PEG_GAP;
    const pegY = PAD_TOP + r * ROW_H;
    wps.push({ x: pegX, y: pegY, hitRow: r, hitPeg: rCount });

    if (path[r] === 'R') rCount++;

    const nextX =
      r + 1 < rows
        ? centerX + (rCount - (r + 2) / 2) * PEG_GAP
        : centerX + (rCount - rows / 2) * PEG_GAP;

    wps.push({ x: (pegX + nextX) / 2, y: pegY + ROW_H / 2 });
  }

  wps.push({
    x: centerX + (rCount - path.length / 2) * PEG_GAP,
    y: PAD_TOP + path.length * ROW_H + 20,
  });

  return wps;
}

interface PegGridProps {
  rows: number;
  lastResult: BetResponse | null;
  onAnimationComplete: (result: BetResponse) => void;
}

export function PegGrid({ rows, lastResult, onAnimationComplete }: PegGridProps) {
  const containerWidth = (rows + 3) * PEG_GAP;
  const containerHeight = PAD_TOP + rows * ROW_H + 60;
  const centerX = containerWidth / 2;

  const onAnimationCompleteRef = useRef(onAnimationComplete);

  const [ballVisible, setBallVisible] = useState(false);
  const [ballPos, setBallPos] = useState({ x: centerX, y: PAD_TOP - BALL_R - 6 });
  const [hitPeg, setHitPeg] = useState<{ row: number; peg: number } | null>(null);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    if (!lastResult) return;

    const wps = buildWaypoints(lastResult.path, centerX);
    const timeoutIds: number[] = [];
    let step = 0;
    let cancelled = false;

    const schedule = (callback: () => void, delay: number): void => {
      const timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          callback();
        }
      }, delay);

      timeoutIds.push(timeoutId);
    };

    const tick = () => {
      step++;

      if (step >= wps.length) {
        schedule(() => {
          setBallVisible(false);
          onAnimationCompleteRef.current(lastResult);
        }, 900);

        return;
      }

      const wp = wps[step];

      setBallPos({ x: wp.x, y: wp.y });
      setHitPeg(
        wp.hitRow !== undefined && wp.hitPeg !== undefined
          ? { row: wp.hitRow, peg: wp.hitPeg }
          : null,
      );

      schedule(tick, STEP_MS);
    };

    schedule(() => {
      setBallPos(wps[0]);
      setBallVisible(true);
      setHitPeg(null);
      schedule(tick, 80);
    }, 0);

    return () => {
      cancelled = true;
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [lastResult, centerX]);

  const pegs: Array<{ r: number; p: number; x: number; y: number }> = [];

  for (let r = 0; r < rows; r++) {
    for (let p = 0; p <= r + 1; p++) {
      pegs.push({
        r,
        p,
        x: centerX + (p - (r + 1) / 2) * PEG_GAP,
        y: PAD_TOP + r * ROW_H,
      });
    }
  }

  return (
    <div
      style={{ width: containerWidth, height: containerHeight }}
      className="relative mx-auto select-none"
    >
      {pegs.map(({ r, p, x, y }) => {
        const isHit = hitPeg?.row === r && hitPeg?.peg === p;

        return (
          <div
            key={`${r}-${p}`}
            className={clsx(
              'absolute rounded-full transition-all',
              isHit
                ? 'bg-white scale-[1.8] shadow-[0_0_10px_3px_rgba(255,255,255,0.55)]'
                : 'bg-neutral-500/80',
            )}
            style={{
              width: PEG_R * 2,
              height: PEG_R * 2,
              left: x - PEG_R,
              top: y - PEG_R,
              transitionDuration: isHit ? '30ms' : '150ms',
            }}
          />
        );
      })}

      <AnimatePresence>
        {ballVisible && (
          <motion.div
            key="ball"
            initial={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.15 } }}
            animate={{
              x: ballPos.x - BALL_R,
              y: ballPos.y - BALL_R,
              opacity: 1,
              scale: hitPeg ? [1, 1.25, 0.9, 1] : 1,
            }}
            transition={{
              x: { duration: STEP_MS / 1000, ease: 'easeOut' },
              y: { duration: STEP_MS / 1000, ease: 'easeIn' },
              opacity: { duration: 0.18 },
              scale: { duration: 0.08 },
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: BALL_R * 2,
              height: BALL_R * 2,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 30%, #ffffff, #4ade80 60%, #16a34a)',
              boxShadow:
                '0 0 14px 5px rgba(74,222,128,0.45), inset 0 1px 2px rgba(255,255,255,0.5)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
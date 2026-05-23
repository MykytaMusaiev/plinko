'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import type { BetResponse } from '@/shared/types/api.types';
import type { BoardGeometry, Waypoint } from '../lib/boardGeometry';

const STEP_MS = 62;

function buildWaypoints(path: string, geometry: BoardGeometry): Waypoint[] {
  const rows = path.length;
  const wps: Waypoint[] = [];

  wps.push({
    x: geometry.centerX,
    y: geometry.padTop - geometry.ballRadius - 6,
  });

  let rCount = 0;
  for (let r = 0; r < rows; r++) {
    const peg = geometry.pegRows[r]?.[rCount];
    if (!peg) break;

    wps.push({ x: peg.x, y: peg.y, hitRow: r, hitPeg: rCount });

    if (path[r] === 'R') rCount++;

    const nextPoint =
      r + 1 < rows
        ? geometry.pegRows[r + 1]?.[rCount]
        : geometry.landingColumns[rCount];

    if (nextPoint) {
      wps.push({
        x: (peg.x + nextPoint.x) / 2,
        y: peg.y + geometry.rowGap / 2,
      });
    }
  }

  const landingColumn = geometry.landingColumns[rCount];
  if (landingColumn) {
    wps.push({ x: landingColumn.x, y: geometry.landingY });
  }

  return wps;
}

interface PegGridProps {
  geometry: BoardGeometry;
  lastResult: BetResponse | null;
  onAnimationComplete: (result: BetResponse) => void;
}

export function PegGrid({ geometry, lastResult, onAnimationComplete }: PegGridProps) {
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  const [ballVisible, setBallVisible] = useState(false);
  const [ballPos, setBallPos] = useState({
    x: geometry.centerX,
    y: geometry.padTop - geometry.ballRadius - 6,
  });
  const [hitPeg, setHitPeg] = useState<{ row: number; peg: number } | null>(null);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    if (!lastResult) return;

    const wps = buildWaypoints(lastResult.path, geometry);
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
  }, [lastResult, geometry]);

  return (
    <div
      style={{ width: geometry.width, height: geometry.pegGridHeight }}
      className="relative mx-auto shrink-0 select-none"
    >
      {geometry.pegs.map(({ row, peg, x, y }) => {
        const isHit = hitPeg?.row === row && hitPeg?.peg === peg;

        return (
          <div
            key={`${row}-${peg}`}
            className={clsx(
              'absolute rounded-full transition-all',
              isHit
                ? 'bg-white scale-[1.8] shadow-[0_0_10px_3px_rgba(255,255,255,0.55)]'
                : 'bg-neutral-500/80',
            )}
            style={{
              width: geometry.pegRadius * 2,
              height: geometry.pegRadius * 2,
              left: x - geometry.pegRadius,
              top: y - geometry.pegRadius,
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
              x: ballPos.x - geometry.ballRadius,
              y: ballPos.y - geometry.ballRadius,
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
              width: geometry.ballRadius * 2,
              height: geometry.ballRadius * 2,
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

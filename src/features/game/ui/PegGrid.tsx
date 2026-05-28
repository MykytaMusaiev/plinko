'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import type { BetResponse } from '@/shared/types/api.types';
import type { VisualRound } from '../model/game.store';
import {
  getBucketLandingTarget,
  getLaneContactTarget,
  type BoardGeometry,
  type Waypoint,
} from '../lib/boardGeometry';

const STEP_MS = 62;
const BALL_SETTLE_MS = 140;

function buildWaypoints(result: BetResponse, geometry: BoardGeometry): Waypoint[] {
  const { path } = result;
  const rows = path.length;
  const wps: Waypoint[] = [];
  const resultLandingTarget = getBucketLandingTarget(geometry, result.bucketIndex);

  wps.push({
    x: geometry.centerX,
    y: geometry.padTop - geometry.ballRadius - 6,
  });

  let laneIndex = 0;
  for (let r = 0; r < rows; r++) {
    const lane = geometry.laneRows[r]?.[laneIndex];
    if (!lane) break;

    wps.push({ x: lane.x, y: lane.y });

    const direction = path[r];
    const contactTarget = getLaneContactTarget(geometry, r, laneIndex, direction);

    if (contactTarget) {
      wps.push(contactTarget);
    }

    if (direction === 'R') laneIndex++;
  }

  if (resultLandingTarget) {
    wps.push({ x: resultLandingTarget.x, y: resultLandingTarget.y });
  }

  return wps;
}

interface PegGridProps {
  geometry: BoardGeometry;
  rounds: VisualRound[];
  onAnimationComplete: (round: VisualRound) => void;
}

interface AnimatedBallProps {
  geometry: BoardGeometry;
  round: VisualRound;
  onAnimationComplete: (round: VisualRound) => void;
  onPegHit: (roundId: string, hitPeg: { row: number; peg: number } | null) => void;
}

function AnimatedBall({
  geometry,
  round,
  onAnimationComplete,
  onPegHit,
}: AnimatedBallProps) {
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const onPegHitRef = useRef(onPegHit);
  const [ballVisible, setBallVisible] = useState(false);
  const [ballPos, setBallPos] = useState({
    x: geometry.centerX,
    y: geometry.padTop - geometry.ballRadius - 6,
  });
  const [isHitSettling, setIsHitSettling] = useState(false);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    onPegHitRef.current = onPegHit;
  }, [onPegHit]);

  useEffect(() => {
    const wps = buildWaypoints(round.result, geometry);
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
          onAnimationCompleteRef.current(round);
        }, BALL_SETTLE_MS);

        return;
      }

      const wp = wps[step];
      const nextHit =
        wp.hitRow !== undefined && wp.hitPeg !== undefined
          ? { row: wp.hitRow, peg: wp.hitPeg }
          : null;

      setBallPos({ x: wp.x, y: wp.y });
      setIsHitSettling(Boolean(nextHit));
      onPegHitRef.current(round.roundId, nextHit);

      schedule(tick, STEP_MS);
    };

    schedule(() => {
      setBallPos(wps[0]);
      setBallVisible(true);
      setIsHitSettling(false);
      onPegHitRef.current(round.roundId, null);
      schedule(tick, 80);
    }, 0);

    return () => {
      cancelled = true;
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      onPegHitRef.current(round.roundId, null);
    };
  }, [geometry, round]);

  return (
    <AnimatePresence>
      {ballVisible && (
        <motion.div
          key={round.roundId}
          initial={{ opacity: 0, scale: 0.3 }}
          exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.15 } }}
          animate={{
            x: ballPos.x - geometry.ballRadius,
            y: ballPos.y - geometry.ballRadius,
            opacity: 1,
            scale: isHitSettling ? [1, 1.25, 0.9, 1] : 1,
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
  );
}

export function PegGrid({ geometry, rounds, onAnimationComplete }: PegGridProps) {
  const [hitPegs, setHitPegs] = useState<Record<string, { row: number; peg: number }>>({});

  const handlePegHit = (
    roundId: string,
    hitPeg: { row: number; peg: number } | null,
  ) => {
    setHitPegs((current) => {
      const next = { ...current };

      if (hitPeg) {
        next[roundId] = hitPeg;
      } else {
        delete next[roundId];
      }

      return next;
    });
  };

  return (
    <div
      style={{ width: geometry.width, height: geometry.pegGridHeight }}
      className="relative mx-auto shrink-0 select-none"
    >
      {geometry.pegs.map(({ row, peg, x, y }) => {
        const isHit = Object.values(hitPegs).some(
          (hitPeg) => hitPeg.row === row && hitPeg.peg === peg,
        );

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

      {rounds.map((round) => (
        <AnimatedBall
          key={round.roundId}
          geometry={geometry}
          round={round}
          onAnimationComplete={onAnimationComplete}
          onPegHit={handlePegHit}
        />
      ))}
    </div>
  );
}

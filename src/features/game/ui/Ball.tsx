'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import type { BoardGeometry } from '../lib/boardGeometry';
import type { VisualAnimationPlan, VisualContact } from '../lib/visualWaypoints';

interface BallProps {
  geometry: BoardGeometry;
  plan: VisualAnimationPlan;
  onComplete: () => void;
}

function getTimes(count: number): number[] {
  if (count <= 1) {
    return [0];
  }

  return Array.from({ length: count }, (_, index) =>
    Number((index / (count - 1)).toFixed(4)),
  );
}

function getContactPulseTimes(time: number): number[] {
  const start = Math.max(0, time - 0.025);
  const peak = Math.min(1, time + 0.018);
  const end = Math.min(1, time + 0.075);

  return [0, start, peak, end, 1];
}

function ContactPulse({
  contact,
  durationSeconds,
  geometry,
}: {
  contact: VisualContact;
  durationSeconds: number;
  geometry: BoardGeometry;
}) {
  const size = Math.max(geometry.pegRadius * 4.2, 14);
  const pulseTimes = getContactPulseTimes(contact.time);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full border border-white/55"
      initial={{ opacity: 0, scale: 0.35 }}
      animate={{
        opacity: [0, 0, 0.7, 0, 0],
        scale: [0.35, 0.35, 1.35, 1.85, 1.85],
      }}
      transition={{
        duration: durationSeconds,
        ease: 'easeOut',
        times: pulseTimes,
      }}
      style={{
        width: size,
        height: size,
        left: contact.x - size / 2,
        top: contact.y - size / 2,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
    />
  );
}

export function Ball({ geometry, plan, onComplete }: BallProps) {
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const durationSeconds = plan.durationMs / 1000;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;

    const fallbackId = window.setTimeout(() => {
      if (completedRef.current) return;

      completedRef.current = true;
      onCompleteRef.current();
    }, plan.durationMs + plan.settleMs);

    return () => window.clearTimeout(fallbackId);
  }, [plan.durationMs, plan.settleMs]);

  const keyframes = useMemo(() => {
    const x = plan.waypoints.map((waypoint) => waypoint.x - geometry.ballRadius);
    const y = plan.waypoints.map((waypoint) => waypoint.y - geometry.ballRadius);
    const times = getTimes(plan.waypoints.length);

    return { x, y, times };
  }, [geometry.ballRadius, plan.waypoints]);

  const handleAnimationComplete = () => {
    if (completedRef.current) return;

    completedRef.current = true;
    onCompleteRef.current();
  };

  return (
    <>
      {plan.contacts.map((contact) => (
        <ContactPulse
          key={contact.id}
          contact={contact}
          durationSeconds={durationSeconds}
          geometry={geometry}
        />
      ))}

      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        initial={{
          x: keyframes.x[0] ?? 0,
          y: keyframes.y[0] ?? 0,
          opacity: 0,
          scale: plan.style === 'compressed' ? 0.82 : 0.9,
        }}
        animate={{
          x: keyframes.x,
          y: keyframes.y,
          opacity: 1,
          scale: plan.style === 'compressed' ? [0.82, 1, 0.96, 1] : [0.9, 1, 1.04, 0.98, 1],
        }}
        exit={{ opacity: 0, scale: 0.82, transition: { duration: 0.12 } }}
        transition={{
          x: {
            duration: durationSeconds,
            ease: 'easeInOut',
            times: keyframes.times,
          },
          y: {
            duration: durationSeconds,
            ease: 'easeIn',
            times: keyframes.times,
          },
          opacity: { duration: 0.12 },
          scale: { duration: durationSeconds, ease: 'easeOut' },
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{
          top: 0,
          left: 0,
          width: geometry.ballRadius * 2,
          height: geometry.ballRadius * 2,
          background:
            'radial-gradient(circle at 34% 28%, #ffffff 0%, #d9ffe8 20%, #4ade80 58%, #148243 100%)',
          boxShadow:
            '0 5px 12px rgba(0,0,0,0.38), inset 0 1px 2px rgba(255,255,255,0.62)',
          pointerEvents: 'none',
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      />
    </>
  );
}

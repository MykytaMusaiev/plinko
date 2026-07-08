import type { BetResponse, Risk } from '@/shared/types/api.types';
import {
  getCanvasBucketDomStyle,
  type BucketDomStyle,
} from '../renderer/canvas/bucket-style';

export const PLINKO_STORY_ENTRY_LIMIT = 5;

export type PlinkoResultTone = 'break-even' | 'loss' | 'win';

export interface PlinkoStoryEntry {
  amount: string;
  betId: string;
  bucketIndex: number;
  bucketStyle: BucketDomStyle;
  completedAt: number;
  delta: string;
  deltaLabel: string;
  id: string;
  multiplier: string;
  multiplierLabel: string;
  payout: string;
  risk: Risk;
  rows: number;
  tone: PlinkoResultTone;
}

interface CreatePlinkoStoryEntryInput {
  completedAt: number;
  result: BetResponse;
  roundId: string;
}

export function createPlinkoStoryEntry({
  completedAt,
  result,
  roundId,
}: CreatePlinkoStoryEntryInput): PlinkoStoryEntry {
  const delta = (BigInt(result.payout) - BigInt(result.amount)).toString();

  return {
    amount: result.amount,
    betId: result.betId,
    bucketIndex: result.bucketIndex,
    bucketStyle: getCanvasBucketDomStyle(result.bucketIndex, result.rows + 1),
    completedAt,
    delta,
    deltaLabel: formatSignedCredits(delta),
    id: roundId,
    multiplier: result.multiplier,
    multiplierLabel: formatMultiplierLabel(result.multiplier),
    payout: result.payout,
    risk: result.risk,
    rows: result.rows,
    tone: getResultTone(delta),
  };
}

export function addPlinkoStoryEntry(
  current: readonly PlinkoStoryEntry[],
  entry: PlinkoStoryEntry,
  limit = PLINKO_STORY_ENTRY_LIMIT,
): PlinkoStoryEntry[] {
  return [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, limit);
}

export function formatSignedCredits(raw: string): string {
  const value = BigInt(raw);

  if (value === 0n) {
    return '0.00';
  }

  const sign = value > 0n ? '+' : '-';
  const absolute = value > 0n ? value : -value;
  const whole = absolute / 1_000_000n;
  const frac = (absolute % 1_000_000n).toString().padStart(6, '0').slice(0, 2);

  return `${sign}${whole.toLocaleString()}.${frac}`;
}

function getResultTone(delta: string): PlinkoResultTone {
  const value = BigInt(delta);

  if (value > 0n) return 'win';
  if (value < 0n) return 'loss';
  return 'break-even';
}

function formatMultiplierLabel(multiplier: string): string {
  const numeric = Number(multiplier);

  if (!Number.isFinite(numeric)) {
    return `${multiplier}x`;
  }

  return `${Number.isInteger(numeric) ? numeric.toFixed(0) : String(numeric)}x`;
}

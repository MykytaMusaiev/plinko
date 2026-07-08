import { describe, expect, it } from 'vitest';
import type { BetResponse } from '@/shared/types/api.types';
import {
  addPlinkoStoryEntry,
  createPlinkoStoryEntry,
  formatSignedCredits,
} from './resultFeedback.model';

function createBetResult(overrides: Partial<BetResponse> = {}): BetResponse {
  return {
    betId: 'bet-1',
    amount: '1000000',
    rows: 8,
    risk: 'LOW',
    path: 'LLLLLLLL',
    bucketIndex: 0,
    multiplier: '1',
    payout: '1000000',
    balanceAfter: '10000000',
    seed: {
      serverSeedHash: 'hash',
      clientSeed: 'client',
      nonce: 1,
    },
    ...overrides,
  };
}

describe('resultFeedback.model', () => {
  it('derives win, loss, and break-even result entries from bet response values', () => {
    expect(
      createPlinkoStoryEntry({
        completedAt: 100,
        result: createBetResult({
          amount: '2000000',
          multiplier: '1.5',
          payout: '3000000',
        }),
        roundId: 'round-win',
      }),
    ).toMatchObject({
      delta: '1000000',
      deltaLabel: '+1.00',
      multiplierLabel: '1.5x',
      tone: 'win',
    });

    expect(
      createPlinkoStoryEntry({
        completedAt: 100,
        result: createBetResult({
          amount: '2000000',
          multiplier: '0.5',
          payout: '1000000',
        }),
        roundId: 'round-loss',
      }),
    ).toMatchObject({
      delta: '-1000000',
      deltaLabel: '-1.00',
      multiplierLabel: '0.5x',
      tone: 'loss',
    });

    expect(
      createPlinkoStoryEntry({
        completedAt: 100,
        result: createBetResult(),
        roundId: 'round-even',
      }),
    ).toMatchObject({
      delta: '0',
      deltaLabel: '0.00',
      multiplierLabel: '1x',
      tone: 'break-even',
    });
  });

  it('derives story bucket colors from the landed board bucket instead of result tone', () => {
    const entry = createPlinkoStoryEntry({
      completedAt: 100,
      result: createBetResult({
        amount: '2000000',
        bucketIndex: 4,
        multiplier: '0.5',
        payout: '1000000',
        rows: 8,
      }),
      roundId: 'round-center-loss',
    });

    expect(entry.tone).toBe('loss');
    expect(entry.bucketStyle).toEqual({
      background: 'linear-gradient(180deg, #28f774 0%, #18c957 50%, #0f903e 100%)',
      borderColor: '#28f774',
      color: '#07170c',
      shadowColor: 'rgba(40, 247, 116, 0.22)',
    });
  });

  it('keeps story entries newest first, deduped by round id, and capped at five', () => {
    const entries = Array.from({ length: 6 }, (_, index) =>
      createPlinkoStoryEntry({
        completedAt: index,
        result: createBetResult({
          betId: `bet-${index}`,
          bucketIndex: index,
        }),
        roundId: `round-${index}`,
      }),
    ).reduce(
      (current, entry) => addPlinkoStoryEntry(current, entry),
      [] as ReturnType<typeof createPlinkoStoryEntry>[],
    );

    expect(entries.map((entry) => entry.id)).toEqual([
      'round-5',
      'round-4',
      'round-3',
      'round-2',
      'round-1',
    ]);

    const updated = addPlinkoStoryEntry(entries, {
      ...entries[3],
      completedAt: 99,
    });

    expect(updated.map((entry) => entry.id)).toEqual([
      'round-2',
      'round-5',
      'round-4',
      'round-3',
      'round-1',
    ]);
  });

  it('formats signed credit deltas without corrupting negative fractional values', () => {
    expect(formatSignedCredits('1234567')).toBe('+1.23');
    expect(formatSignedCredits('-1234567')).toBe('-1.23');
    expect(formatSignedCredits('0')).toBe('0.00');
  });
});

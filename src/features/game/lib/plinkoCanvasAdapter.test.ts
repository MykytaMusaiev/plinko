import { describe, expect, it } from 'vitest';
import type { BetResponse } from '@/shared/types/api.types';
import { toPlinkoRendererRound } from './plinkoCanvasAdapter';

function createBetResult(overrides: Partial<BetResponse> = {}): BetResponse {
  return {
    betId: 'bet-1',
    amount: '100',
    rows: 8,
    risk: 'LOW',
    path: 'LLLRRRLR',
    bucketIndex: 4,
    multiplier: '1',
    payout: '100',
    balanceAfter: '1000',
    seed: {
      serverSeedHash: 'hash',
      clientSeed: 'client',
      nonce: 1,
    },
    ...overrides,
  };
}

describe('plinkoCanvasAdapter', () => {
  it('maps backend L/R path data into bucket-correct numeric renderer results', () => {
    const round = toPlinkoRendererRound({
      acceptedAt: 100,
      result: createBetResult(),
      roundId: 'round-1',
      turboEnabled: false,
    });

    expect(round.result.results).toEqual([0, 0, 0, 1, 1, 1, 0, 1]);
    expect(round.result.bucketIndex).toBe(4);
    expect(round.result.rowsCount).toBe(8);
    expect(round.result.contractWarnings).toEqual([]);
  });

  it('records warnings and falls back to bucket-correct renderer results when path metadata is inconsistent', () => {
    const round = toPlinkoRendererRound({
      acceptedAt: 100,
      result: createBetResult({ path: 'RR', bucketIndex: 1 }),
      roundId: 'round-1',
      turboEnabled: true,
    });

    expect(round.result.bucketIndex).toBe(1);
    expect(round.result.results).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(round.result.contractWarnings.map((warning) => warning.code)).toEqual([
      'RESULT_LENGTH_MISMATCH',
      'BUCKET_MISMATCH',
    ]);
  });
});

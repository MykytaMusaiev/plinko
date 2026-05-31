import { describe, expect, it } from 'vitest';
import type { BetResponse } from '@/shared/types/api.types';
import {
  createInitialAudioThrottleState,
  getResultSoundId,
  shouldPlayResultSound,
} from './audioPolicy';

function createBetResult(overrides: Partial<BetResponse>): BetResponse {
  return {
    betId: 'bet-1',
    amount: '100',
    rows: 8,
    risk: 'LOW',
    path: 'LLLLLLLL',
    bucketIndex: 0,
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

describe('audioPolicy', () => {
  it('classifies loss, win, and high-win result sounds from bet response fields', () => {
    expect(getResultSoundId(createBetResult({ payout: '50', multiplier: '0.5' }))).toBe(
      'result-loss',
    );
    expect(getResultSoundId(createBetResult({ payout: '200', multiplier: '2' }))).toBe(
      'result-win',
    );
    expect(getResultSoundId(createBetResult({ payout: '1000', multiplier: '10' }))).toBe(
      'result-high-win',
    );
  });

  it('always allows manual result audio', () => {
    const state = createInitialAudioThrottleState();
    const result = createBetResult({ payout: '50', multiplier: '0.5' });

    expect(
      shouldPlayResultSound({
        source: 'manual',
        playbackMode: 'fast',
        result,
        resolvedCount: 1,
        now: 0,
        state,
      }).shouldPlay,
    ).toBe(true);
  });

  it('throttles routine auto fast result audio while allowing high wins', () => {
    const state = createInitialAudioThrottleState();
    const routineResult = createBetResult({ payout: '200', multiplier: '2' });
    const highWinResult = createBetResult({ payout: '1000', multiplier: '10' });

    expect(
      shouldPlayResultSound({
        source: 'auto',
        playbackMode: 'fast',
        result: routineResult,
        resolvedCount: 1,
        now: 0,
        state,
      }).shouldPlay,
    ).toBe(false);

    expect(
      shouldPlayResultSound({
        source: 'auto',
        playbackMode: 'fast',
        result: highWinResult,
        resolvedCount: 2,
        now: 0,
        state,
      }).shouldPlay,
    ).toBe(true);
  });
});

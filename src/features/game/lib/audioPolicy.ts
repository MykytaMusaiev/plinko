import type { BetResponse } from '@/shared/types/api.types';
import type { PlaybackMode } from '../model/game.store';
import type { VisualRoundSource } from './visualPlaybackPolicy';
import type { GameSoundId } from './audioSounds';

const HIGH_WIN_MULTIPLIER = 10;
const AUTO_NORMAL_RESULT_COOLDOWN_MS = 900;
const AUTO_FAST_RESULT_COOLDOWN_MS = 1400;
const AUTO_HIGH_WIN_COOLDOWN_MS = 900;
const AUTO_FAST_RESULT_INTERVAL = 4;

export interface AudioThrottleState {
  lastAutoResultAt: number | null;
  lastHighWinAt: number | null;
}

interface ShouldPlayResultSoundInput {
  source: VisualRoundSource;
  playbackMode: PlaybackMode;
  result: BetResponse;
  resolvedCount: number;
  now: number;
  state: AudioThrottleState;
}

interface ShouldPlayResultSoundOutput {
  shouldPlay: boolean;
  soundId: GameSoundId;
  nextState: AudioThrottleState;
}

export function createInitialAudioThrottleState(): AudioThrottleState {
  return {
    lastAutoResultAt: null,
    lastHighWinAt: null,
  };
}

export function getResultSoundId(result: BetResponse): GameSoundId {
  if (isHighWinResult(result)) {
    return 'result-high-win';
  }

  return BigInt(result.payout) > BigInt(result.amount) ? 'result-win' : 'result-loss';
}

export function shouldPlayResultSound({
  source,
  playbackMode,
  result,
  resolvedCount,
  now,
  state,
}: ShouldPlayResultSoundInput): ShouldPlayResultSoundOutput {
  const soundId = getResultSoundId(result);

  if (source === 'manual') {
    return {
      shouldPlay: true,
      soundId,
      nextState: state,
    };
  }

  const isHighWin = soundId === 'result-high-win';

  if (isHighWin) {
    const shouldPlay =
      state.lastHighWinAt === null ||
      now - state.lastHighWinAt >= AUTO_HIGH_WIN_COOLDOWN_MS;

    return {
      shouldPlay,
      soundId,
      nextState: shouldPlay
        ? {
            lastAutoResultAt: now,
            lastHighWinAt: now,
          }
        : state,
    };
  }

  if (
    playbackMode === 'fast' &&
    resolvedCount % AUTO_FAST_RESULT_INTERVAL !== 0
  ) {
    return {
      shouldPlay: false,
      soundId,
      nextState: state,
    };
  }

  const cooldown =
    playbackMode === 'fast'
      ? AUTO_FAST_RESULT_COOLDOWN_MS
      : AUTO_NORMAL_RESULT_COOLDOWN_MS;
  const shouldPlay =
    state.lastAutoResultAt === null || now - state.lastAutoResultAt >= cooldown;

  return {
    shouldPlay,
    soundId,
    nextState: shouldPlay
      ? {
          ...state,
          lastAutoResultAt: now,
        }
      : state,
  };
}

function isHighWinResult(result: BetResponse): boolean {
  const multiplier = Number(result.multiplier);

  return Number.isFinite(multiplier) && multiplier >= HIGH_WIN_MULTIPLIER;
}

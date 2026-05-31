'use client';

import { useCallback, useEffect } from 'react';
import type { BetResponse } from '@/shared/types/api.types';
import type { PlaybackMode } from './game.store';
import type { GameSoundId } from '../lib/audioSounds';
import { playGameSound, setGameAudioMuted } from '../lib/audioSounds';
import {
  createInitialAudioThrottleState,
  shouldPlayResultSound,
} from '../lib/audioPolicy';
import type { VisualRoundSource } from '../lib/visualPlaybackPolicy';
import { useAudioStore } from './audio.store';

interface PlayResultSoundInput {
  source: VisualRoundSource;
  playbackMode: PlaybackMode;
  result: BetResponse;
  resolvedCount: number;
}

let audioThrottleState = createInitialAudioThrottleState();

export function useGameAudio() {
  const isHydrated = useAudioStore((s) => s.isHydrated);
  const isMuted = useAudioStore((s) => s.isMuted);
  const hydrateMutedPreference = useAudioStore((s) => s.hydrateMutedPreference);
  const setMutedPreference = useAudioStore((s) => s.setMuted);

  useEffect(() => {
    hydrateMutedPreference();
  }, [hydrateMutedPreference]);

  useEffect(() => {
    if (!isHydrated) return;

    setGameAudioMuted(isMuted);
  }, [isHydrated, isMuted]);

  const setMuted = useCallback(
    (nextMuted: boolean) => {
      setGameAudioMuted(nextMuted);
      setMutedPreference(nextMuted);
    },
    [setMutedPreference],
  );

  const playSound = useCallback((soundId: GameSoundId) => {
    playGameSound(soundId);
  }, []);

  const playResultSound = useCallback(
    ({ source, playbackMode, result, resolvedCount }: PlayResultSoundInput) => {
      const decision = shouldPlayResultSound({
        source,
        playbackMode,
        result,
        resolvedCount,
        now: Date.now(),
        state: audioThrottleState,
      });

      audioThrottleState = decision.nextState;

      if (decision.shouldPlay) {
        playGameSound(decision.soundId);
      }
    },
    [],
  );

  return {
    isHydrated,
    isMuted,
    playResultSound,
    playSound,
    setMuted,
  };
}

'use client';

import { Howl, Howler } from 'howler';

export type GameSoundId =
  | 'ui-toggle'
  | 'bet-start'
  | 'ball-drop'
  | 'ball-land'
  | 'result-loss'
  | 'result-win'
  | 'result-high-win'
  | 'auto-start'
  | 'auto-stop';

const SOUND_SOURCES: Record<GameSoundId, string> = {
  'ui-toggle': '/sounds/ui-toggle.mp3',
  'bet-start': '/sounds/bet-start.mp3',
  'ball-drop': '/sounds/ball-drop.mp3',
  'ball-land': '/sounds/ball-land.mp3',
  'result-loss': '/sounds/result-loss.mp3',
  'result-win': '/sounds/result-win.mp3',
  'result-high-win': '/sounds/result-high-win.mp3',
  'auto-start': '/sounds/auto-start.mp3',
  'auto-stop': '/sounds/auto-stop.mp3',
};

const sounds = new Map<GameSoundId, Howl>();

export function setGameAudioMuted(isMuted: boolean) {
  if (!canUseAudio()) return;

  Howler.mute(isMuted);
}

export function playGameSound(soundId: GameSoundId) {
  if (!canUseAudio()) return;

  try {
    getSound(soundId).play();
  } catch {
    // Browsers may reject playback before the first trusted user gesture.
  }
}

function getSound(soundId: GameSoundId): Howl {
  const existing = sounds.get(soundId);

  if (existing) {
    return existing;
  }

  const sound = new Howl({
    src: [SOUND_SOURCES[soundId]],
    preload: true,
    volume: 1,
    onplayerror: () => {
      // Howler will unlock audio after a user gesture on supported browsers.
    },
  });

  sounds.set(soundId, sound);

  return sound;
}

function canUseAudio(): boolean {
  return typeof window !== 'undefined';
}

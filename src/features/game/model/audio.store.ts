'use client';

import { create } from 'zustand';

const AUDIO_MUTED_STORAGE_KEY = 'plinko.audio.muted';

interface AudioState {
  isHydrated: boolean;
  isMuted: boolean;
  hydrateMutedPreference: () => void;
  setMuted: (isMuted: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isHydrated: false,
  isMuted: false,

  hydrateMutedPreference: () => {
    if (typeof window === 'undefined') {
      set({ isHydrated: true });
      return;
    }

    set({
      isHydrated: true,
      isMuted: window.localStorage.getItem(AUDIO_MUTED_STORAGE_KEY) === 'true',
    });
  },

  setMuted: (isMuted) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUDIO_MUTED_STORAGE_KEY, String(isMuted));
    }

    set({ isMuted });
  },
}));

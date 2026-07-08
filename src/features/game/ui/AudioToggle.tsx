'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useGameAudio } from '../model/useGameAudio';

export function AudioToggle() {
  const { isMuted, playSound, setMuted } = useGameAudio();
  const Icon = isMuted ? VolumeX : Volume2;
  const label = isMuted ? 'Unmute sound' : 'Mute sound';

  const handleClick = () => {
    if (isMuted) {
      setMuted(false);
      playSound('ui-toggle');
      return;
    }

    playSound('ui-toggle');
    setMuted(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-neutral-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
    >
      <Icon size={16} aria-hidden />
    </button>
  );
}

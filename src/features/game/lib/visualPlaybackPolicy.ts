export type VisualRoundSource = 'manual' | 'auto';
export type VisualPlaybackStyle = 'full' | 'compressed';
export type AutoPacingPlaybackMode = 'normal' | 'fast';

export const AUTO_FULL_DROP_LIMIT = 1;
export const AUTO_NORMAL_REQUEST_PACE_MS = 900;

interface SelectVisualPlaybackStyleInput {
  source: VisualRoundSource;
  activeFullAutoRounds: number;
}

export function selectVisualPlaybackStyle({
  source,
  activeFullAutoRounds,
}: SelectVisualPlaybackStyleInput): VisualPlaybackStyle {
  if (source === 'manual') {
    return 'full';
  }

  return activeFullAutoRounds < AUTO_FULL_DROP_LIMIT ? 'full' : 'compressed';
}

export function getAutoRequestPaceMs(
  playbackMode: AutoPacingPlaybackMode,
): number {
  return playbackMode === 'normal' ? AUTO_NORMAL_REQUEST_PACE_MS : 0;
}

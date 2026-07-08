import type { PlaybackMode } from '../model/game.store';
import type {
  VisualPlaybackStyle,
  VisualRoundSource,
} from './visualPlaybackPolicy';

export type CanvasRoundPlayback =
  | 'bucket-feedback'
  | 'normal-canvas'
  | 'quick-settle';

interface GetCanvasRoundPlaybackInput {
  playbackMode: PlaybackMode;
  playbackStyle: VisualPlaybackStyle;
  source: VisualRoundSource;
}

export function getCanvasRoundPlayback({
  playbackMode,
  playbackStyle,
  source,
}: GetCanvasRoundPlaybackInput): CanvasRoundPlayback {
  if (playbackStyle !== 'full') {
    return 'quick-settle';
  }

  if (playbackMode === 'normal') {
    return 'normal-canvas';
  }

  return source === 'manual' ? 'bucket-feedback' : 'quick-settle';
}

import { describe, expect, it } from 'vitest';
import { getCanvasRoundPlayback } from './canvasRoundPlaybackPolicy';

describe('canvasRoundPlaybackPolicy', () => {
  it('animates normal full rounds on the Canvas renderer', () => {
    expect(
      getCanvasRoundPlayback({
        playbackMode: 'normal',
        playbackStyle: 'full',
        source: 'manual',
      }),
    ).toBe('normal-canvas');
  });

  it('uses bucket feedback only for manual fast full rounds', () => {
    expect(
      getCanvasRoundPlayback({
        playbackMode: 'fast',
        playbackStyle: 'full',
        source: 'manual',
      }),
    ).toBe('bucket-feedback');
  });

  it('keeps auto fast and compressed rounds on the quick settlement path', () => {
    expect(
      getCanvasRoundPlayback({
        playbackMode: 'fast',
        playbackStyle: 'full',
        source: 'auto',
      }),
    ).toBe('quick-settle');
    expect(
      getCanvasRoundPlayback({
        playbackMode: 'normal',
        playbackStyle: 'compressed',
        source: 'auto',
      }),
    ).toBe('quick-settle');
  });
});

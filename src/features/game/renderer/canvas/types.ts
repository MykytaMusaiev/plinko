import type {
  PlinkoPlaybackFailureReason,
  PlinkoPlaybackSelection,
} from '../plinko-renderer-types';

export interface PlinkoAnimationPoint {
  x: number;
  y: number;
}

export type PlinkoAnimationPath = readonly PlinkoAnimationPoint[];

export interface PlinkoAnimationLibrary {
  buckets: ReadonlyMap<number, readonly PlinkoAnimationPath[]>;
  rowsCount: number;
}

export interface CanvasTrajectorySelection {
  kind: 'failure' | 'success';
  path?: PlinkoAnimationPath;
  selection: PlinkoPlaybackSelection;
}

export type CanvasPlaybackFailureReason = Extract<
  PlinkoPlaybackFailureReason,
  | 'canvas-animation-load-failed'
  | 'canvas-animation-parse-failed'
  | 'canvas-bucket-mismatch'
  | 'canvas-draw-failed'
  | 'canvas-result-invalid'
  | 'canvas-trajectory-missing'
>;

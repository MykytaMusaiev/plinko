import type { Risk } from '@/shared/types/api.types';

export type PlinkoPathStep = 0 | 1;

export type PlinkoResultContractWarningCode =
  | 'BUCKET_MISMATCH'
  | 'BUCKET_OUT_OF_RANGE'
  | 'INVALID_PATH_STEP'
  | 'RESULT_LENGTH_MISMATCH';

export interface PlinkoResultContractWarning {
  code: PlinkoResultContractWarningCode;
  message: string;
}

export interface PlinkoRendererBetResult {
  amount: string;
  betId: string;
  bucketIndex: number;
  contractWarnings: PlinkoResultContractWarning[];
  multiplier: string;
  payout: string;
  results: PlinkoPathStep[];
  risk: Risk;
  rows: number;
  rowsCount: number;
}

export interface PlinkoRendererBoardState {
  bucketMultipliers: readonly number[];
  risk: Risk;
  rowsCount: number;
}

export interface PlinkoRendererRound {
  acceptedAt: number;
  id: string;
  result: PlinkoRendererBetResult;
  turboEnabled: boolean;
}

export interface PlinkoPlaybackSelection {
  animationStatus: string;
  failureReason: PlinkoPlaybackFailureReason | null;
  pathLength: number;
  pathValid: boolean;
  risk: Risk;
  rowsCount: number;
  source: 'canvas-json';
  targetBucket: number;
  turboEnabled: boolean;
  variantIndex: number | null;
}

export type PlinkoRendererSettlementReason = 'fallback' | 'visual';

export type PlinkoPlaybackLifecyclePhase =
  | 'accepted'
  | 'completed'
  | 'playback-failed'
  | 'queued'
  | 'simulated'
  | 'started';

export type PlinkoPlaybackFailureReason =
  | 'board-geometry-missing'
  | 'canvas-animation-load-failed'
  | 'canvas-animation-parse-failed'
  | 'canvas-bucket-mismatch'
  | 'canvas-draw-failed'
  | 'canvas-result-invalid'
  | 'canvas-trajectory-missing'
  | 'renderer-destroyed'
  | 'renderer-duplicate-already-active';

export type PlinkoRendererEnqueueResult =
  | {
      playbackId: string;
      reason: null;
      retryable: false;
      status: 'accepted';
    }
  | {
      playbackId: string;
      reason: 'renderer-duplicate-already-active';
      retryable: false;
      status: 'already-active';
    }
  | {
      playbackId: null;
      reason: 'board-geometry-missing';
      retryable: true;
      status: 'not-ready';
    }
  | {
      playbackId: null;
      reason: 'renderer-destroyed';
      retryable: false;
      status: 'rejected';
    };

export interface PlinkoPlaybackLifecycleEvent {
  backendBetId: string;
  elapsedSinceAcceptedMs: number;
  failureReason: PlinkoPlaybackFailureReason | null;
  geometryRevision: number | null;
  phase: PlinkoPlaybackLifecyclePhase;
  playbackId: string;
  retryCount: number;
  roundId: string;
  rowsCount: number;
  risk: Risk;
  selection: PlinkoPlaybackSelection | null;
  targetBucket: number;
  terminal: boolean;
  turboEnabled: boolean;
}

export interface PlinkoRendererOptions {
  board?: PlinkoRendererBoardState;
  onPlaybackLifecycle?: (event: PlinkoPlaybackLifecycleEvent) => void;
  onRoundSettled?: (
    round: PlinkoRendererRound,
    reason: PlinkoRendererSettlementReason,
  ) => void;
  turboEnabled?: boolean;
}

export interface PlinkoRenderer {
  destroy: () => void;
  resize: () => void;
  setOptions: (options: PlinkoRendererOptions) => void;
  showBucketFeedback: (round: PlinkoRendererRound) => PlinkoRendererEnqueueResult;
  visualizeRound: (round: PlinkoRendererRound) => PlinkoRendererEnqueueResult;
}

import type { BetResponse } from '@/shared/types/api.types';
import { isSupportedPlinkoAnimationRows } from '../renderer/canvas/animation-loader';
import type {
  PlinkoPathStep,
  PlinkoRendererRound,
  PlinkoResultContractWarning,
} from '../renderer/plinko-renderer-types';

interface ToPlinkoRendererRoundInput {
  acceptedAt: number;
  result: BetResponse;
  roundId: string;
  turboEnabled: boolean;
}

export function toPlinkoRendererRound({
  acceptedAt,
  result,
  roundId,
  turboEnabled,
}: ToPlinkoRendererRoundInput): PlinkoRendererRound {
  const { results, warnings } = createRendererResults(result);

  return {
    acceptedAt,
    id: roundId,
    result: {
      amount: result.amount,
      betId: result.betId,
      bucketIndex: result.bucketIndex,
      contractWarnings: warnings,
      multiplier: result.multiplier,
      payout: result.payout,
      results,
      risk: result.risk,
      rows: result.rows,
      rowsCount: result.rows,
    },
    turboEnabled,
  };
}

function createRendererResults(result: BetResponse): {
  results: PlinkoPathStep[];
  warnings: PlinkoResultContractWarning[];
} {
  const warnings: PlinkoResultContractWarning[] = [];
  const parsedPath = parsePath(result.path, warnings);
  const bucketInRange = result.bucketIndex >= 0 && result.bucketIndex <= result.rows;

  if (!isSupportedPlinkoAnimationRows(result.rows)) {
    warnings.push({
      code: 'RESULT_LENGTH_MISMATCH',
      message: `Plinko animation assets do not support ${result.rows} rows.`,
    });
  }

  if (!bucketInRange) {
    warnings.push({
      code: 'BUCKET_OUT_OF_RANGE',
      message: `Backend bucket index ${result.bucketIndex} is outside rows ${result.rows}.`,
    });
  }

  if (parsedPath.length !== result.rows) {
    warnings.push({
      code: 'RESULT_LENGTH_MISMATCH',
      message: `Backend path length ${parsedPath.length} does not match rows ${result.rows}.`,
    });
  }

  const parsedBucket = parsedPath.reduce<number>((sum, step) => sum + step, 0);

  if (parsedPath.length > 0 && parsedBucket !== result.bucketIndex) {
    warnings.push({
      code: 'BUCKET_MISMATCH',
      message: `Backend path resolves to bucket ${parsedBucket}, but result bucket is ${result.bucketIndex}.`,
    });
  }

  const canUseBackendPath =
    bucketInRange &&
    parsedPath.length === result.rows &&
    parsedBucket === result.bucketIndex &&
    warnings.every((warning) => warning.code !== 'INVALID_PATH_STEP');

  return {
    results: canUseBackendPath
      ? parsedPath
      : createBucketCorrectPath(result.rows, result.bucketIndex),
    warnings,
  };
}

function parsePath(
  path: string,
  warnings: PlinkoResultContractWarning[],
): PlinkoPathStep[] {
  const steps: PlinkoPathStep[] = [];

  for (const [index, char] of Array.from(path).entries()) {
    if (char === 'L') {
      steps.push(0);
      continue;
    }

    if (char === 'R') {
      steps.push(1);
      continue;
    }

    warnings.push({
      code: 'INVALID_PATH_STEP',
      message: `Backend path step at index ${index} was ${char} instead of L or R.`,
    });
  }

  return steps;
}

function createBucketCorrectPath(rows: number, bucketIndex: number): PlinkoPathStep[] {
  const safeRows = Math.max(Math.trunc(rows), 0);
  const safeBucket = Math.min(Math.max(Math.trunc(bucketIndex), 0), safeRows);

  return Array.from({ length: safeRows }, (_, index) =>
    index < safeBucket ? 1 : 0,
  );
}

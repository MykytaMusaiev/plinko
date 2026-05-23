const IDEAL_PEG_GAP = 42;
const MIN_PEG_GAP = 16;
const MAX_ROWS = 16;
const MIN_ROWS = 8;
const LOW_ROW_GAP_EXPANSION = 0.48;

const IDEAL_ROW_GAP = 42;
const MIN_ROW_GAP = 18;

const IDEAL_PEG_RADIUS = 5;
const MIN_PEG_RADIUS = 3;

const IDEAL_BALL_RADIUS = 10;
const MIN_BALL_RADIUS = 6;

const IDEAL_PAD_TOP = 24;
const MIN_PAD_TOP = 12;

const IDEAL_BUCKET_HEIGHT = 44;
const MIN_BUCKET_HEIGHT = 30;

const IDEAL_BUCKET_GAP = 8;
const MIN_BUCKET_GAP = 3;

const IDEAL_BUCKET_VERTICAL_GAP = 20;
const MIN_BUCKET_VERTICAL_GAP = 12;

interface BoardGeometryInput {
  rows: number;
  availableWidth?: number;
  availableHeight?: number;
}

export interface BoardPoint {
  x: number;
  y: number;
}

export interface Waypoint extends BoardPoint {
  hitRow?: number;
  hitPeg?: number;
}

export interface PegPosition extends BoardPoint {
  row: number;
  peg: number;
}

export interface LandingColumn extends BoardPoint {
  index: number;
}

export interface BucketGeometry {
  index: number;
  centerX: number;
  centerY: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BoardGeometry {
  rows: number;
  width: number;
  pegGridHeight: number;
  bucketTop: number;
  bucketHeight: number;
  bucketVerticalGap: number;
  pegGap: number;
  rowGap: number;
  pegRadius: number;
  ballRadius: number;
  padTop: number;
  centerX: number;
  landingY: number;
  pegs: PegPosition[];
  pegRows: PegPosition[][];
  landingColumns: LandingColumn[];
  buckets: BucketGeometry[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function scaleValue(value: number, scale: number, min: number): number {
  return Math.max(min, value * scale);
}

function getRowExpansion(rows: number): number {
  return clamp((MAX_ROWS - rows) / (MAX_ROWS - MIN_ROWS), 0, 1);
}

function getMaxPegGap(rows: number): number {
  return IDEAL_PEG_GAP * (1 + getRowExpansion(rows) * LOW_ROW_GAP_EXPANSION);
}

function getScaledMetrics(pegGap: number) {
  const scale = pegGap / IDEAL_PEG_GAP;

  return {
    rowGap: scaleValue(IDEAL_ROW_GAP, scale, MIN_ROW_GAP),
    pegRadius: scaleValue(IDEAL_PEG_RADIUS, scale, MIN_PEG_RADIUS),
    ballRadius: scaleValue(IDEAL_BALL_RADIUS, scale, MIN_BALL_RADIUS),
    padTop: scaleValue(IDEAL_PAD_TOP, scale, MIN_PAD_TOP),
    bucketHeight: scaleValue(IDEAL_BUCKET_HEIGHT, scale, MIN_BUCKET_HEIGHT),
    bucketGap: scaleValue(IDEAL_BUCKET_GAP, scale, MIN_BUCKET_GAP),
    bucketVerticalGap: scaleValue(
      IDEAL_BUCKET_VERTICAL_GAP,
      scale,
      MIN_BUCKET_VERTICAL_GAP,
    ),
  };
}

function getTotalHeight(rows: number, pegGap: number): number {
  const { rowGap, pegRadius, padTop, bucketHeight, bucketVerticalGap } =
    getScaledMetrics(pegGap);

  return padTop + (rows - 1) * rowGap + pegRadius + bucketVerticalGap + bucketHeight;
}

function fitPegGapToAvailableSize(
  rows: number,
  maxPegGap: number,
  availableWidth?: number,
  availableHeight?: number,
): number {
  const widthLimit = availableWidth && availableWidth > 0 ? availableWidth : Infinity;
  const heightLimit = availableHeight && availableHeight > 0 ? availableHeight : Infinity;
  const widthPegGap = widthLimit === Infinity ? maxPegGap : widthLimit / (rows + 3);
  let high = Math.min(maxPegGap, widthPegGap);

  if (heightLimit !== Infinity && getTotalHeight(rows, high) > heightLimit) {
    let low = Math.min(MIN_PEG_GAP, high);

    for (let i = 0; i < 16; i++) {
      const mid = (low + high) / 2;

      if (getTotalHeight(rows, mid) > heightLimit) {
        high = mid;
      } else {
        low = mid;
      }
    }

    return low;
  }

  return high;
}

export function createBoardGeometry({
  rows,
  availableWidth,
  availableHeight,
}: BoardGeometryInput): BoardGeometry {
  const maxPegGap = getMaxPegGap(rows);
  const pegGap = fitPegGapToAvailableSize(
    rows,
    maxPegGap,
    availableWidth,
    availableHeight,
  );
  const {
    rowGap,
    pegRadius,
    ballRadius,
    padTop,
    bucketHeight,
    bucketGap,
    bucketVerticalGap,
  } = getScaledMetrics(pegGap);

  const width = (rows + 3) * pegGap;
  const centerX = width / 2;
  const pegRows: PegPosition[][] = [];
  const pegs: PegPosition[] = [];

  for (let row = 0; row < rows; row++) {
    const rowPegs: PegPosition[] = [];

    for (let peg = 0; peg <= row + 1; peg++) {
      const position = {
        row,
        peg,
        x: centerX + (peg - (row + 1) / 2) * pegGap,
        y: padTop + row * rowGap,
      };

      rowPegs.push(position);
      pegs.push(position);
    }

    pegRows.push(rowPegs);
  }

  const finalPegY = padTop + (rows - 1) * rowGap;
  const bucketTop = finalPegY + pegRadius + bucketVerticalGap;
  const bucketWidth = Math.max(pegGap * 0.72, pegGap - bucketGap);
  const bucketCenterY = bucketHeight / 2;
  const landingY = bucketTop - bucketVerticalGap / 2;

  const landingColumns: LandingColumn[] = Array.from({ length: rows + 1 }, (_, index) => ({
    index,
    x: centerX + (index - rows / 2) * pegGap,
    y: landingY,
  }));

  const buckets: BucketGeometry[] = landingColumns.map((column) => ({
    index: column.index,
    centerX: column.x,
    centerY: bucketCenterY,
    left: column.x - bucketWidth / 2,
    top: 0,
    width: bucketWidth,
    height: bucketHeight,
  }));

  return {
    rows,
    width,
    pegGridHeight: bucketTop,
    bucketTop,
    bucketHeight,
    bucketVerticalGap,
    pegGap,
    rowGap,
    pegRadius,
    ballRadius,
    padTop,
    centerX,
    landingY,
    pegs,
    pegRows,
    landingColumns,
    buckets,
  };
}

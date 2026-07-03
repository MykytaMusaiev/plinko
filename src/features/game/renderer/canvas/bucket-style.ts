type BucketTone = 'amberOrange' | 'deepOrange' | 'green' | 'red' | 'yellow';

export interface BucketVisualStyle {
  darkColor: number;
  highlightColor: number;
  labelColor: string;
  midColor: number;
}

export interface BucketDomStyle {
  background: string;
  borderColor: string;
  color: string;
  shadowColor: string;
}

const BUCKET_STYLES: Record<BucketTone, BucketVisualStyle> = {
  red: {
    darkColor: 0x891111,
    highlightColor: 0xf13636,
    labelColor: '#161111',
    midColor: 0xd82626,
  },
  deepOrange: {
    darkColor: 0x8e3010,
    highlightColor: 0xfc6e16,
    labelColor: '#15100b',
    midColor: 0xd75413,
  },
  amberOrange: {
    darkColor: 0xa93e00,
    highlightColor: 0xfcaf16,
    labelColor: '#161205',
    midColor: 0xe28010,
  },
  yellow: {
    darkColor: 0xbc840c,
    highlightColor: 0xf2dc15,
    labelColor: '#141304',
    midColor: 0xd9b913,
  },
  green: {
    darkColor: 0x0f903e,
    highlightColor: 0x28f774,
    labelColor: '#07170c',
    midColor: 0x18c957,
  },
};

export function getCanvasBucketStyle(
  bucketIndex: number,
  bucketCount: number,
): BucketVisualStyle {
  return BUCKET_STYLES[getBucketTone(bucketIndex, bucketCount)];
}

export function getCanvasBucketDomStyle(
  bucketIndex: number,
  bucketCount: number,
): BucketDomStyle {
  const style = getCanvasBucketStyle(bucketIndex, bucketCount);
  const highlight = toHexColor(style.highlightColor);

  return {
    background: `linear-gradient(180deg, ${highlight} 0%, ${toHexColor(style.midColor)} 50%, ${toHexColor(style.darkColor)} 100%)`,
    borderColor: highlight,
    color: style.labelColor,
    shadowColor: toRgba(style.highlightColor, 0.22),
  };
}

function getBucketTone(bucketIndex: number, bucketCount: number): BucketTone {
  const maxDistance = (bucketCount - 1) / 2;
  const distanceFromCenter = Math.abs(bucketIndex - maxDistance);

  if (distanceFromCenter < 1) {
    return 'green';
  }

  if (distanceFromCenter === maxDistance) {
    return 'red';
  }

  const normalizedDistance = distanceFromCenter / Math.max(maxDistance, 1);

  if (normalizedDistance >= 0.68) {
    return 'deepOrange';
  }

  if (normalizedDistance >= 0.54) {
    return 'amberOrange';
  }

  return 'yellow';
}

export function toHexColor(value: number) {
  return `#${value.toString(16).padStart(6, '0')}`;
}

function toRgba(value: number, alpha: number) {
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

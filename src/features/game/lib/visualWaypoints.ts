import type { BetResponse } from '@/shared/types/api.types';
import {
  getBucketLandingTarget,
  getLaneContactTarget,
  type BoardGeometry,
  type BoardPoint,
} from './boardGeometry';
import type { VisualPlaybackStyle } from './visualPlaybackPolicy';

export interface VisualContact {
  id: string;
  x: number;
  y: number;
  time: number;
}

export interface VisualWaypoint extends BoardPoint {
  contactId?: string;
}

export interface VisualAnimationPlan {
  bucketIndex: number;
  style: VisualPlaybackStyle;
  waypoints: VisualWaypoint[];
  contacts: VisualContact[];
  durationMs: number;
  settleMs: number;
}

const MANUAL_BASE_DURATION_MS = 920;
const MANUAL_ROW_DURATION_MS = 34;
const AUTO_FULL_BASE_DURATION_MS = 660;
const AUTO_FULL_ROW_DURATION_MS = 24;
const SETTLE_MS = 170;
const ENTRY_OFFSET_Y = 10;

function getStartPoint(geometry: BoardGeometry): BoardPoint {
  return {
    x: geometry.centerX,
    y: geometry.padTop - geometry.ballRadius - ENTRY_OFFSET_Y,
  };
}

function getFullDuration(rows: number, source: 'manual' | 'auto'): number {
  return source === 'manual'
    ? MANUAL_BASE_DURATION_MS + rows * MANUAL_ROW_DURATION_MS
    : AUTO_FULL_BASE_DURATION_MS + rows * AUTO_FULL_ROW_DURATION_MS;
}

function getWaypointTimes(waypointCount: number): number[] {
  if (waypointCount <= 1) {
    return [0];
  }

  return Array.from({ length: waypointCount }, (_, index) => {
    const progress = index / (waypointCount - 1);

    return Number(progress.toFixed(4));
  });
}

function buildFullWaypoints(
  result: BetResponse,
  geometry: BoardGeometry,
): VisualWaypoint[] {
  const waypoints: VisualWaypoint[] = [getStartPoint(geometry)];
  let laneIndex = 0;

  for (let row = 0; row < result.path.length; row++) {
    const lane = geometry.laneRows[row]?.[laneIndex];
    if (!lane) break;

    waypoints.push({ x: lane.x, y: lane.y });

    const direction = result.path[row];
    const contactTarget = getLaneContactTarget(geometry, row, laneIndex, direction);

    if (contactTarget) {
      waypoints.push({
        x: contactTarget.x,
        y: contactTarget.y,
        contactId: `${row}-${contactTarget.hitPeg ?? laneIndex}`,
      });
    }

    if (direction === 'R') laneIndex++;
  }

  const landingTarget = getBucketLandingTarget(geometry, result.bucketIndex);

  if (landingTarget) {
    waypoints.push({
      x: landingTarget.x,
      y: Math.max(landingTarget.y - geometry.ballRadius * 0.55, geometry.padTop),
    });
    waypoints.push({ x: landingTarget.x, y: landingTarget.y });
  }

  return waypoints;
}

function buildContacts(
  waypoints: VisualWaypoint[],
  geometry: BoardGeometry,
): VisualContact[] {
  const times = getWaypointTimes(waypoints.length);

  return waypoints.flatMap((waypoint, index) => {
    if (!waypoint.contactId) {
      return [];
    }

    return {
      id: waypoint.contactId,
      x: waypoint.x,
      y: waypoint.y + geometry.ballRadius * 0.25,
      time: times[index] ?? 0,
    };
  });
}

export function createVisualAnimationPlan({
  result,
  geometry,
  style,
  source,
}: {
  result: BetResponse;
  geometry: BoardGeometry;
  style: VisualPlaybackStyle;
  source: 'manual' | 'auto';
}): VisualAnimationPlan {
  const waypoints = buildFullWaypoints(result, geometry);

  return {
    bucketIndex: result.bucketIndex,
    style,
    waypoints,
    contacts: source === 'manual' ? buildContacts(waypoints, geometry) : [],
    durationMs: getFullDuration(result.path.length, source),
    settleMs: SETTLE_MS,
  };
}

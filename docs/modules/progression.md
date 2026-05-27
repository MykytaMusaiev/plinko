Status: Implemented
Owner: Frontend
Source of truth: src/app/api/progression, src/features/progression
Last verified: 2026-05-27
Related files: src/app/api/progression, src/features/progression

# Progression Module

Implemented:

- Browser progression calls use local `/api/progression/*` routes through
  `progressionApi`.
- `GET /api/progression/me` proxies to backend `/api/v1/progression/me` with
  auth through `backendFetch`.
- `POST /api/progression/daily/claim` proxies to backend
  `/api/v1/progression/daily/claim` with auth through `backendFetch`.
- `POST /api/progression/missions/[id]/claim` proxies mission claims to backend
  `/api/v1/progression/missions/{id}/claim` with auth through `backendFetch`.
- Progression BFF routes apply refreshed or cleared auth cookies through shared
  auth cookie helpers.
- `useProgression` owns the `["progression", "me"]` query.
- Daily and mission claim hooks update the progression query cache from
  `response.progression`.
- Daily and mission claim hooks sync the auth-owned user balance from
  `response.reward.balanceAfter`.
- Reward claim hooks invalidate `["profile", "me"]` so profile balance and
  progression summary are refreshed when a profile query is in use.
- The protected `/progression` route renders Progression content inside the
  existing authenticated app shell.
- `ProgressionPageContent` is the feature-local client orchestrator for
  progression query state and reward claim mutations.
- The page renders level, total XP, XP progress toward the next level, daily
  reward credits and XP, current streak, next claim availability, daily
  missions, starter missions, mission progress, and mission credit/XP rewards.
- Daily reward claim UI uses `daily.canClaim` and mutation pending state. When
  `daily.canClaim` is false, the UI renders an unavailable-later state rather
  than a claimed state because the daily DTO does not expose a claimed-specific
  field.
- Mission claim UI uses `mission.claimedAt`, `mission.claimable`, a real
  non-null `mission.id`, and matching mutation pending state. Mission claim
  buttons never call the claim endpoint without a real mission id.
- Mission cards do not use `mission.type` or `mission.status`; those fields
  remain defensive unknowns until the backend contract exposes concrete enum
  values.
- Loading, error/retry, empty mission-section, incomplete, claimable, claiming,
  claimed, and unavailable states are implemented.

Known types:

- `ProgressionRewardResponse.credits` is a string.
- `ProgressionMissionResponse.creditReward` is a string.
- `ClaimedRewardResponse.credits` and `balanceAfter` are strings.
- Numeric XP, level, progress, and target fields remain numbers.

Partial:

- Daily reward claimed-versus-later display remains limited by the current DTO:
  `canClaim: false` is rendered as unavailable later, not as a claimed-specific
  state.

Unverified:

- Mission `type` and `status` enum values are not exposed by OpenAPI. Frontend
  types intentionally keep them as `unknown` until backend/OpenAPI provides
  concrete values.
- Backend error body consistency for progression endpoints.

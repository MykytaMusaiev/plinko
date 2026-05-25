Status: Partial
Owner: Frontend
Source of truth: src/app/api/progression, src/features/progression
Last verified: 2026-05-25
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

Known types:

- `ProgressionRewardResponse.credits` is a string.
- `ProgressionMissionResponse.creditReward` is a string.
- `ClaimedRewardResponse.credits` and `balanceAfter` are strings.
- Numeric XP, level, progress, and target fields remain numbers.

Partial:

- A protected `/progression` route skeleton exists for app-shell navigation.
- No Progression page UI is implemented in this foundation task.

Unverified:

- Mission `type` and `status` enum values are not exposed by OpenAPI. Frontend
  types intentionally keep them as `unknown` until backend/OpenAPI provides
  concrete values.
- Backend error body consistency for progression endpoints.

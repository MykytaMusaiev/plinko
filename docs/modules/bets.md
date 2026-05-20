Status: Partial
Owner: Frontend
Source of truth: src/app/api/bets/route.ts, src/features/game/api/bets.api.ts
Last verified: 2026-05-20
Related files: src/app/api/bets/route.ts, src/features/game/api/bets.api.ts, src/shared/types/api.types.ts

# Bets Module

Implemented:

- Browser bet calls use local `/api/bets`.
- `POST /api/bets` proxies to backend `/api/v1/bets` with auth.
- `GET /api/bets` proxies to backend `/api/v1/bets` with auth and forwards
  query parameters.
- BFF bet routes apply refreshed or cleared auth cookies through shared auth
  cookie helpers.
- `betsApi.place` is used by manual game flow.
- `betsApi.list` exists and supports `limit`, `cursor`, and `rows` query
  parameters.

Known types:

- `CreateBetDto` includes `amount`, `rows`, and `risk`.
- `BetResponse` is marked in code as verified against real POST
  `/api/v1/bets`.
- `BetListResponse` contains `items` and `nextCursor`.

Partial:

- History UI/API integration is not implemented in current files.

Unverified:

- Full GET `/api/v1/bets` response item shape may expand beyond current
  assumptions.

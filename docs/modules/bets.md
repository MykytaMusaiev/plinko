Status: Partial
Owner: Frontend
Source of truth: src/app/api/bets/route.ts, src/features/game/api/bets.api.ts
Last verified: 2026-05-20
Related files: src/app/api/bets/route.ts, src/features/game/api/bets.api.ts, src/shared/types/api.types.ts

# Bets Module

Implemented:

- Browser bet calls use local `/api/bets`.
- `POST /api/bets` is implemented and proxies the request body to backend
  `/api/v1/bets` with auth through `backendFetch`.
- `GET /api/bets` route exists and proxies to backend `/api/v1/bets` with auth.
- The GET route forwards the incoming query string to the backend path.
- BFF bet routes apply refreshed or cleared auth cookies through shared auth
  cookie helpers.
- `betsApi.place` is used by manual game flow.
- `betsApi.list` exists and supports `limit`, `cursor`, and `rows` query
  parameters.

Known types:

- `CreateBetDto` includes `amount`, `rows`, and `risk`.
- `BetResponse` is marked in code as verified against real POST
  `/api/v1/bets`.
- `BetListResponse` is verified against a real authenticated `GET /api/bets`
  response and contains `items` and `nextCursor`.
- `BetListResponse.items` contains list items with `betId`, `amount`, `rows`,
  `risk`, `path`, `bucketIndex`, `multiplier`, `payout`, `balanceAfter`, and
  `createdAt`.
- Observed list values confirm `amount`, `multiplier`, `payout`, and
  `balanceAfter` are strings; `rows` and `bucketIndex` are numbers; `createdAt`
  is a string timestamp.
- The observed list response did not include `seed` on items. `seed` remains
  part of the POST `BetResponse`.
- `nextCursor` is `string | null`; the verified sample observed `null`.
- `BetResponse.balanceAfter` is consumed by the game board to update displayed
  user balance after animation completes.
- `BetResponse.path` is consumed by `PegGrid` to animate the ball path.
- `BetResponse.bucketIndex` is consumed to highlight the winning bucket.

Partial:

- History UI/API integration is not implemented in current files.

Unverified:

- Other possible `risk` values in list responses beyond the existing shared
  `Risk` type were not established by the verified GET sample.
- Non-null `nextCursor` content and cursor semantics remain unverified.
- Additional fields not present in the verified sample remain unverified.

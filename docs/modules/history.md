Status: Planned
Owner: Frontend
Source of truth: src/features/history
Last verified: 2026-05-20
Related files: src/features/history/api/history.api.ts, src/features/history/ui/BetTable.tsx, src/features/history/ui/BetDrawer.tsx

# History Module

Planned:

- History module files exist but are currently empty.
- No implemented history UI behavior is documented in source.
- No implemented history API wrapper is documented in source.

Related existing capability:

- `betsApi.list` can request local `/api/bets` with optional pagination/filter
  parameters.
- `GET /api/bets` exists as a BFF route.

Unverified:

- Final history UX.
- Backend list response details beyond current `BetListResponse`.
- Whether history will use `src/features/history/api/history.api.ts` or reuse
  the existing bets API wrapper.

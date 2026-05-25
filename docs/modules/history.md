Status: Partial
Owner: Frontend
Source of truth: src/features/history
Last verified: 2026-05-20
Related files: src/features/history/api/history.api.ts, src/features/history/ui/BetTable.tsx, src/features/history/ui/BetDrawer.tsx

# History Module

Planned:

- Pagination, load-more, and endless scroll are not implemented.
- Row detail drawer behavior is not implemented.

Implemented:

- `/history` is a separate authenticated App Router page.
- The protected `(game)` app shell bottom navigation handles route switching
  between Game, History, Progression, and Profile.
- The page uses a dark content layout with a top title header, compact filters
  bar, and loading/empty/error/populated states.
- `historyApi.listBets` delegates to the existing `betsApi.list` wrapper, so
  browser code still calls local `/api/bets`.
- TanStack Query owns history list server state.
- The first version requests a bounded list and does not implement pagination.
- Rows filtering is sent through the existing `rows` query parameter.
- Risk filtering is client-side only because backend Risk filtering support is
  not verified.
- Desktop renders a table-like layout; mobile renders compact cards to avoid
  horizontal overflow on narrow screens.

Unverified:

- Backend Risk filtering support.
- Non-null cursor behavior and pagination semantics.
- Row detail drawer requirements.

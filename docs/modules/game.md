Status: Implemented
Owner: Frontend
Source of truth: src/features/game, src/app/api/game/config/route.ts
Last verified: 2026-05-20
Related files: src/features/game, src/app/(game)/game/page.tsx, src/app/api/game/config/route.ts

# Game Module

Implemented:

- Manual game flow is represented in `src/features/game`.
- Game state is stored in Zustand through `useGameStore`.
- Current state includes mode, playing state, recent results, last result,
  winning bucket index, bet amount, risk, and selected rows.
- Game config is loaded from local `/api/game/config` with TanStack Query.
- `/api/game/config` proxies to backend `/api/v1/game/config` without auth.
- Bet placement uses the bets module and updates game state on success.

Current constraints:

- Browser game code must use local BFF routes only.
- Game config shape is defined in `src/shared/types/api.types.ts`.
- Auto mode exists as a state value but no completed automated betting flow is
  documented here.

Unverified:

- Backend payout table semantics beyond the current `GameConfig` TypeScript
  shape.

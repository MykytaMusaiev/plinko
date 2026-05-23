Status: Implemented
Owner: Frontend
Source of truth: src/features/game, src/app/api/game/config/route.ts
Last verified: 2026-05-23
Related files: src/features/game, src/app/(game)/game/page.tsx, src/app/api/game/config/route.ts

# Game Module

Implemented:

- Manual game flow is implemented in `src/features/game`.
- Game state is stored in Zustand through `useGameStore`.
- Current state includes mode, playing state, recent results, last result,
  winning bucket index, bet amount, risk, and selected rows.
- Game config is loaded from local `/api/game/config` with TanStack Query.
- `/api/game/config` proxies to backend `/api/v1/game/config` without auth.
- `useBetControlsModel` owns shared betting control behavior for manual bet
  submission, amount editing, clamping, risk selection, row selection, mode UI,
  pending/playing disabled state, and balance display.
- `BetControls` is the desktop control shell. It uses the shared betting control
  model and preserves the desktop left-rail visual layout.
- `MobileBetHud` is the mobile control shell. It uses the same shared betting
  control model while composing a mobile-first HUD with a centered Bet CTA,
  compact amount strip, compact risk selector, disabled future Auto mode, and
  compact rows/lines selection near the board.
- Manual bet submission is built from the shared model's current amount, rows,
  and risk, then calls `usePlaceBet`.
- `usePlaceBet` calls `betsApi.place`, which posts to local `/api/bets`.
- On successful bet placement, the result is added to recent results, stored as
  `lastResult`, and `isPlaying` is set to true.
- `GameLayout` structures the authenticated game screen into responsive top,
  board, and controls zones. On desktop, it renders the existing `BetControls`
  left rail. On mobile, it keeps the board first and renders `MobileBetHud`
  below the board without duplicating betting state or submit behavior.
- `GameBoard` owns the visual board composition and renders `PegGrid` with the
  attached `MultiplierBar` bucket row directly below it.
- `GameBoard`, `PegGrid`, and `MultiplierBar` share the feature-local board
  geometry model in `src/features/game/lib/boardGeometry.ts`. The model derives
  peg positions, landing columns, bucket centers, bucket dimensions, and
  vertical bucket spacing from selected row count and available board size.
- Board geometry scales progressively by selected row count: lower row counts
  can use larger peg spacing when the container has room, while 16 rows keep the
  dense baseline spacing. The same geometry model is used on desktop and
  mobile; surrounding layout constraints provide the available board size.
- `GameBoard` passes `lastResult` to `PegGrid`.
- `PegGrid` builds animation waypoints from backend-provided
  `BetResponse.path`.
- When animation completes, `GameBoard` updates the displayed user balance from
  backend-provided `balanceAfter`, highlights `bucketIndex`, clears
  `lastResult`, and stops playing state.
- `MultiplierBar` reads `winningBucketIndex` from game state to show the
  winning bucket highlight and renders bucket labels as the attached board
  bucket row.
- `UserHeader` links the History control to the authenticated `/history` page
  and renders the auth-owned Logout control.

Current constraints:

- Browser game code must use local BFF routes only.
- Game config shape is defined in `src/shared/types/api.types.ts`.
- Auto mode is visible as disabled UI/state only; no completed automated
  betting flow is documented here.

Unverified:

- Backend payout table semantics beyond the current `GameConfig` TypeScript
  shape.
- Backend path generation rules beyond the returned `BetResponse.path` string.

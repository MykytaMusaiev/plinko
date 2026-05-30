Status: Implemented
Owner: Frontend
Source of truth: src/features/game, src/app/api/game/config/route.ts
Last verified: 2026-05-28
Related files: src/features/game, src/app/(game)/game/page.tsx, src/app/api/game/config/route.ts

# Game Module

Implemented:

- Manual game flow is implemented in `src/features/game`.
- Game state is stored in Zustand through `useGameStore`.
- Current state includes game mode, playback mode, backend request in-flight
  state, keyed active visual rounds with source and visual playback style,
  latest reveal identity, recent results, Auto settings/runtime state, bet
  amount, risk, and selected rows.
- Game config is loaded from local `/api/game/config` with TanStack Query.
- `/api/game/config` proxies to backend `/api/v1/game/config` without auth.
- `useBetControlsModel` owns shared betting control behavior for manual bet
  submission, Auto start/stop wiring, amount editing, clamping, risk selection,
  row selection, game mode UI, playback mode UI, request/visual disabled state,
  and balance display.
- `BetControls` is the desktop control shell. It uses the shared betting control
  model, preserves the desktop left-rail visual layout, and renders Manual and
  Auto as separate tabs. Auto settings render inline in the left rail when Auto
  is active.
- `MobileBetHud` is the mobile control shell. It uses the same shared betting
  control model while composing a mobile-first HUD with a centered Bet/Stop CTA,
  compact amount strip, compact risk selector, Auto setup trigger, and compact
  rows/lines selection near the board.
- `MobileAutoSheet` uses Radix Dialog to render the mobile Auto setup bottom
  sheet. The sheet contains Auto settings and its own Start Auto CTA, and it
  closes after Auto starts.
- `AutoSettings` contains the shared Auto settings UI for desktop inline
  controls and the mobile bottom sheet.
- Manual bet submission is built from the shared model's current amount, rows,
  and risk, then calls `usePlaceBet`.
- `usePlaceBet` calls `betsApi.place`, which posts to local `/api/bets`.
- Manual and Auto share the same result handling semantics: after the backend
  response returns, the result is added to recent results, a keyed visual round
  is enqueued, and the displayed balance updates from backend-provided
  `balanceAfter`.
- Backend bet request readiness is separate from visual animation readiness.
  Only one backend bet request is allowed in flight at a time, but visual rounds
  may continue animating after the request has resolved.
- Manual BET unlocks after the backend response returns. Rows, risk, playback,
  and amount controls remain locked while visual rounds are active so active
  board geometry and displayed multipliers do not shift underneath existing
  animations.
- Auto mode submits backend bet requests sequentially. In Normal playback, the
  next Auto request is paced by a short visual delay after the previous backend
  response so Auto reads as a sequence of visible Plinko drops. In Fast
  playback, Auto remains backend-paced and quick.
- Auto mode stores settings for finite number of bets, stop on profit, and stop
  on loss. Runtime state tracks status, requested/resolved progress, target
  count, started balance, current bet amount, final stop reason, and last error.
- Auto mode uses the starting bet amount for every request in the run. It does
  not adjust the bet amount after wins or losses in the MVP.
- Auto stop-on-profit/loss uses the balance captured at Auto start as the
  baseline and evaluates each backend `balanceAfter` after a result returns.
- Auto STOP changes running state to stopping when a request is already in
  flight, lets the submitted request finish, enqueues its visual round, updates
  progress/balance, and then stops scheduling further requests.
- Playback mode is separate from manual/auto game mode. Normal playback runs the
  board animation, while fast playback skips the full ball animation.
- Normal and fast playback share the same visual completion contract.
  Completion accepts a keyed active visual round once, reveals the latest
  winning bucket, then prunes the completed visual round after the reveal
  cleanup window.
- `GameLayout` structures the authenticated game screen into responsive board
  and controls zones. On desktop, it renders the existing `BetControls` left
  rail. On mobile, it keeps the board first and renders `MobileBetHud` below
  the board without duplicating betting state or submit behavior.
- The protected `(game)` app shell owns the top app header and bottom
  navigation outside the Game feature. `GameLayout` fits within that shell
  while preserving the existing desktop left rail, mobile betting HUD, and
  board composition.
- `GameBoard` owns the visual board composition and renders `PegGrid` with the
  attached `MultiplierBar` bucket row directly below it.
- `GameBoard`, `PegGrid`, and `MultiplierBar` share the feature-local board
  geometry model in `src/features/game/lib/boardGeometry.ts`. The model derives
  visual boundary peg positions, lane/path slot positions, landing columns,
  bucket centers, bucket dimensions, and vertical bucket spacing from selected
  row count and available board size.
- Board geometry scales progressively by selected row count: lower row counts
  can use larger peg spacing when the container has room, while 16 rows keep the
  dense baseline spacing. The same geometry model is used on desktop and
  mobile; surrounding layout constraints provide the available board size.
- The geometry model owns final peg row to bucket row spacing, so bucket
  placement and final landing targets stay aligned when that clearance changes.
- `GameBoard` passes active visual rounds to `PegGrid` only for normal playback.
- In fast playback, `GameBoard` completes active visual rounds immediately so
  Fast remains a no-animation result path.
- Normal playback uses a feature-local deterministic renderer layer. Backend
  `BetResponse.path` and `bucketIndex` are converted once per active visual
  full-drop visual round into a visual animation plan with waypoints, duration,
  optional contact pulses, and settle fallback timing.
- The static peg layer is separated from ball runtime animation. `PegGrid`
  composes a mostly static `PegLayer` with `PlinkoBallLayer`, while ball
  movement uses precomputed transform keyframes instead of per-waypoint React
  state updates.
- Full visual drops traverse geometry-owned lane/path slots, pass near the
  relevant visual boundary peg for subtle contact feedback, and always use the
  feature-local board geometry landing target for backend-provided
  `bucketIndex` as the explicit final bucket-drop waypoint.
- Auto visual playback uses a density policy: Manual rounds always receive full
  drops, while Auto rounds receive full drops only while the active full-Auto
  budget has capacity. Overflow Auto results skip ball travel and resolve
  through the keyed bucket reveal/highlight path so dense runs stay honest
  without showing vertical fallback drops or overloading the renderer.
- `PegGrid` renders multiple active balls by keying each animation with the
  visual round's `roundId`; completed rounds still reveal and prune through the
  shared keyed lifecycle.
- Displayed balance updates when the backend response returns, not when visual
  playback completes.
- Winning bucket highlight is visual feedback only. Highlight cleanup uses the
  completed visual round's `roundId` so an older cleanup timer cannot clear a
  newer result reveal, and request readiness does not wait for highlight
  cleanup.
- `MultiplierBar` reads the latest reveal from game state to show the winning
  bucket highlight and renders bucket labels as the attached board bucket row.
- Balance and logout access are owned by the protected `(game)` app shell so
  they remain available across protected routes.

Current constraints:

- Browser game code must use local BFF routes only.
- Game config shape is defined in `src/shared/types/api.types.ts`.
- Auto mode does not cancel a backend request that has already been submitted.
- Auto mode does not introduce parallel backend betting; request pacing remains
  sequential.
- Multiple active visual rounds assume controls that can change board geometry
  are locked while animations are active.

Unverified:

- Backend payout table semantics beyond the current `GameConfig` TypeScript
  shape.
- Backend path generation rules beyond the returned `BetResponse.path` string.

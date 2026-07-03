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
  latest reveal identity, visually settled recent results, story/result
  feedback entries, Auto settings/runtime state, bet amount, risk, and selected
  rows.
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
- `AudioToggle` is a compact icon-only control rendered in the protected app
  header next to logout. It uses the Game feature audio state so the header
  placement stays consistent across desktop and mobile without moving the sound
  logic into the app shell.
- Gameplay audio is implemented as a feature-local client-only layer under
  `src/features/game`. The layer hides Howler usage behind Game audio helpers,
  persists only the muted preference in browser `localStorage`, and does not
  persist runtime playback or unlock state.
- Howler is used for short game sound effects because it provides a small
  browser audio abstraction with global mute and mobile/browser unlock handling.
  The implementation does not add `react-howler`, audio sprites, an advanced
  mixer, music, or volume controls.
- Manual bet submission is built from the shared model's current amount, rows,
  and risk, then calls `usePlaceBet`.
- `usePlaceBet` calls `betsApi.place`, which posts to local `/api/bets`.
- Manual and Auto share the same result handling semantics: after the backend
  response returns, the result is added to recent results, a keyed visual round
  is enqueued, and the displayed balance updates from backend-provided
  `balanceAfter`.
- Manual audio plays a short bet-start sound when a bet request starts. Normal
  playback plays one drop sound as the visual round begins and exactly one
  result sound when the keyed visual round completes. Fast playback skips
  animation audio and plays only the bet-start plus one result sound.
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
- Auto audio plays start and stop sounds once per run. Routine Auto result audio
  is throttled so Normal and Fast runs do not produce repetitive sound spam;
  Fast suppresses most routine result audio. High-win result sounds are allowed
  through a separate cooldown.
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
  full Canvas ball animation, while Manual Fast playback skips ball movement and
  shows only target-bucket Canvas feedback.
- Normal and fast playback share the same visual completion contract.
  Completion accepts a keyed active visual round once, reveals the latest
  winning bucket, then prunes the completed visual round after the reveal
  cleanup window.
- The board renders a compact Plinko story bar as a top-right overlay. It shows
  visually settled results newest-first, caps visible entries at five, and uses
  multiplier labels styled from the same bucket color model as the Canvas board
  bucket where the result landed.
- The board renders a short visual-only result cue after visual completion. The
  cue shows the signed payout delta and multiplier for the completed round, but
  it does not own or drive balance, bet validation, Auto stop logic, API state,
  or session behavior.
- `GameLayout` structures the authenticated game screen into responsive board
  and controls zones. On desktop, it renders the existing `BetControls` left
  rail. On mobile, it keeps the board first and renders `MobileBetHud` below
  the board without duplicating betting state or submit behavior.
- The protected `(game)` app shell owns the top app header and bottom
  navigation outside the Game feature. `GameLayout` fits within that shell
  while preserving the existing desktop left rail, mobile betting HUD, and
  board composition.
- `GameBoard` owns the visual board composition and renders the feature-local
  Canvas renderer surface through `PlinkoCanvasStage`.
- The Canvas renderer is adapted from the reference implementation under
  `ref/plinko` and loads row-specific trajectory libraries from public assets
  under `/animations/plinko`.
- Animation assets are available for rows 8 through 16. Each row asset contains
  bucket-indexed trajectory variants, and the renderer selects a deterministic
  variant from the backend bet identity, row count, and target bucket.
- `BetResponse.path` is adapted from backend `L`/`R` steps into renderer
  `0`/`1` steps when it is valid. If path metadata is inconsistent, the adapter
  records warnings and falls back to bucket-correct renderer steps so the visual
  animation remains driven by the backend-provided `bucketIndex`.
- `GameBoard` passes active full Normal rounds to the Canvas renderer's ball
  animation path.
- In Manual Fast playback, `GameBoard` sends the visual round to the Canvas
  bucket-feedback path so only the backend target bucket pulses/scales before
  settlement.
- Auto Fast and compressed visual rounds keep the quick settlement path so dense
  runs do not overload the renderer or change Auto pacing.
- Normal playback uses Canvas ball trajectories and peg/bucket feedback. If
  asset loading, parsing, trajectory selection, or dispatch fails, the renderer
  settles the visual round through the existing fallback completion path without
  repeating the bet request or changing balance/result state.
- Auto visual playback uses a density policy: Manual rounds always receive full
  drops, while Auto rounds receive full drops only while the active full-Auto
  budget has capacity. Overflow Auto results skip ball travel and resolve
  through the keyed bucket reveal/highlight path so dense runs stay honest
  without showing vertical fallback drops or overloading the renderer.
- The Canvas renderer keys each animation with the visual round's `roundId`;
  completed rounds still reveal and prune through the shared keyed lifecycle.
- Authoritative displayed balance updates when the backend response returns,
  not when visual playback completes. Story/result feedback is presentation-only
  and is revealed from the visual completion path.
- Winning bucket highlight is visual feedback only. Highlight cleanup uses the
  completed visual round's `roundId` so an older cleanup timer cannot clear a
  newer result reveal, and request readiness does not wait for highlight
  cleanup.
- Result audio uses existing `BetResponse` fields. Loss/win is derived from
  `payout` compared with `amount`, and high-win audio is derived from a high
  multiplier threshold.
- The Canvas renderer owns bucket label drawing and bucket feedback for the
  board surface.
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
- Exact backend path generation rules beyond the returned `BetResponse.path`
  string. The Canvas renderer only guarantees bucket-correct animation, not
  exact visual reproduction of every backend `L`/`R` step.

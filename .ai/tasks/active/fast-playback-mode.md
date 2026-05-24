# Fast Playback Mode

## Approval

- User approved implementation of Fast / no-animation playback mode.
- Source of truth: completed audit and approved implementation plan in thread.

## Branch Mode

- Mode: PR-mode.
- Base branch: `feat/plinko`.
- Task branch: `codex/fast-playback-mode`.
- Current branch at task start: `feat/plinko`.
- Branch-start evidence: `git status --short --branch` showed clean `## feat/plinko`; branch created with `git switch -c codex/fast-playback-mode`.

## Editable Files

- `src/features/game/model/game.store.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/lib/boardGeometry.ts`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `docs/modules/game.md`

## Context-Only Files

- `src/features/game/api/bets.api.ts`
- `src/app/api/bets/route.ts`
- `src/shared/types/api.types.ts`
- `docs/modules/bets.md`
- `docs/api-boundary.md`
- `docs/doc-mapping.json`
- `package.json`

## Ownership And Placement

- Owning feature: `src/features/game`.
- Playback mode and round lifecycle state belong in the game model/store layer.
- Auth balance updates remain outside the game store and are bridged from UI/model code with auth store access.
- UI files only wire the new playback selection and existing render flow.

## Docs Plan

- Update `docs/modules/game.md` because `src/features/game/**` behavior changes are mapped to game module docs.

## Validation Plan

- Run `pnpm lint`.
- Run `pnpm build` because playback behavior affects runtime UI.
- Run available repository validation scripts if needed.

## Assumptions

- Fast/no-animation changes only client-side playback and reveal timing.
- No backend/API, auth token, Auto mode, rate-limit, or audio changes are needed.
- Recent results remain added when the bet response is received.

## Stop Conditions

- Stop before changing BFF/API routes, backend response types, shared API types, or auth token handling.
- Stop before implementing Auto mode or bet progression loops.
- Stop if the ball-hang issue requires geometry/layout redesign or broad animation polish.

## Progress

- Active task artifact created.
- Implemented playback mode state and round lifecycle actions in game store.
- Updated bet success to start the shared round lifecycle.
- Updated board completion to use the shared completion contract and auth balance bridge.
- Added minimal desktop/mobile playback selectors.
- Replaced PegGrid's hardcoded 900ms settle delay with a named short settle delay.
- Updated game module docs for playback mode and lifecycle behavior.
- Ran validation:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.

## Review Gate

- Semantic review handoff not run through a subagent because the available subagent tool requires explicit user authorization for delegation.
- Local self-check confirmed the change stayed within approved scope and did not touch context-only API/BFF/shared type files.

## Follow-up Fix: Normal Playback Result Alignment

- Issue: in normal playback, the ball can visually land in one bucket while the shared completion reveal highlights a neighboring `bucketIndex`.
- Scope: fix only normal playback path/timing/result alignment in `PegGrid`; no geometry/layout/API/Auto changes.
- Root-cause hypothesis from source inspection: `PegGrid` derives the final landing column from the count of `R` path characters, while completion/reveal uses authoritative `BetResponse.bucketIndex`.
- Editable files for this fix: `src/features/game/ui/PegGrid.tsx`, `docs/modules/game.md`, and this task artifact.
- Validation plan: run `pnpm lint`, `pnpm build`, and repository validation wrapper.
- Fix applied: normal playback still follows `BetResponse.path` through the peg field, but its final landing waypoint now uses `BetResponse.bucketIndex`, matching the reveal/completion bucket.
- Validation rerun after fix:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.

## Follow-up Fix: Explicit Final Bucket Drop

- Issue: previous landing-column fix still used the between-peg-row midpoint formula after the final peg, which can visually point at the wrong lane before correcting to the highlighted bucket.
- Scope: fix only normal playback final bucket-drop waypoint alignment.
- Approved editable files: `src/features/game/ui/PegGrid.tsx`, `src/features/game/lib/boardGeometry.ts` if a helper is needed, `docs/modules/game.md`, and this task artifact.
- Required approach: keep `BetResponse.path` for peg traversal, use the shared board geometry landing target by `BetResponse.bucketIndex` for the final bucket drop, and keep `BALL_SETTLE_MS` as a short post-landing delay.
- Fix applied: added `getBucketLandingTarget` in `boardGeometry` and changed `PegGrid` so the generic midpoint formula only runs between peg rows. The final bucket drop now uses the shared landing target for `BetResponse.bucketIndex`.
- Validation rerun after explicit bucket-drop fix:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.

## Follow-up Fix: Lane-Based Landing Geometry

- Issue: final bucket-drop path was aligned to the correct result, but landing targets and bucket centers were still positioned under final-row pegs rather than natural landing lanes.
- Scope: update only the shared geometry landing target model, docs, and this task artifact.
- Formula verified before edit for 8-row and 16-row boards: lane positions remain ordered, uniformly spaced by `pegGap`, and within current board width.
- Fix applied: shifted `landingColumns` by half a peg gap with `centerX + (index - rows / 2 - 0.5) * pegGap`; `PegGrid` did not require changes because it already consumes `getBucketLandingTarget`.
- Validation rerun after lane-based geometry fix:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.

## Follow-up Fix: Boundary Pegs And Lane Slots

- Issue: the plinko-mobile reference uses visual boundary pegs, so the rendered two-peg top row should be preserved. The previous half-gap landing shift improved final motion but made the bucket row visually unbalanced because path slots were not modeled separately from visual pegs.
- Scope: preserve boundary peg topology, add shared lane/path slot positions in `boardGeometry`, update `PegGrid` to consume lane slots, keep `MultiplierBar` aligned through `landingColumns`, and update docs/task notes.
- Approved editable files: `src/features/game/lib/boardGeometry.ts`, `src/features/game/ui/PegGrid.tsx`, `docs/modules/game.md`, and this task artifact.
- Stop conditions: do not change backend semantics, payout mapping, multiplier order, bucket count, board width/framing, Auto mode, API progression behavior, or broad animation/physics behavior.
- Fix applied: added `laneRows` to `boardGeometry`, preserved boundary `pegRows`, restored balanced landing columns as final lane slots, and updated `PegGrid` to animate through `laneRows` while still completing at `getBucketLandingTarget`.
- Validation rerun after boundary-peg/lane-slot geometry fix:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.

## Follow-up Fix: Normal Playback Peg Deflection

- Issue: after lane/path slot traversal was introduced, the ball can read as
  moving through lane centers and contacting boundary pegs from the side instead
  of visibly deflecting from a peg.
- Scope: add a minimal normal-playback contact waypoint while preserving
  boundary peg topology, lane/path progression, bucket geometry, final landing,
  fast playback, and the shared completion contract.
- Approved editable files: `src/features/game/lib/boardGeometry.ts`,
  `src/features/game/ui/PegGrid.tsx`, `docs/modules/game.md`, and this task
  artifact.
- Planned approach: expose a small geometry helper for the contacted boundary
  peg/near-contact target, then have `PegGrid` build each path step as current
  lane center, near-contact target, and next lane center.
- Validation plan: run `pnpm lint`, `pnpm build`, repository validation wrapper,
  and `git diff --check`.
- Fix applied: added `getLaneContactPeg` and `getLaneContactTarget` in
  `boardGeometry`, then updated `PegGrid` so each normal playback path step
  visits the lane center, a near-contact target for the selected boundary peg,
  and then naturally proceeds to the next lane or final landing target.
- `BALL_SETTLE_MS` was kept unchanged because this pass only addressed peg
  deflection readability.
- Validation rerun after contact-waypoint fix:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.
  - `git diff --check` passed.

## Follow-up Tuning: Peg Contact Clearance

- Issue: manual QA showed the ball visually overlapping the contacted peg/glow,
  making the contact read as passing through the peg and weakening the
  deflection.
- Scope: tune only the contact waypoint clearance/offset in
  `boardGeometry`; keep bucket geometry, landing columns, lane topology, final
  landing, fast playback, and completion behavior unchanged.
- Approved editable files: `src/features/game/lib/boardGeometry.ts`,
  `src/features/game/ui/PegGrid.tsx` only if needed, `docs/modules/game.md` if
  docs freshness requires it, and this task artifact.
- Validation plan: run `pnpm lint`, `pnpm build`, repository validation wrapper,
  and `git diff --check`.
- Tuning applied: replaced the fixed contact blend/progress waypoint with a
  clearance-based contact target that keeps the ball center on the lane side of
  the contacted peg by using ball radius, peg radius, and a small clearance.
  `PegGrid`, bucket geometry, lane topology, final landing, fast playback, and
  completion behavior were unchanged.
- Validation rerun after contact-clearance tuning:
  - `pnpm lint` passed.
  - `pnpm build` passed.
  - `scripts/validate.sh` passed through Git Bash login shell.
  - `git diff --check` passed.

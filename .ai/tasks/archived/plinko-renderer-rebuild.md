# Plinko Renderer Rebuild

## Approval

- User requested implementation of the MVP production-grade deterministic Plinko visual renderer rebuild.
- Source of truth: completed renderer rebuild audit in the prior thread.
- Required workflow: local repository implementation skill at `skills/implementation/SKILL.md`.

## Branch Mode

- Mode: PR-mode.
- Base branch: `feat/plinko`.
- Current branch at task start: `feat/plinko`.
- Task branch: `codex-plinko-renderer-rebuild`.
- Branch-start evidence:
  - `git status --short --branch` -> `## feat/plinko`
  - `git switch -c codex/plinko-renderer-rebuild` failed because the existing local refs block the `codex/` namespace.
  - `git switch -c codex-plinko-renderer-rebuild` failed in sandbox due `.git` lock permission.
  - Escalated `git switch -c codex-plinko-renderer-rebuild` succeeded.

## Goal

Rebuild Normal playback as a deterministic renderer of backend Plinko results so Manual and Auto playback feel MVP-ready while preserving backend correctness and existing lifecycle contracts.

## Hard Invariants

- Backend `BetResponse` remains the source of truth.
- Backend `path`, `bucketIndex`, `balanceAfter`, payout, and multiplier semantics remain authoritative.
- The ball visually lands in the correct bucket.
- Auto backend request pacing remains sequential and independent from animation completion.
- Manual BET remains unlocked after backend response, not animation completion.
- Fast playback remains fast and does not depend on full animation.
- Auth, BFF, Profile, Progression, App Shell, backend behavior, and payout semantics are out of scope.

## Approved Editable Files

- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/lib/boardGeometry.ts`
- `src/features/game/model/game.store.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/model/useAutoMode.ts`
- `src/features/game/model/useBetControlsModel.ts`
- `docs/modules/game.md`
- `.ai/tasks/active/plinko-renderer-rebuild.md`

## Approved New Feature-Local Files

- `src/features/game/lib/visualWaypoints.ts`
- `src/features/game/lib/visualPlaybackPolicy.ts`
- `src/features/game/ui/PlinkoBallLayer.tsx`
- `src/features/game/ui/Ball.tsx`
- `src/features/game/ui/PegLayer.tsx`

## Context-Only Files

- `package.json`
- `AGENTS.md`
- `docs/architecture.md`
- `docs/doc-mapping.json`
- `docs/decisions/002-state-ownership.md`
- `.ai/tasks/archived/auto-mode.md`
- `.ai/tasks/archived/fast-playback-mode.md`
- `src/shared/types/api.types.ts`
- `src/features/game/api/bets.api.ts`
- `src/app/api/bets/route.ts`
- `src/app/api/game/config/route.ts`
- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/AutoSettings.tsx`
- `src/features/game/ui/MobileBetHud.tsx`

## Ownership And Placement

- Owning feature: `src/features/game`.
- Visual planning belongs in feature-local `lib` because it is deterministic game rendering logic derived from backend results and board geometry.
- Static board/peg rendering belongs in feature-local UI components.
- Ball animation belongs in a focused feature-local ball layer/component.
- Zustand game store may own visual round policy metadata only when cross-component lifecycle state is needed.
- Browser API calls continue through existing feature API modules and local BFF helpers only.

## Stack Primitive Checklist

- Route/page thinness: `src/app/(game)/game/page.tsx` remains unchanged.
- Page-content orchestration: `GameLayout` remains the page-content orchestrator and continues to compose board plus controls.
- Feature-local component split: `PegGrid` should stop owning every renderer responsibility; static peg rendering and ball layer should be split into focused feature-local components.
- Stack primitives: use existing React Client Components where browser animation/lifecycle is required; keep Motion from the existing `motion` dependency; use Tailwind utilities and feature-local helpers; do not add dependencies.
- Data/state ownership: TanStack Query remains responsible for bet mutations; Zustand owns game UI/runtime state; auth store owns displayed user only; no auth tokens in browser state.
- Suppressions/bypasses: none approved.

## Documentation Plan

- Update `docs/modules/game.md` because changes under `src/features/game/**` affect documented visual playback and lifecycle behavior.

## Validation Plan

- `pnpm lint`
- `pnpm build`
- `git diff --check`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`

## UI QA Requirement

Required. This task changes visible animation behavior and high-frequency interaction.

## Manual QA Plan

- Manual Normal 8 rows: ball reads as one clean ball and lands in highlighted bucket.
- Manual Normal 16 rows desktop: correct bucket, smooth enough, no ghost trail.
- Manual Normal 16 rows mobile: no overlap, no horizontal overflow, correct bucket.
- Manual repeated bet: BET unlocks after backend response while prior animation may continue.
- Fast mode: no full drop, quick reveal, result correctness preserved.
- Auto 10 bets normal: progress advances by backend responses, playback remains smooth and credible.
- Auto dense run: visual policy prevents chaos and avoids visible lag.
- Auto STOP: no new backend requests after stop; submitted result still resolves visually.
- Bucket highlight: older cleanup does not clear newer result.
- Recent results and balance update remain tied to backend response.
- Bottom nav/HUD do not block critical controls on mobile.

## Non-Goals

- No backend/API changes.
- No payout, multiplier, or result semantic changes.
- No auth, profile, progression, app-shell, or backend behavior changes.
- No Playwright setup, CI setup, audio, new dependencies, random physics engine, uncontrolled parallel backend requests, or broad control/HUD redesign.

## Stop Conditions

- Stop if backend/API contracts need to change.
- Stop if result mapping cannot be preserved.
- Stop if a new dependency appears necessary.
- Stop if implementation requires broad folder restructuring.
- Stop if Fast mode would be broken.
- Stop if Auto request pacing would need to wait for animation completion.
- Stop if payout/bucket semantics would change.
- Stop if implementation becomes too large to keep reviewable in one PR.

## QA Correction Scope

- Manual QA found two blockers after the rebuild:
  - Auto dense runs still have visible lag.
  - In Auto runs around 10-15 bets, 1-2 balls can appear to fall almost vertically from top to bottom.
- Root-cause investigation focus:
  - Check whether compressed/overflow rounds render a vertical fallback path.
  - Check whether visual plans can contain missing or invalid x waypoints.
  - Check whether compressed overflow should render a ball at all.
  - Check whether full animated balls use compositor-friendly transforms and avoid heavy paint effects.
- Preferred correction:
  - Preserve the deterministic renderer architecture and backend result correctness.
  - If compressed overflow cannot look like credible Plinko movement, do not render it as a falling ball; use bucket flash/reveal only.
  - Reduce dense Auto lag without audio, Playwright, backend, payout, or UI redesign scope.

## Auto Pacing / Bet Button Correction Scope

- Manual QA found remaining blockers:
  - Auto Normal with 10 bets only shows around 3 meaningful ball drops because the loop remains backend-paced.
  - Dense Auto still feels unsatisfying because most results resolve through overflow reveals.
  - Desktop Manual Bet button is pushed to the bottom of the left panel instead of sitting in the normal control flow.
- Correction direction:
  - In Normal playback only, pace Auto backend requests with a clear visual delay so Auto reads as a sequence of drops.
  - Keep Fast Auto quick and backend-paced.
  - Keep max full animated Auto balls at one and preserve overflow reveal-only behavior if needed.
  - Keep Manual BET unlock after backend response unchanged.
  - Fix desktop button layout without redesigning the panel or changing mobile HUD layout.

## Geometry Polish Scope

- Manual QA found buckets too close to the lower peg rows; the ball can appear to pass through or too near the final peg row before landing.
- Inspect-first result: bucket row position, final landing target, and visual waypoints are aligned through shared `BoardGeometry`.
  - `GameBoard` stacks `PegGrid` and `MultiplierBar` using the same `geometry`.
  - `MultiplierBar` renders `geometry.buckets`.
  - `visualWaypoints` uses `getBucketLandingTarget(geometry, bucketIndex)`.
- Applied geometry-source fix only: increased `bucketVerticalGap` constants in `boardGeometry` so bucket row spacing and final landing target move together.
- No CSS-only margin workaround was added.

## Documentation / Library Lookup Evidence

- Read local Next.js 16 docs for Server and Client Components and CSS/Tailwind guidance.
- Fetched current Motion docs with Context7:
  - `npx ctx7@latest library "Motion" "..."`
  - `npx ctx7@latest docs /websites/motion_dev "..."`
- Relevant Motion evidence: motion components support keyframe arrays, transition duration in seconds, and animation completion callbacks.

## TDD / Test Constraint

- `package.json` has Vitest dependencies but no `test` script.
- Approved editable scope does not include adding test setup or package scripts.
- Implementation will rely on pure deterministic helpers where practical, plus lint/build/repository validation and manual UI QA.

## Progress

- Created task branch.
- Created active task artifact.
- Extracted visual playback style selection into `visualPlaybackPolicy`.
- Extracted deterministic waypoint/contact/duration planning into `visualWaypoints`.
- Added static `PegLayer` and independent `PlinkoBallLayer`.
- Rebuilt `Ball` to use Motion transform keyframes with a fallback completion timer.
- Simplified `PegGrid` into board-layer composition.
- Added Manual/Auto source and visual playback style metadata to visual rounds.
- Updated manual and Auto bet result enqueue calls.
- Updated game module documentation.
- Ran validation and route smoke checks.
- QA correction root cause found: compressed Auto overflow plans rendered a ball from the final bucket x at the top of the board down to the same bucket x, so overflow could read as vertical top-to-bottom ball travel.
- QA correction implemented: compressed Auto overflow no longer renders a falling ball and instead resolves through keyed bucket reveal/highlight only; Auto full-drop cap reduced to one active full Auto ball; Auto full drops skip contact pulses to reduce dense-run paint work.
- Auto pacing/layout correction root cause found: Auto loop was still pure backend-paced after each response, so with one active full Auto ball most follow-up results became overflow reveals; desktop Manual Bet button was pinned down by `mt-auto`.
- Auto pacing/layout correction implemented: Normal Auto now waits `AUTO_NORMAL_REQUEST_PACE_MS` after each resolved result before scheduling the next request, Fast Auto remains unpaced, and the desktop Manual Bet button returns to normal control flow.
- Geometry polish implemented: final peg row to bucket row clearance increased through shared board geometry while preserving final landing column alignment.

## Files Touched

- `.ai/tasks/active/plinko-renderer-rebuild.md`
- `docs/modules/game.md`
- `src/features/game/lib/visualPlaybackPolicy.ts`
- `src/features/game/lib/boardGeometry.ts`
- `src/features/game/lib/visualWaypoints.ts`
- `src/features/game/model/game.store.ts`
- `src/features/game/model/useAutoMode.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/ui/Ball.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/PegLayer.tsx`
- `src/features/game/ui/PlinkoBallLayer.tsx`

## Validation Results

- PASS: `pnpm lint`
- PASS: `pnpm build`
- PASS: `git diff --check`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- PASS: route smoke request to `http://localhost:3000/game` returned HTTP 200 while a temporary dev server was reachable.
- QA correction validation:
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `git diff --check`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
  - PASS: route smoke request to `http://localhost:3000/game` returned HTTP 200 from an already-running server on port 3000. A parallel attempt to start a new server failed with `EADDRINUSE`, which matched the existing route response.
- Auto pacing/layout correction validation:
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `git diff --check`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
  - PASS: route smoke request to `http://localhost:3000/game` returned HTTP 200.
- Geometry polish validation:
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `git diff --check`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`

## UI QA Evidence

- PARTIAL: In-app Browser tooling was not exposed by tool discovery in this session, so visual inspection, interaction testing, screenshots, and viewport checks could not be performed in-agent.
- PASS: `pnpm dev -- --port 3000` reached Ready in a temporary foreground run.
- PASS: `/game` responded with HTTP 200 during route smoke.
- NOT VERIFIED IN-AGENT: Manual/Auto ball feel, ghost-trail absence, bucket highlight timing, mobile overlap, no horizontal overflow, Auto STOP visual behavior, repeated-bet visual behavior, and the QA correction expectations require manual browser QA.
- Code-level QA correction evidence:
  - Auto overflow/compressed rounds no longer instantiate `Ball`, so they cannot render vertical falling balls.
  - Overflow rounds complete through `OverflowReveal`, which uses the existing keyed reveal/highlight lifecycle.
  - Auto full-drop concurrency is capped at one active full Auto ball.
  - Contact pulses are generated only for Manual full drops, reducing dense Auto animation work.
  - Normal Auto requests are paced by `AUTO_NORMAL_REQUEST_PACE_MS`; Fast Auto requests use `0ms` pacing.
  - Desktop Manual Bet button no longer uses `mt-auto`, so it is not pinned to the bottom of the left panel.
  - Geometry-source inspection confirmed bucket row, landing columns, and visual waypoints share `BoardGeometry`; bucket clearance was increased there rather than with CSS margin.

## Review Gate

- PASS: local semantic review gate. Changed files stayed inside approved editable scope, with only approved new feature-local files added. No context-only API/BFF/auth/shared type files were edited. No backend `/api/v1` browser calls, token handling, suppressions, or framework bypasses were introduced. Feature ownership remains inside `src/features/game`; route/page files remain unchanged. Static pegs and ball runtime are split into focused feature-local components, and mapped game docs were updated.

## Risks

- Bucket landing drift if visual waypoints and backend `bucketIndex` diverge.
- Auto visual overload if full-drop cap and overflow behavior are not bounded.
- Animation completion events can be skipped on unmount, so fallback cleanup is required.
- Mobile 16-row geometry may expose crowding or overlap.
- Visual quality remains partially unverified without browser/manual QA in this session.
- Auto dense-run smoothness should be rechecked manually; code now bounds full Auto ball animation cost, but perceived lag depends on device/browser.
- Auto Normal pacing should be manually tuned if `900ms` feels too slow or too fast relative to backend latency on the target environment.
- Increased final peg-to-bucket clearance may slightly reduce available vertical space on tight mobile heights because it is part of total board geometry.

## Handoff Notes

- Keep artifact active until implementation, validation, UI QA, and handoff are complete.
- Dev server is not currently running. Detached Windows `Start-Process` attempts exited in this sandbox, but foreground `pnpm dev -- --port 3000` reached Ready.

## Final Lifecycle Closure

- PR #12 merged into `feat/plinko`.
- Remote task branch deleted.
- Local base branch pulled after merge.
- Active task artifact archived from `.ai/tasks/active/plinko-renderer-rebuild.md` to `.ai/tasks/archived/plinko-renderer-rebuild.md`.
- Deterministic Plinko renderer rebuild accepted as MVP-sufficient after manual QA.

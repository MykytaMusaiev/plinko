# Plinko Canvas Renderer

## Approval

- User requested implementation using `skills/implementation/SKILL.md`.
- Task lane: architecture-sensitive UI/game animation task.
- Approved source: prior audit plus current prompt.

## Branch Mode

- Mode: PR-mode.
- Base branch: `feat/plinko`.
- Current branch at task start: `feat/plinko`.
- Task branch: `codex-plinko-canvas-renderer`.
- Branch-start evidence:
  - `git status --short --branch` on base returned `## feat/plinko` with untracked `ref/`.
  - `git switch -c codex/plinko-canvas-renderer` failed because the `codex/` namespace is blocked.
  - `git switch -c codex-plinko-canvas-renderer` required escalation due `.git` lock permission and then succeeded.
  - After branch creation, `git status --short --branch` returned `## codex-plinko-canvas-renderer` with untracked `ref/`.

## Goal

Replace the current Plinko board visual renderer and animation layer with a feature-local Canvas renderer adapted from `ref/plinko`, backed by animation JSON assets copied from `ref/public/animations/plinko`.

## Hard Invariants

- Preserve current betting flow.
- Preserve BFF/API contracts and browser-to-BFF boundary.
- Preserve auth refresh/retry and cookie behavior.
- Preserve balance update behavior.
- Preserve fairness/provably fair semantics.
- Preserve backend result semantics.
- Preserve existing audio behavior.
- Do not add dependencies.
- Do not run browser automation, Playwright, dev-server smoke checks, or UI smoke checks.
- Do not stage, commit, push, create PRs, merge, delete branches, or archive task artifacts.

## Approved Editable Files

- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/model/game.store.ts`
- `src/features/game/lib/**`
- `src/features/game/renderer/**`
- `src/features/game/ui/**` only for board-surface integration and obsolete board visual files when proven unused.
- `public/animations/plinko/*.json`
- `docs/modules/game.md`
- `.ai/tasks/active/plinko-canvas-renderer.md`

## Context-Only Files

- `ref/plinko/**`
- `ref/public/animations/plinko/**`
- `src/features/game/api/bets.api.ts`
- `src/app/api/bets/route.ts`
- `src/app/api/game/config/route.ts`
- `src/shared/types/api.types.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/model/useAutoMode.ts`
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/MobileRowsSelector.tsx`
- `src/features/game/ui/GameLayout.tsx`
- `src/app/(game)/game/page.tsx`
- `package.json`
- `docs/doc-mapping.json`
- `docs/api-boundary.md`
- `docs/modules/bets.md`

## Ownership And Placement

- Owning feature: `src/features/game`.
- Canvas renderer code belongs in feature-local `src/features/game/renderer`.
- Bet-result-to-renderer adaptation belongs in feature-local `src/features/game/lib`.
- Route/page files remain thin and unchanged.
- Reference code is a behavior source, not a structure to copy blindly.

## Stack Primitive Checklist

- Route/page thinness: `src/app/(game)/game/page.tsx` remains unchanged.
- Page-content orchestration: `GameLayout` continues to orchestrate controls plus board.
- Feature-local component split: `GameBoard` composes the Canvas renderer surface; Canvas drawing and trajectory selection live outside component files.
- Data/state ownership: Zustand keeps current visual round lifecycle; TanStack Query and BFF clients remain unchanged.
- Project primitives: use Client Components only where browser canvas/lifecycle is required; use existing Tailwind utilities for container styling; use browser `fetch` only for static `/animations/plinko/*` public assets.
- Suppressions/bypasses: none approved.

## Fast Mode Plan

- Normal playback uses Canvas animation.
- Manual Fast playback skips ball movement and uses target-bucket Canvas
  pulse/scale feedback only.
- Dense Auto/compressed playback keeps quick completion to avoid visual overload.
- Fast mode is not redesigned as a separate feature.

## Documentation Plan

- Update `docs/modules/game.md` because mapped game feature behavior changes.
- Do not update API boundary docs unless BFF/API behavior changes, which is a stop condition.

## Validation Plan

- `git diff --check`
- `pnpm lint`
- `pnpm build`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- Focused Vitest may be run directly for adapter logic because `package.json` has no `test` script.

## UI QA Requirement

Required. Human will perform manual browser/UI QA. In-agent browser automation and dev-server smoke checks are explicitly out of scope.

## Manual UI QA Checklist

- `/game` renders a nonblank Canvas board in Normal mode.
- Rows 8 through 16 can render without missing-asset failures.
- Manual Normal bet animates and lands in the backend bucket.
- Manual Fast bet shows bucket pulse/scale feedback without ball movement and
  settles quickly.
- Repeated Manual bet preserves request readiness and visual settlement.
- Auto Normal keeps current sequential backend behavior while animating safely.
- Dense Auto/compressed results settle without visual overload.
- Auto STOP behavior remains unchanged.
- Bucket highlight/result reveal matches backend `bucketIndex`.
- Existing game sounds remain present and not redesigned.
- Mobile board is not clipped by HUD or rows selector.

## Stop Conditions

- Backend/config supports rows outside 8-16.
- Exact backend path visual reproduction becomes required.
- A new dependency is needed.
- BFF/API contract changes become necessary.
- Auth, balance, fairness, payout, or backend result semantics would need changes.
- Fast mode requires betting, Auto, balance, or backend result semantic changes.
- Reference assets are incomplete for supported rows/buckets.
- Implementation requires touching unrelated modules.
- Board renderer requires redesigning controls, layout outside the board surface, or audio.

## Progress

- Created task branch.
- Created active task artifact.
- Added a focused adapter test for current backend `path`/`bucketIndex` mapping.
- Added feature-local Canvas renderer types, loader, board drawing, ball drawing,
  trajectory selection, and playback lifecycle.
- Added a feature-local adapter from current `BetResponse` to Canvas renderer
  round shape.
- Added `PlinkoCanvasStage` to own browser Canvas init, resize, dispatch, and
  fallback settlement.
- Replaced `GameBoard`'s active visual surface with the Canvas stage.
- Preserved Fast/compressed playback as quick completion through the existing
  keyed lifecycle.
- Copied animation JSON assets as-is from `ref/public/animations/plinko` to
  `public/animations/plinko`.
- Updated mapped game docs.
- Fixed post-implementation runtime blocker by removing a stale `clearRetry`
  call from `PlinkoCanvasStage`; retry timers/state had already been removed,
  so there was nothing left to clean up in the accepted-dispatch path.
- Moved context-only `ref/` out of the repository working tree to
  `C:\Users\M\AppData\Local\Temp\plinko-codex-reference\ref-20260703-164955`
  so build/typecheck no longer includes reference-project source.
- Fixed strict build typecheck by preserving the Canvas 2D context in a
  non-null local binding after the initialization guard.
- Fixed manual UI QA blocker where Fast mode had no visible result feedback,
  then corrected the follow-up QA decision: Manual Fast full rounds now trigger
  only Canvas target-bucket pulse/scale feedback with no ball movement, while
  Auto Fast and compressed rounds keep quick settlement.

## Files Touched

- `.ai/tasks/active/plinko-canvas-renderer.md`
- `docs/modules/game.md`
- `public/animations/plinko/eight-rows-animation.json`
- `public/animations/plinko/nine-rows-animation.json`
- `public/animations/plinko/ten-rows-animation.json`
- `public/animations/plinko/eleven-rows-animation.json`
- `public/animations/plinko/twelve-rows-animation.json`
- `public/animations/plinko/thirteen-rows-animation.json`
- `public/animations/plinko/fourteen-rows-animation.json`
- `public/animations/plinko/fifteen-rows-animation.json`
- `public/animations/plinko/sixteen-rows-animation.json`
- `src/features/game/lib/plinkoCanvasAdapter.test.ts`
- `src/features/game/lib/plinkoCanvasAdapter.ts`
- `src/features/game/lib/canvasRoundPlaybackPolicy.test.ts`
- `src/features/game/lib/canvasRoundPlaybackPolicy.ts`
- `src/features/game/model/game.store.ts`
- `src/features/game/renderer/index.ts`
- `src/features/game/renderer/plinko-renderer-types.ts`
- `src/features/game/renderer/canvas/animation-loader.ts`
- `src/features/game/renderer/canvas/ball-renderer.ts`
- `src/features/game/renderer/canvas/board-renderer.ts`
- `src/features/game/renderer/canvas/bucket-style.ts`
- `src/features/game/renderer/canvas/canvas-plinko-renderer.ts`
- `src/features/game/renderer/canvas/feedback.ts`
- `src/features/game/renderer/canvas/source-layout.ts`
- `src/features/game/renderer/canvas/trajectory-selector.ts`
- `src/features/game/renderer/canvas/types.ts`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PlinkoCanvasStage.tsx`

## Validation Results

- PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/plinkoCanvasAdapter.test.ts`
  - Red check first failed for missing `./plinkoCanvasAdapter`.
  - Green check passed with 2 tests.
- PASS: `git diff --check`
- PASS: `pnpm lint`
- BLOCKED: `pnpm build`
  - Next compiled successfully.
  - TypeScript failed on untracked context-only `ref/plinko/model/plinko-client.ts`
    because it imports `@/features/game-bet`, which does not exist in this app.
  - The `ref/` directory was untracked before implementation and is required as
    task input. It was not moved, deleted, or excluded from `tsconfig` because
    that would expand scope.
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- Post-blocker fix validation:
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/plinkoCanvasAdapter.test.ts`
  - PASS: `git diff --check`
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- Fast visual feedback fix validation:
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts`
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/plinkoCanvasAdapter.test.ts`
  - PASS: `git diff --check`
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- Fast bucket-only correction validation:
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts`
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/plinkoCanvasAdapter.test.ts`
  - PASS: `git diff --check`
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`

## Review Gate

- Source changes stayed inside approved game feature, docs, task artifact, and
  static asset scope.
- No BFF/API, auth, balance, fairness, or shared API type files were edited.
- No new dependencies, scripts, browser automation, Playwright, staging,
  commits, pushes, PRs, merges, branch deletion, or artifact archival.
- Obsolete DOM/Motion board files were left in place because they are no longer
  imported by `GameBoard` but still compile; deletion can be a follow-up cleanup
  after manual UI QA confirms the Canvas replacement.
- Follow-up repository review passed with no blocking issues. Non-blocking
  review note was to update this artifact with human UI QA evidence.

## UI QA Evidence

- Human manual UI QA passed.
- Manual Fast shows no moving ball.
- Manual Fast target bucket pulses/scales visibly.
- Manual Fast target bucket matches the backend result.
- Normal mode still shows full Canvas ball animation.
- Auto Fast/compressed behavior remains quick.
- Result bucket feedback works correctly.
- Codex did not run browser automation, Playwright, dev-server smoke checks, or
  UI smoke checks by instruction.

## Handoff Notes

- Current implementation does not guarantee exact visual reproduction of backend
  `L`/`R` steps; it guarantees bucket-correct selection.

## Risks

- Reference trajectories are bucket-correct variants, not exact backend path visualizations.
- Canvas sizing must be checked manually across desktop and mobile.
- Static asset loading failures must not block settlement.

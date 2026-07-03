# Plinko Story And Balance Feedback

## Task ID

plinko-story-balance-feedback

## Branch mode

PR-mode.

## Base branch

`feat/plinko` is the integration base. This task branch starts from
`codex-plinko-canvas-renderer` because the user specified the Canvas renderer
migration is already implemented and this work depends on that renderer
lifecycle.

## Task branch

`codex-plinko-story-balance-feedback`

## Current branch at task start

`codex-plinko-canvas-renderer`

## Branch-start status

Started with `ref/` untracked and no other visible working-tree changes.

## Branch-start command/evidence

- `git branch --show-current` returned `codex-plinko-canvas-renderer`.
- `git status --short --branch` returned `## codex-plinko-canvas-renderer` and
  `?? ref/`.
- `git merge-base --is-ancestor feat/plinko HEAD` confirmed `feat/plinko` is an
  ancestor of the renderer branch.
- `git switch -c codex-plinko-story-balance-feedback` succeeded.

## Local/no-PR rationale

Not applicable.

## PR lifecycle

Do not stage, commit, push, create PRs, merge, delete branches, or archive task
artifacts in this task.

## Retroactive PR needed

No.

## Goal

Implement a compact Plinko story/history bar and feature-local visual-only
result/balance feedback after visual settlement, preserving authoritative
balance ownership and current Normal/Fast/Auto renderer behavior.

## Scope

- Add story/history entry modeling from current `BetResponse` and visual round
  completion data.
- Reveal story/history entries after visual completion, not backend response.
- Cap visible story/history entries at five.
- Add compact board-area result feedback showing multiplier and win/loss delta.
- Keep all implementation inside `src/features/game/**`.
- Update mapped game docs if behavior changes.

## Non-goals

- No `ref/plinko` source copying or commit scope.
- No backend route, API contract, BFF, auth/session, or shared API type changes.
- No authoritative balance ownership changes.
- No delayed authoritative balance update.
- No betting-limit, Auto stop, fairness, or session-refresh behavior changes.
- No AppHeader or global shell changes for this first iteration.
- No `src/features/history/**` edits.
- No new dependencies.
- No browser automation, Playwright, dev-server smoke checks, or UI smoke
  checks.

## User approval

User requested implementation using `skills/implementation/SKILL.md` and the
focused reference audit recommendations.

## Audit / plan source

Focused reference audit of `ref/plinko` completed previously in this thread.

## Approved editable files

- `.ai/tasks/active/plinko-story-balance-feedback.md`
- `src/features/game/**`
- `docs/modules/game.md`

## Context-only files inspected

- `ref/plinko/**`
- `src/app/(game)/_components/AppHeader.tsx`
- `src/features/history/**`
- `src/shared/types/api.types.ts`
- `docs/doc-mapping.json`
- `package.json`
- `AGENTS.md`

## Affected source files

- `src/features/game/model/resultFeedback.model.ts`
- `src/features/game/model/resultFeedback.model.test.ts`
- `src/features/game/model/game.store.ts`
- `src/features/game/renderer/canvas/board-renderer.ts`
- `src/features/game/renderer/canvas/bucket-style.ts`
- `src/features/game/renderer/canvas/canvas-plinko-renderer.ts`
- `src/features/game/ui/RecentResults.tsx`
- `src/features/game/ui/GameBoard.tsx`

## Affected docs

- `docs/modules/game.md`

## Stop conditions / scope expansion notes

Stop and ask before changing auth balance ownership, delaying authoritative
balance updates, changing Auto stop or betting-limit logic, touching BFF/API
routes, touching shared API types, touching AppHeader/global shell, adding a
dependency, committing `ref/plinko`, or requiring broader mobile layout
redesign.

## Architecture-sensitive changes

No API/auth boundary changes planned. Game feature state/UI behavior changes
only.

## Stack Primitive Checklist

- Owning feature: `src/features/game`.
- Route/page thinness: `src/app/(game)/game/page.tsx` remains unchanged.
- Page-content orchestration: `GameLayout` remains the board/controls
  orchestrator.
- Feature-local component split: story bar/result cue belong in feature-local UI
  components; non-trivial formatting/model logic belongs in feature-local
  model/lib files.
- Data/state ownership: Zustand game store owns transient visual round and
  story/result UI state; auth store remains authoritative balance source.
- Browser/API boundary: no browser calls to backend `/api/v1/*`; no BFF changes.
- Project primitives: existing Client Components and Tailwind utilities; no raw
  images or new framework bypasses.
- Suppressions/bypasses: none approved.

## Suppression / framework-bypass approvals

None.

## Implementation summary

- Added a feature-local result/story model for completed Plinko rounds.
- Added focused tests for signed delta formatting, tone derivation, multiplier
  labels, newest-first story insertion, dedupe, and five-entry cap.
- Updated `useGameStore.completeVisualRound` so story entries, recent results,
  and latest result feedback are recorded only after visual completion.
- Completed `RecentResults.tsx` as a compact board overlay with a top-right
  story bar and short visual-only result cue.
- Placed the overlay inside `GameBoard` without changing app shell/header,
  BFF/API, auth store, Auto stop logic, or betting-limit logic.
- Delayed Manual Fast bucket-feedback settlement by the existing bucket
  feedback duration so story/result feedback appears after the pulse has been
  visible, not in the same tick as feedback start.
- Manual UI QA follow-up found story/history pills used profit/loss tone colors
  instead of matching the actual Canvas bucket color. Root cause: `RecentResults`
  mapped pill background from `PlinkoResultTone`, while Canvas buckets are drawn
  from `getCanvasBucketStyle(bucketIndex, bucketCount)`.
- Fixed the follow-up by exposing `getCanvasBucketDomStyle` from the existing
  Canvas bucket color helper and storing that bucket style on each story entry.
  `RecentResults` now renders story pill background, border, shadow, and text
  color from the bucket style; result cue tone remains win/loss/break-even.

## Documentation update / docs-not-needed rationale

Update `docs/modules/game.md` because mapped game feature behavior changes.

## Commands run

- `git branch --show-current`
- `git status --short --branch`
- `git branch --list`
- `git log --oneline --decorate -8`
- `git merge-base --is-ancestor feat/plinko HEAD`
- `git switch -c codex-plinko-story-balance-feedback`
- `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
- `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts src/features/game/lib/plinkoCanvasAdapter.test.ts`
- `git diff --check`
- `pnpm lint`
- `pnpm build`
- Move untracked `ref/` to `C:\Users\M\AppData\Local\Temp\plinko-codex-reference\ref-story-balance-20260703-180917`
- `pnpm build`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
- `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts src/features/game/lib/plinkoCanvasAdapter.test.ts`
- `git diff --check`
- `pnpm lint`
- `pnpm build`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
- `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts src/features/game/lib/plinkoCanvasAdapter.test.ts`
- `git diff --check`
- `pnpm lint`
- `pnpm build`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`

## Validation results

- RED: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
  failed because `./resultFeedback.model` did not exist.
- GREEN: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
  passed with 3 tests.
- PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts src/features/game/lib/plinkoCanvasAdapter.test.ts`
  passed with 5 tests.
- PASS: `git diff --check`
- PASS: `pnpm lint`
- BLOCKED then resolved: first `pnpm build` compiled but failed typecheck on
  untracked context-only `ref/plinko/model/plinko-client.ts`, which imports a
  module from the reference project that does not exist in this app. The
  untracked `ref/` directory was moved to
  `C:\Users\M\AppData\Local\Temp\plinko-codex-reference\ref-story-balance-20260703-180917`
  because the user explicitly said not to keep or commit `ref/plinko`.
- PASS: rerun `pnpm build`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- Post bucket-feedback timing fix:
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts src/features/game/lib/plinkoCanvasAdapter.test.ts`
  - PASS: `git diff --check`
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- Story pill color fix:
  - RED: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
    failed because `entry.bucketStyle` was `undefined`.
  - GREEN: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/model/resultFeedback.model.test.ts`
    passed with 4 tests.
  - PASS: `.\\node_modules\\.bin\\vitest.cmd run src/features/game/lib/canvasRoundPlaybackPolicy.test.ts src/features/game/lib/plinkoCanvasAdapter.test.ts`
  - PASS: `git diff --check`
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - PASS: `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`

## UI QA requirement

Required. The task changes visible UI, animation, responsive placement, and
high-frequency gameplay feedback. Browser automation and UI smoke checks are
out of scope by user instruction; record manual checklist and static/source
review evidence only.

## UI QA evidence

- Browser automation, Playwright, dev-server smoke checks, and UI smoke checks
  are explicitly out of scope by user instruction.
- Human manual UI QA finding: story/history pill colors must match the landed
  board bucket color, not win/loss/break-even tone.
- Static/source QA pending final diff review:
  - Overlay is scoped to `GameBoard` and absolute-positioned inside the board
    area.
  - Story bar uses compact fixed-width pills at the top-right.
  - Result cue uses a short CSS animation at the top-left.
  - No AppHeader/global shell code was touched.
  - Story/result state is updated only by `completeVisualRound`.
  - Manual Fast bucket-feedback settlement is delayed by
    `PLINKO_BUCKET_FEEDBACK_DURATION_MS`.
  - The overlay uses `pointer-events-none`, so it should not block board or HUD
    interactions.
  - No dev-server or browser UI smoke check was run by instruction.
  - Story pill colors are now derived from `getCanvasBucketDomStyle`, which uses
    the same bucket tone and numeric colors as Canvas bucket rendering.

## Sandbox / tooling blockers

Initial build was blocked by untracked context-only `ref/` being included in
Next typecheck. Resolved by moving `ref/` to a temp directory outside the repo.

## Docs freshness result

Passed. The script reported docs-not-needed rationale because the active task
artifact contains that field, but `docs/modules/game.md` was also updated.

## Docs not needed rationale

Not applicable; docs update planned.

## Code-quality review gate

Passed. Final review found no scope expansion, API/auth boundary changes,
suppression or framework bypass markers, AppHeader/global shell edits, or
business-state ownership changes. Remaining UI verification is human-owned by
instruction.

## Pre-commit readiness

Not run as a separate pre-commit lifecycle. No staging, commit, push, PR,
merge, branch deletion, or artifact archival was requested or performed.

## Risks

- Overlay placement must not hide mobile controls or board content.
- Story/result feedback must be tied to visual completion, not backend response.
- Visual balance/result cues must not become a second source of truth.

## Artifact status / archival status

Active. Do not archive in this task.

## Archive commit verification

Not applicable.

## Handoff / next step

Implement with TDD for extracted story/result model logic.

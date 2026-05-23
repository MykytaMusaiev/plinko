# Task Artifact

## Task ID

board-layout-responsive

## Branch/worktree

feat/board-layout-responsive in `D:\react\evoverse\internship\plinko`

## Goal

Prepare the Plinko game layout foundation for a later mobile betting HUD redesign by making the visual board composition clearer, keeping buckets attached to the board, improving mobile layout, and improving bucket label readability.

## Scope

- Make `GameBoard` own the visual board composition: `PegGrid` plus `MultiplierBar`.
- Keep buckets attached to the board instead of separated at the bottom of the main area.
- Structure `GameLayout` into clear responsive zones: top action strip, board area, controls area.
- Place the existing `BetControls` below the board on mobile without changing betting behavior.
- Improve bucket label contrast/readability.
- Keep one shared feature-local geometry source for `GameBoard`, `PegGrid`, and
  `MultiplierBar` that adapts for row counts 8 through 16.

## Non-goals

- Do not change physics or game logic.
- Do not refactor `BetControls` internals.
- Do not add mobile HUD controls.
- Do not add floating/circular bet button.
- Do not add manual/auto mode UI.
- Do not add x2 or /2 amount buttons.
- Do not add row/risk side controls.
- Do not add `AudioToggle` implementation.
- Do not add audio.
- Do not add autoplay.
- Do not add fast/no-animation mode.
- Do not add CI or tests in this task.
- Do not implement future mobile HUD controls or reserve fake space for them.
- Deferred explicitly: product-ready mobile HUD redesign, animation drop/bucket
  polish, autoplay, audio, and fast/no-animation mode.

## User approval

Approved by user message with explicit allowed and not-allowed scope after repository audit.

## Audit / plan source

Audit completed in conversation using `skills/audit/SKILL.md`.

## Approved editable files

- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/lib/boardGeometry.ts`
- `docs/modules/game.md`

## Context-only files inspected

- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/UserHeader.tsx`
- `src/features/game/model/game.store.ts`
- `src/features/game/model/useGameConfig.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/api/bets.api.ts`
- `src/shared/lib/multiplierColor.ts`
- `docs/doc-mapping.json`
- `docs/workflow/definition-of-done.md`
- `docs/workflow/worktree-task-flow.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`

## Affected source files

- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/lib/boardGeometry.ts`

## Affected docs

- `docs/modules/game.md` is mapped for `src/features/game/**` changes.

## Stop conditions / scope expansion notes

Stop before changing `BetControls` internals, adding new controls, changing
state shape, changing API/BFF behavior, adding dependencies, adding tests,
altering peg path semantics/physics, implementing animation polish, or building
future mobile HUD behavior.

## Architecture-sensitive changes

None expected. UI-only feature changes in `src/features/game`.

## Implementation summary

- `GameLayout` now exposes responsive board and controls zones. Existing
  `BetControls` render below the board on mobile and remain a left rail on
  desktop.
- `GameBoard` owns the visual board composition and measures the available
  board viewport with `ResizeObserver`.
- `src/features/game/lib/boardGeometry.ts` provides one feature-local board
  geometry source of truth for 8 through 16 rows, including peg positions,
  landing columns, bucket centers, bucket dimensions, and final peg-to-bucket
  spacing.
- The geometry model scales progressively by row count. Sixteen rows keep the
  dense baseline spacing; lower row counts can use larger peg and row spacing
  when the measured board container has room. Current max peg gaps progress
  from about `62px` at 8 rows to `42px` at 16 rows, with intermediate row
  counts interpolated from the same formula.
- The same model also fits geometry down to the measured container width on
  mobile, so buckets remain aligned with landing columns without internal board
  scrolling.
- `PegGrid` consumes the shared geometry for peg rendering and animation
  waypoints.
- `MultiplierBar` consumes the shared geometry so buckets are positioned by
  landing-column centers instead of an independent grid.
- Manual QA follow-up found desktop 16 rows close to acceptable, desktop rows
  below 16 too small, buckets slightly too close to final peg row, and mobile
  board-level fit/readability issues across row counts. Follow-up fix is scoped
  to shared board geometry, rendering scale, bucket gap, and board-level
  overflow/clipping.
- The current mobile layout remains a technical responsive foundation. Future
  mobile HUD work may increase the board container height without changing the
  shared board geometry source.
- Follow-up fix increased the final peg-to-bucket vertical gap and removed the
  internal board scroll container; page-level vertical scroll remains
  acceptable when the board and current mobile controls need more height.
- On mobile, board width is constrained by the measured container width. The
  same geometry formula reduces peg spacing and bucket dimensions to keep the
  board and buckets within the viewport instead of creating a board-level
  horizontal scroll.

## Documentation update / docs-not-needed rationale

Updated `docs/modules/game.md` to document the responsive zones, attached bucket
row, and shared board geometry model.

## Commands run

- `Get-Content` for local skills, source files, docs, package scripts, and Next local docs.
- `rg --files`
- `rg -n "bucket|MultiplierBar|PegGrid|GameBoard|selectedRows|h-screen|overflow-hidden|w-55|PEG_GAP|ROW_H" src docs scripts skills`
- `git status --short --branch`
- `git status --porcelain=v1`
- `git branch --show-current`
- `git remote -v`
- `pnpm lint`
- `pnpm build`
- `C:\Program Files\Git\bin\bash.exe -lc 'cd /d/react/evoverse/internship/plinko && scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc 'cd /d/react/evoverse/internship/plinko && scripts/check-api-boundary.sh'`
- `git diff --check`

## Validation results

- `pnpm lint`: passed.
- `pnpm build`: passed.
- API boundary check: passed through Git Bash.
- `git diff --check`: passed.
- Automated in-app browser visual QA: blocked by browser policy/auth tooling
  limitations; user-approved manual visual QA is acceptable for this
  intermediate result.

## Docs freshness result

Passed through Git Bash. Mapped game docs were updated.

## Docs not needed rationale

Not used; mapped docs were updated.

## Code-quality review gate

Initial review found bucket/landing alignment and task artifact accuracy as
blocking issues. Geometry clarification implemented one feature-local source of
truth for peg, landing, and bucket geometry.
Manual QA follow-up found lower row counts too small, bucket vertical spacing
too tight, and mobile board fit issues. Follow-up implementation changed the
same geometry source so lower row counts progressively increase their maximum
peg spacing, 16 rows keep the dense baseline, bucket vertical spacing is larger,
and board rendering fits the measured container width without an internal board
scroll container.
Follow-up review after shared row-count-aware geometry fixes passed with no
blocking issues.

## Pre-commit readiness

Pending pre-commit readiness only. User manual QA accepted the current
intermediate board foundation result, and follow-up review passed with no
blocking issues.

## Risks

- Responsive scaling must keep pegs, ball, and buckets visually aligned.
- Bucket count changes with selected rows, so label sizing must remain readable from 8 to 16 rows.
- Mobile layout must avoid clipping caused by fixed `h-screen` and `overflow-hidden`.
- Mobile 16-row bucket text remains tight.
- Row bounds hardening may be considered later if game config becomes less
  trusted.
- Rendered automated QA may require local auth/backend state; report any blockers clearly.

## Artifact status / archival status

Active.

## Handoff / next step

Run pre-commit readiness when ready. Do not archive until validation, review,
and handoff are complete for the chosen commit/PR flow.

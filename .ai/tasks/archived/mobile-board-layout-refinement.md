# Task Artifact

## Task ID

mobile-board-layout-refinement

## Branch/worktree

Current workspace: `D:\react\evoverse\internship\plinko`

## Goal

Refine mobile board composition around the accepted mobile betting HUD so 8, 12, and 16 row boards fit the viewport harmonically, buckets remain readable, horizontal overflow is avoided, and desktop board behavior remains unchanged.

Second pass goal from screenshot: move the active peg pyramid visually higher, reduce vertical dead space above and below the board content, keep buckets readable, keep rows selector usable, and preserve no-horizontal-overflow behavior.

Compact-label follow-up goal: improve tight mobile 16-row bucket label readability by showing compact labels such as `16`, `9`, and `0.5` when bucket width is constrained, without changing multiplier semantics, bucket order, payout behavior, desktop layout, or the accepted mobile HUD.

Result-bucket emphasis check: if the winning bucket is already available to `MultiplierBar`, keep the enhancement presentation-only and local. Allow the emphasized bucket to briefly show its full multiplier label during the existing winner pulse.

Result-bucket emphasis refinement: the full label must not be clipped inside the tight bucket. Prefer a short floating overlay above the active bucket and keep the compact in-bucket label for tight mobile widths.

Floating-label desktop refinement: render the floating result label only for compact/tight buckets, so desktop/full-label buckets avoid duplicate multiplier text.

Final mobile rows selector polish: replace the detached mobile square/grid card with a right-side Lines rail that preserves row selection behavior and remains mobile-only.

Rows rail placement adjustment: keep the rail design but lower its mobile-only anchor into the board/peg area instead of pinning it near the page header.

## Scope

Implement the completed audit recommendation for mobile board stage/wrapper, small board centering if needed, bounded mobile-aware geometry refinement if layout alone is insufficient, and bucket readability protection.

Follow-up approved scope:
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/lib/boardGeometry.ts` only if compact-label condition needs a small bounded adjustment
- `.ai/tasks/active/mobile-board-layout-refinement.md`

Final rows selector polish approved scope:
- `src/features/game/ui/MobileRowsSelector.tsx`
- `src/features/game/ui/GameLayout.tsx` only if mobile-only placement/wrapper adjustment is needed
- `.ai/tasks/active/mobile-board-layout-refinement.md`

## Non-goals

- Redesign `MobileBetHud`.
- Change backend/API behavior.
- Change game result, payout, path, balance, or bucket semantics.
- Add autoplay, audio, fast/no-animation mode, or animation polish.
- Add dependencies or scripts.
- Broad refactors or folder structure changes.

## User approval

User approved implementation from the completed audit result and provided explicit editable scope.

## Audit / plan source

Completed audit result in current conversation:
- Primary editable scope: `GameLayout.tsx`, `GameBoard.tsx` if needed, `boardGeometry.ts` bounded mobile refinement, `MultiplierBar.tsx` for readability.
- Context-only: `MobileBetHud.tsx`, `PegGrid.tsx`, state/model/API files.
- Main risk: narrow mobile 16-row bucket readability and desktop regression from shared geometry.

## Approved editable files

- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/GameBoard.tsx` only for small wrapper/centering adjustment
- `src/features/game/lib/boardGeometry.ts` only for bounded mobile refinement
- `src/features/game/ui/MultiplierBar.tsx` only for mobile bucket readability
- `src/features/game/ui/MobileRowsSelector.tsx` only if wrapper overlap requires minimal adjustment

## Context-only files inspected

- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/model/game.store.ts`
- `src/app/(game)/game/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `docs/modules/game.md`
- `docs/doc-mapping.json`
- `docs/architecture.md`
- `docs/workflow/definition-of-done.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`

## Affected source files

- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/lib/boardGeometry.ts`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/ui/MobileRowsSelector.tsx`

## Affected docs

`src/features/game/**` maps to `docs/modules/game.md`. Expected docs-not-needed rationale unless behavior documentation changes.

## Stop conditions / scope expansion notes

- Stop if accepted HUD structure must change beyond wrapper/layout adjustment.
- Stop if implementation requires backend/API or game semantic changes.
- Stop before changing shared desktop geometry behavior unless desktop viewport QA is included.
- Stop if bucket readability requires a larger visual redesign.
- Stop if compact labels require a broader payout-table or bucket redesign.
- Stop if result-bucket emphasis requires new state ownership, store changes, path/result timing changes, `PegGrid` changes, ball animation changes, or broader animation polish.
- Stop if a readable result overlay cannot be implemented locally in `MultiplierBar`.
- Stop if the mobile rows rail requires a broader mobile HUD redesign, desktop behavior change, rows state/model change, or board geometry change.

## Architecture-sensitive changes

None planned. No BFF/auth/API boundary changes.

## Implementation summary

- Centered the mobile board within the available board stage instead of pinning it to the top.
- Tightened mobile-only board-stage padding to give the board a little more usable width and reduce excess gap above the accepted HUD.
- Preserved the existing desktop `lg` board behavior with explicit `lg:p-6`.
- Added compact rendering for very narrow multiplier buckets so 16-row mobile buckets keep visible labels without changing bucket values or result semantics.
- Added a bounded mobile geometry mode from `GameBoard` to `boardGeometry` so mobile row spacing can expand toward the available stage height without changing board width or desktop geometry.
- Raised the compact multiplier label threshold to catch tight 16-row mobile buckets on wider phones.
- Did not modify `PegGrid`, `MobileBetHud`, state, or API code.
- Follow-up: compact-width multiplier buckets now display compact text without the trailing `x`, while preserving full multiplier semantics in the bucket accessibility label.
- Result-bucket emphasis was implemented locally: the already-highlighted winner bucket now shows the full multiplier label with `x` during emphasis, while non-winning compact buckets keep the shorter label.
- Result-bucket emphasis refinement: compact in-bucket labels stay compact, and the winning bucket renders a separate floating full-label overlay above the bucket for readable landed multiplier feedback.
- Floating-label desktop refinement: the result overlay is now gated by the compact bucket condition; full-label buckets keep only the subtle active bucket emphasis.
- Final rows selector polish: converted `MobileRowsSelector` from detached square/grid card to a mobile-only right-side Lines rail with vertical row options and a clear active row pill. No `GameLayout`, `GameBoard`, geometry, state/model, HUD, or desktop controls changed for this pass.
- Rows rail placement adjustment: moved the rail to `top-[42%]` with `-translate-y-1/2`, keeping the rail design and desktop-hidden behavior unchanged.

## Documentation update / docs-not-needed rationale

Docs not needed: this is a visual layout/readability refinement inside the already documented game board/HUD structure. `docs/modules/game.md` already documents that `GameLayout` owns responsive board/control zones and that `MultiplierBar` renders the attached bucket row from shared board geometry; no behavior, API, state ownership, or module capability changed.

## Commands run

- `Get-Content -Path .ai/tasks/active/mobile-board-layout-refinement.md`
- `Get-Content -Path src/features/game/ui/GameLayout.tsx`
- `Get-Content -Path src/features/game/ui/GameBoard.tsx`
- `Get-Content -Path src/features/game/lib/boardGeometry.ts`
- `Get-Content -Path src/features/game/ui/MultiplierBar.tsx`
- `Get-Content -Path skills/implementation/SKILL.md`
- `Get-ChildItem -Path .ai/tasks -Force`
- `Get-ChildItem -Path .ai/tasks/active -Force`
- `Get-ChildItem -Path node_modules/next/dist/docs/01-app -Recurse -Filter '*.md' | Select-Object -First 30 -ExpandProperty FullName`
- `git status --short`
- `Get-Content -Path .ai/tasks/TEMPLATE.md`
- `Get-Content -Path node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `Get-Content -Path node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `git diff -- src/features/game/ui/GameLayout.tsx src/features/game/ui/MultiplierBar.tsx src/features/game/ui/GameBoard.tsx src/features/game/lib/boardGeometry.ts`
- `git status --short`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `Get-Content -Path skills/implementation/SKILL.md`
- `Get-Content -Path src/features/game/ui/MobileRowsSelector.tsx`
- `Get-Content -Path .ai/tasks/active/mobile-board-layout-refinement.md`
- `git status --short`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `Get-Content -Path src/features/game/ui/MultiplierBar.tsx`
- `Get-Content -Path .ai/tasks/active/mobile-board-layout-refinement.md`
- `git status --short`
- `Get-Content -Path skills/implementation/SKILL.md`
- `Get-Content -Path src/features/game/ui/MobileRowsSelector.tsx`
- `Get-Content -Path src/features/game/ui/GameLayout.tsx`
- `Get-Content -Path .ai/tasks/active/mobile-board-layout-refinement.md`
- `git status --short`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `bash scripts/check-api-boundary.sh` (failed through WSL shim; no distro installed)
- `bash scripts/check-docs-freshness.sh` (failed through WSL shim; no distro installed)
- `& 'C:\Program Files\Git\bin\bash.exe' scripts/check-api-boundary.sh` (incomplete Git Bash path; rerun with login shell)
- `& 'C:\Program Files\Git\bin\bash.exe' scripts/check-docs-freshness.sh` (incomplete Git Bash path; rerun with login shell)
- `& 'C:\Program Files\Git\usr\bin\bash.exe' -lc './scripts/check-api-boundary.sh'`
- `& 'C:\Program Files\Git\usr\bin\bash.exe' -lc './scripts/check-docs-freshness.sh'`
- `Start-Process ... pnpm dev -- --hostname 127.0.0.1 --port 3000`
- `Invoke-WebRequest -Uri http://127.0.0.1:3000/api/game/config`
- Node static geometry check for 320, 390, 430 mobile widths and 1366 desktop width
- `git diff --check`
- `git diff -- src/features/game/ui/GameLayout.tsx src/features/game/ui/GameBoard.tsx src/features/game/lib/boardGeometry.ts src/features/game/ui/MultiplierBar.tsx`
- Node static geometry check for second-pass mobile stage heights
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `& 'C:\Program Files\Git\usr\bin\bash.exe' -lc './scripts/check-api-boundary.sh'`
- `& 'C:\Program Files\Git\usr\bin\bash.exe' -lc './scripts/check-docs-freshness.sh'`
- Node static geometry check for final second-pass 320, 390, and screenshot-like 429 mobile widths
- `git status --short`
- `git diff --stat`
- `netstat -ano | findstr :3000`
- `Get-Content -Path skills/implementation/SKILL.md`
- `Get-Content -Path src/features/game/ui/MultiplierBar.tsx`
- `Get-Content -Path src/features/game/lib/boardGeometry.ts`
- `Get-Content -Path .ai/tasks/active/mobile-board-layout-refinement.md`
- `git status --short`
- `git diff -- src/features/game/ui/MultiplierBar.tsx .ai/tasks/active/mobile-board-layout-refinement.md`
- `pnpm lint`
- `git diff --check`
- `pnpm build`

## Validation results

- `pnpm lint`: PASS.
- `pnpm build`: PASS.
- `git diff --check`: PASS.
- Local `/api/game/config` during dev server QA: HTTP 200.
- Rendered browser QA: not completed because Playwright is not installed and no bundled browser dependency is configured.
- Static layout QA: mobile widths 320, 390, and 430 keep board width within available content width; compact multiplier labels activate for narrow 12/16-row buckets; 1366 desktop bucket widths remain above compact threshold.
- Second-pass static geometry QA: for an approximate 429px by 655px mobile board stage, 16-row board height grows from roughly 384px to roughly 511px without increasing width; first peg moves significantly higher and the bucket/HUD gap is reduced by the taller board composition.
- Final second-pass validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - `scripts/check-api-boundary.sh` via Git Bash login shell: PASS.
  - `scripts/check-docs-freshness.sh` via Git Bash login shell: PASS with docs-not-needed rationale.
- Static geometry check: screenshot-like 429px/655px stage makes 16-row board height about 511px, keeps width bounded, and activates compact 16-row bucket labels; 320px mobile activates compact labels for 12/16 rows; 390px tall phone activates compact labels for 16 rows.
- Compact-label follow-up validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - `boardGeometry.ts` was inspected but not changed for this follow-up; the existing compact bucket width condition was sufficient.
- Result-bucket emphasis validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - No `game.store`, `PegGrid`, path timing, backend/API, or animation lifecycle changes were needed.
- Result-bucket emphasis refinement validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - The full result label is now outside the overflow-hidden bucket body, so compact bucket clipping no longer hides the landed multiplier text.
- Floating-label desktop refinement validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - Overlay render path is gated by `isWinner && isCompactBucket`; full-label buckets do not render the floating duplicate.
- Final rows selector polish validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - Desktop behavior remains code-gated because `MobileRowsSelector` still uses `lg:hidden`; `GameLayout` was not changed for this pass.
- Rows rail placement adjustment validation:
  - `pnpm lint`: PASS.
  - `git diff --check`: PASS.
  - `pnpm build`: PASS.
  - `GameLayout` was not changed; desktop behavior remains code-gated by `lg:hidden`.

## Docs freshness result

PASS with docs-not-needed rationale using Git Bash login shell after the second pass.

## Docs not needed rationale

Visual-only mobile board composition and bucket label readability refinement. Existing game module docs remain accurate; no documented behavior, API boundary, state ownership, or game semantics changed.

## Code-quality review gate

Self-check complete. Changes stay within approved files, no context-only files were edited, no API/state/game semantics changed, and desktop geometry is gated behind the default layout mode. Compact-label follow-up is presentation-only: compact buckets drop the visual `x`, while full multiplier labels remain in accessibility text. Result-bucket emphasis reuses existing `winningBucketIndex` and winner styling in `MultiplierBar`; the readable full result label is a local floating overlay. Rows selector polish is mobile-only because `MobileRowsSelector` remains `lg:hidden`.

## Pre-commit readiness

Not staged or committed. Active task artifact is current. Changed files are expected: `GameLayout.tsx`, `GameBoard.tsx`, `boardGeometry.ts`, `MultiplierBar.tsx`, `MobileRowsSelector.tsx`, and this task artifact. The latest placement follow-up only changed `MobileRowsSelector.tsx` and this task artifact.

## Risks

- 16-row buckets on narrow mobile can become readable only at very small widths if geometry is simply squeezed.
- Shared geometry can accidentally affect desktop if mobile constraints are not isolated.
- Absolute mobile rows selector may overlap board if the board expands upward or is centered differently.
- Compact bucket labels are rotated only below a narrow-width threshold; verify they look acceptable with real payout tables.
- Compact labels intentionally remove only the visual `x`; verify users still understand these are multipliers from context and tooltip/accessibility labels.
- The floating result label may visually overlap the lowest pegs on very tight viewports; verify this reads as result feedback and does not obscure important board content.
- The new right-side Lines rail may overlap far-right pegs on the widest 16-row mobile board at very narrow widths; verify 320px mobile manually.
- The lowered rail may be closer to the upper-middle peg area; verify it does not obscure important 16-row peg paths at 320px.
- Local dev server process on port 3000 remained running after the normal stop attempt; elevated stop was not approved.
- Mobile row spacing now uses available height; verify especially short mobile heights to ensure the board still fits cleanly above the HUD.

## Artifact status / archival status

Active; do not archive before validation and handoff.

## Handoff / next step

Manual visual QA should check mobile 8, 12, and 16 rows at 320, 390, and 430 widths plus desktop at 1366 width. Confirm no horizontal page overflow, the Lines rail reads as an integrated right-side board control aligned with the upper-middle/right peg pyramid area, the rail does not cover important pegs/buckets, row buttons remain usable for 8/12/16, the active row is clear, compact bucket/result feedback remains readable, and desktop has no visual or behavior change.

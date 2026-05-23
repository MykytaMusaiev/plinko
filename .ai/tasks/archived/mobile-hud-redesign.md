# Task Artifact

## Task ID
mobile-hud-redesign

## Branch/worktree
feat/mobile-hud-redesign

## Goal
Implement a mobile-only product-ready Plinko betting HUD while preserving the current desktop controls, board foundation, game behavior, and feature ownership boundaries.

## Scope
- Extract shared betting control behavior into `src/features/game/model/useBetControlsModel.ts`.
- Keep desktop `BetControls` visually unchanged while wiring it to the shared model.
- Add `src/features/game/ui/MobileBetHud.tsx` for the mobile HUD composition.
- Update `src/features/game/ui/GameLayout.tsx` so desktop uses the existing controls layout and mobile uses `GameBoard` plus `MobileBetHud`.
- Update `docs/modules/game.md` if the game module ownership/mobile behavior description changes.
- Apply focused mobile HUD QA corrections: move rows/lines out of the bottom HUD, use compact mobile row tap targets near the board, change mobile CTA copy to Bet, calm CTA styling, and remove duplicated bottom balance.
- Fix mobile HUD overflow regression with shell/container/HUD changes only; do not change board internals.

## Non-goals
- No board geometry, physics, animation, backend, BFF, auth, API type, dependency, CI, package, README, or shared-layer changes.
- No real autoplay, STOP behavior, audio, fast/no-animation mode, mobile animation toggle, drop/bucket animation polish, or unrelated refactor.

## User approval
Approved by user request on 2026-05-23, based on the prior audit.

## Audit / plan source
Audit response for mobile Plinko product-ready HUD redesign.

## Approved editable files
- `.ai/tasks/active/mobile-hud-redesign.md`
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/MobileRowsSelector.tsx`
- `src/features/game/ui/GameLayout.tsx`
- `docs/modules/game.md`

## Context-only files inspected
- `AGENTS.md`
- `package.json`
- `docs/doc-mapping.json`
- `docs/decisions/002-state-ownership.md`
- `docs/workflow/definition-of-done.md`
- `src/features/game/model/game.store.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/api/bets.api.ts`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/ui/UserHeader.tsx`
- `src/features/game/lib/boardGeometry.ts`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`

## Affected source files
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/MobileRowsSelector.tsx`
- `src/features/game/ui/GameLayout.tsx`

## Affected docs
`docs/modules/game.md` is mapped for `src/features/game/**` changes.

## Stop conditions / scope expansion notes
Stop if implementation requires board geometry changes, desktop visual redesign, shared/public type changes, real autoplay/audio/fast-mode behavior, or files outside `src/features/game` plus mapped docs.

## Architecture-sensitive changes
None planned. The change stays inside the game feature and mapped docs.

## Implementation summary
- Added one shared betting control model for amount editing, clamping, submit, pending/playing disabled state, risk, rows, mode, and balance display.
- Rewired desktop `BetControls` to the shared model while preserving the existing desktop left-rail shell.
- Added `MobileBetHud` as the mobile-only HUD shell with centered Play CTA, compact amount strip, compact risk selector, disabled future Auto UI, rows control, and balance display.
- Updated `GameLayout` so desktop renders the existing controls rail and mobile renders board-first layout plus `MobileBetHud`.
- Manual QA findings to fix: mobile rows/lines full-width bottom control consumes too much vertical space; rows/lines should be compact near the board; mobile CTA should say Bet, not Play; CTA color should fit dark/green theme; bottom balance duplicates header balance; desktop board/layout needs regression check.
- Applied manual QA fixes: removed mobile rows slider from `MobileBetHud`, removed duplicate bottom balance, changed mobile CTA copy to Bet, calmed CTA styling to the existing dark/green theme, added `MobileRowsSelector` as a compact right-side board overlay with discrete row buttons, and preserved row updates through the shared model.
- Desktop regression check from source: `GameBoard`, `PegGrid`, `MultiplierBar`, and `boardGeometry` were not edited; desktop grid and `BetControls` layout remain on the `lg` breakpoint; the board wrapper only gained `relative` positioning for the mobile overlay and no desktop sizing changes.
- Manual QA overflow finding: mobile board, buckets, rows selector, and HUD no longer fit cleanly after the mobile HUD composition changes; horizontal scroll appeared and 16 rows was the tightest case.
- Applied shell-level overflow fix: mobile game root is now a flex column constrained to dynamic viewport height, the mobile main scene uses remaining height with `min-h-0` and `overflow-hidden`, the board wrapper prevents mobile horizontal bleed without changing board internals, `MobileBetHud` spacing/control heights were reduced, and `MobileRowsSelector` was shortened into a compact 3-column right-side overlay.

## Final-state summary before commit
- Final mobile CTA text is `Bet`, not `Play`, because current behavior remains manual betting without real Auto/Stop behavior.
- Duplicate bottom balance was removed from `MobileBetHud`; the top/header balance remains the mobile balance source.
- Rows/Lines was moved out of the bottom HUD into a compact mobile selector near the board.
- The horizontal overflow regression was fixed at the mobile shell/HUD level without changing `GameBoard`, `PegGrid`, `MultiplierBar`, or `boardGeometry`.
- Remaining mobile board layout refinement is intentionally deferred to a future board-layout task.

## Documentation update
Updated `docs/modules/game.md` for the new shared model and mobile/desktop shell ownership.

## Commands run
- `git status --short`
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-docs-freshness.sh` (failed: Windows `bash` resolves to WSL with no installed distro)
- `bash scripts/check-api-boundary.sh` (failed: Windows `bash` resolves to WSL with no installed distro)
- `git diff --check`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
- Browser setup attempted through the in-app browser; navigation to `http://localhost:3000` was blocked by browser local policy, so no browser screenshot/manual interaction was completed.
- `pnpm lint` after manual QA fixes
- `pnpm build` after manual QA fixes
- `git diff --check` after manual QA fixes
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'` after manual QA fixes
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'` after manual QA fixes
- `pnpm lint` after overflow fix
- `pnpm build` after overflow fix
- `git diff --check` after overflow fix
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'` after overflow fix
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'` after overflow fix

## Validation results
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `git diff --check`: passed.
- API boundary check through Git Bash: passed.
- Browser verification: blocked by in-app browser policy for `http://localhost:3000`.
- After manual QA fixes, `pnpm lint`, `pnpm build`, `git diff --check`, docs freshness, and API boundary checks all passed.
- After overflow fix, `pnpm lint`, `pnpm build`, `git diff --check`, docs freshness, and API boundary checks all passed.

## Docs freshness result
Passed through Git Bash.

## Docs not needed rationale


## Code-quality review gate
Repository review passed with no blocking issues. Browser verification was attempted but blocked by local browser/auth tooling.

## Pre-commit readiness
Not requested; do not stage, commit, or archive.

## Risks
- Compact Rows/Lines tap targets remain a usability tradeoff.
- Mobile virtual keyboard behavior was not fully verified.
- Rendered browser QA is blocked by local browser/auth tooling in this environment.
- Future mobile board layout refinement is needed in a separate board-layout task.

## Artifact status / archival status
Active; do not archive.

## Handoff / next step
Report final validation and manual QA checklist. Do not stage, commit, or archive.

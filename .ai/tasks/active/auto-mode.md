# Task Artifact

## Task ID

auto-mode

## Branch mode

PR-mode.

## Base branch

feat/plinko.

## Task branch

codex-auto-mode.

## Current branch at task start

feat/plinko before branch creation; codex-auto-mode after branch creation.

## Branch-start status

Ready. Working tree was clean before branch creation.

## Branch-start command/evidence

- `git status --short --branch` -> `## feat/plinko`
- `git branch --list` showed `feat/plinko`, `main`, and `codex-stack-aware-react-quality-gates`.
- `git checkout -b codex/auto-mode` failed because `.git/refs/heads/codex-stack-aware-react-quality-gates` blocks creating a `codex/` ref directory.
- `git checkout -b codex-auto-mode` required escalated permissions and succeeded.
- `git status --short --branch` -> `## codex-auto-mode`

## Local/no-PR rationale

Not applicable.

## PR lifecycle

Manual unless separately requested.

## Retroactive PR needed

No.

## Goal

Implement Auto Mode for the Plinko game while splitting backend request lifecycle from visual animation lifecycle, preserving sequential backend requests, and allowing multiple active visual rounds.

## Scope

- Split request pending/readiness from animation pending/readiness.
- Keep Manual and Auto backend requests sequential with one request in flight at a time.
- Allow Manual BET after backend response returns, even when prior animations continue.
- Add keyed active visual rounds and render multiple active balls safely.
- Implement Auto settings, runtime state, stop conditions, progress, start/stop lifecycle, desktop inline controls, and mobile bottom sheet.
- Correction scope: remove On Win / On Loss reset/increase controls and all related percentage bet-adjustment behavior from Auto Mode MVP.
- Preserve Fast playback quick resolution.
- Update game module documentation.

## Non-goals

- Playwright setup, UI automation, CI, tests, backend/API changes, new dependencies, audio, visual snapshot testing, full unrestricted parallel request betting, broad mobile redesign, mobile side drawer/menu, unrelated module refactors, and On Win / On Loss reset/increase bet adjustment.

## User approval

Approved by user request to implement the completed Auto Mode audit plan.

## Audit / plan source

Completed Auto Mode audit result in this thread. Key approved direction:

- Split backend request pending from animation pending.
- Introduce/adapt multi-round visual state keyed by `roundId`.
- Keep backend requests sequential.
- Allow overlapping visual animations.
- Keep Manual and Auto request safety consistent.
- Use Radix Dialog, already installed, for mobile bottom sheet.

## Approved editable files

- `src/features/game/model/game.store.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/model/autoMode.types.ts`
- `src/features/game/model/useAutoMode.ts`
- `src/features/game/model/autoMode.utils.ts`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/MobileRowsSelector.tsx`
- `src/features/game/ui/AutoSettings.tsx`
- `src/features/game/ui/MobileAutoSheet.tsx`
- `docs/modules/game.md`
- `.ai/tasks/active/auto-mode.md`

## Context-only files inspected

- `package.json`
- `docs/architecture.md`
- `docs/doc-mapping.json`
- `docs/modules/bets.md`
- `docs/decisions/002-state-ownership.md`
- `src/features/game/api/bets.api.ts`
- `src/app/api/bets/route.ts`
- `src/shared/types/api.types.ts`
- `src/features/auth/model/auth.store.ts`
- `src/app/(game)/game/page.tsx`
- `src/app/api/game/config/route.ts`

## Affected source files

- `src/features/game/model/game.store.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/model/useBetControlsModel.ts`
- `src/features/game/model/autoMode.types.ts`
- `src/features/game/model/autoMode.utils.ts`
- `src/features/game/model/useAutoMode.ts`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`
- `src/features/game/ui/MultiplierBar.tsx`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/AutoSettings.tsx`
- `src/features/game/ui/MobileAutoSheet.tsx`

## Affected docs

- `docs/modules/game.md`

## Stop conditions / scope expansion notes

Stop before changing shared API types, auth/BFF behavior, dependencies, package scripts, files outside approved scope, unrestricted parallel backend request behavior, Fast playback semantics, or state ownership outside the game feature.

## Architecture-sensitive changes

Game feature state changes only. No BFF/auth/API boundary changes planned.

## Stack Primitive Checklist

- Owning feature: `src/features/game`.
- Route/page thinness: `src/app/(game)/game/page.tsx` remains unchanged and delegates to `GameLayout`.
- Page-content orchestration: `GameLayout` continues to compose config loading, desktop controls, mobile HUD, rows selector, and board.
- Feature-local component split: Auto settings and mobile sheet may be split into `AutoSettings.tsx` and `MobileAutoSheet.tsx`; lifecycle logic stays in feature-local model files.
- Data/state/form ownership: TanStack Query/mutation stays responsible for bet server interactions; Zustand game store owns client game controls, auto runtime, and visual rounds; auth store owns displayed user balance only.
- Project/framework primitives: browser calls continue through `betsApi.place` and local `/api/bets`; Radix Dialog is used for the mobile sheet; no raw backend `/api/v1` calls; no new dependencies.
- Suppressions/bypasses: none approved and none planned.

## Suppression / framework-bypass approvals

None.

## Implementation summary

- Split backend request lifecycle from visual animation lifecycle with global `isBetRequestInFlight` and keyed visual rounds.
- Manual bet results now enqueue visual rounds and update balance immediately after backend response.
- `GameBoard` and `PegGrid` now support multiple active visual rounds/balls keyed by `roundId`; Fast playback completes visual rounds immediately.
- Added typed Auto settings/runtime state, sequential Auto request loop, stop conditions, and stop reasons.
- Added desktop inline Auto settings and mobile Radix Dialog bottom sheet.
- Mobile running state exposes a STOP CTA and compact Auto progress.
- Updated game module docs.
- Correction completed: removed On Win / On Loss UI and all reset/increase percentage adjustment behavior. Auto now uses the fixed starting bet amount for each request in a run.
- Final correction completed: removed the visible Auto status / stop reason field from desktop Auto controls and the mobile Auto sheet. Internal `stopReason` runtime state and label helpers remain allowed as lifecycle/debug state.
- Final Auto MVP UI shows Number of Bets, Stop on Profit, Stop on Loss, Start/Stop, and progress.

## Documentation update / docs-not-needed rationale

`docs/modules/game.md` will be updated because `src/features/game/**` behavior changes.

## Commands run

- `Get-Content -Raw skills/implementation/SKILL.md`
- `git status --short --branch`
- `git branch --list`
- `Get-ChildItem -Force .ai/tasks/active -ErrorAction SilentlyContinue`
- `Get-Content -Raw .ai/tasks/TEMPLATE.md`
- `git checkout -b codex/auto-mode` (failed due blocked ref path)
- `Get-ChildItem -Force .git/refs/heads`
- `git checkout -b codex-auto-mode` (failed in sandbox, then succeeded with escalation)
- `npx ctx7@latest library "Radix UI" "Implement mobile Auto bottom sheet with Radix Dialog in React"`
- `npx ctx7@latest docs /radix-ui/primitives "Implement mobile Auto bottom sheet with Radix Dialog in React"`
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-docs-freshness.sh` (failed because `bash` resolved to WSL without installed distro)
- `bash scripts/check-api-boundary.sh` (failed because `bash` resolved to WSL without installed distro)
- `git diff --check`
- `C:\Program Files\Git\bin\bash.exe scripts/check-docs-freshness.sh` (invalid Git Bash invocation, missing Unix tool PATH)
- `C:\Program Files\Git\bin\bash.exe scripts/check-api-boundary.sh` (invalid Git Bash invocation, missing Unix tool PATH)
- `C:\Program Files\Git\bin\bash.exe scripts/validate.sh` (invalid Git Bash invocation, missing Unix tool PATH)
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
- `pnpm dev -- --port 3000`
- Browser QA at desktop viewport and mobile `390x844`.
- `Stop-Process -Id 12064`
- `Stop-Process -Id 2412 -Force` (blocked without escalation; escalation was declined)
- `git status --short --branch`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`
- Correction commands:
  - `rg -n "On Win|On Loss|onWin|onLoss|increase|reset|Adjustment|percent|AUTO_PERCENT|getNextAutoBetAmount|isWinningResult" src/features/game docs/modules/game.md .ai/tasks/active/auto-mode.md`
  - `pnpm lint`
  - `pnpm build`
  - `git diff --check`
  - `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`
  - `C:\Program Files\Git\bin\bash.exe -lc './scripts/check-api-boundary.sh'`
  - `C:\Program Files\Git\bin\bash.exe -lc './scripts/validate.sh'`
  - Browser QA for desktop Auto tab, mobile Auto sheet, Auto run/progress, and manual repeat betting.

## Validation results

- PASS: `pnpm lint`
- PASS: `pnpm build`
- PASS: `git diff --check`
- PASS: Git Bash docs freshness via `bash.exe -lc`; output reported docs freshness passed with docs-not-needed rationale. Related `docs/modules/game.md` was also updated.
- PASS: Git Bash API boundary check via `bash.exe -lc`
- PASS: Git Bash aggregate `scripts/validate.sh` via `bash.exe -lc`
- Initial WSL `bash` and non-login Git Bash attempts were invalid environment invocations, not source failures.
- Correction validation also passed:
  - PASS: `pnpm lint`
  - PASS: `pnpm build`
  - PASS: `git diff --check`
  - PASS: Git Bash docs freshness via `bash.exe -lc`
  - PASS: Git Bash API boundary check via `bash.exe -lc`
  - PASS: Git Bash aggregate `scripts/validate.sh` via `bash.exe -lc`
  - PASS: source/docs scan found no remaining On Win / On Loss adjustment code paths.

## UI QA requirement

Required. This task changes visible UI, layout, responsive behavior, animation behavior, and high-frequency interactions.

## UI QA evidence

- PASS: Desktop Manual mode rendered and manual bet submission worked.
- PASS: Desktop Auto tab rendered inline settings with Number of Bets, stop fields, progress, and Start Auto.
- PASS: Desktop Auto completed a 2-bet run; visible status / stop reason text is intentionally not shown in the final UI.
- PASS: Desktop STOP stopped a 10-bet run at `2/10`; visible status / stop reason text is intentionally not shown in the final UI.
- PASS: Desktop Auto progress was visible.
- PASS: Mobile Manual mode rendered in the accepted HUD layout.
- PASS: Mobile Auto chip opened the Radix Dialog bottom sheet.
- PASS: Mobile bottom sheet Start Auto started Auto and closed the sheet after the timing fix.
- PASS: Mobile running state changed the main CTA to STOP and showed compact Auto progress like `Auto 1/20`.
- PASS: Manual repeated betting allowed a second BET after the first backend response while controls remained locked for active visual geometry.
- PASS: Auto created active visual rounds without waiting for animation completion; request progress advanced independently from active visual cleanup.
- PASS: STOP stopped scheduling new Auto bets.
- PASS: Fast playback still resolved quickly, with BET available while reveal cleanup finished.
- PASS: Mobile `documentElement.scrollWidth` equaled viewport width `390`; no obvious horizontal overflow.
- PASS: Header and bottom navigation remained visible and did not block game controls in the smoke pass.
- Correction QA:
  - PASS: Desktop Auto tab no longer shows On Win / On Loss sections.
  - PASS: Mobile Auto sheet no longer shows On Win / On Loss sections.
  - PASS: Desktop Auto tab and mobile Auto sheet no longer show a visible stop reason/status field such as `Completed` or `Stopped`.
  - PASS: Auto still starts, shows progress, and completes/stops while using the fixed current bet amount.
  - PASS: Start / Stop / progress still work.
  - PASS: Manual repeated betting still allowed a second BET after backend response while visual rounds continued.
  - PARTIAL: Stop on Profit / Stop on Loss fields remained visible and their code path is preserved, but editing those text fields through the in-app browser was blocked by the browser virtual clipboard/type interaction.

## Sandbox / tooling blockers

- Initial branch creation needed escalated permissions because sandbox could not create `.git/refs/heads/codex-auto-mode.lock`.
- WSL `bash` is unavailable because no WSL distro is installed; Git Bash works when invoked with `bash.exe -lc`.
- The local dev server process on port 3000 could not be stopped from sandboxed PowerShell. Escalated `Stop-Process` was requested and declined.

## Docs freshness result

Passed via Git Bash `bash.exe -lc './scripts/check-docs-freshness.sh'`.

## Docs not needed rationale

Not applicable; docs will be updated.

## Code-quality review gate

Passed via local `skills/review/SKILL.md` semantic review gate. Findings: no scope violations, no BFF/auth boundary violations, no suppressions or framework bypasses, UI/state ownership stayed feature-local, route page stayed thin, validation/UI QA evidence recorded. Residual risk: Auto sessions can have many active visual rounds if backend responses are much faster than animation, bounded by the MVP finite bet limit and pruned after visual cleanup.

## Pre-commit readiness

Not run; user did not ask to commit.

## Risks

- Auto loop stale closures or double scheduling.
- Overlapping visual rounds may cause render/performance pressure during long sessions.
- Balance timing changes could surprise if backend response order ever changes; sequential request rule mitigates this.
- Bucket highlight MVP must avoid stale cleanup from older rounds.

## Artifact status / archival status

Active; do not archive before validation and handoff.

## Archive commit verification

Not applicable.

## Handoff / next step

Implement scoped Auto Mode changes, update docs, then validate.

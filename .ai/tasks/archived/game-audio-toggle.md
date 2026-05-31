# Task Artifact

## Task ID

game-audio-toggle

## Branch mode

PR-mode.

## Base branch

feat/plinko

## Task branch

codex-game-audio-toggle

## Current branch at task start

feat/plinko, then switched to codex-game-audio-toggle before product edits.

## Branch-start status

Started from feat/plinko with untracked user-provided sound assets under public/.

## Branch-start command/evidence

`git status --short --branch` showed `## feat/plinko` and `?? public/`.
`git switch -c codex-game-audio-toggle` succeeded after sandbox escalation.

## Local/no-PR rationale

Not applicable.

## PR lifecycle

No staging, commit, push, merge, PR creation, or branch deletion requested or allowed.

## Retroactive PR needed

No.

## Goal

Implement the approved Audio Design + AudioToggle integration for the Plinko game.

## Scope

Add howler-backed feature-local gameplay audio, a compact header AudioToggle,
restrained Manual/Auto/Fast audio events, muted-state persistence, and game docs.

## Non-goals

No peg/contact sounds, volume slider, advanced mixer, ambient/music loop,
renderer rewrite, animation rewrite, backend/API changes, broad UI redesign,
Playwright, CI, staging, committing, pushing, merging, or branch deletion.
No peg/contact sound is intentional MVP behavior and is not a missing asset or
review gap.

## User approval

User approved adding `howler`. `@types/howler` may be added only if TypeScript
requires it.

## Audit / plan source

Approved read-only audit in previous turn plus the implementation prompt.

## Approved editable files

- package.json
- pnpm-lock.yaml
- src/app/(game)/_components/AppHeader.tsx
- src/features/game/ui/AudioToggle.tsx
- src/features/game/lib/audioSounds.ts
- src/features/game/lib/audioPolicy.ts
- src/features/game/model/audio.store.ts
- src/features/game/model/useGameAudio.ts
- src/features/game/model/usePlaceBet.ts
- src/features/game/model/useAutoMode.ts
- src/features/game/ui/GameBoard.tsx
- src/features/game/lib/visualPlaybackPolicy.ts
- docs/modules/game.md
- docs/doc-mapping.json only if required

## Context-only files inspected

- public/sounds/*
- src/features/game/ui/BetControls.tsx
- src/features/game/ui/MobileBetHud.tsx
- src/features/game/ui/AutoSettings.tsx
- src/features/game/ui/MobileAutoSheet.tsx
- src/features/game/ui/PegGrid.tsx
- src/features/game/ui/MultiplierBar.tsx
- src/shared/types/api.types.ts
- src/app/(game)/layout.tsx
- src/app/(game)/_components/BottomNavigation.tsx
- docs/architecture.md
- docs/modules/bets.md
- docs/doc-mapping.json
- node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md

## Affected source files

- package.json
- pnpm-lock.yaml
- public/sounds/auto-start.mp3
- public/sounds/auto-stop.mp3
- public/sounds/ball-drop.mp3
- public/sounds/ball-land.mp3
- public/sounds/bet-start.mp3
- public/sounds/result-high-win.mp3
- public/sounds/result-loss.mp3
- public/sounds/result-win.mp3
- public/sounds/ui-toggle.mp3
- src/app/(game)/_components/AppHeader.tsx
- src/features/game/lib/audioPolicy.ts
- src/features/game/lib/audioPolicy.test.ts
- src/features/game/lib/audioSounds.ts
- src/features/game/model/audio.store.ts
- src/features/game/model/useGameAudio.ts
- src/features/game/model/useAutoMode.ts
- src/features/game/model/usePlaceBet.ts
- src/features/game/ui/AudioToggle.tsx
- src/features/game/ui/GameBoard.tsx

## Affected docs

docs/modules/game.md

## Stop conditions / scope expansion notes

Stop if howler cannot install cleanly, header placement requires broad redesign,
audio state must become app-global beyond the game/header need, high-win
derivation is unsafe, renderer/animation/backend changes are required, or
validation fails for unclear reasons.

## Architecture-sensitive changes

Dependency addition only. No BFF/auth/backend boundary changes expected.

## Stack Primitive Checklist

- Owning feature: `src/features/game`.
- Route/page thinness: no page edits expected.
- Page-content orchestrator: `GameLayout` remains board/control orchestrator.
- Header placement: `AppHeader` shell imports the feature-owned `AudioToggle`.
- Feature-local component split: `AudioToggle` owns UI only; audio logic stays in model/lib files.
- Data/state ownership: feature-local audio store persists only muted preference.
- Project/framework primitives: Client Components for hooks, browser APIs, and localStorage.
- Forms/data fetching: not applicable.
- Suppressions/framework bypasses: none approved or planned.

## Suppression / framework-bypass approvals

None.

## Implementation summary

Added a Howler-backed feature-local audio layer, muted-state persistence,
header `AudioToggle`, Manual/Auto gameplay sound event wiring, result
classification, and Auto result throttling. Review found one merge-readiness
blocker: required MP3 assets exist under `public/sounds/` but are untracked, so
they must be included when the user manually stages and commits the branch.

Required sound assets for commit:

- public/sounds/ui-toggle.mp3
- public/sounds/bet-start.mp3
- public/sounds/ball-drop.mp3
- public/sounds/ball-land.mp3
- public/sounds/result-loss.mp3
- public/sounds/result-win.mp3
- public/sounds/result-high-win.mp3
- public/sounds/auto-start.mp3
- public/sounds/auto-stop.mp3

## Documentation update / docs-not-needed rationale

Updated `docs/modules/game.md` for audio behavior and dependency rationale.

## Commands run

- `git status --short --branch`
- `git switch -c codex-game-audio-toggle`
- Read-only file inspections.
- `pnpm add howler`
- `pnpm add -D @types/howler`
- `.\node_modules\.bin\vitest.CMD run src/features/game/lib/audioPolicy.test.ts`
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-docs-freshness.sh`
- PowerShell equivalent docs freshness check against `docs/doc-mapping.json`
- `Get-ChildItem -LiteralPath public/sounds`
- `git ls-files --others --exclude-standard -- public/sounds`
- `git diff --check`

## Validation results

- Focused Vitest policy test: passed, 3 tests.
- `pnpm lint`: passed cleanly.
- `pnpm build`: passed.
- `bash scripts/check-docs-freshness.sh`: blocked because Windows WSL `bash` has no installed distro.
- PowerShell equivalent docs freshness check: passed with docs-not-needed rationale.
- Asset existence check: all nine expected `public/sounds/*.mp3` files are present.
- Asset tracking check: all nine expected `public/sounds/*.mp3` files are untracked and must be included in manual staging/commit.
- `git diff --check`: passed after review-blocker artifact update.

## UI QA requirement

Required: visible header UI changes.

## UI QA evidence

Attempted in-app browser QA at `http://localhost:3000/game`; protected route
redirected to login because no authenticated session was available. The browser
runtime is read-only for cookie mutation, so the protected shell could not be
visually inspected. Build validation confirms the header/client component
composition compiles, and code inspection confirms the icon-only `AudioToggle`
is in the existing header action group immediately before `Logout`.

## Sandbox / tooling blockers

Creating the branch required escalation because writing refs was denied in the sandbox.
The Bash docs freshness script could not run because Windows WSL has no installed
distribution. Stopping the dev server process on port 3000 required escalation
and the approval request was rejected, so the local dev server may still be
running.

## Docs freshness result

Passed via PowerShell equivalent check against `docs/doc-mapping.json`.

## Docs not needed rationale

Package docs were not separately updated for `package.json` because this task
adds one approved feature dependency and its typings only; no package scripts,
repository operating rules, or validation expectations changed. The dependency
rationale is documented in `docs/modules/game.md`.

## Code-quality review gate

Self-review complete: feature ownership remains under `src/features/game`,
Howler usage is hidden behind feature-local helpers, no suppressions were added,
and no backend/BFF/auth boundaries changed.

## Pre-commit readiness

Code validation is ready, but merge-readiness requires manually staging and
committing the nine required `public/sounds/*.mp3` assets together with the
code/docs changes. No staging or commit performed per user instructions.

## Risks

Browser autoplay constraints, accidental Auto audio spam, and header wrapping on narrow viewports.

## Artifact status / archival status

Archived after PR merge and user-requested lifecycle close.

## Archive commit verification

Archive move is not committed yet. No staging or commit was performed during
lifecycle close per user instruction.

## Handoff / next step

User must include the nine required `public/sounds/*.mp3` files when manually
staging/committing. After that, the review blocker is resolved at repository
evidence level. User can manually verify the protected header after logging in;
`AudioToggle` should appear immediately to the left of `Logout`.

## Lifecycle close evidence

- PR merged into `feat/plinko`: merge commit `7fb8076` (`Merge pull request #13 from MykytaMusaiev/codex-game-audio-toggle`).
- Task branch commit `4ab5c4e` is an ancestor of `feat/plinko`.
- Remote task branch `origin/codex-game-audio-toggle` was deleted manually and was absent after `git fetch --prune`.
- Local `feat/plinko` was fast-forwarded from `9abf281` to `7fb8076`.
- Validation had passed before merge: focused audio policy tests, lint, build, API boundary check, docs freshness check, and `git diff --check`.
- Required sound assets were included in the merged PR under `public/sounds/*.mp3`.
- No peg/contact sound remains intentional MVP behavior, not a missing asset or lifecycle gap.

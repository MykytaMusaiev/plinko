# Task Artifact

## Task ID

progression-page-integration

## Branch mode

PR-mode.

## Base branch

feat/plinko

## Task branch

codex-progression-page-integration

## Current branch at task start

feat/plinko

## Branch-start status

Started from a clean `feat/plinko` worktree. Preferred branch name
`codex/progression-page-integration` was blocked by the local Git ref layout,
and `codex-progression-page-integration` required approved escalation to create
the branch ref.

## Branch-start command/evidence

- `git status --short --branch` returned `## feat/plinko`.
- `.ai/tasks/active/` contained only `.gitkeep`.
- Local Next.js layouts/pages and server/client component docs were inspected.
- `git switch -c codex/progression-page-integration` failed because Git could
  not create `.git/refs/heads/codex/progression-page-integration`.
- `git switch -c codex-progression-page-integration` failed in sandbox with
  permission denied creating the branch lock file.
- Escalated `git switch -c codex-progression-page-integration` succeeded.
- `git status --short --branch` returned
  `## codex-progression-page-integration`.
- `git rev-parse --short HEAD` returned `470f6ba`.

## Local/no-PR rationale

N/A.

## PR lifecycle

No staging, commit, push, PR creation, merge, branch deletion, or archival
requested.

## Retroactive PR needed

No.

## Goal

Implement the approved Progression Page Integration audit plan inside the
existing protected app shell.

## Scope

- Replace the protected `/progression` skeleton with a thin route that renders
  feature-local Progression content.
- Use existing Progression BFF/API client, query hook, claim mutations, query
  keys, and reward cache behavior.
- Render level, total XP, XP progress, daily reward, current streak, next claim
  availability, daily missions, starter missions, mission progress, credit/XP
  rewards, and claim states.
- Keep daily unavailable state as `Available later`/`Later` because the current
  daily DTO does not expose a claimed-specific signal.
- Use mission `claimable`, `claimedAt`, and real `id` only for mission claim
  behavior.
- Keep money/reward values as API strings and format through existing helpers.
- Update mapped Progression docs.

## Non-goals

- No BFF route changes unless a direct blocker is found and approved.
- No backend contract changes.
- No mission `type` or `status` enum usage or invention.
- No Profile page changes.
- No shell/navigation redesign.
- No Auto mode, audio, animation polish, new dependencies, Playwright setup,
  package scripts, or test setup.
- No frontend-only fake reward or progression persistence.
- No reward/money string conversion to numeric state.

## User approval

User approved implementation of the completed read-only audit plan and named
`skills/implementation/SKILL.md` as the workflow source.

## Audit / plan source

Completed read-only Progression Page Integration audit in this chat.

## Approved editable files

- `src/app/(game)/progression/page.tsx`
- `src/features/progression/ui/**`
- `src/features/progression/model/progressionViewModel.ts`
- Optional feature-local Progression model/lib helpers only if needed
- `docs/modules/progression.md`
- `docs/architecture.md` only if stale skeleton wording remains
- `.ai/tasks/active/progression-page-integration.md`

## Context-only files inspected

- `AGENTS.md`
- `package.json`
- `skills/implementation/SKILL.md`
- `skills/ui-qa/SKILL.md`
- `skills/documentation/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `docs/doc-mapping.json`
- `docs/api-boundary.md`
- `docs/modules/profile.md`
- `docs/modules/history.md`
- `docs/modules/game.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `docs/workflow/documentation-freshness.md`
- `src/app/api/progression/**`
- `src/features/progression/api/progression.api.ts`
- `src/features/progression/model/queryKeys.ts`
- `src/features/progression/model/useProgression.ts`
- `src/features/progression/model/useClaimDailyReward.ts`
- `src/features/progression/model/useClaimMissionReward.ts`
- `src/features/progression/model/rewardCache.ts`
- `src/features/progression/types/progression.types.ts`
- `src/app/(game)/layout.tsx`
- `src/app/(game)/_components/AppHeader.tsx`
- `src/app/(game)/_components/BottomNavigation.tsx`
- `src/features/profile/ui/**`
- `src/features/profile/model/profileViewModel.ts`
- `src/features/history/ui/**`
- `src/features/history/model/betHistory.model.ts`
- `src/shared/ui/Button.tsx`
- `src/shared/lib/apiFetch.ts`
- `src/shared/lib/bigint.ts`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Affected source files

- `src/app/(game)/progression/page.tsx`
- `src/features/progression/model/progressionViewModel.ts`
- `src/features/progression/ui/ClaimButton.tsx`
- `src/features/progression/ui/DailyRewardCard.tsx`
- `src/features/progression/ui/LevelProgressCard.tsx`
- `src/features/progression/ui/MissionCard.tsx`
- `src/features/progression/ui/MissionSection.tsx`
- `src/features/progression/ui/ProgressBar.tsx`
- `src/features/progression/ui/ProgressionErrorState.tsx`
- `src/features/progression/ui/ProgressionLoadingState.tsx`
- `src/features/progression/ui/ProgressionPageContent.tsx`
- `src/features/progression/ui/RewardAmount.tsx`

## Affected docs

- `docs/modules/progression.md`
- `docs/architecture.md` only if stale skeleton wording remains.

## Stop conditions / scope expansion notes

Stop before continuing if exact daily `Claimed` versus `Available later`
distinction becomes mandatory without backend support, backend/API contract
changes appear required, mission type/status enums appear necessary,
reward/money strings appear to require number conversion, new dependencies or
Playwright setup appear necessary, shell/navigation redesign appears necessary,
or files outside the approved Progression/page/docs/task scope are required.

## Architecture-sensitive changes

Progression feature UI integration only. No BFF/auth boundary behavior change
planned.

## Stack Primitive Checklist

- Owning feature: `src/features/progression`.
- Route/page thinness: `src/app/(game)/progression/page.tsx` remains a Server
  Component wrapper that renders feature-local content.
- Page-content orchestrator: `ProgressionPageContent` is the only client
  component that owns query/mutation orchestration.
- Feature-local component split: loading, error, level progress, daily reward,
  mission section, mission card, and small duplicated UI pieces split under
  `src/features/progression/ui/`.
- Data/state ownership: TanStack Query hooks and existing claim mutations own
  server state. No duplicated progression cache, no auth tokens in browser
  state, no frontend persistence.
- Claim state: daily uses mutation pending and `daily.canClaim`; mission uses
  matching pending id, `claimedAt`, `claimable`, and non-null `id`.
- Formatting/model ownership: Progression-specific progress math, labels, and
  view models belong in `src/features/progression/model/`.
- Project/framework primitives: use existing hooks, `apiFetch` boundary,
  `formatCredits`, lucide icons already present in the project, and Tailwind
  patterns from Profile/History.
- Suppressions/framework bypasses: none approved.

## Suppression / framework-bypass approvals

None.

## Implementation summary

- Replaced the protected `/progression` skeleton with a thin Server Component
  route that renders feature-local Progression content.
- Added `ProgressionPageContent` as the client orchestrator for
  `useProgression`, daily reward claims, mission reward claims, loading,
  error/retry, and success states.
- Added feature-local cards and sections for level progress, daily reward,
  daily missions, starter missions, mission progress, reward amounts, and claim
  controls.
- Added Progression view-model helpers for level progress math, mission
  progress math, reward formatting, next-claim labels, and claim-state labels.
- Preserved the existing BFF/API foundation and reward cache behavior.
- Preserved daily unavailable as `Available later` because no daily
  claimed-specific field exists in the current DTO.
- Preserved mission claim safety by requiring a real non-null mission id before
  any mission claim endpoint call.
- Kept mission claim pending display scoped to the matching mission id so claim
  affordances and mutation variables stay aligned.

## Documentation update

Updated `docs/modules/progression.md` and `docs/architecture.md`. API boundary
docs were not changed because BFF/auth behavior was not changed.

## Commands run

- `Get-Content skills/implementation/SKILL.md`
- `Get-Content` for applicable Superpowers, UI QA, and React best-practices
  skills
- `git status --short --branch`
- `Test-Path .ai/tasks/active/progression-page-integration.md; Get-ChildItem -Force .ai/tasks/active`
- `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `git switch -c codex/progression-page-integration`
- `git switch -c codex-progression-page-integration`
- Escalated `git switch -c codex-progression-page-integration`
- `git rev-parse --short HEAD`
- Added Progression feature UI and view-model files.
- Updated `src/app/(game)/progression/page.tsx`.
- Updated `docs/modules/progression.md` and `docs/architecture.md`.
- `git diff --check`
- `pnpm lint`
- `git diff --stat`
- `git status --short`
- `pnpm build`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-api-boundary.sh'`
- `Invoke-WebRequest http://localhost:3000/progression` checks for local route
  reachability and auth redirect behavior.
- Browser plugin attempt to navigate to `http://localhost:3000/register`
  for authenticated UI QA was rejected by browser security policy.
- `rg` suppression/framework-bypass scan across changed source/docs/artifact.
- Final `pnpm lint`
- Final `git diff --check`
- Final `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- Final `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-api-boundary.sh'`
- Final `pnpm build`

## Validation results

- PASS: final `git diff --check`.
- PASS: final `pnpm lint`.
- PASS: final `pnpm build`.
- PASS: final `scripts/check-docs-freshness.sh` via Git Bash.
- PASS: final `scripts/check-api-boundary.sh` via Git Bash.
- PASS: suppression/framework-bypass scan found no matches in changed
  Progression source, route, docs, or artifact.
- Not run: automated tests. `package.json` has no test script, and adding test
  setup or test files was outside the approved audit scope and validation plan.

## UI QA requirement

Required because this task creates visible adaptive UI, claim interactions, and
loading/error/success states.

## UI QA evidence

- Browser-based local UI QA was blocked. The in-app Browser rejected navigation
  to `http://localhost:3000` due browser security policy, and the Browser skill
  prohibits working around that with another browser surface.
- Local route reachability check returned HTTP 200 for `/progression` but
  showed the expected unauthenticated redirect to `/login?from=%2Fprogression`.
- User-provided manual UI QA was completed in a regular authenticated browser.
- Route checked: `/progression`.
- Desktop layout was visually acceptable.
- Shell header and bottom navigation looked acceptable with the Progression
  content.
- Claim buttons were clickable.
- Daily and mission rewards were received successfully.
- XP/progression updated after claims.
- No blocking visual or functional issues were found during manual QA.
- Additional user-provided manual mobile UI QA was completed in
  responsive/mobile view.
- Mobile `/progression` layout was visually acceptable.
- No horizontal overflow was found.
- Shell header and bottom navigation did not block page content on mobile.
- Daily reward card and mission cards were readable on mobile.
- Claim, in-progress, and claimed states remained usable on mobile.
- No blocking mobile visual or functional issues were found.
- Source-backed state coverage:
  - Desktop/mobile adaptive layout is implemented with shell-scrolled page
    content, a constrained max-width content column, and a desktop two-column
    level/daily grid that stacks on smaller screens.
  - Loading state is implemented in `ProgressionLoadingState`.
  - Error/retry state is implemented in `ProgressionErrorState`.
  - Success state is implemented in `ProgressionPageContent`.
  - Claimable daily reward uses `daily.canClaim === true`.
  - Unavailable daily reward uses `daily.canClaim === false`.
  - Claimable mission uses `mission.claimable === true && mission.id`.
  - Claimed mission uses `mission.claimedAt !== null`.
  - Incomplete mission is the default non-claimable progress-only state.
- No remaining blocking UI QA gaps are recorded.

## Sandbox / tooling blockers

Branch creation inside `.git` required escalation. The slash branch name was
blocked by the local ref layout. Browser-based local UI QA was blocked by the
in-app browser security policy for `localhost:3000`.

## Docs freshness result

Passed via Git Bash.

## Code-quality review gate

Completed. Semantic review passed with no blocking issues found.

- Risk level: Low.
- Recommendation: proceed to pre-commit readiness.
- Non-blocking note: parallel mission claim pending state is not needed for the
  current scope and may be revisited only if parallel mission claims become a
  product goal later.
- Residual risk: no automated tests were added because the repository has no
  test script; current confidence comes from lint, build, API-boundary/docs
  checks, and desktop/mobile manual UI QA.

## Pre-commit readiness

Not requested.

## Risks

- Daily DTO exposes `canClaim`, `streak`, `nextClaimAt`, and reward amounts,
  but no claimed-specific signal.
- Mission `id` is nullable, so claim controls must never call the endpoint
  without a real id.
- Mission `type` and `status` are `unknown` and must not drive UI behavior.
- No automated test script exists in `package.json`; adding test setup or
  scripts is outside approved scope.

## Artifact status / archival status

Active.

## Archive commit verification

N/A.

## Handoff / next step

Rerun pre-commit readiness.

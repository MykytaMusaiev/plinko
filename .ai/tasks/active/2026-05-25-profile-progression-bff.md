# Task Artifact

## Task ID
2026-05-25-profile-progression-bff

## Branch mode
PR-mode branch isolation for non-trivial implementation work.

## Base branch
feat/plinko

## Task branch
codex-profile-progression-bff

## Current branch at task start
feat/plinko

## Branch-start status
Clean worktree before branch creation.

## Branch-start command/evidence
- `git status --short` returned no changed files.
- `git rev-parse --verify feat/plinko` returned `d72f7e8204ceac7cfe1ef481bd64dba4a24a1ff0`.
- `git switch -c codex-profile-progression-bff` succeeded after sandbox escalation.

## Local/no-PR rationale
Not applicable.

## PR lifecycle
No staging, commit, push, PR creation, merge, branch deletion, or archival requested.

## Retroactive PR needed
No.

## Goal
Implement the approved Profile + Progression BFF foundation.

## Scope
- Add protected local BFF routes for profile and progression backend endpoints.
- Add feature-local profile and progression API clients, types, query keys, and TanStack Query hooks.
- Keep money, credits, reward, and balance fields typed as strings.
- Type mission `type` and `status` defensively because OpenAPI does not expose enum values.
- Add FormData-safe helper behavior so multipart avatar upload can pass through without forcing JSON content type.
- Update related docs and doc mapping.

## Non-goals
- No Profile page UI.
- No Progression page UI.
- No bottom navigation.
- No mobile Game UI redesign.
- No side panel or drawer.
- No Auto mode changes.
- No playback animation polish changes.
- No audio.
- No invented mission enums.
- No new dependencies.
- No broad refactors beyond FormData-safe helper support.
- No staging, committing, pushing, PR creation, merging, archiving, or branch deletion.

## User approval
Approved by user request to implement the completed audit plan.

## Audit / plan source
Completed Profile + Progression BFF audit result in the current conversation.

## Approved editable files
- `src/app/api/profile/me/route.ts`
- `src/app/api/profile/avatar/route.ts`
- `src/app/api/progression/me/route.ts`
- `src/app/api/progression/daily/claim/route.ts`
- `src/app/api/progression/missions/[id]/claim/route.ts`
- `src/features/profile/api/profile.api.ts`
- `src/features/profile/model/useProfile.ts`
- `src/features/profile/model/useUpdateProfile.ts`
- `src/features/profile/model/useUploadAvatar.ts`
- `src/features/profile/model/queryKeys.ts`
- `src/features/profile/types/profile.types.ts`
- `src/features/progression/api/progression.api.ts`
- `src/features/progression/model/useProgression.ts`
- `src/features/progression/model/useClaimDailyReward.ts`
- `src/features/progression/model/useClaimMissionReward.ts`
- `src/features/progression/model/queryKeys.ts`
- `src/features/progression/types/progression.types.ts`
- `src/shared/lib/apiFetch.ts`
- `src/shared/server/backendFetch.ts`
- `docs/api-boundary.md`
- `docs/architecture.md`
- `docs/doc-mapping.json`
- `docs/modules/profile.md`
- `docs/modules/progression.md`

## Context-only files inspected
- `AGENTS.md`
- `package.json`
- `skills/implementation/SKILL.md`
- `skills/audit/SKILL.md`
- `src/shared/server/authCookies.ts`
- `src/shared/types/api.types.ts`
- `src/app/api/bets/route.ts`
- `src/app/api/game/config/route.ts`
- `src/app/api/auth/**/route.ts`
- `src/features/auth/**`
- `src/features/game/**`
- `src/features/history/**`
- `docs/decisions/001-bff-auth-boundary.md`
- `docs/decisions/002-state-ownership.md`
- `docs/modules/auth.md`
- `docs/modules/game.md`
- `docs/modules/bets.md`
- `docs/modules/history.md`
- `scripts/validate.sh`
- `scripts/check-api-boundary.sh`
- `scripts/check-docs-freshness.sh`
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`

## Affected source files
- `src/shared/lib/apiFetch.ts`
- `src/shared/server/backendFetch.ts`
- `src/app/api/profile/me/route.ts`
- `src/app/api/profile/avatar/route.ts`
- `src/app/api/progression/me/route.ts`
- `src/app/api/progression/daily/claim/route.ts`
- `src/app/api/progression/missions/[id]/claim/route.ts`
- `src/features/profile/api/profile.api.ts`
- `src/features/profile/model/queryKeys.ts`
- `src/features/profile/model/useProfile.ts`
- `src/features/profile/model/useUpdateProfile.ts`
- `src/features/profile/model/useUploadAvatar.ts`
- `src/features/profile/types/profile.types.ts`
- `src/features/progression/api/progression.api.ts`
- `src/features/progression/model/queryKeys.ts`
- `src/features/progression/model/rewardCache.ts`
- `src/features/progression/model/useClaimDailyReward.ts`
- `src/features/progression/model/useClaimMissionReward.ts`
- `src/features/progression/model/useProgression.ts`
- `src/features/progression/types/progression.types.ts`

## Affected docs
- `docs/api-boundary.md`
- `docs/architecture.md`
- `docs/doc-mapping.json`
- `docs/modules/profile.md`
- `docs/modules/progression.md`

## Stop conditions / scope expansion notes
- Stop if mission enum-specific UI or behavior is required.
- Stop if backend/OpenAPI contradicts the confirmed profile/progression contracts.
- Stop before adding storage, mock avatar persistence, localStorage avatar fallback, or fake frontend success.

## Architecture-sensitive changes
- New protected BFF routes.
- FormData-safe adjustment to shared browser/server fetch helpers.
- New feature-local server-state ownership.

## Implementation summary
- Added six protected local BFF routes for Profile and Progression.
- Added feature-local Profile and Progression API wrappers, DTO types, query
  key constants, and TanStack Query hooks.
- Added FormData-safe behavior to browser and server fetch helpers so avatar
  uploads do not force a JSON content type.
- Implemented reward claim cache behavior: update progression cache, invalidate
  profile cache, and sync auth-owned user balance from backend
  `reward.balanceAfter`.
- Documented Profile and Progression module ownership and transitional avatar
  storage dependency.

## Documentation update / docs-not-needed rationale
Docs updated for API boundary, architecture ownership, doc mapping, Profile
module status, and Progression module status.

## Commands run
- `git status --short`
- `git branch --show-current`
- `git rev-parse --verify feat/plinko`
- `git switch -c codex/profile-progression-bff` (failed due ref lock layout)
- `git switch -c codex-profile-progression-bff`
- `rg` / `Get-Content` discovery commands
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-api-boundary.sh` (failed via Windows WSL bash because no
  distribution is installed)
- `bash scripts/check-docs-freshness.sh` (failed via Windows WSL bash because
  no distribution is installed)
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-api-boundary.sh'`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/validate.sh'`
- `git diff --check`
- `git ls-files --others --exclude-standard`

## Validation results
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `scripts/check-api-boundary.sh`: passed through Git Bash with login PATH.
- `scripts/check-docs-freshness.sh`: passed through Git Bash with login PATH.
- `scripts/validate.sh`: passed through Git Bash with login PATH.
- `git diff --check`: passed.

## Docs freshness result
Passed. The script output says it passed with a docs-not-needed rationale
because the active artifact template includes docs-not-needed wording, but the
task also updated the mapped docs directly.

## Docs not needed rationale


## Code-quality review gate
Semantic review gate not run as a separate local skill because the user asked
for implementation and validation only. Self-check completed for BFF boundary,
feature ownership, docs mapping, and validation.

## Pre-commit readiness
Validation passed. No staging or commit requested.

## Risks
- Backend avatar storage is transitional and may block end-to-end avatar persistence validation.
- Mission `type` and `status` enum values are not exposed by OpenAPI.
- Avatar upload plumbing uses the confirmed multipart field `image`, but actual
  persistence depends on backend storage readiness.

## Artifact status / archival status
Active. Do not archive in this task.

## Handoff / next step
Ready for user review or a separate review skill pass. Do not archive until a
future task explicitly requests it.

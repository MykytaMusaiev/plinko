# Task Artifact

## Task ID

profile-page-integration

## Branch mode

PR-mode

## Base branch

feat/plinko

## Task branch

codex-profile-page-integration

## Current branch at task start

feat/plinko

## Branch-start status

Started from a clean `feat/plinko` worktree. Preferred `codex/profile-page-integration` branch name was blocked by a local Git ref directory collision, and `codex-profile-page-integration` required escalated Git ref creation approval.

## Branch-start command/evidence

- `git status --short` returned no changed files.
- `git branch --show-current` returned `feat/plinko`.
- `git checkout -b codex/profile-page-integration` failed because Git could not create `.git/refs/heads/codex/profile-page-integration`.
- `git checkout -b codex-profile-page-integration` succeeded with approved escalation.

## Local/no-PR rationale

N/A.

## PR lifecycle

Complete. Manual commit was created, pushed, inspected in PR #8, merged into
`feat/plinko`, and branch cleanup was completed outside this lifecycle-close
step.

## Retroactive PR needed

No.

## Goal

Implement the approved Profile Page Integration audit plan inside the existing protected app shell.

## Scope

- Replace the protected `/profile` placeholder with profile content.
- Add feature-local Profile UI component(s).
- Reuse existing Profile BFF/API/hooks/types.
- Support nickname edit through `useUpdateProfile()`.
- Support avatar upload through `useUploadAvatar()` using existing multipart `image` field plumbing.
- Render Profile progression summary from `ProfileResponse.progression`.
- Keep `ProfileResponse.balance` in the existing data flow while leaving
  visible balance display shell-header-owned.
- Update mapped docs for implemented Profile UI.

## Non-goals

- Do not recreate or replace shell-owned header, balance/logout ownership, or bottom navigation.
- Do not implement Progression page.
- Do not redesign Game screen.
- Do not redesign shell/navigation.
- Do not rework Profile/Progression BFF foundation unless a contract mismatch blocks implementation.
- Do not add dependencies.
- Do not fake avatar persistence.
- Do not invent mission enums or unrelated progression behavior.
- Omit/defer Member Since because `ProfileResponse` does not expose it.
- Do not run `skills/ui-qa/SKILL.md` as a separate workflow during implementation unless explicitly requested.
- Do not stage or commit.

## User approval

User explicitly requested implementation of the approved audit plan and named `skills/implementation/SKILL.md` as the workflow source.

## Audit / plan source

Audit result in this chat, completed before implementation.

## Approved editable files

- `src/app/(game)/profile/page.tsx`
- `src/features/profile/ui/**`
- Optional feature-local helpers only if needed
- `docs/modules/profile.md`
- `docs/architecture.md` only if it still says Profile UI is only a skeleton
- This active task artifact

## Context-only files inspected

- `src/app/(game)/layout.tsx`
- `src/app/(game)/_components/AppHeader.tsx`
- `src/app/(game)/_components/BottomNavigation.tsx`
- `src/app/api/profile/me/route.ts`
- `src/app/api/profile/avatar/route.ts`
- `src/features/profile/api/profile.api.ts`
- `src/features/profile/model/queryKeys.ts`
- `src/features/profile/model/useProfile.ts`
- `src/features/profile/model/useUpdateProfile.ts`
- `src/features/profile/model/useUploadAvatar.ts`
- `src/features/profile/types/profile.types.ts`
- `src/features/progression/**`
- `src/features/auth/model/auth.store.ts`
- `src/shared/lib/apiFetch.ts`
- `src/shared/server/backendFetch.ts`
- `src/shared/lib/bigint.ts`
- `docs/doc-mapping.json`
- `docs/api-boundary.md`
- `docs/modules/progression.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Affected source files

- `src/app/(game)/profile/page.tsx`
- `src/features/profile/model/profileViewModel.ts`
- `src/features/profile/ui/ProfileAvatar.tsx`
- `src/features/profile/ui/ProfileErrorState.tsx`
- `src/features/profile/ui/ProfileLevelProgress.tsx`
- `src/features/profile/ui/ProfileLoadingState.tsx`
- `src/features/profile/ui/ProfileNicknameEditor.tsx`
- `src/features/profile/ui/ProfilePageContent.tsx`
- `src/features/profile/ui/ProfileStatCard.tsx`
- `src/features/profile/ui/ProfileStats.tsx`
- `src/features/profile/ui/ProfileSummaryCard.tsx`

## Affected docs

- `docs/modules/profile.md`
- `docs/architecture.md`

## Stop conditions / scope expansion notes

Stop for approval before changing BFF/API contracts, auth/security behavior, shared state ownership, shell/navigation ownership, dependencies, validation scripts, or Progression/Game UI.

## Architecture-sensitive changes

Profile feature UI only. No BFF/auth boundary change planned.

## Implementation summary

- Replaced the protected `/profile` placeholder with a Server Component wrapper
  that renders feature-local Profile content.
- Added a Profile Client Component that uses `useProfile()` for page data,
  `useUpdateProfile()` for nickname edits, and `useUploadAvatar()` for avatar
  upload.
- Added feature-local view-model helpers for avatar initials and bounded level
  progress math.
- Rendered loading, error/retry, disabled, pending, and toast feedback states.
- Preserved shell-owned balance/logout/header/navigation ownership.
- Omitted Member Since because `ProfileResponse` does not expose it.
- Applied a scoped component decomposition correction after implementation:
  `ProfilePageContent.tsx` is now the page-level query/state orchestrator, and
  non-trivial Profile UI pieces are split into feature-local files under
  `src/features/profile/ui/`.
- Removed the Profile content balance block after manual authenticated UI QA
  confirmed the page worked visually and the remaining UX issue was duplicated
  balance presentation. Balance is global iGaming wallet/account state and
  remains shell-header-owned to avoid duplicated financial state.
- Applied a scoped lint/framework suppression correction: removed the
  `@next/next/no-img-element` suppression from `ProfileAvatar.tsx` and replaced
  the raw avatar `<img>` with `next/image` while preserving avatar fallback,
  upload behavior, styling, accessibility, and layout.

## Documentation update / docs-not-needed rationale

Updated `docs/modules/profile.md` for implemented Profile UI and
`docs/architecture.md` to remove stale skeleton wording. API boundary docs were
not changed because BFF/auth boundary behavior was not changed. The scoped
component decomposition correction did not change product behavior or documented
product structure, so no product docs update was needed for the correction.
Updated `docs/modules/profile.md` after removing the Profile content balance
block so module documentation reflects shell-owned balance display.

## Commands run

- `Get-Content skills/lifecycle-close/SKILL.md`
- `git status --short`
- `git branch --show-current`
- `git status --short --branch`
- `Test-Path .ai/tasks/active/profile-page-integration.md; Test-Path .ai/tasks/archived/profile-page-integration.md`
- `Get-Content .ai/tasks/active/profile-page-integration.md`
- `git log --oneline --decorate -n 8`
- `Get-Content skills/implementation/SKILL.md`
- `git status --short`
- `Get-Content skills/implementation/SKILL.md`
- `git status --short`
- `Get-Content src/features/profile/ui/ProfileSummaryCard.tsx`
- `Get-Content docs/modules/profile.md`
- `Get-Content .ai/tasks/active/profile-page-integration.md`
- Removed the compact Profile content balance block from `ProfileSummaryCard.tsx`.
- Updated `docs/modules/profile.md` and this active task artifact for the
  shell-owned balance UX decision.
- `rg "Wallet|formatCredits|Balance|balance" src/features/profile/ui/ProfileSummaryCard.tsx docs/modules/profile.md .ai/tasks/active/profile-page-integration.md -n`
- `git diff --check`
- `pnpm lint`
- `pnpm build`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `Get-Content skills/implementation/SKILL.md`
- `git status --short`
- `git branch --show-current`
- `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `Get-Content superpowers/test-driven-development/SKILL.md`
- `Get-Content src/features/profile/ui/ProfilePageContent.tsx`
- `Get-Content src/features/profile/model/profileViewModel.ts`
- `Get-Content .ai/tasks/active/profile-page-integration.md`
- Split Profile UI into feature-local component files.
- `rg "function Profile|export function Profile|useProfile|useUpdateProfile|useUploadAvatar|formatCredits" src/features/profile/ui -n`
- `git diff --check`
- `pnpm lint`
- `git diff --check`
- `pnpm build`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `git status --short`
- `git diff --stat`
- `Get-Content skills/implementation/SKILL.md`
- `git status --short`
- Initial suppression scan including `src/app/(game)/profile` failed due
  unquoted PowerShell parentheses in `(game)`.
- `git diff -- src/features/profile/ui src/features/profile/model src/app/(game)/profile/page.tsx .ai/tasks/active/profile-page-integration.md` failed due unquoted PowerShell parentheses in `(game)`.
- `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- `npx ctx7@latest library Next.js` for current Image guidance.
- `npx ctx7@latest docs /vercel/next.js "Next.js Image component remote URL avatarUrl unoptimized no next.config remotePatterns width height fill replace img no-img-element"`
- `rg "unoptimized|remotePatterns|fill" node_modules/next/dist/docs/01-app -n`
- `Get-Content next.config.ts`
- Suppression scan across `src/features/profile` and the active task artifact.
- `git diff -- 'src/features/profile/ui' 'src/features/profile/model' '.ai/tasks/active/profile-page-integration.md'`
- `Get-Content node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- Replaced `ProfileAvatar.tsx` raw `<img>` with `next/image`.
- Re-ran suppression scan across `src/features/profile` and the active task
  artifact.
- `Get-Content src/features/profile/ui/ProfileAvatar.tsx`
- `git diff -- 'src/features/profile/ui/ProfileAvatar.tsx' '.ai/tasks/active/profile-page-integration.md'`
- Removed artifact wording that made the suppression scan match command text
  rather than source comments.
- Re-ran suppression scan across `src/features/profile` and the active task
  artifact.
- `git diff --check`
- `pnpm lint`
- Re-ran suppression scan across `src/features/profile` and the active task
  artifact after artifact wording cleanup.
- `pnpm build`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `git diff --check`
- `git status --short`
- Replaced the secondary Avatar stat with a progression-derived XP-to-next-level stat.
- Re-ran `git diff --check`
- Re-ran `pnpm lint`
- Re-ran `pnpm build`
- Re-ran `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- Re-ran `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-api-boundary.sh'`
- Re-ran `git status --short`
- `git branch --show-current`
- `Get-ChildItem node_modules/next/dist/docs -Recurse -File`
- `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `Get-Content build-web-apps/react-best-practices/SKILL.md`
- `Get-Content superpowers/test-driven-development/SKILL.md`
- `git checkout -b codex/profile-page-integration` failed due local ref layout.
- `git checkout -b codex-profile-page-integration` succeeded with approved escalation.
- `git diff --check`
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-docs-freshness.sh` failed because Windows resolved `bash`
  to WSL with no installed distro.
- `C:\Program Files\Git\bin\bash.exe scripts/check-docs-freshness.sh` returned
  an unreliable skip because coreutils were unavailable on PATH.
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-api-boundary.sh'`
- `git diff -- src/features/profile/ui/ProfilePageContent.tsx src/features/profile/model/profileViewModel.ts src/app/(game)/profile/page.tsx docs/modules/profile.md docs/architecture.md .ai/tasks/active/profile-page-integration.md` failed due unquoted PowerShell parentheses in `(game)`.
- `git status --short`

## Validation results

- PASS: `git diff --check` after component decomposition
- PASS: `pnpm lint` after component decomposition
- PASS: `pnpm build` after component decomposition
- PASS: docs freshness check via Git Bash `usr/bin/bash.exe` after component
  decomposition
- PASS: API boundary check via Git Bash `usr/bin/bash.exe`
- Not run: automated tests. `package.json` has no test script and no existing
  test files were found; adding test setup or scripts is outside approved scope.
- Not rerun for component decomposition: API boundary check, because no BFF,
  API, auth, or boundary helper files were touched by this correction.
- PASS: suppression scan found no source or artifact suppression comments after
  the ProfileAvatar correction.
- PASS: `git diff --check` after suppression correction.
- PASS: `pnpm lint` after suppression correction.
- PASS: `pnpm build` after suppression correction.
- PASS: docs freshness check via Git Bash `usr/bin/bash.exe` after artifact
  update.
- Not rerun for suppression correction: API boundary check, because no BFF,
  API, auth, or boundary helper files were touched.
- PASS: `git diff --check` after Profile balance UX correction.
- PASS: `pnpm lint` after Profile balance UX correction.
- PASS: `pnpm build` after Profile balance UX correction.
- PASS: docs freshness check via Git Bash `usr/bin/bash.exe` after Profile
  balance UX correction.
- Not rerun for Profile balance UX correction: API boundary check, because no
  BFF, API, auth, or boundary helper files were touched.

## UI QA requirement

Required after implementation because this task changes visible UI, layout, responsive behavior, forms, and avatar interaction. Per user instruction, UI QA checklist items are design constraints during implementation, but `skills/ui-qa/SKILL.md` is not run as a separate workflow in this turn.

## UI QA evidence

Focused manual UI QA evidence recorded after the Profile duplicate balance
removal:

- Route checked: `/profile` inside the protected authenticated shell.
- Viewports checked: mobile and desktop.
- Interaction state checked: authenticated success state after the scoped
  Profile content balance removal.
- Layout and responsive findings: Profile opens inside the protected shell;
  the summary card remains visually balanced after removing the Profile content
  balance block; mobile layout has no horizontal overflow; desktop layout
  remains constrained and clean.
- Navigation/shell overlap findings: shell header balance remains visible;
  bottom navigation does not overlap Profile content.
- UX findings: Profile content no longer duplicates the balance card; balance
  remains shell-header-owned.
- Render/performance findings: no visible lag or blocking visual issues were
  observed during the focused manual check.
- Blocking issues: none found.

## Sandbox / tooling blockers

Branch creation inside `.git` required escalation. Windows `bash` points to WSL,
which has no installed distro, so repository shell scripts were run through
Git Bash at `C:\Program Files\Git\usr\bin\bash.exe`. No test script exists in
`package.json`, and no existing test files were found; adding a test setup or
package script is outside the approved scope.

## Docs freshness result

PASS via `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`.

## Docs not needed rationale

N/A; related Profile and architecture docs were updated.

## Code-quality review gate

Completed. Semantic review result: PASS.

- Blocking issues: none.
- Ownership: Profile UI ownership is clean; shell/header/bottom-navigation
  ownership remains preserved.
- Balance UX: Profile content no longer duplicates balance; the shell header
  remains the single visible balance owner.
- BFF boundary: browser Profile code respects the local BFF boundary.
- Structure: component decomposition is feature-local and clean.
- Suppressions: no lint, type, or framework suppressions were found.
- UI QA: focused manual authenticated UI QA evidence is recorded above.
- Remaining risks: avatar rendering uses `next/image` with `unoptimized`;
  avatar persistence remains backend-dependent; no automated tests were run
  because `package.json` has no test script.

## Pre-commit readiness

Completed before lifecycle close. Pre-commit readiness passed with no blockers.
No staging or commit is performed by this lifecycle-close step.

## Risks

- Avatar persistence depends on backend storage readiness.
- Balance remains shell-header-owned; Profile still receives
  `ProfileResponse.balance` through the existing contract but no longer renders
  a duplicate content balance block.
- Member Since is omitted because the profile contract does not expose it.

## Artifact status / archival status

Archived during lifecycle close after implementation, review, pre-commit
readiness, manual commit, PR merge, branch cleanup, and user acceptance were
confirmed.

## Archive commit verification

N/A. The archive move is not committed in this lifecycle-close step because the
user requested no commit.

## Handoff / next step

Lifecycle closed. Commit the artifact archive move when ready.

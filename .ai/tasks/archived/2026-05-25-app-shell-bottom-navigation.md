# Task Artifact

## Task ID
2026-05-25-app-shell-bottom-navigation

## Branch mode
PR-mode planned for non-trivial implementation work.

## Base branch
feat/plinko

## Task branch
codex/app-shell-bottom-navigation

## Current branch at task start
feat/plinko

## Branch-start status
Implementation approved. Task branch created before source or docs
implementation edits.

## Branch-start command/evidence
- `git branch --show-current` returned `feat/plinko`.
- `git status --short` returned no changed files before task artifact creation.
- `git switch -c codex/app-shell-bottom-navigation` failed in the sandbox with
  `unable to create directory for .git/refs/heads/codex/app-shell-bottom-navigation`.
- Escalated `git switch -c codex/app-shell-bottom-navigation` succeeded.
- `git branch --show-current` returned `codex/app-shell-bottom-navigation`.

## Local/no-PR rationale
Not applicable.

## PR lifecycle
No staging, commit, push, PR creation, merge, branch deletion, or archival requested.

## Retroactive PR needed
No.

## Goal
Prepare and then implement App Shell + Bottom Navigation for protected app pages.

## Scope
- Add bottom navigation as a protected app-shell concern, not inside the Game feature.
- Move authenticated top app header behavior into the protected app shell so
  identity, balance, and logout are available across protected routes.
- Use a shell-contained footer nav, not a fixed overlay.
- Preserve the accepted mobile Game UI.
- Preserve existing mobile betting controls and board layout.
- Preserve the desktop left betting/control panel.
- Add Profile and Progression route skeletons only because the current proxy protects them.
- Remove or defer duplicated History controls according to the locked plan before implementation.
- Update affected docs for shell/navigation ownership and route status.

## Non-goals
- No mobile Game UI redesign.
- No mobile side panel or drawer.
- No betting control changes.
- No board layout or board geometry changes.
- No Profile page UI beyond a route skeleton.
- No Progression page UI beyond a route skeleton.
- No Profile or Progression BFF/API rework.
- No Auto mode implementation.
- No animation polish.
- No audio.
- No dependencies or package scripts.
- No auth/security behavior changes unless separately approved.

## User approval
User approved the audit direction, planning/task-artifact setup, and then
approved implementation using the prepared task artifact and approved scope.

## Audit / plan source
Completed App Shell + Bottom Navigation audit in the current conversation.

## Approved editable files
- `src/app/(game)/_components/AppHeader.tsx`
- `src/app/(game)/layout.tsx`
- `src/app/(game)/_components/BottomNavigation.tsx`
- `src/app/(game)/profile/page.tsx`
- `src/app/(game)/progression/page.tsx`
- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/UserHeader.tsx`
- `src/app/(game)/history/page.tsx`
- `docs/architecture.md`
- `docs/modules/game.md`
- `docs/modules/history.md`
- `docs/modules/profile.md`
- `docs/modules/progression.md`
- `.ai/tasks/active/2026-05-25-app-shell-bottom-navigation.md`

## Context-only files inspected
- `skills/implementation/SKILL.md`
- `skills/audit/SKILL.md`
- `AGENTS.md`
- `package.json`
- `src/proxy.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/providers.tsx`
- `src/features/game/ui/MobileBetHud.tsx`
- `src/features/game/ui/BetControls.tsx`
- `src/features/game/ui/GameBoard.tsx`
- `docs/doc-mapping.json`
- `scripts/validate.sh`
- `scripts/check-api-boundary.sh`
- `scripts/check-docs-freshness.sh`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-pathname.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`

## Affected source files
- `src/app/(game)/_components/AppHeader.tsx`
- `src/app/(game)/layout.tsx`
- `src/app/(game)/_components/BottomNavigation.tsx`
- `src/app/(game)/profile/page.tsx`
- `src/app/(game)/progression/page.tsx`
- `src/app/(game)/history/page.tsx`
- `src/features/game/ui/GameLayout.tsx`
- `src/features/game/ui/UserHeader.tsx`

## Affected docs
- `docs/architecture.md`
- `docs/modules/game.md`
- `docs/modules/history.md`
- `docs/modules/profile.md`
- `docs/modules/progression.md`

## Stop conditions / scope expansion notes
- Stop if Profile or Progression route skeletons would be unprotected.
- Stop before editing `src/proxy.ts`; proxy changes are not currently in scope.
- Stop if bottom nav requires a fixed overlay that covers `MobileBetHud`.
- Stop if implementation requires changing `MobileBetHud`, `BetControls`,
  `GameBoard`, board geometry, Profile API, or Progression API.
- Stop before adding a drawer, side panel, broad app-shell redesign, dependencies,
  package scripts, API/auth changes, or real Profile/Progression UI.
- Stop if local Next.js docs contradict the planned App Router route-group shell
  or client active-route component placement.

## Architecture-sensitive changes
Protected shell/navigation ownership changes only. No BFF/auth boundary changes planned.

## Implementation summary
- Added a protected `(game)` route-group layout that owns the shell-contained
  bottom navigation.
- Added a shell-owned top app header with app identity, balance, and logout,
  reusing the previous Game header behavior at the protected app-shell level.
- Added a co-located client `BottomNavigation` component using `usePathname`
  and `aria-current` for active route state.
- Added protected `/profile` and `/progression` route skeleton pages only.
- Removed duplicated History navigation from the Game header and History page
  header.
- Removed the game-local `UserHeader` from `GameLayout` to avoid duplicate
  headers on `/game`.
- Adjusted `GameLayout` height ownership minimally so it fits inside the
  protected shell while preserving existing mobile controls, board composition,
  and desktop left controls.

## Documentation update
Docs updated for architecture and affected module ownership/status.

## Commands run
- `Get-Content -Path .\\skills\\implementation\\SKILL.md`
- `Get-Content -Path .\\src\\proxy.ts`
- `Get-ChildItem -Force -Recurse -Depth 3 -Path .\\.ai`
- `Get-Content -Path .\\.ai\\tasks\\TEMPLATE.md`
- `Get-Content -Path .\\.ai\\tasks\\archived\\2026-05-25-profile-progression-bff.md -TotalCount 180`
- `git branch --show-current`
- `git status --short`
- `git switch -c codex/app-shell-bottom-navigation`
- `rg --files node_modules/next/dist/docs | Select-String -Pattern 'layout|linking|routing|route-groups|use-pathname|redirect'`
- `Get-Content` for local Next.js layout, route groups, usePathname, and linking docs
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-docs-freshness.sh`
- `bash scripts/check-api-boundary.sh`
- Browser plugin attempt for `http://127.0.0.1:3000/profile` and
  `http://localhost:3000/profile`
- `git diff --check`
- `git status --short`
- `git diff --name-only`
- `Get-Content -Path .\\skills\\implementation\\SKILL.md`
- `Get-Content -Path C:\\Users\\M\\.codex\\plugins\\cache\\openai-curated\\build-web-apps\\6188456f\\skills\\react-best-practices\\SKILL.md`
- `rg -n 'UserHeader|from ''\\./UserHeader''|from \"\\./UserHeader\"|Balance:|Logout' src\\app src\\features docs\\modules\\game.md docs\\architecture.md`
- `pnpm lint`
- `pnpm build`
- `git diff --check`
- `bash scripts/check-docs-freshness.sh`
- `C:\Program Files\Git\bin\bash.exe -lc 'cd /d/react/evoverse/internship/plinko && scripts/check-docs-freshness.sh'`

## Validation results
- `pnpm lint` passed.
- `pnpm build` passed.
- `git diff --check` passed.
- Browser plugin QA was blocked by browser security policy for both
  `127.0.0.1:3000` and `localhost:3000`.
- User manually tested the rendered app and reported all OK.
- Follow-up shell-header correction: `pnpm lint`, `pnpm build`, and
  `git diff --check` passed again.
- Follow-up source search confirmed no remaining `UserHeader` imports and that
  balance/logout rendering is now owned by `src/app/(game)/_components/AppHeader.tsx`.

## Docs freshness result
- `bash scripts/check-docs-freshness.sh` could not run because Windows
  Subsystem for Linux has no installed distributions in this environment.
- `bash scripts/check-api-boundary.sh` had the same WSL blocker. API boundary
  files were not edited in this task.
- Follow-up docs-freshness attempt had the same WSL blocker.
- Git Bash rerun succeeded from the repository path:
  `PASS: Documentation freshness check passed.`

## Docs rationale
Related docs were updated for the shell/navigation ownership changes.

## Code-quality review gate
Semantic self-check performed against the implementation scope and Vercel
React/Next.js best-practices skill. Separate subagent review was not run
because the available spawn-agent tool requires explicit user authorization
for delegation.

## Pre-commit readiness
Not run. No staging or commit requested.

## Risks
- Shell height integration could unintentionally resize or crowd the accepted Game layout.
- A fixed or overlay nav would risk covering `MobileBetHud`; implementation must remain shell-contained.
- Keeping current Game and History header controls would duplicate bottom nav.
- Route skeletons must remain minimal and not expand into Profile/Progression feature UI.
- Shell-level header reduces the vertical space available to protected content;
  manual viewport QA should confirm mobile HUD and board still fit as intended.

## Artifact status / archival status
Archived after lifecycle closure.

## Lifecycle closure note
- PR merged into `feat/plinko`.
- Manual QA passed.
- Review passed.
- Pre-commit readiness passed.
- Validation passed.
- Product result accepted.

## Archive commit verification
Not applicable.

## Handoff / next step
Lifecycle closed.

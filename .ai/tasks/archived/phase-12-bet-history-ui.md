# Task Artifact

## Task ID

phase-12-bet-history-ui

## Branch/worktree

feat/plinko

## Goal

Implement a responsive authenticated Bet History page at `/history` using the verified `GET /api/bets` contract and the provided screenshot as the visual target.

## Scope

- Add a separate authenticated `/history` page.
- Wire the game header History button to `/history`.
- Use the existing local BFF `/api/bets` through existing frontend API wrappers.
- Use TanStack Query for history server state.
- Implement loading, empty, error, and populated states.
- Implement Risk and Rows filters.
- Apply Risk filtering client-side because backend support is not verified.
- Do not implement pagination, load more, endless scroll, drawer, Fair UI, or Recent Results.

## Non-goals

- No auth, BFF route handler, `backendFetch`, or game flow changes.
- No new dependencies.
- No broad UI system or responsive refactor.

## Affected source files

- `src/app/(game)/history/page.tsx`
- `src/features/game/ui/UserHeader.tsx`
- `src/features/history/api/history.api.ts`
- `src/features/history/ui/BetTable.tsx`

## Affected docs

- `docs/modules/history.md`
- `docs/modules/game.md`
- `docs/architecture.md`

## Architecture-sensitive changes

No BFF/auth architecture changes. The route remains protected by `src/proxy.ts`; browser data fetching remains local `/api/*`.

## Commands run

- `Get-Content -Raw skills/implementation/SKILL.md`
- `rg --files node_modules\next\dist\docs | Select-Object -First 40`
- `git status --short -uall`
- `Get-Content -Raw docs\architecture.md`
- `Get-Content -Raw node_modules\next\dist\docs\01-app\01-getting-started\03-layouts-and-pages.md`
- `Get-Content -Raw node_modules\next\dist\docs\01-app\01-getting-started\04-linking-and-navigating.md`
- `Get-Content -Raw src\proxy.ts`
- `pnpm lint`
- `pnpm build`
- `bash scripts/check-api-boundary.sh`
- `bash scripts/check-docs-freshness.sh`
- `bash scripts/validate.sh`
- `git diff --stat`
- `git status --short -uall`

## Validation results

- `pnpm lint`: passed.
- `bash scripts/check-api-boundary.sh`: passed.
- `bash scripts/check-docs-freshness.sh`: passed.
- `bash scripts/validate.sh`: passed.
- `pnpm build`: failed on existing TypeScript target support for BigInt
  literals in `src/shared/lib/bigint.ts`; this task did not change that file or
  TypeScript configuration.

## Manual verification

Passed in browser with an authenticated user:

- Logged-in user can open `/history`.
- Header History navigation opens `/history`.
- History page renders correctly.
- `GET /api/bets` is called through local `/api/bets`.
- No direct browser call to backend `/api/v1/*` was observed.
- Responsive layout looks acceptable.
- No obvious horizontal overflow was observed during mobile-width check.

## Docs freshness result

Passed. Related docs were updated for the changed history/game route behavior.

## Docs not needed rationale


## Risks

- Backend Risk filtering support is unverified, so Risk filtering is client-side only.
- Non-null `nextCursor` behavior is unverified, so pagination is intentionally omitted.
- Mobile layout must avoid horizontal overflow on narrow screens.
- Production build remains blocked by the pre-existing BigInt target issue in
  `src/shared/lib/bigint.ts`.

## Handoff / next step

Implementation is complete. Review the responsive `/history` UI and decide
whether the pre-existing build target issue should be handled in a separate
task.

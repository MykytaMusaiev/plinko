# Task Artifact

## Task ID

phase-11-verify-bets-get-response

## Branch/worktree

feat/plinko

## Goal

Verify the authenticated `GET /api/bets` response shape from a real local runtime after login, then update frontend types and documentation only if the verified backend response differs from current assumptions.

## Scope

- Use the existing Next.js BFF route at `src/app/api/bets/route.ts`.
- Verify the real authenticated `GET /api/bets` response after login.
- Update `BetListResponse` and related types only if the real response differs.
- Update `docs/modules/bets.md` and `docs/api-boundary.md` if verification changes current documentation.
- Keep unknown response fields marked `Unverified` until verified.

## Non-goals

- Do not implement History UI.
- Do not change unrelated modules.
- Do not add dependencies.
- Do not bypass the BFF boundary or call backend `/api/v1/*` from browser-side code.

## Affected source files

- Changed: `src/shared/types/api.types.ts`.
- Reference only: `src/app/api/bets/route.ts`, `src/features/game/api/bets.api.ts`.

## Affected docs

- Changed: `docs/modules/bets.md`.
- Changed: `docs/api-boundary.md`.

## Architecture-sensitive changes

Yes. This task touches authenticated BFF response typing and must preserve:

- Browser -> local `/api/*` -> backend `/api/v1/*` flow.
- Server-only backend Authorization handling.
- httpOnly token ownership in BFF/server code.

## Commands run

- `git status --short`
- `rg -n "BetListResponse|betsApi|/api/bets|GET" src docs -S`
- `Get-ChildItem -Recurse -Force src\app\api\bets,src\features\game,src\shared\types,docs\modules,docs | Select-Object FullName`
- `Get-Content -Raw .ai\tasks\TEMPLATE.md`
- `Get-Content -Raw src\shared\types\api.types.ts`
- `Get-Content -Raw src\app\api\bets\route.ts`
- `Get-Content -Raw src\features\game\api\bets.api.ts`
- `git branch --show-current`
- `Get-ChildItem -Recurse src\app\api\auth | Select-Object FullName`
- `rg -n "API_BASE|BACKEND|NEXT_PUBLIC|auth/login|login|register" .env* src docs AGENTS.md -S`
- `Get-Content -Raw src\app\api\auth\login\route.ts`
- `Get-Content -Raw src\shared\server\backendFetch.ts`
- `Get-Content -Raw src\shared\server\authCookies.ts`
- `Get-Content -Raw package.json`
- `Get-ChildItem -Force -Name .env*`
- `Get-Content -Raw docs\modules\bets.md`
- `Get-Content -Raw docs\api-boundary.md`
- `Get-Content .env.local | ForEach-Object { if ($_ -match '^\s*([^#=]+)=') { $matches[1].Trim() } }`
- `Get-Content -Raw src\features\auth\api\auth.api.ts`
- `Get-Content -Raw src\features\auth\ui\LoginForm.tsx`
- `Get-Content -Raw src\features\auth\model\useLogin.ts`
- `Get-Content -Raw skills/implementation/SKILL.md`
- `pnpm lint`
- `bash scripts/check-api-boundary.sh`
- `bash scripts/check-docs-freshness.sh`
- `git diff --stat`
- `git diff -- src\shared\types\api.types.ts docs\modules\bets.md docs\api-boundary.md .ai\tasks\active\phase-11-verify-bets-get-response.md`
- `pnpm lint`
- `bash scripts/check-api-boundary.sh`

## Validation results

- `pnpm lint`: passed.
- `bash scripts/check-api-boundary.sh`: passed.
- `bash scripts/check-docs-freshness.sh`: passed.

## Verified response summary

Manual authenticated verification confirmed that `GET /api/bets` returns:

- `items`: array.
- `nextCursor`: `string | null`; observed value was `null`.
- Each observed item contains `betId`, `amount`, `rows`, `risk`, `path`,
  `bucketIndex`, `multiplier`, `payout`, `balanceAfter`, and `createdAt`.
- `amount`, `multiplier`, `payout`, and `balanceAfter` are strings.
- `rows` and `bucketIndex` are numbers.
- `createdAt` is a string timestamp.
- Observed list items did not include `seed`.

## Docs freshness result

Passed. Related docs were updated for the mapped type/API documentation change.

## Docs not needed rationale

Not used. Related docs were updated.

## Risks

- Non-null `nextCursor` values and pagination semantics remain unverified.
- Additional backend fields not present in the verified sample remain unverified.
- The verified sample only observed `LOW`; other allowed `Risk` values come
  from existing shared code, not from this GET sample alone.

## Handoff / next step

Phase 11 update is complete. `BetListResponse` now uses a GET-specific list item type without `seed`, and docs record the verified shape while keeping unobserved fields unverified.

Readiness notes:

- `.env.local` exists and defines `API_BASE`; the value was not copied into this artifact.
- Login payload shape is `{ "email": string, "password": string }`.
- `GET /api/bets` requires httpOnly auth cookies set by local `POST /api/auth/login`.
- Verification can use the local BFF with a cookie jar after `pnpm dev` starts.
- Valid credentials or an approved local registration flow are required before response shape can be verified.

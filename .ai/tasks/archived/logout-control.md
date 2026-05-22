# Task Artifact

## Task ID

logout-control

## Branch/worktree

Current workspace: `D:\react\evoverse\internship\plinko`

## Goal

Implement an auth-owned logout control near the existing History control in the game header.

## Scope

- Add `src/features/auth/ui/Logout.tsx`.
- Add feature-local logout handling in `src/features/auth/model/useLogout.ts`.
- Update `src/features/game/ui/UserHeader.tsx` to render Logout near History.
- Keep logout behavior browser-to-BFF through the existing `authApi.logout()` wrapper.
- Update mapped module docs to reflect implemented logout UI behavior.

## Non-goals

- Do not change BFF/API behavior.
- Do not refactor auth.
- Do not change route protection.
- Do not add dependencies.
- Do not touch unrelated features.

## User approval

Approved implementation scope from the logout ownership/auth-flow audit.

## Affected source files

- `src/features/auth/model/useLogout.ts`
- `src/features/auth/ui/Logout.tsx`
- `src/features/game/ui/UserHeader.tsx`

## Affected docs

- `docs/modules/auth.md`
- `docs/modules/game.md`

## Architecture-sensitive changes

- Auth-owned UI and model files were added under `src/features/auth`.
- The game header composes the auth-owned `Logout` component but does not own logout behavior.
- Browser code continues to call local `/api/auth/logout` through `authApi.logout()`.
- No backend `/api/v1/*` calls were added to browser code.
- No auth tokens are read, stored, logged, or forwarded from browser state.

## Implementation summary

- `useLogout` calls `authApi.logout()`.
- On successful logout, `useLogout` clears Zustand auth state, clears TanStack Query cache, and redirects to `/login` with `router.replace`.
- `Logout.tsx` renders a small responsive button with the existing `lucide-react` `LogOut` icon and error toast handling.
- `UserHeader` renders Logout next to the existing History link and allows the header to wrap on narrow widths.
- No BFF route, route protection, backend contract, dependency, or script changes were made.

## Documentation update / docs-not-needed rationale

Updated mapped module docs because the auth and game modules now have new implemented UI behavior:

- `docs/modules/auth.md` records frontend logout state/query cleanup and redirect behavior.
- `docs/modules/game.md` records that `UserHeader` renders the auth-owned Logout control.

## Commands run

- `git status --short`
- `rg --files node_modules/next/dist/docs`
- `Get-Content` inspections of relevant auth, header, docs, and Next.js local docs
- `pnpm lint`
- `pnpm build`
- `git diff --check`
- Partial local smoke check: `POST http://127.0.0.1:3000/api/auth/logout`

## Validation results

- `pnpm lint`: passed.
- `pnpm build`: passed.
- `git diff --check`: passed.
- Partial local smoke check: `POST /api/auth/logout` returned `204` and sent expired `accessToken` and `refreshToken` cookies.
- Full authenticated click-through was not completed because the local session did not have a valid backend-authenticated user available.

## Docs freshness result

Mapped docs were updated for touched source areas:

- `src/features/auth/**` -> `docs/modules/auth.md`
- `src/features/game/**` -> `docs/modules/game.md`

API boundary docs were not changed because no BFF/API behavior changed.

## Docs not needed rationale

No additional docs were needed beyond mapped auth and game module docs.

## Code-quality review gate

Ready for review gate. The implementation keeps component rendering in `Logout.tsx`, mutation/session behavior in the feature-local auth model hook, and header placement in the game UI owner.

## Pre-commit readiness

Ready for pre-commit flow after review. Validation passed, but changes have not been staged or committed.

## Risks

- No automated tests were added because the repository has Vitest dependencies but no `package.json` test script.
- Full authenticated browser logout remains manually unverified in this local environment.

## Artifact status / archival status

Archived. Completed and accepted for manual commit readiness.

## Handoff / next step

Ready for manual commit.

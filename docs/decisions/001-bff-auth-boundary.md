# BFF Auth Boundary

Status: Accepted

## Context

The Plinko frontend talks to an external backend under `/api/v1/*`. The backend
is treated as external and frozen for this frontend work, so frontend changes
must not depend on backend CORS or contract changes.

The browser runtime must not call backend `/api/v1/*` endpoints directly. Auth
tokens have moved out of browser-readable state into httpOnly cookies:
`accessToken` and `refreshToken`.

## Decision

Use Next.js App Router route handlers as a BFF boundary:

- Browser code calls local `/api/*` routes only.
- BFF route handlers call backend `/api/v1/*` routes.
- `API_BASE` is server-only and read from `src/shared/server/env.ts`.
- The BFF owns backend `Authorization` header construction.
- `accessToken` and `refreshToken` are stored as httpOnly cookies.
- `backendFetch` reads cookies from `NextRequest`, performs server-side
  refresh/retry when auth is required, and returns cookie update instructions
  to route handlers.

## Alternatives considered

- Browser calls backend directly with bearer tokens.
- Browser stores tokens in Zustand or web storage.
- Changing backend CORS/auth behavior.
- Duplicating refresh/retry logic in every route handler.

## Trade-offs

- The browser has a smaller auth surface and no direct backend token handling.
- BFF route handlers add one frontend server hop before backend requests.
- Some auth route handlers still contain direct backend fetch logic where that
  is current implementation.
- Cookie updates must be applied consistently by BFF route handlers.

## Consequences

- New browser API clients must target local `/api/*` routes.
- New backend `/api/v1/*` calls belong in BFF/server-only code.
- Auth-sensitive route handlers should use shared cookie helpers.
- Follow-up: reduce duplicated auth route logic only if a future task scopes
  that refactor.

## Related files

- `src/shared/lib/apiFetch.ts`
- `src/shared/server/backendFetch.ts`
- `src/shared/server/authCookies.ts`
- `src/shared/server/env.ts`
- `src/app/api/auth/**/route.ts`
- `src/app/api/bets/route.ts`
- `src/app/api/game/config/route.ts`

## Validation

Verified from current code on 2026-05-20:

- `apiFetch` rejects non-`/api/*` paths.
- `API_BASE` is imported from server-only env code.
- `backendFetch` reads auth cookies, sets backend bearer auth server-side, and
  refreshes/retries authenticated requests.
- Auth cookies are configured with `httpOnly: true`.

Status: Implemented
Owner: Frontend
Source of truth: src/shared/lib/apiFetch.ts, src/shared/server/backendFetch.ts
Last verified: 2026-05-20
Related files: src/app/api, src/shared/lib/apiFetch.ts, src/shared/server

# API Boundary

The frontend uses a Next.js BFF boundary.

Request flow:

Browser runtime -> local Next.js `/api/*` route -> backend `/api/v1/*`.

Implemented browser boundary:

- Browser runtime code calls local `/api/*` routes only.
- `apiFetch` rejects paths that do not start with `/api/`.
- Browser requests use same-origin credentials.
- Browser code must not use backend `/api/v1/*` paths directly.
- Browser code must not use `NEXT_PUBLIC_API_BASE` for backend API calls.
- Browser code must not construct backend `Authorization: Bearer ...` headers.

Implemented server boundary:

- Backend `/api/v1/*` paths are used in server-side BFF code.
- `API_BASE` is read from server-only env code in `src/shared/server/env.ts`.
- `backendFetch` builds backend requests using `API_BASE`.
- `backendFetch` reads `accessToken` and `refreshToken` from `NextRequest`
  cookies when auth is required.
- `backendFetch` adds backend bearer authorization only from server-side cookie
  state.
- `backendFetch` refreshes tokens when auth is required and the access token is
  missing or the backend returns 401 with a refresh token available.
- `backendFetch` returns status, parsed JSON or null, refreshed tokens, and a
  clear-auth-cookie flag for route handlers to apply.
- BFF route handlers are responsible for returning local `NextResponse`
  objects and applying cookie updates.

Current local BFF routes:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/game/config`
- `GET /api/bets`
- `POST /api/bets`

Unverified:

- Backend error body consistency across all `/api/v1/*` endpoints.
- Full GET `/api/v1/bets` item shape beyond current TypeScript assumptions.

Status: Implemented
Owner: Frontend
Source of truth: src/shared/lib/apiFetch.ts, src/shared/server/backendFetch.ts
Last verified: 2026-05-20
Related files: src/app/api, src/shared/lib/apiFetch.ts, src/shared/server

# API Boundary

The frontend uses a Next.js BFF boundary.

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
- `backendFetch` reads auth cookies from `NextRequest`, refreshes tokens when
  needed, and applies backend responses to local BFF responses.

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

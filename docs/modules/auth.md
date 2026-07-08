Status: Implemented
Owner: Frontend
Source of truth: src/app/api/auth, src/features/auth, src/shared/server
Last verified: 2026-05-22
Related files: src/app/api/auth, src/features/auth/api/auth.api.ts, src/features/auth/model/auth.store.ts

# Auth Module

Implemented:

- Browser auth API calls use local BFF routes through `authApi`.
- `POST /api/auth/login` forwards credentials to backend
  `/api/v1/auth/login`, fetches `/api/v1/users/me` with the returned access
  token, sets auth cookies, and returns `{ user }`.
- `POST /api/auth/register` forwards credentials to backend
  `/api/v1/auth/register`, fetches `/api/v1/users/me` with the returned access
  token, sets auth cookies, and returns `{ user }` with status 201.
- `POST /api/auth/refresh` reads the httpOnly `refreshToken` cookie, calls
  backend `/api/v1/auth/refresh`, fetches `/api/v1/users/me`, updates auth
  cookies, and returns `{ user }`.
- `POST /api/auth/logout` calls backend `/api/v1/auth/logout` best-effort when
  both cookies exist, then clears local auth cookies and returns 204.
- `GET /api/auth/session` uses `backendFetch` to call backend
  `/api/v1/users/me` with auth and returns `{ user }`.
- Session hydration calls local `/api/auth/session` and stores the returned
  user in Zustand.
- The logout UI calls the local logout wrapper, clears frontend session state
  and cached query data after success, then redirects to `/login`.

Security rules:

- `accessToken` and `refreshToken` are httpOnly cookies.
- Zustand stores session/UI state only. It must never store auth tokens.
- Browser code must not read, write, log, or forward auth tokens.
- Browser code must not construct backend bearer token headers.
- Browser auth code must use local `/api/auth/*` BFF routes, not backend
  `/api/v1/auth/*` routes.

Partial:

- Login, register, and refresh duplicate `fetchUserMe` logic in route handlers.
  This is current behavior, not a refactor target for this skeleton.

Unverified:

- Backend auth error shapes are passed through when available but are not fully
  documented here.

Status: Implemented
Owner: Frontend
Source of truth: src/app/api/auth, src/features/auth, src/shared/server
Last verified: 2026-05-20
Related files: src/app/api/auth, src/features/auth/api/auth.api.ts, src/features/auth/model/auth.store.ts

# Auth Module

Implemented:

- Browser auth API calls use local BFF routes through `authApi`.
- Login and register submit credentials to local BFF routes.
- Successful login/register responses set httpOnly auth cookies in the BFF.
- Refresh uses the httpOnly `refreshToken` cookie and updates both auth cookies.
- Logout calls the backend best-effort when tokens exist, then clears local
  cookies.
- Session hydration calls `/api/auth/session` and stores the returned user in
  Zustand.

Security rules:

- `accessToken` and `refreshToken` are httpOnly cookies.
- Zustand stores session/UI state only. It must never store auth tokens.
- Browser code must not read, write, log, or forward auth tokens.
- Browser code must not construct backend bearer token headers.

Partial:

- Login, register, and refresh duplicate `fetchUserMe` logic in route handlers.
  This is current behavior, not a refactor target for this skeleton.

Unverified:

- Backend auth error shapes are passed through when available but are not fully
  documented here.

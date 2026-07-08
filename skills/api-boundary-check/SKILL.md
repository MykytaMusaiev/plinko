---
name: api-boundary-check
description: Check Plinko API boundary and auth-token safety. Use when changes touch browser API clients, Next.js BFF routes, shared server helpers, auth, bets, API types, or when asked to verify no browser direct /api/v1 calls or token handling regressions exist.
---

# API Boundary Check

## Goal

Verify that browser code calls only local BFF routes and token handling remains
server-side.

## When to use

- Changes touch `src/features/**/api`, `src/shared/lib/apiFetch.ts`,
  `src/app/api/**`, `src/shared/server/**`, or auth state.
- The user asks to verify BFF/API boundary compliance.
- Review or pre-commit work needs an API-boundary check.

## When not to use

- The task is unrelated documentation with no API/auth impact.
- The user explicitly restricts work to a different read-only checklist.

## Required context

- Changed files and relevant diffs.
- `docs/api-boundary.md`.
- `docs/decisions/001-bff-auth-boundary.md`.
- `src/shared/lib/apiFetch.ts`, `src/shared/server/**`, and touched BFF routes.

## Restrictions

- Do not edit files unless the user asked for fixes.
- Do not approve browser-side backend `/api/v1/*` calls.
- Do not approve browser-side `Authorization` bearer construction.
- Do not approve browser-side token storage.

## Workflow

1. Search browser-capable code for `/api/v1`, `API_BASE`,
   `NEXT_PUBLIC_API_BASE`, `Authorization`, `accessToken`, and `refreshToken`.
2. Confirm browser wrappers call local `/api/*` routes.
3. Confirm backend `/api/v1/*` calls live in BFF/server-only code.
4. Confirm BFF route paths map consistently to backend paths.
5. Confirm `backendFetch` or route handlers own backend Authorization.
6. Confirm auth cookies and Zustand responsibilities remain separated.
7. Report any boundary violations or unverified areas.

## Output format

- Pass / Needs changes
- Files inspected
- Boundary findings
- Token-handling findings
- BFF route mapping findings
- Unverified areas
- Suggested fixes if needed

## Common mistakes

- Treating all `fetch` calls as equivalent.
- Missing client files that import shared helpers.
- Allowing `NEXT_PUBLIC_API_BASE` for backend calls.
- Confusing httpOnly cookie names in server code with browser token ownership.
- Ignoring direct `Authorization` headers outside server/BFF code.

Status: Partial
Owner: Frontend
Source of truth: source code and package.json
Last verified: 2026-05-25
Related files: src/app, src/features, src/shared, package.json

# Architecture

This repository is a Next.js App Router frontend for a Plinko game.

Implemented:

- App Router files live under `src/app`.
- Route groups split auth and game pages:
  - `src/app/(auth)/login`
  - `src/app/(auth)/register`
  - `src/app/(game)/game`
  - `src/app/(game)/history`
  - `src/app/(game)/profile`
  - `src/app/(game)/progression`
- The protected `(game)` route group owns the authenticated app shell,
  including the top app header with identity, balance, and logout, plus
  shell-contained bottom navigation.
- Next.js BFF route handlers live under `src/app/api`.
- Root providers in `src/app/providers.tsx` configure TanStack Query, auth
  hydration, and Sonner toasts.
- `src/proxy.ts` allows public auth/API paths and redirects protected page
  requests to `/login` when the `refreshToken` cookie is absent.

Feature folders:

- `src/features/auth` contains auth API wrappers, Zustand session state, and
  login/register UI.
- `src/features/game` contains manual game controls, board rendering, game
  state, config loading, and bet placement integration.
- `src/features/history` contains the responsive authenticated bet history page
  UI and API wrapper for the existing local bets endpoint. The shared protected
  app shell owns route switching to and from History.
- `src/features/profile` contains feature-local profile API wrappers, DTO
  types, query keys, profile mutation/query hooks, and the protected Profile
  page content UI.
- `src/features/progression` contains feature-local progression API wrappers,
  DTO types, query keys, and reward claim/query hooks. Only a protected route
  skeleton exists for the future progression page UI.
- `src/features/fair` exists but current files are empty.

Shared layers:

- `src/shared/lib` contains browser-safe reusable utilities such as API fetch,
  bigint formatting/parsing, HMAC helpers, and multiplier colors.
- `src/shared/types` contains shared API TypeScript shapes.
- `src/shared/ui` contains generic UI primitives.
- `src/shared/server` contains server-only environment, backend fetch, and auth
  cookie helpers.

Architecture rules:

- Server Components are the default for App Router code.
- Use Client Components only for hooks, event handlers, browser APIs, or client
  state.
- Keep feature-specific code inside its feature module.
- Use `src/shared` only for generic reusable logic.
- Do not move backend API calls into browser runtime code.

Planned:

- Deeper module documentation may be added as modules become complete.
- Package-level validation aliases are not wired yet; run repository scripts
  directly when needed.
- Task artifact creation remains manual.

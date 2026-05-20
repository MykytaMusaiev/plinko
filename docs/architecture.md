Status: Partial
Owner: Frontend
Source of truth: source code and package.json
Last verified: 2026-05-20
Related files: src/app, src/features, src/shared, package.json

# Architecture

This repository is a Next.js App Router frontend for a Plinko game.

Implemented:

- App Router pages live under `src/app`.
- Feature code lives under `src/features`.
- Shared UI, browser helpers, server helpers, and shared types live under
  `src/shared`.
- Root providers configure TanStack Query, auth hydration, and Sonner toasts.
- Protected page access is checked in `src/proxy.ts` by looking for the
  `refreshToken` cookie. Full session validation happens through BFF routes.

Architecture rules:

- Server Components are the default for App Router code.
- Use Client Components only for hooks, event handlers, browser APIs, or client
  state.
- Keep feature-specific code inside its feature module.
- Use `src/shared` only for generic reusable logic.
- Do not move backend API calls into browser runtime code.

Planned:

- Deeper module documentation may be added as modules become complete.
- Repo-local skills and automation are future phases, not current
  infrastructure.

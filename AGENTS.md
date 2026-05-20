<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# Repository Operating Rules

This repository is a Next.js App Router Plinko frontend. Treat the current
repository and `package.json` as the source of truth before making changes.

Current stack:

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- Tailwind CSS 4
- TanStack Query 5
- Zustand
- React Hook Form and Zod
- Vitest and Testing Library dependencies are installed, but no test script is
  currently defined in `package.json`

Package manager: `pnpm`, based on `pnpm-lock.yaml` and
`pnpm-workspace.yaml`.

Available commands:

- `pnpm dev`
- `pnpm lint`
- `pnpm build`
- `pnpm start`

Do not claim that a script exists unless it is present in `package.json`.
Repository validation scripts exist under `scripts/`, but `package.json` does
not currently define a validation alias. Use available package scripts and
direct script paths.

# Documentation Lookup Rules

Use the `ctx7` CLI to fetch current documentation whenever a task asks about a
library, framework, SDK, API, CLI tool, or cloud service. This includes API
syntax, configuration, migration, setup, and library-specific debugging.

Use the library resolution step first unless the user provides an explicit
`/org/project` library ID:

1. `npx ctx7@latest library <name> "<user's question>"`
2. Pick the best matching `/org/project` ID.
3. `npx ctx7@latest docs <libraryId> "<user's question>"`

For Next.js code changes, also read the relevant local guide under
`node_modules/next/dist/docs/` before editing. This repo uses Next.js `16.2.6`;
do not rely on older App Router assumptions.

Run Context7 CLI requests outside Codex's default sandbox. If a Context7 command
fails with DNS, host resolution, or fetch errors inside the sandbox, rerun it
outside the sandbox.

# Architecture Boundaries

Use Next.js App Router conventions:

- Server Components are the default.
- Client Components are only for hooks, event handlers, browser APIs, or client
  state.
- Keep the feature-oriented structure.
- Put shared utilities in `src/shared` only when the logic is generic and
  reusable.

Browser runtime code must not call backend `/api/v1/*` endpoints directly.

Browser-facing code must call local Next.js BFF routes under `/api/*` through
the existing browser-side helpers and feature API modules. The backend
`/api/v1/*` boundary belongs in server-only code such as:

- `src/app/api/**/route.ts`
- `src/shared/server/backendFetch.ts`
- other files under `src/shared/server/`

Auth tokens are server-managed:

- `accessToken` and `refreshToken` are httpOnly cookies.
- Zustand stores session and UI state only; never store `accessToken` or
  `refreshToken` there.
- Browser code must not read, write, store, log, or transmit these tokens.
- Browser code must not construct `Authorization` headers for backend calls.
- Browser code must not use `NEXT_PUBLIC_API_BASE` for backend API calls.
- Session hydration should use the local BFF session route, not backend auth
  endpoints.

The existing BFF helpers are the preferred path for backend calls:

- `src/shared/lib/apiFetch.ts` for browser-to-BFF calls.
- `src/shared/server/backendFetch.ts` for BFF-to-backend calls.
- `src/shared/server/authCookies.ts` for auth cookie updates.

# Source Layout

Preserve the current feature-oriented layout:

- `src/app` for App Router pages, layouts, providers, proxy, and BFF routes.
- `src/features` for feature modules.
- `src/shared` for shared UI, types, browser utilities, and server-only helpers.

Do not introduce broad app refactors unless the user explicitly asks for them.
Keep changes scoped to the active task.

# AI Development Flow

Task-scoped artifacts belong under `.ai/tasks/`. Do not create `tasks/` as a
top-level task artifact directory.

When working on a task:

- Keep artifacts task-scoped.
- Avoid one global `session.md` as the coordination mechanism.
- Record assumptions, files touched, verification run, and handoff notes in the
  task artifact.
- For multi-agent or worktree work, keep ownership boundaries explicit and avoid
  overlapping edits unless coordination is part of the task.

# Change Discipline

Before editing, inspect the relevant existing files and follow local patterns.

Do not add dependencies, scripts, folders, docs, generated artifacts, or source
files unless they are explicitly in scope for the current task.

Do not edit README.md unless the user explicitly asks for it.

Ask before changing architecture, dependencies, public APIs, auth/security
behavior, folder structure, shared types/constants, broad refactors,
destructive actions, or files outside the requested scope.

When validation is applicable, run `pnpm lint` before completion. Run
`pnpm build` when a change may affect build or runtime behavior and the script
exists. Report any skipped validation with the reason.

Final responses should include:

- Files changed
- Summary
- Commands run
- Validation result
- Assumptions
- Risks
- Suggested Conventional Commit message

Use Conventional Commit format:

`<type>(<scope>): <short description>`

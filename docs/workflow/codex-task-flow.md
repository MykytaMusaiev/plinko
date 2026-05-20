Status: Partial
Owner: Frontend
Source of truth: AGENTS.md
Last verified: 2026-05-20
Related files: AGENTS.md

# Codex Task Flow

Use this flow for Codex-driven work in this repository.

1. Read the user request and identify the allowed scope.
2. Inspect relevant files before editing.
3. Check current package scripts before claiming a command exists.
4. For library/framework/API questions, use `ctx7` documentation lookup.
5. For Next.js code changes, read the relevant local docs under
   `node_modules/next/dist/docs/`.
6. Make the smallest scoped change that satisfies the task.
7. Validate with available package scripts when applicable.
8. Return the required output contract.

Approval required before:

- Changing architecture or folder structure.
- Adding dependencies, scripts, skills, or generated artifacts.
- Changing public APIs, auth/security behavior, shared types, or constants.
- Starting broad refactors.
- Running destructive actions.
- Editing files outside the requested scope.

Partial:

- Task-scoped artifacts under `.ai/tasks/` are planned for a later phase and do
  not exist yet.

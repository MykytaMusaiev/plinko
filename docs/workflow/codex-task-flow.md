Status: Partial
Owner: Frontend
Source of truth: AGENTS.md
Last verified: 2026-05-20
Related files: AGENTS.md, .ai/tasks/TEMPLATE.md

# Codex Task Flow

Use this flow for Codex-driven work in this repository.

1. Read the user request and identify the allowed scope.
2. Create or update one task artifact for the task, branch, or worktree under
   `.ai/tasks/active/` when the task requires durable handoff context.
3. Inspect relevant files before editing.
4. Check current package scripts before claiming a command exists.
5. For library/framework/API questions, use `ctx7` documentation lookup.
6. For Next.js code changes, read the relevant local docs under
   `node_modules/next/dist/docs/`.
7. Make the smallest scoped change that satisfies the task.
8. Record commands, validation, docs freshness, risks, and handoff notes in the
   task artifact when one is active.
9. Validate with available package scripts when applicable.
10. Return the required output contract.

Task artifacts:

- Use one artifact per task, branch, or worktree.
- Use `.ai/tasks/TEMPLATE.md` as the starting structure.
- Keep active work under `.ai/tasks/active/`.
- Move completed task artifacts to `.ai/tasks/archived/`.
- Do not use one global mutable `session.md` as the source of truth.
- Put durable architecture decisions in `docs/decisions/`.
- Put durable module knowledge in `docs/modules/`.

Approval required before:

- Changing architecture or folder structure.
- Adding dependencies, scripts, skills, or generated artifacts.
- Changing public APIs, auth/security behavior, shared types, or constants.
- Starting broad refactors.
- Running destructive actions.
- Editing files outside the requested scope.

Partial:

- Task scaffolding scripts are not created yet.

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
7. Before implementation, identify the owning feature and expected file
   placement for component code, helpers, constants, config, types, adapters,
   view models, API wrappers, and model logic.
8. Make the smallest scoped change that satisfies the task, keeping clean
   feature-oriented structure as the code is generated.
9. Update related docs or record a docs-not-needed rationale.
10. Run the semantic code-quality review gate when the change touches code, UI,
    refactors, or architecture-sensitive areas.
11. Validate with available package scripts when applicable.
12. Run pre-commit readiness before any manual commit.
13. Commit only when the user asks for it.
14. Archive the task artifact when the task is complete and archival is
    applicable.
15. Return the required output contract.

Task artifacts:

- Use one artifact per task, branch, or worktree.
- Use `.ai/tasks/TEMPLATE.md` as the starting structure.
- Keep active work under `.ai/tasks/active/`.
- Move completed task artifacts to `.ai/tasks/archived/`.
- Do not use one global mutable `session.md` as the source of truth.
- Record approval, ownership decisions when non-obvious, docs rationale,
  review-gate evidence, validation, pre-commit readiness, risks, and handoff
  notes when an artifact is active.
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

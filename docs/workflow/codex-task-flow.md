Status: Partial
Owner: Frontend
Source of truth: AGENTS.md
Last verified: 2026-05-22
Related files: AGENTS.md, .ai/tasks/TEMPLATE.md

# Codex Task Flow

Use this flow for Codex-driven work in this repository.

1. Read the user request and identify the allowed scope.
2. Prefer local repository skills under `skills/<name>/SKILL.md` for repository
   execution tasks. If a prompt names a local skill path, treat that skill as
   the workflow source of truth; stop if it is missing, unclear, or not
   applicable.
3. Use `skills/audit/SKILL.md` for pre-implementation discovery when ownership,
   related files, docs impact, or risks are not already clear.
4. Create or update one task artifact for implementation work under
   `.ai/tasks/active/` before product, docs, or workflow edits.
5. Record approved editable files separately from context-only files.
6. Inspect relevant files before editing.
7. Check current package scripts before claiming a command exists.
8. For library/framework/API questions, use `ctx7` documentation lookup.
9. For Next.js code changes, read the relevant local docs under
   `node_modules/next/dist/docs/`.
10. Before implementation, identify the owning feature and expected file
   placement for component code, helpers, constants, config, types, adapters,
   view models, API wrappers, and model logic.
11. Make the smallest scoped change that satisfies the task, keeping clean
   feature-oriented structure as the code is generated.
12. Stop before changing files or behavior outside the approved scope.
13. Update related docs or record a docs-not-needed rationale.
14. Use `skills/review/SKILL.md` for the semantic code-quality review gate when
    the change touches code, UI, refactors, or architecture-sensitive areas.
15. Validate with available package scripts when applicable.
16. Use `skills/pre-commit/SKILL.md` before any manual commit.
17. Commit only when the user asks for it.
18. Archive the task artifact when the task is complete and archival is
    applicable.
19. Return the required output contract.

Task artifacts:

- Use one artifact per task, branch, or worktree.
- Use `.ai/tasks/TEMPLATE.md` as the starting structure.
- Keep active work under `.ai/tasks/active/`.
- Move completed task artifacts to `.ai/tasks/archived/`.
- Do not use one global mutable `session.md` as the source of truth.
- Record approval, audit or plan source, approved editable files, context-only
  files, ownership decisions when non-obvious, docs rationale, review-gate
  evidence, validation, pre-commit readiness, risks, and handoff notes.
- Keep implementation artifacts active until validation and pre-commit readiness
  are recorded, unless the user explicitly asks otherwise.
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

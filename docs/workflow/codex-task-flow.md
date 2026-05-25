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
4. Before implementation edits, choose branch mode:
   - PR-mode is the default for non-trivial implementation tasks.
   - Current Plinko task work uses `feat/plinko` as the default
     base/integration branch unless the user specifies another base.
   - PR-mode work starts from the base branch and moves to a dedicated task
     branch before source, docs, or workflow edits.
   - Local/no-PR mode must be explicit and must record a rationale.
5. Create or update one task artifact for implementation work under
   `.ai/tasks/active/` before product, docs, or workflow edits.
6. Record approved editable files separately from context-only files.
7. Inspect relevant files before editing.
8. Check current package scripts before claiming a command exists.
9. For library/framework/API questions, use `ctx7` documentation lookup.
10. For Next.js code changes, read the relevant local docs under
   `node_modules/next/dist/docs/`.
11. Before implementation, identify the owning feature and expected file
   placement for component code, helpers, constants, config, types, adapters,
   view models, API wrappers, and model logic.
12. Make the smallest scoped change that satisfies the task, keeping clean
   feature-oriented structure as the code is generated.
13. Stop before changing files or behavior outside the approved scope.
14. Update related docs or record a docs-not-needed rationale.
15. Use `skills/review/SKILL.md` for the semantic code-quality review gate when
    the change touches code, UI, refactors, or architecture-sensitive areas.
16. Validate with available package scripts when applicable.
17. Use `skills/pre-commit/SKILL.md` before any manual commit.
18. Commit only when the user asks for it.
19. Keep post-commit PR lifecycle manual; do not automate PR creation, merge,
    branch deletion, staging, or committing unless the user asks for that
    separate action.
20. Archive the task artifact when the task is complete and archival is
    applicable.
21. For artifact archive/move commits, stage both sides of the move. Prefer
    `git add -A .ai/tasks`; do not stage only the archived artifact file.
22. After an archive commit, verify the commit contains both the active
    artifact deletion and archived artifact addition with
    `git show --name-status --oneline --stat HEAD`.
23. Return the required output contract.

Task artifacts:

- Use one artifact per task, branch, or worktree.
- Use `.ai/tasks/TEMPLATE.md` as the starting structure.
- Keep active work under `.ai/tasks/active/`.
- Move completed task artifacts to `.ai/tasks/archived/`.
- Lifecycle closure is not complete if a task artifact move is only partially
  staged or committed. The expected archive commit shows the active artifact
  removed and the archived artifact added.
- Do not use one global mutable `session.md` as the source of truth.
- Record approval, audit or plan source, branch mode, base branch, task branch,
  current branch at task start, branch-start status and evidence, local/no-PR
  rationale when applicable, approved editable files, context-only files,
  ownership decisions when non-obvious, docs rationale, review-gate evidence,
  validation, pre-commit readiness, risks, and handoff notes.
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
- Branch-start enforcement is skill-driven; no hooks, CI, or PR automation are
  implemented.

Status: Partial
Owner: Frontend
Source of truth: AGENTS.md, .ai/tasks/TEMPLATE.md
Last verified: 2026-05-20
Related files: AGENTS.md, .ai/tasks

# Worktree Task Flow

Implemented:

- Task-scoped artifacts live under `.ai/tasks/`.
- Active task artifacts belong under `.ai/tasks/active/`.
- Completed task artifacts belong under `.ai/tasks/archived/`.
- `.ai/tasks/TEMPLATE.md` defines the expected task artifact fields.
- Top-level `tasks/` should not be introduced for task artifacts.

Expected principles:

- One task, branch, or worktree should have one task-scoped artifact.
- Do not use one global mutable `session.md` as the source of truth.
- Record assumptions, files touched, verification run, and handoff notes in the
  task artifact.
- Put durable architecture decisions in `docs/decisions/`.
- Put durable module knowledge in `docs/modules/`.
- Archive task artifacts after completion.
- Worktree and multi-agent workflows should keep ownership boundaries explicit.
- Avoid overlapping edits between agents unless coordination is part of the
  task.

Not implemented yet:

- Task scaffolding scripts.

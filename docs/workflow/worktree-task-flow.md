Status: Planned
Owner: Frontend
Source of truth: AGENTS.md
Last verified: 2026-05-20
Related files: AGENTS.md

# Worktree Task Flow

Planned:

- Future task-scoped artifacts will live under `.ai/tasks/` according to the
  approved staged execution plan.
- Top-level `tasks/` should not be introduced for task artifacts.
- Worktree and multi-agent workflows should keep ownership boundaries explicit.

Expected principles:

- One task should have one task-scoped artifact location.
- Avoid one global `session.md` as the coordination mechanism.
- Record assumptions, files touched, verification run, and handoff notes in the
  approved task artifact location.
- Avoid overlapping edits between agents unless coordination is part of the
  task.

Not implemented yet:

- `.ai/tasks/` directory.
- Task scaffolding scripts.
- Repo-local skills.

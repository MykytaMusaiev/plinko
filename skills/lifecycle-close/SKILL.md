---
name: lifecycle-close
description: Manually close a completed Plinko task lifecycle after implementation, review, validation, commit, PR lifecycle, merge, and user acceptance are complete.
---

# Lifecycle Close

## Goal

Close a completed task with manual evidence that the PR lifecycle is finished,
the local branch state is understood, and the task artifact is archived
correctly.

## When to use

- The user asks to close a task after PR merge or final acceptance.
- Implementation, review, pre-commit readiness, commit, PR lifecycle, merge,
  and user acceptance are complete.
- The active task artifact is ready to move from `.ai/tasks/active/` to
  `.ai/tasks/archived/`.

## When not to use

- Implementation, review, validation, pre-commit readiness, commit, PR
  lifecycle, merge, or user acceptance is incomplete.
- The user has not asked for lifecycle closure.
- The request is to implement or review code.

## Required context

- Active task artifact.
- PR URL or merge evidence when PR-mode was used.
- Current branch, base branch, and local task branch.
- `git status --short --branch`.
- Recent commit evidence for the implementation and archive move when
  applicable.

## Restrictions

- Do not automate push, PR creation, merge, branch deletion, or archival.
- Do not delete local or remote branches unless the user explicitly asks for
  that separate action.
- Do not archive the task artifact before implementation, review, pre-commit,
  commit, PR lifecycle, merge, and user acceptance are complete.
- Do not stage or commit unless the user explicitly asks for that lifecycle
  action.
- Do not partially stage artifact moves.

## Workflow

1. Confirm the user asked for lifecycle closure.
2. Verify the PR was merged when PR-mode was used, or record why no PR was
   applicable.
3. Verify remote/base branch state as applicable.
4. Verify the local base branch was pulled after merge when applicable.
5. Verify local task branch cleanup status if applicable, without deleting it
   unless separately requested.
6. Confirm implementation, review, pre-commit readiness, commit, PR lifecycle,
   merge, and user acceptance are complete in the task artifact.
7. Move the active task artifact to `.ai/tasks/archived/` only after closure is
   approved and applicable.
8. Stage artifact archive moves with `git add -A .ai/tasks` when the user asks
   to stage or commit the closure.
9. After an archive commit, verify the commit includes both the active artifact
   deletion and archived artifact addition with
   `git show --name-status --oneline --stat HEAD`.
10. Report remaining local branch or remote cleanup steps without performing
    them unless requested.

## Output format

- Closed / Blocked
- PR merge status
- Base branch status
- Local task branch status
- Task artifact status
- Archive move status
- Commands run
- Verification result
- Remaining manual steps
- Risks

## Common mistakes

- Archiving a task artifact before acceptance or merge evidence exists.
- Treating lifecycle close as permission to push, merge, or delete branches.
- Staging only `.ai/tasks/archived/...` and missing the active artifact
  deletion.
- Skipping the post-archive commit verification.
- Closing lifecycle while unrelated changes are mixed into the worktree.

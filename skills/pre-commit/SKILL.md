---
name: pre-commit
description: Run a pre-commit readiness check for the Plinko repository. Use before committing or when asked to verify readiness by inspecting git status/diff, running lint and available validation scripts, checking API boundary/docs freshness scripts if present, and reporting Ready or Blocked without committing.
---

# Pre-Commit

## Goal

Assess whether current changes are ready to commit without committing
automatically.

## When to use

- The user asks for pre-commit checks.
- The user asks whether a phase can be committed.
- Implementation is complete and validation is needed.

## When not to use

- The user asks for code review only.
- The user asks to commit directly without validation.

## Required context

- `git status --short`.
- Relevant `git diff`.
- Active task artifact under `.ai/tasks/active/`.
- Branch mode fields and current branch.
- Approved editable files and non-goals from the active task artifact.
- `package.json` scripts.
- Presence or absence of validation scripts.
- Review/code-quality gate evidence when code, UI, refactor, or
  architecture-sensitive changes require semantic review.

## Restrictions

- Never commit automatically.
- Do not modify files unless the user explicitly asks for fixes.
- Do not create branches, open PRs, merge PRs, delete branches, archive
  artifacts, stage files, or commit.
- Do not invent validation scripts.
- Do not replace semantic review; confirm review-gate evidence only.
- Do not treat an archived, missing, or stale task artifact as ready.
- Do not approve unexpected changed files without explicit scope approval.
- Report skipped checks with reasons.

## Workflow

1. Inspect `git status --short`.
2. Inspect relevant diffs.
3. Locate the active task artifact for the implementation.
4. Confirm the artifact is current, not archived, and names the approved
   editable files, non-goals, branch mode, docs rationale, validation, risks,
   and handoff.
5. Verify the branch invariant mechanically:
   - Branch mode is present.
   - For PR-mode, the current branch matches the recorded task branch and does
     not match the recorded base branch.
   - For local/no-PR mode, an explicit local/no-PR rationale is present.
6. Compare changed files against the approved editable scope.
7. Confirm review/code-quality gate evidence is present or explicitly not
   applicable.
8. Run `pnpm lint` when applicable.
9. Run validation scripts if present.
10. Run `check-api-boundary.sh` if present.
11. Run `check-docs-freshness.sh` if present.
12. Report Ready only when required checks pass or are explicitly not
   applicable.
13. Report Blocked when validation fails, scope is unclear, the task artifact is
   missing or stale, branch mode is missing, PR-mode branch fields do not match
   the current branch, local/no-PR rationale is missing, changed files exceed
   approved scope, review-gate evidence is missing, or required checks cannot
   run.

## Output format

- Ready / Blocked
- Files changed
- Task artifact status
- Branch invariant status
- Commands run
- Validation result
- Skipped checks and reasons
- Risks
- Suggested Conventional Commit message

## Common mistakes

- Committing automatically.
- Running scripts that do not exist.
- Ignoring unstaged or unrelated changes.
- Creating or switching branches during pre-commit instead of reporting the
  branch invariant status.
- Performing semantic code review instead of checking for review evidence.
- Skipping changed-files-vs-approved-scope comparison.
- Accepting missing, stale, or archived task artifacts.
- Treating skipped validation as passing.
- Forgetting API-boundary and docs-freshness checks when scripts exist.

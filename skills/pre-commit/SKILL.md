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
- `package.json` scripts.
- Presence or absence of validation scripts.
- Review/code-quality gate evidence when code, UI, refactor, or
  architecture-sensitive changes require semantic review.

## Restrictions

- Never commit automatically.
- Do not modify files unless the user explicitly asks for fixes.
- Do not invent validation scripts.
- Do not replace semantic review; confirm review-gate evidence only.
- Report skipped checks with reasons.

## Workflow

1. Inspect `git status --short`.
2. Inspect relevant diffs.
3. Confirm review/code-quality gate evidence is present or explicitly not
   applicable.
4. Run `pnpm lint` when applicable.
5. Run validation scripts if present.
6. Run `check-api-boundary.sh` if present.
7. Run `check-docs-freshness.sh` if present.
8. Report Ready only when required checks pass or are explicitly not
   applicable.
9. Report Blocked when validation fails, scope is unclear, review-gate evidence
   is missing, or required checks cannot run.

## Output format

- Ready / Blocked
- Files changed
- Commands run
- Validation result
- Skipped checks and reasons
- Risks
- Suggested Conventional Commit message

## Common mistakes

- Committing automatically.
- Running scripts that do not exist.
- Ignoring unstaged or unrelated changes.
- Performing semantic code review instead of checking for review evidence.
- Treating skipped validation as passing.
- Forgetting API-boundary and docs-freshness checks when scripts exist.

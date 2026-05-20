---
name: review
description: Review Plinko repository changes without editing files. Use when Codex is asked to assess correctness, architecture, BFF boundary compliance, typing, state ownership, docs freshness, validation, or regression risk.
---

# Review

## Goal

Find correctness and process risks without modifying files.

## When to use

- The user asks to review, audit, check, or gate a phase.
- The task is read-only.
- A change needs architecture, BFF, docs, or validation assessment.

## When not to use

- The user asks to implement changes.
- The task requires staging, committing, or generating artifacts.

## Required context

- User review checklist.
- `git status --short` and relevant diffs.
- Changed files and related source/docs.
- `AGENTS.md`, `docs/doc-mapping.json`, and relevant ADRs when applicable.

## Restrictions

- Do not edit files.
- Do not stage or commit.
- Do not broaden the review beyond the requested gate unless a blocker is found.

## Workflow

1. Confirm the requested review scope.
2. Check changed files against allowed paths.
3. Inspect diffs and relevant current source.
4. Review correctness, architecture, BFF boundary, auth/security, typing, state
   ownership, docs freshness, and regression risk.
5. Verify validation evidence or note missing validation.
6. Return Pass or Needs changes with concrete findings.

## Output format

- Pass / Needs changes
- Scope violations
- Findings ordered by severity
- Missing or unclear validation
- Residual risks
- Gate or commit readiness

## Common mistakes

- Making edits during review.
- Reporting style preferences as blockers.
- Missing browser-side backend calls or token handling.
- Treating docs file presence as semantic correctness.
- Ignoring unverified backend response shapes.

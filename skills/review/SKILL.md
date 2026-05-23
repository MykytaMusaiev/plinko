---
name: review
description: Review completed Plinko repository changes without editing files. Use when Codex is asked to assess completed code, diffs, selected files, correctness, architecture, BFF boundary compliance, typing, state ownership, docs freshness, validation, or regression risk.
---

# Review

## Goal

Find correctness and process risks without modifying files.

## When to use

- The user asks to review completed changes, diffs, selected files, or an
  existing implementation.
- The task is read-only.
- A change needs architecture, BFF, docs, or validation assessment.

## When not to use

- The user asks to implement changes.
- The user asks for pre-implementation discovery or scope planning; use
  `skills/audit/SKILL.md`.
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
5. Run the semantic code-quality checklist when the change touches code, UI,
   refactors, or architecture-sensitive areas.
6. Verify validation evidence or note missing validation.
7. Return Pass or Needs changes with concrete findings.

## Semantic code-quality checklist

Review should confirm that implementation generated clean structure from the
start, but it may block completion when structure debt remains.

- UI/component quality: components have clear responsibility and stay focused on
  rendering, composition, hook usage, and event wiring.
- Feature ownership: feature-specific helpers, utils, lib, constants, config,
  types, adapters, view models, model logic, and API wrappers stay in the owning
  feature.
- Shared misuse: `src/shared` additions or moves are generic cross-feature or
  platform-level reuse, not convenience for feature-specific code.
- Repeated UI and JSX readability: repeated fragments are extracted when they
  obscure intent, and JSX remains readable.
- Inline logic: non-trivial helpers, constants, types, formatters, filters,
  mappers, option lists, DTO adapters, and view-model builders are not left in
  component files without a local reason.
- State and data shaping: derived state is not duplicated unnecessarily, and
  view-model or adapter placement matches feature boundaries.
- Refactor readiness: scoped refactors identify ownership, coupling, docs
  impact, validation, and review evidence before completion.

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
- Treating review as the first place where obvious structure problems should be
  discovered.
- Treating review as pre-implementation audit.
- Ignoring unverified backend response shapes.

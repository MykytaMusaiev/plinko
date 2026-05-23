---
name: implementation
description: Implement approved repository changes for the Plinko Next.js frontend. Use when Codex is asked to make scoped code, docs, or config changes while preserving repo architecture, BFF auth boundaries, docs freshness, and validation reporting.
---

# Implementation

## Goal

Implement only the approved task scope with minimal, source-backed changes.

## When to use

- A user asks to implement, fix, add, or update repository files.
- A task has an approved scope or explicit file boundaries.
- Behavior changes may require related documentation updates.

## When not to use

- The user asks for review only.
- The user asks for planning or analysis without edits.
- The request requires changing architecture, dependencies, auth/security, or
  public APIs without approval.

## Required context

- User scope and restrictions.
- Approved audit or plan scope when one exists.
- Active task artifact path for implementation tasks.
- Approved editable files and context-only files.
- `AGENTS.md`.
- Relevant source files.
- `docs/doc-mapping.json` when behavior or mapped source areas change.
- Existing `package.json` scripts.

## Restrictions

- Do not edit unrelated files.
- Do not edit context-only files unless the user approves expanding scope.
- Do not add dependencies or scripts unless explicitly approved.
- Do not expand beyond the approved audit or plan scope without stopping.
- Do not bypass the BFF boundary.
- Do not store auth tokens in browser state.
- Do not document planned behavior as implemented.
- Do not archive the active task artifact before validation and handoff.

## Workflow

1. Confirm the approved scope, non-goals, editable files, and context-only
   files.
2. Create or update one active task artifact under `.ai/tasks/active/` before
   product, docs, or workflow edits.
3. Record approval, editable files, context-only files, assumptions, docs plan,
   validation plan, and stop conditions in the artifact.
4. Inspect relevant source and docs before editing.
5. Before editing feature or UI code, identify the owning feature, expected file
   ownership, what belongs in component files, what belongs in feature-local
   helpers/utils/lib/constants/config/types/model/api, and what must not move to
   `src/shared`.
6. Stop and ask before changing files or behavior outside the approved scope.
7. Use existing patterns and feature boundaries.
8. Implement the smallest change that satisfies the task.
9. Update related docs if behavior changes, using `docs/doc-mapping.json`.
10. Keep the active task artifact current with files touched, docs rationale,
    validation, review-gate status, risks, and handoff notes.
11. Run the before-completion self-check and hand off to the review gate when
    code, UI, refactor, or architecture-sensitive changes require semantic
    review.
12. Run applicable validation: `pnpm lint`; `pnpm build` when build/runtime may
   be affected and the script exists.
13. Report skipped validation with reasons.

## Generation-time structure rules

- Keep React component files focused on rendering, composition, hook usage, and
  event wiring.
- Extract non-trivial helpers, formatters, filters, mappers, constants, option
  lists, DTO adapters, and view-model builders during implementation rather than
  waiting for review to discover obvious structure debt.
- Prefer existing owning-feature folders. Add feature-local folders only when
  justified by the task and local conventions.
- Avoid new folders for trivial one-off code.
- Move code to `src/shared` only for generic cross-feature or platform-level
  reuse, never for feature-specific convenience.

## Before-completion self-check

- Confirm the change stayed within approved scope and file boundaries.
- Confirm no context-only file was edited without approval.
- Confirm the active task artifact exists, is current, and remains active unless
  the user explicitly asked to archive it.
- Confirm feature-local ownership and component responsibility are clean.
- Confirm repeated UI fragments, duplicated derived state, and non-trivial
  inline helpers/constants/types were handled during implementation.
- Confirm mapped docs were updated or a docs-not-needed rationale was recorded.
- Record review-gate handoff or not-applicable rationale in the task artifact.

## Output format

- Files changed
- Summary
- Task artifact path
- Commands run
- Validation result
- Assumptions
- Risks
- Suggested Conventional Commit message

## Common mistakes

- Editing outside the requested scope.
- Editing context-only files because they were inspected.
- Starting implementation without an active task artifact.
- Treating future docs, scripts, skills, or `.ai/tasks/` as existing.
- Calling backend `/api/v1/*` from browser code.
- Waiting for review to catch obvious feature ownership or component structure
  issues.
- Adding duplicated derived state instead of using backend result fields.
- Skipping docs updates or docs-not-needed rationale for mapped changes.

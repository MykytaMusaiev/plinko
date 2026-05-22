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
- `AGENTS.md`.
- Relevant source files.
- `docs/doc-mapping.json` when behavior or mapped source areas change.
- Existing `package.json` scripts.

## Restrictions

- Do not edit unrelated files.
- Do not add dependencies or scripts unless explicitly approved.
- Do not bypass the BFF boundary.
- Do not store auth tokens in browser state.
- Do not document planned behavior as implemented.

## Workflow

1. Confirm the allowed scope and files.
2. Inspect relevant source and docs before editing.
3. Before editing feature or UI code, identify the owning feature, expected file
   ownership, what belongs in component files, what belongs in feature-local
   helpers/utils/lib/constants/config/types/model/api, and what must not move to
   `src/shared`.
4. Use existing patterns and feature boundaries.
5. Implement the smallest change that satisfies the task.
6. Update related docs if behavior changes, using `docs/doc-mapping.json`.
7. Run the before-completion self-check and hand off to the review gate when
   code, UI, refactor, or architecture-sensitive changes require semantic
   review.
8. Run applicable validation: `pnpm lint`; `pnpm build` when build/runtime may
   be affected and the script exists.
9. Report skipped validation with reasons.

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
- Confirm feature-local ownership and component responsibility are clean.
- Confirm repeated UI fragments, duplicated derived state, and non-trivial
  inline helpers/constants/types were handled during implementation.
- Confirm mapped docs were updated or a docs-not-needed rationale was recorded.
- Record review-gate handoff or not-applicable rationale in the task artifact
  when one is active.

## Output format

- Files changed
- Summary
- Commands run
- Validation result
- Assumptions
- Risks
- Suggested Conventional Commit message

## Common mistakes

- Editing outside the requested scope.
- Treating future docs, scripts, skills, or `.ai/tasks/` as existing.
- Calling backend `/api/v1/*` from browser code.
- Waiting for review to catch obvious feature ownership or component structure
  issues.
- Adding duplicated derived state instead of using backend result fields.
- Skipping docs updates or docs-not-needed rationale for mapped changes.

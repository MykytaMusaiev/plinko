---
name: documentation
description: Create or update Plinko repository documentation. Use when Codex is asked to document implemented architecture, module behavior, workflow rules, decisions, or docs freshness while distinguishing implemented, planned, partial, and unverified behavior.
---

# Documentation

## Goal

Keep repository documentation accurate, concise, and tied to current code.

## When to use

- The user asks to create or update docs.
- A behavior change affects mapped documentation.
- ADRs, workflow docs, module docs, or API-boundary docs are requested.

## When not to use

- The user asks for code-only changes and docs are explicitly out of scope.
- The request is a read-only review.

## Required context

- User scope and allowed docs paths.
- Current source files that prove implemented behavior.
- Existing docs and `docs/doc-mapping.json`.
- Relevant ADRs for accepted decisions.

## Restrictions

- Document implemented behavior as Implemented only when verified from code.
- Mark incomplete behavior as Planned or Partial.
- Mark unknown backend response shapes as Unverified.
- Do not invent behavior or write future work as accepted decisions.
- Update doc mapping when the relationship between source areas and docs
  changes.

## Workflow

1. Identify allowed documentation files.
2. Read current source before describing behavior.
3. Separate Implemented, Partial, Planned, and Unverified statements.
4. Keep docs concise and operational.
5. Update `docs/doc-mapping.json` only when mappings change and it is in scope.
6. Validate JSON docs when JSON is edited.
7. Report docs changed and unverified areas.

## Output format

- Docs changed
- Summary
- Assumptions
- Unverified areas
- Validation result
- Suggested Conventional Commit message

## Common mistakes

- Documenting planned behavior as implemented.
- Forgetting to mark backend shapes as Unverified.
- Expanding docs into broad tutorials.
- Claiming scripts, skills, or task artifacts exist before they are present.
- Updating docs unrelated to the approved scope.

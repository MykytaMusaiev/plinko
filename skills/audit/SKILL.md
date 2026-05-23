---
name: audit
description: Audit Plinko repository scope before implementation. Use when Codex is asked to discover related files, ownership, API/BFF boundaries, docs impact, risks, and a minimal editable scope before making changes.
---

# Audit

## Goal

Prepare a minimal, source-backed implementation scope without editing files.

## When to use

- A task needs pre-implementation discovery or scope shaping.
- The user asks to audit, inspect, plan ownership, or identify affected files
  before implementation.
- A small product change needs related BFF/API, state, docs, or validation
  context without repeating prompt boilerplate.

## When not to use

- The user asks to review completed changes or diffs; use
  `skills/review/SKILL.md`.
- The user asks to implement an already approved scope; use
  `skills/implementation/SKILL.md`.
- The task requires edits, staging, committing, or generated artifacts.

## Required context

- User goal, non-goals, and restrictions.
- `AGENTS.md`.
- Relevant source, docs, local skills, and validation scripts.
- `docs/doc-mapping.json` when source or workflow ownership may affect docs.

## Restrictions

- Do not edit files.
- Do not stage or commit.
- Do not create task artifacts.
- Do not broaden beyond discovery needed to recommend the next step.

## Workflow

1. Confirm the user goal, non-goals, and approval constraints.
2. Find related source, docs, BFF/API routes, hooks, stores, services, helpers,
   types, constants, and validation scripts.
3. Identify the owning feature or workflow layer.
4. Separate proposed editable files from context-only files.
5. Check `docs/doc-mapping.json` for required docs impact.
6. Identify risks, approval needs, and stop conditions.
7. Recommend the next skill or mode, usually implementation, review, or stop
   for user approval.

## Output format

- Pass / Needs changes
- Files inspected
- Current structure summary
- Proposed editable scope
- Context-only files
- Risks and stop conditions
- Recommended next skill or mode

## Common mistakes

- Turning audit into implementation.
- Treating context-only files as approved edit targets.
- Hiding scope expansion inside a broad plan.
- Repeating review responsibilities instead of preparing implementation scope.

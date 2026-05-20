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
3. Use existing patterns and feature boundaries.
4. Implement the smallest change that satisfies the task.
5. Update related docs if behavior changes, using `docs/doc-mapping.json`.
6. Run applicable validation: `pnpm lint`; `pnpm build` when build/runtime may
   be affected and the script exists.
7. Report skipped validation with reasons.

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
- Adding duplicated derived state instead of using backend result fields.
- Skipping docs updates or docs-not-needed rationale for mapped changes.

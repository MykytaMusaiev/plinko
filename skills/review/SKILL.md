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
- Active task artifact when the change includes UI, stack primitive choices, or
  suppression/bypass approvals.

## Restrictions

- Do not edit files.
- Do not stage or commit.
- Do not broaden the review beyond the requested gate unless a blocker is found.

## Workflow

1. Confirm the requested review scope.
2. Check changed files against allowed paths.
3. Inspect diffs and relevant current source.
4. Review correctness, architecture, BFF boundary, auth/security, typing, state
   ownership, docs freshness, render/performance risk for UI or state-heavy
   changes, and regression risk.
5. Run the semantic code-quality checklist when the change touches code, UI,
   refactors, or architecture-sensitive areas.
6. Verify validation evidence or note missing validation.
7. Return Pass or Needs changes with concrete findings.

## Semantic code-quality checklist

Review should confirm that implementation generated clean structure from the
start, but it may block completion when structure debt remains.

- UI/component quality: components have clear responsibility and stay focused on
  rendering, composition, hook usage, and event wiring.
- Route/page thinness: route `page.tsx` files stay thin, and page content
  components orchestrate feature sections instead of becoming component dumps.
- Component decomposition: one primary non-trivial React component per file is
  preferred, and non-trivial UI concepts are split into feature-local files.
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
- Stack primitives: generic React output is blocked when this repository stack
  has a project or framework primitive. Next.js UI uses `next/image` instead of
  raw `<img>` unless approved, internal navigation uses Next.js/project routing
  primitives, App Router code defaults to Server Components, browser API calls
  use local BFF clients/helpers, server state follows TanStack Query patterns,
  and non-trivial forms follow existing React Hook Form/Zod patterns when
  applicable.
- Suppressions and bypasses: `eslint-disable`, `@ts-ignore`,
  `@ts-expect-error`, `@ts-nocheck`, framework-rule suppressions, raw `<img>`
  in Next.js UI, and similar bypasses block review unless explicitly approved
  and explained in the active task artifact.
- UI render/performance risk: visual components avoid unnecessarily broad
  Zustand or TanStack Query subscriptions, suspicious `useEffect` plus
  `setState` synchronization, expensive calculations directly in render, and
  premature `memo`, `useMemo`, or `useCallback` without evidence.
- UI QA handoff: UI/state-heavy changes record UI QA evidence when the active
  task artifact marks UI QA as required, without requiring exact render counts
  or automated profiling.
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
- Allowing generic React primitives when the stack provides a better
  project/framework primitive.
- Accepting unapproved suppressions or framework bypasses as local cleanup.
- Treating review as pre-implementation audit.
- Ignoring unverified backend response shapes.
- Treating qualitative render/performance review as a hard rerender-count gate.

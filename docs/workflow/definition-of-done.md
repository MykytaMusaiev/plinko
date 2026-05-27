Status: Partial
Owner: Frontend
Source of truth: AGENTS.md, package.json
Last verified: 2026-05-22
Related files: AGENTS.md, package.json

# Definition Of Done

A task is done when the requested scope is implemented and the final response
clearly reports what changed.

Required lifecycle:

- Request and scope are understood.
- Audit or plan is completed when needed.
- User approval is recorded before implementation when the task requires it.
- Branch mode is recorded before implementation edits. Non-trivial
  implementation defaults to PR-mode from the configured base branch
  `feat/plinko`; local/no-PR mode is explicit and includes a rationale.
- Implementation has an active task artifact with approved editable files,
  context-only files, non-goals, assumptions, docs rationale, validation,
  review-gate status, risks, and handoff notes when applicable.
- Ownership and file placement are considered before feature or UI code is
  written.
- A Stack Primitive Checklist is recorded before JSX-heavy UI work.
- Implementation stays clean as it is generated, not only after review.
- Changed files stay within the approved editable scope.
- Related docs are updated or a docs-not-needed rationale is recorded.
- UI QA evidence is recorded when the task changes visible UI, layout,
  navigation, responsive behavior, animation, or high-frequency interaction.
- Semantic review gate passes when required.
- Mechanical validation passes or skipped checks are explained.
- Pre-commit readiness mechanically confirms the branch invariant before any
  manual commit.
- Task artifacts are archived when applicable.
- Post-merge or final lifecycle closure uses `skills/lifecycle-close/SKILL.md`
  when the user asks for it, and remains manual unless separately requested.
- Artifact archive/move commits stage both sides of the move, preferably with
  `git add -A .ai/tasks`; staging only the archived artifact file is not
  sufficient.
- After an artifact archive commit, `git show --name-status --oneline --stat
  HEAD` confirms the active artifact was removed and the archived artifact was
  added.

Required for code changes:

- Stay within the requested scope.
- Stop before expanding beyond the approved audit or plan scope.
- Preserve the BFF boundary and auth token rules.
- Follow existing feature-oriented structure.
- Keep route `page.tsx` files thin; page content components orchestrate feature
  sections rather than becoming component dump files.
- Keep React component files focused on rendering, composition, hook usage, and
  event wiring.
- Prefer one primary non-trivial React component per file and split
  non-trivial UI concepts into feature-local files.
- Keep non-trivial helpers, formatters, filters, mappers, constants, option
  lists, DTO adapters, and view-model builders outside component files in the
  owning feature when justified by the task.
- Use `src/shared` only for generic cross-feature or platform-level reuse, not
  feature-specific convenience.
- Use stack/project/framework primitives instead of generic React output when
  applicable: `next/image` instead of raw `<img>`, Next.js/project routing
  primitives for internal navigation, Server Components by default in App
  Router code, local BFF clients/helpers for browser API calls, TanStack Query
  for server state, and existing React Hook Form/Zod patterns for non-trivial
  forms.
- Suppressions and framework bypasses require explicit approval and
  task-artifact rationale before use, including `eslint-disable`,
  `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, raw `<img>` in Next.js UI,
  framework-rule suppressions, and similar markers.
- Run the semantic review gate for UI, code, refactor, or
  architecture-sensitive changes. Review confirms implementation quality; it
  should not be the first safeguard against obvious structure problems.
- For UI or state-heavy changes, review includes qualitative render/performance
  risk such as broad Zustand/query subscriptions, duplicated derived state,
  suspicious `useEffect` plus `setState` synchronization, expensive render
  calculations, and premature memoization without evidence.
- Run `pnpm lint` when applicable.
- Run `pnpm build` when the change may affect build or runtime behavior.
- Run `scripts/check-api-boundary.sh` when API/auth boundary behavior may be
  affected.
- Run `scripts/check-docs-freshness.sh` when mapped source areas change.
- Pre-commit readiness blocks missing or stale task artifacts, missing branch
  mode, PR-mode work on the recorded base branch, PR-mode branch mismatches,
  local/no-PR work without a rationale, unexpected changed files, suppression
  or framework-bypass markers without approved rationale, and missing
  review-gate evidence when the gate applies. When UI QA is required,
  pre-commit verifies recorded UI QA evidence only; it does not measure
  rerenders, require exact render counts, automate profiling, or replace React
  architecture review.
- Use the safest sufficient permissions for the task. Do not add tools,
  automation, browser automation, Playwright, MCP, hooks, CI, or new scripts to
  bypass sandbox friction without explicit approval. If sandbox/tooling blocks
  validation, record the blocker and use approved manual evidence when
  applicable.
- Post-commit PR lifecycle remains manual unless separately requested.
- Lifecycle closure is incomplete when an artifact archive/move is only
  partially staged or committed.
- Report skipped validation with a reason.

Required final response:

- Files changed
- Summary
- Commands run
- Validation result
- Assumptions
- Risks
- Suggested Conventional Commit message

Conventional Commit format:

`<type>(<scope>): <short description>`

Partial:

- Repository validation scripts exist under `scripts/`.
- `package.json` does not currently define a single validation alias.

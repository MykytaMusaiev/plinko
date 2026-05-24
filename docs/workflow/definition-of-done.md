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
- Implementation stays clean as it is generated, not only after review.
- Changed files stay within the approved editable scope.
- Related docs are updated or a docs-not-needed rationale is recorded.
- Semantic review gate passes when required.
- Mechanical validation passes or skipped checks are explained.
- Pre-commit readiness mechanically confirms the branch invariant before any
  manual commit.
- Task artifacts are archived when applicable.

Required for code changes:

- Stay within the requested scope.
- Stop before expanding beyond the approved audit or plan scope.
- Preserve the BFF boundary and auth token rules.
- Follow existing feature-oriented structure.
- Keep React component files focused on rendering, composition, hook usage, and
  event wiring.
- Keep non-trivial helpers, formatters, filters, mappers, constants, option
  lists, DTO adapters, and view-model builders outside component files in the
  owning feature when justified by the task.
- Use `src/shared` only for generic cross-feature or platform-level reuse, not
  feature-specific convenience.
- Run the semantic review gate for UI, code, refactor, or
  architecture-sensitive changes. Review confirms implementation quality; it
  should not be the first safeguard against obvious structure problems.
- Run `pnpm lint` when applicable.
- Run `pnpm build` when the change may affect build or runtime behavior.
- Run `scripts/check-api-boundary.sh` when API/auth boundary behavior may be
  affected.
- Run `scripts/check-docs-freshness.sh` when mapped source areas change.
- Pre-commit readiness blocks missing or stale task artifacts, missing branch
  mode, PR-mode work on the recorded base branch, PR-mode branch mismatches,
  local/no-PR work without a rationale, unexpected changed files, and missing
  review-gate evidence when the gate applies.
- Post-commit PR lifecycle remains manual unless separately requested.
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

Status: Partial
Owner: Frontend
Source of truth: AGENTS.md, package.json
Last verified: 2026-05-20
Related files: AGENTS.md, package.json

# Definition Of Done

A task is done when the requested scope is implemented and the final response
clearly reports what changed.

Required for code changes:

- Stay within the requested scope.
- Preserve the BFF boundary and auth token rules.
- Follow existing feature-oriented structure.
- Run `pnpm lint` when applicable.
- Run `pnpm build` when the change may affect build or runtime behavior.
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

- Dedicated validation scripts are not created yet. Until Phase 7, use existing
  package scripts only.

# Task Artifact

## Task ID

react-feature-ui-architecture-gates

## Branch mode

PR-mode.

## Base branch

feat/plinko

## Task branch

codex-stack-aware-react-quality-gates

## Current branch at task start

codex-stack-aware-react-quality-gates

## Branch-start status

Ready. Worktree was clean on `feat/plinko`; dedicated task branch was created
before workflow edits.

## Branch-start command/evidence

- `git status --short --branch` on base: `## feat/plinko`
- `git rev-parse --short HEAD`: `8e289a7`
- `git switch -c codex-stack-aware-react-quality-gates`
- `git status --short --branch` after branch creation:
  `## codex-stack-aware-react-quality-gates`

## Local/no-PR rationale

Not applicable.

## PR lifecycle

No PR created in this task.

## Retroactive PR needed

No.

## Goal

Strengthen stack-aware React feature UI quality gates for this Next.js App
Router frontend workflow.

## Scope

- Add a Stack Primitive Checklist before JSX-heavy or UI implementation.
- Require feature-local React decomposition before large UI/page content.
- Require project/framework primitives when the repository stack provides them.
- Prefer Next.js primitives where applicable, including `next/image` over raw
  `<img>`.
- Require explicit approval and task-artifact rationale for suppressions and
  framework bypasses.
- Make review block stack primitive misuse, component dump files, feature
  ownership violations, and unapproved suppressions.
- Make pre-commit mechanically scan for obvious suppression/bypass markers and
  block unless explicit approved rationale is recorded.
- Clarify that UI QA verifies visible behavior/layout and does not replace code
  architecture review.
- Update docs mapping so workflow and skill documentation freshness remains
  accurate.

## Non-goals

- Product source changes.
- Progression Page Integration.
- New scripts, hooks, CI, Playwright, MCP, dependencies, lint config, Next
  config, `package.json`, or lockfile changes.
- Staging, committing, pushing, creating PRs, merging, deleting branches, or
  archiving this artifact.

## User approval

User approved the expanded implementation scope from the read-only audit and
requested task branch `codex-stack-aware-react-quality-gates`.

## Audit / plan source

Read-only audit result for "Strengthen Stack-Aware React Feature UI Quality
Gates"; result was Scope incomplete with expanded approved editable scope.

## Approved editable files

- `AGENTS.md`
- `skills/audit/SKILL.md`
- `skills/implementation/SKILL.md`
- `skills/review/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `skills/ui-qa/SKILL.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/architecture.md`
- `docs/doc-mapping.json`
- `.ai/tasks/active/react-feature-ui-architecture-gates.md`

## Context-only files inspected

- `package.json`
- `CLAUDE.md`
- `docs/workflow/worktree-task-flow.md`
- `docs/workflow/documentation-freshness.md`
- `skills/documentation/SKILL.md`
- `skills/api-boundary-check/SKILL.md`
- `skills/lifecycle-close/SKILL.md`
- `scripts/check-api-boundary.sh`
- `scripts/check-docs-freshness.sh`
- `scripts/validate.sh`

## Affected source files

None.

## Affected docs

- `AGENTS.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `docs/architecture.md`
- `docs/doc-mapping.json`
- `.ai/tasks/TEMPLATE.md`

## Stop conditions / scope expansion notes

Stop before editing product source, tooling configuration, package files,
scripts, hooks, CI, Playwright, MCP, dependencies, or files outside the
approved scope.

## Architecture-sensitive changes

Workflow-only. The task strengthens documented architecture and review gates but
does not change runtime architecture.

## Stack Primitive Checklist

Not applicable to product JSX because this task does not change source UI.
Workflow guidance now requires future JSX-heavy UI work to record route/page
thinness, page-content orchestration, feature-local split, data/state/form
ownership, stack primitives, and approved bypasses before implementation.

## Suppression / framework-bypass approvals

Approved only for documentation of the new gates in workflow files and this
artifact. Marker strings such as `eslint-disable`, `@ts-ignore`,
`@ts-expect-error`, `@ts-nocheck`, raw `<img`, `no-img-element`, and
`NEXT_PUBLIC_API_BASE` are present as examples of blocked bypass markers, not as
source-code suppressions or runtime framework bypasses. No product source file
may add these markers in this task.

## Implementation summary

- Added stack-aware React UI generation rules to repository operating guidance.
- Added implementation-time Stack Primitive Checklist and decomposition rules.
- Added semantic review checks for stack primitives, route/page thinness,
  component dumps, feature ownership, and unapproved bypasses.
- Added pre-commit mechanical bypass-marker scan expectations.
- Clarified that UI QA does not replace architecture or stack primitive review.
- Updated task artifact template and docs mapping for workflow freshness.

## Documentation update

Docs updates are required because workflow skills and architecture guidance are
changing. The mapped workflow and architecture docs were updated as part of this
task.

## Commands run

- `Get-Content -Raw skills/implementation/SKILL.md`
- `git status --short --branch`
- `git branch --show-current`
- `git rev-parse --verify feat/plinko`
- `git switch -c codex-stack-aware-react-quality-gates`
- `git rev-parse --short HEAD`
- `Get-Content -Raw AGENTS.md`
- `Get-Content -Raw docs/doc-mapping.json`
- `Get-Content -Raw .ai/tasks/TEMPLATE.md`
- `Get-Content -Raw skills/audit/SKILL.md`
- `Get-Content -Raw skills/review/SKILL.md`
- `Get-Content -Raw skills/pre-commit/SKILL.md`
- `Get-Content -Raw skills/ui-qa/SKILL.md`
- `Get-Content -Raw docs/workflow/codex-task-flow.md`
- `Get-Content -Raw docs/workflow/definition-of-done.md`
- `Get-Content -Raw docs/architecture.md`
- `Get-Content -Raw package.json`
- `Get-ChildItem -Recurse -File scripts`
- `git diff -- AGENTS.md skills/audit/SKILL.md skills/implementation/SKILL.md skills/review/SKILL.md skills/pre-commit/SKILL.md skills/ui-qa/SKILL.md docs/workflow/codex-task-flow.md docs/workflow/definition-of-done.md .ai/tasks/TEMPLATE.md docs/architecture.md docs/doc-mapping.json .ai/tasks/active/react-feature-ui-architecture-gates.md`
- `git status --short`
- `git diff --check`
- `pnpm lint`
- `C:\Program Files\Git\usr\bin\bash.exe scripts/check-docs-freshness.sh`
- `rg -n "eslint-disable|@ts-ignore|@ts-expect-error|@ts-nocheck|biome-ignore|<img|no-img-element|NEXT_PUBLIC_API_BASE" AGENTS.md skills docs .ai/tasks/active/react-feature-ui-architecture-gates.md .ai/tasks/TEMPLATE.md`
- `C:\Program Files\Git\bin\bash.exe -lc "cd /d/react/evoverse/internship/plinko && scripts/check-docs-freshness.sh"`
- `C:\Program Files\Git\bin\bash.exe -lc "cd /d/react/evoverse/internship/plinko && scripts/validate.sh"`
- `git diff --name-only`
- `git status --short --branch`
- `git diff --stat`
- `git diff -- .ai/tasks/active/react-feature-ui-architecture-gates.md`
- `Get-Content -Raw scripts/check-docs-freshness.sh`
- `Get-Content -Raw docs/doc-mapping.json`
- `Get-Content -Raw .ai/tasks/active/react-feature-ui-architecture-gates.md`
- `rg -n "docs[- ]not[- ]needed|documentation[- ]not[- ]needed" .ai/tasks/active/react-feature-ui-architecture-gates.md`
- `git diff --check`
- `C:\Program Files\Git\bin\bash.exe -lc "cd /d/react/evoverse/internship/plinko && scripts/check-docs-freshness.sh"`

## Validation results

- PASS: `git diff --check`
- PASS: `pnpm lint`
- PASS: `scripts/check-docs-freshness.sh` via Git Bash login shell
- PASS: `scripts/validate.sh` via Git Bash login shell, including `pnpm lint`,
  API boundary check, and documentation freshness check
- NOTE: first direct `usr/bin/bash.exe` docs-freshness attempt failed because
  `dirname` was not available in that shell PATH; rerun with Git Bash login
  shell passed.
- Suppression/bypass marker scan found only documented blocked-marker examples
  and existing API-boundary guidance; approved rationale is recorded in this
  artifact.
- Review blocker fix pending validation: removed misleading freshness fallback
  wording from this artifact so docs freshness should pass because mapped docs
  changed.
- PASS: review blocker fix validation found no freshness fallback trigger text
  in this artifact.
- PASS: rerun `git diff --check`.
- PASS: rerun `scripts/check-docs-freshness.sh` with plain output:
  `PASS: Documentation freshness check passed.`

## UI QA requirement

Not required. This is workflow/docs-only and does not change visible UI.

## UI QA evidence

Not applicable.

## Sandbox / tooling blockers

Initial branch creation needed escalated permissions; user approved the
requested branch name and the branch was created successfully.

## Docs freshness result

Passed via `scripts/check-docs-freshness.sh`.

## Docs freshness fallback

No fallback rationale is recorded. Docs are required and were updated as part of
this task.

## Code-quality review gate

Required after implementation because this changes workflow gates and
architecture guidance. Handoff: review should verify the updated guidance stays
operational, scope-limited, and separated across implementation, review,
pre-commit, and UI QA responsibilities.

Self-review result: pass. Changes stay within approved scope, keep
implementation/review/pre-commit/UI QA responsibilities separated, avoid new
scripts or tooling, and keep UI QA distinct from React architecture and stack
primitive review.

## Pre-commit readiness

Not run as a separate pre-commit skill because the user requested
implementation and validation only. Mechanical readiness evidence is present:
branch invariant matches PR-mode fields, changed files are within approved
scope, validation passed, and suppression/bypass scan rationale is recorded.

## Risks

- Guidance could become too broad if written as theory instead of operational
  checks.
- Pre-commit suppression scanning must remain mechanical and not become
  semantic review.
- UI QA must remain separate from React architecture and stack primitive review.

## Artifact status / archival status

Active; do not archive in this task.

## Archive commit verification

Not applicable.

## Handoff / next step

Previous semantic review blocker is resolved. Ready for user review or a
separate pre-commit readiness check. Do not archive or stage in this task.

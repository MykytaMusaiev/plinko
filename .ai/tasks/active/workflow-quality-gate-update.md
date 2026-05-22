# Task Artifact

## Task ID

workflow-quality-gate-update

## Branch/worktree

Current workspace; no worktree introduced.

## Goal

Strengthen repository workflow documentation and local skills so code quality is
guided during implementation and confirmed by review and pre-commit readiness.

## Scope

- `AGENTS.md`
- `CLAUDE.md`
- `skills/implementation/SKILL.md`
- `skills/review/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/workflow/definition-of-done.md`
- `docs/workflow/codex-task-flow.md`
- `.ai/tasks/active/workflow-quality-gate-update.md`

## Non-goals

- No product source changes under `src/**`.
- No app behavior changes.
- No dependency, script, hook, worktree, MCP, or subagent changes.
- No README edits.
- No unrelated documentation rewrites.
- No duplication of `AGENTS.md` rules into `CLAUDE.md`.
- No semantic code review responsibility added to pre-commit.

## User approval

Approved by user prompt for documentation/workflow implementation only.

## Affected source files

None.

## Affected docs

- `AGENTS.md`
- `CLAUDE.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/workflow/definition-of-done.md`
- `docs/workflow/codex-task-flow.md`
- `skills/implementation/SKILL.md`
- `skills/review/SKILL.md`
- `skills/pre-commit/SKILL.md`

## Architecture-sensitive changes

No product architecture changes. Workflow rules now clarify generation-time
feature ownership, semantic review, and mechanical pre-commit readiness.

## Implementation summary

- Added concise project/docs map and durable feature ownership rules.
- Added generation-time structure guidance for feature and UI implementation.
- Added semantic code-quality review checklist.
- Kept pre-commit mechanical while confirming review-gate evidence.
- Added task artifact evidence fields.
- Updated DoD and Codex task flow lifecycle.
- Kept `CLAUDE.md` bridge-only.

## Documentation update / docs-not-needed rationale

Workflow documentation was updated because skills and workflow rules changed.

## Validation plan

- Run `git status --short`.
- Run `git diff --check`.
- Run `scripts/check-docs-freshness.sh`.
- Run `pnpm lint`.
- Do not run `pnpm build` unless runtime code is unexpectedly touched.

## Commands run

- `git status --short`
- `git diff --check`
- `bash scripts/check-docs-freshness.sh`
- `pnpm lint`
- `Get-Command bash -All | Select-Object -ExpandProperty Source`
- `Test-Path -LiteralPath "C:\Program Files\Git\bin\bash.exe"`
- `Test-Path -LiteralPath "C:\Program Files\Git\usr\bin\bash.exe"`
- `& "C:\Program Files\Git\bin\bash.exe" "scripts/check-docs-freshness.sh"`
- `& "C:\Program Files\Git\usr\bin\bash.exe" "scripts/check-docs-freshness.sh"`
- `& "C:\Program Files\Git\bin\bash.exe" -lc "echo PATH=$PATH; which dirname; pwd"`
- `& "C:\Program Files\Git\bin\bash.exe" -lc "./scripts/check-docs-freshness.sh"`

## Validation results

- `git status --short`: expected changed docs/skills/template/task artifact
  only.
- `git diff --check`: passed.
- `pnpm lint`: passed.
- `pnpm build`: not run because only docs, skills, and task artifact files were
  changed.

## Docs freshness result

- `bash scripts/check-docs-freshness.sh`: failed before repo logic because
  Windows `bash.exe` resolved to WSL with no installed distribution.
- Git Bash direct invocation failed because the shell did not have Git Unix
  utilities such as `dirname` on PATH.
- `C:\Program Files\Git\bin\bash.exe -lc "./scripts/check-docs-freshness.sh"`:
  passed with docs-not-needed rationale.

## Docs not needed rationale

Not applicable; related workflow docs were updated.

## Code-quality review gate

Not applicable for product code because this task changes workflow
documentation and local skills only. Layering self-check completed while
editing.

## Pre-commit readiness

Mechanical validation passed. A dedicated pre-commit readiness pass can be run
before a user-requested commit.

## Risks

- Rules could drift if `AGENTS.md`, workflow docs, and local skills are later
  updated independently.
- Overly broad wording could encourage unnecessary feature folders; rules
  explicitly keep folders justified by task and conventions.

## Artifact status / archival status

Active. Archive after final handoff when appropriate.

## Handoff / next step

Report changed files, validation results, assumptions, risks, and suggested
Conventional Commit message.

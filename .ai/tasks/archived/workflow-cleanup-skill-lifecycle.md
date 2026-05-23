# Task Artifact

## Task ID

workflow-cleanup-skill-lifecycle

## Branch/worktree

Current workspace: `D:\react\evoverse\internship\plinko`

## Goal

Reduce repeated prompt boilerplate by moving recurring audit, implementation
scope, task artifact lifecycle, and pre-commit readiness rules into local
repository skills.

## Audit / plan source

Approved read-only workflow audit from the user prompt. Result: Needs Changes.

## Scope

- Create `skills/audit/SKILL.md`.
- Update `skills/implementation/SKILL.md`.
- Update `skills/pre-commit/SKILL.md`.
- Update `skills/review/SKILL.md` only to clarify pre-implementation audit
  belongs to `skills/audit/SKILL.md`.
- Update `AGENTS.md` only with a short lifecycle/scope rule if needed.
- Update `docs/workflow/codex-task-flow.md` minimally.
- Update `docs/workflow/definition-of-done.md` minimally.
- Update `.ai/tasks/TEMPLATE.md` minimally.
- Update `docs/doc-mapping.json` only if required for docs freshness.
- Keep this active task artifact updated.
- Add local repository skill priority guidance before pre-commit.

## Approved editable files

- `.ai/tasks/active/workflow-cleanup-skill-lifecycle.md`
- `.ai/tasks/TEMPLATE.md`
- `AGENTS.md`
- `docs/doc-mapping.json`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `skills/audit/SKILL.md`
- `skills/implementation/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `skills/review/SKILL.md`

## Context-only files inspected

- `skills/documentation/SKILL.md`
- `skills/api-boundary-check/SKILL.md`
- `docs/workflow/documentation-freshness.md`
- `docs/workflow/worktree-task-flow.md`
- `README.md`

## Non-goals

- Do not touch product code.
- Do not update `README.md`.
- Do not update scripts.
- Do not add hooks, worktrees, MCP/tools, subagents, or automation scripts.
- Do not broadly rewrite workflow documentation.
- Do not update external ChatGPT project files or AI workflow practice files.
- Do not archive this task artifact.
- Do not stage or commit.

## User approval

Approved by user prompt for the minimal workflow cleanup plan.

## Affected source files

None.

## Affected docs

- `AGENTS.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `skills/audit/SKILL.md`
- `skills/implementation/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `skills/review/SKILL.md`
- `docs/doc-mapping.json`, only if required.

## Stop conditions / scope expansion notes

Stop before any product code, script, hook, worktree, MCP/tool, subagent,
automation, README, broad docs rewrite, or unapproved external workflow file
change. Stop if lifecycle rules conflict across AGENTS, skills, docs, or the
task template.

## Architecture-sensitive changes

No product architecture changes. Workflow responsibility boundaries are being
clarified across local skills and lightweight workflow docs.

## Implementation summary

- Added `skills/audit/SKILL.md` for pre-implementation discovery and scope
  recommendation.
- Updated implementation skill to require approved scope, active task artifact
  creation before edits, editable/context-only file separation, and stop
  conditions before scope expansion.
- Updated pre-commit skill to verify active artifact freshness, changed files
  against approved scope, validation evidence, and review-gate evidence without
  becoming a semantic review.
- Narrowed review skill to completed changes and directed pre-implementation
  discovery to the audit skill.
- Added a short AGENTS lifecycle rule and minimal workflow docs/template
  alignment.
- Added local skill priority guidance so named local skills are treated as the
  workflow source of truth for repository execution tasks, with a stop before
  fallback when a requested local skill is missing, unclear, or not applicable.

## Documentation update / docs-not-needed rationale

Workflow documentation updates are in scope because local skill behavior changes.

## Commands run

- `Get-Content -LiteralPath skills/implementation/SKILL.md`
- `git status --short`
- `Get-ChildItem -LiteralPath .ai/tasks/active -Force`
- `Get-Content -LiteralPath AGENTS.md`
- `Get-Content -LiteralPath .ai/tasks/TEMPLATE.md`
- `Get-Content -LiteralPath skills/review/SKILL.md`
- `Get-Content -LiteralPath skills/pre-commit/SKILL.md`
- `Get-Content -LiteralPath docs/workflow/codex-task-flow.md`
- `Get-Content -LiteralPath docs/workflow/definition-of-done.md`
- `Get-Content -LiteralPath docs/doc-mapping.json`
- `Get-Content -LiteralPath package.json`
- `Get-Content -LiteralPath skills/documentation/SKILL.md`
- `Get-Content -LiteralPath skills/api-boundary-check/SKILL.md`
- `Get-Content -LiteralPath scripts/check-docs-freshness.sh`
- `git diff -- AGENTS.md skills/audit/SKILL.md skills/implementation/SKILL.md skills/pre-commit/SKILL.md skills/review/SKILL.md docs/workflow/codex-task-flow.md docs/workflow/definition-of-done.md .ai/tasks/TEMPLATE.md`
- `Get-Content -LiteralPath skills/audit/SKILL.md`
- `git diff --check`
- `bash scripts/check-docs-freshness.sh`
- `& "C:\Program Files\Git\bin\bash.exe" -lc "./scripts/check-docs-freshness.sh"`
- `pnpm lint`
- `Select-String -LiteralPath AGENTS.md,docs/workflow/codex-task-flow.md,.ai/tasks/active/workflow-cleanup-skill-lifecycle.md -Pattern "local skill|skills/|workflow source|source of truth|fallback|priority|applicable" -CaseSensitive:$false`
- `Get-Content` snippets for `AGENTS.md`, `docs/workflow/codex-task-flow.md`, and this active task artifact.
- `git diff --check`
- `& "C:\Program Files\Git\bin\bash.exe" -lc "./scripts/check-docs-freshness.sh"`
- `pnpm lint`

## Validation results

- `git diff --check`: passed.
- `pnpm lint`: passed.
- Follow-up local skill priority update:
  - `git diff --check`: passed.
  - Git Bash docs freshness check: passed.
  - `pnpm lint`: passed.
- `pnpm build`: skipped because this task changed only workflow docs, local
  skills, and task artifact files.

## Docs freshness result

- `bash scripts/check-docs-freshness.sh`: failed before repo logic because
  Windows `bash` routes to WSL and no WSL distribution is installed.
- `C:\Program Files\Git\bin\bash.exe -lc "./scripts/check-docs-freshness.sh"`:
  passed with docs-not-needed rationale.
- Follow-up Git Bash docs freshness check passed with docs-not-needed rationale
  after adding the local skill priority rule.

## Docs not needed rationale

Not applicable; mapped workflow docs are being updated.

## Code-quality review gate

Not applicable for product code. Workflow skill/docs changes require
self-checking for responsibility separation and scope discipline.

## Pre-commit readiness

Validation passed for the requested checks. Artifact remains active per user
instruction; no staging or commit performed.

## Risks

- Workflow wording could become too heavy and preserve the boilerplate problem.
- Pre-commit could drift into semantic review unless kept mechanical.

## Artifact status / archival status

Active. Do not archive for this task.

## Handoff / next step

Report changes and validation results. Leave artifact active.

# Task Artifact

## Task ID
2026-05-25-artifact-archive-staging-rule

## Branch mode
Local/no-PR mode.

## Base branch
feat/plinko

## Task branch
Not applicable.

## Current branch at task start
feat/plinko

## Branch-start status
Clean worktree before this workflow-only correction.

## Branch-start command/evidence
- `git status --short --branch` returned `## feat/plinko`.

## Local/no-PR rationale
Small repository workflow/documentation fix caused by a confirmed
lifecycle-command gap. It does not touch product code, runtime behavior, API
routes, UI, dependencies, or feature modules.

## PR lifecycle
No branch, PR, staging, commit, push, merge, archive, or deletion requested.

## Retroactive PR needed
No.

## Goal
Document that task artifact archive/move commits must stage both sides of the
move so the active artifact deletion cannot be missed.

## Scope
- Inspect and update only relevant workflow, skill, and task-template files.
- Document `git add -A .ai/tasks` as the preferred archive/move staging command.
- Document post-commit verification with `git show --name-status --oneline --stat HEAD`.

## Non-goals
- No product source code edits.
- No API route edits.
- No feature file edits.
- No package or dependency edits.
- No hooks, automation, CI, MCP, worktrees, or new scripts.
- No staging, commit, push, merge, unrelated artifact archival, or branch deletion.

## User approval
User explicitly requested this local/no-PR workflow correction.

## Audit / plan source
User-provided scope and local workflow files.

## Approved editable files
- `skills/pre-commit/SKILL.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `.ai/tasks/TEMPLATE.md`
- `.ai/tasks/active/2026-05-25-artifact-archive-staging-rule.md`

## Context-only files inspected
- `skills/implementation/SKILL.md`
- `skills/documentation/SKILL.md`
- Existing `.ai/tasks/active/` listing

## Affected source files
None.

## Affected docs
- `skills/pre-commit/SKILL.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `.ai/tasks/TEMPLATE.md`

## Stop conditions / scope expansion notes
Stop before product, runtime, dependency, script, hook, branch, PR, or staging
changes.

## Architecture-sensitive changes
None.

## Implementation summary
- Documented that artifact archive/move commits must stage both sides of the
  move.
- Added `git add -A .ai/tasks` as the preferred staging command for artifact
  archive/move commits.
- Added post-commit verification guidance with
  `git show --name-status --oneline --stat HEAD`.
- Added an archive commit verification section to the task artifact template.

## Documentation update / docs-not-needed rationale
Workflow documentation and the pre-commit skill were updated. No product-code
docs were needed because this is workflow-only.

## Commands run
- `git status --short --branch`
- `Get-Content` inspections for local skills and workflow docs
- `Get-ChildItem .ai/tasks/active`
- `git diff -- skills/pre-commit/SKILL.md docs/workflow/codex-task-flow.md docs/workflow/definition-of-done.md .ai/tasks/TEMPLATE.md`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`
- `git diff --check`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/check-docs-freshness.sh'`
- `C:\Program Files\Git\usr\bin\bash.exe -lc 'scripts/validate.sh'`

## Validation results
- `git diff --check`: passed.
- `scripts/check-docs-freshness.sh` via Git Bash: passed.
- `scripts/validate.sh` via Git Bash: passed.

## Docs freshness result
Passed. The script reports "with docs-not-needed rationale" because active
task artifacts include docs-not-needed wording, but mapped workflow docs were
updated directly.

## Docs not needed rationale

## Code-quality review gate
Not applicable; workflow/documentation-only correction.

## Pre-commit readiness
Not requested; no staging or commit will be performed.

## Risks
Existing unrelated active artifact `fast-playback-mode.md` is present and will
not be modified.

## Artifact status / archival status
Active.

## Handoff / next step
Ready for review or manual commit. Use `git add -A .ai/tasks` for future
artifact archive/move commits.

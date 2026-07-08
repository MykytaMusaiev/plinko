# Task Artifact

## Task ID

pr-mode-branch-gate-workflow

## Branch mode

PR

## Base branch

feat/plinko

## Task branch

codex-pr-mode-branch-gate

## Current branch at task start

feat/plinko

## Branch-start status

Ready. Task branch created from the configured base/integration branch before
workflow edits.

## Branch-start command/evidence

- `git status --short --branch`: clean on `feat/plinko`
- `git switch -c codex-pr-mode-branch-gate`: created task branch from
  `feat/plinko`

## Local/no-PR rationale

Not applicable.

## PR lifecycle

Manual after commit; no PR creation, merge, branch deletion, or automation in
this task.

## Retroactive PR needed

No. The completed mobile board layout refinement remains local/no-PR and should
not have a retroactive PR created.

## Goal

Implement workflow documentation and local skill updates so non-trivial
implementation tasks default to PR-mode branch-start readiness before source
edits, while local/no-PR mode remains explicit and pre-commit stays mechanical.

## Scope

- Update `skills/implementation/SKILL.md`.
- Update `skills/pre-commit/SKILL.md`.
- Update `.ai/tasks/TEMPLATE.md`.
- Update `docs/workflow/codex-task-flow.md`.
- Update `docs/workflow/definition-of-done.md`.

## Non-goals

- No product code changes.
- No hooks, worktrees, MCP/tools, CI, or PR lifecycle automation.
- No staging or committing.
- No retroactive PR for the completed mobile board layout refinement task.
- No `AGENTS.md` edit unless implementation proves it is required and work
  stops before making that change.

## User approval

User approved the completed audit result as the implementation plan and named
the approved editable files.

## Audit / plan source

Completed audit result from the prior turn.

## Approved editable files

- `skills/implementation/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `.ai/tasks/active/pr-mode-branch-gate-workflow.md`

## Context-only files inspected

- `skills/audit/SKILL.md`
- `AGENTS.md`
- `docs/workflow/worktree-task-flow.md`
- `docs/doc-mapping.json`
- `package.json`
- `scripts/validate.sh`
- `scripts/check-docs-freshness.sh`
- `scripts/check-api-boundary.sh`

## Affected source files

None.

## Affected docs

- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`

## Stop conditions / scope expansion notes

Stop before editing `AGENTS.md`, product code, scripts, hooks, CI, dependencies,
tools, worktrees, PR automation, merge automation, branch deletion automation,
or files outside the approved scope.

## Architecture-sensitive changes

None. Workflow-only changes.

## Implementation summary

Updated the implementation skill, pre-commit skill, task artifact template, and
workflow docs so non-trivial implementation defaults to PR-mode from
`feat/plinko`, local/no-PR mode requires a rationale, implementation owns
branch-start enforcement before edits, and pre-commit mechanically verifies the
recorded branch invariant without PR lifecycle automation.

## Documentation update / docs-not-needed rationale

Workflow docs will be updated because `skills/**` changes map to
`docs/workflow/codex-task-flow.md`.

## Commands run

- `Get-Content -Raw skills/implementation/SKILL.md`
- `git status --short --branch`
- `git branch --show-current`
- `git diff --name-only`
- `git switch -c codex/pr-mode-branch-gate` failed due Git ref path creation
  conflict in the sandboxed attempt.
- `git branch --list`
- `Get-ChildItem -Force .git\refs\heads | Select-Object FullName, Mode, Length`
- `git switch -c codex-pr-mode-branch-gate` failed in sandbox with permission
  denied writing `.git`.
- `git switch -c codex-pr-mode-branch-gate` succeeded with user-approved
  escalation.
- `git diff -- skills/implementation/SKILL.md skills/pre-commit/SKILL.md .ai/tasks/TEMPLATE.md docs/workflow/codex-task-flow.md docs/workflow/definition-of-done.md .ai/tasks/active/pr-mode-branch-gate-workflow.md`
- `pnpm lint`
- `Get-Command bash -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source`
- `Test-Path 'C:\Program Files\Git\bin\bash.exe'`
- `& 'C:\Program Files\Git\bin\bash.exe' scripts/check-docs-freshness.sh`
  failed to run correctly because Git Bash did not initialize core Unix
  utilities on PATH.
- `& 'C:\Program Files\Git\bin\bash.exe' scripts/validate.sh` failed to run
  correctly for the same Git Bash PATH initialization issue.
- `& 'C:\Program Files\Git\bin\bash.exe' -lc 'cd /d/react/evoverse/internship/plinko && scripts/check-docs-freshness.sh'`
- `& 'C:\Program Files\Git\bin\bash.exe' -lc 'cd /d/react/evoverse/internship/plinko && scripts/validate.sh'`

## Validation results

- `pnpm lint`: passed.
- `scripts/validate.sh` through Git Bash login shell: passed.
  - `pnpm lint`: passed.
  - `scripts/check-api-boundary.sh`: passed.
  - `scripts/check-docs-freshness.sh`: passed.
- `pnpm build`: skipped because this task changed only workflow Markdown and
  skill instructions, with no product code or runtime behavior changes.

## Docs freshness result

Passed through Git Bash login shell.

## Docs not needed rationale

Not applicable; workflow docs are in scope.

## Code-quality review gate

Not applicable; workflow-only Markdown changes, no product code.

## Pre-commit readiness

Not requested. Branch invariant is satisfied for this task artifact:
PR-mode on `codex-pr-mode-branch-gate`, with recorded base branch
`feat/plinko`. Do not stage or commit.

## Risks

- The default branch prefix `codex/` could not be created in the sandboxed
  branch attempt, so this task uses `codex-pr-mode-branch-gate`.
- Pre-commit branch checks must remain mechanical and must not become PR
  lifecycle automation.

## Artifact status / archival status

Active. Do not archive before validation and handoff.

## Handoff / next step

Implementation and validation are complete. Next step is optional pre-commit
readiness when the user wants to prepare for a manual commit.

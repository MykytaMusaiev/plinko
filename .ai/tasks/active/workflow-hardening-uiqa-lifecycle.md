# Task Artifact

## Task ID

workflow-hardening-uiqa-lifecycle

## Branch mode

PR-mode.

## Base branch

feat/plinko

## Task branch

codex-workflow-hardening-uiqa-lifecycle

## Current branch at task start

feat/plinko

## Branch-start status

Ready. The worktree was clean on `feat/plinko` before implementation edits, and
a dedicated task branch was created before file changes.

## Branch-start command/evidence

- `git status --short --branch`: `## feat/plinko`
- `git branch --show-current`: `feat/plinko`
- `git switch -c codex/workflow-hardening-uiqa-lifecycle`: failed because the
  local Git refs path could not create the `codex/` directory.
- `git switch -c codex-workflow-hardening-uiqa-lifecycle`: succeeded with
  user-approved escalation after sandbox permission denial.

## Local/no-PR rationale

Not applicable.

## PR lifecycle

Manual after implementation and user direction. No PR creation, push, merge,
branch deletion, artifact archival, staging, or commit automation is in scope.

## Retroactive PR needed

No.

## Goal

Harden repository workflow guidance for UI QA, lifecycle closure, and
permissions/sandbox policy before Profile Page Integration.

## Scope

- Create `skills/ui-qa/SKILL.md`.
- Create `skills/lifecycle-close/SKILL.md`.
- Update `skills/implementation/SKILL.md`.
- Update `skills/review/SKILL.md`.
- Update `skills/pre-commit/SKILL.md`.
- Update `docs/workflow/codex-task-flow.md`.
- Update `docs/workflow/definition-of-done.md` only if needed.
- Update `.ai/tasks/TEMPLATE.md` only if needed.
- Update `AGENTS.md` only with short operational rules if needed.
- Keep one active task artifact updated under `.ai/tasks/active/`.

## Non-goals

- No product code.
- No Profile or Progression work.
- No API/BFF changes.
- No hooks, dependencies, scripts, Playwright, MCP/tools, worktrees,
  subagents, or CI gates.
- No React Profiler automation.
- No hard rerender counts or exact render-count gates.
- No PR automation, merge automation, branch deletion automation, or automated
  artifact archival.
- No new workflow document without stopping for approval.

## User approval

Approved by user prompt using the completed audit result as source of truth.

## Audit / plan source

Completed audit result from the prior turn. Result: Needs Changes with a
recommended editable scope for workflow docs, local skills, and this task
artifact.

## Approved editable files

- `.ai/tasks/active/workflow-hardening-uiqa-lifecycle.md`
- `AGENTS.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- `skills/implementation/SKILL.md`
- `skills/lifecycle-close/SKILL.md`
- `skills/pre-commit/SKILL.md`
- `skills/review/SKILL.md`
- `skills/ui-qa/SKILL.md`

## Context-only files inspected

- `skills/audit/SKILL.md`
- `docs/workflow/documentation-freshness.md`
- `docs/workflow/worktree-task-flow.md`
- `docs/doc-mapping.json`
- `package.json`
- `scripts/validate.sh`
- `scripts/check-docs-freshness.sh`
- `scripts/check-api-boundary.sh`
- prior archived workflow task artifacts under `.ai/tasks/archived/`

## Affected source files

None.

## Affected docs

- `AGENTS.md`
- `.ai/tasks/TEMPLATE.md`
- `docs/workflow/codex-task-flow.md`
- `docs/workflow/definition-of-done.md`
- local skill files under `skills/`

## Stop conditions / scope expansion notes

Stop before touching product code, API/BFF files, Profile or Progression work,
dependencies, scripts, hooks, Playwright, MCP/tools, worktrees, subagents, CI,
React Profiler automation, hard rerender-count gates, PR automation, merge
automation, branch deletion automation, automated artifact archival, or any new
workflow document.

## Architecture-sensitive changes

No product architecture changes. This is workflow/docs/skills-only.

## Implementation summary

- Added `skills/ui-qa/SKILL.md` for manual/screenshot/layout QA, responsive
  sanity, navigation/shell overlap checks, basic UX sanity, and qualitative
  render/performance sanity.
- Added `skills/lifecycle-close/SKILL.md` for manual post-merge/final closure
  evidence, base branch checks, local task branch cleanup status, and artifact
  archive move verification.
- Updated implementation, review, and pre-commit skills so UI QA is required
  and evidenced by implementation, render/performance risk is reviewed
  semantically, and pre-commit remains mechanical.
- Updated workflow docs, task template, and AGENTS guidance with short UI QA
  and permissions/sandbox policy hooks.

## Documentation update / docs-not-needed rationale

Workflow docs will be updated because `skills/**` changes map to
`docs/workflow/codex-task-flow.md`.

## Commands run

- `Get-Content -Raw skills/implementation/SKILL.md`
- `git status --short --branch`
- `git branch --show-current`
- `Get-ChildItem -Force .ai\tasks\active | Select-Object -ExpandProperty Name`
- `git switch -c codex/workflow-hardening-uiqa-lifecycle`
- `git branch --list`
- `Get-ChildItem -Force .git\refs\heads | Select-Object Name,Mode,Length`
- `git switch -c codex-workflow-hardening-uiqa-lifecycle`
- `git switch -c codex-workflow-hardening-uiqa-lifecycle` with approved
  escalation
- `git diff -- AGENTS.md skills/ui-qa/SKILL.md skills/lifecycle-close/SKILL.md skills/implementation/SKILL.md skills/review/SKILL.md skills/pre-commit/SKILL.md docs/workflow/codex-task-flow.md docs/workflow/definition-of-done.md .ai/tasks/TEMPLATE.md .ai/tasks/active/workflow-hardening-uiqa-lifecycle.md`
- `rg -n "rerender|render count|Profiler|Playwright|automation|archive|UI QA|required|sandbox|manual browser" AGENTS.md docs/workflow skills .ai/tasks/active/workflow-hardening-uiqa-lifecycle.md`
- `Get-Content -Raw skills/pre-commit/SKILL.md`
- `git status --short --branch`
- `git diff --check`
- `C:\Program Files\Git\usr\bin\bash.exe -lc "scripts/check-docs-freshness.sh"`
- `C:\Program Files\Git\usr\bin\bash.exe -lc "scripts/validate.sh"` timed out
  at 120 seconds while running `pnpm lint` in parallel with standalone lint.
- `pnpm lint` timed out at 120 seconds while running in parallel with
  `scripts/validate.sh`.
- `pnpm lint`
- `C:\Program Files\Git\usr\bin\bash.exe -lc "scripts/validate.sh"`

## Validation results

- `git diff --check`: passed.
- `pnpm lint`: passed on sequential rerun with a longer timeout.
- `scripts/validate.sh` through Git Bash: passed on sequential rerun with a
  longer timeout.
  - `pnpm lint`: passed.
  - `scripts/check-api-boundary.sh`: passed.
  - `scripts/check-docs-freshness.sh`: passed.
- Initial parallel validation attempt timed out at 120 seconds while both
  commands were running `eslint`; sequential reruns passed.
- `pnpm build`: skipped because this task changed only workflow docs, local
  skills, and the active task artifact; no runtime/product code was touched.

## UI QA requirement

Not applicable for this task because no visible UI, layout, navigation,
responsive behavior, animation, or high-frequency interaction was changed.

## UI QA evidence

Not applicable.

## Sandbox / tooling blockers

`git switch -c codex-workflow-hardening-uiqa-lifecycle` required user-approved
escalation because the sandbox denied writing the Git ref lock file.

## Docs freshness result

Passed through Git Bash. The script reported "with docs-not-needed rationale"
because the active task artifact contains a docs-not-needed section, while the
mapped workflow docs were also updated directly.

## Docs not needed rationale

Not applicable; mapped workflow docs are in scope.

## Code-quality review gate

Completed read-only using `skills/review/SKILL.md`.

- Blocking issues: none.
- Non-blocking suggestions: none required.
- Risk level: low.
- Recommendation: pass / ready for pre-commit readiness.
- Review confirmed no product, runtime, API/BFF, package, or script changes.
- Review confirmed UI QA remains qualitative and does not create rerender-count
  gates, profiler automation, Playwright, dependencies, scripts, MCP/tools, CI,
  or automation.
- Review confirmed implementation, review, pre-commit, and lifecycle-close
  responsibilities remain separated: implementation marks and requests UI QA,
  `skills/ui-qa/SKILL.md` records qualitative evidence, review evaluates
  semantic UI/state render risk, pre-commit only checks for recorded evidence
  when required, and lifecycle-close stays manual.
- Review confirmed permissions/sandbox guidance stayed lightweight and no
  separate permissions/sandbox document or skill was added.

## Pre-commit readiness

Not requested. This artifact remains active and no staging or commit was
performed.

## Risks

- UI QA guidance could become too strict if it implies render-count gates or
  automated profiling.
- Pre-commit could drift into semantic review unless kept mechanical.
- Lifecycle-close could imply automation unless it stays manual and
  evidence-based.
- Permissions guidance could become too broad if duplicated across docs.

## Artifact status / archival status

Active. Do not archive in this task.

## Archive commit verification

Not applicable.

## Handoff / next step

Implement scoped workflow/docs/skills updates, validate, and report results.

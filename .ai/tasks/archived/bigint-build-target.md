# Task Artifact

## Task ID

bigint-build-target

## Branch/worktree

feat/plinko in `D:\react\evoverse\internship\plinko`

## Goal

Fix the current `pnpm build` TypeScript failure caused by BigInt literals being checked under an ES2017 target.

## Scope

- Reproduce the build failure.
- Inspect TypeScript and Next.js build configuration.
- Apply the minimum safe TypeScript config change required for BigInt literals to type-check.
- Run requested validation commands.

## Non-goals

- Refactor bigint utilities.
- Change bet amount logic.
- Change credit formatting behavior.
- Add dependencies.
- Change unrelated build settings.

## Affected source files

- `tsconfig.json`

## Affected docs

None.

## Architecture-sensitive changes

Changed TypeScript `compilerOptions.target` from `ES2017` to `ES2020` so BigInt literal syntax is allowed during type checking.

## Commands run

- `pnpm build`
- `rg --files node_modules/next/dist/docs`
- `rg -n 'BigInt|bigint|target|ES2017|ES2020' src tsconfig.json package.json scripts`
- `Get-Content node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md | Select-Object -Skip 416 -First 90`
- `Get-Content node_modules/next/dist/docs/03-architecture/supported-browsers.md | Select-Object -First 140`
- `pnpm lint`
- `pnpm build`
- `bash scripts/validate.sh`
- `C:\Program Files\Git\bin\bash.exe -lc 'cd /d/react/evoverse/internship/plinko && bash scripts/validate.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc 'cd /d/react/evoverse/internship/plinko && bash scripts/check-api-boundary.sh'`
- `C:\Program Files\Git\bin\bash.exe -lc 'cd /d/react/evoverse/internship/plinko && bash scripts/check-docs-freshness.sh'`

## Validation results

- `pnpm lint`: passed.
- `pnpm build`: passed.
- `bash scripts/validate.sh`: plain `bash` resolved to WSL and failed before repo validation because no WSL distro is installed.
- `scripts/validate.sh` via Git Bash login shell: passed.
- `scripts/check-api-boundary.sh` via Git Bash login shell: passed.
- `scripts/check-docs-freshness.sh` via Git Bash login shell: passed with docs-not-needed rationale.

## Docs freshness result

Context7 was skipped at user direction. Local Next.js 16.2.6 docs under `node_modules/next/dist/docs/` were inspected.

## Docs not needed rationale

No durable setup documentation change is needed because the project already uses BigInt runtime behavior; the change aligns TypeScript's parse/check target with existing source code.

## Risks

Raising the TypeScript output target can affect emitted JavaScript syntax assumptions, but Next.js targets modern browsers by default and the app already relies on BigInt runtime support.

## Handoff / next step

No follow-up required for this task.

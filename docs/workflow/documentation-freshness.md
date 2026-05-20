Status: Partial
Owner: Frontend
Source of truth: AGENTS.md
Last verified: 2026-05-20
Related files: AGENTS.md, docs/doc-mapping.json, node_modules/next/dist/docs

# Documentation Freshness

Use current documentation for library, framework, SDK, API, CLI, or cloud
service questions.

Required lookup:

- Resolve the library first with `ctx7`.
- Fetch docs for the selected `/org/project` ID.
- Use the fetched docs when answering or changing code.

Next.js rule:

- This repository uses Next.js `16.2.6`.
- Before editing Next.js App Router code, read the relevant local guide under
  `node_modules/next/dist/docs/`.
- Do not rely on older App Router assumptions.

Operational notes:

- Run Context7 CLI requests outside Codex's default sandbox.
- If a Context7 command fails with DNS, host resolution, or fetch errors inside
  the sandbox, rerun it outside the sandbox.

Repository documentation freshness:

- Use `docs/doc-mapping.json` to identify docs related to changed source areas.
- When a mapped source area changes, update the related docs or explicitly
  record why docs were not needed.
- A task artifact may contain the docs-not-needed rationale when the approved
  task flow provides an artifact location.
- Documentation review must check semantic correctness, not only file presence.
- Validation scripts are expected to catch missing mapped documentation updates
  once those scripts exist. Until then, reviewers should apply the mapping
  manually.

Planned:

- Deeper docs and repo-local skills may be added in future phases. Do not treat
  them as existing until they are present in the repository.

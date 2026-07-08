#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

MAPPING_FILE="docs/doc-mapping.json"

if [ ! -f "$MAPPING_FILE" ]; then
  echo "SKIP: $MAPPING_FILE not found."
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "FAIL: node is required to parse $MAPPING_FILE."
  echo "No dependency install is needed, but Node must be available with this repo."
  exit 1
fi

changed_files="$(
  {
    git diff --name-only --cached 2>/dev/null
    git diff --name-only 2>/dev/null
    git ls-files --others --exclude-standard 2>/dev/null
  } | sort -u
)"

if [ -z "$changed_files" ]; then
  echo "PASS: No changed files to check for documentation freshness."
  exit 0
fi

export CHANGED_FILES="$changed_files"
export TASK_ARTIFACT_PATH="${TASK_ARTIFACT_PATH:-${ACTIVE_TASK_ARTIFACT:-}}"

node <<'NODE'
const fs = require("fs");
const path = require("path");

const mappingPath = "docs/doc-mapping.json";
const changed = (process.env.CHANGED_FILES || "")
  .split(/\r?\n/)
  .map((s) => s.trim().replace(/\\/g, "/"))
  .filter(Boolean);

function globToRegExp(glob) {
  let out = "^";
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    const next = glob[i + 1];
    if (ch === "*" && next === "*") {
      out += ".*";
      i++;
    } else if (ch === "*") {
      out += "[^/]*";
    } else {
      out += ch.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }
  return new RegExp(out + "$");
}

function fileExists(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function readAllFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readAllFiles(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

function isUsableArtifact(file) {
  const normalized = file.replace(/\\/g, "/");
  if (normalized.endsWith("/.gitkeep")) return false;
  if (normalized === ".ai/tasks/TEMPLATE.md") return false;
  if (normalized.startsWith(".ai/tasks/archived/")) return false;
  return normalized.startsWith(".ai/tasks/active/") || file === process.env.TASK_ARTIFACT_PATH;
}

function hasFilledRationale(text) {
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const inline = line.match(/docs[- ]not[- ]needed|documentation[- ]not[- ]needed/i);
    const heading = line.match(/^#+\s*Docs not needed rationale\s*$/i);

    if (inline && !heading) {
      const afterMarker = line
        .replace(/.*(?:docs[- ]not[- ]needed|documentation[- ]not[- ]needed)\s*:?\s*/i, "")
        .trim();
      if (afterMarker.length > 0) return true;
    }

    if (heading || /docs[- ]not[- ]needed rationale\s*:?/i.test(line)) {
      for (let j = i + 1; j < lines.length; j++) {
        const candidate = lines[j].trim();
        if (/^#+\s+/.test(candidate)) break;
        if (candidate && !/^[-_*]+$/.test(candidate)) return true;
      }
    }
  }

  return false;
}

function hasDocsNotNeededRationale() {
  const explicit = process.env.TASK_ARTIFACT_PATH;
  const candidates = [];

  if (explicit && fileExists(explicit) && isUsableArtifact(explicit)) {
    candidates.push(explicit);
  }

  candidates.push(...readAllFiles(".ai/tasks/active").filter(isUsableArtifact));

  return candidates.some((file) => {
    const text = fs.readFileSync(file, "utf8");
    return hasFilledRationale(text);
  });
}

let mapping;
try {
  mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
} catch (error) {
  console.error(`FAIL: Could not parse ${mappingPath}: ${error.message}`);
  process.exit(1);
}

const entries = Array.isArray(mapping.mappings) ? mapping.mappings : [];
const docsNotNeeded = hasDocsNotNeededRationale();
const failures = [];

for (const entry of entries) {
  if (!entry.requiredOnChange) continue;

  const sourceGlob = entry.sourceGlob;
  const relatedDocs = Array.isArray(entry.relatedDocs) ? entry.relatedDocs : [];
  if (!sourceGlob || relatedDocs.length === 0) continue;

  const sourceRe = globToRegExp(sourceGlob.replace(/\\/g, "/"));
  const sourceChanged = changed.some((file) => sourceRe.test(file));
  if (!sourceChanged) continue;

  const relatedDocChanged = relatedDocs.some((doc) => changed.includes(doc));
  if (!relatedDocChanged && !docsNotNeeded) {
    failures.push({
      sourceGlob,
      relatedDocs,
      reason: entry.reason || "Mapped source changed without related docs."
    });
  }
}

if (failures.length > 0) {
  console.error("FAIL: Documentation freshness check failed.");
  for (const failure of failures) {
    console.error("");
    console.error(`Source changed: ${failure.sourceGlob}`);
    console.error(`Related docs: ${failure.relatedDocs.join(", ")}`);
    console.error(`Reason: ${failure.reason}`);
  }
  console.error("");
  console.error("Update related docs or add a docs-not-needed rationale to the active task artifact.");
  process.exit(1);
}

if (docsNotNeeded) {
  console.log("PASS: Documentation freshness check passed with docs-not-needed rationale.");
} else {
  console.log("PASS: Documentation freshness check passed.");
}
NODE

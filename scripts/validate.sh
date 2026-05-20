#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

failures=0

run_required() {
  local label="$1"
  shift

  echo "==> $label"
  if "$@"; then
    echo "PASS: $label"
  else
    echo "FAIL: $label"
    failures=$((failures + 1))
  fi
  echo
}

run_optional_executable() {
  local label="$1"
  local script="$2"

  if [ -x "$script" ]; then
    run_required "$label" "$script"
  else
    echo "SKIP: $label ($script is not executable or not present)"
    echo
  fi
}

echo "Production AI Development Flow validation"
echo

run_required "pnpm lint" pnpm lint
run_optional_executable "API boundary check" "$ROOT_DIR/scripts/check-api-boundary.sh"
run_optional_executable "Documentation freshness check" "$ROOT_DIR/scripts/check-docs-freshness.sh"

if [ "$failures" -gt 0 ]; then
  echo "Validation failed: $failures check(s) failed."
  exit 1
fi

echo "Validation passed."

#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

failures=0

report_failure() {
  local title="$1"
  local details="$2"

  echo "FAIL: $title"
  echo "$details"
  echo
  failures=$((failures + 1))
}

grep_client() {
  local pattern="$1"

  if [ -d src/features ] || [ -d src/shared/lib ]; then
    grep -RInE --include='*.ts' --include='*.tsx' "$pattern" src/features src/shared/lib 2>/dev/null || true
  fi
}

grep_src_outside_server_auth() {
  local pattern="$1"

  if [ -d src ]; then
    grep -RInE --include='*.ts' --include='*.tsx' "$pattern" src 2>/dev/null \
      | grep -Ev '^(src/app/api/|src/shared/server/|src/proxy\.ts:)' || true
  fi
}

echo "Checking API boundary..."
echo

matches="$(grep_client '/api/v1')"
if [ -n "$matches" ]; then
  report_failure "Client-side direct backend /api/v1 usage" "$matches"
fi

matches="$(grep_client 'NEXT_PUBLIC_API_BASE')"
if [ -n "$matches" ]; then
  report_failure "Client-side NEXT_PUBLIC_API_BASE backend usage" "$matches"
fi

matches="$(grep_client 'setAccessToken|BffAuthResponse|Authorization[[:space:]]*:[[:space:]]*[`'\''\"]?Bearer|headers\.set\([`'\''\"]Authorization[`'\''\"]')"
if [ -n "$matches" ]; then
  report_failure "Client-side token or bearer authorization pattern" "$matches"
fi

matches="$(grep_src_outside_server_auth '\baccessToken\b|\brefreshToken\b')"
if [ -n "$matches" ]; then
  report_failure "Token references outside server-side auth/BFF files" "$matches"
fi

if [ "$failures" -gt 0 ]; then
  echo "API boundary check failed: $failures issue(s) found."
  exit 1
fi

echo "PASS: API boundary check passed."

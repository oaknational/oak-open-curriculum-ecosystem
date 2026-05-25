#!/usr/bin/env bash
#
# probe-remote-mcp.sh
#
# Fast, unauthenticated post-deploy checks for a remote MCP HTTP deployment
# (Vercel preview or production). Replaces the retired `pnpm smoke:remote`
# harness for the baseline "is the deployment wired?" layer only.
#
# For authenticated agent-style checks (initialize, tools/list, orientation
# tool), use: pnpm smoke:agent-preview (see scripts/agent-preview-smoke.ts).
#
# Usage:
#   MCP_PROBE_BASE_URL=https://<host> pnpm probe:remote
#   pnpm probe:remote -- --base-url=https://<host>
#
# Optional:
#   MCP_PROBE_BEARER_TOKEN — if set, also POSTs initialize (expects 200).
#
# Exit codes:
#   0  all required checks passed
#   1  invalid arguments
#   2  network or assertion failure
#

set -euo pipefail

ACCEPT='application/json, text/event-stream'
base_url="${MCP_PROBE_BASE_URL:-}"
bearer_token="${MCP_PROBE_BEARER_TOKEN:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base-url=*) base_url="${1#*=}" ;;
    --base-url)   shift; base_url="$1" ;;
    -h|--help)
      sed -n '2,/^#$/p' "$0" | sed 's/^# \{0,1\}//' >&2
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
  shift
done

if [[ -z "$base_url" ]]; then
  echo "Missing base URL. Set MCP_PROBE_BASE_URL or pass --base-url=https://<host>" >&2
  exit 1
fi

base_url="${base_url%/}"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

headers_file="$tmpdir/headers.txt"
body_file="$tmpdir/body.txt"

pass() { echo "PASS: $*"; }
fail() { echo "FAIL: $*" >&2; exit 2; }

assert_status() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  if [[ "$actual" != "$expected" ]]; then
    fail "$label — expected HTTP $expected, got $actual"
  fi
  pass "$label (HTTP $actual)"
}

assert_header_contains() {
  local label="$1"
  local pattern="$2"
  if ! grep -qiE "$pattern" "$headers_file"; then
    echo "--- response headers ---" >&2
    cat "$headers_file" >&2
    fail "$label — header missing pattern: $pattern"
  fi
  pass "$label"
}

curl_quiet() {
  local method="$1"
  local path="$2"
  shift 2
  curl -sS -X "$method" "${base_url}${path}" \
    -D "$headers_file" \
    -o "$body_file" \
    -w '%{http_code}' \
    "$@"
}

echo "=== Remote MCP probe (unauthenticated baseline) ==="
echo "Base URL: $base_url"
echo "---"

# 1. Health
status="$(curl_quiet GET /healthz)"
assert_status 'GET /healthz' 200 "$status"

# 2. OAuth protected resource metadata
status="$(curl_quiet GET /.well-known/oauth-protected-resource)"
assert_status 'GET /.well-known/oauth-protected-resource' 200 "$status"
if ! grep -q 'resource' "$body_file" && ! grep -q 'authorization_servers' "$body_file"; then
  echo "--- body ---" >&2
  cat "$body_file" >&2
  fail 'OAuth PRM body missing resource or authorization_servers'
fi
pass 'OAuth PRM JSON shape'

# 3. MCP without auth must challenge
status="$(
  curl_quiet POST /mcp \
    -H "Content-Type: application/json" \
    -H "Accept: $ACCEPT" \
    --data-raw '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"probe-remote-mcp","version":"1.0.0"}}}'
)"
assert_status 'POST /mcp without Authorization' 401 "$status"
assert_header_contains 'WWW-Authenticate Bearer challenge' '^www-authenticate:.*Bearer'
assert_header_contains 'WWW-Authenticate resource_metadata' 'resource_metadata='

if [[ -n "$bearer_token" ]]; then
  echo "--- authenticated initialize (optional) ---"
  status="$(
    curl_quiet POST /mcp \
      -H "Content-Type: application/json" \
      -H "Accept: $ACCEPT" \
      -H "Authorization: Bearer ${bearer_token}" \
      --data-raw '{"jsonrpc":"2.0","id":2,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"probe-remote-mcp","version":"1.0.0"}}}'
  )"
  assert_status 'POST /mcp initialize with Bearer' 200 "$status"
  if ! grep -q '^data:' "$body_file"; then
    echo "--- body ---" >&2
    cat "$body_file" >&2
    fail 'Authenticated initialize — SSE data line missing'
  fi
  pass 'Authenticated initialize SSE payload'
fi

echo "---"
echo "All baseline checks passed."

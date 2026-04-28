#!/usr/bin/env bash
#
# probe-sentry-error-capture.sh
#
# Generate a deliberate error against the MCP HTTP server (preview or
# production) and emit the artefacts needed to verify it reaches
# Sentry's issues stream — under the expected release, with a stack
# trace symbolicated to TypeScript source lines, and with our
# correlation-id headers preserved.
#
# Why this exists:
#   The Phase 1 baseline probes (healthz, OAuth metadata, POST /mcp 401)
#   exercise the transactions stream. They do NOT exercise the
#   error-event path. A 401 is a deliberate control-flow output of the
#   auth middleware, not an unhandled exception. Without a real error
#   probe, we can prove transactions flow but cannot prove issues
#   reach Sentry — leaving observability incompletely validated.
#
# What it proves (when followed end-to-end):
#   1. Error events from the live deployment reach Sentry's issues
#      stream (closes the "is the error pipe wired?" gap).
#   2. Source-map / Debug-ID symbolication works (stack frames
#      resolve to TS source lines, not minified bundle).
#   3. Release attribution applies to error events too (not just
#      transactions).
#   4. Correlation headers (X-Correlation-Id, X-Probe-ID) reach
#      Sentry as event tags, enabling cross-system trace.
#
# Adaptation guide:
#   - Different deployment: pass --base-url=<url>.
#   - Two probe targets:
#       * --target=malformed-json (default): POST malformed JSON to
#         /mcp; relies on body-parser SyntaxError reaching the error
#         handler chain. Empirically captured under issue
#         OAK-OPEN-CURRICULUM-MCP-6 on 2026-04-26 — proves the error
#         pipe is wired but the stack trace shows third-party frames
#         only (raw-body / body-parser).
#       * --target=test-error: POST /test-error with shared-secret
#         auth and selectable mode (handled / unhandled / rejected).
#         Throws from APPLICATION code, so the resulting stack trace
#         frames include src/test-error/test-error-route.ts —
#         proving source-code upload + symbolication on the current
#         release. Requires TEST_ERROR_SECRET set in the deployed
#         env (see env.ts; production-forbidden by env-schema
#         super-refine).
#   - Different release name: the script auto-derives from the
#     branch-alias leftmost label per the BuildEnvSchema's
#     hostname-not-URL contract; override with --release=<name>.
#   - Production: pass --base-url=<prod-url>. Production releases use
#     the root-package semver pattern (per ADR-163), not the
#     branch-derived label — pass --release=<exact-name> in that case.
#     The test-error target is forbidden in production by env-schema
#     validation; only the malformed-json target works there.
#
# Outputs:
#   - stdout: probe transcript (URL, IDs, response, verification
#     hints)
#   - /tmp/probe-headers, /tmp/probe-body: raw response captures
#
# Exit codes:
#   0  probe sent successfully (Sentry verification is a separate
#      manual step using the printed hints)
#   1  invalid arguments
#   2  network error sending the probe
#

set -euo pipefail

# --- Defaults ---------------------------------------------------------

DEFAULT_BASE_URL="https://poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy"
PROBE_PAYLOAD='{this is deliberately malformed JSON to trigger a parse error'

# --- Argument parsing -------------------------------------------------

base_url="$DEFAULT_BASE_URL"
release_name=""
probe_id_override=""
target="malformed-json"
mode="handled"
secret="${TEST_ERROR_SECRET:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base-url=*) base_url="${1#*=}" ;;
    --base-url)   shift; base_url="$1" ;;
    --release=*)  release_name="${1#*=}" ;;
    --release)    shift; release_name="$1" ;;
    --probe-id=*) probe_id_override="${1#*=}" ;;
    --probe-id)   shift; probe_id_override="$1" ;;
    --target=*)   target="${1#*=}" ;;
    --target)     shift; target="$1" ;;
    --mode=*)     mode="${1#*=}" ;;
    --mode)       shift; mode="$1" ;;
    --secret=*)   secret="${1#*=}" ;;
    --secret)     shift; secret="$1" ;;
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

case "$target" in
  malformed-json|test-error) ;;
  *)
    echo "Invalid --target: $target (expected: malformed-json | test-error)" >&2
    exit 1
    ;;
esac

case "$mode" in
  handled|unhandled|rejected) ;;
  *)
    echo "Invalid --mode: $mode (expected: handled | unhandled | rejected)" >&2
    exit 1
    ;;
esac

if [[ "$target" == "test-error" && -z "$secret" ]]; then
  echo "--target=test-error requires --secret=<value> or TEST_ERROR_SECRET in env" >&2
  exit 1
fi

# Derive release name from base URL leftmost label if not provided.
if [[ -z "$release_name" ]]; then
  host="${base_url#https://}"
  host="${host#http://}"
  host="${host%%/*}"
  release_name="${host%%.*}"
fi

probe_id="${probe_id_override:-probe-$(date -u +%Y%m%dT%H%M%SZ)-$(uuidgen 2>/dev/null | head -c 8)}"
sent_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# --- Probe execution --------------------------------------------------

echo "=== Sentry error-capture probe ==="
echo "Base URL:      $base_url"
echo "Target:        $target"
echo "Mode:          $mode"
echo "Release name:  $release_name"
echo "Probe ID:      $probe_id"
echo "Sent at:       $sent_at"
echo "---"

if [[ "$target" == "malformed-json" ]]; then
  echo "Payload:       $PROBE_PAYLOAD"
  echo "---"
  curl_output="$(
    curl -sS -X POST "$base_url/mcp" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json, text/event-stream" \
      -H "X-Probe-ID: $probe_id" \
      -D /tmp/probe-headers \
      -o /tmp/probe-body \
      -w "status=%{http_code} time=%{time_total}s\n" \
      --data-raw "$PROBE_PAYLOAD" \
      || { echo "curl failed" >&2; exit 2; }
  )"
else
  # target=test-error
  echo "Endpoint:      POST /test-error?mode=$mode&token=$probe_id"
  echo "---"
  curl_output="$(
    curl -sS -X POST "$base_url/test-error?mode=$mode&token=$probe_id" \
      -H "Content-Type: application/json" \
      -H "X-Probe-ID: $probe_id" \
      -H "X-Test-Error-Secret: $secret" \
      -D /tmp/probe-headers \
      -o /tmp/probe-body \
      -w "status=%{http_code} time=%{time_total}s\n" \
      --data-raw "{}" \
      || { echo "curl failed" >&2; exit 2; }
  )"
fi

echo "$curl_output"
echo "---"
echo "Response headers (correlation/auth-related):"
grep -iE "(x-correlation-id|x-vercel-id|x-clerk-auth|content-type|www-authenticate)" /tmp/probe-headers || true
echo "---"
echo "Response body:"
cat /tmp/probe-body
echo
echo "---"

# --- Verification hints ----------------------------------------------

cat <<EOF

Verification (run after waiting ~60-120 seconds for Sentry ingestion):

1. Sentry MCP — search the issues stream for events linked to this probe:

   search_issues(naturalLanguageQuery='issues in release ${release_name} from the last 10 minutes')
   search_events(naturalLanguageQuery='errors in release ${release_name} with X-Probe-ID ${probe_id} in last 10 minutes')

2. Sentry web UI — direct link with release scope and time window:

   https://oak-national-academy.sentry.io/issues/?query=release%3A${release_name}&statsPeriod=15m
   https://oak-national-academy.sentry.io/explore/discover/homepage/?dataset=errors&query=release%3A${release_name}&statsPeriod=15m

3. Verification checklist (record in the substrate plan §Phase 2 findings):

   [ ] Event appears in the issues stream (proves error path wired)
   [ ] Event tagged with release: ${release_name}
   [ ] Event tagged with git.commit.sha matching the deployed HEAD
   [ ] Environment tag = "preview" (or "production" if probing prod)
   [ ] Trace correlation: traceId/spanId set, sampled=true
   [ ] Cloud context: Vercel region present
   [ ] HTTP request context: method, URL, body captured
   [ ] (target=test-error only) Stack trace includes
       "src/test-error/test-error-route.ts" with line/column AND
       rendered source-line context — proves source-code upload
       and TS-source symbolication on the current release.
   [ ] (target=malformed-json) Stack trace shows third-party
       frames only (raw-body / body-parser); use --target=test-error
       to validate application-source symbolication.

If --target=malformed-json shows no issue event after 2 minutes:
the body-parser 400 may be filtered by Sentry's shouldHandleError
default. Switch to --target=test-error --mode=unhandled (5xx path).

EOF

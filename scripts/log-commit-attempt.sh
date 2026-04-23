#!/usr/bin/env bash
#
# scripts/log-commit-attempt.sh
#
# Append a one-line TSV record to the commit-attempts diagnostic log.
# Used to track `git commit` outcomes across sessions on this machine
# so we can spot hook-timing, output-truncation, and environment-quirk
# patterns over time.
#
# Usage:
#   scripts/log-commit-attempt.sh OUTCOME ELAPSED SHA MODE SUBJECT [NOTE]
#
# Fields:
#   OUTCOME   ok | fail | truncated | interrupted
#             - ok          → commit landed (sha present)
#             - fail        → hook genuinely failed (rc != 0, real error)
#             - truncated   → tool reports rc != 0 but no commit landed
#                             AND hook output was visibly cut off
#                             (a Shell-tool / stream-handover artefact,
#                             not a hook-substance failure)
#             - interrupted → user or tool interrupted before completion
#   ELAPSED   integer seconds (use "-" if unknown).
#   SHA       short commit sha (or "-" if no commit landed).
#   MODE      short free-form string describing invocation pattern,
#             e.g. heredoc-stream, heredoc-fileout, -m-stream,
#             -m-fileout. Helps correlate truncation with invocation.
#   SUBJECT   commit message subject (truncated to 80 chars).
#   NOTE      optional free-form short note (default: "-").
#
# Log path: .agent/memory/operational/diagnostics/commit-attempts.log
# (gitignored — local-only long-term diagnostic trace).
#
# Cross-machine generalisation of patterns observed in the log goes
# through the napkin / pattern library, not through tracking the log
# in git.

set -euo pipefail

if [ $# -lt 5 ]; then
  cat >&2 <<'EOM'
Usage: scripts/log-commit-attempt.sh OUTCOME ELAPSED SHA MODE SUBJECT [NOTE]

OUTCOME : ok | fail | truncated | interrupted
ELAPSED : integer seconds (or "-")
SHA     : short commit sha (or "-")
MODE    : free-form short string (heredoc-stream, heredoc-fileout, ...)
SUBJECT : commit message subject (truncated to 80 chars)
NOTE    : optional free-form short note
EOM
  exit 2
fi

outcome=$1
elapsed=$2
sha=$3
mode=$4
subject=$5
note=${6:-"-"}

case "$outcome" in
  ok | fail | truncated | interrupted) ;;
  *)
    printf 'log-commit-attempt: invalid OUTCOME %q (expected ok|fail|truncated|interrupted)\n' "$outcome" >&2
    exit 2
    ;;
esac

repo_root="$(git rev-parse --show-toplevel)"
log_dir="$repo_root/.agent/memory/operational/diagnostics"
log_file="$log_dir/commit-attempts.log"
mkdir -p "$log_dir"

if [ ! -s "$log_file" ]; then
  {
    printf '# Commit attempt diagnostic log — TSV, append-only.\n'
    printf '# Columns: timestamp\toutcome\telapsed_s\tsha\tmode\tsubject\tnote\n'
    printf '# outcome: ok|fail|truncated|interrupted\n'
    printf '# Append via: scripts/log-commit-attempt.sh OUTCOME ELAPSED SHA MODE "SUBJECT" [NOTE]\n'
  } >"$log_file"
fi

# Strip TAB and newline from free-form fields so the TSV stays one line per record.
subject="$(printf '%s' "$subject" | tr '\t\n' '  ' | cut -c1-80)"
note="$(printf '%s' "$note" | tr '\t\n' '  ' | cut -c1-80)"

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$ts" "$outcome" "$elapsed" "$sha" "$mode" "$subject" "$note" >>"$log_file"
printf 'logged: %s %s elapsed=%ss sha=%s mode=%s\n' "$ts" "$outcome" "$elapsed" "$sha" "$mode"

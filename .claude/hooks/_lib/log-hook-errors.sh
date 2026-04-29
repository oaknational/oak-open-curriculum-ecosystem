#!/usr/bin/env bash
# Wrap a hook command so non-zero exits and stderr are persisted to a log file.
#
# Hooks declared as non-blocking in .claude/settings.json fail silently: the
# harness records hook_non_blocking_error in the session JSONL but does not
# surface the error to the assistant or to any terminal-visible surface. This
# wrapper makes those failures auditable by appending to .claude/logs/hook-errors.log
# whenever the wrapped command exits non-zero.
#
# Usage in settings.json:
#   "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh \
#               ${CLAUDE_PROJECT_DIR}/.claude/hooks/<your>/<script>.sh"
#
# Stdin (the hook payload from Claude Code) is passed through unchanged.
# Stdout (any hook decision JSON) is passed through unchanged.
# Stderr is captured to the log on failure AND re-emitted so the harness's
# own session log still receives it.

set -u

project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
log_dir="${project_dir}/.claude/logs"
log_file="${log_dir}/hook-errors.log"

mkdir -p "$log_dir"
touch "$log_file"

stderr_capture="$(mktemp)"
trap 'rm -f "$stderr_capture"' EXIT

"$@" 2>"$stderr_capture"
ec=$?

if [[ "$ec" -ne 0 ]]; then
  {
    printf '[%s] hook-error\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf '  exit:    %d\n' "$ec"
    printf '  cmd:     %s\n' "$*"
    printf '  cwd:     %s\n' "$PWD"
    printf '  project: %s\n' "$project_dir"
    if [[ -s "$stderr_capture" ]]; then
      printf '  stderr:\n'
      sed 's/^/    /' "$stderr_capture"
    fi
    printf '\n'
  } >> "$log_file"
fi

# Re-emit captured stderr so the harness still records it.
if [[ -s "$stderr_capture" ]]; then
  cat "$stderr_capture" >&2
fi

exit "$ec"

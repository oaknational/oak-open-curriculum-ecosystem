#!/usr/bin/env bash
#
# scripts/check-commit-message.sh
#
# Test a commit message against this repo's commitlint configuration in
# isolation from the rest of the pre-commit / commit-msg hook chain.
#
# Mirrors `git commit`'s message intake:
#   -m <msg>     One paragraph (subject; or a body paragraph). Repeat to
#                add more paragraphs (joined by blank lines, identical to
#                `git commit -m … -m …`).
#   -F <file>    Read the message from <file>. Use `-F -` to read from
#                stdin (matches `git commit -F -`).
#   (no flags)   Read the message from stdin.
#
# Examples:
#   ./scripts/check-commit-message.sh -m "feat(scope): subject"
#   ./scripts/check-commit-message.sh -m "feat(scope): subject" -m "body"
#   ./scripts/check-commit-message.sh -F .git/COMMIT_EDITMSG
#   ./scripts/check-commit-message.sh -F - <<'EOF'
#   feat(scope): subject
#
#   body paragraph
#   EOF
#
# Exit codes:
#   0   message conforms to the active commitlint config
#   1   message violates the active commitlint config
#   2   invalid usage / unreadable input

set -euo pipefail

usage() {
  cat >&2 <<'EOM'
Usage: scripts/check-commit-message.sh [-m <msg>]... [-F <file>]

Test a commit message against this repo's commitlint configuration in
isolation from the rest of the pre-commit / commit-msg hook chain.

Message intake (mirrors `git commit`):
  -m <msg>     One paragraph. Repeat to add more paragraphs, joined by
               blank lines (identical to `git commit -m … -m …`).
  -F <file>    Read the message from <file>. Use `-F -` for stdin.
  (no flags)   Read the message from stdin.

`-m` and `-F` are mutually exclusive (matches `git commit`).

Exit codes:
  0  conforms; 1  violates; 2  invalid usage.
EOM
  exit 2
  return 2
}

msgs=()
file=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m)
      [[ $# -ge 2 ]] || usage
      msgs+=("$2")
      shift 2
      ;;
    -F)
      [[ $# -ge 2 ]] || usage
      file="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      printf 'check-commit-message: unknown argument: %s\n' "$1" >&2
      usage
      ;;
  esac
done

if [[ -n "$file" && ${#msgs[@]} -gt 0 ]]; then
  echo "check-commit-message: -m and -F are mutually exclusive (matches git commit)." >&2
  exit 2
fi

tmp="$(mktemp -t commitlint-check.XXXXXX)"
trap 'rm -f "$tmp"' EXIT INT TERM HUP

if [[ ${#msgs[@]} -gt 0 ]]; then
  printf '%s' "${msgs[0]}" >"$tmp"
  for ((i = 1; i < ${#msgs[@]}; i++)); do
    printf '\n\n%s' "${msgs[i]}" >>"$tmp"
  done
  printf '\n' >>"$tmp"
elif [[ -n "$file" ]]; then
  if [[ "$file" = "-" ]]; then
    cat >"$tmp"
  else
    [[ -r "$file" ]] || {
      printf 'check-commit-message: cannot read file: %s\n' "$file" >&2
      exit 2
    }
    cat "$file" >"$tmp"
  fi
else
  if [[ -t 0 ]]; then
    echo "check-commit-message: no message provided (no -m, no -F, stdin is a TTY)." >&2
    usage
  fi
  cat >"$tmp"
fi

# Run commitlint from the repo root so it picks up the canonical
# commitlint.config.mjs. Use `pnpm dlx commitlint` to mirror the
# .husky/commit-msg hook exactly.
#
# We deliberately do NOT `exec` here — the EXIT trap above must run
# so the temp file is cleaned up regardless of commitlint's exit code.
repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"
pnpm dlx commitlint --edit "$tmp"

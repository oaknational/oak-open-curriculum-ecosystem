# Seat instruments conserved at a model-change boundary (Zephyr guards Leeward, 2026-09-23)

Sixteen shell scripts that this seat kept in its session scratchpad between 2026-09-19 and
2026-09-21 and ran many times: the shared-checkout commit ceremony, the pull-request lifecycle
wrappers, the thread-reply instrument that refuses a disposition without a bar marker and a
signature, the coordination fold and successor cut, and the six-state observation of the
operator-profile module. A session scratchpad does not survive a session, and the owner
changed models at this boundary, so the bytes are conserved here verbatim.

This is a record, not tooling. Nothing here is on any path, tested, or reviewed; each script
hard-codes this seat's name, identity id, session prefix and platform and model labels, which a
successor must replace with its own. Where a script wraps a built command, the built command
is the authority (`use-built-agent-tools-cli`). Landing any of them in `agent-tools` is a lane
under the shared definition, with its own review; this record exists so that lane starts from
the instruments that worked rather than from memory.

Conventions every script shares: run from the repository root of the checkout being acted on;
the bot's minted token is read inside the script and never printed; one plain command per
step; refusal stops the script at the first failure. `commit-ceremony-traced.sh` is the plain
ceremony plus a trace line after every step; the plain form is that script with the `trace`
calls removed.

## commit-ceremony-traced.sh

```sh
#!/bin/sh
# Diagnostic copy of commit-ceremony.sh: identical steps, with the staged count and the index's
# modification time printed after every step, so a vanishing staged set is located to one step.
# Usage: commit-ceremony-traced.sh <files-list-file> <message-file>. Run from the repository root.
set -eu
LIST="$1"
MSG="$2"
AGENT="Zephyr guards Leeward"
ID=5180aeb6-f2dc-5adc-a63b-35b0df423031
SUBJECT="$(head -1 "$MSG")"
FILE_ARGS=""
while IFS= read -r f; do
  [ -n "$f" ] && FILE_ARGS="$FILE_ARGS --file $f"
done < "$LIST"
trace() {
  COUNT="$(/usr/bin/git diff --cached --no-renames --name-only | wc -l | tr -d ' ')"
  MTIME="$(stat -f '%Sm' -t '%H:%M:%S' .git/index)"
  echo "trace after $1: staged=$COUNT index-mtime=$MTIME now=$(date +%H:%M:%S)"
}
trace "start"
CLAIM="$(pnpm --silent agent-tools collaboration-state -- claims open --active .agent/state/collaboration/active-claims.json --thread estate-coordination --area-kind git --area-pattern index/head --intent "Commit window: $SUBJECT" --platform claude-code --model claude-opus-5 --ttl-seconds 3600 | sed -n 's/^  "claim_id": "\(.*\)",$/\1/p')"
echo "claim=$CLAIM"
trace "claims open"
# shellcheck disable=SC2086
INTENT="$(pnpm --silent agent-tools:commit-queue -- enqueue --claim-id "$CLAIM" --agent-name "$AGENT" --platform claude-code --model claude-opus-5 --session-id-prefix 281e44 --id "$ID" --commit-subject "$SUBJECT" $FILE_ARGS | tail -1)"
echo "intent=$INTENT"
trace "enqueue"
pnpm --silent agent-tools:commit-queue -- phase --intent-id "$INTENT" --phase staging > /dev/null
trace "phase staging"
# shellcheck disable=SC2086
pnpm --silent agent-tools:commit-queue -- guard --agent-name "$AGENT" --platform claude-code --model claude-opus-5 --session-id-prefix 281e44 --id "$ID" $FILE_ARGS > /dev/null
trace "guard"
# shellcheck disable=SC2046
git -c core.fsmonitor=false add -- $(cat "$LIST")
trace "git add"
pnpm --silent agent-tools:commit-queue -- record-staged --intent-id "$INTENT" > /dev/null
trace "record-staged"
if pnpm --silent agent-tools:commit-queue -- commit --intent-id "$INTENT" --message-file "$MSG" > "$MSG.log" 2>&1; then
  echo "committed $(git rev-parse --short HEAD): $(git log -1 --format=%s)"
else
  trace "refused commit"
  echo "COMMIT REFUSED — read $MSG.log; claim $CLAIM left open"
  exit 1
fi
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
pnpm --silent agent-tools collaboration-state -- claims close --claim-id "$CLAIM" --now "$NOW" --summary "Committed $(git rev-parse --short HEAD): $SUBJECT" --platform claude-code --model claude-opus-5 > /dev/null
echo "claim closed"
```

## reply-threads.sh

```sh
#!/usr/bin/env bash
# Reply to review threads on a pull request with their dispositions, as the bot.
# Usage: reply-threads.sh <pr> <sha> <comment-id> <disposition-file> [<comment-id> <disposition-file> ...]
#
# REFUSES the whole batch, before any token is minted or anything is posted, unless EVERY
# disposition meets pr-lifecycle's recorded-field contract:
#   - it OPENS with the bar marker: a bold span whose entire text is an optional scope prefix
#     ("In scope," / "Out of scope,"), then exactly Over-bar or Below-bar, then an optional
#     "on prong one" / "on prong two", then an optional full stop;
#   - its FINAL line begins with an em dash and ends with the seat's (<six hex>) prefix.
# A finding with no bar verdict never reaches a pull request from this seat again
# (2026-09-21: six rebudgets in six hours, no reply all day carried a marker).
# Dispositions are files, never arguments: no shell-quoting hazards, and the text is reviewable.
set -euo pipefail
pr="$1"; sha="$2"; shift 2
repo="EngraphCode/open-curriculum-ecosystem"
marker='^\*\*((In|Out of) scope, )?(Over|Below)-bar( on prong (one|two))?\.?\*\*'
signature='^—.*\([0-9a-f]{6}(-[0-9a-fA-F]{3})?\)$'

pairs=("$@")
if [ "${#pairs[@]}" -eq 0 ] || [ $(( ${#pairs[@]} % 2 )) -ne 0 ]; then
  echo "usage: reply-threads.sh <pr> <sha> <comment-id> <disposition-file> ..." >&2
  exit 2
fi

refused=0
for (( i = 0; i < ${#pairs[@]}; i += 2 )); do
  id="${pairs[i]}"; file="${pairs[i+1]}"
  if [ ! -f "$file" ]; then
    echo "REFUSED $id: no such disposition file: $file" >&2; refused=1; continue
  fi
  first="$(grep -v '^[[:space:]]*$' "$file" | head -n 1)"
  last="$(grep -v '^[[:space:]]*$' "$file" | tail -n 1)"
  if ! printf '%s' "$first" | grep -Eiq "$marker"; then
    echo "REFUSED $id: the reply does not OPEN with a bar marker (**Over-bar** / **Below-bar**)" >&2
    refused=1
  fi
  if ! printf '%s' "$last" | grep -Eq "$signature"; then
    echo "REFUSED $id: the final line is not signed (— … (<six hex>))" >&2
    refused=1
  fi
done
if [ "$refused" -ne 0 ]; then
  echo "nothing posted: every finding gets a bar verdict and a signature before it is answered" >&2
  exit 3
fi

token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
for (( i = 0; i < ${#pairs[@]}; i += 2 )); do
  id="${pairs[i]}"; file="${pairs[i+1]}"
  GH_TOKEN="$token" gh api -X POST "repos/$repo/pulls/$pr/comments/$id/replies" -F body=@"$file" --jq '.id' \
    | sed "s/^/replied to $id as comment /"
done
echo "replies posted for PR #$pr at $sha"
```

## fold-merge.sh

```sh
#!/usr/bin/env bash
# coordination-fold step 4: merge the base INTO the live coordination branch.
# The ref is resolved to a full sha, the message is written AFTER resolving (from the real log),
# and that sha is merged — all in one call, because a remote-tracking ref moves whenever any
# hook or seat fetches. Usage: fold-merge.sh <base-branch>   (run from the primary checkout)
set -euo pipefail
base="$1"
msg="$(mktemp "${TMPDIR:-/tmp}/fold-merge.XXXXXX")"
git fetch origin "$base"
sha="$(git rev-parse "origin/$base")"
head="$(git rev-parse HEAD)"
if [ "$(git merge-base "$head" "$sha")" = "$sha" ]; then
  echo "nothing to merge: origin/$base ($sha) is already contained in HEAD"; exit 0
fi
{
  # The subject names the branch it is run on: this script also syncs code branches behind a
  # moved base, and a fixed "coordination branch for the fold" wording was false there once.
  echo "chore(practice): merge $base at ${sha:0:9} into $(git rev-parse --abbrev-ref HEAD | cut -c1-44)"
  echo
  echo "The base's commits this branch did not yet carry, read after resolving the ref:"
  echo
  git log --format='%h %s' "$head..$sha" | cut -c1-96
  echo
  echo "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
} > "$msg"
echo "merging origin/$base at $sha"
git merge --no-ff -F "$msg" "$sha"
echo "merged: $(git log --oneline -1)"
```

## cut-successor.sh

```sh
#!/usr/bin/env bash
# Cut the successor coordination branch (coordination-fold step 9 / cut-coordination-branch):
# fetch, resolve post-fold origin/engraph ONCE, pass the same full sha to the mint and the cut.
# Tree-preserving (git switch -c). No push here.
set -euo pipefail
git fetch origin engraph
BASE="$(git rev-parse origin/engraph)"
NAME="$(pnpm --silent agent-tools coordination successor-name --base "$BASE")"
echo "base $BASE"
echo "name $NAME"
git switch -c "$NAME" "$BASE"
echo "cut: $(git rev-parse --abbrev-ref HEAD) at $(git rev-parse --short=9 HEAD)"
```

## resolve-threads.sh

```sh
#!/usr/bin/env bash
# Resolve every unresolved review thread on a pull request, as the bot. Usage: resolve-threads.sh <pr>
set -euo pipefail
pr="$1"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
ids="$(GH_TOKEN="$token" gh api graphql -F n="$pr" -f query='query($n:Int!){repository(owner:"EngraphCode",name:"open-curriculum-ecosystem"){pullRequest(number:$n){reviewThreads(first:100){nodes{id isResolved}}}}}' --jq '.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved|not) | .id')"
for id in $ids; do
  GH_TOKEN="$token" gh api graphql -f id="$id" -f query='mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{isResolved}}}' --jq '.data.resolveReviewThread.thread.isResolved' | sed "s/^/resolved $id: /"
done
echo "threads resolved on PR #$pr"
```

## unresolve-thread.sh

```sh
#!/usr/bin/env bash
# Unresolve ONE review thread on a pull request, as the bot. Usage: unresolve-thread.sh <thread-id>
set -euo pipefail
id="$1"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
GH_TOKEN="$token" gh api graphql -f id="$id" -f query='mutation($id:ID!){unresolveReviewThread(input:{threadId:$id}){thread{isResolved}}}' --jq '.data.unresolveReviewThread.thread.isResolved' | sed "s/^/isResolved after unresolve $id: /"
```

## pr-create-draft.sh

```sh
#!/usr/bin/env bash
# Open a DRAFT pull request under the bot identity. Usage: pr-create-draft.sh <head-branch> <title> <body-file>
# The token is minted into the environment of one gh call and never printed.
set -euo pipefail
head="$1"
title="$2"
body="$3"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
GH_TOKEN="$token" gh pr create --draft --base engraph --head "$head" --title "$title" --body-file "$body"
```

## pr-ready.sh

```sh
#!/usr/bin/env bash
# Mark a draft pull request ready for review under the bot identity. Usage: pr-ready.sh <pr-number>
# The token is minted into the environment of one gh call and never printed.
set -euo pipefail
pr="$1"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
GH_TOKEN="$token" gh pr ready "$pr"
echo "PR #$pr marked ready"
```

## pr-rest-merge.sh

```sh
#!/usr/bin/env bash
# Land a docs-only bot-authored pull request through the sanctioned REST endpoint as the bot
# (pr-lifecycle §merge boundary item 5, the owner's 2026-09-03 class): merge commit, the head
# sha FETCHED here and pinned in the body, never squash. Usage: pr-rest-merge.sh <pr-number>
# The token is minted into the environment of the gh calls and never printed.
set -euo pipefail
pr="$1"
repo="EngraphCode/open-curriculum-ecosystem"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-merge)"
head="$(GH_TOKEN="$token" gh api "repos/$repo/pulls/$pr" --jq '.head.sha')"
mergeable="$(GH_TOKEN="$token" gh api "repos/$repo/pulls/$pr" --jq '.mergeable')"
headref="$(GH_TOKEN="$token" gh api "repos/$repo/pulls/$pr" --jq '.head.ref')"
echo "PR #$pr head $head ($headref) mergeable=$mergeable"
GH_TOKEN="$token" gh api -X PUT "repos/$repo/pulls/$pr/merge" \
  -f merge_method=merge -f sha="$head" \
  -f commit_title="Merge pull request #$pr from EngraphCode/$headref" \
  --jq '{merged, sha, message}'
```

## pr-body-edit.sh

```sh
#!/usr/bin/env bash
# Edit a pull request's body under the bot identity. Usage: pr-body-edit.sh <pr-number> <body-file>
# The token is minted into the environment of one gh call and never printed.
set -euo pipefail
pr="$1"
body="$2"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
GH_TOKEN="$token" gh pr edit "$pr" --body-file "$body"
echo "edited PR #$pr body from $body"
```

## pr-comment.sh

```sh
#!/usr/bin/env bash
# Post an issue comment on a pull request as the bot. Usage: pr-comment.sh <pr-number> <body>
# The token is minted into the environment of one gh call and never printed.
set -euo pipefail
pr="$1"; body="$2"
repo="EngraphCode/open-curriculum-ecosystem"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
GH_TOKEN="$token" gh api -X POST "repos/$repo/issues/$pr/comments" -f body="$body" --jq '"comment \(.id) posted at \(.created_at)"'
```

## pr-request-copilot.sh

```sh
#!/usr/bin/env bash
# Request the Copilot review leg on a pull request as the bot (pr-lifecycle §merge boundary
# item 5: the leg is the bot's own to obtain). Usage: pr-request-copilot.sh <pr-number>
# The token is minted into the environment of one gh call and never printed.
set -euo pipefail
pr="$1"
repo="EngraphCode/open-curriculum-ecosystem"
token="$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work)"
GH_TOKEN="$token" gh api -X POST "repos/$repo/pulls/$pr/requested_reviewers" \
  -f 'reviewers[]=copilot-pull-request-reviewer[bot]' --jq '"requested: \(.requested_reviewers | map(.login) | join(","))"'
echo "Copilot leg requested on PR #$pr (verify on the timeline: review_requested)"
```

## wt-install-build.sh

```sh
#!/usr/bin/env bash
# Fresh-worktree setup (shared start-right §8): install, then build. Usage: wt-install-build.sh <worktree>
set -euo pipefail
cd "$1"
pnpm install --frozen-lockfile
pnpm build
echo "WORKTREE READY: $1"
```

## merge-engraph.sh

```sh
#!/usr/bin/env bash
# Merge origin/engraph INTO the current coordination branch (coordination-fold step 4):
# resolve the ref to a full sha in this same run, write the message AFTER resolving from
# git log <head>..<sha>, then merge that sha with --no-ff. No push here.
set -euo pipefail
branch="$(git rev-parse --abbrev-ref HEAD)"
head="$(git rev-parse HEAD)"
sha="$(git rev-parse origin/engraph)"
short="$(git rev-parse --short=9 "$sha")"
prs="$(git log --oneline "$head..$sha" | grep -o 'Merge pull request #[0-9]*' | grep -o '#[0-9]*' | sort -t'#' -k2 -n | tr '\n' ' ' | sed 's/ $//')"
msgfile="$(mktemp)"
{
  printf 'Merge engraph %s into %s\n\n' "$short" "$branch"
  printf 'Carries the pull requests landed on engraph since the last merge: %s.\n' "$prs"
  printf 'Resolved and written in the same run as the merge (coordination-fold step 4).\n'
} > "$msgfile"
echo "merging $short into $branch; pull requests: $prs"
git merge --no-ff "$sha" -F "$msgfile"
echo "merged: $(git rev-parse --short=9 HEAD)"
```

## parity-before-cure.sh

```sh
#!/usr/bin/env bash
# For every file a sibling commit touched, say whether THIS tree's HEAD copy is byte-identical to
# the sibling's PRE-cure version (the commit's parent) — the condition for its diff to apply as a
# patch. Read-only. Usage: parity-before-cure.sh <sibling-root> <sibling-commit>
set -u
sib="$1"; c="$2"
git -C "$sib" diff --name-only "$c^" "$c" | while read -r p; do
  if ! git -C "$sib" cat-file -e "$c^:$p" 2>/dev/null; then
    echo "NEW-IN-CURE $p"
  elif ! git cat-file -e "HEAD:$p" 2>/dev/null; then
    echo "ABSENT-HERE $p"
  elif git -C "$sib" show "$c^:$p" | cmp -s - <(git show "HEAD:$p"); then
    echo "IDENTICAL   $p"
  else
    echo "DIFFERS     $p"
  fi
done
```

## observe-profile.sh

```sh
#!/usr/bin/env bash
# The seat's observation (approved plan, step 3): run the operator-profile check, pull and push
# over a DISPOSABLE PRACTICE_HOME and a throwaway local bare remote, in five states. Every
# command is echoed with its output and exit code. The operator's real profile is never
# reached: PRACTICE_HOME is set for every call (set -u refuses an unset one) and no --root is
# passed. Usage: observe-profile.sh <worktree> <fresh-output-dir>
set -uo pipefail
wt="$1"; out="$2"
mkdir -p "$out"
rec="$out/record.txt"
: > "$rec"
check="agent-tools/src/validators/operator-profile/validate-operator-profile.ts"
sync="agent-tools/src/validators/operator-profile/operator-profile-sync.ts"

say() { printf '%s\n' "$*" | tee -a "$rec"; }
run() { # run <PRACTICE_HOME> <label> <cmd...>
  local home="$1"; shift; local label="$1"; shift
  say "\$ [$label] $*"
  ( cd "$wt" && PRACTICE_HOME="$home" "$@" ) >> "$rec" 2>&1
  say "exit=$?"
}
gitq() { git -C "$1" -c user.name="Observation" -c user.email="observation@example.invalid" \
  -c commit.gpgsign=false "${@:2}" >> "$rec" 2>&1; }

index_doc() { cat <<'DOC'
---
practice_profile: operator-profile
schema_version: 1
kind: index
updated: 2026-09-14
ratified: false
seeded_by: "Observation"
---

# Operator profile

- The working mode is mutual respect and trust.
DOC
}

machine_doc() { cat <<'DOC'
---
practice_profile: operator-profile
schema_version: 1
kind: machine
machine_key: other-box
updated: 2026-09-14
ratified: true
---

# Machine: other-box

- Written from another clone.
DOC
}

seed() { # seed <home> <remote>: a conforming profile repository pushed to a bare remote
  local home="$1" remote="$2"
  mkdir -p "$home/profile"
  git init -q --bare "$remote"
  git init -q -b main "$home/profile"
  git -C "$home/profile" config user.name "Observation"
  git -C "$home/profile" config user.email "observation@example.invalid"
  git -C "$home/profile" config commit.gpgsign false
  index_doc > "$home/profile/index.md"
  gitq "$home/profile" add index.md
  gitq "$home/profile" commit -q -m "seed"
  gitq "$home/profile" remote add origin "$remote"
  gitq "$home/profile" push -q -u origin main
}
remote_head() { say "remote main: $(git -C "$1" rev-parse --short main 2>&1) — $(git -C "$1" log -1 --format=%s main 2>&1)"; }

say "=== STATE 1: no profile at all"
h1="$out/s1-home"; mkdir -p "$h1"
run "$h1" check pnpm exec tsx "$check"
run "$h1" pull pnpm exec tsx "$sync" pull
run "$h1" push pnpm exec tsx "$sync" push --message "observation"

say "=== STATE 2: a conforming profile, a repository with a remote; one ratified write pushed"
h2="$out/s2-home"; r2="$out/s2-remote.git"; seed "$h2" "$r2"
run "$h2" check pnpm exec tsx "$check"
run "$h2" check-emit pnpm exec tsx "$check" --emit index.md
run "$h2" pull pnpm exec tsx "$sync" pull
printf '%s\n' '- A second line, written on the operator'"'"'s word.' >> "$h2/profile/index.md"
run "$h2" push pnpm exec tsx "$sync" push --message "observation: one write"
remote_head "$r2"
say "local status: $(git -C "$h2/profile" status --short | tr '\n' ' ')"

say "=== STATE 3: a credential-shaped line in the index"
h3="$out/s3-home"; r3="$out/s3-remote.git"; seed "$h3" "$r3"
printf '%s\n' '- password: observation-not-a-secret' >> "$h3/profile/index.md"
run "$h3" check pnpm exec tsx "$check"
run "$h3" push pnpm exec tsx "$sync" push --message "observation: must be refused"
remote_head "$r3"
say "local status: $(git -C "$h3/profile" status --short | tr '\n' ' ')"
say "echo test: record mentions the value? $(grep -c 'observation-not-a-secret' "$rec") occurrence(s) beyond this script's own seeding (expected 0)"

say "=== STATE 4: the index is a symlink to a file outside the root (a swap BETWEEN check and read cannot be staged from a shell; this is the at-rest form)"
h4="$out/s4-home"; r4="$out/s4-remote.git"; seed "$h4" "$r4"
index_doc > "$out/s4-outside.md"
rm "$h4/profile/index.md"
ln -s "$out/s4-outside.md" "$h4/profile/index.md"
run "$h4" check pnpm exec tsx "$check"
run "$h4" check-emit pnpm exec tsx "$check" --emit index.md
run "$h4" push pnpm exec tsx "$sync" push --message "observation: a symlinked document"
remote_head "$r4"
say "local status: $(git -C "$h4/profile" status --short | tr '\n' ' ')"

say "=== STATE 5: unpushed local commit, an uncommitted edit, and a remote advanced by another clone"
h5="$out/s5-home"; r5="$out/s5-remote.git"; seed "$h5" "$r5"
git clone -q "$r5" "$out/s5-other" >> "$rec" 2>&1
mkdir -p "$out/s5-other/machines"
machine_doc > "$out/s5-other/machines/other-box.md"
gitq "$out/s5-other" add machines/other-box.md
gitq "$out/s5-other" commit -q -m "other clone"
gitq "$out/s5-other" push -q origin main
printf '%s\n' '- A local line, committed but unpushed.' >> "$h5/profile/index.md"
gitq "$h5/profile" commit -q -am "local unpushed"
printf '%s\n' '- A local line, not yet committed.' >> "$h5/profile/index.md"
run "$h5" pull pnpm exec tsx "$sync" pull
say "after pull — local log: $(git -C "$h5/profile" log --format=%s -5 | tr '\n' '|')"
say "after pull — local status: $(git -C "$h5/profile" status --short | tr '\n' ' ')"
say "after pull — uncommitted line still in the file? $(grep -c 'not yet committed' "$h5/profile/index.md")"
run "$h5" push pnpm exec tsx "$sync" push --message "observation: after divergence"
remote_head "$r5"
say "after push — local status: $(git -C "$h5/profile" status --short | tr '\n' ' ')"
say "=== STATE 6 (found by accident in the first run): a README.md at the root arrives from another clone; then a local write"
h6="$out/s6-home"; r6="$out/s6-remote.git"; seed "$h6" "$r6"
git clone -q "$r6" "$out/s6-other" >> "$rec" 2>&1
printf '%s\n' '# My profile' > "$out/s6-other/README.md"
gitq "$out/s6-other" add README.md
gitq "$out/s6-other" commit -q -m "other clone: a readme"
gitq "$out/s6-other" push -q origin main
run "$h6" pull pnpm exec tsx "$sync" pull
run "$h6" check pnpm exec tsx "$check"
printf '%s\n' '- A local line, written on the operator'"'"'s word.' >> "$h6/profile/index.md"
run "$h6" push pnpm exec tsx "$sync" push --message "observation: a write beside a readme"
remote_head "$r6"
say "local status: $(git -C "$h6/profile" status --short | tr '\n' ' ')"
say "=== END"
```

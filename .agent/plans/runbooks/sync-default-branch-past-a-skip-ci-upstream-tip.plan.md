---
id: sync-default-branch-past-a-skip-ci-upstream-tip
node_type: runbook
name: "Sync a default branch past an upstream tip that carries the CI-skip token"
overview: "Land an upstream sync whose tip is a release commit marked with the CI-skip token, so the default branch's required checks can report, by adding one empty commit on a dated sync branch and merging by merge commit."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-06
---

# Sync a default branch past an upstream tip that carries the CI-skip token

## When to run

When this repository tracks an upstream whose default-branch tip is a release commit
marked with the CI-skip token: a sync pull request whose head IS that commit gets no
file-based workflow runs on either repository, so the default branch's required checks can
never report, and closing and reopening the pull request changes nothing.

## User groups and value

The seat landing the sync, and every seat whose lane starts from the default branch
afterwards: the default branch carries upstream's tree with its required checks reported,
and no seat re-derives the recipe at the wall.

## Preconditions

- The upstream mirror branch on this remote is at the tip to be synced (check: the remote
  branch's tip equals upstream's default-branch tip).
- The working tree is clean on a dedicated worktree (check: the status read is empty).
- The configured bot identity can commit and push (check: the identity preflight passes);
  the empty commit carries the human's authority through the author field, as every commit
  on this repository does.

## Steps

1. `agent` — cut a dated sync branch at the upstream tip. Verification: the branch's tip
   equals the mirror's tip.
2. `agent` — add ONE empty commit on the normal bot commit path (committer the bot, author
   the human, the repository's standing action map) whose message names the situation
   WITHOUT spelling the skip token: the host scans the whole head commit message, and a first
   attempt that quoted the token was skipped exactly like the release commit (2026-09-02).
   Verification: the commit is empty and its message carries no bracketed marker. Then
   push the branch through `merge-bot push` (the bot path; never through the PR
   creator's own push prompt, which would use the ambient human credential).
   Verification: the remote branch tip equals the local head.
3. `agent` — mint the bot's pull-request token and export it (`merge-bot mint-token
   --scope pull-request-work`, then `GH_TOKEN`) before every later `gh` write: `GH_TOKEN`
   takes precedence over stored credentials, and its absence selects the ambient human
   credential for the PR and its later server-side merge. Then open the pull request to
   the default branch from the pushed branch. Verification: the pull request's author is
   the bot; every workflow runs on the empty head.
4. `agent` — triage every reviewer thread under the normal review-round discipline; a
   finding about carried code is cure-worthy on this fork but not on the sync (the two
   forks are peers and the merge-back delivers the cure; `cross-fork-integration`
   §Authority frame), so its disposition is a signed reply naming the local work list or
   follow-up lane that carries it — and the thread is resolved on that route, never on a
   canned line; a finding about the sync itself (the empty commit, the branch shape) is
   cured here. The ruleset requires resolution. Verification: zero
   unresolved threads, each with a route or a verified rejection with its rationale in
   its reply.
5. `agent` — merge by MERGE COMMIT with the head pinned, through the bot's merge path and
   never `gh pr merge` under the step-3 token: the merge-bot front door (`pnpm agent-tools
   merge-bot merge --pr <n> --expect <reviewer>`) where a reviewer verdict is expected, or
   the sanctioned REST merge of the docs-only bot-PR class (pr-lifecycle's landing item:
   the `pull-request-merge` scope minted for the call, head pinned, merge-commit method)
   where the front door's verdict is the class's silent-wait shape. Squash or rebase would
   diverge the history from upstream. Verification: the merge commit's second parent is the
   sync tip.
6. `agent` — delete the sync branch after the merge is proven an ancestor of the default
   branch.

Amendment (2026-09-03): once one sync has landed, the default branch carries that sync's
empty and merge commits, which the Oak fork does not carry until the merge-back, so the NEXT sync branch cut at the
upstream tip reads BEHIND under the up-to-date requirement and cannot merge. The cure runs
AFTER step 3, because the host's update-branch acts on an open pull request: open the pull
request, update its branch server-side as the bot (`gh pr update-branch --repo
EngraphCode/open-curriculum-ecosystem` under the step-3 token — the flag, because a
multi-remote checkout resolves the default repository to `upstream`: a merge of the default branch into the sync branch), fetch and fast-forward the
local branch onto that server-side merge commit before any cure push (a push from the
stale local head is refused as non-fast-forward; the sequence run on 2026-09-07),
re-verify that every workflow runs on the new head, then steps 4 to 6 as written.

## Verification

The default branch's tree equals the upstream tip's tree: `git diff --quiet <default>
<upstream-tip>` prints nothing and exits zero. The upstream mirror branch on the remote is
untouched.

## Rollback

Steps 1 to 3 change no shared state beyond a branch and a pull request, both deletable.
Step 4's routed review findings are durable by design (a local work list, a follow-up lane
node, or a frictions-register row written before the merge, as the review-triage rule
requires) and a rollback keeps them; only the branch and the pull request are deleted.
Step 5 has no rollback beyond a forward-going revert merge, which would itself diverge from
upstream; the owner accepted that shape when the recipe was first used (2026-09-02).

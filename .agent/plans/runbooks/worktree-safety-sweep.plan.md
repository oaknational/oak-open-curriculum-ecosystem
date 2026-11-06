---
id: worktree-safety-sweep
node_type: runbook
name: "Worktree safety sweep — every worktree's work committed, pushed and on a pull request"
overview: "Scan every worktree the checkout knows, classify each by dirty files, unpushed commits, a missing remote branch and a missing pull request, and make each unsafe one safe by commit, bot push and draft pull request, without deciding its merit."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-10
---

# Worktree safety sweep

## When to run

At the owner's word that the session is n=1 (the only live seat in the repository), at a
team's closeout, before a host change or a long absence, and whenever a seat inherits a
checkout whose worktrees it did not create. Founding instance: 2026-09-10, owner word "No work
is considered safe until it has been committed and pushed and is in a PR, draft PRs are
acceptable. Please scan all worktrees for work that needs to be made safe" — forty-one
worktrees, ten unsafe (five with uncommitted files, five with commits absent from the tip by
patch and no remote branch).

## User groups and value

- **The owner**: every piece of work is recoverable from the remote and visible on the board,
  so a lost machine, a pruned worktree or a dead session loses nothing.
- **The next seat**: unsafe work is on a draft pull request whose body says what it is and what
  decides its fate, so the pickup is a read, never an archaeology.
- **The Director**: the open-PR count rises by the number of unsafe branches, honestly — the
  board shows the true amount of unlanded work rather than hiding it in worktrees.

## Preconditions

- The checkout's worktree list is the universe: `git worktree list --porcelain` (git runs only
  inside listed paths — the owner's standing constraint for unattended seats).
- The remote is fetched and pruned (`git fetch --prune origin`) so remote-branch and
  patch-equivalence reads are current.
- The open and closed pull-request list is fetched once (`gh pr list --state all --limit 300`
  with the repository pinned) and matched by head branch locally; never one call per worktree.
- The bot identity is minted and working (`merge-bot mint-token --scope pull-request-work`);
  every push and pull request is the bot's, commits are authored by the owner.

## Steps

1. `agent` — **Scan.** For each worktree: the branch (or detached), `git status --porcelain`
   count, whether `refs/remotes/origin/<branch>` exists, the exclusive commits against the
   default branch's remote-tracking ref, and the pull request(s) whose head is the branch.
   Emit one line per worktree. A detached worktree whose commit is on the default branch is
   safe; a detached worktree with exclusive commits needs a branch name before step 3.
2. `agent` — **Classify by patch, never by count.** For a branch with exclusive commits, run
   `git cherry -v origin/<default> HEAD`: a `-` commit has a patch-equivalent on the tip and is
   landed; a `+` commit is not. A tree diff between an old branch and the tip is meaningless
   (the estate moves under it); the cherry test is the truth. A worktree is UNSAFE when it has
   dirty tracked or untracked files, or any `+` commit, or a remote branch missing, or no pull
   request for a branch with `+` commits.
3. `agent` — **Commit what the worktree holds, as found.** Stage untracked files by explicit
   pathspec first (a pathspec commit cannot see an untracked file), then one commit by pathspec
   per worktree, owner as author, the session trailers, a message that says "found at the
   safety sweep, committed as found" and names the files. The commit runs the worktree's own
   hooks (its installed `.husky/_`; a worktree with no hooks installed is named in the pull
   request body, and CI is the gate). No content is edited; no judgement of merit.
4. `agent` — **Push as the bot**, one push per branch, by name
   (`merge-bot push --branch <branch>` with the worktree as cwd and the primary's built
   binary). A refused pre-push is reported, never bypassed: `--no-verify` needs fresh owner
   authorisation.
5. `agent` — **Open a DRAFT pull request** to the default branch as the bot for every branch
   that has none, with a body carrying: the owner word that opened the sweep, what the branch
   holds (files, commits, dates, authors), the disposition to decide at pickup (land, semantic
   merge, or close with the landing named), and the provenance line. A branch with an open pull
   request needs only the push.
6. `agent` — **Record.** The scan table and the per-worktree outcome go to the Director's
   tracked thread record; the pull-request numbers go to the board. Nothing else changes.
7. `owner-held` — **Dispose.** Each draft's fate is a later, separate decision at pickup by a
   seat with the lane's context; the sweep never merges, never closes, never prunes a worktree.
   Verification: every draft carries a disposition row in the thread record before it closes.

## Verification

Re-run step 1: every worktree reads `dirty 0`, `remote yes`, and either `ahead 0` or a pull
request number. `git ls-remote origin refs/heads/<branch>` equals the worktree's HEAD for every
pushed branch. The board (`gh pr list --state open`) lists every draft the sweep opened.

## Rollback

- Steps 3 and 4 add commits and remote branches; nothing is removed, so no rollback is needed —
  a commit the owner later rejects is closed on its draft, never reset (`never-use-git-to-remove-work`).
- Step 5 opens drafts; a draft opened in error is closed with the reason in its last comment.
- The sweep has no destructive step by construction; the worktree-prune policy is a separate
  owner-held procedure and never runs inside this one.

## Structural cure (named, not built here)

The scan is a shell script today (the founding instance's instrument, session-local). The
recur-proof home is an `agent-tools` command (`worktrees audit`) that emits the table with a
typed exit per class, so the sweep becomes a standing check rather than a seat's recipe.

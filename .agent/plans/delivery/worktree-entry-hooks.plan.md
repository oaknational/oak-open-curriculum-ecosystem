---
id: worktree-entry-hooks
node_type: delivery
name: "Worktree entry hooks — lanes launched resident with no prompt, on the right base"
overview: "A tracked WorktreeCreate/WorktreeRemove hook pair that places a lane worktree in the sibling directory, cuts its branch from the derived default branch, checks the inherited identity and carries the environment file, so `claude --worktree <name>` launches a lane resident with no approval prompt and subagent worktrees inherit the right base; removal refuses anything unproven."
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-09-08
ratified_where: "Ratified in advance of authoring by the owner's direct word of 2026-09-08 (12:1xZ, via the Director), verbatim: \"create a plan for the worktreecreat (sic)/remove hook pair and ratify it\"; the text was authored after the word and read first-hand by the Director on the landing pull request, whose body quotes the word; the owner's own read of the text is that pull request"
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-08
---

# Worktree entry hooks — lanes launched resident with no prompt, on the right base

## Goal

A seat that needs its own checkout gets one by a single launch — `claude --worktree <name>`
— that opens resident inside a worktree cut from the repository's default branch, placed
beside the repository, with the bot identity inherited and checked and the environment
file carried, and no approval prompt anywhere in the sequence. A subagent's isolated
worktree inherits the same base. Removal of a finished worktree refuses anything not proven
on the fetched default branch. Today every one of those steps is a hand-run recipe in the
lane-cut skill, and the platform's own creation path bases a worktree on the principal's
checked-out HEAD, a coordination-branch tip on this estate.

## User groups and value

- **Implementer seats** (agents launched for a lane): residency without the mid-session
  `EnterWorktree` prompt that held one seat for nine hours on 2026-09-07/08; the base is
  right by construction, so no lane PR ships coordination commits under its story.
- **The Director**: launches lanes resident with one command and stops routing around a
  prompt the seat cannot see; subagent fleets isolate on the right base.
- **The owner**: one fewer approval prompt to be present for; the platform's documented
  creation path made to obey the estate's conventions rather than its settings default.
- **Any organisation running this tree as its own**: the hooks derive the default branch
  and the sibling directory from the checkout, naming no organisation (ADR-231).

## Mechanism

The platform (Claude Code, verified on 2.1.263 against the worktrees documentation and the
hooks reference) fires a `WorktreeCreate` hook for `claude --worktree <name>`, subagent
isolation and background sessions — never for the `EnterWorktree` tool — with `name` and
`cwd` on its input and the created path expected on its output; the hook may place the
worktree anywhere not reached through a symlink inside the repository. A `WorktreeRemove`
hook fires on the matching removal. Entering a path outside `.claude/worktrees/` mid-session
always prompts and no permission rule suppresses it (since 2.1.206); creation through the
hook prompts for nothing, so the prompt-free shape is launch-time residency, which these
hooks make mechanical.

- **`WorktreeCreate`** (a tracked script under `.claude/hooks/`, registered in the tracked
  settings): read the JSON input; derive the default branch from the remote itself — read
  the remote's HEAD symref (`git ls-remote --symref origin HEAD`), fetch that branch into
  its remote-tracking ref with an explicit, forced refspec
  (`git fetch origin +refs/heads/<default>:refs/remotes/origin/<default>` — the leading `+`
  because a rewritten remote default is otherwise refused as non-fast-forward and every
  later launch fails), then
  `git remote set-head origin --auto` and the local read
  (`git symbolic-ref --short refs/remotes/origin/HEAD` stripped of `origin/`) — because a
  single-branch clone whose remote default moved outside its fetch refspec fails the bare
  `set-head --auto`, and a fetch that names the branch without a destination
  (`git fetch origin <default>`) writes only `FETCH_HEAD` when the branch sits outside
  `remote.origin.fetch`, so `set-head --auto` still fails after it; then `git worktree add
  ../<repository-directory>-worktrees/<name> -b <name> origin/<default>`, or, when a
  worktree with that path and branch already exists from a setup that failed part-way,
  RESUME it rather than re-add it (the hook is idempotent: it checks `git worktree list`
  first and runs only the remaining steps); verify the inherited commit identity resolves
  and no worktree-scoped `user.*` override shadows it (never re-set it); copy the
  principal's `.env.local` when one exists; run `pnpm --dir <path> install`,
  `pnpm --dir <path> build` and the Playwright browser installation Start Right names for
  a fresh worktree (`pnpm --dir <path> exec playwright install`, so the first browser suite
  runs on a cold machine or a lockfile-selected revision absent from the shared cache) — a
  failure here leaves the worktree and branch in place and exits non-zero naming the failed
  step, so the same launch retries from where it stopped. Every diagnostic line from those
  steps goes to stderr (or a captured log): the harness consumes the hook's stdout as the
  created path, so a successful run writes exactly one absolute path to stdout and nothing
  else.
  The install and build run inside the hook, before the session opens, because a worktree
  built after its session opens has no statusline (residency clause 2; the lane-cut skill's
  own order): the launch waits the minutes the build takes, once per lane, rather than open
  a session whose gates cannot be trusted.
- **`WorktreeRemove`**: apply `worktree-hygiene` §6's proof whole — the porcelain listing
  WITH `--ignored`, because this very hook creates ignored state (the copied `.env.local`,
  the install, the build) that plain porcelain omits and `git worktree remove` deletes with
  exit 0 — and refuse with the proof table when any tracked path is dirty, any ignored
  entry lacks a disposition, or HEAD is not an ancestor of the freshly fetched default
  branch (never `--force`; the dirty-but-proven clearing stays the seat's under §6 and the
  standing grant); porcelain-clean without the ignored inventory is not proven. Otherwise
  `git worktree remove` and `git branch -d` (merged only), printing what was removed.
- **`worktree.baseRef: head`** in any settings layer is neutralised, because the hook cuts
  the base explicitly; the setting is left as the user has it.
- Each hook is a thin shell over a pure planner: given the input and the facts read from the
  checkout, the planner returns the commands to run, so the decision is unit-tested without
  IO and the shell is the only part that touches git.

## Acceptance criteria (each with a proof)

1. `claude --worktree <name>` from the principal opens a session resident in
   `../<repository-directory>-worktrees/<name>`, installed and built, on a branch whose
   merge-base with the default branch as fetched at creation is that fetched tip (the proof
   binds at creation, never to the moving tip), with no approval prompt in the sequence.
   Proof: `owner-held` — one launch by the owner, recorded on the lane's closing event; the
   falsifier from the exploration that designed this node: the launch prompts or refuses the
   sibling path.
2. The planner for each hook returns the exact command sequence for the documented input
   shapes, including the resume case (a matching worktree left by a failed setup) and the
   refusal cases (a dirty tracked path; an ignored entry without a disposition; HEAD not an
   ancestor; a worktree-scoped identity override present; a remote default branch outside
   the clone's fetch refspec). Proof: `repo-safe` — unit tests over the planners with
   recorded inputs, no IO.
3. The hook scripts, piped the documented JSON against a temporary repository, create a
   worktree, resume one after a failed install, and remove one as specified, refusing as
   specified; the temporary repository includes a single-branch clone whose remote default
   moved outside its fetch refspec and a remote whose default was rewritten, and the create
   hook derives the new default from each. The invariant every fixture serves: the hook
   reaches the remote's current default from any clone shape without a human step, so a
   case the rounds did not name is a fixture the implementer adds at pickup, never a
   mechanism edit here. Proof: `repo-safe` — one integration check in the agent-tools
   end-to-end suite.
4. The hooks name no organisation and no branch literal: the default branch and the sibling
   directory are derived. Proof: `repo-safe` — the identity-naming validator family runs
   over the hook scripts; a grep for a branch literal in them finds none.
5. The lane-cut skill's steps 1, 2 and 4 read as the hook's contract, and residency clause 2
   names `claude --worktree <name>` as the prompt-free shape without the "check for the
   hook" caveat. Proof: `repo-safe` — the markdown-links validator and the docs reviewers
   on the landing PR.

## Todos

1. **The planners and their tests** — the two pure planners with the recorded-input tests
   (criterion 2); one PR, default round budget.
2. **The scripts and the registration** — the two shell hooks over the planners, the install
   and build inside the create hook, the tracked settings entry, the end-to-end check
   (criteria 3 and 4); one PR.
3. **The doctrine truing** — the lane-cut skill and residency clause 2 (criterion 5), landed
   after the owner's launch verifies the wiring (criterion 1); one small records PR.

Each PR opens with the pr-lifecycle instruments declared at open: the round tally, and the
PDR-140 intake contract where the changeset carries prose.

## Out of scope

- Suppressing the mid-session `EnterWorktree` prompt: the platform asks by design and no
  setting changes it; the cure is launch-time residency, which this node makes mechanical.
- A setting to skip the install and build at launch: not offered — a worktree built after
  its session opens has no statusline, and that requirement outranks launch speed.
- A per-fork re-identification tool or any hard-coded branch or directory name: ADR-231
  forbids both; everything here is derived.
- The dirty-but-proven clearing of a worktree: the seat's, under `worktree-hygiene` §6 and
  the standing grant for proven paths; the remove hook only refuses what is unproven.

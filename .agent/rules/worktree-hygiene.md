# Worktree Hygiene

**TRIGGER — the rule fires at CLAIM-OPEN and at the FIRST SOURCE EDIT,
never in the abstract:** before opening any implementation claim and before
the first Write/Edit outside `.agent/`-class coordination surfaces, answer
*which worktree am I in?* Source work on the primary/coordination checkout
is a straight error that blocks the whole team (owner word, 2026-07-27,
after a seat's product edits sat uncommitted on the shared tree: whole-tree
gates held hostage, pathspec commits hazarded for every seat). The primary
checkout is shared fleet surface — coordination docs and fleet state only;
a fresh worktree off `origin/main` is where every implementation lane
starts, before its first edit, not after.

In the one-developer-many-agents / many-worktree model, linked git worktrees
proliferate. A worktree is a transient workspace, not a home. Left undisciplined it
becomes an orphan: a branch carrying commits that never reach `main`, invisible from
every other worktree (tracked `.agent/` files are per-branch), with no PR, no review,
and no path to its durable home. Information rots on branches nobody remembers. This
rule keeps every worktree's work visible and on a committed path to `main` from the
moment it exists, and makes its retirement a content-verified step rather than an act
of faith.

## Core invariant

**`main` is the only durable home. A surviving branch is NOT preservation.**
Information is durably preserved only when it is in `main`, or on a live, owned lane
with an open PR actively heading to `main`. "It's on a branch" / "it's pushed to
origin" / "the branch ref survives `git worktree remove`" are NOT preservation — they
are deferred orphaning. The hygiene question for any branch is always *"is its useful
information in `main`?"*, never *"does the branch still exist?"* Never treat "branch
exists" as "information safe, job done."

## Trigger

Creating or working in a linked worktree; readying a worktree's PR; retiring, pruning,
or handing off a worktree; or auditing the worktree estate for hygiene.

## Action

### 1. Every worktree has an open PR — at least a draft

The moment a worktree exists to do work — at creation, or at the very latest its first
commit — open at least a **draft** PR against `main`. The PR is the worktree's lifeline
to its durable home: it makes the work **visible** (it appears on the PR list, not "on
a branch somewhere"), **reviewable**, and **on a committed, trackable path to `main`**.
A worktree carrying commits with no PR is an orphan by construction. A draft PR is
low-cost — it requests no review until marked ready. **There is no acceptable state in
which a worktree holds work and has no PR.**

This absoluteness is deliberate. A read-only investigation checkout holds no committed
work and is outside this clause — but a genuinely throwaway spike is **not** an
exception: it too gets a draft PR, then is closed and removed the same session. The PR is
cheap, and requiring it even for throwaways is the point — "committed work on a branch
with no PR" is the single state this rule exists to forbid, so nothing is ever silently
dropped.

### 2. One bounded lane per worktree

A worktree owns one bounded lane — one coherent change set heading to one PR — not a
grab-bag. Keep the live worktree count to the lanes actually in flight; a worktree with
no active lane is a candidate for retirement, not a parking space. (For the role shape
that owns a lane in its own worktree, see PDR-117.)

### 3. A worktree is a temporary means, not a home — the lifecycle

create → enter (session-level residency per
[`worktree-residency`](worktree-residency.md)) → build (`pnpm install && pnpm build`,
before any gate or work) → open draft PR
→ do the bounded work → update onto `main` → mark the PR ready → merge → **remove the
worktree AND delete the branch.** A worktree that outlives its PR's merge, or never
opens a PR, is a hygiene violation to resolve.

### 4. Update onto `main` before ready; semantic-merge memory by hand

Before a PR goes ready, bring its branch up to date with `main` (it must not merge
stale — ADR-204 require-up-to-date). When the update touches agent memory/state files
(`napkin.md`, `repo-continuity.md`, thread records, registers), do NOT let git
line-merge them: a git auto-merge silently corrupts concept-bearing files
(drops/duplicates/stacks entries, often with no conflict marker). Author the union by
hand per the `semantic-merge` skill. The visible git conflict is the easy case; the
silent auto-merge of a both-sides-edited memory file is the dangerous one.

### 5. Do not commit on another agent's worktree branch

A worktree's branch belongs to the agent driving its lane. Do not commit, stage, or
rebase another agent's worktree branch, nor mutate the working tree of a shared checkout
you do not own; coordinate through comms and let the lane owner act. Reading is fine.

**Branch operations in a shared checkout are owner-gated.** Never switch or create a
branch (`git checkout`, `git switch`, `checkout -b`) in a checkout you do not exclusively
own without explicit approval — announcing the intent is not approval. Switching moves
HEAD under everyone sharing the checkout, so their next commits land on the wrong branch
(worked failure 2026-06-29: an unauthorised `checkout -b` put the owner's next two
commits on an agent's feature branch). The mirror discipline: in a shared checkout,
verify `git branch --show-current` before **each** commit — a peer can move the branch
under you mid-session. When commits do land on the wrong branch, recover without loss
and without destructive ops: `git branch -f <intended> <tip>` (fast-forward the intended
branch to the commits), `git switch <intended>` (content-identical, so uncommitted work
carries over), then `git branch -f <other> <its-clean-base>` to re-point the polluted
branch. No reset, no rebase, no force-push.

**A peer's untracked file is not evidence of abandonment.** Before committing another
session's untracked file "to conserve in-flight work", check it is not being actively
written (mtime vs now; peer liveness) — a file being edited *now* is live WIP to leave
alone, not orphaned work to snapshot (worked instance 2026-06-29: a peer's report was
conservation-committed mid-write; the peer's later edits stayed uncommitted for them —
additive, but the snapshot was premature).

### 6. Retirement requires a CONTENT check, not a commit check

Squash-merges make commit counts (`origin/main..HEAD`) meaningless — a branch's content
can be fully in `main` while showing many "unmerged" commits. Compare **files**, not
commit graphs (`git diff origin/main <branch> -- <file>`). Then, for each branch being
retired:

- useful information already in `main` (or a live lane heading there) → the branch is
  redundant → delete it;
- unique information NOT in `main` and worth keeping → **land it to `main`** (a PR)
  before deleting;
- unique information NOT in `main` and not worth keeping → consciously drop it ("if
  there is no information worth preserving, that is fine").

Destructive removal (`git worktree remove`, branch deletion) is
owner-authorisation-gated and never removes information not first confirmed in `main` or
consciously released (`never-use-git-to-remove-work`).

A third disposition exists for a branch worth preserving as HISTORY but not landing:
an **annotated tag** (`git tag -a preserve/<name> <tip> -m "<why kept>"`, pushed)
pins the whole lineage at zero loss, and the
branch then deletes cleanly (worked instance 2026-07-20: a held spike branch preserved
under a `preserve/` tag on owner ruling; branch removed same day).

**An OWNED preservation PR must carry a LIVE DISCHARGE PATH** (owner rulings,
2026-07-26, #556/#567): a named condition, checkable by anyone, whose
satisfaction retires it — or it is not owned, merely parked, and
parked-indefinitely is a third state the owner rejects alongside unmerged and
unclosed. PR #556 was the negative instance (a preservation draft whose
single file targeted a path no longer on main, its substance already
conserved elsewhere — a wrapper around nothing that no event could ever
discharge); PR #567 the positive (same form, but every part of its body
names what retires it). The test for any preservation surface: **can a
stranger read the artefact alone and say what event deletes it?** If not,
it is parked, whatever its label says.

**"Orphaned" is a RECORD-BINDING question, never a git-state question**
(sweep generator lesson, 2026-07-25): dirty/unpushed does not mean orphaned —
everything named by a live record (ticket, thread record, handoff, PR) is
already dispositioned; the genuine orphans are exactly the items no record
names. Closeouts declare worktree dispositions, so a closeout leaving an
unnamed worktree is what reopens the class.

### 7. Surface idle, PR-less, or stale worktrees

A worktree that is idle with no open PR, or whose PR has merged but the worktree
lingers, is surfaced for retirement rather than left to accumulate. Keep the
cross-worktree work-state map current at the F-41 coordination home (the interim map;
its durable form is the F-98 registry) — tracked `.agent/` files are per-branch and
invisible across worktrees, so
the map is the only surface on which a forgotten worktree becomes visible.

### 8. Operate correctly from a worktree

Working-directory residency — the lane agent's session cwd IS the worktree,
established by a session-level mechanism and stable until the agent changes it —
is governed by [`worktree-residency`](worktree-residency.md) (owner directive
2026-07-31). Build before work (`pnpm install && pnpm build` — the eslint plugin dist and the
statusline both come from the build). From a worktree, collaboration-state commands need
the primary path passed explicitly (`comms list/watch/inbox --comms-dir`, `claims
--active`); only `comms send` auto-anchors to the primary, and a relative path silently
lands worktree-local.

Repurposing an idle provisioned worktree beats re-provisioning: a merged-PR
worktree switches to a new branch in seconds at zero install cost. Two
mandatory follow-ups: rebuild agent-tools after the switch (the
stale-dist-after-switch class; see the frictions register), and expect
`git switch` to fire harness "file modified" notices for every
checkout-updated file — checkout noise, never peer edits.

Worktree isolation is weaker than it looks — three proven leak paths: a **nested**
worktree gives false-clean dependency runs (Node resolution walks up into the parent
checkout's `node_modules`, so a missing dependency passes locally and fails everywhere
else); parallel `isolation: worktree` subagents can inherit the **wrong base commit**
and write to main-repo **absolute paths**, so verify a spawned worktree's HEAD and keep
paths worktree-relative; and `pnpm check`'s opening clean step deletes shared build
output from under every sibling (the
[`check-singleton-per-window`](check-singleton-per-window.md) hazard). Isolation is a
property to verify per-seam, never an assumption.

## Failure mode this prevents

Orphaned worktrees: branches with commits that never reach `main`, no PR, invisible
across worktrees, accumulating until nobody remembers what they hold — and the false
confidence that a surviving branch has preserved the work.

## Worked instance

2026-06-27: the dissolved worktree-pilot team left seven stale worktrees, several with
commits not in `main` and two never pushed. Because none carried a live PR and tracked
`.agent/` state is per-branch, the estate had to be reconstructed from `git worktree
list` and a per-worktree **content** audit (squash-merges had made commit-existence
meaningless) before any could be safely removed. The audit found exactly one piece of
information not in `main` worth preserving — an experience reflection on a pushed pilot
branch — which was landed to `main` before the branch was retired; everything else was
already in `main` or superseded. Had each worktree carried a draft PR from creation, the
estate would have been self-describing (the PR list) and self-cleaning (merge → remove),
and no archaeological audit would have been needed. The owner correction that
crystallised the core invariant: *"branches existing is secondary; preserving
information in `main` is all that matters — do not treat 'branch exists' as 'information
safe, job done.'"*

## Why a rule, not a PDR clause

Worktree hygiene is a per-session, agent-general discipline that fires at structural
moments (worktree creation, PR-ready, retirement, estate audit), so it belongs in the
always-applied rule tier (`new-rule-vs-pdr-clause` classifier #1). No existing PDR owns
it: PDR-117 owns the Director/Implementer roles (an Implementer works one lane in its
own worktree) but not the worktree lifecycle discipline, which applies to any agent
holding a worktree.

## Related surfaces

- [PDR-117 (Director and Implementer roles)](../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
  — the Implementer owns one bounded lane in its own worktree.
- [`never-use-git-to-remove-work`](never-use-git-to-remove-work.md) — destructive
  removal is gated and content-verified; deletion never removes unpreserved work.
- [`semantic-merge` skill](../skills/semantic-merge/SKILL-CANONICAL.md) — the
  concept-union discipline for memory/state files at branch→main.
- [ADR-197 (coordination-home checkout owns shared registry state)](../../docs/architecture/architectural-decisions/197-coordination-home-owns-registry-state.md)
  — the accepted decision that one checkout owns `.agent/state/collaboration/` and feature
  branches do not carry it; the basis for the cross-worktree-visibility and memory-merge clauses.
- The cross-worktree work-state map at the F-41 coordination home
  (`.agent/state/collaboration/`) — the visibility substrate; its planned durable form is
  the agent-work-state registry (F-98).
- The comms-and-worktree-operability work — the operating mechanics (path anchoring,
  statusline) that clause 8 states inline; doctrine carries no dependency on it.

## Enforcement

Behavioural at worktree creation and retirement. The draft-PR-on-creation discipline is
observable (every branch with work has a PR on the list); the content-check-before-removal
is the named retirement step; the cross-worktree map makes a forgotten worktree visible.
Future hardening could add a check that flags any local worktree branch with no open PR.

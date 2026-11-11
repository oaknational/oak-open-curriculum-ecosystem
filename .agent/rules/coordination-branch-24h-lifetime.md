---
classification: situational
description: Coordination branches fold at 12:00Z and at the UTC rollover as the guide clock (owner, 2026-09-26); the 24 hours is a rough guide whose actual need varies with how much work the branch is carrying, and a fold on the clock alone, with nothing else happening, is not run (owner, 2026-10-19) — day-stamped name at the cut, converge-and-rotate shape, work products stay in worktrees.
trigger: ceremony:branch-cut — Cutting a coordination branch, or session-open on one
---

# Coordination Branch 24-Hour Lifetime

Owner-ruled (2026-07-28, in-chat, verbatim intent): coordination branches
last no more than 24 hours. A coordination branch is cut, carries the
fleet's shared state for at most one day, converges (merge main in, land
the branch via its PR), and a fresh branch is cut. The lifetime is a
bound on divergence, not a deadline on work: rotating daily keeps the
convergence merge small enough to be routine.

Amended by the owner's word of 2026-09-26 (card answer to the Director, about
10:50Z, the selected option verbatim: "Fold them twice a day"; the same
morning's word, 10:09Z: "work is safe when it is merged, the target number
of open PRs is always zero"): the coordination drafts count toward the
standing target of zero open pull requests, and each estate's coordination
branch folds twice a day, at 12:00Z and at the UTC rollover. The 24-hour
bound stands as the ceiling; the half-day boundary is the DUE clock. The
fold is the Director's ceremony and takes the first free landing slot. This
file keeps its name so every citation of it stays valid.

Amended again by the owner's word of 2026-10-19 (in-chat to the reviewer
seat at n=1, after the seat reported that "the 24-hour fold rule stands";
verbatim: "the 24 hours is a rough guide, but obviously the actual need
varies with how much work is happening, there would be no point in folding
every 24 hours if that was the only thing happeneing"): the clock is a
guide, not what makes a fold due by itself. The need to fold varies with
how much work the branch is carrying, and a fold whose only reason is the
clock, on a branch where nothing else is happening, is not run. The seat's
reading of that word for the DUE check of Action 2, flagged as the seat's:
the check reads the work on the branch since its cut together with the
clock (the fold skill already reads the commits since the cut at the DUE
check); a branch past the boundary and carrying work folds; a branch past
the boundary carrying nothing beyond the previous fold's own ceremony does
not, and the seat says so on the stream instead of folding. The half-day
boundary of 2026-09-26 reads the same way, since his reason does not turn
on the window's length. What counts as enough work to fold is his to set
if he wants a number; until then the folding seat judges it and names the
work in the fold's record.

## Trigger

Cutting a coordination branch; or opening a session whose primary
checkout sits on a coordination branch. This rule fires at the cut (to
stamp the lifetime) and at session-open (to check it). The Director's
check-in cadence reads the DUE clock at each check-in as well.

## Action

1. **Stamp the cut date in the branch name**:
   `coordination/<YYYY-MM-DD>-<sha6>`, minted by the
   [cut-coordination-branch skill](../skills/cut-coordination-branch/SKILL-CANONICAL.md)'s
   tool (`agent-tools coordination successor-name`) — never
   hand-transcribed. The date segment is the observable clock — no
   side-channel state needed (agent-state-observable); the sha6 segment
   carries the base-tip lineage (the skill states its exact guarantee).
2. **At session-open on a coordination branch**, read the stamp — the
   `<YYYY-MM-DD>` segment between `coordination/` and the trailing
   `-<sha6>` (older branches may carry legacy forms such as
   `coordination/estate-<YYYY-MM-DD>`; their date segment is still the
   stamp). The check is the half-day boundary: a branch is DUE at the
   first 12:00Z or 00:00Z after its cut, so a branch cut before 12:00Z
   folds at midday and one cut after 12:00Z folds at the rollover, and a
   branch whose stamp date is before the current UTC date is DUE
   regardless (the stricter reading of "at most 24 hours": a branch cut
   late in the day rotates sooner, never later). A date-only stamp cannot
   express which half of the day, so on a same-day branch read the cut
   time as the rotation broadcast's `created_at` against the clock, never
   as the branch's first own commit (a branch cut at 11:59Z whose first
   commit lands after 12:00Z would skip the midday fold). On a DUE branch, surface convergence to
   the Director (or, at n=1, act on it) before staking new work onto
   the branch. An overdue coordination branch is a defect to route, not
   a home to build on. Overdue reads with the 2026-10-19 amendment above:
   the clock marks the boundary, the work on the branch decides whether
   the fold is due.
3. **Converge-and-rotate shape** (the worked shape from the founding
   instance): merge `origin/main` into the coordination branch, push,
   land the branch through its PR at full condition, then cut the fresh
   day-stamped branch tree-preservingly (`git switch -c`) from the merged
   tip and push it. Broadcast the rotation on the comms stream so every
   seat re-homes. **The fold PR body and the seated block each carry
   one product-gravity line** — `moved for <the product's people>: … /
   moved for the Practice: …`, the product word the host's (jimcresswell.net
   writes `the sites`, OCE `teachers`) — naming what the fold's window
   delivered on each strand. No quota and no judgment in the line itself; it exists so
   drift toward Practice-internal work is glanceable in the record
   rather than caught by owner vigilance (owner-agreed step-back,
   2026-08-01).
4. **Keep the branch rotatable**: only genuine shared coordination-home
   state (fleet state, doctrine, memory surfaces) rides the coordination
   branch. Work products — source lanes, plans under active edit —
   start in worktrees on their own branches per
   [`worktree-hygiene`](worktree-hygiene.md) and the owner's standing
   word (2026-07-28: work in worktrees where reasonable). A coordination
   branch that accumulates work products cannot converge in a day. And
   CODE never rides it directly at all: source, workflows, hooks,
   config-as-code, anything executable or CI-affecting enters the
   repository only on a branch through a pull request with review before
   merge, however small and however well the author verified it (owner,
   2026-07-25, after dependency pin bumps were evaluated first-hand and
   committed straight to the coordination branch: "that's not a cure,
   that's papering over a [mistake]. Do not allow code into this repo
   without a first hand review, not ever"; cured the same hour by a revert
   and a real pull request). Self-review is structurally blind and a
   direct commit forecloses every reviewer; the test is "is this code?",
   never "am I confident?". Direct commits here remain correct only for
   fleet state and knowledge surfaces.
5. **Keep the branch reasonably clean between rotations** (owner,
   2026-07-25: "periodic commits, not too many, just don't let things
   build up"): the accruing shared-state surfaces (memory, handoff maps,
   tally ledgers) commit periodically in sensible batches under the bot
   identity by explicit pathspec — each a continuity-only commit, never
   bundled with a cycle commit, so the orphan boundary of
   [`continuity-surface-commits-as-orphans`](continuity-surface-commits-as-orphans.md)
   holds at every one of them — and the default branch merges in at quiet
   windows so the gap stays small. Uncommitted state on the shared
   primary is absent from the branch every other seat reads, invisible to
   peers, and blocks other seats' operations on that tree (a merge or a
   branch switch refuses over it). An uncommitted file on the shared primary
   is also in every seat's push gate, since the pre-push gate's checks read
   the working tree: each writer checks a file it writes there as the write
   lands, with the formatter and markdownlint by name, keeps its links
   resolving and its paths repository-relative where the gate validates
   them, and cures its own failure at once
   (2026-09-27: a peer's unlinted append to a thread record failed a fold's
   push on MD032).
   The fold's pre-push check (`coordination-fold` precondition 2) is this
   clause at the fold. And the coordination branch IS the primary
   checkout's own branch, always — never a snapshot worktree (owner,
   2026-08-06, verbatim: "the coordination branch shouldn't be a
   worktree, it should be the branch in the primary checkout, always").
   A seat never switches the branch of a primary that another seat
   shares; it works in a worktree (the Director's ruling of 2026-09-27,
   after a settlement script switched OCE's shared primary under a peer's
   unpushed commit). The one exception is the fold's successor cut, which
   the fold skill's ceremony governs: it renames the primary's branch
   under every seat on it, so the folding seat announces the cut on the
   stream first and makes it when no seat has said it is mid-commit there
   (2026-10-01, two seats on JC.net's primary). Two instances.

## Why This Rule Exists (Worked Instance)

`coordination/estate-2026-07` lived nearly a month. By convergence night
(2026-07-28) it carried hundreds of commits, had accidentally swept in a
326-file design-studio export (whose CodeQL/Sonar alerts masked the
branch's true check state for days), and its convergence required a
dedicated owner-directed lane (MCP-333): a multi-PR merge sequence, an
un-track operation that surfaced a tooling defect (MCP-334), and a
commit-then-merge-resolve dance around files main had moved. Every cost
scaled with the branch's age. A 24-hour lifetime keeps each of those
costs near zero: the merge window is small, sweeps are caught the next
day, and the branch's checks stay meaningful.

The companion evidence (Starling, 2026-07-28): the worktree-hygiene
rule's broad coordination-class exemption allowed a tracked plan edit to
ride the shared primary and collide with the convergence lane (the F-83
shape). The cure — work products to worktrees, coordination branch for
shared state only — is what makes a daily rotation cheap enough to be
routine.

## Related Surfaces

- [`no-parallel-long-lived-branches`](no-parallel-long-lived-branches.md)
  — the sibling discipline for work branches; this rule bounds the ONE
  sanctioned long-running-shape branch the fleet shares.
- [`worktree-hygiene`](worktree-hygiene.md) — where work products start;
  the exemption class that founding-instance evidence showed must stay
  narrow (genuine shared coordination-home state only).
- The primary checkout's branch never moves outside this rotation (fleet
  doctrine: new work starts in worktrees); the tree-preserving cut at the
  convergence moment is the one sanctioned movement.
- [`continuity-surface-commits-as-orphans`](continuity-surface-commits-as-orphans.md)
  — continuity mechanics across the rotation boundary.
- [`design-work-for-small-prs`](design-work-for-small-prs.md) — the same
  small-surface economics, applied to the coordination estate.

## Enforcement

Behavioural at the cut and at session-open (the branch name IS the
check input: stamp date vs now). The practice fitness check is the
natural future home for a mechanical overdue-branch warning; adding it
is deliberate follow-on work, not part of this rule's landing.

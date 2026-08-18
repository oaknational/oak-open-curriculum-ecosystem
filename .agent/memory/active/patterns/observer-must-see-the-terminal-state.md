---
name: "An Observer Must See the Terminal State of What It Observes"
polarity: pattern
category: agent-operations
status: active
use_this_when: "Designing or arming any watcher, monitor, poll loop, or wait — a PR watch, a CI waiter, a job poller, a peer-liveness probe — especially one that reports progress by emitting on change."
proven_in: "PR #878 watch, 2026-08-13: a watcher tracking reviewDecision, mergeStateStatus, reviews, threads, checks and head SHA — but not `state` — reported a merged PR as pending for ~30 minutes while emitting change events throughout."
proven_date: 2026-08-13
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A watcher that cannot distinguish 'still in flight' from 'finished', and is most confident precisely when it is most wrong."
  stable: true
related_patterns:
  - prove-the-checker-with-a-negative-control
  - turbo-cache-false-green
---

> **POLARITY: PATTERN.** A watcher must observe the transition that **ends**
> the thing it watches, or it cannot tell *in flight* from *over*.

## The failure shape

A watcher is built by listing the signals that change while the work is in
progress — for a pull request: review decision, merge state, reviews, unresolved
threads, failing checks, head SHA. Every one of those is a *progress* signal.
None of them is the *terminal* signal.

When the watched thing ends, the progress signals keep moving — a merged PR still
accrues comments, still recomputes `mergeStateStatus` — so the watcher keeps
emitting. Its output looks healthiest at exactly the moment it has stopped
tracking reality.

Worked instance, 2026-08-13. PR #878 merged at 14:51:03Z. The watcher had no
`state` or `mergedAt` in its signature, so it never saw the merge. For the next
half hour it emitted change events, the Director reported the PR twice as
"waiting on review", and ~26 minutes were spent deliberating whether to merge a
PR that was already merged.

## The tell, and why it reads backwards

`mergeable` and `mergeStateStatus` both returned `UNKNOWN`. That reads as *GitHub
has not computed yet* and was in fact *GitHub does not compute mergeability for a
merged PR*. The value was correct; the interpretation supplied the error.

This is the general hazard: **a terminal state often presents as an absence** —
a null, an `UNKNOWN`, a field that stops updating, a queue that stops returning
rows. An absence is read as "not yet" far more readily than as "no longer", so a
watcher missing its terminal signal degrades into confident nonsense rather than
into obvious silence.

Sibling error in the same session: an empty `reviewDecision` read as "the
required-review gate is unsatisfied", when the branch rules require code-owner
review with `required_approving_review_count: 0` — so an empty decision plus a
code-owner approval *is* satisfied. Two nulls, two false-red inferences.

## The shape to repeat

1. **Name the terminal states before the progress signals.** For a PR:
   `MERGED`, `CLOSED`. For a job: succeeded, failed, cancelled, timed out. Ask
   *"if this finished right now, which field would tell me?"* — and put that
   field in the signature first.
2. **Announce a terminal item once, then stop tracking it.** Repeated emission
   about a finished thing is noise that reads as activity.
3. **Exit when everything watched is terminal**, so a stale watcher cannot sit
   there looking alive. A watcher with nothing left to watch is not idle; it is
   done.
4. **Prove it with a control that must fire** — run the watcher against something
   already in the terminal state and require it to say so. This is
   `prove-the-checker-with-a-negative-control` applied to observers rather than
   checkers, and it is the only step that distinguishes *armed* from *working*:
   arming a watcher and observing silence proves nothing, because silence is
   exactly what a broken one produces.

The control probe earns its place twice over. Run against the already-merged
PR #878, the rebuilt watcher both confirmed the terminal detection **and**
exposed an unrelated defect in the same pass — `declare -A` requires bash 4 and
macOS ships 3.2, which the original had survived only because PR numbers are
numeric and plain indexed arrays happened to work.

## Relationship to the false-green family

`turbo-cache-false-green` and `zero-match-false-green` both name a *check* that
returns green without having checked. This is the same disease in a *watcher*:
an observer that reports state without having observed the state that matters.
The cure rhymes — a control that must fail — because in all three cases the
failure mode and the success mode are indistinguishable from the output alone.

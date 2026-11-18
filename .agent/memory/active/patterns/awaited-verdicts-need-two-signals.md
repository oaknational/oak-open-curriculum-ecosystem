---
name: Awaited Verdicts Need Two Signals
polarity: anti-pattern
use_this_when: Arming any wait on an external verdict — a merge, a check settling, a ratification, a deploy going live — especially when the wait's wake condition is a single push notification
category: process
layer: general
proven_in: >-
  Two worked instances: settle watches missing the Sonar-reported leg
  (2026-07-21, cured by the empty-commit re-fire); the MCP-101 lane's
  13.5-minute stall on an already-merged PR whose settle watch covered
  the CHECKS leg only while the merge broadcast — the sole push signal —
  was missed once (2026-07-23; full analysis in the MCP-101 first-fork-lane
  retrospective under .agent/reports/agentic-engineering/). Related face:
  a stored auto-merge body claiming "checks green, zero unresolved"
  outlived 77 live unresolved threads (2026-07-14) — a frozen claim is
  not a second signal.
proven_date: 2026-07-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Silent stalls on verdicts that already resolved (or never will): a seat waits on one push signal, the signal drops or never fires, and the wait is indistinguishable from a pending verdict"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure shape is the single-signal
> wait. The cures are the paired positive moves below.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Failure shape

A verdict a seat waits on (merged / settled / ratified / deployed) is
carried by exactly ONE push signal with no pull reconciliation. When
that signal drops — a missed broadcast, a dropped webhook, a dead
watcher window — the wait stalls silently: from inside, "still
pending" and "signal lost" look identical.

- A settle watch that covered the CHECKS leg only sat blocked 13.5
  minutes on a PR that had already merged — the merge broadcast was
  the sole push signal and it was missed once.
- A settle watch with no Sonar-reported leg waited on a webhook the
  vendor had dropped; the cure was a pull-shaped re-fire
  (empty-commit push).

## Cures

- **Two independent signals per awaited verdict** — e.g. the event
  broadcast AND the state read (PR merge state alongside check state),
  or the webhook AND a vendor-API poll.
- **Or one signal plus a pull backstop**: a bounded re-poll of the
  authoritative state at a cadence matched to the verdict's expected
  latency. The backstop converts "signal lost" from a silent stall
  into a bounded delay.
- **A stored/frozen claim is never the second signal** — an armed
  intent's stale body, a cached status line, or a remembered state
  restates the first signal's past, it does not independently observe
  the present.

The arming-time question: *if the one signal I am waiting on drops,
what tells me?*

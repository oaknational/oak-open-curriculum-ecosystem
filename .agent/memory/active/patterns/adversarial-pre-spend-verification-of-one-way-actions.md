---
name: "Adversarial Pre-Spend Verification of One-Way Actions"
polarity: pattern
use_this_when: "About to take a one-way, costly, or unrecoverable action — launching a large fleet/workflow run, an irreversible migration, a bulk send — whose artefacts you authored yourself."
category: process
proven_in: "2026-07-01 launch preflight (fresh-reader panel caught metaPrompt drift + a scratchpad-unreachable-by-subagents flaw self-review missed) and 2026-07-02 TS-rebuild review (three independent lenses converged on the same wrong-stage seeding guard hole; a content-blind contract scan caught inlined corpus quotes containing `process.env` verbatim that would have stranded a 30M-token run after the map spend). ~450k review tokens against a 30M-token one-way spend."
proven_date: 2026-07-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Launching a one-way spend on self-reviewed artefacts; author re-diffs reliably miss the drift and contract holes fresh adversarial lenses catch, and the failure lands after the unrecoverable spend at exactly the moment the pressure is to weaken the gate."
  stable: true
---

> **POLARITY: PATTERN.** Before a one-way action, buy adversarial
> verification of your own launch artefacts — the odds are extreme in
> its favour.

## The shape

Before executing a one-way action, run an **independent adversarial
verification pass over the launch artefacts** — fresh-reader lenses briefed
to refute launch-readiness, plus content-blind mechanical scans (contract
patterns, size caps, forbidden tokens) that don't share the author's mental
model. Put the artefacts where the verifiers can actually read them (a
scratchpad is invisible to subagents; in-repo is not).

Why it pays at extreme odds: the author's re-diff checks the blocks the
author remembers; the failure modes that matter are the ones outside that
list, and on a one-way action they surface **after** the spend, at the
moment the pressure is to weaken the gate rather than fix the cause.
Distinct firing moment from
[`adversarially-verify-own-synthesis.md`](adversarially-verify-own-synthesis.md)
(conclusions about to be presented): this fires on **artefacts about to be
executed**, gated on irreversibility and spend, not on analytical length.

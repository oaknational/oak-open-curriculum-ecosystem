---
name: "Removing a Constraint Surfaces What It Was Also Bounding"
polarity: pattern
use_this_when: "About to delete or relax a constraint (a count cap, a size limit, a timeout, a gate) because it causes one visible problem."
category: process
proven_in: "Corpus-analysis WS1 grain-probe 2026-06-30: deleting the reduce stage's candidate count-cap (to stop over-merging) produced unbounded candidate JSON that truncated at ~51KB into invalid JSON and a retry loop — the cap had been load-bearing for OUTPUT SIZE, not just merge-pressure."
proven_date: 2026-06-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Deleting a constraint for its visible cost and being blindsided by the invisible second thing it was holding, one layer down."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat: before removing a constraint,
> enumerate everything it bounds; replace each load-bearing bound
> deliberately, or the removal fails one layer down.

## The shape

A constraint added for one stated reason often bounds other quantities as a
side effect. Removing it to cure its visible cost releases the invisible
bounds too, and the failure re-appears in a different subsystem — usually
without naming the removed constraint as the cause.

Before removing or relaxing a constraint, ask: **what else does this bound?**
Output size, memory, fan-out, latency, blast radius, concurrency. Then bound
each load-bearing quantity directly and deliberately rather than re-adding
the blunt original.

Worked instance: a reduce-stage candidate count-cap was removed because it
forced over-merging. The cap had also been the only bound on the stage's
output size; without it the emitted JSON truncated mid-structure. The cure
was NOT re-adding the cap but bounding the heavy field directly (≤10
representative `supportingLeafIds` per candidate, with `groundingCount`
keeping the true total) — the merge-pressure problem stayed cured and the
size bound became explicit.

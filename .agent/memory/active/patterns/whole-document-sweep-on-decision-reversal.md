---
name: "Reversing a Decision Recorded in Several Places Needs a Whole-Document Sweep"
polarity: pattern
use_this_when: "Dropping, reversing, or superseding a decision that a document (ADR, plan, README, spec) records or references in more than one place."
category: process
proven_in: "2026-06-22 (Orbit rides Horizon), reversing a recorded decision and leaving stale references"
proven_date: 2026-06-22
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Editing only the primary section when reversing a decision, leaving stale references elsewhere that now contradict the update — a self-contradicting artefact."
  stable: true
---

> **POLARITY: PATTERN.** A decision is rarely recorded in one place.
> Reverse it in only the obvious section and the document now argues with
> itself.

## The shape

When you drop or reverse a decision a document records in multiple
places, **grep the whole document for the old framing/term** before
treating the reversal as landed. The primary section is where you think
of it; the contradicting stragglers are in cross-references, examples,
summaries, and option lists.

## The cure

After reversing a recorded decision, sweep the entire artefact (and its
near neighbours) for the old term/framing and reconcile every instance.
This is an under-actuation facet — an edit that stops short of
completeness. Sibling: [`no-tombstones-for-removed-ideas`](../../../rules/no-tombstones-for-removed-ideas.md) (as a `.agent/rules` entry), and the distilled "state the positive understanding" authoring discipline.

The sweep reaches the **`derives_from` source, in both directions**: when the
reversed decision has an upstream artefact (a design report a plan derives
from), include the source in the sweep AND check *which side actually
drifted* — reconciling only the leaf would have missed that the design report
held the truer framing all along while the plan layer inverted it
(2026-06-30, the discovery-first re-rooting). Propagating the leaf's new
shape without verifying the source ratifies the wrong layer.

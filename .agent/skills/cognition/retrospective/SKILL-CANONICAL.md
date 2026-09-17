---
name: retrospective
classification: active
description: >-
  Run a deep post-mortem on a completed arc — a merged PR series, a finished
  lane, a resolved incident, a long review series — producing a durable
  record with a causal stack, a counterfactual test, honest credit, and
  proposals that each carry a warrant and a falsifier, routed through the
  PDR-130 lanes. Use at owner word after a significant arc closes, or when an
  arc's cost or shape surprised everyone and the estate should learn from the
  trajectory, not just the outcome.
---

# Retrospective

**Governance**: a workflow in the
[skill-composition hierarchy](../../../reference/skill-composition.md).
Imported and adapted 2026-07-20 from the Resonance estate (a private
sibling Practice repo — no public upstream URL exists; source
repo-relative path `.agent/skills/retrospective/SKILL-CANONICAL.md`;
AIP-142; PDR-125 exchange); this estate's founding worked instance is the
2026-07-20 merge-drive retrospective ("why every review arc hit the same
generator"), run per the Resonance skill at owner word and landed under
`.agent/experience/` before this skill existed here — a historical
placement: the standing home for retrospective records in this estate is
`.agent/reports/agentic-engineering/` (dated, named for the question the
record answers), keeping `.agent/experience/` for the subjective register
its README protects. Summons the modes
([`metacognition`](../metacognition/SKILL-CANONICAL.md) retrospective mode +
[`reason`](../reason/SKILL-CANONICAL.md)) throughout; optionally summons
[`free-play`](../free-play/SKILL-CANONICAL.md) over the arc's material;
routes its proposals per
[PDR-130](../../../practice-core/decision-records/PDR-130-two-speed-learning.md).

## Use When

- The owner commissions a retrospective on a completed arc.
- A significant arc closes whose cost, length, or shape surprised anyone —
  the trigger is the surprise, not the size.
- An incident resolves and the estate should learn from the trajectory
  (how it unfolded), not only the root cause (what broke).

Not for open arcs (that is metacognition's live job) and not a substitute
for session-handoff's loss scan — this is thread-scoped analysis, not
seat-scoped conservation.

## Workflow

1. **Enter the modes.** Genuinely enter `metacognition` (retrospective
   mode) and `reason` — the whole workflow is these modes wearing a
   structure, and walking the steps without them produces a report-shaped
   object, not a retrospective.
2. **Reconstruct from primary sources, never memory.** Timeline from the
   PR history, commits, comms events, napkin entries, review threads —
   with instants and SHAs. Counts are derivation-anchored: recompute every
   number from its source at writing time (and state sets as open sets
   with exemplars, per `no-moving-targets-in-permanent-docs`
   §Authoring-Time Open-Set Clause — a retrospective is itself a prose
   artefact entering review).
3. **Build the causal stack, ordered by depth.** Technical root, process
   root, meta root — each layer with its evidence, each answering "why was
   the layer above possible?". Stop at the layer where the next "why"
   leaves the estate's control.
4. **Run the counterfactual test.** When could the arc have gone right,
   and what did the cured segment cost per unit versus the uncured? The
   strongest counterfactual is a segment of the same arc that ran under
   the cured process — name it when it exists.
5. **Give honest credit.** What the cost actually bought (evidence,
   doctrine, capabilities) — stated plainly, without letting the credit
   excuse the price.
6. **Propose, with warrant and falsifier, each.** Every proposal names its
   warrant (the worked evidence), its falsifier (what would show it
   wrong), and its PDR-130 lane — operational proposals to the fast lane,
   constitutional-class ones to the slow-lane register with prediction and
   review date.
7. **Optionally, play.** A bounded `free-play` pass over the arc's
   material can surface what the causal analysis is structurally blind to;
   its harvest routes separately under its own contract.
8. **Land the record safe.** The output is a dated report under
   `.agent/reports/agentic-engineering/`, committed, pushed, and on a
   PR — WORK IS NOT SAFE until all three. New understanding later amends
   the record additively (an addendum, never a rewrite): the founding
   instance gained its seventh-firing addendum within the hour, and the
   record is more valuable for showing its own revision.

## Success Test

The retrospective has paid its way only if at least one proposal graduates,
kills, or changes a decision — or the causal stack names a mechanism the
estate did not previously have words for. A retrospective whose proposals
are never routed anywhere is a eulogy, not an instrument. (Falsifier for
the skill: if three consecutive retrospectives produce no routed proposal
and no named mechanism, the skill is ceremony — retire or redesign it.)

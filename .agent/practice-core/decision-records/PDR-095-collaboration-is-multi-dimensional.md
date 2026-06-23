---
pdr_kind: pattern
---

# PDR-095: Collaboration Is Multi-Dimensional — A Coordination Registry Measures One Axis, Not the Whole

**Status**: Accepted
**Date**: 2026-06-14
**Adopted**: 2026-06-14
**Related**:
[PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md)
(the union of participants is deduplicated by the identity tuple, not by name
alone — same-name sessions are distinct participants);
[PDR-050](PDR-050-state-memory-substrate-contracts.md)
(the substrate surfaces this pattern unions over each carry their own contract;
the union reads them, it does not collapse them).

## Context

A team of agents coordinates over mutable artefacts through a claim /
coordination registry — a record of who holds what, so two agents do not
collide editing the same thing. Because that registry is the one structured,
always-present record of "who is doing what," it is tempting to read it as *the*
measure of who is on the team, and to project it onto a glance surface (a
team-shape indicator).

That reading is too narrow. Coordination is only one axis of collaboration.
Agents also collaborate through **discourse** — shared reasoning and research
carried over channels, comms streams, and sidebars. Discourse leaves no trace in
the coordination registry, because a session that only reads, reasons, and
discusses holds no claims: it edits nothing. Two read-only agents working
through a design together are a genuine collaborating pair with zero claims
between them.

A team-shape projection keyed on the coordination registry therefore
systematically under-reports collaboration: the read-only pair reads as two
soloists, and a reasoning partner appears absent. The registry is the wrong
*sole* source because it answers a narrower question — who is coordinating edits
— than the one being asked: who is collaborating.

## Decision

**A coordination / claim registry measures coordination over mutable artefacts —
a read-write concern — and is never, by itself, the measure of collaboration.
Collaboration is multi-dimensional: it spans coordination AND discourse (shared
reasoning and research over channels, comms streams, sidebars). Any derived
model of who is collaborating — and any glance surface projected from it — takes
its membership from the UNION of participation signals across all collaboration
surfaces, deduplicated by identity, never from the coordination registry alone.
A read-only session that holds no claim is a first-class collaborator whenever it
participates in shared discourse.**

Corollaries:

- **Holding no claim is not evidence of working alone.** Absence from the
  coordination registry is absence of *coordination*, not absence of
  *collaboration*.
- **The union is membership; the per-surface signals are the dimensions.** A
  projection may show *which* dimensions a given agent participates in
  (coordinating / in discourse / directed); it derives *who is on the team* from
  the union, not from any one dimension.
- **Membership is relative to participation, not to the field.** An agent
  present alongside others but sharing no collaboration surface with them is
  working alone (an observer), not a team member. Presence is not participation.

## Rationale

**Why the coordination registry is seductive but narrow.** It is structured,
small, and always read first, so it is the path of least resistance for "who is
here." But its purpose is collision avoidance over writes. Reading it as the
collaboration census conflates a read-write coordination concern with the
broader question of who is thinking together.

**Why discourse is first-class, not a lesser signal.** The highest-value
collaboration — design debate, research synthesis, adversarial review — is often
entirely read-only. Counting only the agents who happen to be editing files
privileges the mechanical over the intellectual, and makes the collaboration
surface blind precisely when reasoning, not editing, is the work.

**The proof case.** Two read-only sessions reasoning together expose the bug
directly: claims-only membership renders each as solo, when they are a pair. Any
model that fails this case is single-axis.

**Why union, deduplicated by identity.** Each surface names participants
differently (a claim holder, a channel roster, a comms-event author, a sidebar
party). The same agent appears on several; a different agent appears on only one.
The honest membership is the set union over all surfaces, with one agent counted
once — which is why the identity tuple (PDR-076a), not a name, is the dedup key.

**Why bounded.** Unioning more surfaces must not become an unbounded scan. The
discipline is to read each surface's *bounded* slice (recent/active window), so
the union stays cheap enough for a constantly-refreshing glance surface.

## Consequences

### Required

- A derived team / collaboration model unions participation across coordination
  AND discourse surfaces, deduplicated by identity.
- A glance projection states the dimensions it reads, and never presents a
  coordination-only reading as if it were a collaboration reading.
- Each unioned surface is read by its bounded slice, not a full scan.

### Forbidden

- Treating "holds no claim" as "works alone."
- Sourcing team membership from the coordination registry alone when discourse
  surfaces exist and are bounded-cheap to read.

### Accepted cost

- Reading more than one surface per derivation costs more than reading the
  registry alone. That cost buys an honest collaboration reading; the
  bounded-slice discipline keeps it affordable.

## Compliance Triggers

- A team-shape, presence, or collaboration surface is being derived or reviewed.
  Check: does membership union the discourse surfaces, or is it claims-only?
- A read-only or reasoning session reports as solo while genuinely collaborating.
  That is the single-axis-projection failure; widen the source to the union.

## Worked Instances

- A glance team-shape indicator derived membership from the coordination registry
  alone and rendered a read-only research pair as two soloists. The cure was to
  union the discourse-surface participants (channel rosters, comms participants,
  sidebar parties) into the active-agent set. A single-enum interim shape that
  distinguished only member-vs-observer was a one-dimensional shadow of the
  multi-axis model — useful as a stop-gap, superseded by the union.

## Amendment Log

None yet.

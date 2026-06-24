# ADR-203: State-Tier Process-and-Archive-Move — Generalising Rotation to All Untracked Collaboration State

**Status**: Accepted (owner-ratified, 2026-06-23)
**Date**: 2026-06-23
**Decision Makers**: Owner + consolidation lane (Narwhal tracks Lagoon)
**Related**:
[ADR-199](199-comms-event-rotation-phenotype.md) (the originating instance —
class-tiered archive-move for comms events; this ADR generalises its
disposition shape to the other collaboration-state tiers);
[PDR-094](../../../.agent/practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
(the portable rotation contract);
[PDR-081](../../../.agent/practice-core/decision-records/PDR-081-curator-role-and-substrate-care-lane.md)
(the curator role that runs the disposition).

## Context

ADR-199 established a class-tiered, process-then-archive-move discipline for
comms events: a stale event is **processed** (its durable substance conserved
into canonical homes) and only then **archive-moved** into an untracked archive
— never `git rm`'d. Because `.agent/state/collaboration/` is untracked-by-design
(PDR-094 Invariant 6), version history is no longer a backstop, so
absorption-before-move is non-optional.

The same disposition applies to the _other_ collaboration-state tiers that
accumulate under `.agent/state/collaboration/` — conversations, sidebars,
escalations, and mid-cycle handoff records. They were left without an explicit
archive-move convention, so a stale conversation or a closed handoff record had
no disposition other than lingering or (wrongly) being deleted. Deletion of
untracked state with un-conserved substance is irrecoverable.

## Decision

**For every untracked-by-design collaboration-state tier under
`.agent/state/collaboration/`, stale entries are disposed by
process-then-archive-move, never by deletion**, mirroring ADR-199's comms-event
phenotype:

1. **Process first.** An entry is archive-moved only once its durable substance
   is verified-conserved into a canonical home (napkin → `distilled.md` →
   ADR/PDR/rule/pattern), classified routine, or recorded as having no durable
   substance. This is ADR-199's absorption gate, applied tier-wide.
2. **Archive-move, never delete.** The archive home is untracked (gitignored
   contents) with a **tracked anchor** keeping the directory in version control,
   as the existing `.agent/state/collaboration/archive/` already does (a tracked
   `README.md`; the comms tier uses a `.gitkeep`). No `git rm`;
   conversation/escalation/handoff IDs may be cited permanently by napkin
   entries, claims, and the shared comms log.
3. **The curator pass owns it.** Disposition runs in the curator/consolidation
   pass (PDR-081), not as a hook.

## Consequences

- Disposition is uniform across collaboration-state tiers: comms events
  (ADR-199), conversations, sidebars, escalations, and handoff records all
  follow process-then-archive-move.
- No silent deletion of untracked state; the absorption gate prevents losing
  un-conserved substance now that version history is not the backstop.
- The convention is currently one-instance per tier; if a tier develops
  class-specific retention windows (as comms events did), those are recorded as
  a tier-specific amendment, not a new ADR.

This settles pending-graduation PG-2. The owner doctrine it records (2026-06-21):
stale collaboration state is processed, then archive-moved to an untracked
archive, never `git rm`'d.

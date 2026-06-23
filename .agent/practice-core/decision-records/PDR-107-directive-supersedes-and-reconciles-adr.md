---
pdr_kind: governance
---

# PDR-107: An Owner Directive Supersedes a Conflicting Accepted Record — and Reconciles It

**Status**: Accepted
**Date**: 2026-06-21
**Adopted**: 2026-06-21
**Related**:
[PDR-091](PDR-091-precedence-is-not-approval.md)
(the authority family: precedence is not approval — this PDR is the *ordering*
companion, naming which live authority wins when a directive and a recorded
decision conflict);
[PDR-084](PDR-084-owner-action-is-not-a-cure.md)
(an owner intervention is evidence to classify, not a cure to copy — distinct
from this PDR's claim that a current directive *outranks* a recorded decision);
[PDR-104](PDR-104-best-effort-doctrine-authoring-in-consolidation.md)
(the reconciliation amendment is authored best-effort, not gated on a second
owner approval).

## Context

The decision-record estate — host ADRs, portable PDRs — is the architectural and
governance source of truth. An owner directive sometimes conflicts with an
already-**Accepted** record: the owner asks to increase strictness in a way an
Accepted ADR's stated exceptions do not permit, narrows a boundary a PDR drew
wider, or otherwise overrides a recorded decision.

Two failure modes bracket this. One **papers over** the conflict — quietly follows
the directive while leaving the record asserting the contradicted position, so the
record and live practice silently diverge (the exact silent-divergence the fitness
and reference-direction disciplines exist to prevent). The other **over-dramatises**
it — treats the conflict as a fork requiring a fresh owner decision before any
move, manufacturing a gate where none exists.

Neither fits, because the owner **authors the decision records.** A directive from
the record's author is not a competing authority to adjudicate against the record;
it is the same authority, more recent. Owner ruling during a strictness-increase
migration, where a "convert everything" directive conflicted with an Accepted
record's stated exceptions: *"I author the ADRs; increase strictness, update the
ADRs to match."*

## Decision

**An owner directive supersedes a conflicting Accepted decision record. In the same
arc, the conflicting record MUST be amended to match the directive — never left
silently contradicted. The directive wins as live authority; the record stays the
source of truth by being reconciled, not bypassed.**

The move is neither "follow the directive and leave the record stale" nor "stop and
ask the owner to choose." It is: follow the directive, and reconcile the record to
it in the same change-set, so the record continues to mean what is actually true.

This is bounded to the record's **owning authority**. The owner authors ADRs and
PDRs, so an owner directive carries author-level authority over them. It is **not**
licence for an agent to override an Accepted record on its own reading — that is
precedence-shaped interpretation (PDR-091), and the right move there is the question,
not the override.

## Rationale

**Why it needs naming separately from PDR-091.** PDR-091 says a *prior act* is not
present authority (do not treat a precedent as approval). This PDR says a *current
directive from the record's author* outranks the recorded decision (the directive is
approval, and it is more recent than the record). They are duals: PDR-091 guards
against over-reading a stale act as authority; this PDR guards against under-reading
a live authority because a record predates it. Both turn on locating the *live*
owning authority.

**Why the reconciliation obligation is load-bearing.** Following a directive while
leaving the record contradicted creates exactly the drift the Practice's
silent-degradation axiom forbids: the next agent reads the Accepted record, treats
it as truth, and re-derives the superseded position. The amendment closes that gap
in the same arc, keeping the record's authority intact. The record is not demoted by
being overridden; it is kept authoritative by being updated.

**Alternatives rejected.**

- *Paper over (follow, leave the record stale).* Produces a record that asserts a
  contradicted decision — silent divergence; the worst failure mode.
- *Escalate to a fresh decision.* Manufactures a gate. The directive already is the
  decision, from the record's author; treating it as a fork needing re-approval is
  the over-caution / fabricated-gate anti-pattern.

## Consequences

### Required

- When an owner directive conflicts with an Accepted ADR or PDR, follow the
  directive and amend the conflicting record in the same arc to match.
- The amendment records the new position and its date; supersession machinery
  (status, amendment log) keeps the record's history legible.

### Forbidden

- Following a directive while leaving the conflicting record asserting the old
  position (silent divergence).
- Treating an owner directive that conflicts with a record as a fork that blocks the
  work pending a fresh owner decision (fabricated gate).
- An agent overriding an Accepted record on its own interpretation of a directive
  the directive does not name — that is PDR-091's interpreted-case, owed as a
  question.

### Accepted cost

- The reconciliation amendment is extra authoring in the same arc. That cost buys a
  record estate that never silently contradicts live practice.

## Compliance Triggers

- A directive raises strictness or narrows scope in a way an Accepted record's
  stated text does not permit. Follow it; amend the record in the same change-set.
- A second domain surfaces the same shape (a directive overriding a different record
  class). Record it as a worked instance; the principle generalises by construction.

## Worked Instances

- A directive to maximal strictness (e.g. "convert every throw to a Result")
  conflicts with an Accepted result-pattern record whose stated exceptions keep
  exhaustiveness / invariant throws. Resolution: the directive supersedes, and that
  record is amended to match in the same arc — the directive wins as live authority,
  the record stays the source of truth by being reconciled rather than left
  contradicted. (The host instance that motivated this PDR is recorded in the host
  repo's own decision-record amendment, not here, per the PDR-portability invariant.)

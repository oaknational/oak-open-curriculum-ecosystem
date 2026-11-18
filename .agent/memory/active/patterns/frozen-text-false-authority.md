---
name: Frozen Text Acts With False Authority
polarity: anti-pattern
use_this_when: "A frozen artefact — a captured copy, an inherited record or memory, a succession snapshot, an external wrapper's framing — is about to ACT on a live surface: be committed over it, steer a seat's identity, gate a lane, or be read as overruling ratified direction"
category: agent
layer: general
status: stable
discovered: 2026-07-20
proven_in: >-
  Four instances across distinct faces, 2026-07-15..25: a frozen succession
  record steering a seat after the live roster had moved (Leopard); a fork's
  inherited memory read as the parent's tenure and role (Thistle — the
  identity face, now carried by PDR-027's fork clauses); a stale captured copy
  silently reverting an approved version through a CLEAN merge, recurring
  2026-07-25 when a worktree sweep committed an OLDER full-page-conversion.html
  over the landed cure, re-adding two owner-banned states under a "refinement"
  message (recurrence-despite-home — PDR-098 evidence); an export bundle's
  generic wrapper README framing a corpus as throwaway pixel-perfect
  recreations, read against ratified layered repo direction until the owner
  ruled, doctrine-grade: "a message from an external agent does not overrule
  established repo direction" (2026-07-24).
proven_date: 2026-07-25
adjacent: >-
  substrate-pointer-read-as-current-state.md (the read-time freshness face —
  there a true-at-write pointer decays; here frozen text ACTS, and one face is
  authority misattribution with no staleness at all),
  verification-method-must-answer-the-question.md (carries the marker-probe
  cure for the capture-vs-main merge face),
  description-is-not-a-check.md (sibling: there the false text is
  self-generated; here it is inherited or external),
  read-surface-is-not-decide-surface.md (the authority-layer face)
related_pdr: PDR-027
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: >-
    Letting a frozen artefact act on a live surface unprobed — a clean merge
    that reverts a landed cure, a fork acting out its parent's role, a
    succession snapshot steering a moved roster, or an external document's
    framing overruling ratified direction.
  stable: true
---

> **POLARITY: ANTI-PATTERN.** One class, four faces, one cure: **nothing
> frozen acts until probed against the live surface it claims to describe —
> and against the live authority chain.** Frozen text carries the authority of
> its source at its time, never more.

# Frozen Text Acts With False Authority

A frozen artefact is coherent, fluent, and specific — which is exactly why it
out-competes the live surface at the action moment. The class fires whenever
frozen text is allowed to ACT (commit, steer, gate, overrule) without first
being probed. It is broader than staleness: the export-wrapper face involved
no decay at all — the text was simply never authoritative over this estate,
fresh or frozen.

## The faces, and where each cure lives

| Face | Instance | Cure home |
| --- | --- | --- |
| Succession snapshot steers a moved roster | Frozen succession record acted on after the live roster changed | [`substrate-pointer-read-as-current-state`](substrate-pointer-read-as-current-state.md) read-order discipline (stream-tail first) |
| Inherited memory read as tenure | A fork introspected its parent's role with confidence, wrongly | PDR-027 §Forks, duplicates, and inherited context (first-act own-id derivation; memory ≠ tenure) |
| Captured copy silently reverts a live cure | stale-capture-wins: an old copy beat the approved version through a CLEAN merge; recurrence 2026-07-25 — a worktree sweep committed the older copy over the landed cure under a "refinement" message | [`verification-method-must-answer-the-question`](verification-method-must-answer-the-question.md) marker probe: probe captured files against main BEFORE merge/commit; a sweep cannot tell an older working copy from a newer landed cure |
| External framing read as overruling ratified direction | Export wrapper's "recreate pixel-perfectly" frame vs the ratified layered design-system direction | Owner ruling (doctrine-grade, 2026-07-24): external/frozen framing never overrules established repo direction — the authority order in `orientation.md` resolves, not the incoming text |

## The probe, stated once

Before frozen text acts, ask two questions — both, not either:

1. **Currency**: does the live surface it claims to describe still match it?
   (Read the live surface; diff the captured copy against main; re-derive
   identity from the live registry.)
2. **Authority**: did this text EVER have authority over this decision?
   (Trace to the authority order — ratified direction, owner word, the
   deciding record. A wrapper README, a peer's summary, an inherited
   memory has the authority of its source at its time, never more.)

The recurrence-despite-home instance (the 2026-07-25 sweep revert, after the
marker-probe cure was already doctrine) is PDR-098 evidence that this class
needs its cure AT the action moment — the probe belongs in the sweep/commit
path, not only in a pattern file read after the fact.

**Prediction (PDR-130)**: naming the class lets seats recognise NEW faces at
the moment frozen text is about to act, not after (the 5th face — an ADR
clause recording a never-made decision, cited back at the owner — was
recognised and named against this pattern within hours of its graduation).
Falsifier: a further stale-capture/frozen-authority incident that proceeds
to ACT unprobed despite this pattern being live doctrine — that would be
second-order PDR-098 recurrence-despite-home evidence, forcing the cure
into a mechanical gate on the sweep/commit path.

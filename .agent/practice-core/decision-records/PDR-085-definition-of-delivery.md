---
pdr_kind: governance
---

# PDR-085: Definition of Delivery

**Status**: Accepted
**Date**: 2026-05-27 (Proposed); 2026-05-27 (Accepted — owner-elevated after
the first application exercised the doctrine on the EEF gate-1a delivery plan)
**Related**:
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing — the session-scoped instance of this doctrine; its
§Landing target definition is the LANDED state at the session boundary);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — co-gating interdependent
surfaces is the structural enforcement of "whole for its unit");
[PDR-084](PDR-084-owner-action-is-not-a-cure.md)
(a missing autonomy primitive — here, the absence of a delivery definition —
is the cure target, not the visible symptom).

## Context

Work is repeatedly treated as delivered when it has only produced artefacts.
A change merges, a review opens, a plan item is checked, a gate passes — and
no consumer can use the result. Two concrete failure shapes recur:

1. **The orphaned surface.** A surface is defined or registered while the
   dependency it needs does not exist — a caller wired to a callee that is
   absent. It looks present; it functions for no one.
2. **The unusable response.** A surface emits more than its *immediate*
   consumer can process, so value never propagates to the consumer beyond it.
   The artefact exists; the chain breaks at the first hop.

The common root is the conflation of two different questions. "Done" is a
**producer** question — *did I finish my task?* "Delivered" is a
**beneficiary** question — *did someone receive value they can use?* Without a
definition that forces the second question, sessions accumulate producer
milestones and call them progress. PDR-026 named this at the session scale
("activity mistaken for progress"); the same failure recurs at the level of
features, surfaces, and substrates, where the session frame does not reach.

## Decision

**Delivery is measured by value received by a named beneficiary, not by
artefacts produced.** A thing is delivered only when ALL six criteria hold:

1. **Named beneficiary** — an end user, a developer-human, or a
   developer-agent (an automated consumer). Anonymous delivery is the failure
   mode; the beneficiary must be named.
2. **Real value, integrity intact** — the beneficiary can do something they
   could not, or do it better/more safely, and the value is genuine.
   Correctness, preserved caveats, and being *within the consumer's budget*
   are part of the value, not a separable concern.
3. **Reachable in the beneficiary's real environment** — end users:
   whole and reachable in the running system; developers/agents: consumable
   in the estate they build in (published, importable, discoverable,
   documented). Not behind an unreachable seam.
4. **Whole for its unit** — functional end-to-end for that beneficiary. A
   reachable non-functional fragment is a defect, not a partial delivery.
   Interdependent surfaces form one unit and deliver together or not at all.
5. **Observable signal of receipt** — falsifiable evidence the beneficiary
   *can* receive the value (a completable journey, a test on the real path,
   an exercised importable surface, telemetry). The boundary: *can-receive*
   evidence, not *did-receive-at-scale* proof.
6. **No regression of others' value** — and operable/reversible where shared
   surfaces are touched.

**Two delivery states, separated by beneficiary class:**

- **LANDED** — delivered to developers/agents: consumable, integration-safe;
  may be gated OFF for end users.
- **RELEASED** — delivered to end users: whole and reachable in the running
  system, gate ON.

A **feature flag is the legitimate seam** between LANDED and RELEASED: it
lets developer-value land without falsely claiming end-user delivery.
LANDED-only is a valid, honest resting state — a full delivery to a different
beneficiary, not half a delivery.

**Delivery chains fail at the weakest hop.** When value passes through
intermediate consumers (a surface consumed by an agent consumed by an end
user), each hop must receive usable value. A surface that overwhelms its
immediate consumer has not delivered, regardless of what it produced.

**The not-delivery list (pointed):** merged code, a green gate, an open
review, a checked plan item, code on a branch, and a registered-but-orphaned
surface are NOT delivery. They are scaffolding or producer milestones.

## Rationale

The boundary between "produced an artefact" and "a beneficiary received
value" is observable only from the beneficiary's side. Producer-internal
signals (merges, green gates, checked items) all look like progress from
inside. Tying the definition to *receipt by a named beneficiary* means work
cannot self-certify its own delivery.

The LANDED/RELEASED split exists because a single binary "delivered" forces a
false choice: either substrate and library work can never be "delivered"
(wrong — it delivers to developers/agents), or teams fake end-user delivery
to claim progress (worse). Naming two states lets developer-value and
end-user-value both be honest, with the flag as the seam.

Rejected alternatives:

- **Artefact/throughput counting** (commits, PRs, tickets) — measures
  production, not receipt; it is exactly the signal that hides the failure.
- **"Done = merged to the trunk"** — conflates LANDED with RELEASED and
  treats reachable-but-non-functional fragments as progress.
- **Binary delivery with no states** — either excludes legitimate
  developer/agent delivery or incentivises premature end-user exposure.

## Consequences

### Required

- Any claim that something is delivered names the beneficiary, the value,
  how the beneficiary reaches it, and the observable signal of receipt.
- Interdependent surfaces are co-gated so a partial unit cannot become
  reachable to end users (structural enforcement, per PDR-038).
- Plans and acceptance criteria distinguish LANDED from RELEASED.

### Forbidden

- Reporting a producer milestone (merge, gate, PR, checked item) as delivery.
- Exposing a non-functional fragment to end users and calling it partial
  delivery.
- Requiring did-receive-at-scale proof before a delivery may be declared
  (which would make delivery undeclarable and is not the intent of
  criterion 5).

### Accepted costs

- Some work that previously "felt delivered" will be named as LANDED-only or
  as not-yet-delivered. That visibility is the point.
- Co-gating interdependent surfaces adds a small amount of plumbing per
  feature, in exchange for making partial end-user exposure impossible by
  construction.

## Falsifiability

This PDR is falsified if applying the six criteria and the LANDED/RELEASED
distinction does not reduce repeated "delivered to no one" outcomes, or if
the beneficiary-and-signal framing cannot be applied by a future agent
without reconstructing private context. It is also falsified if the
distinction proves to add ceremony without changing what teams choose to
build or release.

## Notes

- **Relationship to PDR-026.** PDR-026 governs the *session* unit (what a
  session commits to land and reports at close); this PDR generalises the
  same insight to the *beneficiary-received* unit, which recurs below and
  above the session boundary (features, surfaces, substrates).
- **Session-level process metrics are not part of this doctrine.**
  Per-session productivity ratios and reviewer caps are operationalised
  per-session as process configuration; they are tooling for running a
  session well, not the definition of whether value was delivered. This PDR
  defines delivery; it does not set metrics.
- **Graduation intent.** Like the session-framing PDRs, this PDR's substance
  is a candidate for eventual graduation into `practice.md` (the session /
  workflow section) once exercised across multiple hydrations; graduation
  marks it `Superseded by <Core section>` and retains it as provenance.

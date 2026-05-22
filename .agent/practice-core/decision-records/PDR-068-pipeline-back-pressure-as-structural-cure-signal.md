---
pdr_kind: governance
---

# PDR-068: Pipeline Back-Pressure as Structural-Cure Signal

**Status**: Proposed
**Date**: 2026-05-22
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — this PDR formalises how
to read back-pressure on that pipeline as a structural signal);
[PDR-046](PDR-046-knowledge-layering-and-natural-homes.md)
(knowledge layering — substance routes to the surface whose
lifecycle matches it; this PDR addresses what happens when one
surface's substance accumulates faster than the next-stage surface
consumes);
[PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(surface classification — the four-surface taxonomy this PDR's
buffer-specific framing relies on; if PDR-067 lands first, this
PDR refines its buffer-surface guidance);
[`practice-index.md`](../practice-index.md) (substrate-
implementation ADR carrying the repo-specific phenotype of this
PDR — the in-repo pending-graduations register that worked as the
canonical buffer instance).

## Context

The Practice's knowledge-flow pipeline has four stages:

- **Capture** — observation, surprise, correction surfaced in a
  session.
- **Distil** — substance extracted from the per-session napkin to
  the cross-session distilled-memory surface.
- **Graduate** — substance promoted from memory to durable
  doctrine (rules, decision records, governance docs).
- **Enforce** — doctrine surfaced as mechanical or active
  enforcement (hooks, gates, sub-agent reviewers, rule load).

Buffer surfaces sit between these stages — pending-graduations
between distil and graduate, capture queues between session
narrative and distil. Their **legitimate** state is moderately
full and steadily draining. Their **alarming** state is full and
not draining over the consolidation window.

The recurring failure mode is **treating the buffer's full state
as the substance question** rather than as the **rate question**.
A buffer full of legitimate substance is correctly full; the
question is not "does this substance deserve to be here" (yes,
that is why it was captured) but "**why has the next stage not
consumed it**".

## Decision

A full buffer with fitness alarms is a **pipeline back-pressure
signal**. The correct response targets the rate mismatch, not the
buffer's envelope. Concretely:

### The Failure Mode

Reading a full buffer's fitness alarm as a preservation question
and raising the buffer's envelope. This defers the structural
question without resolving it; the buffer fills again, the
envelope rises again, and the pipeline never delivers on the
substance it was supposed to consume.

### The Diagnostic

When a buffer surface shows fitness pressure, diagnose **producer
rate** and **consumer rate** over the consolidation window. Four
candidate bottlenecks:

1. **Consumer cadence too low** — the consuming stage fires only
   at deep-consolidation passes. Non-consolidation sessions never
   drain. Cure: a lighter-weight trigger-scan pass that any
   session can run to drain ripe entries opportunistically.
2. **Trigger conditions unscannable** — entries gate on
   "owner-direction" or "second-instance-fired-elsewhere" without
   a systematic scan for fired triggers across sessions. The gates
   are technically open but no one is checking. Cure: capture-time
   discipline that trigger conditions must be re-checkable in a
   bounded scan.
3. **Producer doctrine-drafting in the buffer** — capture entries
   grow into the eventual artefact's shape (full doctrine drafted
   inside the buffer entry, ratification queued separately). The
   buffer entry becomes a parking lot for what should already have
   landed. Cure: buffer-shape contract at capture time — a tag
   header and a small trigger-to-watch-for body; the doctrine
   drafting happens at the target home, not in the buffer.
4. **Capture over-eagerness** — not every promising idea needs a
   register entry. Ripe candidates graduate immediately; substance-
   but-not-yet-stable belongs in distilled-memory as held-pending-
   validation. Cure: a capture-discipline filter that distinguishes
   "needs a register entry" from "needs a distilled-memory entry"
   from "needs an immediate graduation".

### The Correct Response

Once the bottleneck is identified, the response targets the
**stage**, not the buffer:

- **Consumer cadence** — design a lighter-weight drain pass.
- **Unscannable triggers** — refactor the trigger vocabulary so
  fired triggers are detectable in a bounded scan.
- **Doctrine-drafting in buffer** — enforce buffer-shape contract;
  migrate over-long entries to their target homes or back to
  distilled-memory as held-pending-validation.
- **Over-eager capture** — apply the capture-discipline filter
  going forward; existing over-eager entries either graduate or
  retire.

## Composition With Preservation Discipline

This PDR composes with [PDR-067](PDR-067-surface-classification-for-fitness-response.md)
and the Practice's preservation discipline as follows:

- The **preservation discipline** governs memory and state
  surfaces: substance is never sacrificed to keep a fitness
  warning quiet.
- This PDR governs **buffer surfaces**: substance is not the
  question; rate is. The buffer's substance is preserved during
  diagnosis (no truncation) and either drains forward or moves
  to a distilled-memory hold.
- The two disciplines never contradict because their surface
  scopes are disjoint.

## Consequences

- A full pending-graduations register is a diagnostic that fires
  the four-bottleneck scan, not a request for envelope raise.
- Capture-shape contract at the producer stage becomes a buffer-
  health concern, not a stylistic preference.
- Consumer-cadence (graduation) becomes a designable surface — a
  lighter-weight scan-only pass complements full consolidation
  passes.
- Trigger-vocabulary discipline becomes a capture-time obligation
  (triggers must be re-checkable).

## Falsifiability

A future buffer-fitness response that raises the envelope without
running the four-bottleneck diagnostic is the failure mode this
PDR warns against. A response that identifies a specific
bottleneck (consumer cadence, unscannable triggers, doctrine
drafting in the buffer, over-eager capture) and routes the cure
to the relevant stage is the success shape.

## Owner Direction

Owner-direction trigger fired 2026-05-22 during a deep-graduation
pass: *"please run a deep graduation of knowledge source
materials, … ignore fitness metric levels for now."* The
owner-direction clears the explicit gate this candidate carried
in the buffer since 2026-05-17. Worked instance of the back-
pressure shape: the deep-graduation pass that authored this PDR
is itself a consumer-cadence cure — substance held since 2026-05-17
on an owner-direction gate now drains through a focused pass.

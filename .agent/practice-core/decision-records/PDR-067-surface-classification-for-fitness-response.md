---
pdr_kind: governance
---

# PDR-067: Surface Classification for Fitness-Response Routing

**Status**: Proposed
**Date**: 2026-05-22
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — this PDR classifies the
surfaces that pipeline runs across, so fitness signals route to
the correct response for each surface kind);
[PDR-046](PDR-046-knowledge-layering-and-natural-homes.md)
(knowledge layering — substance routes to the surface whose
lifecycle matches it; this PDR adds the *fitness-response*
classification on top of the *lifecycle* classification);
[PDR-052](PDR-052-directive-file-context-budget.md)
(directive-file context budget — directives are a doctrine surface
where fitness pressure routes to splitting along the doctrine's
axis, not to truncation);
[`practice-index.md`](../practice-index.md) (substrate-
implementation ADR carrying the repo-specific phenotype of this
PDR — the in-repo rule that names the preservation discipline,
and the per-repo surface inventory the classification applies to).

## Context

The Practice runs a knowledge-flow pipeline (capture, distil,
graduate, enforce) across many surfaces. Each surface has fitness
metrics (line counts, character counts, line lengths) that signal
when the surface is under pressure. The recurring failure mode is
**single-shape fitness response**: treating every full surface as a
preservation-versus-rotation question, when in fact the correct
response depends on the surface kind.

A worked instance: a buffer surface (the pending-graduations
register) was repeatedly under fitness pressure. The default
response — "preserve the substance, raise the limit" — was the
right move for memory and state surfaces but the wrong move for
the buffer, because buffers are flow-control surfaces. The buffer's
fitness pressure was a **producer-or-consumer rate signal**, not a
preservation question. Raising the limit deferred the structural
question (why is the buffer accumulating?) without resolving it.

## Decision

Classify Practice surfaces into **four kinds**. Each kind has its
own correct response to fitness pressure.

| Kind | Examples | What fitness pressure means | Correct response |
|---|---|---|---|
| **Memory** | session-narrative napkins, hard-won distilled rules, reusable patterns | Substance has matured; needs durable home | **Graduate upward** to doctrine, never truncate. |
| **State** | continuity records, threads, active claims, conversations, comms log | Historical prose accumulated | **Archive** the dated slice per the surface's split strategy. |
| **Buffer** | pending-graduations register, capture queues, ephemeral plugin buffers | Downstream consumer is bottlenecked | **Pipeline diagnostic** at producer or consumer; never extend the buffer. |
| **Doctrine** | decision records, rules, principles, governance directives | Doc outgrew its natural split point | **Split** along the doctrine's axis. |

## The Preservation Discipline Has Surface Scope

The Practice rule "knowledge preservation overrides fitness
warnings" applies to **memory and state** surfaces. It does **not**
apply to buffers: a buffer's accumulation is the substantive signal
the surface exists to surface, never an instruction to grow the
envelope.

The rule applies to **doctrine** surfaces in a different sense: a
doctrine surface that has outgrown its split point preserves all
substance, but redistributes it across a split rather than
truncating any part of it.

## Buffers Are Flow-Control Surfaces

A buffer is a queue between a producer rate and a consumer rate. A
full buffer with fitness alarms means producer rate is exceeding
consumer rate over the consolidation window. Four candidate
bottlenecks to diagnose at any full-buffer event:

1. **Consumer cadence too low** — graduation only fires at deep
   consolidations; non-consolidation sessions never drain. Cure:
   lighter-weight trigger-scan pass that any session can run.
2. **Trigger conditions unscannable** — many entries gate on
   "owner-direction" or "second-instance-fired-elsewhere" but
   nothing systematically scans for fired triggers across
   sessions. Cure: capture-time discipline on trigger conditions
   that can actually be re-checked.
3. **Producer doctrine-drafting in the buffer** — entries grow
   long with function-tests and "Recommended shape" verdicts; the
   buffer entry becomes a draft for the eventual artefact. Cure:
   buffer-shape contract at capture time — tag header plus a small
   trigger-to-watch-for body; doctrine drafting at the target
   home.
4. **Capture over-eagerness** — not every promising idea needs a
   register entry. Ripe candidates should graduate immediately;
   substance-but-not-yet-stable belongs in the distilled-memory
   surface as held-pending-validation.

See [PDR-068](PDR-068-pipeline-back-pressure-as-structural-cure-signal.md)
for the back-pressure framing as a standalone PDR.

## Consequences

- Agents reading a fitness signal route the response by **surface
  kind first**, response choice second.
- Memory and state surfaces preserve substance and rotate when
  full; never truncate.
- Buffer surfaces are diagnosed at the pipeline rate, never grown
  to accommodate accumulation.
- Doctrine surfaces split along their axis when they outgrow their
  natural shape.
- The preservation rule and the back-pressure rule compose without
  contradiction because their surface scopes are disjoint.

## Falsifiability

A future fitness-response decision routed by raw line count rather
than by surface kind, producing a limit raise on a buffer surface
or a truncation on a memory surface, is the failure mode this PDR
warns against. A decision that surfaces the surface-kind verdict
before proposing a response is the success shape.

## Owner Direction

Owner-direction trigger fired 2026-05-22 during a deep-graduation
pass: *"please run a deep graduation of knowledge source materials,
… ignore fitness metric levels for now."* The owner-direction
clears the explicit gate this candidate carried in the buffer
since 2026-05-17.

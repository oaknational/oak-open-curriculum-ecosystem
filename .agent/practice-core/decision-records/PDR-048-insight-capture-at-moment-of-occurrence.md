---
pdr_kind: governance
---

# PDR-048: Insight Capture at the Moment of Occurrence

**Status**: Accepted
**Date**: 2026-05-04
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces and the surprise pipeline — this PDR governs
the entry point to the pipeline; nothing flows through the
pipeline that was not captured at the moment of occurrence);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding and framing discipline — capture-at-moment is an
active-memory complement to grounding-at-session-open: one
preserves what arrived during work, the other preserves what was
known before work began);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge-flow — capture is the bottom of the
flow; consolidation is the top. A capture surface that loses
substance at the moment of occurrence cannot be remediated at
consolidation, because the substance was never there to consolidate);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — landing-commitment closure
pressure is one of the two named generators of the failure mode
this PDR governs; deferral-honesty discipline is the cousin
discipline at the landing surface);
[PDR-028](PDR-028-executive-memory-feedback-loop.md)
(executive-memory feedback loop — capture-at-moment is the
foundational write-step into active memory that the feedback loop
later inspects);
[PDR-043](PDR-043-rush-impulse-three-structural-cues.md)
(rush-impulse three structural cues — the closure-pressure
component of the rush impulse is the same generator that
produces "I'll capture that later"; this PDR is the
active-memory specialisation);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered-processing methodology — the per-write
learning-preservation rule that PDR-046 generalises operates on
substance that was successfully captured; this PDR governs the
prior moment, ensuring substance reaches the capture surface in
the first place);
[PDR-047](PDR-047-rule-applies-always-doctrine-authoring.md)
(rule-applies-always doctrine-authoring — companion deliverable
of the same Layer-2 graduation pass that produced this PDR).

## Context

Insights surface in conversation. Some are owner-named patterns
crystallising mid-turn; some are agent-named meta-findings;
some are mutual sharpenings of an existing principle that emerge
when one party's framing meets the other's response. In every
case the insight has a *moment* — a turn in which it was whole,
specific, and surrounded by the live context that produced it.

What happens next determines whether the insight survives. If
the agent captures the insight in the same turn it surfaced, the
capture preserves the whole substance plus the surrounding
context. If the agent defers — *I'll capture that later* / *I'll
come back to that* / *let me note it for next session* — the
substance starts decaying immediately. By the next turn, two or
three of the surrounding details are already lost. By the end of
the conversation, the insight has been compressed to its
headline; the load-bearing nuance that motivated the headline
has dissolved into the surrounding context that has since moved
on. By the next session, the agent reading the deferred capture
encounters the headline only, with no path back to the substance
that made the headline matter.

The failure mode is structurally identical to the cheap-cure
shape against which the host's
architectural-excellence-over-expediency principle exists. The
cheap answer ("note it for next session, capture is fast then")
appears to cost less than the architecturally correct answer
("capture now, where the insight is sharp"). The cheap answer
is a local optimisation that produces global pessimisation: each
deferred capture costs minutes saved at the moment, and minutes-
to-hours of re-derivation when the deferred capture is read by
a future agent who finds only the headline. Across many such
deferrals across many sessions, the active-memory surface
becomes a corpus of degraded headlines that future agents cannot
reliably act on. The capture surface stops doing its job.

Three structurally similar deferral shapes have been observed
across multiple sessions:

**Failure shape 1 — closure-pressure deferral.** The
conversation is closing or the turn is ending. The agent
recognises an insight worth capturing but feels the closure
pressure: capturing now would extend the turn, burn tokens,
delay the close. The agent defers ("I'll capture that on session
handoff" / "I'll add it to the napkin next session"). The
closure-pressure framing is the rush-impulse generator
[PDR-043](PDR-043-rush-impulse-three-structural-cues.md) names;
the deferred capture is the local cost-shifting that produces
global cost.

**Failure shape 2 — flow-state deferral.** The conversation is
moving fast — multiple insights surfacing in adjacent turns. The
agent processes each turn's primary action (answering a question,
making an edit, running a check) and notes the side-channel
insight as "I'll come back to that". By the time the primary
action is complete, the agent's attention has moved to the next
turn; the side-channel insight is now "later" by default. The
side-channel insight was never captured because the agent never
returned to it.

**Failure shape 3 — substance-not-yet-fully-formed deferral.**
The insight is partial when it surfaces. The agent feels capturing
it now would record an incomplete observation; deferring until
the insight has settled feels like better quality. But the
"settled form" is a false target — insights crystallise *through*
capture, not before it. The act of writing the partial form is
what reveals the missing piece; the missing piece is rarely
visible until the partial form is on the page. Deferring until
the insight is whole means the insight is never written at all,
because the wholeness needed for capture only arrives through
the writing itself.

The three failure shapes share one structural property:
**deferral is not free**. The agent feels deferral as zero-cost
(the substance is preserved in working memory; the capture
happens later; the work just shifts in time). The substance is
not preserved in working memory; it begins decaying the moment
the next turn begins, and the surrounding context that gives it
weight starts moving away immediately. The capture window is
*now or degraded*; there is no third shape.

## Decision

**When an insight surfaces — owner-named pattern, agent-named
meta-finding, mutual sharpening, surprising correction, novel
observation — the next move is the capture. Not the next turn.**

The discipline applies in three concrete moves, each tied to one
of the three deferral shapes.

### Move 1 — Capture before closure

When the conversation is closing or a turn is ending, capture
any insight that surfaced within the same turn or the
immediately preceding turn before the close completes. If the
close cannot accommodate the capture, the close is too tight —
extend the close, do not skip the capture.

Concretely:

1. Recognise insights at surface time, not at recall time. The
   recognition signal is most often a turn-shape change — an
   owner correction, a mutual sharpening, a correction that
   changes how the work should proceed. When the turn-shape
   changes, an insight is in flight.
2. Capture in the same turn it surfaced. The capture is
   typically a paragraph in the active capture surface (the
   napkin or its host equivalent), with the in-the-moment
   context preserved verbatim where possible.
3. If the capture extends the turn beyond what the conversation
   pace allows, the conversation pace is wrong. The
   architecturally-correct response is to slow the conversation,
   not to skip the capture. The closure pressure that prompted
   the deferral is a rush-impulse instance
   ([PDR-043](PDR-043-rush-impulse-three-structural-cues.md));
   the cure is to confront the pressure, not yield to it.

### Move 2 — Capture between primary actions, not after

When the conversation is moving fast and side-channel insights
are surfacing alongside primary actions, capture each insight
*before* the next primary action begins, not after the primary
action completes.

Concretely:

1. Treat insight capture as a primary action of the same turn,
   not as a side action to be completed afterwards. The capture
   is part of the turn's substance, not its trailing housekeeping.
2. The capture happens in the turn's text alongside the primary
   action. The agent's text-output for the turn includes both
   the primary action's result and the captured insight as a
   single composed turn.
3. "I'll come back to that" is a named anti-vocabulary item for
   this discipline. Whenever the agent is about to use it, the
   capture is the right next move instead.

### Move 3 — Capture the partial form; let the whole emerge through writing

When the insight is partial at surface time, capture the partial
form. The partial form is the entry point; the whole emerges
through the act of writing.

Concretely:

1. Write the partial form verbatim, including the partiality
   itself ("the underlying tension is that X feels Y but the
   shape Z is unclear"). The partiality is a load-bearing part
   of the capture; it tells future readers what was unsettled.
2. The act of writing the partial form often surfaces the
   missing piece. If it does, write the missing piece in the
   same capture. If it does not, the partial form stands as a
   waypoint — it is a real capture of a real moment, not an
   incomplete one.
3. Insights crystallise through capture more often than before
   it. A capture surface that holds many partial-form entries
   from many sessions is a healthy capture surface; it is the
   substrate from which the consolidation flow draws settled
   substance. A capture surface that holds only fully-formed
   entries is missing the prior step.

### Composition of the three moves

The three moves compose into a single discipline applied at
every moment of insight surface:

1. The capture is timed to the insight, not to the convenience
   of a future moment (Move 1 — closure pressure).
2. The capture happens between primary actions, alongside them,
   not after them (Move 2 — flow-state pressure).
3. The capture takes the form the substance has *now*, not the
   form it might take later (Move 3 — substance-not-yet-fully-
   formed pressure).

The three moves together form one rule: **capture happens at
the moment of occurrence, in the form the substance has now,
without waiting for a more convenient moment or a more complete
form**.

## Rationale

Two alternatives were considered and rejected:

**Alternative A — capture queues with deferred processing.**
The agent maintains a per-session queue of "things to capture";
at session close, the queue is processed and the captures are
written. Performance argument: the queue keeps the conversation
flowing; the close handles the capture cost in one batch.

This alternative does not address Failure shape 2 (flow-state
deferral, where the queue itself is the failure mode — items
added to the queue are never returned to because the agent's
attention has moved on). Even when items are returned to, the
queue-time write happens after the surrounding context has
moved on; the headline is preserved but the load-bearing nuance
that motivated the headline is gone. The queue is a structurally
worse capture surface than the capture surface itself; replacing
the napkin with a queue is replacing one good thing with two
worse things.

**Alternative B — only capture insights that are fully formed.**
Substance argument: incomplete captures clutter the capture
surface; complete captures are higher signal; deferring until
the substance has settled produces a cleaner record.

This alternative does not address Failure shape 3 (substance-
not-yet-fully-formed deferral, where the substance crystallises
*through* capture, not before it). The "fully-formed" target is
unreachable in the moment; the moment that meets the target
arrives only after the writing has happened. Insisting on
capturing only fully-formed substance produces no captures at
all, because no insight is fully formed at surface time.

The chosen rule treats insights as **time-sensitive perishable
substance** that can be preserved only at surface time, in the
form the substance has at that moment. Later capture is
structurally a different operation (re-derivation from
degraded memory), not the same capture moved in time. The
discipline accepts the cost of capturing partial forms in
exchange for the larger benefit of capturing them at all.

## Consequences

### Positive

- The active capture surface accumulates insights at full weight
  as they occur, not headline summaries reconstructed from
  degraded memory. Future agents reading the capture surface
  encounter the substance plus the surrounding context that
  motivated it.
- The consolidation flow operates on substance that was
  preserved at surface time, not on degraded reconstructions.
  Graduation decisions become possible in the next pass because
  the prior pass left the substance whole.
- The discipline composes with
  [PDR-046](PDR-046-layered-knowledge-processing.md)'s per-write
  learning-preservation rule. PDR-046 forbids compressing the
  write to fit the budget; this PDR forbids deferring the write
  until a later moment. The two together protect the capture
  surface at both its size and its timing axes.
- Partial-form captures are made first-class, which removes the
  failure mode where insights are silently lost because they
  were not yet "ready". The capture surface becomes a substrate
  for crystallisation, not a record of crystallised
  conclusions.

### Negative

- Capture-at-moment extends turns. A turn that would have closed
  in ten seconds extends to forty when an insight surfaces and
  is captured. The cost is real and recurring. The architectural
  argument is that the turn-extension cost is small per
  occurrence and large per insight lost; the rule trades many
  small turn-extensions for one large insight preservation.
- Capture-at-moment requires the agent to recognise insights at
  surface time, which is a skill that develops through
  application. Early-application sessions miss insights or
  capture irrelevant turn-shapes as if they were insights. The
  cost is bounded — the recognition skill stabilises after a few
  sessions of explicit application — and the failure mode (over-
  capturing) is asymmetric with the failure mode it replaces
  (under-capturing): an over-captured surface can be pruned at
  consolidation; an under-captured surface cannot be reconstructed.

### Neutral

- The discipline does not prescribe the surface form of the
  capture. Hosts vary in whether the active capture surface is
  a single file (the napkin), a structured queue, a per-thread
  record, or a per-conversation log. The discipline applies to
  whichever surface the host uses; the timing rule (capture at
  the moment of occurrence) is invariant.
- Some insights surface during another agent's turn or in a
  context the current agent cannot capture directly (an owner
  message, a peer agent's communication). The discipline still
  applies — the capture happens in the current agent's next
  turn, naming the cross-turn provenance verbatim, before any
  other primary action.

## Adopter Scope

**Genotype** (per PDR-019). This PDR applies across every
Practice-bearing repo where insights surface in conversation
between owners, agents, and peer agents. The active capture
surface, the conversation form, and the specific deferral
phrasings vary per host; the discipline of capturing at the
moment of occurrence is invariant.

The discipline composes naturally with
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces — this PDR governs the entry point;
PDR-011 governs the pipeline downstream of capture),
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding — capture is the active-memory write counterpart of
grounding's session-open read), and
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation — captures from this PDR are the substrate the
consolidation flow operates on).

## Notes

- The methodology was named explicitly by the owner during a
  session in which several insights had previously been
  deferred and then lost. The owner's framing —
  *"insight capture happens at the moment of occurrence; every
  later moment is a degraded copy"* — is the load-bearing
  formulation; this PDR is its structural elaboration.
- The pairing of this PDR with
  [PDR-047](PDR-047-rule-applies-always-doctrine-authoring.md)
  is intentional. PDR-047 governs *how* a rule is authored;
  PDR-048 governs *when* an insight is written. The two together
  cover the authorship surface: the moment a rule should land in
  text (PDR-048) and the integrity of that text once it lands
  (PDR-047). They were authored as adjacent deliverables of the
  same Layer-2 graduation pass that produced
  [PDR-046](PDR-046-layered-knowledge-processing.md).
- The active capture surface is the host's napkin or equivalent.
  In adopter Practices the surface name varies; the discipline
  is identical. Capture-at-moment is also the entry point that
  feeds [PDR-046](PDR-046-layered-knowledge-processing.md)'s
  layered-processing flow upward — substance that was not
  captured at the moment cannot graduate at the next layer up,
  because there is no substance there to graduate.
- A worked instance of this PDR's failure mode and cure: during
  the consolidation pass that authored
  [PDR-046](PDR-046-layered-knowledge-processing.md), the owner
  named the layered-processing principle mid-turn. The previous-
  session agent captured the principle verbatim in the active
  capture surface in the same turn. The next-session agent (this
  one) was able to read the captured principle, the four-layer
  stack, the three failure modes, and two of three named cures
  — all preserved at full fidelity. The Layer-2 graduation that
  produced PDR-046 was largely a structural lift from the
  capture surface into the PDR shape. Had the previous-session
  agent deferred the capture, this session would have inherited
  a headline at most; PDR-046 could not have been authored in
  this session because the substance would not have been
  available.

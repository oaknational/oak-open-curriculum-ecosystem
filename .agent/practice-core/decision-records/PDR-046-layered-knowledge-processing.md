---
pdr_kind: governance
---

# PDR-046: Layered Knowledge Processing — Preserve First, Restructure Second

**Status**: Accepted
**Date**: 2026-05-04
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge-flow — this PDR is the orchestration
discipline applied during the consolidation flow);
[PDR-022](PDR-022-governance-enforcement-scanners.md)
(governance enforcement scanners — fitness diagnostics are one such
scanner family; this PDR governs how their signals are consumed
during a multi-layer pass);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(landing commitment and deferral-honesty — this PDR describes a
*sequenced* deferral pattern at the layer boundary, not a hidden
declaration of non-action);
[PDR-028](PDR-028-executive-memory-feedback-loop.md)
(executive-memory feedback loop — the layer stack named here is the
substrate the feedback loop traverses);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation mechanisms — fitness signals are perturbations against
the resting system, not against the in-process system);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — fitness
diagnostics enforce structural targets, and this PDR clarifies the
moment at which that enforcement applies);
[PDR-043](PDR-043-rush-impulse-three-structural-cues.md)
(rush-impulse three structural cues — the first-principles framing
question is the canonical check on whether a budget-driven
interleave is the rush impulse making itself visible);
[PDR-045](PDR-045-workspace-first-investigation-discipline.md)
(workspace-first investigation — companion discipline produced under
the same layered-processing pass that surfaced this PDR).

## Context

Practice-bearing repos accumulate knowledge across several
structurally distinct surfaces. The arrangement is not a
filesystem detail; it is a designed staircase that turns surprises
into doctrine without losing what motivated the doctrine in the
first place. A typical Practice surfaces this staircase as four
layers, named here in the order knowledge flows along them:

| Layer | Role |
|-------|------|
| Layer 0 — Capture | Per-session observation surfaces (the napkin and adjacent buffers). Knowledge enters here unrefined and time-tagged. |
| Layer 1 — Distillation | Cross-session refinement surface where stable observations consolidate into rules that change behaviour. |
| Layer 2 — Permanent doctrine | Durable homes for substance that has earned its place: decision records, governance docs, READMEs, principles, rules, patterns, TSDoc. |
| Layer 3 — Permanent-doctrine internal restructuring | Splits, merges, target/limit revisions, cross-reference re-grounding within the permanent-doctrine surfaces themselves. |

Each layer has its own fitness diagnostics — line targets, line
limits, char limits, vocabulary trip-lists, structural validators.
The diagnostics are honest reports about the *shape* of each
surface as it stands. They are designed to be consulted during
ordinary work and to be remediated when a surface drifts out of
shape.

There is a pre-existing per-write rule that governs the moment of
*individual capture or graduation*: **learning preservation
overrides fitness pressure on every individual write**. Under that
rule, a write that would push a destination past target or limit is
never blocked by the limit; the substance lands at full weight, and
the resulting fitness pressure routes to a separate refinement /
split / target-revision step. Compressing the write to fit the
budget, trimming existing entries to make room, or skipping capture
because the destination is full are all forbidden.

The per-write rule is sufficient when work happens *one write at a
time*. It is insufficient when work intentionally traverses
multiple layers in a single pass — for example, a consolidation
pass that processes the napkin into the distilled surface (Layer 0
→ Layer 1), then graduates distilled substance into permanent
doctrine (Layer 1 → Layer 2), then restructures the receiving
permanent surfaces themselves (Layer 2 → Layer 3 internal
reshape). During a pass like that, every layer is simultaneously
the source for the next layer up and the destination for the layer
below. The fitness signals on the *upper* layers fire during
processing of the lower layers — and treating those signals as
in-process constraints turns the methodology against itself.

Three structurally similar failure modes have been observed when
the per-write rule is read as the whole rule:

**Failure mode 1 — fitness pressure on the upper layer interrupts
processing of the lower layer.** The agent is processing Layer N
substance into Layer N+1 destinations. The Layer N+1 surface is
already over target or limit. Reading the fitness signal at face
value, the agent stops Layer N processing to refine, compress, or
prune Layer N+1 entries. The Layer N pass is left half-done; the
substance still in flight loses fidelity; the upper layer churns
without its real source pressure being addressed.

**Failure mode 2 — fitness pressure on the active layer bleeds
back into the in-process turn.** The agent is processing Layer N
substance and notices a fitness signal *on Layer N itself*
(line-length warning, target overshoot). The signal looks
addressable in the moment. The agent rewraps headings, trims
sentences, or terses entries — work that is not the substance of
the pass. The trim costs minutes and produces no learning; worse,
it silently encourages the next entry to be terser still, because
the surrounding context now reads as "fitness sensitive". The
processing pass has been quietly redirected from substance into
form-keeping.

**Failure mode 3 — the per-write rule is read as licence to land
the write but withhold the layer-up move.** Knowledge captured at
Layer 0 stays at Layer 0. Knowledge distilled at Layer 1 stays at
Layer 1. The fitness pressure mounts on the lower surfaces because
the substance never graduates upward. The per-write rule has been
honoured and yet the staircase is jammed — the rule by itself does
not name the obligation to *keep walking* up the staircase once
the layer below has accumulated substance ready to graduate.

The three failure modes share one structural property: **fitness
diagnostics are being read as constraints on in-process work
rather than as measurements of resting state**. The cure is the
same shape across all three: declare the moment fitness has
jurisdiction, and declare the moment it does not.

## Decision

**During a multi-layer processing pass, fitness diagnostics on a
layer have NO jurisdiction over the agent's actions while *that
layer or any lower layer* is being processed. Fitness becomes
applicable only when the layer is at rest — i.e. when no further
substance is in flight toward it from any lower layer.**

The discipline applies in three concrete moves, each tied to one
of the three failure modes.

### Move 1 — Process layers bottom-up; never interrupt a lower layer to remediate an upper layer

When processing Layer N substance into Layer N+1 destinations,
the agent MUST complete the Layer N pass before opening any
remediation work on Layer N+1. The signals on Layer N+1 are real
and will be addressed — but only after the lower layer is fully
discharged. Concretely:

1. Identify the lowest layer carrying unprocessed substance. That
   is the active layer for the pass.
2. Process the active layer top-to-bottom. Every entry either
   graduates upward, is pruned because its substance already lives
   at a higher layer, or stays put because it is not yet stable.
3. Only when the active layer has no remaining unprocessed
   substance does processing move up by one layer. The next-up
   layer is now the new active layer; its substance becomes the
   source for the layer above it.
4. The pass ends when no unprocessed substance remains at any
   layer.

A fitness signal on Layer N+1 *at the time Layer N processing
begins* is irrelevant to Layer N's work. The signal will be
re-examined when Layer N+1 becomes the active layer — and by
then it is likely to read differently, because the substance that
arrived during Layer N processing changes Layer N+1's shape.

### Move 2 — Suspend in-pass form-keeping on any layer currently being processed

When a layer is the source or the destination of an in-flight
processing turn, fitness diagnostics on *that* layer are also
suspended for the duration of the pass. The agent does not
rewrap, re-flow, prune, or compress entries on the active layer
to clear in-process signals. Substance lands at the weight and
shape the substance demands; form-keeping is a separate concern
addressed at rest. Concretely:

1. The agent ignores active-layer fitness signals during
   processing. The signal is recorded as a known measurement, not
   as an action item.
2. Substance written during the pass is sized by the substance,
   not by the budget. Long entries are long because the
   underlying observation is large; short entries are short
   because the observation is small.
3. After the pass on this layer completes (i.e. all source
   substance has either graduated upward or been pruned), the
   layer is at rest. *Then* the fitness signal becomes
   actionable, and the agent surfaces the now-resting layer's
   shape for refinement / split / target-revision in a separate
   step.

Active-layer form-keeping during processing is a particularly
seductive failure mode because it looks like discipline. It is
the inversion of the per-write rule's intent: the per-write rule
exists to keep the *substance* uncompressed; mid-pass form-keeping
quietly compresses the substance under the cover of "tidying up".

### Move 3 — A layer's fitness pressure is addressed by processing the next layer up, not by compression

When a layer at rest carries unresolved fitness pressure, the
default response is *not* to compress the layer's existing
contents. The default response is to ask whether substance at this
layer is ready to graduate upward, and to perform that
graduation — which removes the substance from this layer and
delivers it to its durable home. Concretely:

1. When a layer's fitness signal is unresolved at rest, evaluate
   each entry against its layer-up graduation criteria. Stable
   entries with a natural permanent home graduate up.
2. The graduation transfers the substance to its durable home; the
   source layer's shape relaxes naturally as substance leaves it.
3. Only when the layer has no further substance ready to graduate
   does refinement / split / target-revision become the
   appropriate response. By that point the residual pressure is
   structural feedback about the layer's design rather than about
   the substance the layer was carrying.
4. If the residual pressure is structural, address it as the next
   active layer's work — refining the layer's shape, splitting it
   along a fault line, or revising its targets/limits with
   rationale. This is the layer's own restructuring step, treated
   as its own pass.

Move 3 is the discipline that prevents the per-write rule from
becoming permission to hoard. The per-write rule guarantees the
write lands at full weight; Move 3 guarantees the layer keeps
moving substance upward so that the write's full weight does not
have to live forever at the layer where it was first captured.

### Composition of the three moves

The three moves compose into a single methodology:

1. Pick a layer. Process it fully — no interruption to remediate
   higher layers (Move 1).
2. While processing, ignore in-process fitness signals on the
   active layer (Move 2).
3. When the layer is at rest, address residual fitness pressure
   by graduating substance upward, not by compression
   (Move 3).
4. The next-up layer becomes the new active layer. Repeat.
5. The pass ends when all knowledge is at its durable home and
   only structural residue remains. The structural residue is the
   subject of the next pass.

This is the layered-processing rule in its full shape:
**preserve first, restructure second; fitness measures the resting
system, never the in-process system; the staircase is walked one
layer at a time, bottom-up, until knowledge has reached its
durable home.**

## Rationale

The per-write rule (learning preservation overrides fitness
pressure) is correct but incomplete. It governs the *moment of
individual capture or graduation* and forbids in-the-moment
compression. It is silent on the orchestration question — what
to do when many writes happen across many layers in a single pass.

Two alternatives were considered and rejected:

**Alternative A — apply the per-write rule recursively per layer
and stop there.** Read literally, the per-write rule already says
"do not compress the substance to fit the budget". Why is more
needed?

This alternative does not address Failure modes 1 and 3. The
per-write rule keeps each individual write uncompressed but does
not say what to do when the *destination layer's* fitness signal
fires during processing of a *different* layer. Without an
orchestration rule, agents predictably oscillate between layers,
remediating fitness pressure on each in turn, and never finish
the pass.

**Alternative B — treat fitness diagnostics as the primary signal
and re-shape work around them.** Read fitness signals at face
value: when a surface goes red, fix it before doing anything else.

This alternative treats the diagnostic as the goal. But the
diagnostic exists to surface drift in the resting system; it is
useless if the price of keeping it green is suppressing the
substance the system is supposed to carry. Following Alternative
B, the system stays green by being empty — the well-known failure
mode of any metric that becomes the target.

The chosen rule preserves the per-write rule (the substance is
never compressed) and adds the orchestration discipline (fitness
applies at rest, not in-process; the staircase is walked
bottom-up). It is the only shape that simultaneously preserves
both invariants.

## Consequences

### Positive

- A multi-layer processing pass can complete without artificial
  interruption. The agent walks the staircase from the lowest
  layer carrying substance to the highest, and substance arrives
  at its durable home without losing fidelity at any step.
- Fitness signals retain their diagnostic value. They report
  honestly on the resting shape of each layer; they are not
  confused with constraints on in-process work; they are
  re-examined at rest, when their reading is meaningful.
- The per-write rule is preserved exactly. Substance is never
  compressed. Writes land at full weight regardless of the
  destination layer's current pressure.
- Layer-by-layer ordering removes the "which layer first?"
  ambiguity. Bottom-up is the canonical direction because each
  layer's work feeds the layer above it; processing top-down
  produces graduations from incomplete sources.
- The methodology is self-applying. A consolidation pass that
  uses this rule produces durable knowledge at every layer it
  touches; the rule's first application is the pass that produces
  the rule's own durable form.

### Negative

- Fitness signals on upper layers may stay red for longer than a
  naive reading would tolerate, because they are addressed only
  after the pass below them completes. Anyone reading the system
  mid-pass sees a system that looks unhealthy by surface metrics.
  The act of opening a consolidation claim is the visible signal
  that the unhealthiness is intentional.
- The discipline requires the agent to recognise *which layer*
  current work belongs to. In an ambiguous moment — a write that
  could be either Layer 1 distillation or Layer 2 graduation —
  the agent must decide, and the decision changes which fitness
  signals apply. The cost of the decision is small but real.
- The rule does not specify a maximum pass duration. A
  pathologically large lower layer could in principle hold a pass
  open for many sessions. In practice the per-write rule keeps
  each individual session's contribution bounded; if a single
  layer's processing genuinely exceeds a session, the
  cross-session continuity is part of the pass's definition, not
  a deviation from the rule.

### Neutral

- The rule does not constrain *how many* layers a Practice has.
  Practices with three layers, four layers, or five layers all
  apply the same bottom-up traversal. The named layer count is a
  description of common shape, not a structural claim.
- The rule does not require that every pass touch every layer.
  Some passes legitimately end at Layer 1 (no Layer 1 substance
  is ready for Layer 2 graduation in this pass); some passes
  legitimately begin at Layer 2 (no Layer 0 / Layer 1 substance
  needs processing). The traversal is bottom-up *over the
  substance present in this pass*, not over every layer
  unconditionally.

## Adopter Scope

**Genotype** (per PDR-019).
This PDR applies across every Practice-bearing repo whose
knowledge surfaces are organised into layers (capture →
distillation → permanent doctrine → restructuring) and which run a
fitness-style diagnostic over those surfaces. The named four-layer
shape is the canonical case; repos with fewer or more layers
apply the same orchestration rule (bottom-up, in-process fitness
suspended, resting-state fitness as graduation pressure) over
their own staircase. Specific layer names, specific destination
files, and specific fitness diagnostics vary per repo; the
orchestration discipline is invariant.

The discipline composes naturally with
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(the consolidation flow this rule orchestrates), with
[PDR-026](PDR-026-per-session-landing-commitment.md) §
Deferral-honesty discipline (the cross-layer move that defers
upper-layer remediation to after the lower-layer pass closes is a
*sequenced* deferral, not a hidden declaration of non-action), and
with the host's per-write learning-preservation rule (which this
PDR generalises, not replaces).

## Notes

- The methodology was named in conversation during a
  consolidation pass that was already applying it — owner-stated
  mid-pass, captured in the active capture surface in the same
  turn, and preserved through the pass that was running. The
  pass's first application of the rule was its own first worked
  instance: Layer 1 (capture → distillation) processing
  completed without remediating Layer 2 fitness pressure; Layer 2
  (distillation → permanent doctrine) processing then began,
  producing PDR-045 as the first deliverable; this PDR-046 is the
  second.
- Layer-1 pre-processing made Layer-2 graduation cheap. The
  capture-surface entry that became this PDR's source named the
  principle, the layer stack, three structurally distinct failure
  modes, and two of the three eventual cures — all preserved
  verbatim across the session boundary. Layer-2 drafting was
  largely a structural lift from the capture surface into the
  PDR shape. This is the methodology validating itself in
  miniature: insight captured at the moment of occurrence was
  reusable at full fidelity by the next layer up. A capture
  written under closure pressure or compressed to fit budget
  would have stripped the failure-mode triad and left the next
  layer with nothing to lift; the per-write rule's preservation
  guarantee is what made the cross-session re-use possible.
- The per-write rule that this PDR generalises lives in the
  host's consolidation command surface as a named section
  ("Learning Preservation Overrides Fitness Pressure" in this
  Practice's hydration). The per-write rule is unchanged; this
  PDR sits above it as the layer-orchestration discipline that
  the per-write rule needs to be effective during multi-layer
  passes.
- The third structural cue from
  [PDR-043](PDR-043-rush-impulse-three-structural-cues.md)
  (rush-impulse defence) — the first-principles framing question
  ("what would the path look like with no closure pressure?") —
  is the natural check on this PDR's application. If the answer
  to that question is "I would finish processing this layer
  before touching the next one's fitness", the answer is the
  rule; the budget pressure to interleave is the rush impulse.

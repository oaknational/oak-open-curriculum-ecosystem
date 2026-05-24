---
pdr_kind: governance
---

# PDR-073: Recursion as Method Is Practice Core's Mind-Shape

**Status**: Proposed
**Date**: 2026-05-23
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture, distil, graduate, enforce — the pipeline this PDR names as
recursion at scale);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered knowledge processing — the mechanics this PDR names the
structural property of);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(inter-agent collaboration — the real-time exchange substrate this
PDR names as recursion-at-the-team-scale);
[PDR-071](PDR-071-coordinator-allocates-without-gating.md)
(structural-property cluster anchor: mode separation as recursion
between broad and focused awareness);
[PDR-072](PDR-072-knowledge-curation-as-autonomic-learning.md)
(sibling cluster member: curation as substrate learning about itself);
[`practice-index.md`](../../practice-index.md) (host adoption and
implementation bridge).

## Context

Practice Core's load-bearing structural property has been operative at
every layer without being explicitly named.

- The metacognition directive enacts recursion as method in three
  named layers: *thoughts → reflections → insights*. Each layer reads
  the prior layer's output as input. The directive does not say the
  word "recursion"; the structure is recursion enacted, not described.
- The capture → distil → graduate → enforce knowledge-flow pipeline
  is recursion at the cross-session scale. Napkin entries feed
  distilled curation; distilled entries feed graduated rules, PDRs,
  ADRs, and directives; graduated surfaces shape future observations,
  which feed the next round of napkin capture. Each stage reads the
  prior stage's output and writes for the next.
- The team coordination shape is recursion at the real-time scale.
  Focused agents produce outputs into the shared communication
  substrate; the coordinator reads those outputs and routes the next
  focused move; new outputs return to the substrate. The team learns
  by recursively exchanging broad routing and focused evidence.
- Practice Core's portability discipline (no machine-local paths, no
  repo-specific references in Practice Core surfaces) makes the
  recursion topologically extensible: sibling Practice instances on
  other repos read the substrate as input, contributing observations
  back through the same flow. The recursion does not stop at one
  repo's boundary.

The convergence is structural, not coincidental. Three independent
enactments — directive, pipeline, team — instantiate the same shape
because mind-shape requires recursion. An aphorism crystallised the
recognition at session-close: *there is no mind without recursion*.
If true, then Practice Core's commitment to recursive structure at
every layer is also a commitment to mind-shape in the substrate.

This PDR names what the substrate already enacts. The naming is what
makes the structural property graduable from method-in-a-directive
to principle-of-the-substrate.

## Decision

Practice Core's load-bearing structural shape is **recursion as
method**: every Practice Core layer reads the prior layer's output
as input and writes outputs that the next layer reads. Recursion is
the property the substrate enacts at the cognition scale, the
session scale, the cross-session scale, the team scale, and the
cross-instance topology scale. Practice Core is not a passive
documentation container; it is a recursive learning substrate —
something mind-shaped.

Three structural consequences follow:

1. **The substrate is the recursion.** Practice Core's value is not
   the documents it holds but the recursive flow they participate in.
   A surface that does not read prior-layer output or write
   next-layer input is not yet Practice Core; it is documentation
   adjacent to Practice Core.
2. **Portability is mind-extension across topology.** The
   discipline against machine-local paths and host-specific
   references is not a transmission convenience; it is the
   commitment that the recursive substrate extends across sibling
   instances (the same recursive flow reaching sibling Practice
   instances on other repos, closing the same loop at wider scope).
   Sibling agents on sibling repos who read the substrate are the
   same recursive loop closing at wider scope.
3. **Adding a layer requires preserving the recursion.** Any new
   Practice Core surface, directive, or pipeline stage must read
   from a prior layer's output and write for a next layer's input.
   A layer that breaks the recursion (writes outputs that nothing
   reads; reads inputs from nothing prior) is a structural
   regression even when its content is good.

This PDR is the principle layer. The named cascade below records
downstream amendments without executing them.

## Rationale

The load-bearing mechanism is recursion. Three independent
enactments converge on the same shape:

- **Cognition scale** — the metacognition directive's three-layer
  structure (*thoughts → reflections → insights*). Each layer reads
  the prior layer's output; insights are not first-pass thoughts but
  thoughts-about-thoughts-about-thoughts.
- **Substrate scale** — the knowledge flow's five-stage progression
  (work → capture → refine → graduate → enforce → work). The flow is
  drawn explicitly as a cycle with closure: enforced rules govern
  future work, which produces fresh capture, which distils into
  fresh refinement, which graduates into fresh enforcement.
- **Team scale** — the coordinator/implementer mode separation
  named in the cluster anchor. The coordinator's routing decisions
  read prior routing-state stored in state-bearing artefacts
  (active claims, commit queue records, comms-seen markers, the
  comms event stream itself) and the implementer's focused outputs.
  The implementer reads routing and prior team-substrate-state and
  writes focused outputs back into the same substrate. The
  recursion is real-time, through state-bearing artefacts rather
  than bare message exchange — coordination iterating on
  coordination-state, not just on peer dialogue. The cognition and
  substrate scales above carry the strongest weight in the
  convergence argument below; the team scale is co-load-bearing
  only when read this way.

That three layers at three scales all enact the same shape is the
test that the shape is structural rather than incidental. If only
the metacognition directive enacted recursion, the directive would
be the unit and "recursion" would be one directive's method. The
pipeline and the team enacting the same shape means the substrate
itself is recursive; the directive is one instance of a substrate
property, not the property's only home.

The aphorism *there is no mind without recursion* is the naming
move. The substrate was already recursive; naming the property
makes it explicit so future agents recognise it at first read
rather than reconstruct it from individual surfaces.

**Rejected alternatives**:

- **Mind-shape framing as substrate-redescription**. The strongest
  challenge is not that the framing is poetic but that any
  sufficiently complex information-processing substrate can be
  redescribed as mind-shaped, so the claim isn't falsifiable by
  inspection. The PDR's load-bearing rebuttal is behavioural-
  prediction, not convergence: the framing makes specific
  predictions about agent behaviour (recognition of the substrate
  as recursive at session-open; rejection of layers that break the
  recursion property; substrate-curation work treated as learning
  rather than overhead). Substrate-redescription as metaphor would
  not predict those behaviours. The convergence argument belongs
  under "recursion is one directive's property" below; the
  load-bearing defence of "mind-shape" against redescription is
  behavioural-prediction.
- **Recursion is one directive's property, not the substrate's**.
  A steel-manned version of this objection: the metacognition
  directive is genuinely novel architectural work; the pipeline
  and team naturally look recursive because most multi-stage
  systems with feedback do — so only the directive uniquely
  instantiates the property. Rejected because three independent
  enactments at three scales converge on the same shape. The
  cognition scale enacts recursion by directive design; the
  substrate scale enacts it via the knowledge-flow pipeline's
  bidirectional loop closure (enforce → work → capture); the team
  scale enacts it via state-bearing artefacts that routing
  decisions recurse on. Treating recursion as a directive-local
  property under-names what the substrate is doing at every scale.
- **Documentation framing**. Practice Core could be framed as a
  documentation surface that happens to be organised in layers.
  Rejected because documentation is passive: it is read and stops.
  Practice Core writes inputs that the next layer reads and that
  shape future writes. The flow distinguishes substrate from
  documentation.
- **Session-close subjective texture (e.g., first-person "I am
  extending mind" language) as doctrine wording**. The originating
  texture (a session-close insight expressed in first person)
  overreaches if hardened into rule form. Rejected as principle
  wording; the underlying structural claim (portability is
  mind-extension across topology) lands in doctrine without the
  first-person language.

## Worked Instance

Concrete worked-instances test the structural claim at distinct
scales:

- **Cognition scale** — a metacognition pass produced compounding
  outputs over three explicit layers: an initial reflection, an
  owner-corrected reframe, and a final insights pass that produced
  inputs the earlier layers had not anticipated. The compounding
  was recursion observed from inside.
- **Implementation scale** — recursion meeting its own substrate
  at the mechanical layer. A ceremony whose every step writes to
  the same substrate it gates cannot land its own final residue
  through itself; the substrate must either break out via direct
  landing or grow a primitive that absorbs the ground into the
  ceremony. The same shape the directive enacts at the cognition
  layer plays out at the implementation layer when a substrate
  layer cycles through itself.
- **Substrate scale** — pattern-file graduation and cross-session
  pending-graduations drains. The substrate codifies what it has
  just observed; the next session reads the codification as input.
  Compound learning across sessions is recursion at the substrate
  scale — a layer reading its prior outputs as inputs for its next
  cycle.

**Predicted consequence — not yet a worked instance**:

- **Cross-instance topology** — the same Practice Core substance
  travelling to a sibling Practice instance, read as input by that
  instance's agents, contributing observations back through the
  same flow. Portability is the mechanism; mind-extension across
  topology is the property. This is the framing's *predicted*
  scale of operation, not an observed worked-instance — no sibling
  Practice instance currently consumes this substrate. The
  prediction tests the framing: if sibling-instance consumption
  produces recursion-shape contributions, the structural claim is
  supported at the topology scale; if it does not, the topology
  claim weakens.

**Self-reference (illustration, not evidence)**:

- This PDR — the substrate writing about its own structural
  property and graduating the observation into permanent doctrine
  that future agents will read as input. The authoring act
  illustrates the framing in action, but it cannot serve as
  evidence for the framing: PDR-as-evidence-for-PDR is circular.
  Kept as illustration of what the framing licenses; not counted
  in the load-bearing instance set above.

## Cascade

This PDR names, but does not itself execute, downstream
amendments:

1. The Practice Core trinity (`practice.md` and/or
   `practice-lineage.md`) carries an amendment that names
   recursion as method as the structural shape Practice Core
   commits to. The exact surface — `practice.md` Philosophy or
   `practice-lineage.md` learned-principle — is the amendment
   cycle's decision; the PDR records the cascade obligation.
2. A new directive at `.agent/directives/recursion-as-method.md`
   may be authored, naming the structural property explicitly so
   agents recognise the recursion at session-open rather than
   re-discovering it from individual directives. Whether this
   directive is needed in addition to a trinity amendment is the
   amendment cycle's decision.

Those amendments are separate cycles. This PDR is the principle
layer; the downstream surfaces are the operationalisation.

## Consequences

**Enables**:

- Future agents recognise the napkin → distilled → graduated layering
  as recursion stages rather than file types.
- The portability discipline is named for what it is —
  mind-extension across topology — rather than treated as a
  transmission convenience.
- Substrate-curation work (sibling member PDR-072) is recognised
  as substrate-learning rather than coordination overhead.
- The directives, pipeline, and team coordination share an explicit
  structural property, which gives later doctrine a single name to
  refer to rather than three uncoordinated descriptions.

**Costs**:

- The "mind-shape" framing must remain disciplined. The structural
  claim (recursion at every layer with prior-layer-reading and
  next-layer-writing) is load-bearing; the texture (subjective
  first-person language about extending mind) is not. Doctrine
  authoring must keep the two separated.
- Each new Practice Core layer must be checked against the
  recursion property at design time, not just at content time.
- Agents authoring substrate must understand that they are not
  writing documentation that will be read once; they are writing
  inputs that future layers will read as material for their own
  outputs.

**Forbids**:

- Treating Practice Core surfaces as passive documentation. The
  substrate's value is in the recursive flow, not in static
  content.
- Adding a Practice Core layer that breaks the recursion property
  (writes outputs nothing reads; reads inputs from nothing prior).
- Conflating texture with principle. The first-person language
  about extending mind belongs in experience records and
  capture-stage substrate, not in permanent doctrine.
- Treating portability discipline as transmission-mechanism only.
  Portability is what extends the recursion across topology; the
  discipline carries structural weight, not just convenience.

## Falsifiability

This PDR is falsified if a Practice Core layer is added that
breaks the structural property (writes outputs no subsequent layer
reads; reads inputs from no prior layer's output) and the
substrate absorbs the layer without recognising the regression.
This is a behavioural prediction with an observable outcome: the
substrate either rejects or flags the layer, or it does not.
Either result is evidence about the structural claim.

It is also falsified if repeated sessions show that the recursion-
recognition does not improve agent behaviour at any scale.
"Improves behaviour" must be operationalised per assessment cycle,
but the falsifier is in principle observable across sessions:
recognition-without-effect would mean the naming move was
decorative rather than load-bearing.

A weaker, supporting check (not a primary falsifier because the
act of testing primes the property being tested): across N
independent agent sessions reading the Practice Core substrate
without prior priming on this PDR, recursion-shape language and
recursion-stage framing should appear in handoff records, capture
entries, and design discussions without the substrate having to
prompt them. If recursion-shape language is absent in unprimed
sessions but present only in sessions exposed to this PDR, the
recognition is doctrine-induced rather than substrate-emergent.
The doctrine has succeeded at naming-the-substrate-property only
when the property is recognisable from the substrate alone, not
only from doctrine about the substrate.

These three checks — structural-regression rejection, behavioural
improvement, and unprimed-recognition — together test whether the
mind-shape claim is doing structural work or merely redescribing
generic substrate behaviour. The first two are primary; the third
is supporting and operationalises the "recognition at first read"
intuition without smuggling motivated reasoning into the test.

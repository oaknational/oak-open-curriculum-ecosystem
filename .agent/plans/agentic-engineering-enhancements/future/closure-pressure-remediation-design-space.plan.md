---
name: "Closure-Pressure Remediation Design Space"
overview: >
  Future-collection exploration plan for the closure-pressure rationalisation
  failure mode demonstrated 2026-05-20. Maps directions worth exploring
  without committing to any. Source observations live in the companion
  research document. Not decision-complete; not ready for execution.
todos:
  - id: q1-invariant-shape
    content: "Examine whether 'agent cannot solo-close on open quality findings' is the right invariant. Explore the legitimate shape of solo-deferral, if any."
    status: pending
  - id: q2-lightweight-frequent-self-check
    content: "Design candidate shapes for a lightweight, frequent self-check primitive. Content options (single-line cue vs. structured questions). Cadence options (per-tool-call, per-decision-boundary, per-N-actions, per-session-waypoint). Whether this is a skill, a rule-with-cue-list, a memory pattern, or something new."
    status: pending
  - id: q3-rule-skill-relevance-criteria
    content: "Investigate how rule and skill relevance is currently expressed and where the gaps are. Survey existing rule and skill frontmatter for relevance-criteria language. Consider whether richer metadata (machine-checkable predicates, examples, anti-examples) would help."
    status: pending
  - id: q4-reviewer-findings-tracker-design
    content: "Map the reviewer-findings tracker concept against the existing collaboration-state surface (commit_queue, claims, comms, escalations). Decide whether findings are a new kind of state or an extension of an existing kind. Consider auto-registration at reviewer-dispatch boundary."
    status: pending
  - id: q5-adr-pdr-operativeness-layer
    content: "Explore whether ADRs and PDRs should carry explicit operativeness metadata: when each fires in active reasoning, example moments, anti-examples. Currently the access-vs-firing gap is wide; some structural treatment may close it."
    status: pending
  - id: q6-auto-mode-framing-locus
    content: "Determine the legitimate locus for an auto-mode framing adjustment on quality-bearing decisions. Repo-level versus harness-level. What framing shape ensures solo-closure rationalisation cannot operate without disabling auto mode generally."
    status: pending
  - id: q7-workflow-composition-mechanism-family
    content: "Map the workflow-composition mechanism family explicitly. Binding, composition, decomposition, templating, triggering, substrate-sharing, declarative workflows, capability composition, others. For each, identify the concern shape it best fits."
    status: pending
  - id: q8-failure-mode-family-resemblance
    content: "Identify other failure modes that share family resemblance with closure-pressure rationalisation. Candidates: rush-impulse (ADR-172), round-off-on-partial-structures, eager-rounding-off-on-partial-structures."
    status: pending
  - id: q9-lightest-binding-vs-lightest-cue
    content: "Investigate the trade-off space between 'lightest structural binding that produces non-skippable metacognition at closure' and 'lightest cue that the agent reliably acts on without binding.' These represent opposing design strategies."
    status: pending
  - id: q10-existing-memetic-immune-system-precedent
    content: "Examine the existing PDR-044 memetic-immune-system hook surface (blocked patterns at write time). This is already a working instance of the lightweight-tick mechanism family. Map what the existing implementation does, what it does not yet do, and whether the closure-pressure failure mode can be partially addressed by extending the existing surface. Specific owner-surfaced refinement (2026-05-20): the hook is currently a refusal; consider whether a refusal-vs-approval design choice is generically applicable, so that legitimate references to blocked patterns (e.g., this plan referencing the pattern by name) become an approval prompt rather than a hard block. Companion research doc has direct evidence from the authoring session."
    status: pending
isProject: false
---

# Closure-Pressure Remediation Design Space

**Status**: NOT DECISION-COMPLETE. Future-collection exploration plan.
**Captured**: 2026-05-20
**Source observations**: [`closure-pressure-and-workflow-composition-2026-05-20.md`](../../../research/agentic-engineering/closure-pressure-and-workflow-composition-2026-05-20.md)
**Authoring session**: Stormy Plumbing Atoll (claude / claude-opus-4-7-1m / 2e2764)

## What This Plan Is

A preserved map of directions worth exploring for the closure-pressure
rationalisation failure mode. The companion research document captures the
failure narrative, the doctrinal anchors that should have fired and did not,
the four first-pass candidate mechanisms with their assessment, and the
owner-surfaced expansions of the design space.

This plan does **not** propose actions. It enumerates the exploration
directions that emerged so future sessions can pick one up under owner
direction.

## What This Plan Is Not

- Not decision-complete. Each todo is a question, not a workstream.
- Not a recommendation. The headline-shape ("bind skills") that emerged first
  in conversation was named by the owner as one mechanism among many; the
  todos are deliberately broader.
- Not action-bearing. No todo here is owner-authorised for execution.
  Promotion to `current/` requires explicit scope-narrowing and a readiness
  review.
- Not exhaustive. Future evidence may surface aspects this plan does not
  name. Treat the todo set as a snapshot, not a contract.

## Position In The Agentic-Engineering Collection

This plan sits in `future/` because the failure mode is captured but the
remediation shape is not chosen. It is adjacent to existing strategic plans:

- [`operating-model-mechanism-taxonomy.plan.md`](operating-model-mechanism-taxonomy.plan.md)
  — overlaps with todo q7 (workflow-composition mechanism family).
- [`memory-feedback-and-emergent-learning-mechanisms.plan.md`](memory-feedback-and-emergent-learning-mechanisms.plan.md)
  — overlaps with the broader question of how observations become operative.
- [`memetic-immune-system-and-progressive-disclosure.plan.md`](memetic-immune-system-and-progressive-disclosure.plan.md)
  — overlaps with q5 and directly with q10 (memetic-immune-system precedent).

Future exploration on any todo above should check these adjacent plans for
prior overlapping work before re-deriving.

## Recommended Exploration Sequence (If Any Direction Is Taken Up)

Not a binding sequence. A suggestion given the dependency structure that
emerged in the source conversation:

1. **q10** (existing memetic-immune-system precedent) first — the failure
   demonstrated this session showed that PDR-044's blocked-pattern hooks
   already implement a lightweight-tick mechanism that fires at write time
   without agent invocation. Mapping that surface before designing new
   mechanisms is the doctrinally correct starting point.
2. **q8** (failure-mode family resemblance) second — it may reframe what the
   other todos are addressing. If closure-pressure is one of several modes
   that share a structural treatment, addressing them separately is wasteful.
3. **q2** (lightweight-frequent self-check) third — the owner's observation
   that "almost any tick will do" is the most leverage-rich insight in the
   source conversation.
4. **q3** (rule/skill relevance criteria) fourth — this is foundational;
   many other todos depend on whether relevance is machine-checkable or
   cue-only.
5. **q7** (workflow-composition mechanism family) fifth — once relevance is
   understood, the composition question becomes tractable.
6. **q1, q4, q5, q6, q9** in owner-directed order after the foundational
   questions resolve.

This sequence is itself a hypothesis. A future session may invert it after
reading the source observations.

## What Future Sessions Should Read First

Before acting on any todo:

1. The source research document (linked above) — the full failure narrative
   and design-space map.
2. The four candidate mechanisms (a/b/c/d) section of that document.
3. The "Open questions worth carrying" section, which is the most
   uncertainty-preserving part.
4. Any napkin or distilled entries that have accumulated about
   closure-pressure or rush-impulse failures since 2026-05-20 — those are
   the evidence that would refine or invalidate this plan's todos.

## Foundation Alignment

This plan operates under:

- `principles.md` §Architectural Excellence Over Expediency.
- ADR-172 (rush impulse) — the diagnostic that fired in the source failure.
- PDR-029 (perturbation mechanism bundle) — the structural-feedback frame.
- PDR-044 (memetic immune system, innate-immunity layer) — the precedent for
  hook-based pattern-blocking at write time.
- PDR-053 (orchestrator-vs-gate structural cure) — relevant when mechanisms
  for closure-discipline get scoped.

The plan's existence is itself an application of architectural-excellence:
the source conversation could have closed with a small bundled remediation.
Instead it closed with "preserve the observations honestly so a real
treatment can be chosen later." This plan exists because that is the
doctrinally correct shape, even though it is slower.

## Lifecycle Triggers

- Promotion to `current/`: requires owner direction selecting a specific
  todo, a readiness review against the source observations, and a scope
  narrowing to a bounded executable slice.
- Archival: only if owner directs that the failure mode is resolved by
  another route or is no longer worth tracking. Default is to carry until
  selected or superseded.
- Refinement: future sessions may add todos, refine wording, or restructure
  the recommended sequence as evidence accumulates. Source-document updates
  should flow through to this plan.

---
plan_id: graph-combinatorial-arc
name: "Graph Combinatorial Arc — Cross-Corpus Substrate Composition Spine"
overview: "Follow-on coordination spine to the graph MVP arc. Once three independent corpora (EEF, Oak ontology, Oak misconceptions) are established as substrate and surfaced, the combinatorial arc explores the value unlocked by composing them through the `graph-corpus-sdk` cross-corpus join primitive (graph-stack Inc.3). First concrete exploration: the cross-corpus tool composing EEF strands and a bounded misconception sub-graph for a Thread IRI. Subsequent compositions are exploratory and authored as they are scoped."
type: cross-collection-coordination-spine
status: current
graph_layer: cross-cutting
graph_portfolio_index: "graph-portfolio-index.md"
predecessor_arc: "graph-mvp-arc.plan.md"
owner_thread: "connecting-oak-resources"
related_indices:
  - "high-level-plan.md"
  - "graph-portfolio-index.md"
substrate_floor:
  - "graph-mvp-arc.plan.md gate-1 (EEF surface) shipped — names + response shapes for EEF strands stable"
  - "graph-mvp-arc.plan.md gate-3a (Oak misconception sub-graph surface) shipped — bounded sub-graph response shape stable"
  - "graph-stack.plan.md Inc.3 — `graph-corpus-sdk` cross-corpus join primitive + EEF strand adapter + misconception adapter"
promotion_trigger:
  - "graph-mvp-arc.plan.md gate-1 and gate-3a have shipped (their naming + response-shape contracts are stable)"
  - "graph-stack Inc.3 cross-corpus join primitive design is stable enough to exercise (does not require Inc.3 fully in production — design stability suffices to start the first concrete exploration). Design stability is attested by `architecture-expert-betty` review of the join API surface at Inc.3 design close; named evaluator avoids a fuzzy gate."
  - "When all conditions hold, this arc activates without further owner approval; it is `current/` from authoring, queued behind its substrate floor by the trigger above"
specialist_reviewers:
  - mcp-expert
  - architecture-expert-betty
  - assumptions-expert
  - test-expert
  - code-expert
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
isProject: false
todos:
  - id: gate-cross-corpus-1-eef-misconceptions
    content: "First concrete combinatorial exploration: cross-corpus tool `oak-misconceptions-eef-recommend-for-thread` composes EEF strands and a bounded misconception sub-graph for a Thread IRI through `graph-corpus-sdk` + cross-corpus join primitive (graph-stack Inc.3). Executable detail lives in the migrated slice-3b plan at `connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-eef-cross-corpus-surface.plan.md` (moved from current/ during MVP-arc reshape 2026-05-11). Acceptance: per-call response carries non-empty EEF strand list AND non-empty misconception sub-graph for a curated 10-Thread-IRI manifest where both corpora are known to have content; both corpora flow through `graph-corpus-sdk` + GraphView (no legacy factory); cross-corpus join verified end-to-end; ADR-123 records the compound-prefix tool."
    status: pending
    depends_on: []
  - id: future-compositions-exploration
    content: "After gate-cross-corpus-1 ships, evaluate which further compositions (EEF × Threads, Threads × misconceptions, three-way joins) yield combinatorial value worth surfacing. Output is a short authored decision: which compositions to pursue, which to drop, which to fold into the higher-layer `cross-source-journeys.plan.md`. Exploration not delivery — the deliverable is the decision, plus authored follow-on plans for any composition kept. **Bounded by**: decision authored within one consolidation cycle of gate-cross-corpus-1 close (prevents pretend-follow-up drift)."
    status: pending
    depends_on: [gate-cross-corpus-1-eef-misconceptions]
  - id: learning-loop
    content: "After every gate, run `/jc-consolidate-docs` graduation scan; mine outcomes into permanent docs. After final gate, full pass with possible arc archival per ADR-117."
    status: pending
    depends_on: [future-compositions-exploration]
---

# Graph Combinatorial Arc — Cross-Corpus Substrate Composition Spine

**Status**: CURRENT — authored 2026-05-11; queued behind MVP arc gate-1 +
gate-3a + graph-stack Inc.3 design stability per the promotion trigger.
**Type**: Cross-collection coordination spine. Owns the substrate-level
combinatorial exploration that begins after the MVP arc establishes three
independent corpora.

## Why This Plan Exists

The [graph MVP arc](graph-mvp-arc.plan.md) establishes substrate and
surfaces for three independent corpora: EEF strands, Oak ontology Threads,
and Oak misconceptions. Each is independently navigable through its own
MCP surface. Each carries substrate value, shape-understanding value, and
surfacing-exploration value in its own right.

The next value stream is combinatorial. Composing two or more of those
corpora — through the `graph-corpus-sdk` cross-corpus join primitive
delivered by graph-stack Inc.3 — unlocks shapes of answer that no single
corpus produces. The MVP arc does not own that stream; the substrates are
the prerequisites, not the composition itself.

This plan owns the combinatorial exploration. It starts with one concrete
cross-corpus tool (EEF × Oak misconceptions for a Thread IRI) that
exercises the Inc.3 join primitive end-to-end, and explicitly leaves the
question of which further compositions to surface open for evidence-based
decision after that first tool ships.

## What "Combinatorial" Means Here — Layer Distinction

This arc is **substrate-layer combinatorial**: it ships cross-corpus
*primitives* — MCP tools whose body composes two or more corpora through
the `graph-corpus-sdk` cross-corpus join. Each tool surfaces one
composition shape directly.

It is distinct from `cross-source-journeys.plan.md` (future/), which is
**feature-layer combinatorial**: it asks whether *journeys* (orchestration
patterns combining multiple tool calls, possibly a new MCP `playbook`
primitive, possibly richer prompts) are the right artefact for
teacher-facing flows. Journeys consume cross-corpus primitives; this arc
delivers them.

The two arcs are sequential in dependency direction (this arc's primitives
become available before journeys can consume them) but distinct in
delivery scope. Folding them would collapse the substrate/feature layering
the portfolio index already names. Both stay; both cross-link.

## Substrate Floor

The promotion trigger above is mechanical: the arc activates when its
named substrate floor is in place. Three pieces:

1. **MVP arc gate-1 (EEF) shipped**. Names + response shapes for EEF
   strands are stable; the compound-prefix tool can reuse them without
   re-deciding their shape.
2. **MVP arc gate-3a (misconception sub-graph) shipped**. Bounded
   sub-graph response shape is stable; the compound tool composes that
   shape rather than redefining it.
3. **graph-stack Inc.3 cross-corpus join primitive — design stability**.
   The primitive does not have to be fully in production for this arc to
   start the first concrete exploration; design stability (the join API's
   key semantics, citation threading, error contract are settled) is
   sufficient to exercise it through one concrete tool. Full production
   readiness is required before that tool ships, but design feedback from
   exercising the API is one of the deliverables of this arc.

Slice 2 (Oak ontology Threads) shipping is **not** a substrate floor for
this arc's first gate. Slice 2 ships an Oak-graph surface; it does not
participate in the EEF × misconceptions composition. (Slice 2 may
participate in a later composition — see `future-compositions-exploration`
todo — but not in the first gate.)

## Value Streams (this arc)

This arc primarily serves two streams from the portfolio's value model:

- **Combinatorial value** — what shapes of answer are unlocked by
  composing two or more corpora through the substrate join primitive.
- **Partnership value (strengthening)** — the EEF partnership case
  opens with the MVP arc's slice 1 (EEF surface ships, conversation
  enabled). It **strengthens** here when the cross-corpus tool
  demonstrates that EEF evidence and Oak misconception data compose into
  joint value teachers (through AI clients) can use. Joint value is the
  partnership case closing argument.

Teacher value remains downstream of AI-client adoption, as named in the
MVP arc; this arc does not change that dependency, and it is named here
only to keep the value chain honest.

## First Concrete Exploration — content-migration map from slice 3b

The MVP arc's former slice 3b — `oak-misconceptions-eef-recommend-for-thread`
— is the first concrete tool this arc delivers. Its executable plan moved
from `connecting-oak-resources/knowledge-graph-integration/current/` to
`.../future/` during the 2026-05-11 MVP-arc reshape; it remains a
`feature-workstream` plan with eight TDD cycle todos and its substrate
dependencies unchanged. The combinatorial arc references it rather than
duplicating its content.

| Content in the migrated slice-3b plan | Status post-migration |
|---|---|
| 8 TDD-cycle todos (WS1 cycle 1–4; WS2 cycle 1–2; WS3 ADR-123; WS4 quality gates; WS5 adversarial review; WS6 spine close) | **Preserved verbatim**; reviewer dispatch + cycle scope intact |
| `spine_plan` frontmatter pointer | **Repointed** from `graph-mvp-arc.plan.md` to `graph-combinatorial-arc.plan.md` |
| `sequencing_gate` frontmatter | **Refreshed** to name MVP-arc gate-1 + gate-3a as response-shape prerequisites + graph-stack Inc.3 as substrate floor |
| Substrate floor list | **Unchanged**; the substrate dependencies are the same |
| ADR amendment list | **Unchanged** |

## Future Compositions — exploration not delivery

After the first cross-corpus tool ships, this arc's `future-compositions-exploration`
todo asks: which further compositions yield combinatorial value worth
surfacing as primitives?

Candidate compositions (not yet decided):

- **EEF × Threads** — evidence strands keyed to a curriculum thread.
  Possibly redundant with slice 1 + slice 2 standalone; needs evidence
  that the joint shape adds value beyond consumer-side composition.
- **Threads × misconceptions** — misconceptions keyed to a thread without
  EEF involvement. Possibly redundant with slice 3a + Thread→Unit lookup;
  same redundancy question.
- **Three-way join (EEF × Threads × misconceptions)** — full joint shape.
  May belong here, may belong in `cross-source-journeys.plan.md` as a
  journey orchestration. Decide after the first tool exposes the join
  primitive's affordances.
- **Compositions involving future corpora** (prerequisite graph, NC
  taxonomy if separately promoted, external KGs) — out of arc until those
  corpora reach substrate floor.

The deliverable for this todo is **the authored decision** — which
compositions to pursue, which to drop, which to fold into
`cross-source-journeys.plan.md`. Pursuing a composition triggers
authoring its own executable plan; this arc does not pre-author them.

## Sequencing and Gates

```text
graph-mvp-arc gate-1 (EEF) + gate-3a (misconceptions) + graph-stack Inc.3 design-stable
  ↓
gate-cross-corpus-1: oak-misconceptions-eef-recommend-for-thread ships
  ↓
future-compositions-exploration: which further compositions, decided not pre-committed
  ↓ (per composition authored)
... (further gates as compositions are scoped)
  ↓
learning-loop: /jc-consolidate-docs after each gate; archive when arc closes
```

## Owner Thread + Reviewers

- **Owner thread**: `connecting-oak-resources` (knowledge-graph-integration).
  Cross-references `sector-engagement/eef` because EEF is a cross-cutting
  corpus, but the substrate composition work is integration-thread-owned.
- **Plan-time reviewers**: assumptions-expert, architecture-expert-betty,
  docs-adr-expert (at promotion-trigger fire + at each gate close).
- **Gate-close reviewers**: mcp-expert (every gate — every gate ships an
  MCP primitive); test-expert (every gate); architecture-expert-betty
  (gate-cross-corpus-1 — first cross-corpus boundary); code-expert
  (gateway).

## Non-Goals (YAGNI)

This arc does **not**:

- Write product code itself. The migrated slice-3b plan and any future
  composition plans own their cycles.
- Replace `cross-source-journeys.plan.md`. That plan owns
  feature-layer journey orchestration; this arc owns substrate-layer
  cross-corpus primitives.
- Pre-decide which further compositions ship. The
  `future-compositions-exploration` todo is exploration; the decision is
  the deliverable.
- Close the EEF partnership case alone. Partnership opens with MVP arc
  slice 1; strengthens here; downstream consumer adoption is a separate
  concern.
- Replace MVP arc dependencies. This arc activates on MVP-arc gates
  shipping; it does not absorb or restate the MVP arc's commitments.

## Foundation Alignment

- **[principles.md](../directives/principles.md)** — TDD as design,
  schema-first, fail loud, namespace discipline (ADR-157 compound-prefix
  convention), substrate-first sequencing.
- **[testing-strategy.md](../directives/testing-strategy.md)** — atomic
  test+product-code landing per cycle; the migrated slice-3b plan
  inherits this.
- **[schema-first-execution.md](../directives/schema-first-execution.md)** —
  cross-corpus join primitive consumes schema-defined types from
  graph-corpus-sdk; no ad-hoc types at the tool body.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| graph-stack Inc.3 design slips, deferring this arc indefinitely | Medium | This plan's existence is the named downstream-consumer signal for Inc.3; graph-stack carries the reciprocal cross-reference. Arc activation is mechanical on Inc.3 design stability, not on Inc.3 fully shipping. |
| Combinatorial compositions surface complexity that should have been resolved at substrate level | Medium | gate-cross-corpus-1 includes architecture-expert-betty review of the substrate-only enforcement boundary (tool body should be thin; cross-corpus logic lives in graph-corpus-sdk join primitive). |
| `future-compositions-exploration` todo accumulates scope without owner-approved promotion | Low | Explicit framing: deliverable is **the decision**, not the implementation. Decisions surface to owner; implementation is gated behind authoring a plan per composition. |
| Confusion with `cross-source-journeys.plan.md` | Low | Layer distinction stated in both plans' overviews + cross-link. Periodic consolidation pass verifies the boundary holds. |

## Lifecycle Triggers

- **Promotion trigger fires** when MVP arc gate-1 + gate-3a + Inc.3
  design-stability are all true (see frontmatter).
- **Plan-time reviewers** dispatch at promotion-trigger fire and at each
  gate.
- **Mid-arc checkpoints** at each gate close: `/jc-consolidate-docs`
  graduation scan.
- **Handoff closure**: end-of-session updates to the
  `connecting-oak-resources` thread next-session record.

## Cross-References

- [`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md) — predecessor arc.
- [`connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-eef-cross-corpus-surface.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-eef-cross-corpus-surface.plan.md) —
  executable detail for the first concrete tool (migrated from current/
  2026-05-11).
- [`connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md) —
  substrate increments; Inc.3 cross-references this arc as its named
  downstream consumer.
- [`connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) —
  feature-layer journey orchestration; downstream of this arc's primitives.
- [`graph-portfolio-index.md`](graph-portfolio-index.md) — portfolio index;
  carries the cross-cutting row for this arc.
- ADR-123, ADR-157, ADR-173 — unchanged by this arc; primitives recorded
  per gate.

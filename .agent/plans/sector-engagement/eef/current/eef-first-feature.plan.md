---
name: "EEF First Feature — eef-explore-evidence-for-context + eef-evidence-grounded-lesson-plan"
overview: "Owning plan for the first user-facing EEF MCP feature, delivered at graph-mvp-arc gate-1a atop graph-stack Inc.1d. Owns the gate-1a delivery contract end-to-end by reference: substrate floor (WS4.4 GraphView interface + WS4.5 EEF subgraph+manifest adapter), one tool (eef-explore-evidence-for-context), one prompt (eef-evidence-grounded-lesson-plan), structural citation/caveat/freshness envelope, ADR-175 freshness CI gate, ADR-157 eef-* namespace + _meta attribution, Sentry telemetry seam, and the two non-technical preconditions (EEF partnership-conversation opener, AI-client adoption-tracking owner naming)."
graph_layer: oak-graph-surface
graph_portfolio_index: "../../../graph-portfolio-index.md"
cross_cutting_thread: "EEF Evidence — sector-cohesion demonstration"
parent_plans:
  - "../../../graph-mvp-arc.plan.md"
  - "./eef-evidence-corpus.plan.md"
sibling_plans:
  - "../../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md"
  - "../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md"
substrate_dependency: "graph-stack Inc.1d (WS4.4 + WS4.5)"
specialist_reviewer: "mcp-expert, code-expert, test-expert, type-expert, sentry-expert, docs-adr-expert"
status: current
isProject: false
todos:
  - id: ff1-partnership-opener
    content: "EEF partnership-conversation opener: name the EEF contact, record first-contact action (date + outcome). Required before gate-1a promotes to active. Sector-engagement deliverable, not technical; lives here because the partnership opener is a gate-1a precondition with no natural home in substrate or corpus plans."
    status: pending
    depends_on: []
  - id: ff2-adoption-tracking-owner
    content: "Name the owner of AI-client adoption tracking and the tracking mechanism (which AI clients have adopted which Oak MCP tools, with what usage signal). Carried over from graph-mvp-arc.plan.md::name-ai-client-adoption-owner — owned here because it is gate-1a's named precondition (resolves D-1). Without this the executive teacher-value chain has no signal source."
    status: pending
    depends_on: []
  - id: ff3-substrate-floor-tracking
    content: "Track graph-stack Inc.1d landing (WS4.4 + WS4.5 in active/graph-stack.plan.md). Not authored here — pointer only. WS4.4: GraphView<TNode, TEdgeType> interface in packages/core/graph-core/src/graph-view/ (placement corrected per architecture-expert-betty verdict 2026-05-21). WS4.5: EefStrandsGraphView adapter in packages/sdks/graph-corpus-sdk/ implementing subgraph + manifest for EEF data, remaining 5 ops as typed NotImplementedYet Result stubs."
    status: pending
    depends_on: []
  - id: ff4-corpus-todos-tracking
    content: "Track gate-1a corpus-plan todos in eef-evidence-corpus.plan.md (canonical IDs, not duplicated here): t1-corpus-shape, t2-zod-loader, t6a-explore-tool, t9-guidance-constant, t10-lesson-plan-prompt, t12-citation-shape, t13-freshness-gate, t20-credits. Plus gate-1a-partial scopes of t14-telemetry, t15-negative-space-doc, t16-public-export, t17-register-resources, t18-adr-123-update, t19-e2e (gate-1a portions per the corpus plan's §Gate grouping table)."
    status: pending
    depends_on: []
  - id: ff5-shape-understanding-evidence
    content: "Answer the five-question shape-understanding evidence template (from graph-mvp-arc.plan.md § Shape-Understanding Evidence Template) for the gate-1a feature: (1) what teacher action does this enable, (2) what is the smallest verifiable signal of value, (3) what is the worst plausible failure shape and the structural guard against it, (4) what does the response look like under a degenerate input, (5) what is the freshness-staleness behaviour. Record answers here as gate-1a precondition."
    status: pending
    depends_on: [ff4-corpus-todos-tracking]
  - id: ff6-acceptance-bundle
    content: "Gate-1a acceptance bundle: substrate floor landed (ff3); corpus todos landed (ff4); partnership opener executed (ff1); adoption-tracking owner named (ff2); shape-understanding evidence answered (ff5); _meta source attribution preserved on the response; eef-* prefix applied; freshness CI gate active (180-day threshold per ADR-175); structural citation envelope verified (non-empty tuple compile-time + Zod min(1) runtime); Sentry telemetry seam instrumented on the one tool. MCP tool home: existing oak-curriculum-sdk MCP module per ADR-179 surfacing discipline."
    status: pending
    depends_on: [ff1-partnership-opener, ff2-adoption-tracking-owner, ff3-substrate-floor-tracking, ff4-corpus-todos-tracking, ff5-shape-understanding-evidence]
---

# EEF First Feature — Owning Plan

**Status**: CURRENT — promotes to ACTIVE when graph-stack Inc.1d (WS4.4 + WS4.5)
lands and the EEF partnership-conversation opener has been executed.
**Last Updated**: 2026-05-21 (Charcoal Searing Ember session — owning-plan
extraction absorbing docs-adr-expert P0 finding against the Torrid Glowing
Flame amendment set).
**Branch**: `feat/mcp-graph-support-foundation` (substrate work);
`feat/eef_exploration` was the originating session branch for the corpus plan
this plan extracts gate-1a scope from.
**Substrate dependency**: graph-stack **Inc.1d** (WS4.4 GraphView interface +
WS4.5 EEF subgraph+manifest adapter as concurrent Inc.1 tenants of
`graph-corpus-sdk` per ADR-173 §First-wave ingestion scope 2026-05-21
amendment).

## Scope

This plan owns the gate-1a delivery contract end-to-end:

- **1 tool**: `eef-explore-evidence-for-context` (subgraph-shaped response over
  EEF strands matching a teacher's seed context — subject + key_stage + optional
  focus — wrapped in the structural citation/caveat/freshness envelope).
- **1 prompt**: `eef-evidence-grounded-lesson-plan` (projects the subgraph
  result into a teacher-readable narrative with structurally-preserved
  citations).
- **The corpus envelope**: structural citation discipline, caveat-presence,
  freshness metadata, ADR-157 `_meta` source attribution.
- **The freshness CI gate**: ADR-175 binding active at gate-1a (180-day
  threshold).
- **The Sentry telemetry seam**: pattern shipped, one tool instrumented.
- **The partnership-conversation opener**: EEF contact named, first-contact
  recorded.
- **The AI-client adoption-tracking owner naming**: D-1 resolved.

Ownership is **by reference**, not by duplication: this plan points at canonical
todo IDs in the substrate plan (`graph-stack.plan.md`) and the corpus plan
(`eef-evidence-corpus.plan.md`). The work itself executes there; the gate-1a
delivery contract is observed here.

## What this plan does NOT own

- **Substrate work** (graph-stack Inc.1d WS4.4 + WS4.5) — authored and tracked
  in `connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`.
- **Corpus work** (t1, t2, t6a, t9, t10, t12, t13, t20 + partials) — authored
  and tracked in `./eef-evidence-corpus.plan.md`.
- **Gate-1b** (slice-1 completion: recommend/explain/compare tools + second
  prompt + full telemetry/registration/E2E) — that is the residual corpus
  surface, owned by `./eef-evidence-corpus.plan.md` after this plan's gate-1a
  scope lands.
- **Cross-corpus journeys** — owned by `graph-combinatorial-arc.plan.md`.

## Architectural commitments at gate-1a

The 2026-05-21 sequencing pull-forward is a **sequencing change, not a scope
reduction**. The following ship in full at gate-1a:

1. **Full `GraphView<TNode, TEdgeType extends string>` interface** (all 7
   method signatures, `Result<T, E>` discipline on every fallible operation per
   `principles.md` §Code Design, `NodeProjection<TNode, Depth extends number = 4>`
   recursive deep-path with array-stop discipline, `NodeFilter<TNode>` with full
   `FieldPredicate<TFieldValue>` arm set). Authored at WS4.4 inside
   `packages/core/graph-core/src/graph-view/`.
2. **T7a compile-time `DeepKeyPath` smoke-test** asserting `'headline.impact_months'`,
   `'school_context_relevance.implementation_requirements.cpd_intensity'` and
   `'effectiveness.mechanisms'` are valid, and `'tags.0'` / `'tags[number]'` are
   NOT valid (array-stop regression guard).
3. **Structural citation/caveat/freshness envelope** at the tool boundary
   (`citations: readonly [Citation, ...Citation[]]`, `caveats: readonly [string, ...string[]]` — non-empty tuple compile-time + Zod min(1) runtime).
4. **ADR-175 freshness CI gate** active before any user-facing surface ships
   (180-day staleness threshold; data version emitted on every response).
5. **ADR-157 `eef-*` namespace + `_meta` source attribution** on the tool and
   the prompt.
6. **Sentry telemetry seam pattern** shipped (pattern full; instrumentation
   scope = the one tool — `t14-telemetry` partial at gate-1a, full at gate-1b).
7. **Sparse-relations surface on manifest** (per assumptions-expert round
   2026-04-30 verdict and 2026-05-21 reconfirmation): `manifest()` returns
   `strands_without_relations: readonly string[]` to front-load the
   empty-edge knowledge so consumers avoid pointless `subgraph`/`neighbours`
   calls on isolated strands.

## Non-technical preconditions

These have no natural home in the substrate plan or the corpus plan; they live
here because they gate `gate-1a` promotion to active:

- **`ff1-partnership-opener`**: EEF contact named, first-contact action
  recorded with date + outcome. The EEF source-authority status (the
  repository-held `eef-toolkit.json` snapshot is the canonical implementation
  source until EEF clarifies refresh mechanics) means the partnership
  conversation is the load-bearing channel for resolving long-term provenance
  questions.
- **`ff2-adoption-tracking-owner`**: name the owner of AI-client adoption
  tracking and the tracking mechanism. This resolves D-1 (which was the
  load-bearing decision shipping into the void without a tracking surface).
  The previous home in `graph-mvp-arc.plan.md::name-ai-client-adoption-owner`
  remains as a coordination pointer back here.

## Acceptance bundle (`ff6`)

Gate-1a closes when all of:

- Substrate floor landed (graph-stack Inc.1d WS4.4 + WS4.5 commits visible in
  active/graph-stack.plan.md).
- Gate-1a corpus todos landed (the 8 full + 6 partial todos enumerated in
  `eef-evidence-corpus.plan.md` §Gate grouping table).
- `ff1-partnership-opener` executed.
- `ff2-adoption-tracking-owner` named.
- `ff5-shape-understanding-evidence` answered (five-question template
  completed for the gate-1a feature).
- `_meta` source attribution preserved on the response, `eef-*` prefix
  applied, freshness CI gate active, structural citation envelope verified,
  Sentry telemetry seam instrumented.
- MCP tool registered in the existing `oak-curriculum-sdk` MCP module per
  ADR-179 §Surfacing discipline (substrate workspaces ship no MCP code).

## Cross-plan references

- **Substrate plan**: [`graph-stack.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md) (active; owns
  WS4.4 + WS4.5).
- **Corpus plan**: [`./eef-evidence-corpus.plan.md`](./eef-evidence-corpus.plan.md)
  (current; owns t1, t2, t6a, t9, t10, t12, t13, t20 and the residual gate-1b
  surface).
- **MVP-arc spine**: [`../../../graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)
  (owns gate-1a's milestone-level acceptance; this plan executes the gate-1a
  thread).
- **Query-layer plan**: [`../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md)
  (current; owns T2 interface specification, which is what WS4.4 implements).
- **Authoritative ADRs**: [ADR-123](../../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
  (MCP primitives strategy), [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
  (namespace + `_meta`), [ADR-173](../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md)
  (graph-stack topology, first-wave ingestion scope), [ADR-175](../../../../docs/architecture/architectural-decisions/175-evidence-corpus-freshness-governance.md)
  (freshness governance), [ADR-179](../../../../docs/architecture/architectural-decisions/179-substrate-vs-transport-discipline.md)
  (substrate-vs-transport discipline).

## Conservation property

Every item described here exists in one of:

- `graph-stack.plan.md` (substrate todos: WS4.1, WS3.3, WS4.4, WS4.5)
- `eef-evidence-corpus.plan.md` (corpus todos: t1, t2, t6a, t9, t10, t12, t13,
  t20 + partials)
- `graph-mvp-arc.plan.md` (gate-1a milestone definition: gate-0a, gate-1a)

This plan does not duplicate. It coordinates. The conservation map
[`../reference/conservation-map.md`](../reference/conservation-map.md) records
the extraction audit trail.

## Promotion to ACTIVE

Promotes when the substrate floor (graph-stack Inc.1d) lands and the
partnership-conversation opener (`ff1`) executes. Without either, the gate-1a
delivery contract cannot start — the substrate is the technical precondition;
the partnership opener is the source-authority precondition.

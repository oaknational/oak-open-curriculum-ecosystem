---
name: "EEF Evidence Corpus Surface"
overview: "Expose the EEF Teaching and Learning Toolkit as an evidence corpus (graph + ranking engine) on top of the graph query layer, with two pedagogical prompts, structural citation discipline, telemetry, and a freshness story. Increment 2 (and EEF-side of 3+4) of the graph-and-corpus delivery sequence."
graph_layer: oak-graph-surface
graph_portfolio_index: "../../../graph-portfolio-index.md"
cross_cutting_thread: "EEF Evidence — sector-cohesion demonstration"
parent_plan: "../../../connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md"
  - "../../../connecting-oak-resources/knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md"
  - "../../../connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md"
specialist_reviewer: "mcp-expert, code-expert, test-expert, type-expert, sentry-expert"
status: current
isProject: false
todos:
  - id: t1-corpus-shape
    content: "Define EvidenceCorpus { readonly view: GraphView<...>; rank; explain; compare } wrapping shape with Result<T, E> returns. Per type-expert F3 (2026-05-21): the rank/explain/compare error unions include NotImplementedYet (readonly kind: 'NotImplementedYet' discriminant per repo convention) so the gate-1a stub implementations (Result.err({ kind: 'NotImplementedYet', operation: 'rank' }) and similar) compile against the same surface gate-1b will enable. Sketch ExplainOptions (TNode-independent), CompareOptions with ComparisonDimension literal union, RankOptions context shape. EEF strands becomes the first concrete corpus."
    status: pending
    workstream: corpus-loading
  - id: t2-zod-loader
    content: "Zod-validated loader for the repository-held canonical eef-toolkit.json snapshot (preserves F1, F4, F7; revises F2/F3 to remove the school_context_schema.properties exemption — typed concretely as SchoolContextSchema with the 9 closed properties, each a JsonSchemaProperty). Validate meta.last_updated as z.string().date() and meta.data_version as z.string().regex(semver) — not bare z.string(). Per type-expert F4 (2026-05-21): the loader also computes schema_hash at load time (SHA-256 over the loaded-and-validated strand records under canonical serialisation, truncated to 16 hex characters; matches packages/core/graph-core/src/canon/canonicalize.ts discipline) so manifest() remains infallible and the loader is the failure boundary for hash-related failures."
    status: pending
    workstream: corpus-loading
  - id: t3-methodology-resource
    content: "Methodology+caveats resource via graph factory (preserves F6 + F11 resolutions)."
    status: pending
    workstream: corpus-loading
  - id: t4-strands-resource
    content: "Strands resource via graph factory; default projection avoids dumping deep fields (F11)."
    status: pending
    workstream: corpus-loading
  - id: t5-scoring-engine
    content: "ScoringEngine with composite weighting (40/30/20/10), null-impact guard (F5), and rationale generation (R1, R2, R7). RankedResult uses non-empty tuple types: caveats: readonly [string, ...string[]], citations: readonly [Citation, ...Citation[]]."
    status: pending
    workstream: recommend
  - id: t6a-explore-tool
    content: "eef-explore-evidence-for-context tool (2026-05-21 amendment — gate-1a first-feature tool). Composes GraphView.subgraph (Inc.1d EEF adapter, WS4.5) + the corpus envelope (citations, caveats, freshness, source attribution); response shape is a typed subgraph of EEF strands matching the seed context (subject + keyStage + optional focus), NOT a ranked list. The subgraph topology is the response — the connections between strands are pedagogically meaningful for evidence. Citation discipline is structural at the tool boundary per t12-citation-shape (non-empty tuple compile-time + Zod min(1) runtime); the prompt projects the subgraph into a teacher-readable narrative without paraphrasing citations away. Sentry telemetry per t14-telemetry pattern instrumented on this one operation; pattern is full, instrumentation scope is the one tool. Lives in the existing oak-curriculum-sdk MCP module per ADR-179 surfacing discipline. Ships at gate-1a; t6-recommend-tool ships separately at gate-1b with the t5-scoring-engine."
    status: pending
    workstream: explore
  - id: t6-recommend-tool
    content: "eef-recommend-evidence-for-context tool composing GraphView.enumerate_nodes + ScoringEngine.rank, with explicit data_coverage in response (F8, R8)."
    status: pending
    workstream: recommend
  - id: t7-explain-tool
    content: "eef-explain-evidence-strand tool: returns full strand context with citations, caveats, provenance, and update_history."
    status: pending
    workstream: explain
  - id: t8-compare-tool
    content: "eef-compare-evidence-strands tool: side-by-side comparison across user-selected dimensions, typed as ComparisonDimension literal union (no string[] widening)."
    status: pending
    workstream: compare
  - id: t9-guidance-constant
    content: "eef-evidence-guidance.ts with AGGREGATED_EEF_EVIDENCE_GUIDANCE — preserves R1 + R7 prose prescriptions only (R3 scoring-structural, R8 response-structural; see §Phase E for rationale)."
    status: completed
    workstream: corpus-loading
    cross_cuts: [recommend, explain, compare, prompt-a, prompt-b]
  - id: t10-lesson-plan-prompt
    content: "eef-evidence-grounded-lesson-plan prompt (preserves F8, F9, F10 resolutions; KS-to-phase mapping inline)."
    status: pending
    workstream: prompt-a
  - id: t11-pp-review-prompt
    content: "eef-pupil-premium-strategy-review prompt (Workflow B from strategy doc; previously not in executable plan)."
    status: pending
    workstream: prompt-b
  - id: t12-citation-shape
    content: "Citation discipline: every response from the EEF tool surface carries citations as a non-empty readonly tuple of Citation values {strand_id, strand_name, data_version, last_updated, eef_url, caveats: non-empty readonly tuple of strings}. Non-empty tuple types enforce the ≥1 caveat and ≥1 citation invariants at compile time; Zod runtime schemas (z.tuple([T], T).readonly()) re-assert them at runtime. Source attribution lives on the response envelope (_meta.attribution, carrying EEF_ATTRIBUTION) not per-citation. Landed 2026-05-22 in packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/citation-shape.ts."
    status: completed
    workstream: corpus-loading
    cross_cuts: [recommend, explain, compare, prompt-a, prompt-b]
  - id: t13-freshness-gate
    content: "CI gate that fails when the SDK eef-toolkit.json copy is >180 days old. Until EEF clarifies provenance/refresh mechanics, the refresh workflow validates and copies a reviewed replacement from the repo-held reference snapshot rather than reconstructing from scraped EEF pages; if EEF later confirms a public download/API or direct-supply process, the SDK refresh script implements that acquisition path."
    status: pending
    workstream: freshness
  - id: t14-telemetry
    content: "Sentry spans on every corpus operation; named metrics for recommendations served, distinct contexts, citation-presence rate."
    status: pending
    workstream: telemetry
  - id: t15-negative-space-doc
    content: "Document fields deliberately not exposed in default projections (and why)."
    status: pending
    workstream: corpus-loading
  - id: t16-public-export
    content: "Export EvidenceCorpus type + EEF resource constants from public/mcp-tools.ts."
    status: pending
    workstream: corpus-loading
    cross_cuts: [recommend, explain, compare]
  - id: t17-register-resources
    content: "Register EEF resources via existing registerGraphResource() helper."
    status: pending
    workstream: corpus-loading
  - id: t18-adr-123-update
    content: "ADR-123: add EEF resources (curriculum://eef-methodology, curriculum://eef-strands), eef-recommend/explain/compare tools, eef-evidence-grounded-lesson-plan and eef-pupil-premium-strategy-review prompts (all eef-* prefixed per ADR-157). Document corpus-vs-graph layering."
    status: pending
    workstream: coordination
  - id: t19-e2e
    content: "E2E shape conditions: tools/resources/prompts listed; declared types match; Citation has non-empty caveats tuple and the response carries a non-empty citations tuple at compile time, re-asserted at runtime via Zod .min(1). Outcome verification (LLM-paraphrasing) is honestly out of scope until evaluation infrastructure exists."
    status: pending
    workstream: coordination
  - id: t20-credits
    content: "Add John Roberts to repo authors; record in ATTRIBUTION.md and root README per the strategy doc's standing requirement."
    status: completed
    workstream: credits
---

# EEF Evidence Corpus Surface

**Status**: CURRENT — replaces the previous `eef-evidence-mcp-surface.plan.md`.
The predecessor was preserved byte-identically in `originals/` during
the restructure for an independent verification pass; after that pass
confirmed no semantic loss (see [`../reference/conservation-map.md`](../reference/conservation-map.md)
§N), `originals/` was deleted. The pre-session predecessor remains
permanently recoverable via `git show e2796757:<path>`.
**Last Updated**: 2026-05-21 (Torrid Glowing Flame / claude / opus-4-7-1m / 5ab0ec) — gate-1a / gate-1b sequence-first split authored per owner direction; new todo `t6a-explore-tool` added for the first-feature `eef-explore-evidence-for-context` tool consumed by gate-1a; §Gate grouping table records the split. Underlying t1–t20 content preserved verbatim. Previous: 2026-05-11 (workstream overlay added: 20 todos grouped into 9 capability workstreams + 1 coordination workstream to expose intra-slice parallelism; underlying todo content preserved verbatim).
**Branch**: `feat/eef_exploration` (originating session); execution branch
TBD when promoted to ACTIVE.
**Increment**: 2 (with EEF-side of 3 and 4) of the EEF graph-and-corpus
delivery sequence.
**MVP arc**: this plan is **slice 1** of the
[graph-mvp-arc spine](../../../graph-mvp-arc.plan.md). Slice 1 ships in two
tranches per the 2026-05-21 amendment below: **gate-1a** (first user-facing
EEF MCP feature; owned end-to-end by
[`./eef-first-feature.plan.md`](./eef-first-feature.plan.md) by reference)
and **gate-1b** (remaining slice-1 surface — recommend/explain/compare
tools, second prompt, full telemetry, registration, E2E). Both gates
require the `eef-*` prefix and the explicit-source-attribution discipline
addendum to ADR-157; both are coordination amendments that landed
alongside the spine plan on 2026-05-07.

**Partnership-value framing (2026-05-11 reshape)**: slice 1 opens the
EEF partnership conversation as a co-primary value stream alongside
substrate, shape-understanding, and surfacing-exploration. The cross-
corpus EEF × Oak misconceptions tool that strengthens the partnership
case lives in the follow-on
[graph-combinatorial-arc](../../../graph-combinatorial-arc.plan.md);
LLM/outcome evaluation lives in
[`../future/eef-outcome-evaluation-infrastructure.plan.md`](../future/eef-outcome-evaluation-infrastructure.plan.md).
Teacher value is downstream of AI-client adoption.

## 2026-05-21 amendment — gate-1a / gate-1b split (sequence-first pull-forward)

Owner-directed sequencing change: the first user-facing EEF MCP
feature ships at gate-1a (a new gate added to
[`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)) before slice 1
completes at gate-1b (the renamed former gate-1). The split is
**sequencing only** — no scope reduction; the full slice-1 surface
still ships, in two tranches. Architectural commitments do not
shrink: full GraphView interface at Inc.1d (graph-stack WS4.4),
DeepKeyPath array-stop discipline, structural citation envelope,
ADR-175 freshness CI gate, ADR-157 `eef-*` namespace + `_meta`
attribution all ship at gate-1a.

### Gate grouping

| Todo | Gate | Notes |
|---|---|---|
| t1-corpus-shape | **gate-1a** | EvidenceCorpus wrapping shape ships; rank/explain/compare method slots present in the type (delegating to `NotImplementedYet` Result variants until gate-1b enables them) so consumers compile against the full surface |
| t2-zod-loader | **gate-1a** | Full Zod-validated loader; Phase B findings 5+6 from graph-query-layer applied (related_strands optional, related_guidance_reports as `{title, url}` objects) |
| t3-methodology-resource | gate-1b | Methodology+caveats resource (graph factory) |
| t4-strands-resource | gate-1b | Strands resource (graph factory) |
| t5-scoring-engine | gate-1b | Composite weighting + rationale generation |
| **t6a-explore-tool** | **gate-1a** | New (this amendment): `eef-explore-evidence-for-context`, subgraph-shaped response with corpus envelope |
| t6-recommend-tool | gate-1b | Recommend tool (renamed scope; ships after scoring engine) |
| t7-explain-tool | gate-1b | Explain tool |
| t8-compare-tool | gate-1b | Compare tool |
| t9-guidance-constant | **gate-1a** | AGGREGATED_EEF_EVIDENCE_GUIDANCE constant; consumed by t10 prompt at gate-1a and by t6/t7/t8/t11 at gate-1b |
| t10-lesson-plan-prompt | **gate-1a** | `eef-evidence-grounded-lesson-plan` prompt; projects t6a subgraph result into a teacher-readable narrative with structurally-preserved citations |
| t11-pp-review-prompt | gate-1b | Pupil-premium strategy review prompt (second prompt) |
| t12-citation-shape | **gate-1a** | Structural citation discipline; non-empty tuple compile-time + Zod min(1) runtime — load-bearing architectural commitment for both gates |
| t13-freshness-gate | **gate-1a** | ADR-175 binding; freshness CI gate active before any user-facing surface ships |
| t14-telemetry | gate-1a *partial* / gate-1b *full* | Sentry seam pattern shipped at gate-1a with one tool instrumented; remaining instrumentation extends at gate-1b |
| t15-negative-space-doc | gate-1a *partial* / gate-1b *full* | Subgraph-projection default-projection fields documented at gate-1a; recommend/explain/compare projection additions documented at gate-1b |
| t16-public-export | gate-1a *partial* / gate-1b *full* | EvidenceCorpus type + t6a tool + t10 prompt exported at gate-1a; recommend/explain/compare tool types + second prompt exported at gate-1b |
| t17-register-resources | gate-1a *partial* / gate-1b *full* | t10 prompt registered at gate-1a; resources + remaining tools/prompt registered at gate-1b |
| t18-adr-123-update | gate-1a *partial* / gate-1b *full* | One tool + one prompt recorded at gate-1a; remaining primitives recorded at gate-1b. ADR-123 amends twice; bounded coordination cost accepted per owner direction (sequencing over single-batch update) |
| t19-e2e | gate-1a *partial* / gate-1b *full* | Shape conditions for t6a + t10 at gate-1a; full slice-1 E2E at gate-1b |
| t20-credits | **gate-1a** | EEF + John Roberts attribution; binding before any user-facing surface ships |

### Why this split

The split delivers the first user-facing EEF MCP feature earlier
without compromising the eventual full slice-1 surface. Three
architectural commitments ship in full at gate-1a (and were
the load-bearing reasons to amend the sequencing rather than
shrinking scope):

1. **Full GraphView interface at graph-stack Inc.1d (WS4.4)** — the
   `subgraph` + `manifest` implementations on EEF land into a
   complete contract that the remaining 5 operations (Inc.3) plug
   into without reshape. Sequencing is changing; the interface
   contract is not.
2. **DeepKeyPath array-stop discipline (T7a compile-time smoke-test)** —
   ships at WS4.4 alongside the interface. Non-optional.
3. **Structural citation/caveat/freshness envelope at the tool
   boundary** (t12, t13) — the partner-demo-legibility *and*
   architectural-discipline commitment that prevents LLM paraphrase
   from leaking past the boundary. Non-optional.

The net additional work over the unsplit sequencing is roughly
+10-15% (ADR-123 amends twice; T7/T19 extend across two passes;
T6 MCP registration extends), accepted per owner direction as the
price of earlier first delivery.

## 2026-05-07 amendment — `eef-*` prefix applied per ADR-157

ADR-157's namespace convention has always required the `eef-*` prefix
for EEF-sourced primitives (the resource URIs `curriculum://eef-methodology`
and `curriculum://eef-strands` already conform). This plan's tool and
prompt names did not — a drift introduced when the plan was authored
alongside the predecessor restructure. The 2026-05-07 amendment renames:

| Before | After |
|---|---|
| `recommend-evidence-for-context` | `eef-recommend-evidence-for-context` |
| `explain-evidence-strand` | `eef-explain-evidence-strand` |
| `compare-evidence-strands` | `eef-compare-evidence-strands` |
| `evidence-grounded-lesson-plan` | `eef-evidence-grounded-lesson-plan` |
| `pupil-premium-strategy-review` | `eef-pupil-premium-strategy-review` |

No behaviour change. No code shipped under the old names (this plan is
in `current/`, not `active/`). Rename costs zero. Recorded as part of
the spine's `amend-eef-plan` todo.

## Why This Plan Replaces Its Predecessor

The previous plan (`eef-evidence-mcp-surface.plan.md`, recoverable via
`git show e2796757:.agent/plans/exploring-open-education-resources/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`)
shipped:

- 2 read-only resources (methodology, strands) as JSON dumps.
- 1 bespoke recommendation tool with composite scoring.
- 1 lesson-plan prompt.
- All 12 pre-implementation findings (F1–F12) resolved.

The architecture session of 2026-04-30 (full record in
[`napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../../../../memory/active/napkin.md))
established that:

1. The plan met its own *shape* exit criteria but had no *outcome*
   exit criteria.
2. EEF is a special case of a wider class — evidence corpora — that
   compose graph operations with ranking. Modelling it that way protects
   against EEF-shaped over-fitting and unlocks reuse.
3. The plan's ranking tool was a pure point solution. The architectural
   excellence was *available*: corpus = graph + scoring.
4. Citation discipline (R1, R7) was prescribed in plan prose, not
   enforced structurally — the previous E2E tests would pass on a
   recommendation that omitted caveats.
5. Critical operational concerns (refresh, freshness, telemetry,
   negative-space) had no executable home.
6. A second pedagogical prompt (Workflow B in the strategy doc) had
   never been promoted into an executable todo.

Every resolution in the predecessor (F1–F12) is preserved in this plan;
see [`../reference/conservation-map.md`](../reference/conservation-map.md)
for the full mapping. This plan **expands** beyond the predecessor — it
does not replace any settled decision.

## User-Value Sense-Check (apply where the value is non-obvious)

```text
**User value**: [Specific user] can [do what they couldn't before]
              resulting in [observable teacher/learner outcome].
**Provability**: [How will we know? "Not yet provable, will be when X"
              is acceptable; hand-waving is not.]
**Architecture validation**: [What assumption does this confirm or break?]
```

This is a sense-check, not a ceremony. Apply it to tasks where the
user value or architectural assumption is non-obvious. Wiring,
registration, and credits tasks inherit value from the parent
capability and do not need a triplet. The point is to make sure we are
building useful things, not to tick boxes on every line.

## Plan Top-Line User Value

- **User value**: A teacher (or AI client serving a teacher) can ask
  "what evidence-backed approach works for {phase, subject, focus}?" and
  receive a ranked list of approaches with **structural citations**
  (strand id + data version + caveat) — not prose recommendations the
  agent has paraphrased away.
- **Provability**: structural caveat/data/citation presence sampled across
  N=50 recommendation responses; target ≥95% for recommendation responses
  carrying required caveat, `data_coverage`, `data_version`, and non-empty
  citation fields. Distinct teachers served per week (Sentry); distinct
  contexts queried per week.
- **Architecture validation**: confirms that
  `EvidenceCorpus = GraphView + ScoringEngine` is the right composition,
  and that citations/caveats carried as structured fields are preserved at
  the tool boundary. LLM paraphrase/outcome evaluation is sequenced behind
  dedicated evaluation infrastructure, not this plan's Vitest gate.

## Composition Model

```text
GraphView (foundation, lives in knowledge-graph-integration/current/graph-query-layer.plan.md)
  ├── manifest, summary
  ├── get_node, enumerate_nodes (with projection)
  ├── neighbours, subgraph
  └── find_by_tag

EvidenceCorpus (this plan — wraps a GraphView, does NOT extend it)
  ├── readonly view: GraphView<TNode, TEdgeType>   ← graph ops reached via corpus.view.*
  ├── rank(filter, weights, context) → RankedResults with rationale
  ├── explain(node, context) → caveats, provenance, update_history
  └── compare(node_ids, dimensions) → side-by-side
```

Composition by *holding*, not by *being*. The boundary between graph
operations and corpus operations is enforced structurally: a consumer
holding an `EvidenceCorpus` reaches graph ops via `corpus.view.enumerate_nodes(...)`,
making the layering visible at every call site. Interface extension
would have collapsed the layering into a single object.

The corpus extension lives in the SDK at
`oak-curriculum-sdk/src/mcp/evidence-corpus/`. It depends on the
`GraphView` foundation. Misconception and prerequisite graphs do not
need it; future evidence corpora (interventions, lesson-quality,
externally-curated taxonomies) can adopt it.

## Data Source — KG-Independent (preserved from predecessor)

**EEF JSON only.** This plan uses the static EEF data file directly.
It does **NOT** depend on the Oak Curriculum Ontology, the KG alignment
audit, or Neo4j. It is independently deliverable (Levels 2–3 of the
[evidence integration strategy](../future/evidence-integration-strategy.md)).
The graph-query-layer foundation it composes against is a thin in-process
operations layer over typed JSON, not the formal ontology — so the
KG-independence property of the predecessor is preserved structurally.

Levels 4 / 4b (formal ontology integration with EEF) remain a future
concern, gated on the KG alignment audit completing.

## Source Data and Snapshot Validation

The EEF data file (`eef-toolkit.json`, v0.2.0, last_updated 2026-04-02)
is at [`../reference/eef-toolkit.json`](../reference/eef-toolkit.json). Until
EEF clarifies whether this JSON was downloaded from a public data endpoint or
supplied directly to Oak, this repository copy is the definitive source for the
implementation. Do not reconstruct it from scraped EEF pages, and do not assume
the repo authored the data. Re-validated 2026-04-30:

- 30 strands ✓
- 4 null-impact strands with matching IDs ✓
  (`eef-tl-aspiration-interventions`, `eef-tl-learning-styles`,
  `eef-tl-outdoor-adventure-learning`, `eef-tl-school-uniform`)
- 17 with `school_context_relevance` ✓
- 4 with `implementation` block ✓
- 6 with `behind_the_average` ✓
- 9 caveats ✓ (drift in old strategy doc fixed in
  this session)

The snapshot age is intentionally recalculated at promotion time from the
`last_updated` field, not baked into this plan. Caveat #8 in the JSON itself
notes that the data reflects "May 2025 and October 2025 living systematic
review updates where available". Before promotion to ACTIVE, the implementer
must perform a provenance check with EEF or Oak's EEF contact: confirm whether a
public download/API exists, whether EEF supplied this JSON directly, or whether
a newer replacement snapshot exists. If provenance remains unresolved, the plan
may still proceed only by explicitly treating the checked-in JSON as the
definitive snapshot and recording the accepted provenance gap in the promotion
notes.

## Credits and Attribution (load-bearing)

- **EEF Toolkit data**: Education Endowment Foundation
  ([educationendowmentfoundation.org.uk](https://educationendowmentfoundation.org.uk/)).
  Original research authors: Higgins, S.; Katsipataki, M.;
  Kokotsaki, D.; Coleman, R.; Major, L.E.; Coe, R.
- **EEF MCP server prototype**: John Roberts (JR)
  `<john.roberts@thenational.academy>`. **JR must be added to the
  repo's authors list (root README + ATTRIBUTION.md) when this plan
  ships its first commit.** See **T20**.

## Workstreams (2026-05-11 overlay)

The 20 implementation todos are grouped into nine capability workstreams plus one coordination workstream. Workstream tagging is recorded in the `workstream` and (where applicable) `cross_cuts` fields on each todo in the frontmatter. The phase-A-to-L breakdown under `## Implementation` is preserved verbatim as implementation narrative; the workstream overlay names dispatch-friendly groupings without restructuring the underlying work.

The grouping exposes intra-slice parallelism: when slice 1 is promoted to ACTIVE, two agents can share the slice (for example, one driving WS-recommend/explain/compare, another driving WS-prompt-a/prompt-b/freshness/telemetry/credits) after WS-corpus-loading lands the substrate the other workstreams build on.

| Workstream | Todos | File scope (indicative) |
|---|---|---|
| **corpus-loading** | t1-corpus-shape, t2-zod-loader, t3-methodology-resource, t4-strands-resource, t9-guidance-constant, t12-citation-shape, t15-negative-space-doc, t16-public-export, t17-register-resources | `oak-curriculum-sdk/src/mcp/evidence-corpus/` (corpus types, loader, resources, citation shape, guidance constant, public exports, registration) |
| **recommend** | t5-scoring-engine, t6-recommend-tool | `oak-curriculum-sdk/src/mcp/evidence-corpus/scoring/`, recommend tool surface |
| **explain** | t7-explain-tool | explain tool surface |
| **compare** | t8-compare-tool | compare tool surface |
| **prompt-a** | t10-lesson-plan-prompt | `eef-evidence-grounded-lesson-plan` prompt |
| **prompt-b** | t11-pp-review-prompt | `eef-pupil-premium-strategy-review` prompt |
| **freshness** | t13-freshness-gate | refresh script + CI gate |
| **telemetry** | t14-telemetry | Sentry spans + named metrics |
| **credits** | t20-credits | root README + ATTRIBUTION.md |
| **coordination** | t18-adr-123-update, t19-e2e | ADR-123; cross-cutting E2E shape proofs |

Cross-cutting todos within `corpus-loading` carry an explicit `cross_cuts` field naming the surfaces that consume them — **t9-guidance-constant** and **t12-citation-shape** are consumed by all three tools and both prompts; **t16-public-export** is consumed by the three tools. They live in `corpus-loading` because that workstream is the structural dependency floor for the surfaces that consume them; lifting them into a separate WS would split a coupled concern into two coupled workstreams and obscure parallelism rather than expose it.

**`cross_cuts` semantics**: the field denotes *consumer surfaces*, not blocking direction. T9 and T12 land before their consumers (corpus-loading is upstream); T16 lands after its consumers (the public export wires up the tool surfaces — see Sequencing). Treat `cross_cuts` as "is referenced by", not "blocks".

**Coordination workstream timing**: T18-adr-123-update (in `coordination`) must serialise after the tool/prompt set substantially completes — ADR-123 records the final shipped surface, so it cannot land until that surface is stable. T19-e2e likewise lands at the end of the slice. The `coordination` workstream is therefore the slice's closure phase, even though its file scope is disjoint from the capability workstreams.

The workstream overlay does not change exit criteria, promotion triggers, R1–R8 mapping, or dependency direction. It is a dispatch lens over the existing plan.

## Impact-Preserving Requirements (R1–R8 from strategy doc)

This plan must satisfy all eight. Mapping to executable todos below:

| Req | Subject | Where it lands |
|---|---|---|
| **R1** Epistemic honesty | every recommendation includes impact + evidence + caveat | T5, T6, T12 (structural enforcement) + T9 (prose framing for LLM-facing output) |
| **R2** Transparent scoring | weighting exposed in tool response | T5, T6 |
| **R3** Disadvantage-gap priority | PP relevance as first-class param | T5, T6, T11 |
| **R4** Synthesis boundary | no individual study citations | T6 (out by design); T12 enforces |
| **R5** Implementation guidance | CPD intensity, staffing, time, pitfalls | T6, T7, T10 |
| **R6** Workflow orchestration | ≥2 orchestrated workflows | T10 (lesson plan) + T11 (PP review) |
| **R7** Professional-judgement framing | every output as decision-support | T9 (guidance constant) + T12 (structural) |
| **R8** Partial coverage honesty | data_coverage in every response | T6, T15 |

R6 was previously partially-met (only one workflow); T11 closes the gap.
R1, R7 were previously *prescribed*; T12 makes them *structural*.
R8 was previously partially-met (count in tool response only); T15
documents the negative-space rationale fully.

## Implementation

### Phase A: Corpus shape on the graph foundation (T1–T2)

**T1: Corpus shape**

- **User value**: an SDK consumer (this plan, downstream plans, future
  corpora) can model an evidence corpus with one type instead of
  duplicating ranking logic per use case.
- **Provability**: zero ad-hoc ranking implementations in the SDK
  outside `evidence-corpus/`.
- **Architecture validation**: confirms composition (graph + scoring)
  rather than inheritance is the right model.

`oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts`:

```typescript
import type { Result } from '@oaknational/result';

/**
 * Composition, not inheritance. The corpus *holds* a graph view,
 * it does not *become* one. Consumers reach the graph operations
 * via `corpus.view.enumerate_nodes(...)`, keeping the corpus/graph
 * boundary structural rather than only prose. Long-term
 * architectural evidence beats the surface-ergonomic shortcut of
 * `extends GraphView`.
 *
 * `ExplainOptions` is intentionally TNode-independent: a strand is
 * identified by `strand_id` only, and the response carries the full
 * node detail. `RankOptions<TNode>` and `CompareOptions<TNode>` carry
 * `TNode` because they accept node-shape parameters (predicates,
 * comparison sets); explain takes only an identifier.
 */
/**
 * Per type-expert F3 (2026-05-21): rank/explain/compare error unions
 * include `NotImplementedYet` so the gate-1a stub implementations compile
 * against the same surface gate-1b will enable. The discriminant follows
 * the repo convention (a readonly `kind:` literal — see F1 in
 * graph-query-layer.plan.md), and the `operation` field names the stub
 * site for telemetry and error-message clarity.
 */
export type NotImplementedYet = {
  readonly kind: 'NotImplementedYet';
  readonly operation: 'rank' | 'explain' | 'compare';
};

export interface EvidenceCorpus<TNode, TEdgeType extends string> {
  readonly view: GraphView<TNode, TEdgeType>;
  rank(opts: RankOptions<TNode>): Result<RankedResults<TNode>, RankError | NotImplementedYet>;
  explain(opts: ExplainOptions): Result<NodeExplanation<TNode>, NodeNotFoundError | NotImplementedYet>;
  compare(opts: CompareOptions<TNode>): Result<ComparisonResult<TNode>, CompareError | NotImplementedYet>;
}

export interface ExplainOptions {
  readonly strand_id: string;
  readonly projection?: NodeProjection<EefStrand>;
}

/**
 * Comparison dimensions are a closed set derivable from the strand
 * type at design time. Widening to `string[]` would violate
 * principles.md §Compiler Time Types ("never widen types when a
 * literal exists").
 */
export type ComparisonDimension =
  | 'impact'
  | 'cost'
  | 'evidence_strength'
  | 'school_context'
  | 'implementation_requirements';

export interface CompareOptions<TNode> {
  readonly strand_ids: readonly [string, string, ...string[]];
  readonly dimensions: readonly ComparisonDimension[];
}

/**
 * Scoring weights and context vector for ranking. Sketched here so
 * the implementor does not reach for `Partial<TNode>` or
 * `Record<string, unknown>`. The full Zod schema lives alongside the
 * scoring engine in T5.
 */
export interface RankOptions<TNode> {
  readonly filter?: NodeFilter<TNode>;
  readonly context: {
    readonly phase: 'primary' | 'secondary';
    readonly subject?: string;
    readonly focus?:
      | 'closing_disadvantage_gap'
      | 'metacognition'
      | 'literacy'
      | 'numeracy'
      | 'behaviour'
      | 'feedback';
    readonly pp_percentage?: number;
    readonly max_cost?: 1 | 2 | 3 | 4 | 5;
    readonly min_evidence?: 1 | 2 | 3 | 4 | 5;
  };
  readonly max_results?: number;
}
```

**T2: Zod-validated loader** — `oak-curriculum-sdk/src/mcp/data/eef-toolkit.json`
(copied from this plan's `../reference/`) and
`oak-curriculum-sdk/src/mcp/eef-toolkit-data.ts`. Preserves predecessor
F1 (data home is SDK, not codegen — third-party static data),
**revises F2/F3** (all fields typed, no `Record<string, unknown>`
anywhere — the predecessor's `school_context_schema.properties`
`Record<string, unknown>` exemption is removed; see "Closed schema
typing" below), F4 (direct
Zod parse at load, not `as const satisfies`), F7 (Zod validation at
import time).

**Format precision**: the Zod schema MUST validate
`meta.last_updated` and `meta.data_version` to their known formats,
not bare `z.string()`:

- `last_updated` → `z.string().date()` (ISO 8601 date `YYYY-MM-DD`).
- `data_version` → `z.string().regex(/^\d+\.\d+\.\d+$/)` (semver).

Bare `z.string()` would let a malformed value (e.g. a free-text
update note) parse cleanly and propagate into citation responses
where it would mislead teachers about evidence currency.

**Strand-field optionality and shape** (surfaced by the
graph-query-layer first-principles check, 2026-04-30): the Zod
schema MUST treat the following per-strand fields correctly,
matching the actual shape of `eef-toolkit.json` rather than the
shape the plan body might naively assume:

- `related_strands` → `z.array(z.string()).optional()` — the field
  is **absent** on 13 of 30 strands (not empty array). Marking it
  required would cause module-load failure on every load; marking
  it `z.array(z.string()).default([])` would also work. Either way,
  bare-required is wrong.
- `related_guidance_reports` → `z.array(z.object({title: z.string(),
  url: z.string().url()})).optional()` — present on only 7 of 30
  strands; each entry is a `{title, url}` object, NOT a bare URL
  string. `z.array(z.string())` would silently fail to validate the
  real data; `z.string()` for entries would crash module load.

These two are the load-bearing examples; the principle is general —
the loader's Zod schema must mirror the actual data shape including
absent-field optionality, not an idealised "every strand has every
field" shape.

**Closed schema typing** (resolves the type-expert's bucket-(c)
finding by reading the actual data): `school_context_schema` in
`eef-toolkit.json` is itself a JSON Schema document with a known
closed shape — `{ description: string; properties: { phase, key_stage,
school_type, pupil_premium, send_percentage, ofsted_grade, attainment,
workforce, priorities } }`. Each property value follows the standard
JSON Schema property shape (`type`, optional `enum`, optional
recursive `properties`, optional `items`). The predecessor's
`Record<string, unknown>` exemption was an over-conservative reading;
the structure is fully knowable. Type it as:

```typescript
import type { Result } from '@oaknational/result';

type JsonSchemaProperty = {
  readonly type: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
  readonly description?: string;
  readonly enum?: readonly string[];
  readonly properties?: Readonly<Record<string, JsonSchemaProperty>>;
  readonly items?: JsonSchemaProperty;
};

interface SchoolContextSchema {
  readonly description: string;
  readonly properties: {
    readonly phase: JsonSchemaProperty;
    readonly key_stage: JsonSchemaProperty;
    readonly school_type: JsonSchemaProperty;
    readonly pupil_premium: JsonSchemaProperty;
    readonly send_percentage: JsonSchemaProperty;
    readonly ofsted_grade: JsonSchemaProperty;
    readonly attainment: JsonSchemaProperty;
    readonly workforce: JsonSchemaProperty;
    readonly priorities: JsonSchemaProperty;
  };
}
```

The Zod schema mirrors this shape. If the upstream EEF dataset adds
a tenth property, Zod parse fails loud at module load — which is
correct: a contract change in the agent-discoverable schema deserves
explicit attention, not silent acceptance.

The full Zod schema is preserved verbatim from the predecessor; see
the predecessor (recoverable via `git show e2796757:.agent/plans/exploring-open-education-resources/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`)
§Phase 1.

- **User value**: any schema drift between EEF JSON and declared types
  fails loud at module load, not silently at runtime when a teacher
  asks a question.
- **Provability**: a deliberate corruption test (mutate a strand to
  drop a required field) MUST cause module-load failure in unit tests.
- **Architecture validation**: confirms Zod-at-boundary is correct
  for non-OpenAPI data sources (per ADR-157).

**Schema hash computation timing** (per type-expert F4, 2026-05-21):
`schema_hash` is computed inside this loader at load time, not lazily at
first `manifest()` call. The hash is computed over the
loaded-and-validated EEF strand records (canonical serialisation: stable
key ordering, no whitespace) using SHA-256, truncated to 16 hex
characters for compact display — matching the repo's existing hash
discipline in `packages/core/graph-core/src/canon/canonicalize.ts`.
Computing at load time means the loader is the failure boundary for
hash-related failures (malformed snapshot, hashing primitive
unavailable); `manifest()` itself stays infallible and returns a plain
value, as the
[graph-query-layer.plan.md](../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md)
manifest signature already declares. The exported value is consumed by
`GraphView.manifest()` on the EEF adapter (WS4.5) and surfaces in every
agent-discovery response.

**Loader behaviour, not data shape, is what we test.** The loader's unit
test must prove one thing: a real EEF dataset parses through the Zod
schema without throwing. That is product behaviour. Counts of strands,
caveats, school-context entries, and named null-impact IDs are
properties of the *upstream data*, not of Oak code; asserting them in
Oak tests would be testing the EEF dataset, not the loader, and would
break loudly every time EEF legitimately publishes a new strand or
caveat.

If we ever want to ask "does the framework expose all nodes correctly?",
the answer is a small fixture-based integration test that builds a
known graph from test data and exercises the operations against it —
not exact-count assertions on production data.

### Phase B: Resources (T3–T4)

**T3: Methodology + caveats resource** — `eef-methodology-resource.ts`
via the graph factory. URI: `curriculum://eef-methodology` (preserves
F6). Description: methodology + 9 caveats + UK context. Preserves F11.

- **User value**: an agent loading methodology can cite the conversion
  table and caveats by reference, not by paraphrase.
- **Provability**: resource appears in `resources/list`; resource read
  returns the methodology + 9 caveats + uk_context.
- **Architecture validation**: confirms the graph factory still works
  for non-graph-shaped data (methodology is a singleton record, not a
  graph).

**T4: Strands resource** — `eef-strands-resource.ts`. URI:
`curriculum://eef-strands`. **Default projection** for the strands
resource is `{id, name, slug, headline, definition.short, tags}` — NOT
the full strand record. Agents can pull deeper detail via
`eef-explain-evidence-strand` when they have a specific strand id in hand.
This is a structural application of progressive disclosure through the corpus
tool that preserves citation/provenance fields.

- **User value**: an agent loading the strands resource gets a
  ~3KB digest, not a 90KB dump, freeing context for downstream
  reasoning.
- **Provability**: resource read at p95 ≤4KB.
- **Architecture validation**: confirms default-projection resources
  - `get_node`-on-demand pattern works at the resource layer, not just
  the tool layer.

### Phase C: Scoring engine (T5)

**T5: ScoringEngine** — `oak-curriculum-sdk/src/mcp/evidence-corpus/scoring.ts`.

The composite scoring algorithm is preserved verbatim from the
predecessor:

```text
score = (impact/8 × 4.0)            // 40% impact, normalised 0-10
      + (evidence/5 × 3.0)          // 30% evidence strength
      + ((6-cost)/5 × 2.0)          // 20% cost-effectiveness (inverted)
      + context_relevance            // 10% accumulated:
                                    //   phase match: +0.4
                                    //   focus match: +0.4
                                    //   PP: very_high +0.2, high +0.15,
                                    //       moderate +0.1
```

Null-impact guard (preserves F5): strands with `impact_months === null`
are excluded *before* scoring; the count is included in `data_coverage`
on every response. The 4 strand IDs are listed in the docstring.

The engine returns:

```typescript
interface RankedResult<TNode> {
  rank: number;
  node: TNode;
  score: number;
  componentBreakdown: { impact: number; evidence: number; cost: number; context: number };
  rationale: string;       // human-readable, generated from breakdown
  caveats: readonly [string, ...string[]];                // ≥1 caveat
  citations: readonly [Citation, ...Citation[]];          // ≥1 citation, structured (T12)
}
```

The non-empty tuple types `readonly [string, ...string[]]` and
`readonly [Citation, ...Citation[]]` enforce the ≥1 invariant at
compile time. A scoring engine that produces a `RankedResult` with
zero citations or zero caveats fails to type-check. This is the
structural enforcement of R1 + R7 named in T12.

- **User value**: agents downstream cannot accidentally hide the
  scoring rationale because it is a structured field on every result.
- **Provability**: unit tests assert that `rationale` is non-empty
  and references the four components in every result.
- **Architecture validation**: confirms scoring belongs in the corpus
  layer (orthogonal to GraphView), and that citations as structured
  fields survive better than citations in prose.

### Phase D: Tools (T6–T8)

**T6: `eef-recommend-evidence-for-context`** — preserves the predecessor's
T4. Composes `GraphView.enumerate_nodes` + `ScoringEngine.rank`. Input
schema preserved from predecessor (preserves F10 — the `focus` enum
matching `most_relevant_priorities` in the data; `closing_disadvantage_gap`
without the article matches the data). Annotations:
`readOnlyHint: true, idempotentHint: true`. F12 preserved:
`SCOPES_SUPPORTED` on the custom tool def.

Response shape (extends predecessor's, adds structural citations):

```typescript
{
  context: { phase, subject, focus, constraints },
  recommendations: RankedResult<EefStrand>[],     // see T5
  methodology_note: string,
  global_caveat: string,
  data_coverage: {
    strands_scored: "26/30",
    strands_excluded_no_impact: 4,
    strands_with_context: "17/30",
  },
  data_version: { schema_version, data_version, last_updated },  // T12
}
```

MCP envelope: each EEF tool returns a `CallToolResult` with `content`
containing a short human-readable summary plus serialized JSON for
compatibility, `structuredContent` containing the domain payload above,
a declared `outputSchema`, and `isError: true` only for tool execution errors.

- **User value**: same as plan top-line.
- **Provability**: Sentry span per call; recommendation count per week;
  caveat-presence rate (T19).
- **Architecture validation**: confirms the corpus/tool boundary —
  the tool is thin and routes through the corpus interface.

**T7: `eef-explain-evidence-strand`** — NEW. Returns full context for one
strand: definition (short + full), key_findings, effectiveness,
behind_the_average, closing_the_disadvantage_gap, implementation,
related_strands, related_guidance_reports, update_history. Carries
`data_version` and structural caveats.

- **User value**: a teacher who has identified a strand can drill into
  full evidence detail with one tool call, including `update_history`
  so they know how recent the evidence is.
- **Provability**: tool call count after a `eef-recommend-evidence-for-context`
  call (the natural funnel).
- **Architecture validation**: confirms `get_node`-with-rich-projection
  is the right primitive for "tell me everything about this".

**T8: `eef-compare-evidence-strands`** — NEW. Side-by-side comparison
across user-selected dimensions (impact, cost, evidence, school
context, implementation requirements). Used by Workflow B (PP review)
and useful standalone.

- **User value**: a SENCO can compare 3 strands head-to-head before
  recommending one to a SLT, without manually constructing the
  comparison.
- **Provability**: tool call count from the PP-review prompt (the
  primary consumer); caveat-presence rate equivalent to T6.
- **Architecture validation**: confirms `compare` belongs in the
  corpus layer (uses scoring + projection together) rather than as a
  separate concern.

### Phase E: Guidance and prompts (T9–T11)

**T9: `eef-evidence-guidance.ts`** — `AGGREGATED_EEF_EVIDENCE_GUIDANCE`
constant **(landed 2026-05-22)**. Single-string `as const` aggregating
the two prose-shaped R-prescriptions: R1 (epistemic honesty — surface
evidence strength alongside impact, name the population-average
caveat, name implementation quality as the strongest moderator) and
R7 (professional-judgement framing — results are decision-support
that inform, not replace, the teacher's judgement). R3
(disadvantage-gap priority) is enforced structurally via t5-scoring-
engine PP-weighting; R8 (partial-coverage honesty) is enforced
structurally via the `data_coverage` field on the response envelope.
Neither belongs in prose guidance — duplicating a structural
commitment as advisory text is the anti-pattern the citation envelope
(`citation-shape.ts`) exists to prevent. The guidance constant will
be imported into all gate-1a and gate-1b consumer surfaces (t6/t6a/
t7/t8/t10/t11 — none of those consumers exist yet at landing) so
agents see consistent framing as the surfaces come online.

**T10: `eef-evidence-grounded-lesson-plan` prompt** — preserves predecessor
T10 verbatim, including F8 resolution (step 3 = extract implementation
data from recommendation response, no separate tool), F9 resolution
(KS-to-phase mapping inline in prompt), F10 resolution (focus enum
matches data values).

- **User value**: a teacher's "design a lesson on photosynthesis for
  Year 8" is answered with a structured plan that integrates 2-3
  EEF-evidenced approaches with caveats per approach.
- **Provability**: prompt invocation count in this slice. Manual review of
  N=20 final prompt outputs against a rubric (caveat present,
  evidence-strength shown, approach-to-content mapping coherent) is a
  follow-on evaluation-infrastructure task, not a T10 promotion gate.
- **Architecture validation**: confirms prompts can carry workflow
  orchestration without needing a new MCP primitive — at least for
  intra-source workflows.

**T11: `eef-pupil-premium-strategy-review` prompt** — NEW. Workflow B from
the strategy doc, now executable. Parameters: `current_approaches: string[]`,
`phase: enum`, `pp_percentage: number`. Orchestrates:

1. For each current approach: `eef-explain-evidence-strand`.
2. `eef-recommend-evidence-for-context` with `focus=closing_disadvantage_gap`
   and the school's phase + PP %.
3. `eef-compare-evidence-strands` for current vs recommended approaches.
4. Output: structured review {current_evidence_assessment[], recommended_approaches[],
   gaps[], implementation_quality_questions[]}.

- **User value**: a SENCO/PP-lead can produce an evidence-grounded
  review of current strategies in one tool sequence, with citations
  the PP reviewer can audit, instead of manually composing across
  EEF strand pages.
- **Provability**: prompt invocation count in this slice. Sample manual
  review of N=10 outputs against a PP-review-quality rubric is a follow-on
  evaluation-infrastructure task, not a T11 promotion gate.
- **Architecture validation**: confirms two distinct prompts can share
  the same three corpus tools without coupling. If we end up duplicating
  orchestration logic, the design needs revisiting in the journeys plan.

### Phase F: Citation discipline as structural enforcement (T12)

**T12: Citation shape** — Every response from T6, T7, T8 carries:

```typescript
interface Citation {
  strand_id: string;
  strand_name: string;
  data_version: string;          // semver, validated in T2
  last_updated: string;          // ISO 8601 date, validated in T2
  eef_url: string;               // direct link to the strand page
  caveats: readonly [string, ...string[]];  // ≥1 caveat enforced at compile time
}
```

**Source attribution lives on the envelope, not per-citation.** The response
`_meta.attribution` field carries `EEF_ATTRIBUTION` once per response (per
ADR-157 §`_meta` source attribution + the existing
`packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts` constant);
a `Citation` identifies a single strand within that already-attributed
envelope. Resolved 2026-05-22 during the t12-citation-shape cycle — owner
direction; code-expert flagged the prior literal `source: 'EEF Teaching
and Learning Toolkit'` field as a divergent-representation risk against
the canonical `EEF_ATTRIBUTION` constant.

This is a **structural** invariant: the response type makes it
impossible to ship a recommendation without a non-empty citation
array (T5 result type uses `readonly [Citation, ...Citation[]]`),
and impossible to ship a citation without at least one caveat (the
non-empty tuple above). The generated TS types enforce both
invariants at compile time; the Zod runtime validation (used in
tests) re-asserts them with `z.array(z.string()).min(1)` for
caveats and `z.array(citationSchema).min(1)` for citations. This
converts R1 and R7 from prose prescriptions into type-system
invariants.

- **User value**: a teacher can audit any recommendation's source by
  following its `eef_url`; a downstream lesson plan that paraphrases
  away the caveat is detectable in code review because the structured
  field exists in the trace.
- **Provability**: structural — caveat array length ≥1 on every
  recommendation, asserted in unit AND E2E tests.
- **Architecture validation**: confirms that R1/R7 *can* be enforced
  structurally, settling the previous question of whether prose was
  enough.

### Phase G: Freshness (T13)

**T13: Freshness gate** — A CI job that fails when
`packages/sdks/oak-curriculum-sdk/src/mcp/data/eef-toolkit.json` has
`meta.last_updated` >180 days old. Until EEF clarifies a public download or API,
the refresh workflow treats the repo reference file as the definitive source and
validates/copies a reviewed replacement snapshot rather than reconstructing data
from EEF web pages. If EEF later confirms a download URL, API, or direct supply
process, `packages/sdks/oak-curriculum-sdk/scripts/refresh-eef-toolkit.ts`
implements that acquisition path, validates it against the Zod schema, and
produces a diff summary for human review. The script lives inside the SDK
workspace so it has natural access to the Zod schema and stays inside the
workspace boundary (no workspace-to-root script coupling).

- **User value**: teachers receive evidence-backed recommendations
  whose data version is not silently >6 months stale; CI says so before
  the data lies.
- **Provability**: CI gate triggers on test data; ADR exists naming the
  owner.
- **Architecture validation**: confirms the refresh-vs-CI seam works
  for static data sources without OpenAPI generation.

### Phase H: Telemetry (T14)

**T14: Telemetry** — Sentry spans on every corpus operation:

- `evidence_corpus.recommend` — attrs: `{phase, subject, focus, max_cost, min_evidence, max_results, result_count, score_top, latency_ms}`
- `evidence_corpus.explain` — attrs: `{strand_id, projection_size}`
- `evidence_corpus.compare` — attrs: `{strand_id_count, dimension_count}`

Named metrics:

- `evidence.recommendation.served` (counter)
- `evidence.distinct_contexts` (gauge per week)
- `evidence.citation_presence_rate` (gauge per week — derived from
  span sampling)

- **User value**: indirect — operations team can answer "is the EEF
  integration delivering value?" with data, not vibes.
- **Provability**: dashboard exists with the three metrics post-launch.
- **Architecture validation**: confirms Sentry spans designed for tool
  execution work for corpus operations as well.

### Phase I: Negative-space documentation (T15)

**T15: Negative-space rationale** — A markdown section in the SDK README
naming fields *not* exposed in default projections, and why:

- `definition.full` — included in `explain` only; long prose.
- `key_findings` — included in `explain` only; teacher-relevant detail.
- `behind_the_average.by_phase`, `.by_subject` — included in `explain`
  only; only 6/30 strands have it.
- `effectiveness.mechanisms` — `explain` only.
- `update_history` — surfaced in `explain` and via `data_version`
  signalling, not in default projections.

- **User value**: a future maintainer asking "why doesn't `enumerate`
  return key_findings?" finds the answer in 30 seconds, in the SDK
  README, instead of reading 3000 lines of plan body.
- **Provability**: README section exists, links from corpus
  TSDoc comments.
- **Architecture validation**: confirms negative-space-as-doc is the
  right scaffold (vs. negative-space-as-test).

### Phase J: Wiring (T16–T18)

**T16: Public export** — Export `EvidenceCorpus` type and EEF
constants/getters from `public/mcp-tools.ts`.

**T17: Resource registration** — Register `curriculum://eef-methodology`
and `curriculum://eef-strands` in `register-resources.ts` via the
existing `registerGraphResource()` helper.

**T18: ADR-123 update** — Document, framed as a delta over whatever
baseline ADR-123 carries at promotion time (graph-query-layer's
21-tool addition lands first if Increment 1 → ACTIVE precedes
Increment 2):

- 2 new resources (`curriculum://eef-methodology`,
  `curriculum://eef-strands`).
- 3 new tools (`eef-recommend-evidence-for-context`,
  `eef-explain-evidence-strand`, `eef-compare-evidence-strands`).
- 2 new prompts (`eef-evidence-grounded-lesson-plan`,
  `eef-pupil-premium-strategy-review`).
- The corpus-vs-graph-vs-factory layering.
- The default-projection convention for resources.

### Phase K: Tests (T19)

**T19: E2E shape conditions** — both the structural surface and the
structural-citation invariant are tested at the boundary we control.

**Shape conditions** (what this plan proves and ships):

- All three tools appear in `tools/list`; both resources in
  `resources/list`; both prompts in `prompts/list`.
- Tool calls return valid responses matching declared types.
- Recommendation response includes `data_coverage` and `data_version`.
- The `Citation` type (T12) carries non-empty `caveats` and the
  enclosing response carries a non-empty `citations` array on every
  recommendation, explain, and compare response. Both invariants are
  enforced at compile time via the non-empty tuple types
  (`readonly [string, ...string[]]`,
  `readonly [Citation, ...Citation[]]`) and re-asserted at runtime
  via Zod `.min(1)` validation in unit/integration tests. This is
  the structural invariant; no LLM behaviour is being tested here.
- ADR-123 row count matches actual surface count at promotion time
  (delta-framed: this plan adds 3 tools, 2 prompts, 2 resources over
  whatever baseline ADR-123 carries when the corpus plan is promoted).

**Outcome verification is a separate concern.** Whether caveats
survive LLM paraphrasing into a lesson plan, whether teachers act
on recommendations, whether SENCO workflow time changes — all of
these are valuable to know but **we do not have the right
infrastructure** to verify them in this plan, and shoehorning a
non-deterministic LLM-graded test into Vitest would be an
infrastructure-shaped lie. The named follow-on is
[`../future/eef-outcome-evaluation-infrastructure.plan.md`](../future/eef-outcome-evaluation-infrastructure.plan.md).
Until then, what we ship and prove is the structural enforcement at T12; the
rest is honestly out of scope.

**Specific test files to update**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts`
  — update the hardcoded `aggregatedTools` array to reflect three new
  EEF tools at promotion time.

### Phase L: Credits (T20)

**T20: Credits** — Add John Roberts (`<john.roberts@thenational.academy>`)
to:

- Root `README.md` authors section.
- `ATTRIBUTION.md` with the EEF MCP server prototype credit.

Per the strategy doc's standing requirement: this MUST happen in the
first commit that ships any of T1-T19 to `main`. Failure to do so is a
release-blocker.

## Sequencing

```text
[depends on knowledge-graph-integration/current/graph-query-layer.plan.md
 reaching ACTIVE; can plan in parallel.]

T2 zod loader   ─┬─▶ T3 methodology resource  ┐
                 │                              │
                 └─▶ T4 strands resource       │
                                                │
T1 corpus shape ─┬─▶ T5 scoring engine ───────┐│
                 │                             ▼▼
                 │                          T6 recommend tool ─┐
                 │                          T7 explain tool    │
                 │                          T8 compare tool    │
                 │                                              │
                 └─▶ T9 guidance constant ───┐                  │
                                              ▼                  │
                                          T10 lesson-plan prompt │
                                          T11 PP-review prompt   │
                                                                  ▼
                                          T12 citation shape ◀─── (cross-cuts T5-T8)
                                                                  │
                                          T15 negative-space doc  │
                                          T13 freshness gate      │
                                          T14 telemetry           │
                                                                  │
                                          T16 public export ◀─────┘
                                          T17 register resources
                                          T18 ADR-123 update
                                                                  │
                                          T19 E2E (shape + structural citations) ◀─ all
                                          T20 credits (load-bearing)
```

## Size Estimate

| Component | Lines |
|---|---|
| Corpus types + scoring engine | ~250 |
| Zod loader + schemas | ~200 (preserved from predecessor) |
| 2 resources via factory | ~80 |
| 3 tools (recommend, explain, compare) | ~350 |
| Guidance constant | ~80 |
| 2 prompts | ~250 |
| Citation type + structural enforcement | ~100 |
| Refresh script | ~150 |
| Telemetry seams | ~120 |
| Tests (unit + E2E) | ~500 |
| Documentation (ADR-123 + TSDoc + negative-space README) | ~200 |
| **Total new code** | **~2280 lines** |

This is larger than the predecessor's estimate (~600 lines) because:

- Citation structural enforcement (T12) is new.
- Two additional tools (explain, compare) are new.
- One additional prompt (PP review) is new.
- Refresh + freshness gate + telemetry + negative-space are new.

The size growth is the cost of converting prescriptions into structural
invariants and adding operational completeness.

## Exit Criteria

See T19. Structural conditions are load-bearing: tools/resources/prompts are
listed, declared types match, responses carry non-empty citations and caveats,
recommendations carry `data_coverage` and `data_version`, freshness/telemetry
surfaces are in place, and the N=50 structural sample meets the target above.

Outcome conditions are not a slice-1 gate. Teacher trust, SENCO workflow time,
and LLM paraphrase preservation are worth evaluating, but they require a
dedicated evaluation harness, rubric ownership, sampling protocol, and cadence
outside Vitest. That evaluation infrastructure is a follow-on, not hidden work
inside this plan.

## Risks

1. **Graph-query-layer plan slips and blocks this one**. Mitigation:
   Phase A's T1 (corpus shape) is the *only* task with a hard dependency
   on the graph layer. T2-T18 can prototype against an in-line stub of
   `GraphView` and replace with the real interface when it lands. No
   silent over-fitting — the stub is short-lived and reviewed against
   the eventual interface.

2. **Citation enforcement misfires on lesson-plan prompt outputs**.
   The prompt produces lesson-plan prose; structural citation discipline
   is on the upstream tool calls, not the LLM's prose. Mitigation: T19
   proves the intermediate tool-call traces preserve citation/caveat/data
   coverage fields structurally; final lesson-plan paraphrase evaluation is
   routed to
   [`../future/eef-outcome-evaluation-infrastructure.plan.md`](../future/eef-outcome-evaluation-infrastructure.plan.md).

3. **Refresh ownership remains nominal not real**. CI gate exists, but
   nobody owns the refresh PR. Mitigation: ADR amendment (T13) names a
   specific role/team, not a person. If no owner, no merge.

4. **R8 (partial-coverage honesty) drift in agent prose**. The
   `data_coverage` field is present on every response, but agents may
   paraphrase it away. Mitigation: include data_coverage as a required
   line in the lesson-plan and PP-review prompt outputs (template
   prescription), prove the structured field exists in T19, and route
   paraphrase-survival measurement to the follow-on evaluation plan.

5. **Adding two new tools (explain, compare) increases the agent
   surface beyond what's testable in initial use**. Mitigation: ship
   them anyway because Workflow B (T11) needs them, but in follow-on
   outcome sampling, separately measure adoption — if explain/compare
   are <5% of corpus tool calls after 8 weeks, surface in retrospective.

## Promotion Trigger from CURRENT to ACTIVE

Promote when:

1. Owner has approved the architecture session conclusions (DONE).
2. The graph-query-layer plan
   ([`../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md))
   has reached ACTIVE.
3. EEF data provenance has been checked with EEF or Oak's EEF contact. If a
   public download/API, direct-supply process, or newer replacement snapshot is
   available, the snapshot is refreshed before any code work begins; otherwise
   the promotion notes explicitly record that the checked-in JSON remains the
   definitive source pending EEF clarification.
4. The conservation map ([`../reference/conservation-map.md`](../reference/conservation-map.md))
   has been reviewed and signed off — every concept from the
   predecessor has a verified home in this plan or in a sibling.
5. The plan-body first-principles check has been re-applied to the
   citation type, the corpus operations, and the test shapes.

## Foundation Documents

Before promoting:

1. [`principles.md`](../../../../directives/principles.md)
2. [`testing-strategy.md`](../../../../directives/testing-strategy.md)
3. [`schema-first-execution.md`](../../../../directives/schema-first-execution.md)
4. ADR-029 (cardinal rule — does not bind here; ADR-157 §Typing
   Discipline applies).
5. ADR-123 (MCP-server primitives strategy — this plan extends).
6. ADR-157 (multi-source open education integration — this plan
   instances).
7. The graph-query-layer plan (foundation).
8. The strategy doc [`../future/evidence-integration-strategy.md`](../future/evidence-integration-strategy.md)
   — R1-R8 source.

## Key Files (preserved checklist from predecessor + corpus additions)

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/data/eef-toolkit.json` | NEW (copy from `../reference/`) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-toolkit-data.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts` | NEW (corpus extension; this plan) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/scoring.ts` | NEW (corpus extension; this plan) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-methodology-resource.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-strands-resource.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/eef-evidence-guidance.ts` | NEW (landed 2026-05-22) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-recommend.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-explain.ts` | NEW (this plan adds) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-compare.ts` | NEW (this plan adds) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add entries for 3 EEF tools |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Add handlers for 3 EEF tools |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Add exports |
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` | Add 2 prompts |
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts` | Add messages for 2 prompts |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Add resource registrations |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts` | Update counts + structural shape/citation assertions |
| `scripts/refresh-eef-toolkit.ts` | NEW (this plan adds; T13) |
| `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Add 2 resources, 3 tools, 2 prompts |
| Root `README.md` | Add JR to authors (T20) |
| `ATTRIBUTION.md` | Add EEF MCP server prototype credit (T20) |

## Cross-Plan References

- **Predecessor (preserved byte-identical)**: the predecessor (recoverable via `git show e2796757:.agent/plans/exploring-open-education-resources/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`)
- **Conservation map**: [`../reference/conservation-map.md`](../reference/conservation-map.md)
- **Foundation (Inc 1)**: [`../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md)
- **Journeys (Inc 3)**: [`../../../connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md)
- **Parent (coordinator)**: [`../../../connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) — this plan owns its WS-3.
- **Strategy**: [`../future/evidence-integration-strategy.md`](../future/evidence-integration-strategy.md)
- **Technical reference**: [`../reference/oak-eef-technical-comparison.md`](../reference/oak-eef-technical-comparison.md)
- **Data**: [`../reference/eef-toolkit.json`](../reference/eef-toolkit.json)
- **Session insight (full record)**: [`.agent/memory/active/napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../../../../memory/active/napkin.md)

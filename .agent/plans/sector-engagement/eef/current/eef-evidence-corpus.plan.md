---
name: "EEF Evidence Corpus Surface"
overview: "Expose the EEF Teaching and Learning Toolkit as an evidence corpus (graph + ranking engine) on top of the graph query layer, with two pedagogical prompts, structural citation discipline, telemetry, and a freshness story. Increment 2 (and EEF-side of 3+4) of the graph-and-corpus delivery sequence."
parent_plan: "../../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "../../../knowledge-graph-integration/current/graph-query-layer.plan.md"
  - "../../../knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md"
  - "../../../knowledge-graph-integration/future/cross-source-journeys.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, test-reviewer, type-reviewer, sentry-reviewer"
status: current
isProject: false
todos:
  - id: t1-corpus-shape
    content: "Define EvidenceCorpus = GraphView + ScoringEngine in the SDK; EEF strands becomes the first concrete corpus."
    status: pending
  - id: t2-zod-loader
    content: "Zod-validated loader for eef-toolkit.json (preserves the F1-F4 + F7 resolutions from the original plan)."
    status: pending
  - id: t3-methodology-resource
    content: "Methodology+caveats resource via graph factory (preserves F6 + F11 resolutions)."
    status: pending
  - id: t4-strands-resource
    content: "Strands resource via graph factory; default projection avoids dumping deep fields (F11)."
    status: pending
  - id: t5-scoring-engine
    content: "ScoringEngine with composite weighting (40/30/20/10), null-impact guard (F5), and rationale generation (R1, R2, R7)."
    status: pending
  - id: t6-recommend-tool
    content: "recommend-evidence-for-context tool composing GraphView.enumerate_nodes + ScoringEngine.rank, with explicit data_coverage in response (F8, R8)."
    status: pending
  - id: t7-explain-tool
    content: "explain-evidence-strand tool: returns full strand context with citations, caveats, provenance, and update_history."
    status: pending
  - id: t8-compare-tool
    content: "compare-evidence-strands tool: side-by-side comparison across user-selected dimensions."
    status: pending
  - id: t9-guidance-constant
    content: "eef-evidence-guidance.ts with AGGREGATED_EEF_EVIDENCE_GUIDANCE (preserves R1, R3, R7 prescriptions)."
    status: pending
  - id: t10-lesson-plan-prompt
    content: "evidence-grounded-lesson-plan prompt (preserves F8, F9, F10 resolutions; KS-to-phase mapping inline)."
    status: pending
  - id: t11-pp-review-prompt
    content: "pupil-premium-strategy-review prompt (Workflow B from strategy doc; previously not in executable plan)."
    status: pending
  - id: t12-citation-shape
    content: "Citation discipline: every recommendation/explain/compare response carries {strand_id, data_version, last_updated, caveats[]} as structured fields, not prose."
    status: pending
  - id: t13-freshness-gate
    content: "CI gate that fails when eef-toolkit.json is >180 days old; refresh script + ADR documenting refresh ownership."
    status: pending
  - id: t14-telemetry
    content: "Sentry spans on every corpus operation; named metrics for recommendations served, distinct contexts, citation-presence rate."
    status: pending
  - id: t15-negative-space-doc
    content: "Document fields deliberately not exposed in default projections (and why)."
    status: pending
  - id: t16-public-export
    content: "Export EvidenceCorpus type + EEF resource constants from public/mcp-tools.ts."
    status: pending
  - id: t17-register-resources
    content: "Register EEF resources via existing registerGraphResource() helper."
    status: pending
  - id: t18-adr-123-update
    content: "ADR-123: add EEF resources, recommend/explain/compare tools, lesson-plan and PP-review prompts. Document corpus-vs-graph layering."
    status: pending
  - id: t19-e2e
    content: "E2E for shape AND outcome: tools listed, resources listed, AND citation-presence ≥95% across N=50 sampled responses."
    status: pending
  - id: t20-credits
    content: "Add John Roberts to repo authors; record in ATTRIBUTION.md and root README per the strategy doc's standing requirement."
    status: pending
---

# EEF Evidence Corpus Surface

**Status**: CURRENT — replaces the previous `eef-evidence-mcp-surface.plan.md`.
The predecessor was preserved byte-identically in `originals/` during
the restructure for an independent verification pass; after that pass
confirmed no semantic loss (see [`../reference/conservation-map.md`](../reference/conservation-map.md)
§N), `originals/` was deleted. The pre-session predecessor remains
permanently recoverable via `git show e2796757:<path>`.
**Last Updated**: 2026-04-30
**Branch**: `feat/eef_exploration` (originating session); execution branch
TBD when promoted to ACTIVE.
**Increment**: 2 (with EEF-side of 3 and 4) of the EEF graph-and-corpus
delivery sequence.

## Why This Plan Replaces Its Predecessor

The previous plan (`eef-evidence-mcp-surface.plan.md`, recoverable via
`git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`)
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

## User-Value Template (mandatory on every task)

```text
**User value**: [Specific user] can [do what they couldn't before]
              resulting in [observable teacher/learner outcome].
**Provability**: [How will we know? "Not yet provable, will be when X"
              is acceptable; hand-waving is not.]
**Architecture validation**: [What assumption does this confirm or break?]
```

## Plan Top-Line User Value

- **User value**: A teacher (or AI client serving a teacher) can ask
  "what evidence-backed approach works for {phase, subject, focus}?" and
  receive a ranked list of approaches with **structural citations**
  (strand id + data version + caveat) — not prose recommendations the
  agent has paraphrased away.
- **Provability**: caveat-presence rate sampled across N=50
  recommendation responses (LLM-graded against a rubric); target ≥95%.
  Distinct teachers served per week (Sentry); distinct contexts queried
  per week.
- **Architecture validation**: confirms that
  `EvidenceCorpus = GraphView + ScoringEngine` is the right composition,
  and that citations carried as structured fields survive LLM
  paraphrasing better than caveats requested in prose.

## Composition Model

```text
GraphView (foundation, lives in knowledge-graph-integration/current/graph-query-layer.plan.md)
  ├── manifest, summary
  ├── get_node, enumerate_nodes (with projection)
  ├── neighbours, subgraph
  └── find_by_tag

EvidenceCorpus = GraphView + ScoringEngine  ← THIS PLAN ADDS THE SCORING LAYER
  ├── (everything from GraphView)
  ├── rank(filter, weights, context) → RankedResults with rationale
  ├── explain(node, context) → caveats, provenance, update_history
  └── compare(node_ids, dimensions) → side-by-side
```

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
is at [`../reference/eef-toolkit.json`](../reference/eef-toolkit.json).
Re-validated 2026-04-30:

- 30 strands ✓
- 4 null-impact strands with matching IDs ✓
  (`eef-tl-aspiration-interventions`, `eef-tl-learning-styles`,
  `eef-tl-outdoor-adventure-learning`, `eef-tl-school-uniform`)
- 17 with `school_context_relevance` ✓
- 4 with `implementation` block ✓
- 6 with `behind_the_average` ✓
- 9 caveats ✓ (drift in old strategy doc fixed in
  this session)

Snapshot is 28 days old at plan-write time. Caveat #8 in the JSON itself
notes that the data reflects "May 2025 and October 2025 living
systematic review updates where available". A fresh upstream check
against the EEF website is **a precondition for promotion to ACTIVE**.

## Credits and Attribution (load-bearing)

- **EEF Toolkit data**: Education Endowment Foundation
  ([educationendowmentfoundation.org.uk](https://educationendowmentfoundation.org.uk/)).
  Original research authors: Higgins, S.; Katsipataki, M.;
  Kokotsaki, D.; Coleman, R.; Major, L.E.; Coe, R.
- **EEF MCP server prototype**: John Roberts (JR)
  `<john.roberts@thenational.academy>`. **JR must be added to the
  repo's authors list (root README + ATTRIBUTION.md) when this plan
  ships its first commit.** See **T20**.

## Impact-Preserving Requirements (R1–R8 from strategy doc)

This plan must satisfy all eight. Mapping to executable todos below:

| Req | Subject | Where it lands |
|---|---|---|
| **R1** Epistemic honesty | every recommendation includes impact + evidence + caveat | T5, T6, T12 (structural enforcement) |
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
export interface EvidenceCorpus<TNode, TEdgeType extends string>
  extends GraphView<TNode, TEdgeType> {
  rank(opts: RankOptions<TNode>): RankedResults<TNode>;
  explain(opts: ExplainOptions): NodeExplanation<TNode>;
  compare(opts: CompareOptions<TNode>): ComparisonResult<TNode>;
}
```

**T2: Zod-validated loader** — `oak-curriculum-sdk/src/mcp/data/eef-toolkit.json`
(copied from this plan's `../reference/`) and
`oak-curriculum-sdk/src/mcp/eef-toolkit-data.ts`. Preserves predecessor
F1 (data home is SDK, not codegen — third-party static data),
F2/F3 (all fields typed, no `Record<string, unknown>` except the
schema-meta `school_context_schema.properties`), F4 (direct Zod parse
at load, not `as const satisfies`), F7 (Zod validation at import time).

The full Zod schema is preserved verbatim from the predecessor; see
the predecessor (recoverable via `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`)
§Phase 1.

- **User value**: any schema drift between EEF JSON and declared types
  fails loud at module load, not silently at runtime when a teacher
  asks a question.
- **Provability**: a deliberate corruption test (mutate a strand to
  drop a required field) MUST cause module-load failure in unit tests.
- **Architecture validation**: confirms Zod-at-boundary is correct
  for non-OpenAPI data sources (per ADR-157).

**Data-shape unit-test contract (preserved verbatim from predecessor)**.
The loader's unit tests must assert all of:

- `EefToolkitDataSchema.parse(rawData)` succeeds without throwing.
- The strands array has length `30`.
- Exactly `4` strands have `headline.impact_months === null`, and their
  IDs are: `eef-tl-aspiration-interventions`, `eef-tl-learning-styles`,
  `eef-tl-outdoor-adventure-learning`, `eef-tl-school-uniform`.
- Exactly `17` strands have `school_context_relevance` defined.
- `meta.caveats` has length `9`.
- Exactly `4` strands have `implementation` defined.
- Exactly `6` strands have `behind_the_average` defined.

These assertions are the early-warning system for upstream data drift.
A change in any count is a signal — never a silent fix.

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
`get-eef-strand` (graph layer) when they have a specific strand id in
hand. This is a structural application of progressive disclosure.

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
  caveats: readonly string[];
  citations: readonly Citation[];  // structured, not prose (T12)
}
```

- **User value**: agents downstream cannot accidentally hide the
  scoring rationale because it is a structured field on every result.
- **Provability**: unit tests assert that `rationale` is non-empty
  and references the four components in every result.
- **Architecture validation**: confirms scoring belongs in the corpus
  layer (orthogonal to GraphView), and that citations as structured
  fields survive better than citations in prose.

### Phase D: Tools (T6–T8)

**T6: `recommend-evidence-for-context`** — preserves the predecessor's
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

- **User value**: same as plan top-line.
- **Provability**: Sentry span per call; recommendation count per week;
  caveat-presence rate (T19).
- **Architecture validation**: confirms the corpus/tool boundary —
  the tool is thin and routes through the corpus interface.

**T7: `explain-evidence-strand`** — NEW. Returns full context for one
strand: definition (short + full), key_findings, effectiveness,
behind_the_average, closing_the_disadvantage_gap, implementation,
related_strands, related_guidance_reports, update_history. Carries
`data_version` and structural caveats.

- **User value**: a teacher who has identified a strand can drill into
  full evidence detail with one tool call, including `update_history`
  so they know how recent the evidence is.
- **Provability**: tool call count after a `recommend-evidence-for-context`
  call (the natural funnel).
- **Architecture validation**: confirms `get_node`-with-rich-projection
  is the right primitive for "tell me everything about this".

**T8: `compare-evidence-strands`** — NEW. Side-by-side comparison
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
constant. Preserves the predecessor T5 content: always cite evidence
strength alongside impact, surface caveats, frame as decision-support
not prescription, note partial coverage honestly. The guidance is
imported into all three tool definitions (T6, T7, T8) so agents see
consistent framing.

**T10: `evidence-grounded-lesson-plan` prompt** — preserves predecessor
T10 verbatim, including F8 resolution (step 3 = extract implementation
data from recommendation response, no separate tool), F9 resolution
(KS-to-phase mapping inline in prompt), F10 resolution (focus enum
matches data values).

- **User value**: a teacher's "design a lesson on photosynthesis for
  Year 8" is answered with a structured plan that integrates 2-3
  EEF-evidenced approaches with caveats per approach.
- **Provability**: prompt invocation count; manual review of N=20
  outputs against a rubric (caveat present, evidence-strength shown,
  approach-to-content mapping coherent); target ≥80% pass.
- **Architecture validation**: confirms prompts can carry workflow
  orchestration without needing a new MCP primitive — at least for
  intra-source workflows.

**T11: `pupil-premium-strategy-review` prompt** — NEW. Workflow B from
the strategy doc, now executable. Parameters: `current_approaches: string[]`,
`phase: enum`, `pp_percentage: number`. Orchestrates:

1. For each current approach: `explain-evidence-strand`.
2. `recommend-evidence-for-context` with `focus=closing_disadvantage_gap`
   and the school's phase + PP %.
3. `compare-evidence-strands` for current vs recommended approaches.
4. Output: structured review {current_evidence_assessment[], recommended_approaches[],
   gaps[], implementation_quality_questions[]}.

- **User value**: a SENCO/PP-lead can produce an evidence-grounded
  review of current strategies in one tool sequence, with citations
  the PP reviewer can audit, instead of manually composing across
  EEF strand pages.
- **Provability**: prompt invocation count; sample manual review of
  N=10 outputs against PP-review-quality rubric.
- **Architecture validation**: confirms two distinct prompts can share
  the same three corpus tools without coupling. If we end up duplicating
  orchestration logic, the design needs revisiting in the journeys plan.

### Phase F: Citation discipline as structural enforcement (T12)

**T12: Citation shape** — Every response from T6, T7, T8 carries:

```typescript
interface Citation {
  strand_id: string;
  strand_name: string;
  source: 'EEF Teaching and Learning Toolkit';
  data_version: string;
  last_updated: string;
  eef_url: string;          // direct link to the strand page
  caveats: readonly string[];
}
```

This is a **structural** invariant: the response type makes it
impossible to ship a recommendation without a citation array. The
generated TS types enforce this at compile time; the Zod runtime
validation (used in tests) re-asserts it. This converts R1 and R7 from
prose prescriptions into type-system invariants.

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
`meta.last_updated` >180 days old. A refresh script
(`scripts/refresh-eef-toolkit.ts`) that fetches the upstream EEF
data, validates it against the Zod schema, and produces a diff
summary for human review. An ADR (or amendment to ADR-157) names the
refresh owner.

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

**T18: ADR-123 update** — Document:

- 2 new resources (`curriculum://eef-methodology`,
  `curriculum://eef-strands`).
- 3 new tools (`recommend-evidence-for-context`,
  `explain-evidence-strand`, `compare-evidence-strands`).
- 2 new prompts (`evidence-grounded-lesson-plan`,
  `pupil-premium-strategy-review`).
- The corpus-vs-graph-vs-factory layering.
- The default-projection convention for resources.
- Aggregated-tool count update (current 11 → 14).

### Phase K: Tests (T19)

**T19: E2E with shape AND outcome conditions** — both required.

**Shape conditions** (necessary):

- All three tools appear in `tools/list`; both resources in
  `resources/list`; both prompts in `prompts/list`.
- Tool calls return valid responses matching declared types.
- Recommendation response includes `data_coverage` and `data_version`.
- ADR-123 row count matches actual surface count.

**Outcome conditions** (also required):

- Citation-presence rate ≥95% across N=50 sampled
  recommendation responses (LLM-graded against rubric: every
  recommendation includes strand_id, data_version, eef_url, ≥1 caveat).
- Recommendation latency p95 ≤500ms (Sentry sample over 24h).
- At least one full lesson-plan-prompt round-trip produces an output
  with caveats present in the final lesson-plan text (not just the
  intermediate recommendation).

**Specific test files to update** (preserved from predecessor's key-files
table):

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts`
  — update the hardcoded `aggregatedTools` array to reflect three new
  EEF tools.
- Aggregated-tool count update in ADR-123: confirm baseline at
  implementation time (predecessor expected 11 → 12 for one tool;
  this plan adds three tools — the actual baseline at promotion time
  may differ if WS-2 misconception tool has already shipped).

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
                                          T19 E2E (shape + outcome) ◀─ all
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

See T19. Outcome conditions are load-bearing. A plan that ships all
shape conditions but produces no observable change to teacher trust or
SENCO workflow time has not delivered the user value the plan exists for.

## Risks

1. **Graph-query-layer plan slips and blocks this one**. Mitigation:
   Phase A's T1 (corpus shape) is the *only* task with a hard dependency
   on the graph layer. T2-T18 can prototype against an in-line stub of
   `GraphView` and replace with the real interface when it lands. No
   silent over-fitting — the stub is short-lived and reviewed against
   the eventual interface.

2. **Citation enforcement misfires on lesson-plan prompt outputs**.
   The prompt produces lesson-plan prose; structural citation discipline
   is on the upstream tool calls, not the LLM's prose. Mitigation: T19's
   outcome condition specifically samples the *final lesson-plan text*
   for caveat presence, not just the intermediate tool-call traces.

3. **Refresh ownership remains nominal not real**. CI gate exists, but
   nobody owns the refresh PR. Mitigation: ADR amendment (T13) names a
   specific role/team, not a person. If no owner, no merge.

4. **R8 (partial-coverage honesty) drift in agent prose**. The
   `data_coverage` field is present on every response, but agents may
   paraphrase it away. Mitigation: include data_coverage as a required
   line in the lesson-plan and PP-review prompt outputs (template
   prescription) AND sample for it in T19.

5. **Adding two new tools (explain, compare) increases the agent
   surface beyond what's testable in initial use**. Mitigation: ship
   them anyway because Workflow B (T11) needs them, but in T19's
   outcome sampling, separately measure adoption — if explain/compare
   are <5% of corpus tool calls after 8 weeks, surface in retrospective.

## Promotion Trigger from CURRENT to ACTIVE

Promote when:

1. Owner has approved the architecture session conclusions (DONE).
2. The graph-query-layer plan
   ([`../../../knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../knowledge-graph-integration/current/graph-query-layer.plan.md))
   has reached ACTIVE.
3. A fresh upstream EEF data check has been performed; if a new
   version is available, the snapshot is refreshed before any code
   work begins.
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
| `packages/sdks/oak-curriculum-sdk/src/mcp/eef-evidence-guidance.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-recommend.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-explain.ts` | NEW (this plan adds) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-compare.ts` | NEW (this plan adds) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add entries for 3 EEF tools |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Add handlers for 3 EEF tools |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Add exports |
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` | Add 2 prompts |
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts` | Add messages for 2 prompts |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Add resource registrations |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts` | Update counts + outcome assertions |
| `scripts/refresh-eef-toolkit.ts` | NEW (this plan adds; T13) |
| `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Add 2 resources, 3 tools, 2 prompts |
| Root `README.md` | Add JR to authors (T20) |
| `ATTRIBUTION.md` | Add EEF MCP server prototype credit (T20) |

## Cross-Plan References

- **Predecessor (preserved byte-identical)**: the predecessor (recoverable via `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`)
- **Conservation map**: [`../reference/conservation-map.md`](../reference/conservation-map.md)
- **Foundation (Inc 1)**: [`../../../knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../knowledge-graph-integration/current/graph-query-layer.plan.md)
- **Journeys (Inc 3)**: [`../../../knowledge-graph-integration/future/cross-source-journeys.plan.md`](../../../knowledge-graph-integration/future/cross-source-journeys.plan.md)
- **Parent (coordinator)**: [`../../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md`](../../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) — this plan owns its WS-3.
- **Strategy**: [`../future/evidence-integration-strategy.md`](../future/evidence-integration-strategy.md)
- **Technical reference**: [`../reference/oak-eef-technical-comparison.md`](../reference/oak-eef-technical-comparison.md)
- **Data**: [`../reference/eef-toolkit.json`](../reference/eef-toolkit.json)
- **Session insight (full record)**: [`.agent/memory/active/napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../../../../memory/active/napkin.md)

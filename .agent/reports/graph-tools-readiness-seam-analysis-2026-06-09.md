# Graph Tools Readiness — Seam Analysis and Deliverable Decomposition

**Date**: 2026-06-09
**Session**: Fragrant Spreading Sapling (`47f78a`), claude / Fable 5, branch `feat/graph-migration-part-1`
**Subject**: [`graph-tools-value-redesign.plan.md`](../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
**Owner direction (2026-06-09, session open)**: the recommended surface/graph Step-0 split is too
crude. Deeply analyse the entire document, find the real membranes, then subdivide the plan into
independent deliverables demarked as separate PRs — "useful but easily analysed collections of
meaningful changes", at least two PRs for the session output, multiple PRs for the graph work.

## 1. Verified findings that redraw the document's own boundaries

Every claim below was verified first-hand against the tree this session (manifest snapshot
`2026-05-21T13:45:16.086Z` for all bulk-data numbers).

### 1.1 Keywords is a different solution-class (plan grounding falsified)

- `get-keywords` is a **generated live-API tool** (`/keywords` GET, invoking
  `client["/keywords"].GET` at request time —
  `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`).
  It is dispatched via the generated-tools path, not `AGGREGATED_HANDLERS`
  (`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts:165-179`).
- It **already accepts** optional `subject` / `keyStage` / `phase` / `unit` / `lesson` query
  parameters. The ~205 KB flood (owner-observed live, 2026-06-08) is the API's response shape at
  coarse anchors, not an absent input surface.
- The plan's claim that keywords are "bulk-derived (the `vocab-gen` keyword extractor …)" conflates
  two pipelines: the keyword extractor feeds the **`vocabulary-graph`** corpus
  (`src/bulk/generators/vocabulary-graph-generator.ts`, `toNode(keyword)`), which the plan itself
  **excludes** as consumer-less. No keyword corpus exists under `src/generated/vocab/`.
- The cited extractor path is also stale: the live pipeline extraction runs from
  `vocab-gen/extractors/` (`vocab-gen-core.ts` imports `./extractors/index.js`);
  `src/bulk/extractors/` is a second copy consumed by the `src/bulk` generators — a verified
  duplication smell recorded for resolution in execution.
- No served prompt instructs a `get-keywords` call (verified against `mcp-prompt-messages.ts`).

**Consequence**: redesigning keywords on the graph substrate means **replacing a generated API tool
with a corpus-backed aggregated tool** — a provenance switch (live API data → 2026-05-21 bulk
snapshot) in ADR-029/030/031 Cardinal-Rule territory that the plan never confronts. This is an
owner decision (§5.2), not a sibling redesign unit.

### 1.2 The "required" GraphView extension has a zero-substrate-change alternative

Verified: `GraphView` exposes exactly one operation, `subgraph({rootIds, depth})`
(`packages/core/graph-core/src/graph-view/interface.ts:60-65`), and `createGraphView`'s BFS follows
every outgoing edge (edge-type-agnostic). But edge-type-selective traversal does not require a
substrate extension:

- **Option (i) — plan as written**: add an `edgeTypes?` filter to `subgraph` (per-edge-type
  adjacency), real operations + tests (ADR-173).
- **Option (ii) — per-view construction (no substrate change)**: each view constructs its own
  `GraphView` instance over the one corpus's node/edge data, selecting exactly the node kinds and
  typed edges it traverses at construction time (`CreateGraphViewInput` already takes arbitrary
  node/edge subsets). The prerequisite view includes only `prerequisiteFor` edges; the misconception
  view includes only the `thread→unit→lesson→misconception` chain. Edge-type selectivity becomes a
  construction concern; the landed substrate is sufficient; `manifest()` stays absent. Memory cost
  is trivial (edge sets are thousands of rows over shared data).

Option (ii) is simpler without compromising quality and adds no new substrate surface; it is the
draft verdict (§4.3), put to R1 architecture review with both options open.

### 1.3 Thread-progressions ordering cannot ride GraphView edges

`SubgraphResult` edges are `{source, type, target}` with no attributes
(`packages/core/graph-core/src/graph-view/types.ts:14-21`), so per-(thread, unit) sequence order
cannot be expressed through `subgraph()`. The plan's claim that all four views "map onto that one
extended `subgraph` op" is wrong for the sequence view: thread-progressions is an **ordered corpus
projection** (its own real operation in the view layer over the same one-graph data), which the
plan itself half-recognises ("not graph-forced"). This changes the view's mechanism description,
not the deliverable structure.

### 1.4 Data-grounding results (checks a–c; command recipes conserved in §10)

**(a) prior-knowledge (1,607 nodes / 3,452 edges — count confirmed):**

- Depth bounds work: BFS over 161 deterministic anchors reaches median 2 / p90 4 / max 8 nodes at
  depth 1; median 5 / p90 9 / max 18 at depth 2; median 8 / p90 18 / max 40 at depth 3 (2.5% of the
  graph at worst). Unbounded traversal maxes at 407 nodes (25%). **Default bound: depth 2,
  caller-adjustable** — empirical basis recorded here.
- **The corpus is NOT a DAG** (plan correction): 28 self-loop edges and 4 two-node cycles (all
  maths units; no SCC larger than 2). The landed BFS is visited-set-safe; the self-loops are a
  source-data quality signal (upstream feedback candidate).
- **5 edge-endpoint slugs are not in the node set** (effective universe 1,612). The landed
  `createGraphView` **throws at construction** on unknown endpoints, so the current corpus cannot
  load into the substrate as-is. The re-projection must resolve this (emit the missing endpoint
  nodes from bulk, or drop dangling edges with provenance) — a named G1 obligation.

**(b) misconception `lessonSlug` density:** 100.00% present and non-empty across all 12,858 nodes;
zero slug→title conflicts; subject/keyStage also 100%. **Cardinality caveat**: 12,385 distinct
lessons, median 1 / max 2 misconceptions per lesson — the lesson anchor returns at most 2 items, so
the **value concentrates in unit and thread anchors** (fan-out over many lessons).

**(c) bulk chain (5 files sampled spanning 3.7–76.5 MB):** the
`thread→unit→lesson→misconception` chain is fully navigable (100% field presence; ≥99.8% of lessons
carry ≥1 misconception). Anchor payloads: **unit anchor 2–11 KB typical, <20 KB worst** (the sweet
spot); **thread anchor median ~20 KB, p90 ~81 KB, max ~262 KB** of misconception bodies (~0.45 MB
with envelope) — bounded but heavy-tailed. Two recorded caveats: maths-primary's largest thread
spans 77% of its subject's units (a thread anchor is not a small slice of its own subject for
mega-threads); english-secondary has 11 of 70 units (15.7%) carrying no thread (thread-unreachable
units — the misconception view must not present thread-anchored results as subject-complete).

**(d) as written is dissolved**: its existence half is answered by §1.1; whatever bounded-keywords
shape survives the owner's disposition defines its own grounding check.

### 1.5 The document's own seam enumerations disagree (evidence for "too crude")

The banner splits "§A2–§A5, **§B**, §C"; §Sequencing splits "§B2–§B4" (B1 stays); line ~556 names
"context A5" graph-coupled while both lists put A5 in the split set; ledger row F's factory
disposition ("named at promotion") appears in none of the six readiness items. The decomposition
below dissolves these contradictions rather than patching them.

## 2. The seam map

The real membranes, derived from dependency structure, solution class, and review shape:

| Membrane | What it separates | Why it is real |
| --- | --- | --- |
| Solution-class | Generated-corpus zero-input aggregated tools (misconception, prior-knowledge, thread-progressions) vs the live-API generated tool (keywords) vs static doc-resources (A2–A4) vs prompt-language quality (B2–B4) vs design-gated skills→prompts (C → S3, per §9) | Verified in code (§1.1); each class has a different change mechanism, risk profile, and reviewer |
| Dependency | One-graph identity model + per-view node-kind/edge growth → per-view tool rewrites | The model is decided once; the code grows incrementally per view (the plan's own one-graph clause); no big-bang ingestion deliverable exists |
| Surface cohesion | Each tool's rewrite moves its whole surface at once: tool + input schema + resource removal (A1) + prompt-step repoint (B1) + consumers + eef-revalidation signal | The plan's own staged-landing rule; splitting a tool's surface across PRs splits one authority across two states |
| Decision vs delivery | Mechanism decisions (A/B/D/E/F, identity, substrate question) vs the PR-shaped deliverables that consume them | Decisions settle once, before cycle authoring; deliverables land independently |
| Certainty | Owner-ratified value-shapes (fixed) vs open owner decisions (keywords; misconception anchor) vs falsified claims (corrections ledger) | Keeps the readiness review on a fixed target |

## 3. The deliverables map (each deliverable = one small PR)

### Track S — MCP surface quality (independent of the substrate; shippable immediately)

| ID | Deliverable | Contents | Key files |
| --- | --- | --- | --- |
| S1 | `doc-resources-single-source` | A2 remove `docs://oak/tools.md`; A3 remove/fold `docs://oak/workflows.md`; A4 de-duplicate `getting-started` Tips — all under the `curriculum://model`-is-canonical principle. A5 invariant (protect `curriculum://model` + `eef://interpretation`) honoured as acceptance. | `documentation-resources.ts`, `all-resources.ts` drift-guard test |
| S2 | `prompt-language-pass` | B3 fixed domain vocabulary (canonical terms from `curriculum://model`; `keyStage` ≠ `yearGroup`) + B4 distinguishable prompt names + B2 `adapt-lesson` arg-mapping — one fixed-language pass. Outward-facing renames need owner sign-off at PR. | `mcp-prompts.ts`, `mcp-prompt-messages.ts` |
| S3 | `skills-as-prompts` | §C as a live deliverable (added per §9, owner-directed 2026-06-10): c0 owner design gate (candidate set + reconciliation with the eight oak-skills curriculum commands), then one cycle per prompt, source-skill attribution carried. `oak-skills` going public is BENEFICIAL, not blocking. | `mcp-prompts.ts`, `mcp-prompt-messages.ts`, oak-skills content |

### Track G — the graph redesign (sequenced; G1 → G2 → G3; G4 conditional)

| ID | Deliverable | Contents | Depends on |
| --- | --- | --- | --- |
| G1 | `prior-knowledge-view` + one-graph foundation | Identity model instantiated (kind-qualified stable ids; placement-as-edge); vocab-gen emits the unit node kind + `prerequisiteFor` edges with **integrity resolution** (5 dangling endpoints; self-loop policy) + emitted-from-data types (Decision A), deleting hand-written `types.ts`; curriculum adapter + prerequisite view in `graph-corpus-sdk`; rewrite `get-prior-knowledge-graph` (anchor `unitSlug[]` + depth, default 2); **remove** `curriculum://prior-knowledge-graph` (A1); repoint `learning-progression` step 3 (B1); raise the eef-revalidation signal; **ADR-086 amendment rides this first re-emission commit**. | Settled decisions |
| G2 | `misconception-view` | Add thread/unit/lesson/misconception node kinds + the chain edges re-projected from bulk; misconception view (anchors per owner confirmation §5.3, with the english-secondary reachability gap + mega-thread semantics recorded in the tool contract); rewrite `get-misconception-graph`; remove its resource (A1); repoint `adapt-lesson` step 2 (B1); signal. | G1 |
| G3 | `thread-progressions-view` | Ordered sequence projection (own real operation — §1.3); rewrite `get-thread-progressions` (anchor `threadSlug` or `subject`+`keyStage`); remove its resource (A1); repoint `learning-progression` step 2 (B1); move the 3 stats interpolators (`tool-guidance-data.ts`, `tool-guidance-workflows.ts`, `ontology-data.ts`); signal; **graph-resource-factory retires here** (Decision F — last consumer leaves). | G1 (G2 lands the thread/unit kinds) |
| G0 | `graphview-edgetypes-extension` | **Conditional — only if R1 selects option (i)** (§1.2). If option (ii), no substrate change exists and this deliverable is absent. | R1 verdict |
| G4 | `keywords` | **Conditional on the owner disposition (§5.2)**: (1) corpus-backed view unit incl. generated-tool replacement mechanics; or (2) upstream API feature request (bounded/ranked params); or (3) removal from this plan with correction. | Owner decision |

### Session-output PRs (this readiness session, ≥2 per owner direction)

- **PR-A**: the 5 framing commits already on the branch + this report + the restructured plan
  (corrections ledger applied, decisions settled, deliverables demarked).
- **PR-B**: the executable TDD cycles per deliverable + R2 dispositions + the DECISION-COMPLETE
  flip.

## 4. Mechanism settle (drafts for R1; settled against landed code)

### 4.1 Decision A — data/type re-emission

`vocab-gen` emits the one-graph corpus (nodes + typed edges) per the established three-file JSON
loader pattern (`write-json-dataset.ts`), with **types computed from the extracted data** at
generation time (ADR-031), deleting the hand-written `types.ts` files. Anchor input types are
co-decided by domain size (TS7056 discipline): `subject`, `keyStage`, `threadSlug` (164) emit as
literal unions; `unitSlug` (~1.6k) and `lessonSlug` (~12.4k) emit as validated strings backed by
generated runtime sets (Constant-Type-Predicate Pattern, ADR-153). The EEF `typeof`/indexed-access
precedent (`eef-strands/raw-domains.ts`) is the model for finite-domain derivation.

### 4.2 Decision B — adapter home + dependency direction

**Option (a)**: `graph-corpus-sdk` imports the generated corpus from `@oaknational/sdk-codegen` via
a new approved single-level subpath export (ADR-108 invariant 2). Evidence: no circular back-edge
exists (`oak-sdk-codegen` has zero graph dependencies; `graph-corpus-sdk` depends only on
`graph-core` + `result` — verified in both `package.json`s); ADR-041 sdks row permits directed
sdk→sdk imports; ADR-108's consumer model ("all consumers depend on the generation workspace …
import from `@oaknational/sdk-codegen` subpaths directly") is the established precedent
(search-sdk, search-contracts). Option (b) (vocab-gen emits into `graph-corpus-sdk`) would put
bulk-derived generated artefacts outside the generation workspace, against ADR-108 boundary
invariant 4. **Draft verdict: (a).** R1 (barney/fred/betty) decides.

### 4.3 Substrate question (replaces "required extension")

Draft verdict: **option (ii) per-view construction** (§1.2) — no substrate change, landed real
operations only, `manifest()` stays absent. R1 decides between (i) and (ii); G0 exists only
under (i).

### 4.4 Decision D — codegen schema-emission shape

Default confirmed: **(a) projection module** — a generated module performing the projection +
single Zod call at the generated package's compile (the landed EEF D6 mechanism is the in-tree
instance). Note: per the plan (owner 2026-06-08), no MCP `outputSchema` ships with these units;
this decision covers the data/type emission only.

### 4.5 Decision E — landing order

**G1 prior-knowledge → G2 misconception → G3 thread-progressions** (+ G4 conditional).
Consumer-readiness: prior-knowledge and misconception serve the EEF value path; prior-knowledge
first because it is the smallest foundation-carrying landing (single node kind, single edge type,
edges already present in the source). E orders landing, not authoring.

### 4.6 Decision F — factory disposition (previously unowned)

`createGraphToolExecutor` / `createGraphToolDef` (`graph-resource-factory.ts`) cannot survive — the
whole-corpus `() => config.sourceData` shape is the problem being removed. Each redesign unit lands
its own anchored executor; the factory's per-tool consumers leave one by one and **the factory is
deleted in G3** (replace-don't-bridge; no third-consumer consolidation is presupposed — any shared
view mechanics are a third-consumer decision at G3).

### 4.7 Identity model (core, mechanism-independent)

Node ids are **kind-qualified, minted deterministically at vocab-gen** from `(kind, source key)` —
e.g. `unit:<unitSlug>`, `lesson:<lessonSlug>`, `thread:<threadSlug>`,
`misconception:<lessonSlug>#<n>` (misconceptions have no source key; the mint rule and its
stability across regenerations is a G2 cycle design item). Slugs remain content keys, never graph
identity; unit↔lesson placement is an edge; the model is correct-by-construction for multi-unit
lesson placement. Bulk-id↔ontology-IRI reconciliation stays a separate future concern.

## 5. Open owner decisions (Phase 3 touchpoints)

### 5.1 Ratify the seam map + deliverables map (§2–§3)

Including: one plan restructured around deliverables (not a plan split); S1/S2 shippable
immediately; the session-output two-PR shape.

### 5.2 Keywords disposition (evidence in §1.1)

1. **Corpus-backed replacement** (the plan's current direction): bounded frequency-ranked view on
   the one graph; replaces the generated tool (registry exclusion mechanics); accepts the
   snapshot-provenance switch; coherent with ADR-173 bulk-data authority.
2. **Upstream API enhancement**: request bounded/ranked parameters (e.g. `limit`, rank order) on
   `/keywords`; the generated tool then bounds natively; Cardinal-Rule purity preserved; the flood
   persists until upstream ships.
3. **Out of this plan**: the keywords problem is real but a different solution-class; correct the
   plan and home the work where its decision can be made.

These are not mutually exclusive (3 can carry 2). The provenance correction lands either way.

### 5.3 Misconception anchor/journey (evidence in §1.4 b–c)

Data-grounded recommendation: support **lesson + unit anchors as the core** (lesson is the
near-trivial leaf, ≤2 items; unit is the 2–11 KB sweet spot) and **thread anchor with explicit
heavy-tail semantics** (bounded-by-anchor is not bounded-small for mega-threads; a `limit`/paging
parameter or unit-granular response shape for the tail; the english-secondary 15.7%
thread-unreachable gap recorded in the tool contract so results are never presented as
subject-complete). The exact journey is the owner's call.

## 6. Corrections ledger (applied to the plan in the restructure commit)

| # | Plan claim | Correction |
| --- | --- | --- |
| 1 | Keywords are bulk-derived via the vocab-gen keyword extractor; `get-keywords` shares the no-input whole-corpus shape | §1.1 — live-API generated tool with existing narrowing params; extractor feeds the excluded `vocabulary-graph`; prompt steps never call it |
| 2 | Extractor path `src/bulk/extractors/keyword-extractor.ts` | Live pipeline runs `vocab-gen/extractors/`; duplication recorded |
| 3 | Prior-knowledge edges "forming a DAG" | Not a DAG: 28 self-loops + 4 two-node cycles; visited-set-safe traversal required; upstream data-quality signal |
| 4 | (implicit) generated corpus loads into the substrate | 5 dangling edge endpoints would throw at `createGraphView` construction; G1 integrity obligation |
| 5 | `GraphView` extension "required" | Two options (§1.2); R1 decides; draft verdict: no substrate change |
| 6 | All four views "map onto that one extended subgraph op" | Thread-progressions ordering cannot ride `{source,type,target}` edges; ordered corpus projection (§1.3) |
| 7 | Split-set enumerations (banner §B vs sequencing §B2–B4; A5 both-listed; row F unowned) | Dissolved by the deliverables map: A1/B1 live inside G-units; A5 is an invariant on every surface-touching PR; F is Decision 4.6 |
| 8 | Check (d) as a promotion-time data-grounding check | Dissolved (§1.4d) |

## 7. Review plan

- **R1 (pre-cycle-authoring)**: architecture-expert-barney (simplification: §4.3 substrate
  question, §4.6 factory retirement, G1 boundary), architecture-expert-fred (ADR-041/108/173/179
  compliance, Decision B, the new subpath export), architecture-expert-betty (cohesion/change-cost:
  B options, per-view construction vs extension). Execution-legitimacy briefs; the owner-ratified
  value-shapes, one-graph frame, and small-PR constraint are out of scope.
- **R2 (pre-DECISION-COMPLETE)**: architecture-expert-wilma (failure modes: integrity resolution,
  mega-thread tail, registry/landing-page drift on resource removal), assumptions-expert
  (settle-completeness, depends_on legitimacy, proof-contract honesty), mcp-expert (resource
  removal protocol implications, prompt repointing, tool-signature change for clients).
- Every finding is verified first-hand before folding; dispositions recorded.

## 8. R2 dispositions (2026-06-09; verdicts: all three `ready-with-conditions`)

Every finding below was verified first-hand against the tree before its disposition. The applied
items landed in the plan revision that carries the 🟢 DECISION-COMPLETE flip.

| Reviewer | Finding | Severity | Disposition |
| --- | --- | --- | --- |
| wilma | G1 integrity-resolution choice (emit vs drop) unspecified | blocking | **applied** — rule settled: emit the endpoint node if the unit exists in bulk; else drop the edge with provenance + a zero-dangling generator test |
| wilma | G1 partial prompt edit creates a misleading transient state | blocking | **applied** — subsumed by the anchor-threading rewrite condition: every partial edit leaves the prompt correct-at-that-commit |
| wilma | Per-view construction timing/memory unspecified | advisory | **applied** — G1b pins module-load construction (EEF precedent) + a recorded startup-cost check |
| wilma | Mint-rule choice deferred but not precluded | advisory | **confirmed** — already a named G2 design item; no change |
| wilma | `AGGREGATED_TOOL_ORDER` landing-page maintenance gap | advisory | **applied** — G3 carries a landing-page render check |
| assumptions | G4 `depends_on` wrong (lesson kind is a G2 emission) | blocking | **applied** — G4 now depends on G1 + G2; rationale stated in the todo |
| assumptions | Emission-ownership model implicit (root of both dependency findings) | blocking | **applied** — §Emission ownership table added; `depends_on` edges derive mechanically from it |
| assumptions | G3→G2 rationale unstated | advisory | **applied** — stated inline in the G3 todo |
| assumptions | G4 Gate 1 lacks a decision rule | advisory | **applied** — field-set + coverage-within-1pp criterion pinned, with the partial-parity fallthrough to API-pull |
| assumptions | Factory importer count omits the unit test | blocking-adjacent (stated advisory) | **applied** — verified first-hand (`graph-resource-factory.unit.test.ts` is a real seventh importer; the earlier "six" grep excluded test files); G3 deletion scope + §F wording corrected |
| assumptions | Req 12 Learning Loop only oblique | advisory | **applied** — explicit consolidation-workflow reference in §Lifecycle triggers |
| assumptions | All settled-decision evidence re-verified; proof contract honest | advisory | **confirmed** — independent re-verification recorded |
| mcp | Prompt repoints leave zero-arg instructions against anchored tools | blocking | **applied** — B1 repoints are anchor-threading rewrites in every G-unit (the substantive R2 catch) |
| mcp | Staged resource removal protocol-safe; reason unstated | advisory | **applied** — §Protocol notes records the stateless-transport rationale + `-32002` semantics |
| mcp | Zero-arg → anchored behaviour break understated | advisory | **applied** — §Protocol notes states the deliberate break + mitigation |
| mcp | Two-keyword-tool disambiguation needs a description contract | advisory | **applied** — G4 carries the choose-this-when description contract, verified e2e |
| mcp | `structuredContent` without `outputSchema` protocol-valid | advisory | **confirmed** — recorded in §Protocol notes incl. the TextContent SHOULD |
| mcp | `listChanged` semantics never addressed | advisory | **applied** — §Protocol notes: per-connection re-discovery; no inert notification plumbing |

## 9. Owner corrections (2026-06-10)

1. **The two session PRs are the PLANNING output** (owner-confirmed); execution fans out as one
   PR per deliverable, per the plan's delivery contract.
2. **Nothing sits in an unagreed holding state.** This report's earlier "not deliverables"
   framing for §C exceeded what the owner ratified: the seam-map bundle ratification did not
   ratify that embedded clause. §C is now deliverable **S3** (c0 owner design gate — candidate
   set + reconciliation shape — then one cycle per prompt with source-skill attribution carried);
   the "blocked on `oak-skills` going public" claim is reclassified BENEFICIAL (the content is
   Oak's to use; the repo is Oak-owned and accessible). §2 and §3 above are amended in place;
   plan ledger row 17 records the disposition.
3. **The indefinite-deferral vocabulary family is now a forbidden trip-list group** in the
   innate-immunity hook (`.agent/hooks/policy.json`, concept `indefinite-deferral`, word-boundary
   regex so agent display names like "Sparking …" never false-positive), catalogued in
   [`no-hedging-vocabulary.md`](../rules/no-hedging-vocabulary.md). Known pre-existing instances
   on covered surfaces (historical dated reports; PDR-026's warning-usage line; the
   owner-decided 2026-05-09 hold in the monorepo-topology strategic brief; one school-data-search
   gate-discipline line) were left as-is — the matcher blocks only newly-added instances, and
   each will be cured by descriptive substitution on its next legitimate edit.

## 10. Data-grounding command recipes (conserved 2026-06-10)

The §1.4 numbers were computed by session workflow agents whose transcripts are ephemeral; the
recipes are conserved here so re-runs (the plan requires re-verification at execution start) are
mechanical. All paths relative to the repo root; corpus = the generated vocab datasets; bulk =
`apps/oak-search-cli/bulk-downloads/` (numbers valid against the `2026-05-21T13:45:16.086Z`
manifest snapshot).

**Check (a) — prerequisite out-degree, depth reachability, cycle audit** over
`packages/sdks/oak-sdk-codegen/src/generated/vocab/prior-knowledge-graph/data.json`:

```javascript
const d = require('./packages/sdks/oak-sdk-codegen/src/generated/vocab/prior-knowledge-graph/data.json');
const nodeSet = new Set(d.nodes.map((n) => n.unitSlug));
// integrity: edge endpoints missing from the node set (5 found 2026-06-09)
const dangling = [...new Set(d.edges.flatMap((e) => [e.from, e.to]).filter((s) => !nodeSet.has(s)))];
// adjacency + out-degree distribution (zero-count, median, p90, max)
const adj = new Map();
for (const e of d.edges) (adj.get(e.from) ?? adj.set(e.from, []).get(e.from)).push(e.to);
// depth-bounded BFS from every 10th node (161 anchors): reached-set sizes at depth 1/2/3
// cycle audit: self-loops = d.edges.filter((e) => e.from === e.to) (28); Tarjan SCC for 2-cycles (4)
```

**Check (b) — misconception `lessonSlug` density + cardinality** over
`packages/sdks/oak-sdk-codegen/src/generated/vocab/misconception-graph/data.json`: count
present/empty/absent `lessonSlug`; distinct
slugs (12,385); misconceptions-per-slug quantiles (median 1, max 2); slug→title conflict scan
(0); same density scan over `subject`/`keyStage`/`lessonTitle`/`misconception`/`response`
(all 100%).

**Check (c) — bulk chain population/density**: parse 5 representative subject files one at a
time (maths-primary, english-secondary, science-secondary, science-primary,
cooking-nutrition-primary; sizes 3.7–76.5 MB, single `JSON.parse` each). Joins: thread identity
= `thread.slug` within a subject file; lessons-per-thread = union of `unitLessons.lessonSlug`
(state `published` only, deduped) over units carrying the thread; misconceptions looked up via a
`lessonSlug → lesson` map over `lessons[]`, reading `misconceptionsAndCommonMistakes`. Sizes via
`Buffer.byteLength(JSON.stringify(entry))`; quantiles over sorted arrays. Outputs: per-thread and
per-unit median/p90/max for units/lessons/misconceptions; chain-presence percentages
(units with ≥1 thread; lessons with ≥1 misconception).

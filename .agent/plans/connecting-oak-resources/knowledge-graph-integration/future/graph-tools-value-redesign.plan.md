---
name: "Graph Tools Value Redesign (unified)"
overview: "ONE plan owning the value-driven (re)design of all existing graph MCP tools (misconception, prior-knowledge, thread-progressions) onto the graph-corpus-sdk substrate. Governing premise: bounded, relevant, token-efficient retrieval under full design agency over BOTH the generated data-object shape AND the retrieval mechanism — not behaviour-preservation. Per tool, the landing unit is data/type re-emission + the input-interface and bounded-retrieval shape + tool rewrite + projection-derived outputSchema, together. Authored under graph-estate-consolidation Judgement call 4 (owner-ratified 2026-06-02); reframed from behaviour-preservation to design-in-our-power (owner-directed 2026-06-04). Single upstream of the EEF re-validation gate. Parked until the named promotion trigger: EEF D6 landed + EEF D7 green."
plan_id: graph-tools-value-redesign
type: strategic
status: future
graph_layer: oak-graph-surface
thread: eef
date: 2026-06-04
isProject: false
related:
  - "../current/graph-estate-consolidation.plan.md (authority: §Judgement calls, call 4)"
  - "../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md (D4–D6 mechanism co-design; D7 value gate; EEF decision B = homogeneous strand graph)"
  - "../../../sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md (binding §Resolved Sequencing contract)"
  - "../../../sector-engagement/eef/future/eef-revalidate-on-new-graph-tools.plan.md (downstream gate; this plan is its single upstream)"
  - "./oak-misconceptions-graph-features.plan.md (boundary redrawn — §1 bounded retrieval folded into this redesign's core)"
todos:
  - id: settle-mechanism-at-promotion
    content: "At promotion (trigger: EEF D6 landed + D7 green), settle the open MECHANISM decisions against the landed EEF D5/D6 code: data/type re-emission shape per corpus (A), adapter home + dependency direction with an ADR-041 check — including an explicit no-circular-dependency confirmation if Decision B lands on a new graph-corpus-sdk -> oak-sdk-codegen import edge (B), the codegen schema-emission shape (D), the per-unit landing order (E), and — for misconception — whether the bulk SOURCE supports emitting ids+edges (graph-shaping) beyond the attribute-filter shape decided now. Co-decide the anchor input TYPES against Decision A's emission choice (finite-domain keys lessonSlug/unitSlug/threadSlug as generated literal unions vs widened string — must be consistent, not left implicit). Any shared accessor mechanics ship with real operations + tests or are absent (ADR-173 real-operations-only) — no stubs. ONE mechanism shared with EEF — no parallel. Value-SHAPES (anchors + retrieval form per corpus) are decided in this plan, not deferred."
    status: pending
  - id: redesign-prior-knowledge
    content: "Prior-knowledge redesign unit: bounded subgraph retrieval. Anchor = unit (unitSlug); return the prerequisite subgraph reachable from the anchor within a bound, using the existing 3,452 prerequisiteFor edges. Re-emit data/types per Decision A (delete hand-written types + the two-step edge-literal validation), add the input schema (anchor + bound), rewrite get-prior-knowledge-graph + the curriculum://prior-knowledge-graph resource onto the substrate, land the projection-derived required outputSchema. One unit."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: redesign-misconception
    content: "Misconception redesign unit: curriculum-anchored bounded SUBGRAPH retrieval (graph-shaped; owner-directed 2026-06-04, overriding the attribute-filter default). Anchor = a curriculum node (thread/unit/lesson — exact anchor a value-design item to confirm with owner; concept-anchoring is a separate cross-source concern since concepts live in the ontology); traverse typed edges to return the bounded misconception set in that subtree; lesson anchor is the leaf case. Re-emit data/types per Decision A (delete the hand-written interface) AND re-project the misconception node-ids + the typed edges from the bulk source, which carries the full thread->unit->lesson->misconception chain (verified against bulk-downloads/schema.json 2026-06-04: unit.threads, unit.unitLessons / lesson.unitSlug, lesson.misconceptionsAndCommonMistakes) — the flat generated corpus dropped it. Thread/unit/lesson anchors are all bulk-supported; concept-anchoring is out of scope (no concept node in the bulk export). Add the anchor input schema, rewrite get-misconception-graph + the curriculum://misconception-graph resource, land the projection-derived outputSchema. Misconception is the driving consumer of the heterogeneous node/edge model."
    status: pending
    depends_on: [settle-mechanism-at-promotion, define-heterogeneous-node-edge-model]
  - id: redesign-thread-progressions
    content: "Thread-progressions redesign unit: bounded by-thread / by-subject projection. Anchor = threadSlug (or subject+keyStage); return that thread's ordered unit sequence, never all 164 threads. Data is already as-const type authority. Add the input schema, rewrite get-thread-progressions + the curriculum://thread-progressions resource, repoint the three stats-interpolation consumers (ontology-data.ts, tool-guidance-data.ts, tool-guidance-workflows.ts) in the same unit, land the projection-derived outputSchema. Sequence projection is the value-serving token-bounded shape; not graph-forced, not graph-barred."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: define-heterogeneous-node-edge-model
    content: "Define ONE bulk curriculum graph's heterogeneous node/edge model — node kinds (misconception, unit, lesson, thread) and typed inter-kind edges (unit->thread, unit<->lesson, lesson->misconception, unit->unit prerequisite), all re-projected from the bulk source. Identity is a DELIBERATE design item, NOT slug-as-id: stable entity ids; unit<->lesson placement modelled as an edge (a lesson can be placed in >1 unit; slugs not assumed unique). The three tools are bounded query VIEWS over this one graph (GraphView ops: subgraph / neighbours / path), NOT a single polymorphic god-primitive and NOT three independently re-emitted corpora; any shared view mechanics consolidate as a third-consumer decision (consolidate-at-third-consumer), never presupposed. DEFERRED from EEF D4 (homogeneous single-kind strand graph, decision B 2026-06-04). The model's CORE is mechanism-INDEPENDENT and derivable now; only its reconciliation with the landed EEF D4 homogeneous contract depends on landed code (lands at promotion). Bulk-id<->ontology-IRI reconciliation is a separate concern. Must NOT be assumed-inherited from EEF nor dropped."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: amend-adr-086
    content: "Amend ADR-086 in the same commit as the first corpus re-emission: the hand-written-interface large-graph pattern is superseded by the data-as-type-authority re-emission (Decision A); correct the stale MCP-tool status rows (the misconception tool is live, not deferred), the prerequisite-graph/prior-knowledge-graph naming residue, and the stale prerequisite edge count (ADR-086 states 3408; verified 2026-06-04 is 3,452) against the figure re-verified at execution start."
    status: pending
    depends_on: [settle-mechanism-at-promotion]
  - id: signal-eef-revalidation
    content: "On each redesign-unit landing, raise the landing signal to eef-revalidate-on-new-graph-tools (name the redesigned tool + commit + the new bounded-retrieval contract). The value re-proof is owned by that plan; this plan completes when all three units have landed and signalled."
    status: pending
    depends_on: [redesign-prior-knowledge, redesign-misconception, redesign-thread-progressions]
---

# Graph Tools Value Redesign (unified)

> **⏸️ PARKED — promotion trigger: EEF D6 landed AND EEF D7 green.** Ownership and the
> governing frame are established now (Judgement call 4,
> [`graph-estate-consolidation.plan.md`](../current/graph-estate-consolidation.plan.md)
> §Judgement calls, owner-ratified 2026-06-02; the value-driven-redesign frame
> owner-directed 2026-06-04). The per-corpus value-SHAPES are decided in this plan;
> the MECHANISM decisions (A/B/D/E, node/edge-model reconciliation) finalise at promotion
> against landed EEF D5/D6 code. The existing tools keep working until their redesign —
> the EEF value proof (D7) runs on them as-is, then this redesign delivers the
> bounded-retrieval value that proof targets at scale. Both trigger gates are observable
> todo flips in
> [`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md):
> D6 landing is the first in-tree instance of the shared projection→single-Zod-call
> mechanism this redesign reuses; D7 green is the value proof the redesign scales.

## Problem and intent

The existing graph tools each return their **whole generated corpus** with **no input**:
`get-misconception-graph` returns a 6.0 MB / 12,858-node blob, `get-prior-knowledge-graph`
returns 1.8 MB, `get-thread-progressions` returns all 164 threads. That whole-corpus
return floods the calling agent with mostly-irrelevant tokens — it is the central problem.

This plan was first authored under a **behaviour-preservation** frame — *"same observable
tool behaviour, scaled-up substrate"* — which treated those whole-corpus serializations as
**fixed inputs to preserve**. That frame was a bad assumption (owner, 2026-06-04). We
**construct** the generated data objects (the `vocab-gen` pipeline in `oak-sdk-codegen`)
**and** build the retrieval substrate (`graph-core` + `graph-corpus-sdk`), so the data-object
shape **and** the retrieval mechanism are **both ours to design**. The serializations are
**design outputs we own**, not fixed inputs. Preserving a 6 MB whole-corpus return preserves
an arbitrary past choice that *actively violates* the real first principle. The work is
therefore not a behaviour-preserving migration — it is a **value-driven redesign** of how
each tool retrieves, with the substrate move as the means.

Migration ownership was unified here by Judgement call 4 so that no tool is orphaned and
the EEF re-validation gate has exactly one upstream. That unification still holds; only the
frame changed from preserve-and-move to design-for-value.

## Governing first principles (the spine)

Every redesign decision below derives from two constraints and one source of agency.

1. **Maximise value to users.** Return what the calling agent actually needs for the
   teacher's task.
2. **Do not flood agents with tokens on irrelevant information.** Return the relevant,
   bounded subset — never a whole corpus.

**Design agency.** Because we build the data objects from bulk data and build the substrate,
we hold total design power over both the data shape and the retrieval mechanism. A generated
corpus's current serialization is a design output we own, not a fixed input. Where a bounded
shape (a filter, a subgraph, a sequence projection) serves users with fewer irrelevant
tokens, we build it — reshaping the generated data from the bulk source where that is what
the value needs. Graph form is used when it is the most direct bounded-relevant shape, and
is neither forced nor barred by anything other than the two constraints. **Value, not graph
form, is the test.**

## Scope and source boundaries (owner-directed 2026-06-04)

- **Two data sources, one substrate, separate concerns.** This plan builds graphs from the
  **bulk curriculum export** (`apps/oak-search-cli/bulk-downloads`). The **Oak Ontology repo**
  (`github.com/oaknational/oak-curriculum-ontology` — formal RDF/OWL/SKOS/SHACL, stable
  `w3id.org` IRIs, v0.1 early release, 8 subjects) is a **separate data source and a separate
  concern**, even though both sit on the shared `graph-core` / `graph-corpus-sdk` substrate. This
  plan does **not** depend on, ingest, or design the ontology. Concepts (the SKOS knowledge
  taxonomy) live **in the ontology, not the bulk source** — so any concept-level capability is a
  cross-source concern owned elsewhere (gated on the alignment audit; the ontology's instability
  is a further reason to keep it separate).
- **One bulk graph, surfaced as views — not multiple fragmented graphs.** The curriculum domains
  share entities (units, lessons) and a lesson can be placed in multiple units, so the bulk
  graph is **one graph with a single identity model**, surfaced through many bounded query views.
  Separate per-domain graphs would duplicate and de-identify the shared entities and turn
  cross-domain queries into a self-inflicted join. "One graph" is an identity/target statement,
  **not** build-it-all-up-front: the graph grows incrementally — the three redesigned tools are
  its first three views, adding only the node kinds and edges they need.
- **Scope stays the three tools (delivery discipline).** This plan does **not** expand into the
  foundational curriculum-KG. The owner-directed **review of the entire `oak-kg` / ontology
  estate** is a **distinct activity**, not folded here (recorded in
  [`graph-kg-estate-and-two-source-survey-2026-06-04.md`](../../../../reports/graph-kg-estate-and-two-source-survey-2026-06-04.md)).

## Decision disposition ledger

Every decision from the behaviour-preservation authoring carries a recorded disposition.
Nothing is silently dropped.

| # | Old decision | Disposition |
| --- | --- | --- |
| 1 | One plan owns all existing graph-tool work | **retained** — re-grounded: one plan owns the *redesign* of all three tools. |
| 2 | Per tool, migration is ONE replacement unit (re-emit + rewrite + outputSchema) | **reshaped** — the atomic landing unit now also carries the **input schema + bounded-retrieval shape**; it is a redesign unit, not a re-platform unit. |
| 3 | Existing tools untouched / behaviour preserved | **replaced** — behaviour-preservation is not the premise; whole-corpus return is the problem being removed. The tools keep working *until* their redesign lands (so D7 can run on them), which is sequencing, not a preservation goal. |
| 4 | Sequencing by consumer-readiness (ADR-173) | **retained**. |
| 5 | Schema arrives when the tool is built/rebuilt, never before (binding §Resolved Sequencing) | **retained**. |
| 6 | Single upstream of the EEF re-validation gate | **retained** — redesigned tools still signal that gate. |
| 7 | Schema-production doctrine (projection→single Zod call, `satisfies`-tied, codegen-emitted) | **retained** — mechanism unchanged; the projection now runs over the bounded retrieval's output type. |
| 8 | Q2 output-only: no input, whole-corpus return, purely structural schema | **inverted** — the tools take an **anchor input** and return a **bounded subset**. The schema projection now covers an input schema + a bounded-result output type. The "no large `as const`" benefit survives (the shape is still structural, not value-literal). |
| 9 / Q4 / Decision C | thread-progressions not graph-forced; sequence shape; hosting open | **reshaped** — shape is chosen by the two constraints: a **bounded by-thread/by-subject sequence projection** (token-bounded, value-serving). Not whole-corpus, not graph-forced, not graph-barred. Hosting folds into Decision B. |
| A | Data/type re-emission shape per corpus | **retained-open (mechanism)** → promotion, against landed EEF code. |
| B | Adapter home + dependency direction (sdk→sdk vs emit-into); + thread-progressions hosting | **retained-open (mechanism)** → promotion, with ADR-041 check + architecture review. |
| D | Codegen schema-emission shape (projection module vs pre-rendered) | **retained-open (mechanism)** → promotion; default (a) projection module. |
| E | Per-unit landing order (consumer-readiness) | **retained-open (mechanism)** → promotion, against tree state. |
| F | Factory disposition / third-consumer consolidation | **reshaped** — `createGraphToolExecutor` (today `() => CallToolResult` returning `config.sourceData` wholesale) must change shape to accept an anchor input and delegate to the one graph's bounded query operations (the substrate's `GraphView` ops), not return a whole corpus. The factory's disposition (retire / fold into the shared view mechanics) is decided at the third unit; named at promotion. |

## Per-corpus value + token analysis

Each shape is grounded in the verified generated-corpus structure (2026-06-04) and the
teacher value it serves; the mechanism to build them lands at promotion. **Ratification status
(owner, 2026-06-04):** prior-knowledge (bounded subgraph) and thread-progressions (bounded
sequence projection) are **owner-ratified as proposed**. Misconception is **owner-directed to a
graph-shaped curriculum-anchored subgraph** (overriding the attribute-filter default); the
thread→unit→lesson→misconception edges it needs are **verified present in the bulk source**
(no external sourcing), so the only open item is confirming the exact anchor/journey with the
owner (concept-anchoring excepted — no concept node exists in the bulk export).

### prior-knowledge — bounded subgraph (verdict)

Nodes are keyed by `unitSlug` (with `subject`, `keyStage`, `year`, `priorKnowledge[]`,
`threadSlugs[]`); there are **3,452 typed `prerequisiteFor` edges** (`{from, to, rel,
source}`) forming a DAG. This is a natural bounded-subgraph consumer. **Shape**: anchor =
`unitSlug` (one or more), bound = traversal depth; return the prerequisite subgraph reachable
from the anchor within the bound. Edges already exist — no data reshaping needed beyond
re-emission. **Value**: "what must a pupil already know to access this unit", bounded to the
relevant neighbourhood instead of the whole 1,607-node graph.

### misconception — curriculum-anchored bounded subgraph (graph-shaped; owner-directed 2026-06-04)

Nodes are flat (`misconception`, `response`, `subject`, `keyStage`, `lessonSlug`,
`lessonTitle`) — no node id, no edges in the generated corpus today — but every node carries
`lessonSlug` + `subject` + `keyStage`. **Owner-directed shape (2026-06-04): graph-shaping is
first-class, not a deferred enhancement.** The value is **bounded traversal from a curriculum
anchor down to the misconceptions attached to it** — the original owner direction of 2026-05-07
("Thread IRI → misconceptions transitively attached to the units in that thread", now folded in
from `oak-misconceptions-graph-features.plan.md §1`). **Shape**: anchor = a curriculum node
(thread / unit / lesson — all bulk-supported); traverse typed edges to return the bounded set of
misconceptions in that subtree. (A *concept*-anchored variant is a separate cross-source concern —
concepts live in the ontology, not the bulk source.) **Value**: "what misconceptions should I plan
for across this thread/unit", not
just one lesson — bounded to the relevant curriculum neighbourhood instead of a 6 MB blob. The
`lessonSlug` attribute filter is the **leaf case** of this graph (anchor = a single lesson), not
a competing shape.

**Data support (`verify-data-supports-shape-before-building`) — fully supported by the bulk
source (verified against `apps/oak-search-cli/bulk-downloads/schema.json` + a real bulk file,
2026-06-04):** the entire `thread → unit → lesson → misconception` chain is present in the bulk
export the `vocab-gen` pipeline already downloads — `unit.threads` (thread↔unit),
`unit.unitLessons` + `lesson.unitSlug` (unit↔lesson), and `lesson.misconceptionsAndCommonMistakes`
(lesson→misconception). The flat generated corpus is a **lossy projection** that dropped the unit
and thread linkage the source carries; the redesign re-projects misconception **with** those
edges from the same source — no external sourcing required. **Anchors thread / unit / lesson are
all bulk-supported.** The one exception: **concepts live in the ontology** (its SKOS knowledge
taxonomy — `Discipline → Strand → SubStrand → ContentDescriptor`), not the bulk export, so a
**concept-anchored** traversal is a separate **cross-source** capability (bulk misconceptions ×
ontology concepts, gated on the alignment audit) and is **out of scope here**. The lesson anchor
is the leaf case. The exact anchor (thread vs unit vs lesson) + journey is a value-design item to
confirm with the owner; the edges it needs are the driving consumer of the heterogeneous node/edge
model below, and they are all derivable from the one bulk source. **Identity caveat**: the lesson
node is identified by a stable id, not assumed-unique `lessonSlug`, and its unit placement is an
edge (see the node/edge model) — so misconceptions attach to the lesson entity and surface through
whatever unit/thread path reaches it, correctly even when a lesson is placed in more than one unit.

### thread-progressions — bounded sequence projection (verdict)

164 threads across 16 subjects, ordered unit sequences, already `as const` + `typeof`-derived
(its own type authority). **Shape**: anchor = `threadSlug` (or `subject`+`keyStage`); return
that thread's ordered unit sequence. **Value**: "what's the learning path for this thread",
one thread instead of all 164. A sequence projection is the most token-efficient relevant
shape; graph form is neither needed nor barred.

## Input-interface design surface (new, first-class)

Removing whole-corpus return introduces a design surface the behaviour-preservation frame had
none of. Per tool, the redesign unit must design:

- **The anchor input schema** — `lessonSlug` (misconception), `unitSlug[]` + bound
  (prior-knowledge), `threadSlug` / `subject`+`keyStage` (thread-progressions). Strict and
  Complete, projection-derived where the values are generated-domain literals. The arity
  difference across tools (singular `lessonSlug`; plural `unitSlug[]` + depth; singular
  `threadSlug` with a `subject`+`keyStage` set-broadening fallback) is **corpus-justified and
  intentional**, recorded as such in each tool's description so it reads as deliberate, not
  accidentally divergent.
- **Calling-context assumption** — the anchor is a generated-corpus key the calling agent is
  expected to already hold from prior Oak curriculum context (a lesson/unit/thread it is already
  working with). Where it holds only `subject`+`keyStage`, the secondary anchor applies.
- **Anchor resolution** — the anchor is a generated-corpus key (slug), not free text; free-text
  topic resolution remains owned by `oak-misconceptions-graph-features.plan.md §3`. The anchor
  field types are co-decided with Decision A's emission (literal union vs widened string) so the
  input schema and the generated domains do not diverge.
- **Bounded-retrieval semantics** — the bound parameter (depth/limit), its default, and the
  empirical basis for the default recorded in code (re-derived against the redesigned tool, not
  the discarded `maxResponseTokens = 16000` output-truncation cap — that is a different, retired
  shape; this is relevant-subset *retrieval*).
- **Well-formed empty results** — an anchor with no matching subset returns a structurally
  valid empty result on the same projection path, so consumers branch on field presence, never
  on a parse failure.

## Heterogeneous node/edge model (scoped deliverable; core now, reconciliation at promotion)

EEF D4 deliberately used a **homogeneous single-kind (strand) graph** (`TNodeId =
EefStrandId`, single edge type `related_strand`; guidance reports inline, not a node kind —
decision B, 2026-06-04). EEF therefore does **not** establish the substrate's heterogeneous
model, and it must not be assumed-inherited. This plan is the first multi-entity graph build,
so the model is defined here. Its **core is derivable now** from the corpus data, and is
**mechanism-independent** — it can be authored from the verified corpus structure without
waiting for the landed EEF D5/D6 mechanism (only the EEF-D4 reconciliation below depends on
landed code):

- **Node kinds**: misconception, unit, lesson, thread.
- **Identity is a deliberate design problem — NOT "the slugs are the ids" (owner, 2026-06-04).**
  A slug is a **content key, not a graph identity**, and curriculum **placement is an edge, not
  identity**: a lesson can be placed in more than one unit (verified rare in the current snapshot —
  0 cases across the subjects checked — but not guaranteed; it occurs via unit variants / KS4
  pathways / cross-programme reuse, and an identity model that *assumes* slug uniqueness corrupts
  silently exactly on those cases). So the model identifies each entity (lesson, misconception,
  unit, thread) by a stable id, models unit↔lesson **membership as an edge**, and never folds a
  unit into a lesson's identity. The ontology already solves this correctly — `Lesson` is one
  entity (stable IRI) with `LessonInclusion` edges at sequence positions — and is the conceptual
  reference; **reconciling bulk ids ↔ ontology IRIs is a separate future concern** (the alignment
  audit), not this plan's work.
- **Typed inter-kind edges**, all re-projectable from the **single bulk source** (verified
  against `bulk-downloads/schema.json`, 2026-06-04): `unit→thread` (`unit.threads`), `unit↔lesson`
  (`unit.unitLessons` / `lesson.unitSlug`), `lesson→misconception`
  (`lesson.misconceptionsAndCommonMistakes`), and `unit→unit` prerequisite relations
  (`unit.priorKnowledgeRequirements`). The **misconception graph shape is the driving consumer**
  of these edges now (owner-directed). No external sourcing is needed — the generated corpora are
  lossy projections of this one source. The relationship NOT in the bulk source is
  `misconception → concept`: **concepts live in the ontology** (its SKOS knowledge taxonomy), a
  separate source and concern, so a concept-anchored capability is a **cross-source** matter
  (gated on the bulk↔ontology alignment audit) and is **out of scope here**.
- **Bounded query views over the one graph — not three bespoke algorithms, and not one god-primitive.**
  Under the owner's one-graph direction the views are **queries over the single bulk curriculum
  graph**: misconception-retrieval and prerequisite-retrieval are both **bounded subgraph
  traversals** (differing only in seed node + which edge types they follow), and thread-progressions
  is a **bounded path/sequence** over thread→unit ordering. These map directly onto the typed
  operations the substrate's `GraphView` interface already provides (`subgraph` / `neighbours` /
  `manifest`), parameterised by seed + edge-type — so there is neither a single overloaded
  `boundedRetrieval()` god-function nor three unrelated bespoke accessors. Each view shares the
  structural discipline (seed-input, bounded result, well-formed empty); any genuinely shared
  mechanics consolidate as a **third-consumer decision** (`consolidate-at-third-consumer`), never
  presupposed.

**Reconciliation with the EEF D4 homogeneous contract** (how the heterogeneous model
generalises the single-kind case, and whether any shared accessor mechanics subsume EEF's
`related_strand` traversal) lands at promotion against the landed D4 code. EEF D4 is
**owner-ratified (2026-06-04)**. **D4 coordination handed to this plan**: D4 made the
`GraphView` `manifest()` operation *absent* at D5 (D5 ships `subgraph` only); **this plan
re-adds `manifest()` when its first view is built** — record it as a first-view obligation,
not a drop. At promotion, any shared accessor mechanics ship with **real operations and tests,
or are absent** (ADR-173 §2026-06-01 real-operations-only) — no stubs.

## The tool set, pinned from code (verified 2026-06-04)

Inclusion criterion: a live aggregated MCP tool whose payload is a bulk-derived generated
graph corpus (`packages/sdks/oak-sdk-codegen/src/generated/vocab/`). The live registry carries
35 tools; exactly three meet the criterion. **Landing is staged per tool/view** — each tool's
rewrite moves every consumer of its surface at once (tool, resource twin, interpolation
consumers), otherwise the estate splits a surface across two authorities.

> **Execution-structure note (reconciling with one-graph).** The per-tool todos below speak of
> "re-emit data/types per Decision A" — inherited execution-sketch wording from the migration
> framing. Under the owner's one-graph direction the data layer is **one bulk curriculum graph
> ingested from the source with a single identity model**, and the three tools are **views** over
> it (the staged landing adds each view's node kinds/edges + the view itself). It is **not** three
> independently re-emitted corpus type authorities. The flat hand-written `types.ts` files still go
> away; their replacement is the one graph + typed views, not three parallel re-emissions. Whether
> the executable plan stages this as "ingest-then-view per tool" is a promotion-time decision the
> one-graph architecture governs; the todos are re-derived there under it.

| Corpus | Data (verified size/shape) | Type authority today | Consumers (complete set) | Decided shape |
| --- | --- | --- | --- | --- |
| misconception | `misconception-graph/data.json` — 6.0 MB, 12,858 nodes, **no edges**; nodes carry `lessonSlug`/`subject`/`keyStage` | Hand-written interface (`types.ts`) — no validation | `get-misconception-graph` + `curriculum://misconception-graph` resource | curriculum-anchored bounded subgraph (graph-shaped, owner-directed); `lessonSlug` filter = leaf case |
| prior-knowledge | `prior-knowledge-graph/data.json` — 1.8 MB, 1,607 nodes, **3,452 `prerequisiteFor` edges** | Hand-written types + two-step runtime edge-literal narrowing | `get-prior-knowledge-graph` + `curriculum://prior-knowledge-graph` resource | bounded subgraph (anchor `unitSlug` + depth) |
| thread-progressions | `thread-progression-data.ts` — 190 KB, 164 threads, ordered unit sequences | **Already `as const` + `typeof`-derived** | `get-thread-progressions` + `curriculum://thread-progressions` resource + stats interpolations in `ontology-data.ts`, `tool-guidance-data.ts`, `tool-guidance-workflows.ts` | bounded sequence projection (anchor `threadSlug`) |

All three are produced by the `vocab-gen` pipeline in `oak-sdk-codegen` from the same bulk
download set (bulk-data authority, ADR-173 §Corpus source authority). The bulk source schema is
`apps/oak-search-cli/bulk-downloads/schema.json` (+ `manifest.json`): each subject-sequence
carries `sequence[]` (units, each with `threads`, `unitLessons`, `priorKnowledgeRequirements`) and
`lessons[]` (each with `unitSlug` + `misconceptionsAndCommonMistakes`). All three generated corpora
— and the misconception graph's edges — are projections of this one source; the flat misconception
corpus is the lossiest (it dropped the unit/thread linkage the source carries).

**Excluded, with reasons**: `vocabulary-graph` (3.4 MB) and `nc-coverage-graph` (2.3 MB) — no
tool consumes them (consumer-readiness: nothing to redesign); `conceptGraph` (hand-authored,
not a generated corpus); the 24 generated API tools and the search/browse/fetch family (no
graph data); the EEF tool (owned end-to-end by the EEF plan).

## Open mechanism decisions (settled at promotion, not before)

Held open deliberately: the shared projection→single-Zod-call mechanism this plan reuses (EEF
D5/D6) is not yet in the tree, and settling mechanism against prose instead of landed code is
the contamination pattern this estate just removed. Value-SHAPES are decided above; only
MECHANISM waits.

- **Decision A — data/type re-emission shape per corpus.** Full `as const` at 6.0 MB is refuted
  by TS7056 (ADR-086's basis). Candidate: the generator emits precise types **derived from the
  data** at `vocab-gen` time — literal unions for finite domains, structural types for unbounded
  text — alongside the data, deleting the hand-written `types.ts`. The EEF observed/declared-domain
  pattern (`graph-corpus-sdk/src/eef-strands/`) is the in-repo precedent. Falsifiable at promotion:
  the emitted types compile within budget over the real corpus.
- **Decision B — adapter home + dependency direction + thread-progressions hosting.** ADR-173
  homes Oak's typed corpus adapters in `graph-corpus-sdk`. Whether the adapter imports the
  generated corpus from `oak-sdk-codegen` (new sdk→sdk edge — verify ADR-041) or `vocab-gen`
  emits corpus modules into `graph-corpus-sdk` is settled at promotion with architecture review.
  ONE mechanism shared with EEF — no parallel.
- **Decision D — codegen schema-emission shape.** (a) emit a generated schema module performing
  the projection + single Zod call at the generated package's compile, or (b) a fully pre-rendered
  schema. Default (a) (preserves projection-from-data); confirmed in the mechanism co-design. Graph
  tools always include `oakContextHint`, so the projected output treats it as always-present.
- **Decision E — per-unit landing order.** Consumer-readiness. The EEF value path runs on the
  misconception and prior-knowledge tools (the D7 signal tools), so their redesigns are what the
  re-validation gate needs early; thread-progressions is not on the EEF value path. Order fixed at
  promotion against the tree.

## Reconciliation with the misconceptions-graph-features plan

[`oak-misconceptions-graph-features.plan.md §1`](./oak-misconceptions-graph-features.plan.md)
parks *bounded sub-graph extraction* (Thread-IRI + bound → bounded sub-graph) as a future
feature, on the now-overturned premise that the live tool stays whole-corpus and bounded
retrieval is a separate later feature. Under the value-driven frame, **bounded retrieval is the
core of this redesign**, so §1's blocking-primitive intent and its design substance (the bound
parameter exposed to callers, the empirical default, the fixture-manifest density buckets,
bounded-traversal fixture discipline) are **prior art for the prior-knowledge and misconception
redesign units**, not deferred work. The features plan's §2 (EEF cross-corpus composition), §3
(free-text topic resolution), and §4 (extended contexts) remain genuine future features gated on
this redesign + D7 — they compose *over* the one bulk graph + bounded query views this plan delivers. The
features plan is updated to record this boundary move (its §1 status), preserving §2–§4 verbatim.

## Dependencies and sequencing

| Dependency | Class | Detail |
| --- | --- | --- |
| EEF D6 landed (first instance of the shared projection→single-Zod-call mechanism) | **blocking** | The mechanism this redesign reuses must exist as landed code, not prose. Schema-delivery order is contractually after D6 (§Resolved Sequencing). |
| EEF D7 green (value proven on the live tools) | **blocking** | EEF's *first delivery consumes today's prerequisite and misconception graphs as they are* (owner, 2026-06-04); redesigning those tools before EEF v1 ships would delay or break the EEF first delivery, and would invalidate the D7 proof's target. The redesign scales proven value — it does not touch the signal tools until EEF v1 has shipped. |
| EEF D4 ratified (homogeneous strand contract) | **beneficial** | Without the landed D4 code, the node/edge-model *reconciliation* cannot finalise — but the model's core (kinds, id policy, edges) is derivable now and is the minimum shippable shape of that deliverable. |
| `graph-corpus-sdk` substrate (scaffold, `GraphView`, EEF adapter) | satisfied | Verified present 2026-06-04 — `src/eef-strands/` only (homogeneous); no heterogeneous model yet. |
| ADR-041 dependency-direction check for Decision B | **beneficial** | Without it the minimum shippable shape is `vocab-gen` emitting into `graph-corpus-sdk` (no new cross-sdk import edge). |

## Strategic acceptance criteria

Each names its single observable signal; verdicts land at promotion + per-unit landing.

1. **Bounded retrieval per corpus (×3)**: each tool takes its decided anchor input and returns
   only the bounded relevant subset (signal: an e2e call with an anchor returns the subset; a
   call exercising an empty anchor returns a well-formed empty result; no whole-corpus path
   remains). The tool's `outputSchema` appears in `tools/list` and the real `structuredContent`
   validates against it; the `isError` path carries no `structuredContent`. Full gate chain green
   at the unit's single landing commit.
2. **Type authority**: the hand-written `misconception-graph/types.ts` and
   `prior-knowledge-graph/types.ts` are deleted; no hand-maintained type parallel to a generated
   corpus remains (signal: files absent and `pnpm sdk-codegen && pnpm build` reproduces the tree).
3. **Value re-proof signalled**: all three landings raise the named signal to
   `eef-revalidate-on-new-graph-tools` with the new bounded-retrieval contract (signal: that
   plan's tracking todo cites the three commits). The value re-proof itself is that plan's
   acceptance.
4. **ADR-086 amended** in the first re-emission commit (signal: the amendment section exists
   citing Decision A).
5. **Node/edge model**: the heterogeneous model (kinds, cross-kind id policy, typed edges) is
   defined and consumed by all three units via their own typed accessors sharing one structural
   discipline (not a single polymorphic primitive), reconciled with the landed EEF D4 homogeneous
   case; any shared accessor mechanics ship with real operations + tests or are absent — no stubs
   (signal: the model doc + the three accessors in `graph-corpus-sdk`).

## Risks and unknowns

| Risk | Mitigation |
| --- | --- |
| Misconception graph-shaping (owner-directed) — does the data support the chosen anchor? | Verified 2026-06-04 against `bulk-downloads/schema.json`: the full `thread→unit→lesson→misconception` chain is in the bulk source, so thread/unit/lesson anchors are supported with no external sourcing. The residual check at promotion is population/density (how large a typical anchored subgraph is), not existence. `concept`-anchoring is the one unsupported case (no concept node) and is out of scope. The exact anchor/journey is confirmed with the owner before the edges are built. |
| Type-emission scale: 6.0 MB corpus breaks compile budget (TS7056 class) | Decision A structural emission + structural (not value-literal) shape; falsifiable compile check at promotion. With bounded retrieval the *returned* payload also shrinks dramatically. |
| Anchor design diverges across the three tools (inconsistent input idiom) | The input-interface surface is a single shared deliverable; anchors are generated-corpus keys with one resolution idiom. |
| Mechanism divergence from EEF (two parallel projection mechanisms) | Blocking D6 dependency; Decision B ONE-mechanism constraint; co-design recorded in the EEF plan. |
| Dependency-direction violation at the adapter boundary | ADR-041 check named in Decision B; architecture review at promotion. |
| Silent `outputSchema` drop at the universal-tools seam (Q-003 asymmetric-drop) | Seam guard owned by `output-schemas-for-mcp-tools.plan.md` S0; per-unit, criterion 1's `tools/list` + validation proof is the drop-catch. |
| Scope bleed from features-plan §2–§4 into this redesign | Boundary reconciliation above: this plan delivers the one bulk graph + its bounded query views only; cross-corpus/topic/extended-context composition stays in the features plan. |
| Naive identity (slug-as-id) corrupts the graph silently when a lesson is placed in >1 unit | Identity is a deliberate design item (node/edge model): stable entity ids, unit↔lesson placement modelled as an edge, no slug-uniqueness assumption. Verified rare in the snapshot but not guaranteed; the model is correct for the edge case by construction. Bulk-id↔ontology-IRI reconciliation is a separate concern. |
| Ontology coupling creep (treating the v0.1, change-prone ontology as a dependency of this plan) | Hard separation of concerns: this plan builds only from the bulk source and does not ingest/depend on the ontology. Any cross-source (concept) capability is a separate concern gated on the alignment audit. |

## Non-goals

- **Not building anything while parked** — no data object reshaped, no tool rewritten; the build
  is gated on EEF D6 + D7.
- **Not cross-corpus composition, free-text topic resolution, or extended contexts** — owned by
  `oak-misconceptions-graph-features.plan.md §2–§4`, gated on this redesign + D7.
- **Not the EEF tool** (owned by the EEF plan); **not** `vocabulary-graph` / `nc-coverage-graph`
  (no consumer); **not** the required-field promotion to `UniversalToolListEntry` (owned by
  `output-schemas-for-mcp-tools.plan.md` S0).
- **No upstream bulk-pipeline changes beyond the emission/reshape needed for the decided shapes.**

## Promotion trigger (into `current/`)

**EEF D6 landed AND EEF D7 green** — both observable as todo flips in
[`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md),
with D6's landing additionally observable as the first in-tree projection→single-Zod-call
instance. At promotion: record the trigger evidence, settle the mechanism decisions
(`settle-mechanism-at-promotion`) and the node/edge-model reconciliation with architecture +
assumptions review, author the executable plan in `current/` with TDD cycles per redesign unit,
and re-verify the pinned tool/consumer sets and corpus structures against the tree at that time
(this plan's pins are verified-2026-06-04 facts, re-checked at execution start). Three named
data-grounding checks gate the shapes at that re-verification: (a) the prior-knowledge
prerequisite-edge out-degree / depth distribution (confirm a depth bound yields a meaningfully
bounded subgraph, not a near-complete graph); (b) `lessonSlug` population density and stability
on misconception nodes (confirm the primary anchor is reliable and complete per lesson); (c)
the anchored-subgraph population/density for the misconception graph (the `thread→unit→lesson→
misconception` chain is schema-confirmed present in the bulk source 2026-06-04, so this is a
size/density check — how large a typical thread/unit-anchored subgraph is — not an existence
check).

The ratified arc (owner, 2026-06-02): **finish the EEF plan → redesign the graph tools onto the
new substrate → then decide what to do next.** This plan is the middle step; its completion opens
an owner decision point — nothing downstream auto-resumes.

## ADR obligations

- **ADR-086 amendment** (deliverable, same commit as the first re-emission): the
  explicit-interface-types-first large-graph pattern is superseded by the Decision-A
  data-as-type-authority emission; the stale tool-status rows (misconception is live), the §4
  freeze clause, and the `prerequisite-graph`/`prior-knowledge-graph` naming residue are
  corrected. Until that commit, ADR-086 remains live for the existing exports.
- **ADR-173 / ADR-179**: unaffected — this plan implements their consumer-readiness and
  transport-discipline rules (the substrate ships no MCP code; the tool surface stays in
  `oak-curriculum-sdk` and the app).
- **ADR-041**: the Decision B dependency-direction check.

## Foundation alignment and plan-body first-principles check

[`principles.md`](../../../../directives/principles.md) — design for value, no speculative
surface (the misconception graph is not built speculatively); Cardinal Rule (types flow from
generation); Strict and Complete (required schemas; the new input schemas are projection-derived
where domains are generated); replace-don't-bridge (no compatibility re-exports during units);
the value-first / existing-artefacts-are-malleable directive (the generated serializations are
malleable design surface). [`schema-first-execution.md`](../../../../directives/schema-first-execution.md);
[`tdd-as-design.md`](../../../../directives/tdd-as-design.md) — each redesign unit is an atomic
landing whose describing surface is the tool's wire envelope (e2e `tools/list` + anchored
`structuredContent`). ADR-173 / ADR-179 / ADR-086 (amendment carried).

The [`plan-body-first-principles-check`](../../../../rules/plan-body-first-principles-check.md)
fires at authoring (2026-06-04): the **shape** — each corpus's bounded shape is grounded in the
verified data structure (prior-knowledge `prerequisiteFor` subgraph, thread sequence) and, for the
owner-directed misconception graph, in the **bulk source** itself (`bulk-downloads/schema.json`
verified to carry the full `thread→unit→lesson→misconception` chain; concept-anchoring excluded as
unsupported) — no shape is assumed against the lossy generated projections. The **landing path** —
the build stays parked on EEF D6 + D7; this is plan-document work. The **vendor-literal clauses** — no SDK/codegen call shapes are asserted beyond
verified-in-tree code; the projection→single-Zod mechanism is reused from the landed EEF D6
instance, not invented here.

## Lifecycle triggers

See the [lifecycle-triggers component](../../../templates/components/lifecycle-triggers.md). Work
shape: strategic plan now; executable promotion later. Touch points: start-right at session open;
an active claim on `packages/sdks/oak-sdk-codegen/`, `packages/sdks/oak-curriculum-sdk/src/mcp/`,
and `packages/sdks/graph-corpus-sdk/` before the first execution edit (EEF shares the
`universal-tools/` seam — coordinate per §Resolved Sequencing); session-handoff at boundaries;
consolidation at completion.

> Implementation detail in this plan (mechanism candidates, consumer tables, the verified corpus
> structures) is reference context from completed research, not an in-progress execution
> commitment. The per-corpus value-shapes are owner-ratified design; the mechanism decisions are
> finalised only during promotion to `current/`.

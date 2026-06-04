# Graph / KG estate survey + two-source map (2026-06-04)

**Purpose.** Owner-directed survey-and-report (not a reshape) to ground a decision: the
graph-tools work has reframed from "redesign 3 existing tools" toward "build rich curriculum
graph(s) and surface many query views". The owner named **two distinct graph data sources** —
the bulk curriculum export, and the Oak Ontology repo (separate, via GitHub). This maps both
sources, what the existing estate already plans, what the substrate actually provides today, and
**names the decisions for the owner** — it does not make them.

**How grounded / confidence.** Synthesised from three read-only surveys of the estate, with
load-bearing facts independently verified by direct grep/ls (marked ✓). Relayed-but-not-personally-
re-read items are marked (reported). Discrepancies are flagged, not smoothed.

---

## 1. The two graph data sources

| | **Bulk curriculum export** | **Oak Ontology repo** |
|---|---|---|
| Where | `apps/oak-search-cli/bulk-downloads/` (in-repo; `schema.json` + per-subject JSON) | `github.com/oaknational/oak-curriculum-ontology` ✓ (separate repo; also a sibling data ref `oaknational/curriculum-ontology-data` ✓ — schema/instance split to confirm) |
| Form | Oak API JSON — units, lessons, misconceptions, keywords, NC-coverage strings | RDF/OWL/SKOS/SHACL `.ttl` (Turtle); `ontology/` schema + `data/` instances; Neo4j export script (reported) |
| Access today | Consumed by `vocab-gen` at codegen time → the generated vocab corpora | **Not ingested in code today** — `ontology-data.ts` only cites the repo + carries a hand-authored POC `conceptGraph`; no `.ttl` is read (reported; consistent with substrate state below) |
| Models | Concrete **instances** — curriculum content as taught (lesson-level) | Formal **structure** — concepts, threads, taxonomy, NC alignment, with stable canonical IRIs |
| Concept nodes | **None** ✓ (verified in schema: deepest concept-like field is lesson-level `lessonKeywords {keyword, description}`) | **Yes** — concepts / taxonomy / typed semantic relationships live here |

**Implication of the two-source split.** The curriculum-anchored misconception graph I described is
fully buildable from the **bulk** source (thread→unit→lesson→misconception, verified). But a
*concept*-anchored traversal (misconception → concept) is a **cross-source join**: bulk supplies the
misconceptions, the ontology supplies the concepts + their relationships. Neither source alone is the
"maximally rich" graph; the richest graph joins both. This is exactly the owner's two-source framing.

---

## 2. The substrate today (what is actually built)

Landed across four workspaces (per cited PRs #93/#108/#114/#115/#122):

- `packages/core/graph-core/src/` ✓ — RDF-1.2 `Term`/`Quad`, `DatasetCore`, `DataFactory`, JSON-LD 1.1,
  RDFC-1.0 canonicalisation, a vocab registry, and **`GraphView<TNode>`** — a polymorphic query
  interface with `manifest()` + `subgraph()` live and 5 ops (`summary`, `getNode`, `enumerateNodes`,
  `neighbours`, `findByTag`) as typed `NotImplementedYet` stubs (reported).
- `packages/libs/graph-ingest/` — JSON-LD + Turtle ingestion live; 5 other modes stubbed (reported).
- `packages/libs/graph-project/` — property-graph projection + `outgoing/incoming/neighbours` adjacency (reported).
- `packages/sdks/graph-corpus-sdk/src/` ✓ — **only** `eef-strands` + `index.ts`.

**Critical flag (verified).** There is **no `GraphView` implementation in `graph-corpus-sdk/src`** ✓ —
even the EEF adapter is raw-corpus `as const` types, not a `GraphView` impl. A plan records the EEF
`GraphView` adapter as landed (PR #114), but the class is not visible in code. So the substrate today
has the *query interface* (`graph-core`) and the *projection/adjacency mechanics* (`graph-project`) but
**zero live `GraphView` implementations** and **no ontology ingestion**. Readiness for "a rich
heterogeneous curriculum graph with many query surfaces" is roughly three increments out (first
ontology/Threads adapter → enhance/validate/full-ingest → cross-corpus join), all sequenced behind
EEF D6+D7 or owner promotion. The foundation is sound; the graph itself is not built.

---

## 3. What the estate already plans (and the framing it shares)

The reframe is **largely already envisioned** in the estate — but parked, and framed in the way the
owner is now challenging:

- **Ontology-sourced surfaces** (parked, `future/`): `oak-kg-threads-surface` (richest — `oak-kg-get-thread-content`,
  inverse-edge `curric:includesThread`, source = ontology `threads.ttl`) is the parent of four sibling
  placeholders — `oak-kg-lesson-graph-surface`, `oak-kg-programme-navigator`, `oak-kg-schema-browser`,
  `oak-kg-iri-traverser`. So "one curriculum graph, many query surfaces" is already the estate's shape —
  **all drawing from the ontology source**.
- **Cross-source** (parked): `cross-source-journeys` is the only plan composing **both** sources
  (lesson-sequencing × misconception graph × EEF evidence; prerequisite-trace) — at a "journey/playbook"
  layer above the tools.
- **Bulk-sourced** (parked behind EEF D6+D7): `graph-tools-value-redesign` (this session's work) owns the
  3 existing bulk-derived tools.
- **Master framing**: `graph-estate-consolidation` (JC3/JC4) holds wider graph work "undefined until EEF
  ships"; four coordination spines quarantined. Ontology integration model (npm / submodule / workspace)
  is **reopened/undecided**; an alignment audit (search records ↔ ontology entities) is the stated
  prerequisite for ontology integration and has not run.

**Two framings the estate carries that the owner's reframe challenges:**

1. **Anchor-first / generic-traversal-YAGNI.** The estate explicitly defers generic traversal
   (`oak-kg-iri-traverser`: "prove a generic traverser is needed beyond named surfaces") in favour of
   named anchor-input tools. This is the *same inertia* the owner challenged in me. The legitimate kernel
   underneath it is real, though: every query exposed to an agent must stay **token-bounded** (constraint 2)
   and **cycle/depth-safe**. The synthesis that honours both: a rich graph that *supports* arbitrary
   traversal, surfaced through **many bounded query operations from many seeds** — which is precisely what
   `GraphView` (manifest/subgraph/neighbours/getNode/findByTag) already models. "Pick THE anchor for THE
   tool" is inertia; "the graph affords many bounded queries" is the substrate's own design.
2. **Bulk = flat tools only.** Every `oak-kg-*` rich-graph surface draws from the **ontology**; the **bulk**
   export is treated only as the feed for the 3 flat tools. **No plan builds a rich graph from the bulk
   export as a primary source.** That gap is exactly the owner's point 2 ("value in the bulk data we are
   not surfacing as graphs"). The bulk export demonstrably supports a rich graph
   (thread→unit→lesson→{misconception, keyLearningPoint, keyword, teacherTip, NC-content}); the estate just
   never planned to build it.

---

## 4. The decisions this surfaces (for the owner — not made here)

1. **Bulk-as-rich-graph (the genuine gap).** Should the bulk export be built into a rich curriculum graph
   (units/lessons/threads/misconceptions/keywords/NC-content as node kinds), not just re-platformed as 3
   flat tools? This is point 2 with no existing home.
2. **One graph or two, then joined.** Bulk graph and ontology graph are different in kind (instances vs
   formal structure). Build each from its source and **join on shared identity** (slugs ↔ ontology IRIs —
   the alignment audit is the prerequisite), or unify earlier? Concept-anchored journeys *require* the join.
3. **Anchor-first doctrine.** Keep the estate's "named bounded tools first, generic traversal YAGNI", or
   adopt "rich graph + many bounded query operations from any seed" as the surfacing model (bounding/safety
   preserved per-query)? This decides whether `graph-tools-value-redesign`'s misconception unit is "a tool
   with an anchor" or "queries over the graph".
4. **Positioning vs the existing estate.** The reframe overlaps `oak-kg-*` + `cross-source-journeys` +
   `graph-estate-consolidation`. Does `graph-tools-value-redesign` fold into a single foundational
   curriculum-KG plan, or stay scoped while a new foundational plan is opened — and how is the now-parked
   `oak-kg-*` estate revived/reconciled?
5. **EEF sequencing.** Everything is parked behind EEF D6+D7 (EEF = the first proper graph tool, proving the
   substrate + projection mechanism). Does the rich-graph work stay behind that gate, or does graph-build /
   ontology-ingest design proceed in parallel (it needs the first `GraphView` adapter + ontology ingestion,
   neither of which exists yet)?

---

## 5. Caveats / verify-next

- The EEF `GraphView` adapter's build status is **unverified** (plan says landed; class not visible in
  `graph-corpus-sdk/src` ✓). Confirm before relying on "the substrate has a working adapter".
- The ontology repo's schema/data split (`oak-curriculum-ontology` vs `curriculum-ontology-data` ✓) and its
  exact contents (concept taxonomy depth, misconception↔concept links) are **reported, not personally read** —
  reading the actual `.ttl` is the next grounding step before committing to a concept-join shape.
- ADR-157 / ADR-173 source-authority + topology claims are agent-reported from those ADRs, not re-read here.
- This report names decisions; it does not reshape any plan. `graph-tools-value-redesign` stands as overhauled
  this session (bulk-source misconception graph verified); the decisions below have since been applied to it.

---

## 6. Owner decisions (2026-06-04) — resolved

The owner read this map and decided (these are now applied to `graph-tools-value-redesign.plan.md`):

1. **One bulk graph + views, not multiple fragmented graphs** — driven by shared identity + the
   multi-placement edge case (a lesson can be in >1 unit), which makes one shared identity model
   mandatory. Built incrementally; the 3 tools are its first views. (Owner rejected the framing that
   posed it as a binary; the reflection settled it on the identity merits.)
2. **Identity needs deliberate design — slugs are not guaranteed-unique identifiers.** A slug is a
   content key; curriculum placement is an edge, not identity. The ontology's `Lesson`/`LessonInclusion`
   model is the conceptual reference; bulk-id↔ontology-IRI reconciliation is a **separate** future concern.
3. **Misconception = rich graph** (curriculum-anchored bounded subgraph) — confirmed.
4. **Keep `graph-tools-value-redesign` scoped** — do not fold into a foundational KG (delivery risk). But
   the **entire `oak-kg` / ontology estate must be reviewed** as a distinct future activity (owner-directed;
   timing the owner's to schedule — not yet planned to avoid imaginary-flow framing).
5. **Stay behind EEF D6+D7** — EEF's first delivery consumes today's prerequisite + misconception graphs as
   they are; the redesign must not touch them until EEF v1 ships.

**Source boundary (owner-directed):** the bulk-derived graphs and the Oak Ontology graphs are **separate
concerns** sharing the `graph-core`/`graph-corpus-sdk` substrate. Concepts live in the ontology; any
concept-level (cross-source) capability is owned outside this scoped plan and gated on the alignment audit.

**Ontology grounding done (2026-06-04):** read `oak-curriculum-ontology` README + structure. Formal
RDF/OWL/SKOS/SHACL, stable `w3id.org` IRIs, 26 classes, 8 subjects, **v0.1 early release "subject to
change"**. Models `Programme → UnitVariantInclusion → UnitVariant → LessonInclusion → Lesson`, SKOS taxonomy
(`Discipline → Strand → SubStrand → ContentDescriptor` = concepts), threads, NC alignment; sequencing/
optionality via Inclusion nodes (which is how it correctly represents a lesson placed in multiple contexts).
A deeper `.ttl` read belongs to the owner-directed full `oak-kg` estate review, not this scoped plan.

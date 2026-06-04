# Oak KG / Ontology Deep Review — Assessment and Ratified Planning Shape (2026-06-04)

Thread: `oak-kg-ontology-planning-review`. Review and planning only — no implementation.

## Purpose, method, and confidence

The owner opened this thread to plan the `oak-kg` / ontology work, starting with a deep review of
the Oak Curriculum Ontology ([oaknational/oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology),
v0.1) and a scope of which parked `oak-kg-*` surfaces revive, in what order, on which serving
model — kept separate from the parked bulk-derived `graph-tools-value-redesign`.

Method: a shallow five-surface scan of the ontology, firsthand grounding of our own estate
(substrate, ADRs, parked plans), and decisive firsthand verification of the load-bearing,
convenient claims. Every load-bearing finding below is firsthand-verified (marked "verified") or
flagged open. The prior report
[`oak-ontology-mcp-search-integration-report-2026-04-19.md`](oak-ontology-mcp-search-integration-report-2026-04-19.md)
is a strong but dated base (ontology commit `0687b7e`, 2026-03-31); the two-source survey
[`graph-kg-estate-and-two-source-survey-2026-06-04.md`](graph-kg-estate-and-two-source-survey-2026-06-04.md)
proved a useful map but an unreliable facts source and was wrong on every load-bearing point checked.

## 1. The corrected join-key reality (the core result)

The cross-source identity picture, verified by direct read of both the ontology TTL and the bulk
export (`apps/oak-search-cli/bulk-downloads/`):

| Entity | Ontology key | Bulk export key | Joinable today | Verdict |
| --- | --- | --- | --- | --- |
| Thread | content-slug in IRI (`thread-empire-…`) | `threadSlug` content-slug | Yes — strong | Lead join; the one that works (prefix-strip) |
| Lesson | integer `curric:id` + `lesson-NNNN` IRI; no content-slug | string `lessonSlug`; no numeric id | No — disjoint identity | Audit-first; needs an external id↔slug crosswalk or fuzzy label-match |
| Unit | `unit-NNNN` numeric IRI; no content-slug | `unitSlug` content-slug | No — disjoint identity | Audit-first |
| ContentDescriptor | ontology-only (`coversContent` live; `includesContent` empty) | absent | Not applicable | Projection / QA first |

### Two convenient scan claims, falsified by grounding

1. **"Ontology lessons carry an integer id matching the bulk export's numeric ids" — false.** The
   bulk export has no numeric lesson id at all: lessons are keyed by string `lessonSlug`
   (`oakUrl`/`canonicalUrl` are null in the export). The ontology keys lessons by integer
   `curric:id` (e.g. `oakcurric:lesson-9162` ↔ `curric:id "9162"`). There is nothing for the
   integer to join to. The cross-source half of the claim was inferred, never read. (verified)
2. **"Ontology misconceptions are sparse (SHACL constraint disabled)" — false.** The ontology holds
   7,415 Misconception nodes, linked from 8,394 of 8,399 lessons. A disabled SHACL `minCount` means
   not-required-per-lesson, not unpopulated. (verified)

Lesson: specificity of a subagent finding is not verification, and a constraint's strictness is
never evidence of data volume. Both errors leaned toward convenient conclusions; firsthand grounding
caught them.

## 2. The ontology at depth

- Formal RDF / OWL / SKOS / SHACL, stable `w3id.org` IRIs, v0.1 early release explicitly "subject to
  change". 26 OWL classes. (verified)
- Identity model: `Programme → UnitVariantInclusion → UnitVariant → LessonInclusion → Lesson`, with
  Inclusion nodes carrying `sequencePosition`. This correctly represents one lesson placed in many
  contexts (the identity the bulk export lacks: a bulk lesson is keyed by a single slug). SKOS concept
  taxonomy `Discipline → Strand → SubStrand → ContentDescriptor`. (verified)
- Counts (current checkout, verified): 8,399 Lessons, 7,415 Misconceptions, 13,735 Keywords, 80
  Threads. `includesContent` occurrences: 0 (unit→content-descriptor alignment not populated);
  `coversContent`: 252 (NC progression coverage live).
- Three namespaces: `curric:` (schema), `natcurric:` (National Curriculum data), `oakcurric:` (Oak
  instance data). `oakcurric:` lesson/unit IRIs are opaque numeric (stable anchors); `natcurric:`
  taxonomy IRIs are label-derived (fragile under rename).
- Distribution stack (broader than earlier framing): four RDF serialisations (TTL, JSON-LD, RDF/XML,
  N-Triples) plus a faithful property-graph JSONL pair, a populated SQLite database, and two SQL DDL
  schemas — all as release artefacts. **No live SPARQL endpoint** (roadmap only). Two Neo4j paths
  exist: a lossy/opinionated bespoke export and a faithful JSONL projection.
- Deltas since the 2026-03-31 prior report: the relational/SQL + property-graph-JSONL distribution
  paths post-date it; its conceptual findings (threadSlug-first; lesson/unit mismatch; `includesContent`
  empty; integration via release distributions) remain valid and are confirmed here.

## 3. Substrate reality and ADR constraints

Firsthand-verified in code (the survey was wrong on the first two points):

- `GraphView` is exactly `manifest()` + `subgraph()`
  (`packages/core/graph-core/src/graph-view/interface.ts`); there is no concrete implementation
  anywhere, and no "five NotImplementedYet stubs". Its TSDoc: every operation is implemented with real
  graph-derived logic and tests, or it is absent.
- `graph-ingest` Turtle/SKOS and JSON-LD-compatible parsing are live; the JSONL (`node-edge-list`)
  ingestor is an empty `export {}` stub; there is no SQLite reader. `graph-project` projection and
  adjacency are live. `graph-corpus-sdk` has only the EEF strands corpus — **no ontology Threads
  adapter** (this missing adapter is the real dependency of the threads-surface plan).
- ADR-173 (graph-stack topology): TTL and SHACL are canonical; derived release bundles and projection
  formats are not first-wave ingestion targets; the live path is Turtle → DatasetCore →
  property-graph; upstream is source-of-truth and this repo consumes, never forks.
- ADR-157 (multi-source integration): status **Proposed** (demoted from Accepted 2026-04-30) —
  explicitly non-binding. The `oak-kg-*` namespace and source-authority split are revisable operating
  assumptions; it already anticipates authority shifting "as the ontology matures".
- ADR-179 (transport-agnostic substrate): the substrate ships no MCP/HTTP/CLI; surfacing is a
  consumer concern with at most one home per transport per graph domain.

## 4. v0.1 coupling constraints (concrete design rules)

- Depend on the structural model and on `oakcurric:` numeric IRIs. Never depend on `natcurric:`
  label-derived IRIs or on data completeness.
- Treat thread content-slugs as the only cross-source join key today.
- Do not build unit→content-descriptor features (`includesContent` is empty); start content work from
  taxonomy and NC progression projections.
- Pin the ontology source by explicit release; add CI drift detection; validate extracted data with
  the upstream SHACL rather than trusting ad hoc parse success.

## 5. Estate reconciliation (per-plan verdicts)

| Plan | Lifecycle | Verdict | Driver |
| --- | --- | --- | --- |
| `oak-kg-threads-surface` | future/ | Settled, lead candidate | Fully designed; thread join works; real blocker is the missing Thread adapter (a bounded build over the live Turtle path) |
| `kg-alignment-audit.execution.plan` | current/ | Open — reshape | Slug-based plan stands (id-join falsified); narrow to thread=strong, lesson/unit=disjoint-identity, crosswalk question |
| `oak-kg-lesson/programme/schema/iri` siblings | future/ | Open — placeholders | 2–3 line stubs; revive after threads proves the adapter path |
| `direct-ontology-use-and-graph-serving-prototypes` | future/ | Partly stale | Direct-use baseline right; ADR-173 already settles TTL ingest; no SPARQL endpoint exists — Neo4j/Stardog lane assumptions need refresh |
| `ontology-integration-strategy` + `oak-curriculum-ontology-workspace-reassessment` | future/ | Open | Informed by the release-distribution option and the now-grounded distribution stack |
| `kg-integration-quick-wins` | current/ | Partly stale | Neo4j-first; reconcile against TTL-canonical and the absent JSONL ingestor |
| `cross-source-journeys` | future/ | Open, correctly gated | Needs substrate adapters that do not exist yet |
| `graph-estate-consolidation` | current/ | Settled | t1–t7 done; t6/t8 legitimately EEF-gated |
| `ontology-repo-fresh-perspective-review` | future/ | Complete | Its findings are the strong (dated) base for this review |

## 6. Ratified decisions (owner, 2026-06-04)

1. **Sequencing — threads first.** Build the ontology thread surface (`onto-threads`) next.
   Differentiate it from the bulk-derived thread tooling (`bulk-threads`): they are distinct tools,
   are not forced to match, and getting the best out of both together is a later step.
2. **Serving model — TTL → substrate.** Ingest canonical Turtle via the live `graph-ingest` path into
   `graph-core`, project to property-graph. ADR-173-aligned; no new ingestor needed.
3. **Cross-source lesson/unit — defer; thread-join only for now.** Verified (OpenAPI spec + bulk export):
   **no shared key exists** — the Oak API and the bulk export are both slug-only, and the ontology's
   `curric:id` is an internal identifier with no public counterpart. A bridge needs an upstream ontology
   `curric:slug` (owner is raising this with the ontology team) or fuzzy title-matching; neither gates us.
4. **Source boundary — keep separate / complementary.** Two sources, joined only where keys align
   (threads), with a crosswalk as the named future bridge. Reinforced by the disjoint identity finding.
5. **Integration model — pinned release-download.** Fetch a version-pinned ontology TTL release
   artefact at build/ingest time; no Python toolchain or full repo in our tree; CI drift detection.

## 7. Recommended next steps (execution — not owner forks)

- Author an executable plan for the `onto-threads` surface: build the `graph-corpus-sdk` Oak Curriculum
  Ontology Threads adapter (`curric:Thread` enumeration + `curric:includesThread` inverse edge) over a
  pinned TTL release, then the `onto-threads` resource + `onto-get-thread-content` tool (source-prefix
  convention, ADR-157; supersedes the earlier `oak-kg-*` names). Surface only per ADR-179.
- **Estate cleanup executed 2026-06-04** (graph-estate-consolidation t9 + README): `kg-alignment-audit`,
  `kg-integration-quick-wins`, the serving-prototype / integration-strategy plans, and the four empty
  oak-kg surface stubs were **archived** (not reshaped) — the slug verification answered the audit's core
  question, so it is no longer a live precursor. The stubs are consolidated into a README backlog. Link
  reconciliation across remaining referrers is owned by graph-estate-consolidation t8.

## 8. Guardrails / what not to do

- Do not assume lesson, unit, programme, or sequence identifiers align across sources.
- Do not build content-descriptor features on `includesContent` (empty).
- Do not fork or curate the ontology; pin and consume upstream.
- Do not touch or fold in `graph-tools-value-redesign` (separate concern, parked behind EEF D6+D7).

## 9. Caveats / verify-next

- Entity counts are from the current local checkout; the pinned release used for ingestion should be
  recorded when the `onto-threads` plan is authored.
- **Resolved 2026-06-04:** the id↔slug crosswalk is **not available from any public source** — the
  OpenAPI spec and the bulk export are slug-only; the ontology `curric:id` is internal. A bridge needs
  an upstream `curric:slug` (owner-raised feature request) or fuzzy title-matching. Threads stay joinable.
- ADR-173 status was treated as operative (the substrate is built to it); confirm its accepted status
  if a divergence from TTL-ingest is ever proposed.

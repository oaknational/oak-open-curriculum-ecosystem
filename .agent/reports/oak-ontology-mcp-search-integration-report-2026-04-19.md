# Oak Ontology MCP and Search Integration Report

**Date**: 19 April 2026  
**Prepared from**: repo-local inspection plus a local checkout of
[oaknational/oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology)
at commit `0687b7e165a91d2f5eca4bd4ab5d598d33581be8`
(`2026-03-31`, `fix: owl imports predicate`)  
**Purpose**: record the current state of the official Oak ontology, map it
against existing MCP and search surfaces in this repo, and make the next
service and planning moves explicit without reducing the ontology to a
search-only concern.

## Executive Summary

- The official ontology is **not** a drop-in replacement for the repo's current
  proof-of-concept (POC) orientation model. The current
  `get-curriculum-model` payload in
  [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts)
  is hand-authored and broader than the current official ontology in some areas,
  but also misses at least one official ontology subject family
  (`citizenship`). The right shape is **composition with explicit coverage and
  provenance**, not a naive swap.
- The official ontology already supports more than the currently planned
  `WS-4` workstream's "knowledge taxonomy only" slice. Stable first-pass
  slices now include temporal structure, threads, exam-board and tier
  catalogues, programme
  sequencing with optionality, lesson semantics, and National Curriculum
  progression coverage.
- Search is only one consumer. The official ontology should also land directly
  in MCP orientation and standalone `oak-kg-*` resource surfaces, and it should
  improve internal QA and governance work even before any query-time graph
  augmentation is attempted.
- The cleanest current ontology join into repo-local data is **thread slug**.
  Programme, unit, and lesson joins are not yet reliable enough to treat as
  direct matches because the ontology and this repo currently use different
  identifier systems and different notions of "programme".
- `curric:coversContent` is live on National Curriculum progression records now.
  `curric:includesContent` is defined in the ontology but unpopulated in the
  current Oak unit instance data. Content-descriptor work should therefore begin
  with taxonomy and progression projections plus QA, not with unit-level
  retrieval features that assume direct unit-content alignment.
- The repo already has most of the MCP mechanics needed for official ontology
  integration: the graph resource factory, provenance metadata, and an
  `oak-kg-*` namespace convention. What is missing is a formal ontology source
  contract, a wider ontology resource family, and a clearer boundary between
  official ontology structure, bulk-derived graph families, and repo-local tool
  guidance.

## Reader Orientation

- `POC` refers to the repo's current proof-of-concept, hand-authored
  orientation structure in
  [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts).
- `WS-4` refers to the fourth workstream in
   [open-education-knowledge-surfaces.plan.md](../plans/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md),
  currently scoped around an initial ontology-backed taxonomy surface.
- `OWA` refers to the Oak web application and nearby Oak API-aligned curriculum
  surfaces already discussed in this repo's existing research and search docs.

## First-Class Consumers

The ontology should be treated as a shared structural asset with multiple
first-class consumers, not as a search sub-feature.

| Consumer | Role | Good first ontology slices |
| --- | --- | --- |
| MCP orientation | Replace the structural half of `get-curriculum-model` with official projections plus explicit coverage/provenance while keeping repo-local guidance separate | Temporal structure, coverage metadata, shared subject catalogue, threads |
| Standalone MCP resources and tools | Give assistants and power users direct access to official ontology views without going through search | `oak-kg-temporal-structure`, `oak-kg-threads`, `oak-kg-knowledge-taxonomy`, `oak-kg-programme-sequencing`, `oak-kg-lesson-semantics`, `oak-kg-nc-progressions` |
| Search and search app | Project stable ontology slices into search-optimised fields and explanation surfaces | Threads, taxonomy, NC progressions, lesson semantics |
| Internal QA and governance | Compare ontology truth, bulk-derived graphs, and current indexed/search-facing records | Join-key audits, coverage gap reports, provenance checks, release delta checks |

## The Layers That Must Stay Separate

| Layer | Authoritative surface | Why the separation matters here |
| --- | --- | --- |
| Source ontology | [oak-curriculum-ontology README](https://github.com/oaknational/oak-curriculum-ontology/blob/main/README.md), `data/**/*.ttl`, `ontology/*.ttl`, SHACL constraints | Canonical semantics, validation, and release pinning live here |
| Operational graph | [`scripts/export_to_neo4j_config.json`](https://github.com/oaknational/oak-curriculum-ontology/blob/main/scripts/export_to_neo4j_config.json) | This is a transformed traversal contract, not a raw RDF mirror |
| Repo-local orientation | [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts), [curriculum-model-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.ts), tool guidance data | Agents need a composed orientation surface that may contain official ontology, API-only coverage, and repo-local guidance |
| Search projections | [thread-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts), [unit-document-core.ts](../../apps/oak-search-cli/src/lib/indexing/unit-document-core.ts), [lesson-document-core.ts](../../apps/oak-search-cli/src/lib/indexing/lesson-document-core.ts), [sequence-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts) | Search fields are purpose-built partial projections and should never be mistaken for ontology truth |

## Current Repo Surfaces Affected

### MCP Orientation and Resource Surfaces

- [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts)
  still defines the structural curriculum model as a hand-authored POC, tagged
  `version: '0.1.0-poc'`, with a notice that a future version will be generated
  from the OpenAPI schema rather than the official ontology.
- [curriculum-model-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.ts)
  passes that POC structure through wholesale as `domainModel`, alongside
  separately composed `toolGuidance`.
- [mcp-tools.ts](../../packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts)
  publicly re-exports both `CURRICULUM_MODEL_RESOURCE` and `ontologyData`, which
  makes the POC structure look like a durable public truth surface.
- [register-resources.ts](../../apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts)
  currently registers the curriculum model, prior knowledge graph, thread
  progressions, and misconception graph. There are no live `curriculum://oak-kg-*`
  resources yet.
- [graph-resource-factory.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts)
  already supports the correct supplementary-surface model for ontology-backed
  resources: resource and tool creation, `_meta.attribution`, and optional
  priority.
- [source-attribution.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts)
  already defines `OAK_KG_ATTRIBUTION`, but that constant is not yet attached to
  a live ontology-backed surface.

### Search and Search-App Surfaces

- [thread-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts)
  already treats thread slugs and titles as first-class search records.
- [unit-document-core.ts](../../apps/oak-search-cli/src/lib/indexing/unit-document-core.ts)
  sets `unit_id` and `unit_slug` to Oak content slugs, not ontology numeric
  unit identifiers such as `unit-3701`.
- [lesson-document-core.ts](../../apps/oak-search-cli/src/lib/indexing/lesson-document-core.ts)
  does the same for lessons: `lesson_id` and `lesson_slug` are content slugs,
  not ontology numeric lesson identifiers such as `lesson-1077`.
- [sequence-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts)
  still describes sequences as curriculum programmes. That wording is exactly
  the distinction the ontology work needs to preserve carefully.
- [generate-synonyms.ts](../../apps/oak-search-cli/operations/utilities/generate-synonyms.ts)
  still describes `ontologyData.synonyms` as the "SINGLE SOURCE OF TRUTH" for
  Elasticsearch synonym deployment.
- [apps/oak-search-cli/docs/SYNONYMS.md](../../apps/oak-search-cli/docs/SYNONYMS.md)
  still instructs contributors to edit `ontologyData.synonyms` directly, even
  though the newer
  [synonyms README](../../packages/sdks/oak-sdk-codegen/src/synonyms/README.md)
  already distinguishes curated agent-context synonyms from longer-term search
  synonym authority.

## Official Ontology Inventory

### What the official repo says about itself

The official ontology explicitly describes itself as:

- an early public `0.1.0` release whose structure, URIs, and data remain
  subject to change
- a W3C-compliant semantic resource using RDF, OWL, SKOS, and SHACL
- a repo with downloadable distributions, local validation, and an explicit
  Neo4j export path
- an Oak-developed representation aligned to the National Curriculum for
  England, not an official DfE publication

Relevant upstream references:

- [README.md](https://github.com/oaknational/oak-curriculum-ontology/blob/main/README.md)
- [docs/standards-compliance.md](https://github.com/oaknational/oak-curriculum-ontology/blob/main/docs/standards-compliance.md)
- [`scripts/export_to_neo4j_config.json`](https://github.com/oaknational/oak-curriculum-ontology/blob/main/scripts/export_to_neo4j_config.json)

### Current top-level coverage

The current official ontology has six top-level subject directories:

- `citizenship`
- `english`
- `geography`
- `history`
- `mathematics`
- `science`

Science is subdivided into separate biology, chemistry, and physics knowledge
taxonomies, which is why the upstream README describes "8 subject areas" while
the repo has six top-level subject families.

### Coverage mismatch with current repo-local orientation

The mismatch is bi-directional:

- The current POC `get-curriculum-model` subject list includes art, music,
  physical education, computing, religious education, French, Spanish, and
  German, which the current official ontology does not yet cover.
- The current official ontology includes citizenship, which the current POC
  subject list does not expose.
- The current bulk thread progression asset in
  [thread-progression-data.ts](../../packages/sdks/oak-sdk-codegen/src/generated/vocab/thread-progression-data.ts)
  covers `164` threads across `16` subjects, while the official ontology
  currently defines `80` thread nodes in `data/threads.ttl`.

That means official ontology integration must advertise **coverage**, not imply
full replacement.

## Observed Counts From the Local Ontology Snapshot

These counts were gathered from a local scan of the official ontology checkout.
Entity counts come from declaration scans (`a curric:*`). Predicate counts below
mean "records carrying the property", not necessarily the total number of edges.

| Signal | Count | Interpretation |
| --- | --- | --- |
| Programmes | 118 | Year-group and exam-context programme records exist already |
| Units | 867 | Official unit layer is large enough to support real projection work |
| Lessons | 8,399 | Official lesson layer is already substantial |
| Threads | 80 | Official thread catalogue exists but is narrower than current bulk thread progressions |
| `UnitVariantChoice` nodes | 65 | Optionality is real data, not just an ontology concept |
| Units carrying `includesThread` | 836 | Thread membership is already widely populated |
| Units carrying `whyThisWhyNow` | 867 | Unit rationale is present across the whole current unit set |
| Units carrying `unitPriorKnowledgeRequirements` | 867 | Prior-knowledge rationale is also broadly present |
| Keyword nodes | 13,735 | Lesson vocabulary layer is large enough for dedicated surfaces |
| Misconception nodes | 7,415 | Official misconception layer is already strong |
| Key learning point nodes | 34,702 | Strong lesson-semantics coverage |
| Pupil lesson outcome nodes | 8,399 | Essentially one outcome surface per lesson |
| Progressions carrying `coversContent` | 252 | NC progression coverage is live now |
| Units carrying `includesContent` | 0 | Unit-to-content-descriptor alignment is not populated yet |
| Thread placeholder comments | 52 | Slugs and labels are safer than thread descriptions today |

## Projection-Safe Slices Available Now

| Slice | Primary upstream files | What is already there | Recommended first use in this repo |
| --- | --- | --- | --- |
| Temporal structure | `data/temporal-structure.ttl` | Phases, key stages, and year groups with ordering and age boundaries | MCP orientation, filters, and coverage signalling |
| Threads | `data/threads.ttl`, `curric:includesThread` in subject key-stage files | Thread catalogue plus widespread unit-thread membership | Direct MCP `oak-kg-threads` surface and search thread enrichment where overlap is exact |
| Knowledge taxonomy | `subjects/*/*-knowledge-taxonomy.ttl` | Discipline → strand → substrand → content-descriptor hierarchy | MCP `oak-kg-knowledge-taxonomy`, search taxonomy projections, QA |
| Global programme structure | `data/programme-structure.ttl` | Exam boards and tiers | MCP orientation and search filter metadata |
| Programme sequencing and optionality | `subjects/*/*-key-stage-*.ttl` | Programmes, ordered inclusions, unit variants, optional choice nodes | MCP `oak-kg-programme-sequencing`; later bounded search projections |
| Unit rationale | `subjects/*/*-key-stage-*.ttl` | `whyThisWhyNow`, `unitPriorKnowledgeRequirements` | MCP explanation surfaces and QA |
| Lesson semantics | `subjects/*/*-key-stage-*.ttl` | Keywords, misconceptions, key learning points, pupil lesson outcomes | MCP `oak-kg-lesson-semantics`; search definition and explanation surfaces |
| NC progressions | `subjects/*/*-programme-structure.ttl` | Progressions with `coversContent` | `oak-kg-nc-progressions`, taxonomy/coverage QA, later search projection |

## Join-Key Findings

### High confidence now

| Candidate | Current state | Confidence | Notes |
| --- | --- | --- | --- |
| `threadSlug` | Ontology thread URIs and current search thread documents share the same slug shape for overlapping records | High | Best current first join |
| Exam-board and tier slugs | Ontology provides canonical catalogues that line up with existing KS4 concepts | High | Good for orientation and filter metadata even before deeper graph joins |

### Not yet safe to treat as direct joins

| Candidate | Ontology shape | Repo-local shape | Mismatch type | Status |
| --- | --- | --- | --- | --- |
| `programmeSlug` | `programme-geography-year-group-11-aqa` | Search and OWA surfaces use `geography-secondary-ks4-aqa`; sequence surfaces use `geography-secondary-aqa` | Naming + granularity mismatch | Audit first |
| `unitSlug` | Numeric-style slugs such as `unit-3701` | Search uses Oak content slugs for `unit_id`/`unit_slug` | Identifier mismatch | Audit first |
| `lessonSlug` | Numeric-style slugs such as `lesson-1077` | Search uses Oak content slugs for `lesson_id`/`lesson_slug` | Identifier mismatch | Audit first |
| `contentDescriptorSlug` | Present in ontology taxonomy and progression data | Not yet a direct search-facing join key | Coverage + representation mismatch | Projection and QA first |

### Why the mismatches happen

| Mismatch family | Example in this lane |
| --- | --- |
| Identifier mismatch | Ontology numeric-style `unit-3701` vs search content slug identifiers |
| Naming or slug mismatch | Ontology year-group programme URIs vs OWA/search programme names |
| Granularity mismatch | Ontology programmes are year-group specific; repo sequence surfaces span key stages and generate multiple programme views |
| Coverage mismatch | Official ontology currently covers a narrower subject set than the current bulk-derived assets |
| Representation mismatch | Source RDF sequencing is transformed by the Neo4j export into flattened relationship properties |
| Partial content population | `coversContent` exists now; `includesContent` does not |
| Documentation incompleteness | 52 thread comments still use placeholder text |

## Service-Level Update Recommendations

### 1. `get-curriculum-model` should become a composed official-orientation surface

**Current files**

- [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts)
- [curriculum-model-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.ts)

**Recommended change**

- Replace the structural POC payload with official ontology projections where
  coverage exists.
- Keep repo-local `toolGuidance` as a separate authored layer.
- Add explicit `ontologyCoverage`, `apiCoverage`, and `ontologySource`
  metadata so agents can see which parts of the orientation are official
  ontology, which parts are API-only, and which parts are local guidance.
- Mark the existing POC structural model as deprecated as a structural source
  of truth.

### 2. MCP should gain a small family of direct ontology surfaces

**Current enablers**

- [graph-resource-factory.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts)
- [source-attribution.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts)
- [register-resources.ts](../../apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts)

**Recommended first family**

1. `oak-kg-temporal-structure`
2. `oak-kg-threads`
3. `oak-kg-knowledge-taxonomy`
4. `oak-kg-programme-sequencing`
5. `oak-kg-lesson-semantics`
6. `oak-kg-nc-progressions`

These should remain supplementary resources and tools. `get-curriculum-model`
should still be the primary orientation call, but it should no longer depend on
the hand-authored POC structure.

### 3. Search should be projection-first, not join-heavy, for the first wave

**Current files**

- [thread-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts)
- [unit-document-core.ts](../../apps/oak-search-cli/src/lib/indexing/unit-document-core.ts)
- [lesson-document-core.ts](../../apps/oak-search-cli/src/lib/indexing/lesson-document-core.ts)
- [sequence-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts)

**Recommended order**

1. Thread enrichment where slugs align exactly
2. Taxonomy and NC progression projection indices
3. Lesson-semantics projection and explanation surfaces
4. Unit, lesson, and programme joins only after the alignment audit lands

The current wording in
[sequence-document-builder.ts](../../apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts)
should also stop treating sequences as interchangeable with programmes, because
that confusion directly increases ontology integration risk.

### 4. Vocabulary ownership must split cleanly

**Current files**

- [generate-synonyms.ts](../../apps/oak-search-cli/operations/utilities/generate-synonyms.ts)
- [apps/oak-search-cli/docs/SYNONYMS.md](../../apps/oak-search-cli/docs/SYNONYMS.md)
- [synonyms README](../../packages/sdks/oak-sdk-codegen/src/synonyms/README.md)

**Recommended change**

- Curated synonyms remain valid for agent orientation and natural-language help.
- Search synonym authority should move to a dedicated pipeline once Oak decides
  what the authoritative search-vocabulary source is.
- Search-side scripts and docs should stop describing `ontologyData.synonyms` as
  the single source of truth for search.

### 5. The ontology source contract needs to be visible everywhere

**Recommended contract**

- Pin the ontology source by explicit commit or release.
- Keep the interim source-management choice explicit: compare the current
  strategy's git-submodule path with subtree-style vendoring arguments already
  present elsewhere in the repo, and record any direction change in the
  strategy document before implementation.
- Keep a published package as the cleaner long-term target if the ontology repo
  can support it.
- Expose ontology provenance on every ontology-backed MCP resource and search
  artefact.
- Add CI drift detection so a stale vendored copy cannot silently linger.
- Add SHACL-backed extraction validation rather than relying only on ad hoc
  parsing success.

### 6. Bulk-derived and ontology-derived graph families need an authority matrix

This repo already has bulk-derived graphs for thread progressions, prior
knowledge, misconceptions, vocabulary, and NC coverage. The official ontology
introduces overlapping but not identical structural truths. The repo needs a
simple authority matrix that answers:

- when the ontology is authoritative
- when the bulk graph is authoritative
- when both are allowed to coexist as different views
- when a surface is explanation-only or QA-only rather than search/runtime truth

## Existing Surface Cross-Reference Map

| Surface | Why it still matters | What this report changes |
| --- | --- | --- |
| [curriculum-ontology.md](../research/curriculum-ontology.md) | Historical repo-local ontology framing and sequence/programme distinction | Should now be read as local/P0 context, not as the official ontology |
| [official-api-ontology-comparison.md](../research/official-api-ontology-comparison.md) | API versus ontology framing | Still useful; now needs the newer subject-coverage and join-key caveats from this report |
| [open-education-knowledge-surfaces.plan.md](../plans/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) | MCP umbrella for multi-source surfaces | WS-4 should widen from one taxonomy slice to a small official ontology surface family |
| [nc-knowledge-taxonomy-surface.plan.md](../plans/knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md) | First safe MCP ontology slice | Still valid, but too narrow to stand alone as "the ontology integration plan" |
| [ontology-integration-strategy.md](../plans/knowledge-graph-integration/future/ontology-integration-strategy.md) | Source-management strategy | Should be revisited explicitly to compare the current submodule-first interim path with subtree-style vendoring arguments elsewhere in the repo, rather than letting this report silently decide the source-management direction |
| [kg-alignment-audit.execution.plan.md](../plans/knowledge-graph-integration/current/kg-alignment-audit.execution.plan.md) | Join-key and mismatch evidence plan | Should explicitly classify thread joins as strongest first candidate and unit/lesson/programme joins as blocked pending evidence |
| [kg-integration-quick-wins.plan.md](../plans/knowledge-graph-integration/current/kg-integration-quick-wins.plan.md) | Search/graph quick-win parent plan | Quick wins should narrow around projection-safe slices before live traversal ambitions |
| [oak-ontology-graph-opportunities.strategy.md](../plans/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md) | Strategic search/graph stance | Good strategy, but this report adds stronger evidence on coverage limits, non-search consumers, and the direct-use baseline |
| [apps/oak-search-cli/docs/SYNONYMS.md](../../apps/oak-search-cli/docs/SYNONYMS.md) | Existing service documentation | Needs wording updates once vocabulary ownership is formally split |

## What Not To Do

- Do not swap the POC ontology out for the official ontology without coverage
  metadata.
- Do not treat search as the only valid ontology consumer.
- Do not assume sequence, programme, unit, and lesson identifiers already align.
- Do not build content-descriptor-dependent features on the assumption that
  `includesContent` is populated.
- Do not treat the transformed Neo4j export as if it were identical to the RDF
  source model.

## Fresh-Perspective Addendum (19 April 2026)

This addendum re-reads the ontology repo from an upstream-first starting
point, testing whether the report above — intentionally grounded in this
repo's MCP and search surfaces — has narrowed its consumer classification
or carried assumptions that deserve challenge. It was produced from the
same ontology commit (`0687b7e1`) and the ontology repo's own
documentation: README, standards-compliance, Neo4j export architecture,
and CONTRIBUTING guide.

The original plan is at
[ontology-repo-fresh-perspective-review.plan.md](../plans/knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md).

### Upstream Use-Case Coverage Gap

The ontology README names eight use cases. The body of this report
classifies consumers by four categories internal to this repo. The
comparison reveals where local framing has covered, partially covered,
or not yet considered the ontology's own stated purposes.

| Upstream use case | Local coverage | Disposition |
| --- | --- | --- |
| Educational Platforms | None | Out of scope for this repo. LMS integration is a different product surface. Acknowledge explicitly in plan documents rather than leaving the omission implicit. |
| Curriculum Analysis | Partial (WS-4, `oak-kg-*` family) | The ontology's SPARQL examples suggest analysis patterns (find all Year 7 programmes, list units in sequence for a programme) that go beyond what the current MCP tool design exposes. The `oak-kg-programme-sequencing` resource partially addresses this. |
| AI/ML Training | Implicit | The MCP server already serves structured ontology data to AI agents, which partially fulfils this use case. No local plan frames it that way. Could be acknowledged without new work. |
| Research | None | The ontology's persistent w3id.org URIs and OGL 3.0 licensing were designed for external citation and reuse. Local plans do not expose URI-stable references that researchers could cite. Low priority for this repo but worth acknowledging. |
| Data Integration | None | Most under-served. The w3id.org namespace and Linked Data principles were designed for cross-dataset linking. Local plans treat these URIs as internal identifiers to be projected into slugs, not as interoperable endpoints. |
| Quality Assurance | Partial | The internal QA consumer category covers editorial governance. The ontology's SHACL shapes are additionally designed for broader QA use — including third-party data validation. The shapes could be consumed by this repo's CI to validate extracted ontology data before serving it. |
| Graph Databases | Good | Well covered by the alignment audit and graph opportunities strategy. |
| Semantic Search | Good | Well covered by the search pipeline and projection-safe slices. |

**Summary**: strong coverage for Graph Databases and Semantic Search,
partial for Curriculum Analysis, AI/ML Training, and QA, essentially
none for Educational Platforms, Research, and Data Integration. The
three uncovered use cases are not necessarily gaps to fill — they may be
genuinely out of scope — but the report's consumer classification should
not be read as "who the ontology serves" when it is actually "who in
this repo consumes the ontology."

### Assumption Audit

Five assumptions in local plans were tested against the ontology repo's
own documentation.

**1. "Search-first, graph-augmented" is the right strategic frame.**

- *Evidence for*: this repo's primary user-facing product is semantic
  search. Anchoring ontology work to search impact is proportional.
- *Evidence against*: the ontology README lists Semantic Search last
  among eight use cases. The graph opportunities strategy adopts this
  frame without explicit justification.
- *Recommendation*: **keep, but justify explicitly**. Add a sentence to
  the graph opportunities strategy acknowledging that the frame is a
  scoping decision for this repo, not a statement about the ontology's
  own priorities.

**2. The ontology is consumed as extracted data, not as a live semantic
resource.**

- *Evidence for*: static extraction at build time fits the repo's
  Node.js toolchain and avoids a runtime dependency on a Python-tooled
  RDF service.
- *Evidence against*: the ontology roadmap names a public SPARQL
  endpoint and HTTP content negotiation as future features. If these
  ship, a live query path becomes possible and the extraction pipeline
  becomes an optimisation rather than a necessity.
- *Recommendation*: **keep for now, flag for re-evaluation**. Add a
  watchlist note in the integration strategy: if the ontology repo ships
  a SPARQL endpoint, reassess whether live querying (wrapped as an MCP
  tool) should complement or replace static extraction.

**3. npm package is the preferred long-term integration path.**

- *Evidence for*: npm packages fit the repo's pnpm workspace model and
  enable Dependabot/Renovate version tracking.
- *Evidence against*: the ontology is a Python-toolchain project with
  RDF data. Requiring the ontology team to maintain an npm publication
  pipeline adds cross-toolchain friction. The ontology already publishes
  multi-format distributions (TTL, JSON-LD, RDF/XML, N-Triples) via
  GitHub Releases. JSON-LD distributions could be consumed directly by
  Node.js without a custom parser.
- *Recommendation*: **modify**. The integration strategy should evaluate
  consuming GitHub Release distributions (especially JSON-LD) as an
  alternative to requiring an npm package. An npm package remains valid
  if the ontology team chooses to publish one, but the strategy should
  not depend on it.

**4. The three-namespace separation is a provenance detail.**

- *Evidence for*: local surfaces only need to know whether data came
  from the ontology or the bulk API. The triple-namespace distinction
  (`curric:` / `natcurric:` / `oakcurric:`) is an RDF modelling
  concern.
- *Evidence against*: the three namespaces encode a structural
  principle: ontology model vs National Curriculum data vs Oak
  curriculum data. Preserving this in MCP surfaces (e.g., via a
  `source` field on `oak-kg-*` resources) would make provenance
  machine-readable without requiring consumers to understand RDF.
- *Recommendation*: **flag for investigation**. When designing `oak-kg-*`
  resource schemas, consider whether a `source` enum
  (`ontology-model` / `national-curriculum` / `oak-curriculum`) is
  worth the complexity. Low cost, potentially useful for QA and
  research consumers.

**5. Inclusion patterns are reified relationships to flatten.**

- *Evidence for*: the Neo4j export pipeline flattens
  `UnitVariantInclusion` and `LessonInclusion` into direct
  relationships with properties (`unitVariantOrder`, `lessonOrder`).
  This is the ontology team's own recommended operational shape.
- *Evidence against*: the unflattened structure carries choice
  constraints (`minChoices`/`maxChoices`) and sequence positions that
  encode curriculum design decisions. MCP explanation surfaces ("why
  does this unit appear here?") may benefit from the structured form.
- *Recommendation*: **keep flattened for traversal, but preserve
  structured form for explanation**. The `oak-kg-programme-sequencing`
  resource should expose both the sequence order (flattened) and the
  choice structure (unflattened) when optionality is present.

### Tooling Surfaces the Report Under-Weighted

Three upstream surfaces deserve more attention than the body of this
report gave them:

1. **SHACL validation as a consumable CI service.** The ontology's
   `validate.sh` and SHACL constraints (`oak-curriculum-constraints.ttl`)
   are not just internal quality gates — they could validate extracted
   ontology data in this repo's CI before serving it. Recommendation 5
   above mentions SHACL-backed extraction validation; this addendum
   upgrades it from nice-to-have to recommended.

2. **JSON-LD distributions as a simpler consumption path.** The ontology
   publishes JSON-LD via GitHub Releases. For a Node.js repo, JSON-LD is
   natively parseable without an RDF library. This may be simpler than
   building a Turtle parser or depending on `rdflib` via a Python
   subprocess.

3. **The Neo4j export config as a design document.** The 14-step
   transformation pipeline in `export_to_neo4j_config.json` encodes the
   ontology team's view of how graph consumers should interact with
   their data. Local plans should treat the slug extraction patterns,
   property mappings, and inclusion-flattening rules as design
   decisions to learn from, not just operational details to consume.

### Plan-Level Recommendations

| Plan | Recommendation |
| --- | --- |
| [open-education-knowledge-surfaces.plan.md](../plans/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) | **Leave alone.** WS-4 scope is appropriate for a first integration. The wider `oak-kg-*` family recommended in this report naturally follows as WS-4 proves the pattern. |
| [ontology-integration-strategy.md](../plans/knowledge-graph-integration/future/ontology-integration-strategy.md) | **Widen.** Add JSON-LD GitHub Release consumption as a candidate alongside npm package and git submodule. Add a watchlist note for the SPARQL endpoint roadmap item. |
| [kg-alignment-audit.execution.plan.md](../plans/knowledge-graph-integration/current/kg-alignment-audit.execution.plan.md) | **Leave alone.** The audit's Phase 0 scope lock will independently re-read the ontology from first principles. This addendum's findings should be available as context but should not pre-empt the audit's own methodology. |
| [oak-ontology-graph-opportunities.strategy.md](../plans/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md) | **Narrow framing caveat.** Keep the search-first framing as a repo-local optimisation only, with direct ontology use as the baseline and platform choice still open. |

## Closing Position

The official ontology is already useful enough to matter directly inside the MCP
server, the search stack, and the repo's internal QA/governance surfaces.
Search remains an important entry point, but it should not define the scope of
what the ontology is for. The best current path is:

1. compose official ontology structure into MCP orientation
2. publish a small direct `oak-kg-*` surface family
3. project the stable slices into search where joins are already defensible
4. use the alignment audit to decide when deeper joins or graph-native features
   are actually justified

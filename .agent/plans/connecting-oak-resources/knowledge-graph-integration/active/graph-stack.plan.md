---
name: "Graph Stack — Topology and Foundation Increment"
overview: "Establish a layered, standards-based graph capability for Oak — seven active graph workspaces plus one deferred — with the foundation increment ingesting the Oak Curriculum Ontology Threads graph end-to-end as the first attached corpus. Reserves space for every layer in `.agent/research/graph-library.research.md` and provides the spine that subsequent graph-shaped work attaches to."
status: active
graph_layer: substrate
graph_portfolio_index: "../../../graph-portfolio-index.md"
parent_plan: "../active/open-education-knowledge-surfaces.plan.md"
first_graph_work: "Oak Ontology Threads proof in graph-corpus-sdk: enumerate curric:Thread and resolve inverse curric:includesThread Unit lookup with a tiny fixture-backed test."
sibling_plans:
  - "graph-query-layer.plan.md"
  - "oak-kg-threads-surface.plan.md"
  - "../active/graph-resource-factory.plan.md"
  - "../active/misconception-graph-mcp-surface.plan.md"
  - "../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md"
  - "../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md"
specialist_reviewer: "architecture-expert-betty, architecture-expert-fred, architecture-expert-barney, type-expert, code-expert, test-expert, docs-adr-expert, assumptions-expert"
isProject: true
todos:
  - id: ws0-topology-adr
    content: "WS0: ADR-173 + ADR-179 ratified Accepted 2026-05-11 (Sparking Charring Ash session). Reviewer absorption complete (architecture-expert-betty, architecture-expert-fred, assumptions-expert, architecture-expert-barney PROMOTION-READY verdict). Supersession/coordination map recorded inside ADR-173."
    status: completed
  - id: ws1-graph-core-scaffold
    content: "WS1.1: Scaffold packages/core/graph-core workspace. LANDED at commit ad2abb69 (2026-05-12, Celestial Transiting Satellite / claude / opus-4-7-1m / 9bc8e3). 18 files +275/-1. All acceptance items (a)–(k) satisfied; three reviewers APPROVE (config-expert, architecture-expert-fred, test-expert). One discovery: depcruise `no-orphans` rule fires on pre-declared empty sub-path barrels; resolved by extending `.dependency-cruiser.mjs` pathNot list with `graph-core/src/index\\.ts$` and `graph-core/src/(term|dataset|jsonld|canon|vocab)/index\\.ts$`, mirroring the existing oak-sdk-codegen sub-path-export exception. Add this depcruise registration to the canonical scaffold checklist for future cycles (WS2.1, WS3.1, WS4.1). Config-expert nit (non-blocking): eslint.config.ts `*.config.ts` block uses string-literal `'./tsconfig.json'` instead of the resolved `wsTsProject` constant — fix opportunistically in a later cycle. Original acceptance text retained in plan history. (Files mirror packages/core/result/ with two divergences — multi-entry tsup + six pre-declared sub-path exports `.` plus `./term`, `./dataset`, `./jsonld`, `./canon`, `./vocab` — and the five required additions: `pnpm-workspace.yaml` explicit registration, `knip.config.ts` workspace entry, `tsconfig.lint.json`, staged `pnpm-lock.yaml`, `.dependency-cruiser.mjs` no-orphans exception. `coreBoundaryRules` apply on `src/**/*.ts` per ADR-154. README cites ADR-173/179 by number only. Zero tests; first paired bundle lands in WS1.2 per the atomic-landing invariant.)"
    status: completed
    sub_increment: 1a
  - id: ws1-rdf-term-quad
    content: "WS1.2: RDF Term hierarchy + Quad type with structural equality. LANDED at commit 1885fbcf (2026-05-12, Starlit Scattering Moon / claude / opus-4-7-1m / edd1fb). 3 files +443/-2 (src/index.ts, src/term/index.ts, src/term/index.unit.test.ts). RDF/JS-aligned discriminated union (NamedNode | BlankNode | Literal | DefaultGraph | TripleTerm) + Quad; TripleTerm admitted in object position only per RDF 1.2 Working Draft; Literal carries language + base direction + datatype; TripleTerm carries `value: ''` for RDF/JS Data Model conformance (absorbed from type-expert APPROVE-WITH-NITS verdict to anticipate WS1.3 DatasetCore). Free-function `equals` dispatched through a per-kind checker array — cast-free (passes `@typescript-eslint/consistent-type-assertions`), each branch under complexity 8, recurses into Literal datatype + TripleTerm children + Quad components. 18 unit tests, all green. Root barrel re-exports as named exports (no `export *`); sub-path `@oaknational/graph-core/term` remains the preferred entrypoint per ADR-179. 77/77 turbo gates green; full commit-queue protocol followed (intent enqueued, record-staged, verify-staged, pre_commit, complete, claim closed). Atomic-landing invariant satisfied: product + tests in one commit. Next executable cycle: WS1.3 DatasetCore-compatible interface."
    status: completed
    depends_on: [ws1-graph-core-scaffold]
    sub_increment: 1a
  - id: ws1-dataset-core
    content: "WS1.3: DatasetCore-compatible interface (RDF/JS aligned) plus DataFactory-style Term constructors (namedNode, blankNode, literal, defaultGraph, tripleTerm, quad). LANDED at commit 87e21125 (2026-05-12, Lofty Vaulting Summit / codex / GPT-5 / 019e1c). DatasetCore supports add/delete/has/match, iterable, size, structural Quad equality, duplicate suppression, and independent match results. DataFactory was extracted into the new ./data-factory sub-path after architecture-expert-betty APPROVE-WITH-CONDITIONS; package exports, tsup multi-entry, README, and depcruise pathNot were updated in-cycle because ./data-factory was not pre-declared by WS1.1. Type-expert nits absorbed/deferred: match parameters allow undefined through optional params; literal string modifier remains language-only with a WS1.6 TODO for datatype-IRI ergonomics. Atomic-landing invariant satisfied: product + tests + scaffold registrations in one commit."
    status: completed
    depends_on: [ws1-rdf-term-quad]
    sub_increment: 1a
  - id: ws1-jsonld-processor
    content: "WS1.4: JSON-LD 1.1 processor wrapper — LANDED at commit 95f42cb7 (2026-05-12, Fiery Igniting Furnace / codex / GPT-5 / 019e1d). Added a versioned jsonld.js v9 adapter under src/jsonld/ with expand, compact, and frame APIs, typed error handling, a no-I/O remote-context guard, a typed native runtime/options wrapper, and split unit/integration tests for deterministic SKOS expansion/compaction/framing. Reviewer blockers resolved before commit: test classification split, graph-core no-I/O remote-context guard, removal of Oak-specific semantics from graph-core fixtures, narrowed jsonld.js v9 wording, and typed runtime/options proof. Oak-specific pinned Threads raw-import proof was intentionally not landed in graph-core; keep the §Test discipline invariant #8 real-corpus proof routed to graph-corpus-sdk / WS4.2 once the pinned raw import exists."
    status: completed
    depends_on: [ws1-dataset-core]
    sub_increment: 1a
  - id: ws1-canon
    content: "WS1.5 (renumbered from WS1.6): RDF dataset canonicalisation via rdf-canonize (RDFC-1.0; URDNA2015 is the deprecated alias and MUST be rejected by the wrapper via rejectURDNA2015: true) wrapped inside src/canon/. Acceptance: deterministic identical hash for two datasets ingested in different orders but identical logical content (test fixture MUST include blank nodes — RDFC-1.0's load-bearing complexity is blank-node relabelling, pure-IRI fixtures give false confidence); idempotent re-canonicalisation; type-level test that canon output preserves Dataset shape. One cycle, one commit. Inherited from WS1.2: per-kind checker-array dispatch applies where structural equivalence dispatches on Term variant inside the canon wrapper's internal helpers. Reviewer flags: type-expert (input/output shape of rdf-canonize wrapper; literal preservation), test-expert (deterministic test design — same logical content, different ingestion order → identical hash, no false-negatives from ordering).\n\nDesign absorbed from pre-implementation review (2026-05-13, Quiet Stalking Mirror; reviewers: code-expert APPROVE-WITH-NITS, assumptions-expert GO-WITH-CONDITIONS, architecture-expert-betty GO-WITH-RESHAPE): Three-file layout src/canon/{runtime.ts, canonicalize.ts, index.ts} mirroring src/jsonld/ precedent. runtime.ts exposes typed CanonizeRuntime interface + const singleton (no native rdf-canonize types re-exported through any barrel; NQuads parser output never leaks past runtime.ts). canonicalize.ts returns Promise<Result<CanonicalizedDataset, CanonicalizationError>> where CanonicalizedDataset = { dataset: DatasetCore; canonicalNQuads: string; hash: string } — cohesive single canonical-form concept, all three produced in one pass. Doctrinal rules (owner-stated 2026-05-13): no aliases (rejectURDNA2015: true, hardcoded algorithm 'RDFC-1.0'); no fallbacks (no default algorithm branch, no inputFormat string-parsing branch, no default hash fallback); fail fast and hard with helpful error message (every error carries kind + adapter-specific message naming failing step + native cause); replace old with new (URDNA2015 references replaced with RDFC-1.0 in this plan and in code; no parenthetical alias text retained). Hash: SHA-256 via node:crypto (pure compute, allowed under no-real-IO graph-core constraint which targets network/disk only). Round-trip path: rdf-canonize canonical N-Quads → rdf-canonize NQuads.parse → map every parsed term through data-factory helpers (literal() guarantees direction: '' default per RDF 1.2 Term shape — code-expert's load-bearing nit). Tests (atomic-landing with product code): (1) deterministic-hash-across-orders with blank-node fixture; (2) idempotent re-canonicalisation; (3) type-level satisfies Dataset-shape preservation; (4) helpful-error path on malformed quad input; (5) URDNA2015-alias rejection proof.\n\nLANDED 2026-05-20 at ebd0e8dc (Stormy Plumbing Atoll / claude / opus-4-7-1m / 2e2764). Lockfile blocker cleared (43-file dirty slice no longer present). 5 atomic tests + 2 absorbed-from-test-expert-review (reparse_failed path, reconstruction_failed path) + 1 absorbed (sha256 hash <-> canonical N-Quads consistency proof) = 7 tests total, all green. Reviewer dispatch (code-expert APPROVE-WITH-NITS, type-expert SAFE, test-expert IMPROVEMENTS-RECOMMENDED). Five under-disposed findings carry forward in agentic-engineering-enhancements thread record (D1 typed throws, D2 never-proof exhaustiveness, N1 utf8 arg, N2 ambient algorithm over-correction, N3 unrelated to canon — WS0 ledger Class B). N2 specifically is a canon follow-up: ambient declaration in rdf-canonize.d.ts narrowed algorithm to 'RDFC-1.0' against type-expert verdict — revert restoring algorithm: string is owner-direction-pending."
    status: completed
    depends_on: [ws1-dataset-core]
    sub_increment: 1a
  - id: ws1-vocab-registry
    content: "WS1.6 (renumbered from WS1.7): Vocabulary registry data tables. LANDED at commit 3add41f9 (2026-05-21, Uplifted Swooping Wing / claude / opus-4-7-1m / 8d9999). Seven standard W3C/community vocabularies shipped (RDFS, SKOS, PROV-O, DCTERMS, OWL, SHACL, schema.org); file-per-vocabulary layout under src/vocab/; every entry constructed via DataFactory.namedNode() for single canonical construction path (verdict ratified against literal-object alternative under long-term-architectural-excellence frame); byIri(iri: string) reverse-lookup returns NamedNodeTerm | undefined; @oaknational/type-helpers added as dep for typeSafeValues. 20 unit tests covering forward namespace access (one type-level + runtime per vocabulary), reverse lookup hit/miss + round-trip invariant, cross-namespace collision invariant; type-level acceptance test asserts RDFS.label.value is the literal type 'http://www.w3.org/2000/01/rdf-schema#label'. 83/83 turbo pre-commit gates green. CURRIC (Oak Curriculum Ontology) and EEF custom IRIs deferred to follow-on cycles tied to WS4.2 (where source IRIs are pinned from the oak-curriculum-ontology .ttl) and the EEF corpus plan respectively; file-per-vocabulary layout makes additive landing zero-cost. Atomic-landing invariant satisfied: product + tests + dep in one commit. Original cycle text retained in plan history."
    status: completed
    depends_on: [ws1-dataset-core]
    sub_increment: 1a
  - id: ws2-ingest-scaffold
    content: "WS2.1: Scaffold packages/libs/graph-ingest workspace. LANDED at commit 0f895070 (2026-05-12, Radiant Illuminating Twilight / codex / GPT-5 / 019e1c), after hook tooling unblock 42f2e721 repaired local commitlint resolution. Workspace registered in pnpm and knip; pnpm-lock refreshed; six reserved sub-path barrels added (`strict-jsonld`, `jsonld-compatible`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`); real commit hook passed staged prettier, staged markdownlint, shell lint, full turbo type-check/lint/test, prevent-accidental-major-version, and commitlint. **Inherited scaffold checklist** (from WS1.1 + WS1.2; canonical for every future graph workspace scaffold): pnpm-workspace.yaml explicit registration, knip.config.ts workspace entry, tsconfig.lint.json, staged pnpm-lock.yaml, .dependency-cruiser.mjs no-orphans pathNot exception for every pre-declared sub-path-export barrel (mirrors oak-sdk-codegen + graph-core precedent — absent registration causes six-error orphan failure at pre-commit even when every other gate is green), eslint.config.ts *.config.ts block uses the wsTsProject resolved constant (not the string literal './tsconfig.json'). **Inter-scaffold serialisation invariant**: WS2.1 and WS3.1 are NOT parallel-safe with each other because both write to root monorepo registration files (pnpm-workspace.yaml, root tsconfig.json project references, root package.json). WS3.1 may now proceed after re-checking live root-file state. Reviewer flag was config-expert (scaffold-checklist conformance; same reviewer set as WS1.1)."
    status: completed
    depends_on: [ws1-graph-core-scaffold]
    sub_increment: 1a
  - id: ws2-jsonld-compatible
    content: "WS2.2: jsonld-compatible ingestion mode (JSON with @context/@id/@type or inferable LD shape) plus generic Turtle/SKOS parse-to-dataset. Acceptance: parse a generic SKOS fixture into a Dataset deterministically; parse a small Turtle fixture identifying terms via the DataFactory from WS1.3. Lands the §Test discipline invariant #2 contract test (every emitted edge carries a NamedNode predicate, never a bare string). Reviewer flags: test-expert (fixture quality and round-trip coverage on both jsonld-compatible and Turtle paths), type-expert (parser return type is Dataset over Quad; no leakage of jsonld.js raw types)."
    status: pending
    depends_on: [ws2-ingest-scaffold, ws1-dataset-core]
    sub_increment: 1a
  - id: ws2-source-mapping
    content: "WS2.3: SourceMapping primitives (JSON Pointer for JSON-LD-shaped inputs, JSONPath for tree-shaped inputs). Source path preserved end-to-end on every Quad produced by graph-ingest. **Load-bearing for §Test discipline invariant #3** (Source path preserved) — this cycle ships the contract test alongside the primitive. Acceptance: source-path round-trip test across the jsonld-compatible parser and the Turtle parser; both paths attach a sourcePath referenceable through JSON Pointer. Reviewer flags: type-expert (JSONPointer + JSONPath type shape; tagged-template-vs-runtime trade-off), test-expert (invariant #3 contract test design)."
    status: pending
    depends_on: [ws2-jsonld-compatible]
    sub_increment: 1a
  - id: ws3-project-scaffold
    content: "WS3.1: Scaffold packages/libs/graph-project workspace. LANDED at commit 84bfffa5 (2026-05-21, Uplifted Swooping Wing / claude / opus-4-7-1m / 8d9999). 18 files +312/-0. Workspace registered (pnpm-workspace.yaml, knip.config.ts, .dependency-cruiser.mjs no-orphans pathNot). Three sub-path barrels pre-declared anticipating downstream cycles: ./property-graph (Node/Edge/PropertyGraph types reserved for WS3.2), ./projection (toPropertyGraph reserved for WS3.2 with §Test discipline invariant #6 reconstructability contract), ./adjacency (incoming/outgoing/neighbour primitives reserved for WS3.3). Three-barrel split (rather than co-locating types in projection) keeps adjacency dependency-direction clean: it imports types without depending on projection — adjacency operates on PropertyGraph regardless of how it was constructed. **graph-project added to FOUNDATION_LIB_PACKAGES** in @oaknational/eslint-plugin-standards; boundary tests updated (LIB_PACKAGES, FOUNDATION_LIB_PACKAGES, blockedLibs lists). Inherited scaffold checklist satisfied: pnpm-workspace.yaml registration, knip workspace entry, tsconfig.lint.json, refreshed pnpm-lock.yaml, .dependency-cruiser.mjs no-orphans pathNot for the three barrels, eslint.config.ts wsTsProject resolved constant. Inter-scaffold serialisation invariant honoured — landed after WS2.1 graph-ingest scaffold (0f895070). 83/83 turbo pre-commit gates green; full root build + test + lint green. Zero tests this cycle — scaffold has no product code; first paired bundle lands in WS3.2 per the atomic-landing invariant. After this cycle, the WS2.2 ↔ WS3.2 parallel pair opens (first parallel graph tooling work; intra-vendor; multi-vendor open of this thread still forbidden until WS3.3 lands)."
    status: completed
    depends_on: [ws1-graph-core-scaffold, ws2-ingest-scaffold]
    sub_increment: 1a
  - id: ws3-property-graph
    content: "WS3.2: toPropertyGraph projection (nodes with labels/properties; edges with labels/properties) over a Dataset. LANDED at commit abe6fcb3 (2026-05-21, Foamy Charting Fjord / claude / opus-4-7-1m / 86dbd1). 9 files +635/-17. Paired forward (toPropertyGraph) and reverse (fromPropertyGraph) projection in `src/projection/`; PropertyGraph + PropertyGraphNode + PropertyGraphEdge + *Property typed surfaces in `src/property-graph/` adapted from research §11 with typed Term references rather than the research sketch's `string`/`Record<string, unknown>` shape; intra-package `src/projection/rdf-vocab.ts` owns the rdf:type IRI constant. Projection scope declared in TSDoc: default-graph quads only, TripleTerm-object quads filtered (Inc.2 surface), rdf:type with NamedNode object → label, rdf:type with BlankNode object → edge, Literal object → property, other IRI-object → edge with target node materialised. 11 vitest cases including the §Test discipline invariant #6 round-trip on a mixed in-scope fixture (multi-label + datatype/lang/string Literal properties + IRI→IRI + IRI→BlankNode + BlankNode→IRI edges + parallel edges), per-shape behaviour, named-graph drop, TripleTerm drop, rdf:type-with-BlankNode-edge fallback, empty-dataset boundary, and reverse-projection emits default-graph-only. Reviewers absorbed in-cycle: architecture-expert-betty GO-WITH-CONDITIONS (extracted duplicated RDF_TYPE_IRI string literal into `src/projection/rdf-vocab.ts`); test-expert APPROVE-WITH-NITS (added rdf:type-with-BlankNode-object-becomes-edge fallback test + clarifying comment in named-graph drop test about filter-before-materialise ordering). **Inc.2 follow-ups** for the GraphDocument retrospective-review cycle (ADR-173 §Increments row 2): (a) replace `src/projection/rdf-vocab.ts` with import from `@oaknational/graph-core/vocab` once RDF core namespace vocab file lands (WS1.6 deliberately deferred RDF namespace); (b) populate PropertyGraphEdge.properties from triple-as-term annotations when that surface activates. **Pre-commit hook observation** (recurrence of the staged-only-gates P0 defect): first commit attempt blocked by peer's WIP `agent-tools/src/collaboration-state/comms-use-cases.ts` at 415 lines (max-lines 250); file not in this commit's staged bundle. Re-attempt ~30s later passed after peer refactored to 222 lines. Lucky-timing pass; longer peer-intermediate windows would have blocked indefinitely. Original cycle text retained in plan history. (Atomic-landing invariant satisfied; intra-vendor parallel pair WS2.2 ↔ WS3.2 — WS2.2 remains in progress with Fiery Firing Cinder on a separate thread workflow.)"
    status: completed
    depends_on: [ws3-project-scaffold, ws1-dataset-core]
    sub_increment: 1a
  - id: ws3-adjacency
    content: "WS3.3: Property-graph adjacency primitives (incoming/outgoing/neighbours) over the projected nodes-and-edges from WS3.2. **MUST NOT duplicate DatasetCore.match() semantics** — adjacency is node→node traversal over the property-graph projection; quad-pattern matching stays on Dataset (WS1.3). The Threads adapter (Inc.1b WS4.2) may choose either surface for its inverse-edge lookup; both must be available because they are distinct conceptual seams (research §10 fluent API on Dataset vs research §11 projection adjacency on PropertyGraph). Acceptance: adjacency unit tests against a fixture property-graph; type-level test that adjacency operates on PropertyGraph types, not Quad. Reviewer flags: type-expert (iterator API shape), architecture-expert-barney (explicit boundary check: can WS3.3 be safely collapsed into WS3.2 without losing the conceptual seam? If Barney's verdict is collapse-safe per consolidate-at-third-consumer, accept and reduce Inc.1a to 9 remaining cycles)."
    status: pending
    depends_on: [ws3-property-graph]
    sub_increment: 1a
  - id: ws4-graph-corpus-sdk-scaffold
    content: "WS4.1: Scaffold packages/sdks/graph-corpus-sdk workspace with a typed corpus-adapter boundary; no Oak-specific ontology mapping before the SDK boundary exists."
    status: pending
    depends_on: [ws3-adjacency, ws2-source-mapping]
    sub_increment: 1b
  - id: ws4-oak-ontology-thread-adapter
    content: "WS4.2: Oak Curriculum Ontology Threads adapter inside graph-corpus-sdk (generic Turtle/RDF/SKOS parsing via graph-ingest; curric:Thread enumeration and curric:includesThread inverse-edge mapping here); deterministic extraction test against the pinned straight-copy ontology raw import."
    status: pending
    depends_on: [ws4-graph-corpus-sdk-scaffold, ws1-vocab-registry]
    sub_increment: 1b
  - id: ws4-query-proof
    content: "WS4.3: Prove the Oak Curriculum Ontology Threads adapter end-to-end via graph-corpus-sdk's typed query surface (Thread enumeration plus Unit->Thread inverse-edge lookup; no MCP wiring in this cycle — surfacing is a consumer decision, see §Surfacing)."
    status: pending
    depends_on: [ws4-oak-ontology-thread-adapter]
    sub_increment: 1c
  - id: ws4-graph-view-interface
    content: "WS4.4 (added 2026-05-21 amendment — Inc.1d pull-forward): `GraphView<TNode, TEdgeType extends string>` polymorphic interface authored inside `graph-core` (under a new `./graph-view` sub-path export, following the `./term`, `./dataset`, `./jsonld` precedent in graph-core) — all 7 method signatures complete (`manifest`, `summary`, `getNode`, `enumerateNodes`, `neighbours`, `subgraph`, `findByTag`), `Result<T, E>` discipline from `@oaknational/result` on every fallible operation per `principles.md` §Code Design, `NodeProjection<TNode, Depth extends number = 4>` recursive deep-path type with the array-stop constraint, `NodeFilter<TNode>` with full `FieldPredicate<TFieldValue>` arm set including the array-element-membership arm required by tagged corpora. The full interface contract ships at Inc.1d even though only `subgraph` and `manifest` will be implemented by the EEF adapter at WS4.5; this preserves the contract surface so the remaining 5 EEF operations (Inc.3) and the prerequisite/misconception adapters (Inc.3) land into a stable type without subsequent reshape. Atomic-landing pair: interface file + the load-bearing T7a `DeepKeyPath` compile-time smoke-test asserting (a) `'headline.impact_months'` is a valid path member, (b) `'school_context_relevance.implementation_requirements.cpd_intensity'` is a valid member at depth 3, (c) `'tags.0'` and `'tags[number]'` are NOT valid members (array-stop constraint). Reviewer flags: type-expert (load-bearing for the deep-path discipline; T7a is the regression guard for array-stop), code-expert (Result-pattern consistency vs `principles.md`), architecture-expert-betty (boundary check: does GraphView belong in graph-corpus-sdk or graph-core? — **RESOLVED 2026-05-21 to graph-core**: ADR-041 dependency-direction rules forbid `packages/libs/` packages from importing from `packages/sdks/`, so a future practice-graph consumer at Inc.4 (a lib-tier or agent-graph tenant) cannot reach a corpus-sdk-resident interface; importing `graph-corpus-sdk` purely to obtain one type would be incoherent. `graph-core` is the dependency-correct home for tier-agnostic graph contracts that non-corpus consumers must implement, and the sequence-first stance treats this placement as permanent rather than provisional. The adapter in `graph-corpus-sdk` imports the interface from `graph-core`, which is dependency-direction-correct since `packages/sdks/` may import from `packages/core/`). The interface specification is owned by the `graph-query-layer.plan.md` plan body (T2, supporting types, FieldPredicate arms including array-element-membership, NodeProjection depth-bound, SubgraphResult shape) and is consumed verbatim by this cycle."
    status: pending
    depends_on: [ws4-graph-corpus-sdk-scaffold]
    sub_increment: 1d
  - id: ws4-eef-strands-adapter
    content: "WS4.5 (added 2026-05-21 amendment — Inc.1d pull-forward): `EefStrandsGraphView` adapter inside `graph-corpus-sdk` implementing the WS4.4 `GraphView<EefStrand, EefEdgeType>` interface (imported from `graph-core` per the WS4.4 placement resolution). **Live-vs-stub criterion**: `subgraph` is live at Inc.1d because it is the one operation that the gate-1a `eef-explore-evidence-for-context` tool composes against; `manifest` is live independently of any specific gate-1a consumer because manifest is the graph's own truth-telling contract (version, scale, sparse-relations surface) — shipping it as a stub would mean the substrate floor at Inc.1d cannot answer 'what graph am I querying?', which is a categorically different defect from 'I cannot yet rank strands'. The remaining 5 operations are stubbed because no gate-1a consumer composes against them and they have no standalone truth-telling role at the manifest's level. **Live operations**: `subgraph` (bounded BFS traversal over `related_strand` + `related_guidance_report` edges, returns `SubgraphResult<EefStrand>` with deterministic empty-result behaviour for strands whose `related_strands` field is absent), `manifest` (returns `{ node_count: 30, edge_types, edge_count, version: meta.data_version, last_updated: meta.last_updated, schema_hash, strands_without_relations: readonly string[] }` — the sparse-relations surface is non-optional per the assumptions-expert round 2026-04-30 verdict, front-loading the 13-strands-without-relations knowledge so consumers avoid pointless `subgraph`/`neighbours` calls). **Stub operations** (return `Result.err` with a typed `NotImplementedYet` variant; signatures complete in the interface so type-check passes): `summary`, `getNode`, `enumerateNodes`, `neighbours`, `findByTag`. **Substrate dependencies**: WS4.1 (`graph-corpus-sdk` scaffold), WS3.3 (`graph-project` adjacency primitives — used by `subgraph` BFS), and consumes the Zod-validated loader authored in the EEF corpus plan (sector-engagement/eef T2). **Disjoint from Threads**: no `graph-ingest` participation, no Turtle/SHACL/JSON-LD ingestion path, no ontology IRI identity (EEF strands use the corpus-native `strands[].id` as canonical node identity per `graph-query-layer.plan.md` Phase B finding 2; the `id → strand_id` rename happens at the corpus boundary in the corpus plan, not in this adapter). Phase B findings 5 (related_strands optional, absent on 13/30) and 6 (related_guidance_reports as `{title, url}` objects on 7/30 strands) are load-bearing for the adapter's edge-derivation logic; the adapter treats absent as empty and `subgraph` from those strands returns single-node results deterministically. Reviewer flags: type-expert (NotImplementedYet variant typing on the 5 stub operations — Result<T, NotImplementedYet> shape that satisfies the GraphView interface without runtime cost), test-expert (subgraph correctness against the eef-toolkit.json fixture across both connected and isolated strands), architecture-expert-betty (sparse-relations surface placement on manifest, not as a separate operation), assumptions-expert (verify the carry-over of the 2026-04-30 sparse-relations verdict still applies). Atomic-landing pair: adapter + tests against eef-toolkit.json fixture covering: (a) connected-strand subgraph at depth 2 produces bounded `{nodes, edges}`, (b) isolated-strand subgraph returns `{nodes: [root], edges: []}` deterministically, (c) manifest returns exact `strands_without_relations` list matching the 13 named strands, (d) stub operations return typed `NotImplementedYet` Result without throwing. **Parallel-safe with WS4.2/WS4.3** (Threads adapter / query-proof) under the inter-adapter parallelism inherited from the WS2.2 ↔ WS3.2 precedent: disjoint file scopes, independent identity schemes, no cross-corpus join in Inc.1. **FieldPredicate.contains semantic-collision obligation (carried from `graph-query-layer.plan.md` Phase 2 § T2 Semantic collision note, code-expert 2026-05-21 review NIT propagation)**: when `enumerateNodes` is implemented for EEF at graph-stack Inc.3 (not at this Inc.1d cycle — `enumerateNodes` is a `NotImplementedYet` stub at WS4.5), the predicate dispatcher must inspect each field's runtime value type to disambiguate the structurally-identical `{ readonly contains: string }` shape between the string-arm (substring match) and the array-arm (element membership). This obligation is recorded here so it travels with the EEF adapter into Inc.3 implementation and is not lost between plans. **findByTag Result-discipline (code-expert 2026-05-21 review CONCERN absorbed)**: the GraphView interface `findByTag` signature was updated to `Result<readonly TNode[], FindByTagError>` (graph-query-layer.plan.md Phase 2 § T2) so the WS4.5 stub for `findByTag` uniformly returns `Result.err` with the `NotImplementedYet` variant alongside the other 4 stub operations; no special-casing of `findByTag` is required."
    status: pending
    depends_on: [ws4-graph-view-interface, ws3-adjacency]
    sub_increment: 1d
  - id: ws5-coordination-amendments
    content: "WS5: Amend graph-query-layer.plan.md, oak-kg-threads-surface.plan.md, practice-graph-payoff-peak-pilot.plan.md, and the parent open-education-knowledge-surfaces.plan.md to reference this spine."
    status: pending
    depends_on: [ws4-query-proof, ws4-eef-strands-adapter]
  - id: ws6-docs-propagation
    content: "WS6: README updates (collection, monorepo, contributing); LICENCE-DATA.md ontology section update; Mark Hodierne author addition. ADR-123 is not amended because this increment ships no MCP primitives."
    status: pending
    depends_on: [ws5-coordination-amendments]
  - id: ws7-quality-gates
    content: "WS7: Full quality gate chain on the integrated foundation increment."
    status: pending
    depends_on: [ws6-docs-propagation]
  - id: ws8-adversarial-review
    content: "WS8: Specialist reviewer dispatch (assumptions, betty, fred, barney, type, mcp, docs-adr); document findings; create follow-on if BLOCKER."
    status: pending
    depends_on: [ws7-quality-gates]
---

# Graph Stack — Topology and Foundation Increment

**Last Updated**: 2026-05-21 (Torrid Glowing Flame / claude / opus-4-7-1m / 5ab0ec) — **Inc.1d sequencing pull-forward** authored under owner direction. The EEF strands adapter is added as a concurrent Inc.1 tenant inside `graph-corpus-sdk` alongside the Threads adapter (per ADR-173 §First-wave ingestion scope 2026-05-21 amendment). Two new todos added: WS4.4 (`GraphView<TNode, TEdgeType>` polymorphic interface + T7a `DeepKeyPath` compile-time smoke-test) and WS4.5 (`EefStrandsGraphView` adapter implementing `subgraph` + `manifest` for EEF; remaining 5 operations typed as `NotImplementedYet` stubs satisfying the full interface contract). WS5 coordination-amendments dependency expanded to require both Threads (WS4.3) and EEF (WS4.5) adapter completion before Inc.1 closes. Substrate dependencies for WS4.5 are WS4.1 (corpus-sdk scaffold) + WS3.3 (adjacency primitives); EEF loader is corpus-local Zod and does NOT participate in `graph-ingest`. Parallel-safe with Threads adapter under inter-adapter parallelism inherited from the WS2.2 ↔ WS3.2 precedent. Architectural commitments shipping at Inc.1d, all together as the substrate floor for gate-1a: full GraphView interface; DeepKeyPath array-stop discipline; Result<T, E> on fallible ops; sparse-relations surface on manifest; `_meta` source attribution per ADR-157; ADR-175 freshness governance. The consumer-side gate-1a (first user-facing EEF MCP feature) lives in `graph-mvp-arc.plan.md`, not in this plan. Previous update: 2026-05-21 (Foamy Charting Fjord / claude / opus-4-7-1m / 86dbd1) — WS3.2 graph-project toPropertyGraph round-trip projection LANDED at `abe6fcb3` (9 files, +635/-17). Inc.1a cycle count after this landing: 3 remaining (WS2.2, WS2.3, WS3.3). Cycle landed under the empirical WS2.2 ↔ WS3.2 parallel pair experiment — first parallel graph tooling work on this thread; intra-vendor (two Claude opus-4-7-1m sessions, shared physical checkout, coordinating via active-claims + comms on disjoint workspace trees). WS2.2 remains in progress with Fiery Firing Cinder (40c178). Pre-commit hook observed the staged-only-gates P0 defect recurrence (peer's WIP file at 415-line lint failure blocked initial commit; ~30s later passed after peer refactor). Previous update: 2026-05-21 (Uplifted Swooping Wing / claude / opus-4-7-1m / 8d9999) — WS1.6 vocab registry LANDED at `3add41f9`; WS3.1 graph-project scaffold LANDED at `84bfffa5`. Parallel-pair boundary reached: WS2.2 ↔ WS3.2 are now dispatchable as the first parallel graph tooling work — disjoint workspace trees, both depend on landed WS1.3 (DatasetCore) and their respective landed scaffolds. Single-agent through both is the explicitly preferred default; multi-agent intra-vendor parallel dispatch is owner-directed only and requires worktree-isolation verification on the candidate base SHA. Multi-vendor open of this thread remains forbidden until WS3.3 lands. WS1.6 verdict ratified for namedNode-at-every-entry against literal-object alternative under owner-stated long-term-architectural-excellence frame; CURRIC + EEF deferred to WS4.2 / EEF corpus plan when source IRIs are pinned. Previous update: 2026-05-20 (Stormy Plumbing Atoll / claude / opus-4-7-1m / 2e2764) — WS1.5 RDFC-1.0 canon LANDED at `ebd0e8dc`. Inc.1a cycle count after that session: 6 remaining (WS1.6, WS2.2, WS2.3, WS3.1, WS3.2, WS3.3). Reviewer findings carry forward in agentic-engineering-enhancements thread under-disposed list. Previous update: 2026-05-13 (Quiet Stalking Mirror / claude-code / opus-4-7-1m / fe8a4f) — WS1.5 design pre-implementation review absorbed (code-expert APPROVE-WITH-NITS, assumptions-expert GO-WITH-CONDITIONS, architecture-expert-betty GO-WITH-RESHAPE); owner-stated doctrinal rules recorded inside `ws1-canon` content (no aliases, no fallbacks, fail fast and hard with helpful error, replace old with new); URDNA2015 → RDFC-1.0 plan-text remediation applied in `ws1-canon` and in §Build-vs-Buy Attestation. WS1.5 implementation NOT landed in this session — blocked by uncoordinated 43-file dirty slice (packageManager bump pnpm@10.33.4→@11.1.1, every workspace package.json, pnpm-workspace.yaml, pnpm-lock.yaml, SDK codegen artefacts) that prevents adding `rdf-canonize` as direct graph-core dependency without lockfile collision. Sequencing comms event `b9961327` posted to Mossy Blossoming Canopy; no reply received within session. Previous refresh: 2026-05-13 (Solar Gliding Twilight / codex / GPT-5 / 019e1d) — continuity repair only. WS1.4 JSON-LD processor is now recorded as LANDED at `95f42cb7`; WS1.6 vocab-registry prep note landed at `f36f98b1`; coordination closeout state landed at `0d6f080a`. WS1.4's Oak Threads real-corpus proof remains routed to graph-corpus-sdk / WS4.2 rather than graph-core. Previous refresh: 2026-05-12 (Radiant Illuminating Twilight / codex / GPT-5 / 019e1c) — WS2.1 graph-ingest scaffold LANDED at `0f895070` after hook tooling unblock `42f2e721`; 2026-05-12 (Clouded Vaulting Squall / claude / opus-4-7-1m / 866472) — Inc.1a remaining cycles re-planned holistically with WS1.4+WS1.5 collapsed, WS1.8 deferred to Inc.2, inter-scaffold serialisation recorded, and WS3.3 adjacency scope sharpened.
**Status**: 🟢 ACTIVE — promoted current/ → active/ 2026-05-11 after ADR-173 + ADR-179 Status: Proposed → Accepted ratification. WS1.1 landed at `ad2abb69`; WS1.2 at `1885fbcf`; WS1.3 at `87e21125`; WS1.4 at `95f42cb7`; WS2.1 at `0f895070`. Inc.1a continues under the 2026-05-12 re-plan: WS1.8 GraphDocument deferred to Inc.2; inherited patterns and reviewer flags recorded inline. Next executable choices: WS1.5 canon, WS1.6 vocab-registry implementation after the prep-note owner decisions are respected, WS2.2 jsonld-compatible ingestion, or WS3.1 graph-project scaffold after live root-file check.

**🛑 PR #108 MERGE BLOCKER (2026-05-21, Feathered Circling Horizon; partial relaxation 2026-05-22)**: PR #108 (`feat/mcp-graph-support-foundation` → `main`) carries the entirety of the Inc.1a substrate landings above plus the Inc.1d planning amendment-set. The branch is currently **failing the SonarCloud Quality Gate** (the `new_security_hotspots_reviewed` condition has been advanced to 100% during the 2026-05-22 team session, but residual new issues + 6.0% new-code duplication remain); CodeQL alert #90 has been dismissed (criterion 3 pending next CI run). **The PR must not merge until all gate conditions clear.** The disposition strategy, per-finding ledger, and execution plan live in [`../current/pr-108-snagging.plan.md`](../current/pr-108-snagging.plan.md) (status `planning`, type `quality-fix`, 10 cycles across 3 phases — Cycles 1-4.4 landed 2026-05-22). Per the `never-disable-checks` rule and the Sonar Disposition Policy, the snagging plan resolves findings by per-instance disposition (FIXED / FALSE_POSITIVE / SAFE) and policy-aligned mechanical exclusion — never by weakening the gate.

**2026-05-22 concurrent-execution relaxation (owner direction)**: substantive new graph implementation work (WS2.2, WS2.3, WS3.3, WS4.1, WS4.4, WS4.5) is now **explicitly authorised to proceed on this branch in parallel with the PR-108 snagging stream**, under the file-disjointness invariant established in the branch-concurrency manifest. The "appended only with explicit owner direction" clause from the prior framing is now satisfied. Merge ordering is decoupled from authoring: the work may land into PR-108 (Path 3: single PR scope grows), into a new branch off this one rebased onto main after PR-108 merges (Path 2), or into a fresh branch off main once PR-108 merges (Path 1). The path selection is currently undecided and is owner-class.

**Branch-state cross-reference**: any coordinating agent picking up this branch reads
[`../current/branch-concurrency.md`](../current/branch-concurrency.md) first — it names every concurrent work-stream, the file-disjointness matrix, the dependency graph, and the open structural questions (PR-108 path selection, PDR-063..066 routing, ff1/ff2 owner actions, Cycle 8/10 contingencies).
**Scope**: Establish a layered, standards-based graph capability for Oak as a backbone of seven active graph workspaces plus one deferred, then ship the foundation increment ingesting the Oak Curriculum Ontology Threads graph end-to-end as the first attached corpus.

---

## Strategic Priority

Graphs are now a first-class concern of this repository. The single coherent capability is:

> **Oak ships a layered, standards-based graph capability that knits curriculum content, curriculum structure, and pedagogical evidence into a navigable, citation-grade, AI-accessible graph; demonstrates the same primitive on Oak's own engineering practice; and positions the stack as open-education infrastructure.**

This plan establishes the topology that capability lives in, and ships the smallest end-to-end slice that proves it.

The plan reserves explicit workspace homes for every layer in
[`.agent/research/graph-library.research.md`](../../../../research/graph-library.research.md).
No layer is foreclosed; every layer either ships in this increment or is
sequenced into a named follow-on increment.

---

## Context

### Today's State

The repository has *no graph infrastructure* in the substrate sense — what exists is graph-shaped MCP exposure inside `oak-curriculum-sdk` (the resource factory plus the prerequisite, misconception, and thread-progressions adapters) and the queued `GraphView` query-layer plan. Each is a property graph by construction, derived deterministically from typed bulk data; none rests on a canonical RDF-compatible model, none uses ontology IRIs as identity, none can compose across corpora without bespoke alignment.

The Oak Curriculum Ontology already publishes RDF/OWL/SKOS/SHACL with stable IRIs and SHACL CI validation, but is consumed only as an *idea* — no current code path ingests its triples directly.

### What Changes

The foundation increment introduces a layered substrate. The Oak Curriculum Ontology Threads graph becomes the first corpus attached to that substrate, giving the MVP's `oak-kg-*` Thread surface a real ontology-backed foundation.
Every subsequent graph-shaped artefact — including the work queued in
[`graph-query-layer.plan.md`](graph-query-layer.plan.md), the eventual
EEF and misconception graph rewrites, the cross-source journeys, and the
Practice graph pilot — attaches to this spine.

The NC knowledge taxonomy is not part of this MVP foundation increment. It remains owned by its own plan and can attach to the substrate later only if the owner promotes that work separately.

### Corpus source authority

Different graph corpora enter the stack through different source-authority
paths:

- Oak Curriculum Ontology data comes from the source-of-truth
  `oaknational/oak-curriculum-ontology` GitHub repository as pinned,
  straight-copy Turtle/SHACL raw material.
- EEF strand data comes from the repository-held EEF Toolkit JSON snapshot,
  which is canonical for implementation until EEF clarifies whether future
  refreshes should come from a public download/API endpoint or direct supply.
- Oak misconception data is constructed inside this repository from Oak bulk
  data as part of bulk-data processing. The misconception graph is generated
  bulk-derived material, not an external raw corpus.

---

## Design Principles

1. **Stable-wire, RDF 1.2-native internals.** The canonical internal data model is RDF 1.2 (triple terms first-class in `graph-core`'s `Term` union; see [`graph-library.research.md` §4](../../../../research/graph-library.research.md)). Wire emission uses stable W3C standards (JSON-LD 1.1, RDF 1.1-compatible quads, SHACL 1.0); triple-term annotations *project* to `RelationshipRecord` on JSON-LD 1.1 emit (research §8). Emerging standards (JSON-LD 1.2, SPARQL 1.2, SHACL 1.2) become adapter upgrades inside `graph-future` driven by named tripwires ([research §19](../../../../research/graph-library.research.md#19-standards-evolution-tripwires) and ADR-173). No tripwire is silently skipped; each becomes a named follow-on plan when triggered.
2. **Ontology identity as the spine.** Adapters in `graph-corpus-sdk` mint or honour Oak Curriculum Ontology IRIs as canonical node identity. Cross-corpus joins are structurally cheap because the join key is shared.
3. **Property-graph as projection, not canon.** The canonical internal model is an RDF-compatible quad dataset. Property-graph nodes/edges are *projections* (per research §11). This preserves migration headroom while keeping the developer-facing API ergonomic.
4. **Enhancement is explicit and inspectable.** Every derived claim — stable ID, predicate mapping, type inference, link detection, relationship record, provenance attribution — is recorded as an `EnhancementRecord` (research §7) with optional confidence. Silent semantic corruption is structurally prevented.
5. **Validation distinguishes structure from meaning.** JSON Schema validates raw input shape; SHACL validates graph semantics. Both live in `graph-validate`; neither replaces the other (research §9).
6. **Framework-vs-consumer separation, strictly.** Per ADR-154: `graph-core`, `graph-jsonld`-equivalent modules, `graph-canon`, and `graph-vocab` carry no consumer knowledge. `graph-ingest`, `graph-enhance`, `graph-validate`, `graph-project` carry general-purpose policy. `graph-corpus-sdk` is the curriculum corpus-specific consumer; `agent-graphs/practice-graph` is the practice-facing consumer outside substrate package tiers.
7. **Public-asset discipline.** Every workspace below `graph-corpus-sdk` is publishable as open-education infrastructure. No Oak-specific identifiers leak into the substrate.

**Non-Goals (YAGNI)**:

- A live serving layer (Neo4j, Stardog, GraphDB). Direct ontology use is the baseline (per `oak-ontology-graph-opportunities.strategy.md`); serving platforms are evaluated only after the direct-use path proves value.
- LLM-derived semantic edges or embedding-based relationships in the substrate. The research's enhancement model permits explicit confidence-tagged inferences; the foundation increment ships only deterministic mappings.
- A new MCP server. The curriculum MCP server consumes `graph-corpus-sdk`; Practice may eventually grow its own internal MCP/CLI surface, but not in this plan.
- SPARQL endpoint exposure. `graph-future` will host a SPARQL adapter when a consumer needs it.
- Whole-repo graphing for Practice. The Practice pilot's curated allow-list discipline is preserved.

---

## Build-vs-Buy Attestation

The substrate depends on three external libraries; each is a deliberate buy.

| Concern | Options surveyed | Decision |
|---|---|---|
| JSON-LD 1.1 processing | (a) [`jsonld.js`](https://github.com/digitalbazaar/jsonld.js) — W3C reference, MIT, full 1.1 spec coverage including framing; (b) `@digitalbazaar/jsonld-document-loader` variants — narrower scope, suitable only when full processor not required; (c) bespoke — rejected. | **Adopt `jsonld.js` as default processor inside `graph-core`'s versioned adapter.** Reference implementation is canonical; the framing operation we need is unique to the full processor. Adapter shape (research §12) lets a leaner alternative slot in later if framing leaves the requirement set. |
| RDF dataset canonicalisation | (a) [`rdf-canonize`](https://github.com/digitalbazaar/rdf-canonize) — Digital Bazaar, BSD-3, RDFC-1.0 spec-aligned (the W3C 2024 REC that supersedes URDNA2015; `rdf-canonize@5` deprecates the URDNA2015 alias and the graph-core wrapper sets `rejectURDNA2015: true` so URDNA2015 fails fast at the boundary); (b) `@rdfjs/dataset` + bespoke RDFC-1.0 implementation — rejected because RDFC-1.0 is a precise normative algorithm with subtle hashing/lexical-ordering invariants; (c) other Comunica canonicalisers — single-author packages with narrower spec coverage. | **Adopt `rdf-canonize` inside `graph-core/canon` module.** Canonicalisation is a precise spec primitive; bespoke is high-risk for a substrate-level invariant on which dataset equivalence depends. |
| SHACL validation | (a) [`rdf-validate-shacl`](https://github.com/zazuko/rdf-validate-shacl) — Comunica family, broad SHACL Core + SHACL-AF support; (b) `shacl-engine` — alternative SHACL processor, narrower constraint coverage at survey time; (c) Comunica's other SHACL packages — overlapping coverage but less production maturity; (d) bespoke SHACL — forbidden by the rule (specification scope is intractable). | **Adopt `rdf-validate-shacl` inside `graph-validate` behind the `ShapeValidator` adapter (research §12 SHACL seam).** Re-evaluate against `shacl-engine` if SHACL 1.2 lands (tripwire #3 in ADR-173). |

No bespoke wrappers. The adapter-shape discipline (research §12) keeps every dependency replaceable behind a versioned interface.

**RDF/JS data-model alignment risk (tracked under tripwire #2)**: our internal `TripleTerm` shape (research §4) is authored ahead of an RDF/JS WG formalisation of RDF 1.2 data-model types. If the eventual published spec differs from ours, `graph-core`'s `Term` union migrates to match — a typed refactor confined to a single workspace, with no cross-workspace blast radius by design. Mitigation today: keep `TripleTerm` minimal (matches the RDF 1.2 abstract syntax exactly, no extras) so divergence is structurally impossible to amplify. See [research §19 — tripwire #2](../../../../research/graph-library.research.md#tripwire-2--rdfjs-wg-formalises-an-rdf-12-data-model-extension).

`assumptions-expert` runs against this attestation pre-ExitPlanMode (see Reviewer Scheduling).

---

## Topology Decision

The graph stack is **seven active graph workspaces plus one deferred**:

| # | Workspace | Tier | Carries (research §13) | Role |
|---|---|---|---|---|
| 1 | `packages/core/graph-core/` | core | `graph-core` + `graph-jsonld` + `graph-canon` + `graph-vocab` | Substrate. Term / Quad / Dataset (RDF/JS-aligned), JSON-LD 1.1 expansion+compaction+framing, RDF dataset canonicalisation, vocabulary registry. Pure, no I/O. |
| 2 | `packages/libs/graph-ingest/` | lib | `graph-ingest` | Six ingestion modes (research §6): `strict-jsonld`, `jsonld-compatible`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`; generic Turtle/SKOS parse-to-dataset support. Source mapping via JSON Pointer + JSONPath. No Oak-specific corpus mapping. |
| 3 | `packages/libs/graph-enhance/` | lib | `graph-enhance` | Stable IRI minting, predicate mapping, type inference, link detection. `EnhancementRecord` discipline (research §7). `RelationshipRecord` migration bridge (research §8). |
| 4 | `packages/libs/graph-validate/` | lib | `graph-validate` | JSON Schema (raw shape) + SHACL (graph meaning) wrappers. Validation report shape stable across SHACL versions (research §9). |
| 5 | `packages/libs/graph-project/` | lib | `graph-project` | Property-graph projection, adjacency-list, neighbours/match/traverse primitives, visualisation/export hooks (research §10, §11). |
| 6 | `packages/sdks/graph-corpus-sdk/` | sdk | (Oak-specific consumer) | Oak's typed corpus adapters: Oak Curriculum Ontology Threads graph, prerequisite, misconception, EEF strands, plus future corpora. **Cross-corpus join primitives.** Uses ontology IRIs as canonical identity. |
| 7 | `agent-graphs/practice-graph/` | agent graph | (Practice-specific consumer) | Markdown-corpus graph for Oak's engineering practice. Built on the same stack, owned adjacent to agent tooling, and wired by the future `agent-graphs/` organisation plan. |
| 8 | (deferred) `packages/libs/graph-future/` | lib | `graph-future` | RDF 1.2 / JSON-LD 1.2/1.3 / SPARQL 1.2 / SHACL 1.2 adapters. **Workspace not created until a consumer needs one of these specs**; the adapter seams (research §12) live inside `graph-core`, `graph-validate`, and `graph-project` from day one. |

This is the topology in full. No layer is missing; no layer is collapsed in a way that forecloses its later activation.

`agent-graphs/practice-graph/` is deliberately adjacent to `agent-tools/`
rather than under `packages/libs/`. It is the seventh active graph workspace: a
practice-facing consumer that proves the substrate over repository memory,
owned by the agent-tooling/practice plan estate. The future organisation/wiring
plan is
[`../../../agent-tooling/future/agent-graphs-workspace-organisation.plan.md`](../../../agent-tooling/future/agent-graphs-workspace-organisation.plan.md).

**Every graph workspace in the topology is transport-agnostic per [ADR-179](../../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md).** None of the graph substrate workspaces ship MCP tool definitions, MCP resource constants, MCP-server registration code, or any HTTP/CLI/transport-shaped code. Surfacing graph capability through any transport — if Oak chooses to do so — is a *consumer-side* concern handled by the existing curriculum SDK MCP module plus the curriculum MCP HTTP app, or by a future consumer workspace that imports `graph-corpus-sdk`. See §Surfacing.

---

## Surfacing — MCP and Other Surfaces

The graph stack is infrastructure. How (or whether) graph capability is surfaced to humans, agents, or other systems is a separate decision tracked outside this plan.

Possible surfaces, none privileged by the topology:

- **In-process library imports** — application code imports `graph-corpus-sdk` directly. Always available; the default for any same-runtime consumer.
- **CLI** — the existing `agent-tools/` workspace exposes commands over `agent-graphs/practice-graph` (per the Practice pilot's existing plan). A future curriculum-side CLI could do the same over `graph-corpus-sdk`.
- **MCP** — at most one consumer surface owns each graph MCP primitive. If Oak chooses MCP exposure, it lives in the existing curriculum SDK MCP module plus the curriculum MCP HTTP app, or in a new sibling that imports `graph-corpus-sdk`. The graph workspaces themselves stay MCP-clean.
- **HTTP/JSON-LD export** — `graph-project` emits JSON-LD profiles for cross-organisation consumption as part of Inc.5 (see §Increments).
- **Search-augmentation** — Oak's Elasticsearch integration may consume `graph-corpus-sdk` to project graph-derived signals into search indices. If the search team requests this, the owner authors a new plan at that point; this plan does not schedule the work.

**Discipline**: no graph workspace ships MCP-shaped code. Tool definitions, resource constants, and registration helpers live with the existing curriculum MCP consumer surface (the SDK MCP module plus HTTP app) or a future app-facing adapter, not with the graph SDK that produces the data. If a graph workspace starts wanting an MCP type or factory, that is the signal to extract a thin consumer adapter workspace — not to leak MCP into the substrate.

The foundation increment ships zero MCP exposure. Oak Curriculum Ontology Threads availability through `graph-corpus-sdk`'s typed query surface is the proof that the substrate works end-to-end. Whether to surface it through the curriculum MCP server is a follow-on decision handled by the MVP slice plan, with or without this spine in flight.

---

## Layer Map (research → workspace)

The mapping is exhaustive against [`.agent/research/graph-library.research.md`](../../../../research/graph-library.research.md):

| Research section | Workspace | Notes |
|---|---|---|
| §1 stable foundation | `graph-core` (vocab + jsonld + canon modules), `graph-validate` (SHACL wrapper) | Every standard in §1 has a home. |
| §2 active state of newer standards | `graph-future` (deferred) + adapter seams across `graph-core`/`graph-validate`/`graph-project` | The seams ship; the workspace is created on first consumer demand. |
| §3 core design position | Plan-level: encoded in §Design Principles above. | Every workspace inherits the stable-first commitment. |
| §4 canonical internal model (Term/Quad/Dataset; GraphNode/GraphEdge/GraphDocument) | `graph-core` | The core types are foundation-increment WS1 deliverables. |
| §5 vocabulary layer | `graph-core/vocab` module | Default registries + Oak Curriculum Ontology + EEF + extension API. |
| §6 ingestion modes | `graph-ingest` | All six modes are supported; the foundation increment ships `jsonld-compatible` plus generic Turtle/SKOS parsing and schedules the other modes into Increment 2 (see §Increments). Oak ontology Thread mapping remains in `graph-corpus-sdk`. |
| §7 enhancement model | `graph-enhance` | `EnhancementRecord` is first-class; `id → strand_id`-style transformations carry provenance. |
| §8 relationship records as migration bridge | `graph-enhance` | `RelationshipRecord` is first-class today; RDF 1.2 triple-term annotation is a `graph-future` adapter target. |
| §9 validation model | `graph-validate` | JSON Schema + SHACL, distinct concerns, both supported. |
| §10 interaction API | `graph-project` (developer-facing surface) + `graph-core` (canonical-model-backed match/traverse) | The fluent API in §10 is the `graph-project` public surface. |
| §11 property-graph projection | `graph-project` | `toPropertyGraph()`, adjacency, Cytoscape/Graphology-friendly export hooks. |
| §12 future migration strategy | `graph-future` (deferred) + adapter seams | Versioned `JsonLdProcessor`, `ShapeValidator`, SPARQL adapter shapes ship from day one. |
| §13 suggested package structure | This topology table | Every package in §13 has a workspace home. |
| §14 design invariants | Test discipline across all workspaces | Every invariant is testable; the foundation increment ships compile-time and runtime tests for the load-bearing ones. |

---

## Increments — Sequenced Across the Topology

The full topology activates over seven increments. This plan ships **Increment 1** (foundation). Subsequent increments are sketched here and promoted to their own plans when their predecessors land.

| # | Increment | Activates | Status |
|---|---|---|---|
| 1 | **Foundation** (this plan) | `graph-core`, minimal `graph-ingest` (jsonld-compatible mode + generic Turtle/SKOS parsing), minimal `graph-project` (property-graph + adjacency), `graph-corpus-sdk` scaffold + Oak Curriculum Ontology Threads graph **and** the EEF strands adapter (`subgraph` + `manifest` live; remaining 5 ops typed as `NotImplementedYet` stubs satisfying the full `GraphView<TNode, TEdgeType>` interface) as **two concurrent first-attached corpora** per ADR-173 §First-wave ingestion scope (2026-05-21 amendment). Inc.1a substrate + Inc.1b Threads + Inc.1c query proof + Inc.1d GraphView interface and EEF adapter | **ACTIVE** — WS1.1 (ad2abb69), WS1.2 (1885fbcf), WS1.3 (87e21125), WS1.4 (95f42cb7), and WS2.1 (0f895070) landed; WS1.6 (3add41f9) and WS3.1 (84bfffa5) landed 2026-05-21; WS3.2 (abe6fcb3) landed 2026-05-21; remaining Inc.1a choices are WS1.5, WS2.2, WS2.3, and WS3.3; Inc.1b WS4.1+4.2, Inc.1c WS4.3, Inc.1d WS4.4+4.5 (new) |
| 2 | **Build-pipeline completion** | `graph-ingest` (remaining five modes), `graph-enhance` (full EnhancementRecord + RelationshipRecord), `graph-validate` (JSON Schema + SHACL); **WS1.8 GraphDocument + GraphNode + GraphEdge ergonomic surface lands here (deferred from Inc.1 per owner direction 2026-05-12)**; rewrites of existing `oak-curriculum-sdk` graph code onto the new stack. **Retrospective-review tripwire (owner-set)**: the Inc.2 plan that takes ownership of WS1.8 MUST include a design-review pass against the surfaces shipped in Inc.1 (WS1.3 Dataset + DataFactory, WS1.4 JSON-LD processor, WS1.5 canon, WS1.6 vocab, WS2 graph-ingest, WS3 graph-project, WS4 graph-corpus-sdk) to identify what could be (a) expressed more efficiently through GraphDocument, (b) collapsed or removed because GraphDocument subsumes it, or (c) reshaped to consume GraphDocument as its canonical input/output. The review's verdict is binding on Inc.2's scope — surfaces flagged for collapse or reshape land in Inc.2, not in a follow-on increment. | opens by owner promotion after Inc.1 closes |
| 3 | **Oak corpus backbone** | `graph-corpus-sdk` adapters for prerequisite, misconception, **and the remaining 5 EEF strands adapter operations** (`summary`, `getNode`, `enumerateNodes`, `neighbours`, `findByTag` — the EEF adapter's `subgraph` and `manifest` already landed at Inc.1d per the 2026-05-21 amendment); misconception adapter consumes the bulk-derived graph generated by this repository; EEF adapter consumes the repository-held canonical snapshot until EEF clarifies refresh mechanics; cross-corpus join primitives; sunsets the bespoke factory in `oak-curriculum-sdk`. **Downstream consumer**: [`graph-combinatorial-arc.plan.md`](../../../graph-combinatorial-arc.plan.md) — the cross-corpus join primitive's first concrete consumer is the EEF × Oak misconceptions tool migrated there from the (former) MVP slice 3b. The cross-plan scheduling relationship is owned by `graph-combinatorial-arc.plan.md`'s own Promotion Trigger (no "design stability" intermediate state); this row records the consumer pointer only. | opens by owner promotion after Inc.2 closes (subsumes the residual work in [`graph-query-layer.plan.md`](graph-query-layer.plan.md) not already landed at Inc.1d) |
| 4 | **Practice proof point** | `agent-graphs/practice-graph` workspace as the second consumer; markdown-corpus ingestion; CLI/report surface through `agent-tools` | opens by owner promotion after **both** Inc.2 closes **and** the `agent-graphs/` workspace organisation plan lands; the later of the two predecessors is the schedule signal (consumes [`practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md)) |
| 5 | **Projection + export** | Full `graph-project` surface — visualisation export hooks, JSON-LD export profiles, GQL-friendly property-graph shapes; cross-corpus journey tooling | opens by owner promotion after Inc.3 closes |
| 6 | **Public-asset positioning** | Publishing discipline, external-org adoption documentation, ontology IRI alignment guarantees, contribution model | opens by owner promotion after Inc.4 closes (hard predecessor per §Risk Assessment) |
| 7 | **Future-standards adapters** | `graph-future` workspace activated; first concrete adapter (likely RDF 1.2 statement-annotation export, or SPARQL 1.2 query) | opens when a consumer workspace opens a PR that requires one of {RDF 1.2, JSON-LD 1.2/1.3, SPARQL 1.2, SHACL 1.2} and the existing adapter seam in `graph-core`/`graph-validate`/`graph-project` is insufficient. The consumer PR is the concrete observable signal; monitoring responsibility sits with the owner at PR-review time. |

Each increment is a separate plan when promoted. The foundation increment is the only executable plan today.

---

## Closed Audit Notes

The previously-tracked open decisions O-1 and O-2 have been removed: O-1
("topology approval") is execution sequencing owned by §Promotion Trigger
plus the reviewer absorption flow against ADR-173, not a separable
decision; O-2 ("increment promotion ownership") documented existing
practice (owner promotes each plan at predecessor-close), not a
decision-needing-resolution.

Two prior items are recorded here for audit only:

- **D-4a (ADR-041 workspace-tiers amendment)** — closed 2026-05-11 by the graduation-candidates-drain session (`Fronded Flowering Seed`); `agent-graphs/` regularised + `agent-tools/` formalised in the 8×8 dependency-direction matrix.
- **D-4 (graph-stack topology BLOCKERs)** — closed 2026-05-11 by the graph-execution-prep session (`Dusky Masking Cloak`).

The combinatorial-arc cross-plan scheduling relationship (previously phrased here as "Inc.3 design stability fires the combinatorial arc's promotion trigger") is owned by [`graph-combinatorial-arc.plan.md`](../../../graph-combinatorial-arc.plan.md)'s own Promotion Trigger and is not an open decision in this plan.

---

## Increment 1 — Foundation (this plan)

**First graph work**: the first executable graph task is the
`graph-corpus-sdk` Oak Curriculum Ontology Threads proof: enumerate
`curric:Thread` and resolve inverse `curric:includesThread` Unit lookup through
the substrate with a tiny fixture-backed test. Do this before any NC work, EEF
adapter migration, misconception replatform, cross-corpus join, serving-layer
prototype, or broader query-layer migration.

### Slice value

After landing, Oak has:

- A working RDF-compatible substrate with JSON-LD 1.1 ingestion, vocabulary registry, and canonicalisation.
- The Oak Curriculum Ontology Threads graph (`curric:Thread` nodes and inverse `curric:includesThread` Unit lookup) extracted from the pinned straight-copy ontology raw import into a typed dataset, queryable through `graph-corpus-sdk`'s typed surface.
- The EEF strands corpus exposed as a `GraphView<EefStrand, EefEdgeType>` adapter with `subgraph` and `manifest` live (2026-05-21 amendment — Inc.1d). The remaining 5 EEF operations are typed `NotImplementedYet` stubs satisfying the full interface contract so consumers compile against a stable shape and the Inc.3 implementations land without reshape.
- The full polymorphic `GraphView<TNode, TEdgeType>` interface authored, with the T7a `DeepKeyPath` compile-time smoke-test guarding the array-stop discipline.
- The first proof that ontology IRIs flow end-to-end as canonical identity (Threads), and the first proof that a corpus-local JSON identity scheme composes through the same substrate via a disjoint ingestion path (EEF strands).
- Workspace homes for every layer in the research, with the foundation tier proven.

The foundation increment surfaces nothing through MCP, HTTP, or CLI from any substrate workspace. Surfacing is a consumer-side decision tracked separately (see §Surfacing). The graph-mvp-arc plan owns the consumer-side gate that first uses the Inc.1d EEF adapter through an MCP tool inside `oak-curriculum-sdk` (gate-1a per the 2026-05-21 gate split). The increment is complete when graph capability is present and queryable in-process for both attached corpora.

### Raw ontology import mechanics

ADR-173 records the decision: the GitHub repository
`oaknational/oak-curriculum-ontology` is the source of truth for ontology
definitions and ontology source data. This plan owns the implementation detail
for importing those source files into the graph stack.

The refresh/import command downloads source files from the canonical raw URL
form:

```text
https://raw.githubusercontent.com/oaknational/oak-curriculum-ontology/<revision>/<path>
```

`<revision>` is an immutable commit SHA or release tag recorded in the import
manifest. `main` is allowed only for discovery while preparing an update. The
discovery revision identified on 2026-05-10 was
`c308419f44eff1ef89a67a381221b193bc26feab`; the implementer must re-confirm
and pin the intended revision before WS4.2 lands.

The first-wave raw source set is a full straight-copy import of the ontology
Turtle / SHACL source corpus used by the ontology graph, not a reduced subset:

- `ontology/oak-curriculum-ontology.ttl`
- `ontology/oak-curriculum-constraints.ttl`
- `data/programme-structure.ttl`
- `data/temporal-structure.ttl`
- `data/threads.ttl`
- `data/subjects/**/*.ttl`

The importer resolves globs against the pinned GitHub tree and writes an
explicit manifest entry for every copied file. The raw import is byte-for-byte
source material: no formatting, filtering, canonicalisation, enrichment, or
path-local hand editing happens in the raw layer.

The manifest records at least:

- upstream repository;
- pinned revision and any discovery branch/tag;
- upstream path and resolved raw URL for each source file;
- generated raw output path for each copied file;
- byte length and content hash for each copied file;
- licence and attribution text/source;
- generation timestamp and importer version or command identifier.

Derived graph artefacts are generated separately from the raw copy. That
includes cleanup, indexes, join records, `EnhancementRecord` data, JSON-LD
projections, property-graph projections, and typed SDK surfaces. Small literal
Turtle fixtures remain valid for parser unit tests, but the adapter's
deterministic extraction proof runs against the pinned raw import.

### Slice non-scope (deferred to Increment 2 and beyond)

- The other five ingestion modes (`strict-jsonld`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`).
- Full `graph-enhance` (only the bare IRI-honouring path ships; no inference, no relationship-record minting beyond what the Thread adapter needs).
- Full `graph-validate` (no SHACL execution in this increment; SHACL validation happens upstream in the ontology repo's CI).
- Adapters for prerequisite and misconception (Increment 3). EEF strands adapter `subgraph` + `manifest` operations are pulled forward to Inc.1d (2026-05-21 amendment); the remaining 5 EEF operations remain at Inc.3.
- NC knowledge taxonomy adapter/enhancement/surfacing work. The raw source
  files may be present in the straight-copy import, but interpreting or
  surfacing that corpus is outside the MVP and remains in its own plan unless
  separately promoted by the owner.
- The `practice-graph` workspace (Increment 4).
- Sunset of the existing graph-resource-factory (Increment 2).

### Workstream decomposition

The cycle-by-cycle TDD breakdown is the YAML `todos` block at the head of this plan. Inc.1 is decomposed into three sub-increments (1a / 1b / 1c) plus a closure phase, by file-scope-non-overlapping boundaries; the `sub_increment` field on each todo records the assignment.

#### Inherited patterns from WS1.1 + WS1.2

The two landed Inc.1a cycles produced doctrinal patterns that every remaining Inc.1a cycle (and every future graph-tier scaffold cycle in Inc.2+) inherits. They are listed here once rather than re-stated per cycle:

1. **Scaffold checklist** (applies to WS2.1, WS3.1, and any future graph-tier scaffold including WS4.1 in Inc.1b):
   - `pnpm-workspace.yaml` explicit registration.
   - `knip.config.ts` workspace entry.
   - `tsconfig.lint.json` explicit naming.
   - Staged `pnpm-lock.yaml`.
   - `.dependency-cruiser.mjs` no-orphans `pathNot` exception for every pre-declared sub-path-export barrel (mirrors `oak-sdk-codegen/src/(admin|zod|query-parser|observability)\.ts$` precedent + `graph-core/src/(term|dataset|jsonld|canon|vocab)/index\.ts$`). Absent registration causes a six-error orphan failure at pre-commit even on otherwise-green workspaces.
   - `eslint.config.ts` `*.config.ts` block uses the resolved `wsTsProject` constant, not the string literal `'./tsconfig.json'` (config-expert nit from WS1.1; opportunistic fix everywhere).
   - `README` cites ADR-173 / ADR-179 by number only.
   - `coreBoundaryRules` applied on `src/**/*.ts` per ADR-154.

2. **Per-kind checker-array dispatch for discriminated-union equality / equivalence / match** (applies wherever WS1.3 / WS1.5 / WS3.3 dispatch on Term variant or PropertyGraph node kind):
   - Default to checker-array dispatch from the outset; do not start with `switch(kind)` and discover the cast/complexity dilemma after the fact.
   - Each branch ≤ complexity 8; top-level dispatcher ≤ complexity 2.
   - Recurse where the union contains other unions (Literal.datatype is NamedNode; Quad components are Terms; PropertyGraph edges contain typed labels).
   - Cast-free (passes `@typescript-eslint/consistent-type-assertions`).

3. **RDF/JS Data Model uniform shape** (applies to WS1.3 DataFactory + WS1.6 vocab-registry):
   - Every Term carries `value: string` (TripleTerm conformance landed in WS1.2; preserve invariant).
   - WS1.3's DatasetCore surface must be 1:1 with `@rdfjs/types` Dataset interface (add/has/match/delete/iterable/size).
   - WS1.6's vocab entries are constructed via the DataFactory `namedNode()` from WS1.3, not as bare object literals — preserves the single-shape posture downstream consumers (graph-ingest, graph-project, graph-corpus-sdk) depend on.

4. **"Tree green" definition follows `.husky/pre-commit`** (do not re-enumerate the gate set in the plan body; the previous enumeration drifted from reality during cost-of-collaboration P0). Authoritative gate set is what the hook actually runs (currently prettier-staged + markdownlint-staged + lint:shell + turbo run type-check/lint/test on staged content). Knip + depcruise have moved to `pnpm check` / pre-push / CI. The Inc.1 closure WS7 invokes `pnpm check` for the repo-wide gate baseline.

5. **Reviewer flags are recorded per cycle in the YAML `todos` content**, not solely in §Reviewer Scheduling. Per-cycle flags let any coordinator-ordered or machine-dispatched cycle pick up the reviewer matrix without re-derivation. §Reviewer Scheduling retains the plan-level and close-level reviewer responsibilities.

#### Inc.1a — Substrate scaffolding (file scope: `packages/core/graph-core/`, `packages/libs/graph-ingest/`, `packages/libs/graph-project/`)

- **WS1 — `graph-core`** (6 cycles total; 4 landed, 2 remaining): WS1.1 scaffold (DONE ad2abb69); WS1.2 RDF Term + Quad (DONE 1885fbcf); WS1.3 DatasetCore + DataFactory (DONE 87e21125); WS1.4 JSON-LD 1.1 processor (DONE 95f42cb7; graph-core adapter proof only, real Oak Threads raw-import proof remains WS4.2); WS1.5 canonicalisation (renumbered from WS1.6); WS1.6 vocabulary registry (renumbered from WS1.7; prep note landed at f36f98b1). The prior WS1.8 GraphDocument is deferred to Inc.2 per owner direction 2026-05-12 (see §Increments row 2 retrospective-review tripwire).
- **WS2 — minimal `graph-ingest`** (3 cycles): WS2.1 scaffold (DONE 0f895070); WS2.2 `jsonld-compatible` mode + generic Turtle/SKOS parsing; WS2.3 SourceMapping primitives.
- **WS3 — minimal `graph-project`** (3 cycles): WS3.1 scaffold; WS3.2 `toPropertyGraph` projection; WS3.3 property-graph adjacency primitives (scope sharpened: MUST NOT duplicate `DatasetCore.match()` semantics).

**Inc.1a exit**: WS1.5–WS1.6 + remaining WS2 + WS3 cycles land green; `graph-core`, `graph-ingest`, `graph-project` expose stable public surfaces; `graph-corpus-sdk` can compile against them. **Cycle count after this continuity repair: 7 remaining** in Inc.1a (WS1.5, WS1.6, WS2.2, WS2.3, WS3.1, WS3.2, WS3.3).

#### Inc.1b — Threads adapter (file scope: `packages/sdks/graph-corpus-sdk/`)

- **WS4.1 — `graph-corpus-sdk` scaffold**: typed corpus-adapter boundary; no Oak-specific ontology mapping before the SDK boundary exists.
- **WS4.2 — Oak Ontology Threads adapter**: GitHub raw-import fixture/manifest against the pinned `oaknational/oak-curriculum-ontology` revision; Thread adapter inside the SDK (generic Turtle/SKOS parse via `graph-ingest`; `curric:Thread` and inverse `curric:includesThread` mapping); deterministic extraction test against the pinned straight-copy ontology raw import.

**Inc.1b exit**: Threads adapter extracts `curric:Thread` from pinned ontology raw import; deterministic extraction test passes.

#### Inc.1c — Thread→Unit query proof (file scope: `packages/sdks/graph-corpus-sdk/`)

- **WS4.3 — typed query proof**: end-to-end query through `graph-corpus-sdk`'s typed surface (Thread enumeration + inverse Unit lookup); in-process only; no MCP wiring.

**Inc.1c exit**: Thread→Unit inverse-edge lookup is queryable in-process via the typed surface; ontology IRIs are canonical identity end-to-end.

#### Inc.1 closure (file scope: cross-plan + repo-wide docs + gates)

- **WS0 — Topology ADR promotion** (DONE 2026-05-11): ADR-173 and ADR-179 ratified Status: Proposed → Accepted. Reviewer absorption complete (architecture-expert-betty, architecture-expert-fred, assumptions-expert) and architecture-expert-barney PROMOTION-READY verdict on this plan body. The ADRs record the topology decision, transport-discipline corollary, and supersession/coordination map. Closed at commit `5ec5004d`.
- **WS5 — Coordination amendments** (1 batch): amend `graph-query-layer.plan.md`, `oak-kg-threads-surface.plan.md`, `practice-graph-payoff-peak-pilot.plan.md`, and the parent `open-education-knowledge-surfaces.plan.md`.
- **WS6 — Documentation propagation** (1 batch): collection README, monorepo README, CONTRIBUTING, `LICENCE-DATA.md` ontology section, Mark Hodierne author addition, research filename typo fix. ADR-123 is not amended by this increment because no MCP primitives are added or changed.
- **WS7 — Quality gates** (1 batch): run `pnpm check` for the repo-wide gate baseline, plus the full `.husky/pre-commit` chain on the integrated foundation increment. The chain is not re-enumerated here (see Inherited patterns rule #4 — `.husky/pre-commit` and `pnpm check` are the authoritative source of truth; re-enumerating in plan bodies caused drift during cost-of-collaboration P0). Plus surface-specific tests where the foundation increment ships them: `pnpm test`, `pnpm test:ui`, `pnpm test:e2e`.
- **WS8 — Adversarial review** (1 batch): assumptions-expert, architecture-expert-betty/fred/barney, type-expert, docs-adr-expert.

### Cycle dependencies and parallelisation

Dependency edges are encoded per-cycle in the YAML `todos` block. This section describes the parallel-safe pairs and the serialisation invariants the dispatcher must honour.

**Inside `graph-core` (newly visible after the 2026-05-12 re-plan)**:

- **WS1.3 ↔ WS1.6** (DatasetCore + DataFactory; vocab registry) are *parallel-safe at the file-scope level* — `src/dataset/` is disjoint from `src/vocab/`. They are NOT YAML-`depends_on`-independent in the default shape, because WS1.6 entries are constructed via the WS1.3 DataFactory `namedNode()` constructor. The plan therefore records the dependency edge on WS1.3 by default. Owner-direction alternative: if WS1.6 ships a strictly-data-only first pass with bare-literal NamedNodes (DataFactory call-site conversion as a follow-up), the dependency edge collapses and the pair becomes truly parallel-safe — *not* assumed; flagged for owner direction at WS1.6 dispatch time.
- **WS1.5** canonicalisation is now unblocked by the landed WS1.3 DatasetCore + DataFactory and landed WS1.4 JSON-LD processor. The former WS1.4 ↔ WS1.5 parallel-safe pair no longer needs pair dispatch because WS1.4 is done; keep the same file-scope rule (`src/canon/` disjoint from `src/jsonld/`) if any follow-up JSON-LD fix runs concurrently.

**Inside the lib tier (WS2 / WS3)**:

- **`WS2.1 ↔ WS3.1` scaffold pair is NOT parallel-safe** — both write to repo-root monorepo registration files (`pnpm-workspace.yaml`, root `tsconfig.json` project references, root `package.json`). Serialise (either order) or batch their root-file edits into one preparatory commit. The YAML `depends_on` for WS3.1 includes WS2.1 to express this invariant machine-readably.
- **`WS2.2 ↔ WS3.2`** and **`WS2.3 ↔ WS3.3`** are *parallel-safe* — they touch disjoint workspace source trees after both scaffolds exist. WS2.2 and WS3.2 each declare an additional `depends_on: [ws1-dataset-core]` to record that they consume the Dataset surface.

**Worktree-isolation caveat**: all "parallel-safe" pairs above remain subject to the [worktree-isolation-unreliable](../../../../memory/active/distilled.md) standing memory. Sequential dispatch is the default unless the orchestrator independently verifies isolation behaviour for the candidate pair on the candidate base SHA. Pair dispatch never short-cuts isolation verification.

**WS4.2 earliest-start refinement**: WS4.2 (`ws4-oak-ontology-thread-adapter`) declares `depends_on: [ws4-graph-corpus-sdk-scaffold, ws1-vocab-registry]`. Its earliest possible start is therefore *after WS1.6 vocab-registry + WS4.1 graph-corpus-sdk scaffold*, not after all of Inc.1a. The Inc.1a-then-Inc.1b sub-increment framing is correct for the explicitly preferred single-agent shape; this note is for any future brief that revisits finer-granularity parallelism across the sub-increment boundary.

**Sub-increment dependency direction**:

- Inc.1a → Inc.1b: Inc.1b cannot begin until Inc.1a complete (WS4.1 `depends_on: [ws3-adjacency, ws2-source-mapping]`).
- Inc.1b → Inc.1c: Inc.1c cannot begin until Inc.1b complete (WS4.3 `depends_on: [ws4-oak-ontology-thread-adapter]`).
- Inc.1c → Inc.1 closure: WS5+ require Inc.1c green.

**Multi-agent parallelism within Inc.1**:

- Two agents can share Inc.1 only at the Inc.1a substrate level — one agent on `graph-ingest` (WS2), one on `graph-project` (WS3), after `graph-core`'s WS1.3 DatasetCore + DataFactory lands on `main` (WS2.2 and WS3.2 both consume `graph-core`'s Dataset surface; the scaffold cycles WS2.1 and WS3.1 depend only on WS1.1, which is already landed, so they can start earlier still but must serialise against each other per the root-file-edit invariant above). Their file scopes are disjoint workspace trees after the scaffolds and the root-file edit batch complete.
- Within `graph-core` itself, the remaining parallel-safe consideration is WS1.5 ↔ WS1.6 (disjoint `src/canon/` and `src/vocab/` scopes after WS1.3/WS1.4 landed). Multi-agent dispatch within `graph-core` remains owner-discretion; single-agent is the explicitly preferred shape, with parallelism opened only when owner-directed and worktree isolation is independently verified.
- Inc.1b is single-workspace by design (`packages/sdks/graph-corpus-sdk/`); single-agent.
- Inc.1c is single-workspace and single-cycle; single-agent.
- Inc.1 closure is sequential coordination work; single-agent.

### Test discipline

The foundation increment lands tests for the load-bearing invariants from research §14:

1. **Stable IRI**: `graph-core/vocab` lookups + `graph-corpus-sdk` adapter honour stable ontology IRIs deterministically.
2. **Predicate IRI**: every emitted edge carries a `NamedNode` predicate, never a bare string.
3. **Source path preserved**: every node and edge produced by `graph-ingest` carries a `sourcePath` referenceable through JSON Pointer.
4. **Enhancement traceable**: every derived attribute carries an `EnhancementRecord` (even where the foundation increment only emits one or two enhancement kinds).
5. **JSON-LD 1.1 only at the public surface**: no draft-only syntax leaks (compile-time check on the `JsonLdProcessor` adapter; runtime check on emitted `@context`).
6. **Property-graph projection is derived, not canonical**: a smoke test asserts that `dataset.toPropertyGraph()` is reconstructable from the canonical dataset.
7. **Triple-term ingestion round-trip (continuous contract test)**: `graph-ingest` asserts triple-term inputs round-trip preserving annotations. Implements ADR-173 tripwire #6 as continuous validation rather than deferred tripwire (assumptions-expert 2026-05-11).
8. **JSON-LD framing determinism on real Oak Threads corpus**: a contract test that `jsonld.js` framing produces deterministic output on the pinned Oak Ontology Threads raw import; surfaces performance characteristics before they become an Inc.2 surprise (assumptions-expert 2026-05-11). WS1.4 intentionally kept Oak-specific corpus semantics out of `graph-core`; the real-corpus proof belongs with the pinned raw import / graph-corpus-sdk adapter path.

### Acceptance

The foundation increment is done when:

1. **Inc.1a** — substrate scaffolding cycles (WS1 + WS2 + WS3) land green.
2. **Inc.1b** — `graph-corpus-sdk` scaffold and Oak Ontology Threads adapter (WS4.1 + WS4.2) land green.
3. **Inc.1c** — Oak Curriculum Ontology Threads are queryable in-process via `graph-corpus-sdk`'s typed surface, including Unit-to-Thread inverse-edge lookup; ontology IRIs are canonical identity end-to-end (WS4.3). No surfacing (MCP, CLI, HTTP) is required for completeness.
4. **Inc.1d** — `GraphView<TNode, TEdgeType>` polymorphic interface lands in `graph-core` under `./graph-view`, with the T7a `DeepKeyPath` compile-time smoke-test guarding the array-stop discipline (WS4.4); `EefStrandsGraphView` adapter lands in `graph-corpus-sdk` with `subgraph` + `manifest` live operations and the remaining five operations as typed `NotImplementedYet` Result stubs satisfying the full interface contract (WS4.5). The atomic-landing test set covers connected-strand subgraph at depth 2 returning bounded `{nodes, edges}`, isolated-strand subgraph returning `{nodes: [root], edges: []}` deterministically, manifest returning the exact `strands_without_relations` list matching the 13 named strands (consumed by the consumer-side gate-0a / gate-1a acceptance owned by `graph-mvp-arc.plan.md`), and stub operations returning typed `NotImplementedYet` Result without throwing.
5. **Inc.1 closure** — the full quality-gate chain passes (WS7); ADR for the topology decision is merged (WS0); coordination amendments are applied to the named plans (WS5); Mark Hodierne is in the authors list (WS6).

---

## Coordination with Existing Plans

This plan does **not** wholesale supersede adjacent plans; it provides the spine they attach to. The coordination map:

| Plan | Coordination |
|---|---|
| [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md) | **Outside this MVP foundation increment.** The NC taxonomy plan is not amended or subsumed here. If the owner later promotes NC taxonomy work, it can attach to the substrate as a separate corpus adapter and consumer surface. |
| [`graph-query-layer.plan.md`](graph-query-layer.plan.md) | **Substrate subsumed into Increment 3.** The `GraphView<TNode, TEdgeType>` interface, the seven operations, projection discipline, and the tracer-matrix work all migrate into `graph-corpus-sdk` over the new substrate. MCP exposure of those operations is a consumer-side decision, tracked outside this plan; the 17-MCP-tool count and per-operation tool definitions are owned by the consumer surface (curriculum SDK MCP module + HTTP app) at the point of exposure. `graph-query-layer.plan.md` is amended at WS5 to record this boundary. |
| [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) | **Status remains DONE.** The factory currently lives in the curriculum MCP app's surface layer; it stays where it is and continues to work. If MCP exposure of new graph capabilities is later chosen, the factory may be revisited then. No retroactive amendment needed. |
| [`../active/misconception-graph-mcp-surface.plan.md`](../active/misconception-graph-mcp-surface.plan.md) | **Status remains DONE.** The current misconception MCP tool stays live and unchanged. If the misconception adapter is later rewritten onto `graph-corpus-sdk`, the MCP tool is a thin re-wrapping the owner can do at any point — independent of the substrate. |
| [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) | **WS5 amendment target.** The graph substrate and Oak Ontology Threads foundation will be referenced through this spine plan. The parent retains its multi-source narrative role; this spine becomes a named child plan. |
| [`../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) | **WS5 amendment target.** Its required graph-core workspace should be the one this plan lands, and its practice-facing graph home should remain `agent-graphs/practice-graph/`. The Practice plan becomes an adjacent practice-facing consumer of the spine (Increment 4 in the topology sequencing), after the future `agent-graphs/` organisation plan wires the top-level area. |
| [`../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) | **Strategic brief; no amendment needed.** Practice-graph attribution discipline (Graphify / Safi Shamsi) carries forward through the Practice plan and into the eventual `practice-graph` workspace README. |

WS5 in the cycle list executes these amendments.

---

## Public-Asset Positioning

The substrate is publishable. Each workspace below `graph-corpus-sdk` carries:

1. No Oak-specific identifiers in code.
2. No coupling to Oak's bulk-data shape.
3. Standards-only dependency surface (W3C standards + `jsonld.js` / `rdf-canonize` / `rdf-validate-shacl`).
4. Documentation written for arbitrary education-domain consumers, not Oak-internal contributors.

`graph-corpus-sdk` is Oak-specific by design and signals that explicitly in name and README. `agent-graphs/practice-graph` is practice-specific by design and is documented in the agent-tooling/practice estate, not as a substrate workspace.

The eventual public-asset move (Increment 6) is to publish `graph-core`, `graph-ingest`, `graph-enhance`, `graph-validate`, `graph-project` under a neutral scope (or unscoped) so other education organisations can:

- Use the substrate to model their own corpora.
- Attach to Oak's ontology IRIs through `graph-corpus-sdk` for cross-organisation joins.
- Contribute back vocabulary mappings for the Oak ontology Thread graph and EEF strands.

This is named here so the substrate is built for that future from day one — no Oak-specific shortcuts in the layered packages.

---

## Reviewer Absorption (2026-05-11)

Findings from architecture-expert-betty + architecture-expert-fred +
assumptions-expert run against ADR-173 in the Flamebright Burning Lava
session. Absorbed amendments (this section is audit-and-route, not
duplicate doctrine).

**Absorbed into ADR-173 directly**:

- Tripwire #2 ↔ #5 cross-reference fix (RDF 1.2 REC may land before
  RDF/JS WG publishes data-model extension).
- Tripwire #6 reformulated from deferred-tripwire to continuous
  contract test on `graph-ingest`.
- Tripwire #8 added: upstream `oaknational/oak-curriculum-ontology`
  breaking-change tripwire.
- Open Question 2 (MCP-agnostic principle as separate ADR vs in-place
  in ADR-173) — **Resolved 2026-05-11**: extracted to
  [ADR-179](../../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md)
  per owner direction; ADR-173 references ADR-179 in §"Transport
  discipline (see ADR-179)". Rule substance unchanged.

**Pre-Inc.2 design precondition (Betty)** — *not blocking Inc.1
ratification, blocking Inc.2 implementation start*:

The `graph-enhance` ↔ `graph-validate` seam needs an explicit
dependency-direction and result-type protocol recorded before Inc.2
implementation begins. The protocol is: validation results are plain
records (data structures), not callbacks into enhancement. Direction
is `graph-validate → graph-enhance` (validate imports enhancement
record types to annotate failures); enhancement does not import
validation. If enhancement logic accumulates conditional paths
driven by validation outcomes, the boundary is leaking and the
protocol has failed.

**Pre-Inc.3 design precondition (Betty)** — *not blocking Inc.1
ratification, blocking Inc.3 implementation start*:

The `graph-ingest` ↔ `graph-corpus-sdk` boundary needs a
corpus-local parse extension protocol. Corpus-local parse quirks
(namespace collisions, non-standard SKOS uses, EEF-specific JSON
shapes) MUST land in `graph-corpus-sdk` adapters, not in
`graph-ingest`. The protocol: `graph-ingest` exposes parse-primitive
extension points (visitor / parse-callback) that adapters can
specialise without re-implementing or reaching back. Document
before Inc.3 prerequisite/misconception/EEF adapters land.

**Absorbed into §Test discipline above**:

- Triple-term ingestion round-trip continuous contract test (test
  invariant #7).
- JSON-LD framing determinism contract test on pinned Oak Ontology
  Threads raw import (test invariant #8).

**Absorbed into §Build-vs-Buy Attestation above**:

- Named-alternative rows expanded per library (`jsonld.js`,
  `rdf-canonize`, `rdf-validate-shacl`) so the attestation is
  evidenced rather than categorical.

**Sequencing observation (assumptions-expert)**: `agent-graphs/`
top-level organisation plan is a sequencing dependency for Inc.4
practice-graph consumer activation, not a topology dependency. The
organisation plan does not yet exist; tracked as schedule
dependency in §Increments table row 4.

---

## Reviewer Scheduling

### Plan-phase (PRE-ExitPlanMode)

- `assumptions-expert` — proportionality check (does the seven-active-plus-one-deferred graph topology fit the value claim?), build-vs-buy attestation, blocking legitimacy of the foundation-first sequencing
- `architecture-expert-betty` — cohesion and change-cost trade-offs of the seven-active-plus-one-deferred graph shape; long-term evolution path
- `architecture-expert-fred` — ADR-154 framework-vs-consumer compliance across the layer boundaries; dependency direction
- `architecture-expert-barney` — boundary simplification; whether any workspace can be safely collapsed without losing layer discipline

(`mcp-expert` is deliberately not engaged for the foundation increment because no MCP code is produced. It runs only when a consumer chooses MCP surfacing.)

### Mid-cycle (DURING execution)

**Per-cycle reviewer flags are recorded inline in each cycle's YAML `todos` `content` field** (added during the 2026-05-12 re-plan). The flags below are the standing tier-level responsibilities; the YAML is the authoritative per-cycle dispatch list.

- `test-expert` — after each RED/GREEN cycle in WS1–WS4 (already engaged on WS1.2; landed APPROVE).
- `type-expert` — landed on WS1.2 Term + Quad with APPROVE-WITH-NITS (absorbed in-cycle); re-engaged for WS1.3 DatasetCore + DataFactory (generic match() iterator typing, @rdfjs/types alignment), WS1.4 JSON-LD processor (adapter shape vs jsonld.js raw signatures), WS1.5 canon (rdf-canonize wrapper shape), WS1.6 vocab-registry (const-typed NamedNode literal preservation), WS2.3 SourceMapping primitives, WS3.3 adjacency iterator API, and WS4.1 graph-corpus-sdk scaffold.
- `code-expert` — gateway after each WS lands; routes to specialists.
- `architecture-expert-betty` — re-engaged after WS1.3 DatasetCore + DataFactory (cohesion of Dataset surface vs RDF/JS DataModel), WS3.2 toPropertyGraph projection (projection seam vs canonical Dataset; no leakage), and WS4.2 graph-corpus-sdk scaffold; explicit check at each engagement that no MCP-shaped types or surfaces have leaked into the graph workspaces.
- `architecture-expert-fred` — re-engaged for WS1.6 vocab-registry (data-tables-as-schema discipline) and at any cycle that newly touches inter-tier dependency direction.
- `architecture-expert-barney` — re-engaged for WS3.3 adjacency (explicit collapse-vs-keep boundary check against WS3.2). Verdict-binding: collapse-safe reduces Inc.1a to 9 remaining cycles.
- `assumptions-expert` — re-engaged for WS1.4 JSON-LD processor (jsonld.js maintenance posture + Inc.2 upgrade policy).
- `config-expert` — re-engaged for WS2.1 + WS3.1 scaffolds (canonical scaffold-checklist conformance per the inherited-patterns sub-section above).

### Close (POST-execution)

- `docs-adr-expert` — ADR-vs-implementation alignment; coordination amendments coherent
- `release-readiness-expert` — GO / GO-WITH-CONDITIONS / NO-GO before Increment 2 promotion

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Seven-active-plus-one-deferred topology proves over-decomposed; some workspaces have insufficient surface to justify their boundary | Medium | Medium | Per-workspace creation gate in WS1–WS3: each workspace lands only when its first cycle has green tests proving the boundary carries weight. If a layer's cycles all collapse into another workspace, fold it. |
| The substrate is built ahead of consumer demand and accumulates speculative API | Medium | High | The foundation increment ships only what the Oak Ontology Threads adapter needs end-to-end. Every method on `graph-core`/`graph-ingest`/`graph-project` has a Thread-adapter-driven justification or it does not ship. Subsequent increments justify their additions with their own consumer slices. |
| `jsonld.js` / `rdf-canonize` / `rdf-validate-shacl` create maintenance burden disproportionate to value | Low | Medium | The adapter shapes (research §12) keep them replaceable. Each is W3C-spec-aligned and widely used; bespoke alternatives are higher-risk. |
| Ontology IRIs are not as stable as the strategy assumes; rewrite cost is hidden | Medium | High | The strategy doc (`oak-ontology-graph-opportunities.strategy.md`) names this risk. The vocabulary registry's pin-by-version model lets corpus adapters declare a specific ontology revision; alignment audit (separate plan) measures actual stability. |
| Foundation increment lands without a Practice consumer; the substrate's cross-corpus claim is unproven | Medium | Medium | The increment's success criterion is end-to-end Oak Ontology Threads ingestion *plus* the second-consumer commitment in Increment 4. Increment 4 is a hard predecessor for Increment 6 (public-asset positioning). |
| Existing graph-shaped code in `oak-curriculum-sdk` and the queued `graph-query-layer.plan.md` drifts from the spine during Increment 1 | Medium | Low | Coordination amendments (WS5) explicitly point those plans at this spine. The proposed ADR records the intended topology so future plans cannot silently re-fork while ratification remains an owner gate. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../../templates/components/foundation-alignment.md)

- **principles.md**: strict, complete, schema-first, separate framework from consumer. The seven-active-plus-one-deferred graph topology is the framework-vs-consumer separation made structural.
- **testing-strategy.md**: TDD at all levels. Every cycle in WS1–WS4 lands one failing test plus the product code that greens it, in one commit.
- **schema-first-execution.md**: types flow from schema. The vocabulary registry is the schema; `graph-core`'s types flow from RDF/JSON-LD spec; `graph-corpus-sdk`'s adapters flow from the ontology IRIs.

First question: **Could it be simpler without compromising quality?** The seven-active-plus-one-deferred graph shape collapses ten research-named layers into seven active graph packages (folding `graph-jsonld`, `graph-canon`, `graph-vocab` into `graph-core` because their surfaces are small and tightly coupled, and moving the practice consumer to `agent-graphs/`). Going below seven active graph workspaces forecloses the layer discipline; going above seven without a consumer is speculative. Seven active graph workspaces plus one deferred future-standards workspace is the floor.

---

## Documentation Propagation

> See [Documentation Propagation component](../../../templates/components/documentation-propagation.md)

Required handling before close:

1. [ADR-173](../../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md) (Status: Accepted 2026-05-11) records the topology and supersession map. [ADR-179](../../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md) (Status: Accepted 2026-05-11) records the transport-discipline corollary. Both ADRs ratified together at commit `5ec5004d`; WS0 closed.
2. ADR-154 (framework-vs-consumer) reference: the topology is a worked application of the rule.
3. ADR-157 (multi-source open education) amendment: the spine is now the structural carrier of multi-source integration.
4. Collection README ([`../README.md`](../README.md)) — add this plan to Current Queue, update Read Order.
5. Monorepo root `README.md` — Data Sources section to mention the graph stack as the structural integration layer.
6. `LICENCE-DATA.md` — confirm ontology section reflects direct ingestion.
7. `package.json` contributors — add Mark Hodierne (per existing parent-plan attribution requirement).
8. Per-workspace READMEs (seven active graph workspace files, plus one deferred `graph-future` README when activated) — each names its layer, its public surface, its non-goals, its adapter seams, and its transport-agnostic posture per [ADR-179](../../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md).
9. ~~Filename typo correction: `.agent/research/graph-iibrary.md` → `.agent/research/graph-library.md`.~~ **DONE 2026-05-07** — file renamed to `.agent/research/graph-library.research.md` with the `.research.md` suffix to mark it as one researched direction rather than a plan; references in this plan, the collection README, and operational memory updated.
10. First-wave ingestion scope amendment: confirm the foundation ships generic Turtle/SKOS parsing plus the Oak Curriculum Ontology Threads adapter as the first attached corpus. Prerequisite, misconception, and EEF strand adapters are sequenced into Increment 3. NC taxonomy adapter/surface work and other Oak Ontology projection formats (PG-JSONL, Neo4j export, SQL) remain out of scope until a downstream consumer requires them and the owner promotes that work separately.

ADR-123 (MCP server tool catalogue) is *not* amended by this increment because no MCP tools are added or changed. Any future increment that surfaces graph capability via MCP would amend ADR-123 at that point.

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content (notably: any new patterns around layered
graph substrates), extract reusable patterns, rotate the napkin, manage
fitness, and update the practice exchange. Candidate graduations:

- **Pattern**: layered standards-based substrate with adapter seams for emerging specs.
- **Pattern**: ontology-IRI-as-spine for cross-corpus joins.
- **Pattern**: enhancement-record-as-derivation-trace.

---

## Dependencies

**Blocking**:

- ~~Owner final-approval of ADR-173 (Status: Proposed → Accepted) after reviewer absorption.~~ **CLOSED 2026-05-11** — ratified at commit `5ec5004d`.
- Pinned `oak-curriculum-ontology` revision for Oak Ontology Threads extraction (foundation-increment WS4 dependency) — still open; required before Inc.1b WS4.2 begins.

**Related Plans**:

- [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) — parent narrative; this plan executes its WS-4 via the spine.
- [`graph-query-layer.plan.md`](graph-query-layer.plan.md) — subsumed into Increment 3.
- [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md) — outside this MVP; not subsumed by Increment 1.
- [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) — DONE; refactored during Increment 2.
- [`../active/misconception-graph-mcp-surface.plan.md`](../active/misconception-graph-mcp-surface.plan.md) — DONE; rewritten during Increment 3.
- [`../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) — Increment 4 consumer.
- [`../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) — strategic context for the Practice consumer.
- [`../oak-ontology-graph-opportunities.strategy.md`](../oak-ontology-graph-opportunities.strategy.md) — strategic baseline; this spine is consistent with its search-first, graph-augmented stance and with direct ontology use as the baseline.

**Authoritative research**:

- [`.agent/research/graph-library.research.md`](../../../../research/graph-library.research.md) — comprehensive layer inventory and Oak first-wave ingestion scope; this plan's topology is its monorepo realisation.

---

## Promotion Trigger from CURRENT to ACTIVE — CLOSED 2026-05-11

Historical: this plan moved CURRENT → ACTIVE on 2026-05-11 (commit `5ec5004d`) when all four gates closed:

1. ~~Reviewer findings (architecture-expert-betty, architecture-expert-fred, assumptions-expert) absorbed into [ADR-173](../../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md) in place.~~ **DONE 2026-05-11** (Flamebright Burning Lava session).
2. ~~Owner final-approves the refined ADR-173; Status flips Proposed → Accepted.~~ **DONE 2026-05-11** (Sparking Charring Ash session); ADR-179 ratified together.
3. ~~The pinned `oak-curriculum-ontology` revision is identified for the Oak Ontology Threads adapter.~~ — relocated to §Dependencies as a still-open prerequisite for Inc.1b WS4.2 (not a plan-promotion gate).
4. ~~`architecture-expert-barney` has run against this plan body and findings are addressed.~~ **DONE 2026-05-11** — PROMOTION-READY verdict, no required changes.

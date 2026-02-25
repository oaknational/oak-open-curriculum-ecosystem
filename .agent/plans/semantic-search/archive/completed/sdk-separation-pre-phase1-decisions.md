---
name: SDK Separation Pre-Phase-1 Decisions
overview: >
  Architectural decisions and plan refinements required before Phase 1 of the
  SDK workspace separation begins. Captures issues surfaced by adversarial
  review, user direction on bulk-download architecture, and vocabulary mining
  convergence opportunity.
todos:
  - id: bulk-ownership-decision
    content: "Decide public/bulk ownership: generation-time pipeline vs runtime facade."
    status: completed
  - id: bulk-download-caching
    content: "Design bulk download caching at type-gen time with staleness detection."
    status: completed
  - id: vocabulary-convergence
    content: "Design single vocabulary/synonym mining pipeline replacing fragmented sources."
    status: completed
  - id: d1-scope-refinement
    content: "Refine Phase 3 move list: distinguish generated, authored, and runtime-composition files."
    status: completed
  - id: baseline-gate-strategy
    content: "Replace hard-coded baseline numbers with commit-anchored evidence."
    status: completed
  - id: phase-collapse-evaluation
    content: "Evaluate collapsing Phases 2+3+4 into one atomic move-and-rewire slice."
    status: completed
  - id: update-canonical-plan
    content: "Apply all resolved decisions back to sdk-workspace-separation.md."
    status: completed
isProject: false
---

# SDK Separation Pre-Phase-1 Decisions

Decisions required before Phase 1 of the
[canonical SDK workspace separation plan](sdk-workspace-separation.md) begins.

## Origin

- **Adversarial review** by architecture-reviewer-barney (22 Feb 2026):
  identified incomplete reverse-dependency inventory, `public/bulk` ownership
  gap, D1 scope overreach, brittle baseline gate, and phase-collapse
  opportunity.
- **User direction** (22 Feb 2026): bulk download and processing should move to
  type-gen time; vocabulary/synonym/alias mining should converge into a single
  pipeline mining all three sources (OpenAPI spec, bulk-downloads JSON Schema,
  bulk download data).

---

## D1. `public/bulk` Ownership and Bulk Download Architecture

### Current state

`src/bulk/` in the curriculum SDK contains:

- `reader.ts` — reads and Zod-validates bulk download JSON files from disk
- `processing.ts` — processes bulk data for downstream consumers
- `extractors/` — extracts keywords, misconceptions, etc. from bulk data
- `generators/` — generates TypeScript artefacts (synonym miner, graph data)

`src/public/bulk.ts` re-exports these as a public API surface. 22 files in
`apps/oak-search-cli/` import from `@oaknational/curriculum-sdk/public/bulk`.

`vocab-gen/` orchestrates the extractors and generators, producing files like
`definition-synonyms.ts`, `*-graph-data.ts`, and `thread-progression-data.ts`.

### User direction

Bulk download, caching, and processing should move to **type-gen time**. This
is currently ad-hoc (scripts in search CLI, manual `pnpm vocab-gen` runs). The
target is a deterministic generation pipeline that:

1. Downloads bulk data files (or uses a local disk cache)
2. Validates them against the bulk-downloads JSON Schema
3. Runs all extraction and generation (synonyms, graphs, vocabulary mining)
4. Produces TypeScript artefacts consumed by runtime and search SDKs

### Key questions

- **Cache location**: where on disk? `.cache/bulk-downloads/` in workspace root
  (gitignored)? Or within the generation workspace?
- **Staleness detection**: how does the pipeline know when to re-download?
  Options: `last-updated` API endpoint, ETag/If-Modified-Since headers, local
  manifest with timestamps, or manual invalidation.
- **Consumer contract**: does `public/bulk` remain a runtime API surface
  (runtime re-exports from generation), or does it become generation-owned with
  apps importing from the generation package directly?
- **Search CLI impact**: the search CLI currently reads bulk files at runtime
  for indexing. Does this become a generation-time pre-processing step, or does
  the search CLI continue to read bulk files directly for index operations?

### Decision (resolved 23 Feb 2026)

**All of `src/bulk/` moves to the generation workspace.** The guiding
principle: if something CAN be created or owned at type-gen time, it should be.
The runtime should be as thin as possible while respecting architectural
boundaries.

What moves:

- **Types and schemas** (`BulkDownloadFile`, `Lesson`, `Unit`, etc.) —
  generation-owned type information
- **Readers** (`readAllBulkFiles`, `parseBulkFile`, `discoverBulkFiles`) —
  generation-time tooling
- **Extractors** (15 pure functions) — generation-owned processing logic
- **Generators** (`synonym-miner`, `*-graph-generator`) — generation-time
  artefact producers
- **Processing** (`processBulkData`) — generation-time orchestration

### Architectural rationale: two pipelines, one generation workspace

The generation workspace contains two genuinely separate pipelines with
different inputs, change triggers, and consumers:

| Pipeline | Input | Change trigger | Primary consumers |
|---|---|---|---|
| **API pipeline** | OpenAPI spec (network/cache) | API schema changes | Curriculum SDK runtime, MCP server apps |
| **Bulk pipeline** | Bulk download JSON files (disk) | Curriculum content changes | Search SDK, search CLI |

The curriculum SDK was designed around the API concern: how to access
curriculum data via HTTP endpoints. The search SDK was designed to consume
API types but shifted to primarily using bulk download data for Elasticsearch
indexing. The search SDK never calls the Oak API — it is purely an
Elasticsearch client whose data pipeline is:

```text
Bulk JSON files → extractors → ES index → queries → results
```

The only connection between search and the OpenAPI spec is that search type
generators extract `SUBJECTS` and `KEY_STAGES` constants from it. Even the
bulk type generation is currently template-based, not driven from the OpenAPI
spec.

This reveals the natural runtime boundary: the curriculum SDK runtime is for
**accessing the API** (client, auth, MCP tool execution). The search SDK
runtime is for **searching bulk-derived data** (ES queries, index management).
At the package level the search SDK still depends on the curriculum SDK runtime
for shared exports (e.g. `buildElasticsearchSynonyms`), but the data sources
are separate. The two SDKs are connected at the MCP application layer, where
aggregated tools orchestrate both.

Both pipelines produce compile-time artefacts and both run during
`pnpm type-gen`. The generation workspace is the natural home for both. They
are partitioned internally (different directories, different barrel exports)
but do not need separate packages — the boundary between them is a directory
boundary, not a package boundary.

### Consumer model — generation as shared foundation

The generation package becomes a shared foundation for type information. Both
`@oaknational/curriculum-sdk` (runtime) and `@oaknational/oak-search-sdk` can
depend on generation for types, guards, enums, and schemas. The runtime SDK is
for accessing data (API client, middleware); generation is for information
*about* data (types, schemas, readers, extractors, generated artefacts).

**No thin facade**: The runtime `public/bulk` re-export surface is removed.
Consumers that need type information import directly from
`@oaknational/curriculum-sdk-generation`. This is the intended pattern — direct
dependency on generation for type infrastructure.

**Search CLI impact**: The 22 files currently importing from
`@oaknational/curriculum-sdk/public/bulk` are rewired to import from
`@oaknational/curriculum-sdk-generation`.

**Caching and staleness**: Bulk download caching (cache location, staleness
detection) is deferred to the vocabulary convergence pipeline (D2). The
generation workspace provides the infrastructure; caching strategy is designed
when the converged pipeline is built.

---

## D2. Vocabulary / Synonym / Alias Mining Convergence

### Current fragmented landscape

| Source | Location | What it produces | When it runs |
|---|---|---|---|
| Curated synonyms | `src/mcp/synonyms/*.ts` (17 subject files) | ~580 hand-curated synonym entries | Manual edits |
| Mined definition synonyms | `src/mcp/synonyms/generated/definition-synonyms.ts` | 397 entries from keyword definitions | `pnpm vocab-gen` |
| Synonym miner code | `src/bulk/generators/synonym-miner.ts` AND `vocab-gen/generators/synonym-miner.ts` (duplicated) | Produces `definition-synonyms.ts` | `pnpm vocab-gen` |
| Planned bucket classification | `vocabulary-mining.md` Phase 1 | Classify ~580 entries into Alias/Paraphrase/Sense-bound/Relationship | Not started |
| Planned paraphrases | `natural-language-paraphrases.md` | Query-time expansions (Bucket B) | Not started |
| Search-SDK synonyms | Index configuration in `oak-search-sdk` | ES synonym sets for search indexes | Index creation |

### User direction

Converge into a **single, definitive mining pipeline** at type-gen time that
mines all three knowledge sources:

1. **OpenAPI spec** — endpoint names, parameter names, enum values, descriptions
2. **Bulk-downloads JSON Schema** — field names, type descriptions, enum values
3. **Bulk download data** — the actual curriculum content where implicit domain
   knowledge is encoded (definitions, transcript patterns, entity relationships)

This subsumes the current `vocab-gen`, the planned vocabulary-mining.md work,
and the planned natural-language-paraphrases.md work. The output is a single
set of typed artefacts consumed by MCP servers, search indexes, and query
processing.

### Relationship to `definition-synonyms.ts`

`definition-synonyms.ts` is a generated file (397 entries) produced by
`vocab-gen`'s synonym miner. It mines "also known as" and similar patterns
from keyword definitions in bulk data. Quality is variable — some entries are
noise (e.g., Spanish verb conjugations mapped as "synonyms"). This file would
be subsumed by the converged mining pipeline.

### Decision (resolved 23 Feb 2026)

**Proceed with the split as planned.** The converged mining pipeline (OpenAPI +
JSON Schema + bulk data) is larger work for after the split. The generation
workspace's public API must use barrel exports (not specific file paths) to
accommodate future convergence without breaking consumers.

The vocabulary convergence work is deferred but the split boundary placement
does not need to change — moving all bulk infrastructure to generation (D1)
naturally places the extraction and generation code where the converged pipeline
will eventually live.

---

## D3. Phase 3 Move List Refinement (D1 Scope)

### Issue

The canonical plan's Phase 3 lists files to move, but mixes three categories:

| File | Category | Action |
|---|---|---|
| `*-graph-data.ts` (misconception, prerequisite, vocabulary, nc-coverage, thread-progression) | Generated by `vocab-gen` | Move to generation workspace |
| `property-graph-data.ts` | **Authored** domain knowledge (explicitly states "authored" in JSDoc) | Remains runtime? Or move as authored content? |
| `definition-synonyms.ts` | Generated by `vocab-gen` | Move to generation workspace |
| `aggregated-thread-progressions.ts` | **Runtime composition** (wraps generated data) | Stays runtime per D3 |
| `aggregated-prerequisite-graph.ts` | **Runtime composition** (wraps generated data) | Stays runtime per D3 |

### Decision (resolved 23 Feb 2026)

1. **`property-graph-data.ts` moves to generation.** Although authored (not
   generated), it is domain ontology that belongs alongside the generated graph
   data. It will be reclassified as authored domain content within the generation
   workspace.
2. **`aggregated-thread-progressions.ts` stays runtime.** Runtime composition
   per preserved decision D3.
3. **`aggregated-prerequisite-graph.ts` stays runtime.** Runtime composition
   per preserved decision D3.
4. **All `*-graph-data.ts` and `definition-synonyms.ts` move to generation.**
   Generated artefacts.

The Phase 3 file list in the canonical plan is updated to reflect these
classifications.

---

## D4. Baseline Gate Strategy

### Issue

AC1 hard-codes file counts (`type-gen=192`, `src=302`, `generated=106`,
`imports=56`). The plan's own risk section says "refresh Section 4 metrics
before file moves." This creates a contradiction: the AC demands exact numbers
that will drift with unrelated branch work.

### Options

1. **Commit-anchored evidence**: replace fixed numbers with "snapshot evidence
   file committed at Phase 0 completion + command replay matches at Phase 1
   start."
2. **Range tolerance**: keep numbers but allow ±5% drift with mandatory refresh.
3. **Keep as-is**: accept that numbers may need updating before Phase 1 starts.

### Decision (resolved 23 Feb 2026)

**Option 1: commit-anchored evidence.** Create a
`sdk-workspace-separation-baseline.json` committed alongside Phase 0
completion. AC1 becomes "command replay matches committed baseline." This
eliminates drift from unrelated branch work and makes the baseline
reproducible without hard-coded numbers.

---

## D5. Phase Collapse Evaluation

### Issue

Barney recommended collapsing Phases 2+3+4 into one atomic
"move + rewire + boundary enforcement" slice to avoid fragile intermediate
states where the codebase is partially split.

### Trade-offs

| Approach | Pro | Con |
|---|---|---|
| Atomic (2+3+4 merged) | No fragile intermediate state; simpler rollback | Larger single change; harder to review; harder to TDD incrementally |
| Sequential (current) | Smaller reviewable units; TDD red-green-refactor per phase | Intermediate states may not compile; requires careful ordering |

### Decision (resolved 23 Feb 2026)

**Keep sequential phases with intermediate compilation gates.** Each phase must
end with `pnpm build && pnpm type-check` passing. This preserves incremental
TDD red-green-refactor per phase while preventing fragile intermediate states.
The atomic collapse is rejected because it would make the change harder to
review and harder to TDD incrementally.

---

## Resolved Decisions (applied to canonical plan)

### From adversarial review (22 Feb 2026)

- [x] Reverse-dependency inventory expanded from 1 to 9 files (Section 5)
- [x] Auth ADRs moved to background context (Section 3)
- [x] "No deep imports" acceptance criterion added (AC5)
- [x] Root script wiring risk added (Section 11)
- [x] Legacy plan superseded, ADR-108 link updated
- [x] `property-graph-data.ts` added to Phase 3 file list (ownership confirmed
  in D3 below: moves to generation as authored domain ontology)
- [x] Baseline src count refreshed from 300 to 302

### Pre-Phase-1 decisions (resolved 23 Feb 2026)

- [x] **D1**: All of `src/bulk/` moves to generation. Generation becomes shared
  foundation for type information. No runtime facade — consumers import
  directly from generation for types, schemas, readers, extractors. Search CLI
  (22 files) rewired to `@oaknational/curriculum-sdk-generation`. Caching
  strategy deferred to vocabulary convergence pipeline.
- [x] **D2**: Proceed with the split as planned. Converged mining pipeline is
  post-split work. Generation public API uses barrel exports to accommodate
  future convergence.
- [x] **D3**: `property-graph-data.ts` moves to generation (authored domain
  ontology). `aggregated-*` files stay runtime (composition). Phase 3 file
  list updated accordingly.
- [x] **D4**: Commit-anchored evidence file replaces hard-coded baseline
  numbers. AC1 becomes "command replay matches committed baseline."
- [x] **D5**: Keep sequential phases with intermediate compilation gates
  (`pnpm build && pnpm type-check` after each phase). Atomic collapse
  rejected.

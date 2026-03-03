# SDK Codegen Architectural Analysis

**Date**: 2026-03-02
**Scope**: `packages/sdks/oak-sdk-codegen/` — complete structural and dependency analysis
**Purpose**: Inform the curriculum graphs architecture redesign and the broader
separation of concerns within the codegen workspace.

> **M1 Update (2026-03-02)**: The graph data duplication described in §2, §3.2,
> and §4.1 has been resolved. vocab-gen now writes directly to
> `src/generated/vocab/`, the six duplicate files in `src/mcp/` have been
> deleted, and `src/vocab.ts` has been split into `./vocab` (types + concept
> graph) and `./vocab-data` (runtime graph data). The workspace now has 13
> subpath exports. The analysis below reflects the pre-fix state; the remaining
> issues (generator duplication §4.2, extractor overlap §4.3, workspace
> decomposition §7) are still applicable.

---

## 1. What This Workspace Does

`oak-sdk-codegen` is the generation-time workspace for the Oak Curriculum SDK. It
has three distinct responsibilities that are currently entangled:

1. **Type generation from OpenAPI** — transforms the upstream API schema into
   TypeScript types, Zod schemas, MCP tool descriptors, and search index mappings
2. **Curriculum graph generation** — processes bulk download data to produce
   static knowledge graphs (prerequisite, misconception, vocabulary, thread
   progression, NC coverage) and mined synonym data
3. **Runtime data and type exports** — ships generated types, generated data,
   hand-authored synonyms, and hand-authored domain models to consumers via 12
   subpath exports

---

## 2. Current Structure

### 2.1 Directory Layout

```
packages/sdks/oak-sdk-codegen/
├── code-generation/           # OpenAPI → types pipeline (hand-authored generators)
│   ├── codegen.ts             #   Entry: OpenAPI → api-schema types
│   ├── zodgen.ts              #   Entry: SDK schema → Zod schemas
│   ├── bulkgen.ts             #   Entry: → bulk Zod schemas
│   ├── typegen/               #   Templates for each generation target
│   ├── adapter/               #   OpenAPI → endpoint definitions
│   └── lib/                   #   Shared utilities
│
├── vocab-gen/                 # Curriculum graph pipeline (hand-authored generators)
│   ├── run-vocab-gen.ts       #   CLI entry point
│   ├── vocab-gen.ts           #   Pipeline orchestrator
│   ├── vocab-gen-core.ts      #   Core extraction logic
│   ├── extractors/            #   7 extractors (SUBSET of src/bulk/extractors/)
│   ├── generators/            #   8 generators (DUPLICATE of src/bulk/generators/)
│   └── lib/                   #   Re-exports from src/bulk (schemas, reader)
│
├── src/                       # Build boundary (only this ships in dist/)
│   ├── index.ts               #   Root barrel
│   ├── api-schema.ts          #   Subpath barrel: @oaknational/sdk-codegen/api-schema
│   ├── mcp-tools.ts           #   Subpath barrel: @oaknational/sdk-codegen/mcp-tools
│   ├── search.ts              #   Subpath barrel: @oaknational/sdk-codegen/search
│   ├── zod.ts                 #   Subpath barrel: @oaknational/sdk-codegen/zod
│   ├── bulk.ts                #   Subpath barrel: @oaknational/sdk-codegen/bulk
│   ├── vocab.ts               #   Subpath barrel: @oaknational/sdk-codegen/vocab
│   ├── synonyms.ts            #   Subpath barrel: @oaknational/sdk-codegen/synonyms
│   ├── query-parser.ts        #   Subpath barrel: @oaknational/sdk-codegen/query-parser
│   ├── observability.ts       #   Subpath barrel: @oaknational/sdk-codegen/observability
│   ├── admin.ts               #   Subpath barrel: @oaknational/sdk-codegen/admin
│   ├── widget-constants.ts    #   Subpath barrel: @oaknational/sdk-codegen/widget-constants
│   ├── synonym-export.ts      #   Synonym export utilities
│   │
│   ├── types/
│   │   ├── helpers/           #   Hand-authored type utilities
│   │   └── generated/         #   OUTPUT of code-generation/ (~125 files, ~39K lines)
│   │       ├── api-schema/    #     OpenAPI types, MCP tool descriptors
│   │       ├── bulk/          #     Bulk download Zod schemas
│   │       ├── search/        #     Search index schemas, ES mappings
│   │       ├── zod/           #     Curriculum Zod schemas
│   │       ├── observability/ #     Telemetry schemas
│   │       ├── admin/         #     Admin stream schemas
│   │       └── query-parser/  #     Query parser schemas
│   │
│   ├── generated/
│   │   └── vocab/             #   OUTPUT copy of vocab-gen/ (~7 files, ~344K lines)
│   │       ├── index.ts
│   │       ├── *-graph-data.ts
│   │       └── synonyms/
│   │
│   ├── mcp/                   #   SECOND OUTPUT copy + hand-authored property graph
│   │   ├── property-graph-data.ts        # Hand-authored (324 lines)
│   │   ├── property-graph-data.unit.test.ts  # Hand-authored
│   │   ├── *-graph-data.ts               # DUPLICATE of generated/vocab/ (~344K lines)
│   │   └── synonyms/generated/           # DUPLICATE of generated/vocab/synonyms/
│   │
│   ├── bulk/                  #   Bulk pipeline infrastructure
│   │   ├── index.ts           #     Barrel
│   │   ├── reader.ts          #     File discovery and parsing
│   │   ├── processing.ts      #     Orchestration
│   │   ├── extractors/        #     16 extractors (SUPERSET of vocab-gen/extractors/)
│   │   └── generators/        #     8 generators (DUPLICATE of vocab-gen/generators/)
│   │
│   └── synonyms/              #   Hand-authored synonym data (24 files, ~2.8K lines)
│       ├── index.ts
│       └── *.ts               #   Per-subject synonym files
│
├── tsconfig.json              # Wide scope: src/ + code-generation/ + vocab-gen/
├── tsconfig.build.json        # Narrow scope: rootDir=./src, only src/**/*
├── tsconfig.lint.json         # Type-check only (no emit)
├── eslint.config.ts           # Boundary rules + generated file overrides
├── vitest.config.ts           # Covers src/ + code-generation/ + vocab-gen/
└── package.json               # 12 subpath exports, all from dist/
```

### 2.2 Size Analysis

| Category | Files | Lines | Notes |
|----------|-------|-------|-------|
| Generated data (duplicated) | 13 | ~688,000 | Two copies of 5 graphs + synonyms |
| Generated code | ~125 | ~39,000 | `src/types/generated/` from `pnpm sdk-codegen` |
| Code-generation pipeline | ~195 | ~23,000 | `code-generation/` — OpenAPI generators |
| Vocab-gen pipeline | 37 | ~5,400 | `vocab-gen/` — curriculum graph generators |
| Hand-authored runtime | ~50 | ~5,400 | `src/` minus generated content |
| **Total** | **~420** | **~760,000** | ~90% is generated data |

### 2.3 Build Boundary

`tsconfig.build.json` defines the build boundary:

- **`rootDir: ./src`** — only `src/` content compiles to `dist/`
- **`include: ["src/**/*"]`** — nothing outside `src/` ships to consumers
- **`code-generation/` and `vocab-gen/`** are outside the build boundary. They
  run as `tsx` scripts at generation time but their code never appears in `dist/`.

This is the fundamental constraint: anything consumers import via
`@oaknational/sdk-codegen/*` must live under `src/`.

---

## 3. The Three Pipelines

### 3.1 OpenAPI Type Generation (`code-generation/`)

```
Upstream OpenAPI schema (HTTP or cached JSON)
    ↓
code-generation/codegen.ts  →  src/types/generated/api-schema/  (~90 files)
code-generation/zodgen.ts   →  src/types/generated/zod/         (~4 files)
code-generation/bulkgen.ts  →  src/types/generated/bulk/        (~2 files)
```

**Triggered by**: `pnpm sdk-codegen`
**Inputs**: OpenAPI JSON schema
**Outputs to**: `src/types/generated/` (inside build boundary)
**Consumers**: All downstream workspaces via 8 subpath exports

This pipeline is well-structured. Generators live outside `src/`, outputs live
inside `src/`, and the separation is clean. The generators are never shipped to
consumers — they are build-time tooling.

### 3.2 Curriculum Graph Generation (`vocab-gen/`)

```
Bulk download JSON files (apps/oak-search-cli/bulk-downloads/)
    ↓
vocab-gen/run-vocab-gen.ts
    ↓
vocab-gen/extractors/  →  intermediate data
    ↓
vocab-gen/generators/  →  src/mcp/*.ts  (the PRIMARY output location)
                           ↓
                       src/generated/vocab/*.ts  (MANUAL COPY, stale)
```

**Triggered by**: `pnpm vocab-gen`
**Inputs**: Bulk download JSON from the search CLI
**Outputs to**: `src/mcp/` (inside build boundary, mixed with hand-authored code)
**Consumers**: `oak-curriculum-sdk` via `@oaknational/sdk-codegen/vocab`

This pipeline has three problems:

1. **Output location is wrong**: `src/mcp/` mixes generated data with the
   hand-authored property graph. There is no clear boundary.
2. **Manual copy created duplication**: Someone copied the output to
   `src/generated/vocab/` (where the barrel imports from) but the pipeline
   still writes to `src/mcp/`. No automated sync exists.
3. **Generator code is duplicated**: The exact same generators exist in both
   `vocab-gen/generators/` AND `src/bulk/generators/`. Neither is canonical.

### 3.3 Bulk Processing Pipeline (`src/bulk/`)

```
Bulk download JSON files
    ↓
src/bulk/reader.ts      →  parsed bulk data
    ↓
src/bulk/extractors/    →  extracted curriculum features (16 extractors)
    ↓
src/bulk/processing.ts  →  processed result
    ↓
src/bulk/generators/    →  graph data files (same generators as vocab-gen/)
```

**Triggered by**: The search CLI's ingest pipeline (`pnpm es:ingest`)
**Inputs**: Same bulk download JSON
**Consumers**: `oak-search-cli` via `@oaknational/sdk-codegen/bulk`

This pipeline shares extractors and generators with `vocab-gen/` but is consumed
differently: the search CLI imports generator functions at runtime to mine
synonyms during indexing. The `vocab-gen/` pipeline uses the same generators to
produce static data files.

---

## 4. Duplication Inventory

### 4.1 Generated Data (TWO COPIES)

| File | Lines | Location A (`src/mcp/`) | Location B (`src/generated/vocab/`) |
|------|-------|------------------------|-------------------------------------|
| vocabulary-graph-data.ts | 113,233 | ✅ vocab-gen writes here | ✅ barrel imports from here |
| misconception-graph-data.ts | 121,776 | ✅ | ✅ |
| nc-coverage-graph-data.ts | 56,881 | ✅ | ✅ |
| prerequisite-graph-data.ts | 46,320 | ✅ | ✅ |
| thread-progression-data.ts | 5,324 | ✅ | ✅ |
| definition-synonyms.ts | 453 | ✅ | ✅ |
| **Total duplicated** | **~344,000** | | |

Files are identical or near-identical. The `src/mcp/` copy is the pipeline output;
the `src/generated/vocab/` copy is what the barrel imports. No mechanism connects them.

### 4.2 Generator Code (TWO COPIES)

| Generator | `vocab-gen/generators/` | `src/bulk/generators/` | Difference |
|-----------|----------------------|----------------------|------------|
| prerequisite-graph-generator.ts | ✅ | ✅ | Identical |
| thread-progression-generator.ts | ✅ | ✅ | Identical |
| write-graph-file.ts | ✅ | ✅ | Identical |
| vocabulary-graph-generator.ts | ✅ | ✅ | Near-identical (eslint comments) |
| misconception-graph-generator.ts | ✅ | ✅ | Near-identical (eslint comments) |
| nc-coverage-generator.ts | ✅ | ✅ | Near-identical (eslint comments) |
| synonym-miner.ts | ✅ | ✅ | Near-identical (eslint comments) |
| analysis-report-generator.ts | ✅ | ✅ | Near-identical (eslint comments) |

### 4.3 Extractor Code (PARTIAL OVERLAP)

**7 shared extractors** (near-identical, only import paths differ):
keyword, misconception, learning-point, teacher-tip, prior-knowledge,
nc-statement, thread.

**8 extractors unique to `src/bulk/extractors/`** (no duplicate):
supervision-level, unit-description, pupil-outcome, transcript,
why-this-why-now, year-phase, content-guidance, unit-lesson.

The unique extractors serve the search indexing pipeline. The shared
extractors are used by both graph generation and search indexing.

---

## 5. Consumer Map

### 5.1 Subpath Usage by Workspace

| Subpath | oak-curriculum-sdk | oak-search-sdk | oak-search-cli | oak-mcp-http |
|---------|-------------------|----------------|----------------|--------------|
| `.` (main) | | ✅ (2 files) | | |
| `api-schema` | ✅ (25 files) | | | |
| `mcp-tools` | ✅ (8 files) | | | |
| `search` | ✅ (8 files) | ✅ (11 files) | ✅ (16 files) | ✅ (4 files) |
| `zod` | ✅ (6 files) | | ✅ (1 file) | ✅ (1 file) |
| `bulk` | | | ✅ (14 files) | |
| `vocab` | ✅ (6 files) | | | |
| `synonyms` | | ✅ (1 file) | ✅ (3 files) | |
| `widget-constants` | ✅ (8 files) | | | |
| `observability` | | ✅ (3 files) | ✅ (1 file) | |
| `query-parser` | — | — | — | — |
| `admin` | — | — | — | — |

### 5.2 What Each Consumer Actually Needs

**`@oaknational/sdk-codegen/vocab`** — only 6 files in oak-curriculum-sdk:
- Runtime data values: `threadProgressionGraph`, `prerequisiteGraph`, `conceptGraph`
- Types: `ConceptGraph`, `ConceptId`, `ConceptCategory`, `ConceptEdge`
- NO generator functions imported through this path

**`@oaknational/sdk-codegen/bulk`** — only oak-search-cli:
- Types: `Unit`, `Lesson`, `BulkDownloadFile`, `BulkFileResult` (from schemas/reader)
- Runtime: `readAllBulkFiles` (from reader)
- Runtime: `generateMinedSynonyms` (from generators — ONE function)
- Types: `MinedSynonymsData`, `ExtractionStats` (from generators)

**Key finding**: Only ONE generator function (`generateMinedSynonyms`) is
consumed by an external workspace at runtime. All other generator functions are
used only internally by the vocab-gen pipeline.

---

## 6. Identified Domains

### Domain 1: OpenAPI Schema Transformation

**Concern**: Transform upstream OpenAPI schema into TypeScript types, Zod
schemas, MCP tool descriptors, and search index contracts.

**Current location**: `code-generation/` (generators) → `src/types/generated/` (output)

**Subpath exports**: `api-schema`, `mcp-tools`, `search`, `zod`, `observability`,
`admin`, `query-parser`, `widget-constants`, plus parts of `.` (main)

**Assessment**: Well-separated. Generators are outside `src/`, output is inside.
The only concern is that `code-generation/` is not under `src/`, which means
this generator code is not treated as first-class (no build output, no lint
boundary enforcement via the build config).

### Domain 2: Curriculum Graph Generation

**Concern**: Process bulk curriculum data to produce static knowledge graphs
and mined synonym data.

**Current location**: Split across `vocab-gen/` (pipeline orchestration +
duplicate generators/extractors) and `src/bulk/` (canonical extractors +
duplicate generators) and `src/generated/vocab/` + `src/mcp/` (duplicate output).

**Subpath exports**: `vocab` (graph data), `bulk` (generators, extractors,
reader, schemas for search CLI)

**Assessment**: Severely entangled. Three-way duplication, no clear canonical
location, output mixed with hand-authored code.

### Domain 3: Bulk Data Infrastructure

**Concern**: Parse bulk download files, extract curriculum features, provide
schemas and reader utilities for the search indexing pipeline.

**Current location**: `src/bulk/` (schemas, reader, extractors, processing) —
but also contains duplicate generators that belong to Domain 2.

**Subpath exports**: `bulk`

**Assessment**: The schemas, reader, and search-specific extractors (the 8
unique to `src/bulk/`) are clean. The shared extractors (7 duplicated in
`vocab-gen/`) and generators (8 duplicated) create the entanglement.

### Domain 4: Synonym Management

**Concern**: Curate and export curriculum synonyms for Elasticsearch.

**Current location**: `src/synonyms/` (curated data), `src/synonym-export.ts`
(export utilities), `src/synonyms.ts` (barrel)

**Subpath exports**: `synonyms`

**Assessment**: Clean and self-contained.

### Domain 5: Hand-Authored Domain Models

**Concern**: The curriculum property graph (concept relationships) — a
hand-authored domain model, not a generated artefact.

**Current location**: `src/mcp/property-graph-data.ts` — mixed in with
generated graph data in `src/mcp/`.

**Subpath exports**: via `vocab` barrel

**Assessment**: The file is clean but its location creates confusion. It
sits alongside generated data, making `src/mcp/` appear to be entirely
generated output.

---

## 7. The Entanglement in Detail

### 7.1 Why `code-generation/` and `vocab-gen/` Are Outside `src/`

The current architecture treats generators as build-time scripts that are NOT
part of the package output. This was a deliberate choice reflected in:

- `tsconfig.build.json`: `rootDir: ./src`, `include: ["src/**/*"]`
- `package.json` scripts: generators run via `tsx` (interpreted, not compiled)
- `package.json` exports: all point to `dist/` (compiled from `src/`)

**The problem**: This creates an artificial barrier. The generators contain
real engineering — pure functions, typed interfaces, tested logic. Keeping them
outside `src/` means:

1. They are not linted with the same boundary rules as runtime code
2. They cannot export types to consumers (the search CLI needs generator types)
3. Their interfaces are duplicated inside `src/` to make them available to consumers
4. They have relaxed ESLint rules (`complexity`, `max-lines-per-function`)

### 7.2 The Duplication Cascade

```
vocab-gen/generators/           ← Generator logic (runs at gen-time via tsx)
    │
    │  DUPLICATED because...
    │
src/bulk/generators/            ← Same logic (must be in src/ to ship in dist/)
    │
    │  PRODUCES output that goes to...
    │
src/mcp/*-graph-data.ts         ← Primary output location (vocab-gen writes here)
    │
    │  MANUALLY COPIED because...
    │
src/generated/vocab/*-data.ts   ← Where the barrel actually imports from
```

The root cause is the build boundary: generators must be in `src/` to ship types
and functions to consumers, but they were placed outside `src/` as "scripts".
Someone then copied the generators into `src/bulk/generators/` to make them
available, and manually copied the output to `src/generated/vocab/` to match
the barrel imports.

### 7.3 The Generated Output Placement Problem

`src/types/generated/` is the correct pattern for generated code: it is inside
the build boundary, clearly marked as generated, and has appropriate ESLint
overrides.

`src/generated/vocab/` attempted to follow the same pattern for generated data,
but the pipeline (`vocab-gen/run-vocab-gen.ts`) writes to `src/mcp/` instead.
The two locations were never reconciled.

---

## 8. Ideal Separation of Concerns

### Principle: Generator Code Is First-Class Code

Generator code should live inside `src/` alongside the code it generates. The
`code-generation/` and `vocab-gen/` directories should be inside `src/`, not
outside it. This means:

1. Generator logic is subject to the same lint rules as runtime code
2. Generator types can be exported to consumers without duplication
3. Generator tests are part of the same test suite
4. The build boundary includes everything

### Principle: Generated Output Lives Outside `src/`

Generated DATA files (~688K lines of static graph data, ~39K lines of types)
should NOT be in `src/`. They are artefacts, not source code. Linting them
provides negligible value and causes OOM. They should be:

1. In a clearly separate directory (e.g. `generated/` at the package root)
2. Excluded from ESLint entirely
3. Included in the build via tsconfig paths or explicit `dist/` copying
4. Clearly marked as "do not edit"

### Principle: One Copy of Everything

No file should exist in two locations. The pipeline writes to one location.
The barrel imports from that location. Consumer types come from the same source
that defines the runtime values.

### Proposed Domain Split

```
packages/sdks/oak-sdk-codegen/
├── src/                           # ALL source code (generators + runtime)
│   ├── api-codegen/               #   Domain 1: OpenAPI → types (was code-generation/)
│   │   ├── codegen.ts
│   │   ├── zodgen.ts
│   │   ├── bulkgen.ts
│   │   ├── typegen/
│   │   └── ...
│   │
│   ├── graph-gen/                 #   Domain 2: Bulk data → curriculum graphs (was vocab-gen/)
│   │   ├── run-graph-gen.ts
│   │   ├── graph-gen.ts
│   │   ├── extractors/            #     ALL extractors (merged, no duplicates)
│   │   └── generators/            #     ALL generators (merged, no duplicates)
│   │
│   ├── bulk/                      #   Domain 3: Bulk data infrastructure
│   │   ├── schemas.ts             #     Zod schemas for bulk files
│   │   ├── reader.ts              #     File discovery and parsing
│   │   └── processing.ts          #     Orchestration
│   │
│   ├── synonyms/                  #   Domain 4: Curated synonym data
│   │   └── ...
│   │
│   ├── domain-models/             #   Domain 5: Hand-authored domain models
│   │   └── curriculum-property-graph.ts
│   │
│   ├── types/
│   │   └── helpers/               #   Hand-authored type utilities
│   │
│   └── barrels/                   #   All subpath barrels (or keep at src/ root)
│       ├── index.ts
│       ├── api-schema.ts
│       ├── mcp-tools.ts
│       └── ...
│
├── generated/                     # ALL generated output (outside src/)
│   ├── types/                     #   Output of api-codegen/ (was src/types/generated/)
│   │   ├── api-schema/
│   │   ├── bulk/
│   │   ├── search/
│   │   └── ...
│   │
│   └── curriculum-graphs/         #   Output of graph-gen/ (was src/generated/vocab/ + src/mcp/)
│       ├── prerequisite-graph-data.ts
│       ├── thread-progression-graph-data.ts
│       ├── misconception-graph-data.ts
│       ├── vocabulary-graph-data.ts
│       ├── national-curriculum-coverage-graph-data.ts
│       └── synonyms/
│
├── tsconfig.json                  # Wide scope for checking
├── tsconfig.build.json            # rootDir: . (or src/ with path mapping)
└── package.json                   # Updated exports
```

### Key Changes from Current to Ideal

| Change | Rationale |
|--------|-----------|
| Move `code-generation/` → `src/api-codegen/` | First-class code, inside build boundary |
| Move `vocab-gen/` → `src/graph-gen/` | First-class code, inside build boundary |
| Merge extractors into `src/graph-gen/extractors/` | One copy, search-specific extractors included |
| Delete `src/bulk/generators/` | Duplicate eliminated |
| Delete `src/bulk/extractors/` | Moved to `src/graph-gen/extractors/` |
| Move `src/types/generated/` → `generated/types/` | Generated output outside src/ |
| Move `src/generated/vocab/` → `generated/curriculum-graphs/` | Single copy, outside src/ |
| Delete `src/mcp/*-graph-data.ts` | Duplicate eliminated |
| Move property graph → `src/domain-models/` | Clear separation from generated data |
| Update `rootDir` in tsconfig.build.json | Accommodate generators inside src/ |
| Update ESLint ignores | `generated/` excluded from lint entirely |
| `src/bulk/` retains schemas, reader, processing only | Clean domain boundary |

### Build Boundary Implications

Moving generators into `src/` means `tsconfig.build.json` must accommodate them.
Two approaches:

**Option A**: Keep `rootDir: ./src` — generators are inside src/, build works
unchanged. Generated output at `generated/` is outside src/ and needs explicit
inclusion in the build via tsconfig paths or a post-build copy step.

**Option B**: Change `rootDir: .` — both src/ and generated/ are in scope.
The dist/ output mirrors the source tree structure. Package.json exports would
need to reference `dist/src/` paths.

Option A is simpler. The generated types (which consumers need) can be included
via tsconfig path mappings or by having the barrels import from `../generated/`
at runtime (with appropriate tsconfig resolution).

---

## 9. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Moving `code-generation/` into `src/` may trigger new lint violations | Medium | The directory already has relaxed rules; carry them forward |
| `rootDir` change breaks all package.json export paths | High | Option A avoids this; keep `rootDir: ./src` |
| `generated/` outside `src/` breaks runtime imports from barrels | High | Barrels use relative paths; test with build + consumer import |
| Extractor merge creates a larger directory | Low | Clear naming; extractors already have individual files |
| Search CLI import of `generateMinedSynonyms` must survive the move | High | Verify the import path resolves through the new barrel |

---

## 10. Relationship to the Release Plan

The release plan's original §Curriculum Graphs Architecture Redesign described
phases 0-7 for fixing the graph data duplication and naming (now replaced by
§ESLint OOM Fix for M1; full phases captured in the strategic plan). This analysis reveals
that the scope is broader: the data duplication is a symptom of the
code-generation architecture not being completed. The phases in the release
plan address the data layer; a proper fix also addresses the generator layer.

The release plan's phases remain valid but should be sequenced after the
generator consolidation, not before. Specifically:

1. **First**: Bring generators into `src/` (make them first-class)
2. **Then**: Consolidate generated output to a single location
3. **Then**: Fix naming (vocab → curriculum-graphs)
4. **Then**: Verify lint passes without NODE_OPTIONS

This ordering eliminates the build boundary constraint that blocks the release
plan's Phase 4 (consolidate generators) — if generators are already inside
`src/`, there is no path problem.

---

## References

- [Release Plan M1](../../archive/completed/release-plan-m1.plan.md) — §ESLint OOM Fix
- [Session Continuation](../../../prompts/archive/session-continuation.prompt.md)
- [Schema-First Execution](../../../directives/schema-first-execution.md)
- [Rules](../../../directives/rules.md)
- [Distilled Learnings](../../../memory/distilled.md) — generator duplication noted

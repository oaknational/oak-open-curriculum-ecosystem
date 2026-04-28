# SDK Codegen Workspace Decomposition

**Last Updated**: 2026-04-24
**Lane**: `future/` — strategic brief, post-M1 merge
**Scope**: Decompose `oak-sdk-codegen` into two focused workspaces aligned
with data lineage boundaries

---

## Problem and Intent

`packages/sdks/oak-sdk-codegen` conflates two distinct data lineages in a
single workspace:

**Lineage A — OpenAPI API Schema**:

- Source: `https://open-api.thenational.academy/api/v0/swagger.json`
- Pipeline: `code-generation/codegen.ts`, `zodgen.ts`, `bulkgen.ts`
- Produces: TypeScript types, Zod schemas, MCP tool descriptors, search
  index contracts, ES mappings
- Trigger: `pnpm sdk-codegen`
- Change frequency: API schema changes rarely
- Consumed via: `api-schema`, `mcp-tools`, `search`, `zod`, `observability`,
  `admin`, `query-parser`, `widget-constants`, parts of `.` (main)

**Lineage B — Bulk Curriculum Data**:

- Source: Bulk download JSON files (`apps/oak-search-cli/bulk-downloads/`)
- Pipeline: `vocab-gen/` (to be renamed `graph-gen/`)
- Produces: Curriculum knowledge graphs (prerequisite, misconception,
  vocabulary, NC coverage, thread progression), mined synonym data
- Trigger: `pnpm vocab-gen`
- Change frequency: Each curriculum content update
- Consumed via: `vocab` (to be renamed `curriculum-graphs`), parts of `bulk`,
  `synonyms`

These lineages have different sources, triggers, output characteristics,
change frequencies, and partially different consumers. Mixing them in one
workspace causes:

1. **Lint tooling that must accommodate both** ~39K lines of generated code
   AND ~344K+ lines of generated data — causing ESLint OOM
2. **A build that must rebuild everything** when either source changes
3. **A mental model that conflates** "SDK code generation" with "curriculum
   data mining"
4. **Subpath exports that serve two unrelated purposes** through the same
   package

### Current State (M1 Merge — complete)

The ESLint OOM was resolved structurally during M1:

1. `NODE_OPTIONS=--max-old-space-size=4096` removed from lint scripts
2. vocab-gen output redirected from `src/mcp/` to `src/generated/vocab/`
   (single canonical location)
3. Six orphaned duplicate data files deleted from `src/mcp/`
4. `src/vocab.ts` split: `./vocab` exports types + concept graph only;
   new `./vocab-data` exports runtime graph data
5. `src/generated/vocab/**` and `src/vocab-data.ts` excluded from
   `tsconfig.lint.json` and ESLint ignores

The data duplication is eliminated. The remaining architectural debt
(generator duplication, extractor overlap, workspace decomposition) is the
subject of this plan.

**Practice routing note (2026-04-24)**: the distilled Practice entry about
`src/bulk/generators/` duplicating `vocab-gen/generators/` is owned here.
The non-Planning Practice remediation deliberately did not touch bulk/codegen
DRY work; execute this plan in a separate session when that refactor is active.

---

## Proposed Architecture

### Direction: Two Workspaces

Replace the single `oak-sdk-codegen` workspace with a directory containing
two focused workspaces:

```text
packages/sdks/oak-sdk-codegen/            (simple directory, NOT a workspace)
├── oak-sdk-api-codegen/                  (workspace: @oaknational/sdk-api-codegen)
│   ├── src/
│   │   ├── code-generation/              was code-generation/ at package root
│   │   │   ├── codegen.ts
│   │   │   ├── zodgen.ts
│   │   │   ├── bulkgen.ts
│   │   │   ├── typegen/
│   │   │   └── ...
│   │   ├── types/helpers/                hand-authored type utilities
│   │   └── barrels/                      api-schema.ts, mcp-tools.ts, search.ts, etc.
│   ├── generated/                        OUTPUT of code-generation/ (build artefact)
│   │   ├── api-schema/
│   │   ├── bulk/
│   │   ├── search/
│   │   ├── zod/
│   │   ├── observability/
│   │   ├── admin/
│   │   └── query-parser/
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.ts
│
├── oak-sdk-bulkdata-codegen/             (workspace: @oaknational/sdk-bulkdata-codegen)
│   ├── src/
│   │   ├── graph-gen/                    was vocab-gen/ at package root
│   │   │   ├── run-graph-gen.ts
│   │   │   ├── graph-gen.ts
│   │   │   ├── extractors/              ALL extractors (merged, no duplicates)
│   │   │   └── generators/              ALL generators (merged, no duplicates)
│   │   ├── bulk/                         schemas, reader, processing
│   │   ├── synonyms/                     curated synonym data
│   │   └── domain-models/
│   │       └── curriculum-property-graph.ts  (hand-authored)
│   ├── generated/                        OUTPUT of graph-gen/ (build artefact)
│   │   └── curriculum-graphs/
│   │       ├── prerequisite-graph/       JSON loader (data.json + types.ts + index.ts)
│   │       ├── vocabulary-graph/         JSON loader
│   │       ├── misconception-graph/      JSON loader
│   │       ├── nc-coverage-graph/        JSON loader
│   │       ├── thread-progression-data.ts  (as const — small enough)
│   │       └── synonyms/
│   ├── package.json
│   └── eslint.config.ts
```

### Architectural Principles

1. **Generator code is first-class code** — lives inside `src/`, fully
   linted, tested, and built
2. **Generated output is a build artefact** — lives outside `src/` in
   `generated/`, clearly separated from source code
3. **One copy of everything** — no duplicated generators, no duplicated data
4. **Separation by data lineage** — each workspace has one source, one
   pipeline, and one set of consumers
5. **Build tooling serves the architecture** — `tsconfig` and ESLint adapt
   to the directory structure, not the other way around

### Cross-Lineage Dependency

Analysis found exactly one cross-lineage dependency:

- `src/bulk/extractors/year-phase-extractor.ts` imports `isKeyStage` and
  `type KeyStage` from `../../api-schema.js`

Resolution options:

1. **Thin dependency**: `oak-sdk-bulkdata-codegen` depends on
   `@oaknational/sdk-api-codegen/api-schema` — clean, explicit, small
   surface area
2. **Extract**: Move `KeyStage` and `isKeyStage` to a shared core type,
   since key stages are a fundamental domain concept (but this may violate
   the cardinal rule — types flow from the schema)

Option 1 is simpler and aligns with the cardinal rule.

---

## Domain Boundaries

### oak-sdk-api-codegen

- Owns: OpenAPI schema transformation, type generation, Zod schema
  generation, MCP tool descriptor generation, search index contracts
- Exports: `api-schema`, `mcp-tools`, `search`, `zod`, `observability`,
  `admin`, `query-parser`, `widget-constants`
- Consumers: `oak-curriculum-sdk` (primary), `oak-search-sdk`,
  `oak-search-cli`, `oak-mcp-http`

### oak-sdk-bulkdata-codegen

- Owns: Curriculum graph generation, bulk data processing, synonym
  management, hand-authored domain models
- Exports: `curriculum-graphs` (was `vocab`), `bulk`, `synonyms`
- Consumers: `oak-curriculum-sdk` (graphs), `oak-search-cli` (bulk
  pipeline, synonyms), `oak-search-sdk` (synonyms)

### Not in scope

- `@oaknational/curriculum-sdk` — remains a consumer
- `@oaknational/oak-search-sdk` — remains a consumer
- The search CLI — remains a consumer
- The MCP HTTP server — remains a consumer

---

## Non-Goals

- **No behaviour changes** — consumers see the same types, data, and
  functions; only import paths change
- **No new features** — this is pure structural refactoring
- **No deprecation periods** — replace old imports with new imports in a
  single commit per phase (per principles.md: no compatibility layers)
- **No new ESLint rules** — existing rules apply; the split naturally
  resolves the OOM by separating code from data

---

## Dependencies and Sequencing Assumptions

1. **Prerequisite**: M1 merge must be complete (**SATISFIED** — M1 merged)
2. **Prerequisite**: The 8-phase plan from the release plan (naming changes,
   generator consolidation) can be folded into this decomposition
3. **Assumption**: `pnpm-workspace.yaml` supports the new paths via
   `packages/sdks/oak-sdk-codegen/*`
4. **Assumption**: Turborepo task graph handles the dependency correctly
   (api-codegen runs first, bulkdata-codegen depends on it)

---

## Success Signals

What would justify promotion to `current/`:

1. M1 merge is complete
2. All quality gates pass on `main`
3. Team capacity available for a structural refactoring sprint
4. No higher-priority work (features, bugs) blocking

## Acceptance Criteria (for completion)

These must be true when the decomposition is complete:

1. `pnpm clean && pnpm check` passes without any
   `@oaknational/sdk-codegen#*` turbo overrides
2. B1 tests from the turbo boundary fix plan are resolved:
   - `classify-http-error.unit.test.ts` — with generated api-schema types
   - `generate-subject-hierarchy.unit.test.ts` — with generated search types
   - `mcp-security-policy.unit.test.ts` — with generated mcp-tools types
   - `bulk-schemas.unit.test.ts` — with generated bulk schemas
3. All `@oaknational/sdk-codegen#*` turbo overrides removed from
   `turbo.json` (`#build`, `#test`, `#type-check`, `#lint`, `#lint:fix`)
4. No workspace's tests depend on a generation step within that same
   workspace

---

## Risks and Unknowns

| Risk | Severity | Mitigation |
|------|----------|------------|
| Consumer import paths change across all workspaces | High | Systematic `rg` + replace; type-check catches any missed |
| `pnpm-workspace.yaml` glob may not match nested structure | Medium | Verify with `pnpm ls` before committing |
| Turborepo task dependencies between the two new packages | Medium | Explicit `dependsOn` in `turbo.json` |
| Generated output outside `src/` requires build config changes | Medium | Prototype with `rootDir: .` or tsconfig paths before full migration |
| `generateMinedSynonyms` export path must survive the split | High | Verify search CLI import resolves through new `bulk` barrel |
| ADR-108 may need revision for the new workspace structure | Low | Update ADR-108 to reflect the decomposition rationale |

---

## Promotion Trigger

Promote to `current/` when:

1. M1 has merged to `main` (**SATISFIED**)
2. CI is green on `main`
3. Owner approves the workspace split direction (this plan)

Note: Turbo overrides (`@oaknational/sdk-codegen#build`, `#test`,
`#type-check`, `#lint`, `#lint:fix`) are temporary fixes applied by the
[turbo boundary fix plan](../../semantic-search/archive/completed/turbo-and-codegen-boundary-fix.plan.md).
They accurately declare within-workspace dependencies that exist because
generators, generated output, and runtime code share a workspace. This
decomposition eliminates the need for overrides by separating concerns
into distinct workspaces.

Execution decisions (exact sequencing, phasing, atomic commits) are
finalised during promotion.

---

## Research and Analysis

The following companion documents contain the detailed analysis that
informed this plan:

- [SDK Codegen Architecture Analysis](../sdk-codegen-architecture-analysis.md) —
  complete structural analysis of the current workspace
- [Reviewer Findings and Owner Response](../sdk-codegen-reviewer-findings.md) —
  full findings from Barney, Betty, Fred, Wilma, plus three owner corrections

### Key Findings Summary

From the architecture analysis:

- 688K lines of duplicated generated data (two copies of 5 graphs)
- 8 generators duplicated across `vocab-gen/generators/` and
  `src/bulk/generators/`
- 7 extractors duplicated with only import path differences
- Only ONE generator function (`generateMinedSynonyms`) consumed at runtime
  by an external workspace
- `code-generation/` and `vocab-gen/` outside `src/` but `rootDir: ./src`
  prevents shipping their types

From the reviewer findings:

- All four reviewers confirmed generator duplication as the root structural
  problem
- All four missed the two-source separation of concerns (the fundamental
  issue)
- Betty and Fred argued generated output should stay inside `src/` — owner
  overruled: generated output is a build artefact, not source code
- Wilma identified Phase 4 breaking the search CLI as a P0 blocker
- Fred documented 5 ADR violations in the current structure

From the owner's corrections:

1. Blanket ESLint ignores for generated files are forbidden; narrow
   exception granted for large graph data files only
2. Generated files are build artefacts and belong outside `src/`; the build
   system adapts to the architecture, not the other way around
3. The two-source separation of concerns (OpenAPI vs Bulk Data) is the root
   cause that all reviewers missed

### Mined from Release Plan (M1)

The release plan's "Curriculum Graphs Architecture Redesign" section
(phases 0-7) described the original approach:

- Phase 0: Revert NODE_OPTIONS
- Phase 1: Rename property graph
- Phase 2: Establish single canonical output location
- Phase 3: Rename barrel and subpath (vocab → curriculum-graphs)
- Phase 4: Consolidate generators (delete `src/bulk/generators/` duplicates)
- Phase 5: Rename pipeline (vocab-gen → graph-gen)
- Phase 6: Evaluate linting strategy
- Phase 7: Usage audit for each graph

These phases addressed the data layer but not the generator layer or the
two-source separation. This decomposition plan subsumes and extends them.
The naming changes, generator consolidation, and pipeline rename all fold
naturally into the workspace split.

### Consumer Subpath Usage Map

| Subpath | oak-curriculum-sdk | oak-search-sdk | oak-search-cli | oak-mcp-http | New workspace |
|---------|-------------------|----------------|----------------|--------------|---------------|
| `.` (main) | | 2 files | | | api-codegen |
| `api-schema` | 25 files | | | | api-codegen |
| `mcp-tools` | 8 files | | | | api-codegen |
| `search` | 8 files | 11 files | 16 files | 4 files | api-codegen |
| `zod` | 6 files | | 1 file | 1 file | api-codegen |
| `widget-constants` | 8 files | | | | api-codegen |
| `observability` | | 3 files | 1 file | | api-codegen |
| `bulk` | | | 14 files | | bulkdata-codegen |
| `vocab`/`curriculum-graphs` | 6 files | | | | bulkdata-codegen |
| `synonyms` | | 1 file | 3 files | | bulkdata-codegen |
| `query-parser` | — | — | — | — | api-codegen |
| `admin` | — | — | — | — | api-codegen |

---

## References

- [Architecture analysis](../sdk-codegen-architecture-analysis.md)
- [Reviewer findings](../sdk-codegen-reviewer-findings.md)
- [Release Plan M1](../../../archive/completed/release-plan-m1.plan.md)
- [Rules](../../../../directives/principles.md)
- [Schema-First Execution](../../../../directives/schema-first-execution.md)
- [ADR-108: Workspace Decomposition](../../../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)

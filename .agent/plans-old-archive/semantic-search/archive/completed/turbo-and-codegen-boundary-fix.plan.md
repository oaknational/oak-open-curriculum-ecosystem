---
name: "Turbo Pipeline Fix and SDK-Codegen Boundary Separation"
overview: >
  Fix CI/local turbo inefficiency (phantom tasks, cache contamination, cascading
  deps) and resolve the architectural boundary violation where sdk-codegen
  conflates generators, generated output, and runtime code — causing tests to
  depend on build artifacts and `pnpm clean && pnpm check` to fail.
status: "In Progress — turbo fixes applied, B2 extractions done, B1 deferred to workspace decomposition"
branch: "feat/es_index_update"
---

# Turbo Pipeline Fix and SDK-Codegen Boundary Separation

## Status

**Phase 1 (Turbo fixes)**: Applied, verified locally and via `pnpm clean && pnpm check`.
**Phase 2a (B2 pure-function extraction)**: Complete. Two files extracted to break
transitive generated-type coupling. Three other B2 tests reassessed as having
type-only or no generated-type deps (no extraction needed).
**Phase 2b/2c (B1 resolution + workspace split)**: Deferred to the
[SDK Codegen Workspace Decomposition](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md)
strategic plan. B1 tests are covered by turbo overrides until decomposition.

---

## Phase 1: Turbo Pipeline Fixes (DONE)

### Root Causes Identified and Fixed

#### 1. Phantom sdk-codegen tasks everywhere

Generic `build.dependsOn: ["^build", "sdk-codegen"]` created `<NONEXISTENT>`
phantom tasks for 13/15 packages. Only `@oaknational/sdk-codegen` genuinely
generates types. `@oaknational/agent-tools` had a dummy `echo` script.

**Fix**: Removed same-package `sdk-codegen` from all generic tasks. Added
package-specific override `@oaknational/sdk-codegen#build.dependsOn:
["^build", "sdk-codegen"]`.

| turbo command | Before tasks | Before phantoms | After tasks | After phantoms |
|---|---|---|---|---|
| `build` | 30 | 13 | **16** | **0** |
| `lint` | 45 | 13 | **27** | **0** |
| `type-check` | 41 | 15 | **27** | **0** |
| `test` | 37 | 11 | **27** | **0** |
| CI total | 153 | 52 | **97** | **0** |

#### 2. OAK_API_KEY contaminated build cache keys

`build.passThroughEnv: ["OAK_API_KEY"]` caused different cache keys between
local (key set) and CI (key absent). Only `sdk-codegen` and `test:e2e` use it.

**Fix**: Removed from `build.passThroughEnv`. Remains on `sdk-codegen` and
`test:e2e`.

#### 3. Redundant same-package dependencies

`lint`, `lint:fix`, `type-check`, `doc-gen`, `mutate` had unnecessary
same-package `build` and `sdk-codegen` dependencies beyond what ADR-065
specified.

**Fix**: All verification tasks now depend on `["^build"]` only.

#### 4. Cascading `^` on single-package tasks

`smoke:dev:stub.dependsOn: ["^smoke:dev:stub", ...]` propagated phantom smoke
tasks to all 14 upstream packages (60 tasks, 37 phantom).

**Fix**: Changed to `dependsOn: ["build", "test:e2e"]`. Same fix for all smoke
variants.

#### 5. `--concurrency=2` workaround

`pnpm check` had `--concurrency=2` — a naive workaround that serialised
execution, masking dependency bugs rather than fixing them. With correct
dependencies, concurrency throttling is unnecessary.

**Fix**: Removed `--concurrency=2` from `check` script. User also removed
all other concurrency constraints throughout the codebase.

#### 6. ADR-065 drift

ADR documented different dependencies than implementation.

**Fix**: Updated ADR-065 and `build-system.md` to match corrected turbo.json.

### Changes Applied (Phase 1)

#### turbo.json

- `sdk-codegen.dependsOn`: `["^sdk-codegen", "^build"]` → `["^build"]`
- `build.dependsOn`: `["^build", "sdk-codegen"]` → `["^build"]`
- Added `@oaknational/sdk-codegen#build`: `dependsOn: ["^build", "sdk-codegen"]`
- Added `@oaknational/sdk-codegen#test`: `dependsOn: ["^build", "sdk-codegen"]`
- Removed `build.passThroughEnv: ["OAK_API_KEY"]`
- `lint.dependsOn`: → `["^build"]`
- `lint:fix.dependsOn`: → `["^build"]`
- `type-check.dependsOn`: → `["^build"]`
- `mutate.dependsOn`: → `["^build"]`
- `doc-gen.dependsOn`: → `["^build"]`
- `test:ui.dependsOn`: → `["build"]`
- All smoke variants: removed `^smoke:*`, simplified to `["build"]` or
  `["build", "test:e2e"]`
- Removed `@oaknational/agent-tools#sdk-codegen` override

#### package.json

- Removed `--concurrency=2` from `check` script

#### agent-tools/package.json

- Removed dummy `sdk-codegen` script

#### Test fix

- `generate-tool-file.header.unit.test.ts`: Removed `existsSync` IO call.
  Replaced with pure function test verifying the generator emits the correct
  import path string. No file system access.

### Verification (Phase 1)

All individual gates pass locally:
- `pnpm build` — 16 tasks, 0 phantoms
- `pnpm type-check` — 27 tasks, 0 phantoms
- `pnpm lint` — 27 tasks, 0 phantoms
- `pnpm test` — 27 tasks, 0 phantoms
- `pnpm test:e2e` — 21 tasks
- `pnpm sdk-codegen` — 12 tasks

### Remaining Issue: `pnpm clean && pnpm check` fails

The turbo override `@oaknational/sdk-codegen#test.dependsOn: ["^build",
"sdk-codegen"]` is a TEMPORARY fix that declares a real but architecturally
problematic dependency. Phase 2 addresses the root cause.

---

## Phase 2: SDK-Codegen Boundary Separation (PLANNED)

### Problem Statement

`@oaknational/sdk-codegen` conflates three distinct concerns:

1. **Code generators** — pure functions that transform schemas into TypeScript
   source (codegen.ts, zodgen.ts, bulkgen.ts, vocab-gen/)
2. **Generated output** — TypeScript source files produced by generators
   (src/types/generated/)
3. **Runtime SDK code** — functions that import and use generated types
   (src/bulk/reader.ts, src/synonym-export.ts, classify-http-error, etc.)

This conflation causes:

- Tests for runtime code (3) depend on generation (1) having completed
- Tests that verify generated output (2) import build artifacts
- `pnpm clean` removes generated types, breaking tests that import them
- The turbo override is needed to declare a within-workspace dependency
  that shouldn't exist

### Current Dependency Topology

```
core packages (result, type-helpers, logger, eslint-plugin)
    ↓ ^build
sdk-codegen
  ├── generators: codegen.ts → src/types/generated/api-schema/
  ├── generators: zodgen.ts  → src/types/generated/zod/
  ├── generators: bulkgen.ts → src/types/generated/bulk/
  ├── generators: vocab-gen/ → src/generated/vocab/
  ├── runtime:    src/bulk/reader.ts (imports generated/bulk/)
  ├── runtime:    src/synonym-export.ts (imports generated synonyms)
  ├── TESTS: import from src/types/generated/ ← BREAKS AFTER CLEAN
  └── build → dist/ (all of above compiled together)
    ↓ ^build                            ↓ ^build
oak-curriculum-sdk                 oak-search-sdk
  imports from sdk-codegen:          imports from sdk-codegen:
  - /api-schema (types)              - /search (ES mappings, index docs,
  - /mcp-tools (tool defs)              subject hierarchy, facets)
  - /bulk (bulk types)               - /synonyms (buildElasticsearchSynonyms)
  - /zod (schemas)                   - / (isKeyStage)
  - /vocab (vocabulary)              also depends on: search-contracts
```

### Key Observations

1. **oak-search-sdk** imports `buildElasticsearchSynonyms` from
   `@oaknational/sdk-codegen/synonyms` and `SUBJECT_TO_PARENT`,
   `isKs4ScienceVariant` from `@oaknational/sdk-codegen/search`. These are
   the very functions whose tests in sdk-codegen fail after clean.

2. **The generation sources are distinct**:
   - API types ← OpenAPI schema (codegen.ts, zodgen.ts)
   - Bulk schemas ← bulk download data files (bulkgen.ts)
   - Vocabulary/synonyms ← curriculum content (vocab-gen/)
   - Search types (ES mappings, subject hierarchy) ← need to identify source

3. **No circular references**: The dependency must be strictly linear.
   Generators must not import from their own generated output.

### Design Constraints

1. **No circular dependencies** — generators must never import their own
   generated output. This is the hard constraint.
2. **Clean separation of generators from generated code** — desirable but
   the split axis is open: by data source, processing stage, application
   domain, or any combination that makes sense.
3. **`pnpm clean && pnpm check` must work** — without turbo overrides or
   concurrency workarounds.
4. **The split is not required** if no-circular-dependency can be achieved
   without it. But it is architecturally attractive.

### Split Options (Not Prescriptive)

The split does not have to be purely along the data source (API vs bulk).
Possible axes:

- **By data source**: API codegen vs bulk/vocab codegen
- **By processing stage**: generators (tools) vs generated output (library)
- **By application domain**: general SDK types vs search-specific types vs
  future application areas
- **Hybrid**: any combination that eliminates circular deps and keeps each
  workspace focused

The key constraint is: no workspace's tests should depend on a generation
step within that same workspace. Either generators and generated output are
in separate workspaces (so ^build provides the ordering), or generator tests
are genuinely pure (no imports from generated code).

### Current Dependency Topology for Reference

```
core packages (result, type-helpers, logger, eslint-plugin)
    ↓ ^build
sdk-codegen (currently conflates generators + generated output + runtime)
  ├── generators: codegen.ts → api-schema/, zod/ (OpenAPI source)
  ├── generators: zodgen.ts  → zod schemas (OpenAPI source)
  ├── generators: bulkgen.ts → bulk/ (bulk data source)
  ├── generators: vocab-gen/ → vocab/, synonyms/ (curriculum content source)
  ├── generated:  search/ (ES mappings, subject hierarchy — source TBD)
  ├── runtime:    reader.ts, synonym-export.ts, classify-http-error, etc.
  └── build → dist/
    ↓ ^build                            ↓ ^build
oak-curriculum-sdk                 oak-search-sdk
  imports: /api-schema, /mcp-tools,    imports: /search, /synonyms, /
  /bulk, /zod, /vocab                  also depends on: search-contracts
```

### Open Questions (for design decision)

1. **Which generator produces the search-related types?** ES mappings,
   index document types, subject hierarchy, facets. This determines whether
   they follow the API or bulk/vocab generation path.

2. **Split axis**: by data source, processing stage, application domain,
   or hybrid? Each has trade-offs for import path migration, test placement,
   and future extensibility.

3. **Where do generated-output tests belong?** Tests that verify generated
   code's runtime behaviour (e.g. `classify-http-error.unit.test.ts`) — see
   the test evaluation below for per-test recommendations.

4. **Naming**: If a new workspace is created, what is it called? Should
   reflect its content, not its origin.

### Action Items

#### Phase 2a: B2 pure-function extraction (DONE)

Extracted pure functions from modules with transitive generated-type deps:

- `src/bulk/reader-utils.ts` — extracted `extractSubjectPhase` and
  `SubjectPhase` from `reader.ts`. Test updated to import from
  `reader-utils.js`.
- `vocab-gen/vocab-gen-config.ts` — extracted `createPipelineConfig`,
  `PipelineConfig`, `PipelineConfigInput`, `PipelineResult` from
  `vocab-gen.ts`. Test and `vocab-gen-format.ts` updated.

Three other B2 tests reassessed during implementation:

- `analysis-report-generator.unit.test.ts` (both locations) — `ExtractedData`
  import is `import type` (erased at compile time). Runtime dep is upstream
  `@oaknational/type-helpers` dist/ (Category A, resolved by `^build`). No
  extraction needed.
- `synonym-export.integration.test.ts` — no generated-type dep at all. Runtime
  dep is upstream `@oaknational/type-helpers` and curated synonym data. No
  extraction needed.

Additional fixes discovered during verification:

- `agent-tools/package.json` — added missing `devDependencies` for
  `@oaknational/eslint-plugin-standards` (workspace dependency not declared,
  exposed by removing `--concurrency=2`).
- `turbo.json` — added `@oaknational/sdk-codegen#type-check`,
  `@oaknational/sdk-codegen#lint`, and `@oaknational/sdk-codegen#lint:fix`
  overrides (same pattern as `#build` and `#test`).

#### Phase 2b/2c: DEFERRED to workspace decomposition

All remaining boundary separation work is deferred to the
[SDK Codegen Workspace Decomposition](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md)
strategic plan. That plan already covers:

1. Workspace split axis (by data lineage: API vs bulk/curriculum)
2. Generator and generated output separation
3. Import path migration across consumer workspaces
4. B1 test resolution — tests that import generated code move with their
   code to the workspace that depends on the generator via `^build`
5. Removal of all `@oaknational/sdk-codegen#*` turbo overrides

**B1 tests to resolve during decomposition** (from Appendix A):

| Test | Destination |
|------|-------------|
| `classify-http-error.unit.test.ts` | With generated api-schema types |
| `generate-subject-hierarchy.unit.test.ts` | With generated search types |
| `mcp-security-policy.unit.test.ts` | With generated mcp-tools types |
| `bulk-schemas.unit.test.ts` | With generated bulk schemas |

**Turbo overrides to remove after decomposition**:
`@oaknational/sdk-codegen#build`, `#test`, `#type-check`, `#lint`, `#lint:fix`

---

## Appendix A: Test Evaluation — Does Each Test Prove Product Behaviour?

Each of the 15 failing tests evaluated against the testing strategy: does it
prove product behaviour? Is it at the right level? Should it be kept, moved,
or deleted?

### Category A — Missing upstream dist/ (resolved by turbo ^build)

These tests work correctly under turbo. They fail only when running vitest
directly after clean (unusual workflow). No action needed.

| Test | Proves behaviour? | Level | Verdict |
|---|---|---|---|
| `codegen-core.unit.test.ts` | YES — generator pure functions (createFileMap, postProcessTypesSource) | Correct (unit) | KEEP |
| `zodgen-core.unit.test.ts` | YES — zodgen with DI for IO (ZodgenIO interface, injected fakes) | Correct (unit) | KEEP |
| `zodgen-core.integration.test.ts` | YES — zodgen integration with faked IO | Correct (integration) | KEEP |
| `validate-canonical-urls.unit.test.ts` | YES — URL validation pure functions with fixture data | Correct (unit) | KEEP |
| `validate-canonical-urls.integration.test.ts` | YES — URL validation integration | Correct (integration) | KEEP |

### Category B1 — Direct import of generated code

These tests import from `src/types/generated/` to test generated code's
runtime behaviour. They prove product behaviour (the generated code IS
published SDK), but they test build artifacts. They belong downstream of
the generation boundary.

| Test | Proves behaviour? | Level | Verdict |
|---|---|---|---|
| `classify-http-error.unit.test.ts` | YES — classifyHttpError(404,...) → {kind:'not_found',...}. Published SDK function. | Correct (unit) | KEEP — move downstream |
| `generate-subject-hierarchy.unit.test.ts` | YES — SUBJECT_TO_PARENT maps, isKs4ScienceVariant. Used by search-sdk. | Correct (unit) | KEEP — move downstream |
| `mcp-security-policy.unit.test.ts` | YES — toolRequiresAuth, getScopesSupported. Security policy is product. | Correct (unit) | KEEP — move downstream |
| `bulk-schemas.unit.test.ts` | YES — nullSentinelSchema.parse('NULL')→null. Zod schemas validate real data. | Correct (unit) | KEEP — move downstream |

### Category B2 — Transitive dependency on generated types

These tests test genuinely pure functions or integration code, but the
MODULE they import from has transitive imports to generated types. The
tested functions themselves are often clean.

| Test | Proves behaviour? | Level | Verdict |
|---|---|---|---|
| `reader.unit.test.ts` | YES — extractSubjectPhase('maths-primary.json')→{subject:'maths',phase:'primary'}. Pure function, no generated types in the function itself. | Correct (unit) | KEEP — the function is pure but shares a module with code that imports generated types. Fix: extract to separate file OR move module downstream. |
| `synonym-export.integration.test.ts` | YES — buildElasticsearchSynonyms produces correct synonym sets. Published via search-sdk. | Correct (integration) | KEEP — move downstream |
| `vocab-gen.unit.test.ts` | YES — createPipelineConfig, formatPipelineResult. Pure pipeline config functions. | Correct (unit) | KEEP — same module structure issue as reader.ts |
| `analysis-report-generator.unit.test.ts` (src/bulk/) | YES — generateAnalysisReport with test fixtures. Pure function. | Correct (unit) | KEEP — transitive dep via processing.ts |
| `analysis-report-generator.unit.test.ts` (vocab-gen/) | YES — same pattern, different import path. Pure function. | Correct (unit) | KEEP — transitive dep via vocab-gen-core.ts |

### Category C — Explicit IO in unit test (FIXED)

| Test | Proves behaviour? | Level | Verdict |
|---|---|---|---|
| `generate-tool-file.header.unit.test.ts` | NOW YES — was testing file existence (IO), now tests generator output string. | Correct (unit) | KEPT — rewritten |

### Summary

**All 15 tests prove product behaviour. None should be deleted.** The
failures are architectural boundary issues, not test quality issues:

- 5 tests (Cat A) are fine — turbo ^build resolves them
- 4 tests (Cat B1) test generated code directly — move downstream
- 5 tests (Cat B2) have transitive deps — move module or extract pure
  functions to separate files
- 1 test (Cat C) had IO — already fixed

### Key Insight: Module Structure Causes Unnecessary Coupling

`reader.unit.test.ts` and `vocab-gen.unit.test.ts` test genuinely PURE
functions that share a module with code importing generated types. The
tested functions (extractSubjectPhase, createPipelineConfig) do not use
generated types at all. The failure comes from vitest resolving all imports
in the module at load time.

Fix options for B2 cases:
1. **Extract pure functions** to a separate file with no generated-type
   imports. The test imports the extracted file. Zero-cost, preserves
   the test.
2. **Move the entire module** to a downstream workspace where ^build
   ensures generated types are available.

## Appendix B: Testing Strategy Violations Identified

- Unit tests MUST NOT trigger IO (testing strategy lines 58, 103)
- Integration tests MUST NOT trigger IO (testing strategy lines 59, 104)
- E2E tests mock IO; only smoke tests run real IO
- Smoke tests MUST NOT run in GitHub Workflows
- `existsSync` in a `.unit.test.ts` file was a clear IO violation (fixed)
- Tests that import generated code to test it are testing build artifacts —
  architecturally they belong downstream of the generation boundary, but
  they DO prove product behaviour and should not be deleted

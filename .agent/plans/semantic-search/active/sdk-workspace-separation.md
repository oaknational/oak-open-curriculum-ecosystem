---
name: SDK Workspace Separation (Canonical Merge Blocker)
overview: >
  Execute ADR-108 Step 1 by splitting generation-time responsibilities from
  runtime responsibilities into a dedicated
  `@oaknational/curriculum-sdk-generation` workspace, while preserving runtime
  behaviour and enforcing strict one-way boundaries.
  This canonical plan is self-sufficient, ADR-anchored, and merge-blocking.
todos:
  - id: gate-prerequisite-baseline
    content: "Hard gate: baseline invariants are captured and the generation workspace absence is confirmed before split execution."
    status: completed
  - id: grounding-and-decisions
    content: "Re-read directives and lock architectural decisions (all vocab artefacts move now, one-way dependency, ADR-only context)."
    status: completed
  - id: baseline-inventory
    content: "Capture and persist reproducible baseline metrics and command definitions before file moves."
    status: completed
  - id: turbo-task-alignment
    content: "Update turbo.json to reflect the new cross-package task dependencies (runtime:build depends on generation:type-gen). Completed in Phase 1 — see commit 86a71125. Remaining turbo fixes (test:e2e input filename) tracked as F1 in Phase 5."
    status: completed
  - id: generation-workspace-scaffold
    content: "Create packages/sdks/oak-curriculum-sdk-generation with package metadata, TS/ESLint/tsup configs, scripts, and README."
    status: completed
  - id: move-typegen-and-generated
    content: "Move type-gen/, schema-cache/, src/types/generated/ into generation workspace with git-aware moves. Rewire runtime imports via subpath exports. Full quality gates passed."
    status: completed
  - id: move-vocab-generated-runtime-artefacts
    content: "Move all generation-owned artefacts now: vocab outputs (src/mcp graph and synonym), bulk infrastructure (src/bulk/**), and authored domain ontology (property-graph-data.ts)."
    status: pending
  - id: runtime-rewire-and-boundaries
    content: "Runtime rewire done in Phase 2 (~70 files). Remaining: search CLI (22 files) to generation, remove public/bulk facade (depends on Phase 3)."
    status: pending
  - id: tests-scripts-config-migration
    content: "Phase 5: E2E tests and config migration partially done in Phase 2. Remaining: scope guard script, root package.json vocab-gen filter, typedoc, plus all reviewer findings F1–F10 and F18 (turbo inputs, deps, test naming, zodgen assertions, SearchFacetsSchema dual export, generate:clean atomicity, DI refactoring for universal-tools mock)."
    status: pending
  - id: docs-tsdoc-and-adr
    content: "Phase 6: Update TSDoc, READMEs, architecture docs, ADR references, generator provenance banners. Evaluate barrel auto-generation, subpath granularity, OakApiPathBasedClient ownership. Reviewer findings F11–F15."
    status: pending
  - id: validation-and-evidence
    content: "Phase 7: Run full gate chain, capture evidence, add CI generated-file-drift check (F16)."
    status: pending
isProject: false
---

# SDK Workspace Separation Plan (Canonical)

## 1. Intent

Execute **ADR-108 Step 1** by splitting the current monolithic
`@oaknational/curriculum-sdk` into:

1. `@oaknational/curriculum-sdk-generation` (generation-time ownership)
2. `@oaknational/curriculum-sdk` (runtime ownership)

This plan is merge-blocking for semantic-search branch work and is the single
authoritative execution source for this split.

## 2. Hard Gates and Non-Negotiable Decisions

### G0. Prerequisite baseline gate (hard blocker) ✅ PREREQUISITES SATISFIED

**Decision (preserved)**: split implementation starts only from a verified,
reproducible pre-split baseline.

**Prerequisites confirmed 22 February 2026**:

- generation workspace is absent (split not yet started)
- baseline file counts and import counts are measured with locked commands
- WS5 historical blocker is closed; split execution is unblocked
- OAuth/auth prerequisites are treated as completed architectural baseline via
  ADR-113 and ADR-115 (no plan-status dependency)

**Phase 0 executed 24 Feb 2026**: baseline evidence committed as
[`sdk-workspace-separation-baseline.json`](sdk-workspace-separation-baseline.json)
(AC1 satisfied). Phase 1 scaffold, boundary rules, and turbo alignment also
complete — see commit `86a71125`.

### D1. Move all generation-owned artefacts and infrastructure now

**Decision (expanded 23 Feb 2026)**: all vocab-generated artefacts AND all
bulk data infrastructure (`src/bulk/`) move in Step 1 now; no phased partial
ownership. The guiding principle: if something CAN be created or owned at
type-gen time, it should be.

This explicitly includes:

- generated files currently emitted under runtime `src/mcp/**`
- all of `src/bulk/` (readers, extractors, generators, processing, types)
- `property-graph-data.ts` (authored domain ontology, belongs with graph data)

The architectural rationale — two pipelines (API and bulk) in one generation
workspace, the consumer model, and boundary invariants — is documented in
[ADR-108 § Two Data Pipelines, Consumer Model, Boundary Invariants](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

The runtime `public/bulk` re-export surface is removed as part of this work.
The search SDK remains on the runtime SDK for Step 1; migration to direct
generation imports for type-only surfaces is a future refinement.

### D2. One-way dependency remains strict

`@oaknational/curriculum-sdk` may depend on
`@oaknational/curriculum-sdk-generation`; generation may not depend on runtime.
See [ADR-108 § Boundary Invariants](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
for the full set of enforced boundary rules.

### D3. Aggregated tools remain runtime composition in Step 1

Runtime aggregated tool orchestration remains in runtime SDK for Step 1.
Generated MCP descriptors/executors remain generation-owned.

### D4. ADR-only dependency context

Architectural dependencies and external context for this plan are anchored to
ADRs only.

## 3. Grounding Commitments (mandatory per phase boundary)

Re-read and recommit before Phase 0, and at each phase transition:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

Authoritative ADR anchors (split-critical):

- `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md`
- `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md`
- `docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`

Background context (completed baseline, not re-read per phase):

- `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md`
- `docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md`

## 4. Repo-Grounded Baseline Snapshot (22 February 2026)

- `packages/sdks/oak-curriculum-sdk-generation`: does not exist
- `packages/sdks/oak-curriculum-sdk/type-gen`: 192 files
- `packages/sdks/oak-curriculum-sdk/src`: 303 files
- `packages/sdks/oak-curriculum-sdk/src/types/generated`: 106 files
- non-test runtime source files importing local `types/generated/*`: 56 files

Method-locked baseline commands:

```bash
find packages/sdks/oak-curriculum-sdk/type-gen -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src/types/generated -type f | wc -l
ls -1 packages/sdks

rg -l "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \
  packages/sdks/oak-curriculum-sdk/src \
  --glob '!**/types/generated/**' \
  --glob '!**/*.test.ts' | wc -l
```

## 5. Integrated Findings (Canonical)

All active findings from the former meta analysis are integrated here and
mapped to execution phases and acceptance criteria.

| Finding | Current truth | Execution phase(s) | Acceptance criteria |
|---|---|---|---|
| Generation workspace is absent | `packages/sdks/oak-curriculum-sdk-generation` does not exist yet | Phase 0, Phase 1 | AC1, AC2 |
| Turbo task graph must be split-aware | Build/type-gen dependencies must be rewired for two SDK workspaces per ADR-065 | Phase 1, Phase 5 | AC7 |
| Vocab-generated artefacts are runtime-owned today and must move now | Runtime `src/mcp/**` still contains generated graph/synonym outputs; Step 1 must move all | Phase 3 | AC3 |
| Reverse dependencies must be removed | 9 files in `type-gen/` and `vocab-gen/` import from runtime `src/` (see inventory below) | Phase 4, Phase 5 | AC5, AC6 |
| E2E tests are coupled to `type-gen` internals | Runtime tests currently import `../../type-gen/*` paths and will break after split | Phase 5 | AC8 |
| Scope guard script is monolithic | `scripts/check-generator-scope.sh` allowlist assumes monolithic SDK paths | Phase 5 | AC8 |
| Generated provenance comments/docs need split updates | Template banners and docs still assume monolithic ownership paths | Phase 6 | AC9 |
| `src/bulk/` is generation-owned and must move | All bulk readers, extractors, generators, processing, and types move to generation | Phase 3 | AC2, AC3, AC11 |
| Search CLI imports must be rewired | 22 files in `apps/oak-search-cli/` import from `@oaknational/curriculum-sdk/public/bulk`; rewired to `@oaknational/curriculum-sdk-generation` | Phase 4 | AC11 |
| `public/bulk` runtime surface is removed | No thin facade — consumers import directly from generation for type infrastructure | Phase 4 | AC11 |
| `property-graph-data.ts` is authored domain ontology | Moves to generation alongside generated graph data despite being authored, not generated | Phase 3 | AC3 |
| Generation workspace hosts two distinct pipelines | See [ADR-108 § Two Data Pipelines](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | All phases | AC2, AC3, AC11 |
| Search SDK serves bulk data, not API data | See [ADR-108 § Consumer Model](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md). Search SDK retains runtime SDK dependency for shared exports in Step 1 | Architecture context | -- |
| Phase 2 reviewer findings (26 items) | 8 resolved in Phase 2 (R1–R8); 17 tracked for Phases 5–7 (F1–F18, excluding F17); 1 cross-referenced to ESLint override removal plan (F17). See §13 for full registry. | Phase 5, 6, 7 | AC5, AC7, AC8, AC9, AC10 |

### Reverse-dependency inventory (generation -> runtime imports)

Files in `type-gen/` and `vocab-gen/` that import from runtime `src/`:

| File | Imports from |
|---|---|
| `vocab-gen/lib/index.ts` | `../../src/types/generated/bulk/index.js`, `../../src/bulk/reader.js` |
| `vocab-gen/generators/analysis-report-generator.ts` | `../../src/types/helpers/type-helpers.js` |
| `type-gen/generate-ai-doc.ts` | `../src/types/generated/api-schema/path-parameters.js`, `../src/types/generated/api-schema/mcp-tools/index.js` |
| `type-gen/mcp-security-policy.unit.test.ts` | `../src/types/generated/api-schema/mcp-tools/generated/data/scopes-supported.js` |
| `type-gen/typegen/search/index-doc-exports.ts` | `../../../src/types/generated/search/index-documents.js` |
| `type-gen/typegen/search/generate-search-response-docs.ts` | `../../../src/types/generated/search/responses.*.js`, `../../../src/types/generated/zod/curriculumZodSchemas.js` |
| `type-gen/typegen/search/generate-subject-hierarchy.unit.test.ts` | `../../../src/types/generated/search/subject-hierarchy.js` |
| `type-gen/typegen/search/generate-search-modules.unit.test.ts` | (string literal reference to generated path) |
| `type-gen/typegen/error-types/classify-http-error.unit.test.ts` | `../../../src/types/generated/api-schema/error-types/sdk-error-types.js` |

All of these must be resolved during Phase 4 (rewire) and Phase 5 (test migration).

## 6. Scope

### In scope (ADR-108 Step 1 only)

- Create generation workspace.
- Move generation code and generated artefacts into generation workspace.
- Move all vocab-generated artefacts now, including runtime `src/mcp/**` outputs.
- Move all bulk data infrastructure (`src/bulk/`) to generation workspace.
- Move authored domain ontology (`property-graph-data.ts`) to generation workspace.
- Remove runtime `public/bulk` re-export surface.
- Rewire runtime SDK to import from generation public exports only.
- Rewire search CLI (22 files) to import from generation package directly.
- Migrate coupled tests/scripts/config that assume monolithic paths.
- Enforce one-way boundaries with lint and package dependencies.
- Preserve runtime behaviour.

### Out of scope

- ADR-108 Step 2/3 generic extraction work.
- Broader aggregated-tool architecture changes outside Step 1 boundary split.
- Separate public release policy for generation package.

## 7. Target State

```text
packages/sdks/oak-curriculum-sdk-generation/
  type-gen/                              # API pipeline: OpenAPI → types, Zod, MCP descriptors
  schema-cache/                          # API pipeline: cached OpenAPI spec
  vocab-gen/                             # Bulk pipeline: vocabulary generation
  src/
    types/generated/**                   # API pipeline output: API types, Zod schemas
    bulk/**                              # Bulk pipeline: readers, extractors, generators, processing
    generated/vocab/**                   # Bulk pipeline output: vocabulary artefacts
    mcp/property-graph-data.ts           # Bulk pipeline: authored domain ontology (mcp/ path preserved for move simplicity)
    index.ts                             # public generation exports (barrel only)

packages/sdks/oak-curriculum-sdk/
  src/
    client/**                            # API runtime: HTTP client, auth, middleware
    mcp/**                               # runtime composition/facades only
    validation/**                        # API runtime: request/response validation
    index.ts
  (no local type-gen/, schema-cache/, vocab-gen/, src/types/generated/,
   src/bulk/, public/bulk)
```

The generation workspace contains two pipelines:

- **API pipeline** (`type-gen/`, `schema-cache/`, `src/types/generated/`):
  OpenAPI spec → TypeScript types, Zod schemas, MCP tool descriptors.
  Consumed by the curriculum SDK runtime and MCP server apps.

- **Bulk pipeline** (`vocab-gen/`, `src/bulk/`, `src/generated/vocab/`,
  `src/mcp/property-graph-data.ts`): bulk download JSON files → bulk types,
  extractors, knowledge graphs, ES mappings, vocabulary, domain ontology.
  Consumed by the search SDK and search CLI.

Both run during `pnpm type-gen`. They share the workspace but are internally
partitioned — different directories, different entry points.

Dependency direction (generation as shared foundation):

```text
@oaknational/curriculum-sdk-generation  -> no dependency on runtime SDK or search SDK
@oaknational/curriculum-sdk             -> depends on generation SDK (API pipeline output)
@oaknational/oak-search-sdk            -> depends on runtime SDK (unchanged in Step 1)
apps/oak-search-cli                    -> depends on generation SDK (bulk types),
                                          search SDK, and runtime SDK
apps/*                                 -> depend on runtime SDK and/or search SDK
```

Note: `oak-search-sdk` currently imports types and functions from
`@oaknational/curriculum-sdk/public/search.js` and `public/mcp-tools.js`.
These include runtime functions (e.g. `buildElasticsearchSynonyms`), not just
types. The search SDK stays on the runtime SDK for Step 1. Migration to direct
generation imports for type-only surfaces is a future refinement.

## 8. Execution Phases (RED -> GREEN -> REFACTOR)

### Phase 0 - Baseline Lock and Prerequisite Verification ✅ COMPLETE (24 Feb 2026)

Goal: enforce prerequisites and freeze reproducible baseline.

- RED:
  - prove baseline commands detect drift when paths/queries are wrong.
  - prove generation workspace does not yet exist.
- GREEN:
  - record baseline metrics and command definitions in this plan.
  - lock prerequisite baseline invariants used by later phases.
- REFACTOR:
  - simplify baseline command set to minimum reproducible set.

File-level tasks:

- `.agent/plans/semantic-search/active/sdk-workspace-separation.md`
  (baseline updates)

### Phase 1 - Scaffold Generation Workspace ✅ COMPLETE (24 Feb 2026)

Goal: introduce first-class generation workspace before moving content.

- RED:
  - `pnpm -F @oaknational/curriculum-sdk-generation build` fails before scaffold.
  - boundary lint rule rejects a reverse import (generation → runtime) — RED
    before the rule exists.
- GREEN:
  - create workspace package/config/readme/entrypoint.
  - register in `pnpm-workspace.yaml`.
  - workspace build and type-check pass.
  - align task graph with ADR-065 split-aware dependency strategy.
  - create SDK boundary lint rules in `packages/core/oak-eslint/src/rules/boundary.ts`
    (`createSdkBoundaryRules()`) preventing generation → runtime imports and
    deep imports into generation internals.
  - apply boundary rules in both SDK ESLint configs.
- REFACTOR:
  - align config shape with existing SDK workspace conventions.

**Turbo target state** (per ADR-065): update `turbo.json` `type-gen` task to
include `**/vocab-gen/**/*.ts` in inputs. Ensure runtime workspace `build`
depends on generation workspace completion via `^build`. Generation workspace
`type-gen` should produce outputs consumed by runtime `build`.

**Intermediate compilation gate**: `pnpm build && pnpm type-check` must pass
before proceeding to Phase 2.

File-level tasks:

- `pnpm-workspace.yaml`
- `packages/sdks/oak-curriculum-sdk-generation/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.build.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.lint.json`
- `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts` (apply SDK boundary rules)
- `packages/sdks/oak-curriculum-sdk-generation/tsup.config.ts`
- `packages/sdks/oak-curriculum-sdk-generation/README.md`
- `packages/sdks/oak-curriculum-sdk-generation/src/index.ts`
- `packages/sdks/oak-curriculum-sdk/eslint.config.ts` (apply SDK boundary rules)
- `packages/core/oak-eslint/src/rules/boundary.ts` (add `createSdkBoundaryRules()`)
- `packages/core/oak-eslint/src/index.ts` (export new rules)
- `turbo.json` (add `vocab-gen` inputs, split-aware task deps)

### Phase 2 - Move Type-Gen Core and Generated API Artefacts ✅ COMPLETE (24 Feb 2026)

Goal: move generation ownership for core type-gen pipeline and generated API
artefacts.

- RED:
  - generation scripts fail from old runtime paths after move starts.
  - ~70 runtime SDK files fail with broken `./types/generated/` imports.
- GREEN:
  - move `type-gen/`, `schema-cache/`, `src/types/generated/`.
  - rewire scripts/paths to generation workspace.
  - create 10 subpath barrel files (see §8.2a below) exposing generated
    artefacts through `package.json` `exports` field.
  - rewire ~70 runtime SDK source files from `./types/generated/` to
    `@oaknational/curriculum-sdk-generation/<subpath>` imports.
  - update ESLint boundary rules to allow single-level subpath exports
    while blocking deeper internal paths.
  - move E2E tests for type-gen to generation workspace.
  - `pnpm -F @oaknational/curriculum-sdk-generation type-gen` regenerates
    artefacts in generation workspace.
- REFACTOR:
  - remove stale runtime references to moved paths.
  - remove dead ESLint overrides from runtime SDK for `type-gen/`,
    `src/types/generated/`, and `src/types/helpers.ts`.
  - remove stale `type-gen` vitest globs from runtime SDK.
  - fix stale `vi.mock` path in `universal-tools.unit.test.ts`.
  - make `client-types.ts` (`OakApiPathBasedClient`) a generated file
    to survive `generate:clean`.
  - replace all `export * from` in barrel files with named exports.

**Scope note**: Phase 2 necessarily absorbed the runtime SDK import rewiring
originally assigned to Phase 4. Without rewiring, the Phase 2 intermediate
gate cannot pass because ~70 runtime files import from `./types/generated/`
which no longer exists. Phase 4 retains its remaining scope.

**8 specialist reviews completed**: architecture (fred, barney, betty, wilma),
code-reviewer, type-reviewer, config-reviewer, test-reviewer. Immediate
blocking findings resolved; remaining findings integrated into Phases 5–7
and the reviewer findings registry (§13). Full quality gate chain passed.

**Intermediate compilation gate**: `pnpm type-gen && pnpm build && pnpm type-check`
passed. Full gate chain (`clean` through `smoke:dev:stub`) also passed.

#### 8.2a Subpath Export Architecture (decided Phase 2)

The generation workspace exposes generated artefacts through **subpath exports**
rather than a single monolithic barrel. Subpaths are one level deep only.

| Subpath | Domain | Barrel |
|---------|--------|--------|
| `@oaknational/curriculum-sdk-generation` | curated subset | `src/index.ts` |
| `@oaknational/curriculum-sdk-generation/api-schema` | API types, paths, routing, validation, errors | `src/api-schema.ts` |
| `@oaknational/curriculum-sdk-generation/mcp-tools` | tool descriptors, execution, stubs, scopes | `src/mcp-tools.ts` |
| `@oaknational/curriculum-sdk-generation/search` | index docs, scopes, facets, suggestions, ES mappings | `src/search.ts` |
| `@oaknational/curriculum-sdk-generation/zod` | Zod schemas | `src/zod.ts` |
| `@oaknational/curriculum-sdk-generation/bulk` | bulk download schemas and types | `src/bulk.ts` |
| `@oaknational/curriculum-sdk-generation/query-parser` | query parser types | `src/query-parser.ts` |
| `@oaknational/curriculum-sdk-generation/observability` | zero-hit telemetry | `src/observability.ts` |
| `@oaknational/curriculum-sdk-generation/admin` | admin fixtures | `src/admin.ts` |
| `@oaknational/curriculum-sdk-generation/widget-constants` | widget URI | `src/widget-constants.ts` |

ESLint boundary rule: `createSdkBoundaryRules('runtime')` uses
`@oaknational/curriculum-sdk-generation/*/**` to block two-or-more-level
imports while allowing single-level subpath exports.

File-level tasks (all completed):

- `packages/sdks/oak-curriculum-sdk/type-gen/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/type-gen/**`
- `packages/sdks/oak-curriculum-sdk/schema-cache/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/schema-cache/**`
- `packages/sdks/oak-curriculum-sdk/src/types/generated/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/src/types/generated/**`
- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/typegen-core.e2e.test.ts` ->
  `packages/sdks/oak-curriculum-sdk-generation/e2e-tests/scripts/`
- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/zodgen.e2e.test.ts` ->
  `packages/sdks/oak-curriculum-sdk-generation/e2e-tests/scripts/`
- `packages/sdks/oak-curriculum-sdk/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/src/*.ts` (10 barrel files)
- `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.lint.json`
- `packages/sdks/oak-curriculum-sdk-generation/vitest.config.ts`
- `packages/sdks/oak-curriculum-sdk-generation/vitest.config.e2e.ts` (new)
- `packages/sdks/oak-curriculum-sdk-generation/tsup.config.ts`
- `packages/sdks/oak-curriculum-sdk/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk/vitest.config.ts`
- `packages/sdks/oak-curriculum-sdk/src/` (~70 files rewired)
- `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.ts`
- `packages/core/oak-eslint/src/rules/boundary.ts`
- `packages/core/oak-eslint/src/rules/sdk-boundary.unit.test.ts`

### Phase 3 - Move All Generation-Owned Artefacts and Infrastructure (Now)

Goal: complete the expanded decision to move all generation-owned artefacts,
bulk data infrastructure, and authored domain ontology now. Phase 3 is
**physical moves and generation exports only** — all runtime and consumer
import rewiring happens in Phase 4.

- RED:
  - runtime modules fail until imports are rewired from moved vocab outputs.
  - bulk consumers fail until imports are rewired from moved bulk infrastructure.
- GREEN:
  - move `vocab-gen/**` into generation workspace.
  - move generated vocab outputs currently in runtime `src/mcp/**`.
  - move all of `src/bulk/**` (readers, extractors, generators, processing,
    types) into generation workspace.
  - move `property-graph-data.ts` (authored domain ontology) to generation.
  - update generation barrel exports to expose all moved artefacts.
- REFACTOR:
  - normalise generated-path naming for clarity and future decomposition.

**Intermediate compilation gate**: `pnpm type-gen && pnpm build && pnpm type-check`
must pass before proceeding to Phase 4. `type-gen` is explicit because Phase 3
moves vocab-gen and bulk infrastructure — cached artefacts must not mask failures.

File-level tasks (minimum):

Vocab-gen and generated artefacts:

- `packages/sdks/oak-curriculum-sdk/vocab-gen/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/vocab-gen/**`
- `packages/sdks/oak-curriculum-sdk/src/mcp/thread-progression-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/nc-coverage-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/generated/definition-synonyms.ts`

Authored domain ontology:

- `packages/sdks/oak-curriculum-sdk/src/mcp/property-graph-data.ts`

Bulk data infrastructure:

- `packages/sdks/oak-curriculum-sdk/src/bulk/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/src/bulk/**`

Files that **stay runtime** (runtime composition, per D3):

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts`

### Phase 4 - Consumer Rewire and Boundary Corrections

Goal: search CLI consumers use generation package public exports; remaining
reverse imports resolved; `public/bulk` facade removed.

**Scope note**: runtime SDK import rewiring (~70 files) was completed in
Phase 2 as it was required for the intermediate compilation gate. Phase 4
retains only the work that depends on Phase 3 moves.

- RED:
  - search CLI build fails until bulk imports are rewired.
  - failing checks added for deep imports and reverse dependency attempts.
- GREEN:
  - remove generation->runtime import in `vocab-gen/lib/index.ts`
    (resolved naturally — both `vocab-gen` and `src/bulk/` are now in
    the generation workspace).
  - rewire search CLI (22 files) from `@oaknational/curriculum-sdk/public/bulk`
    to `@oaknational/curriculum-sdk-generation`.
  - remove runtime `public/bulk.ts` re-export surface.
  - add `@oaknational/curriculum-sdk-generation` as a dependency in
    `apps/oak-search-cli/package.json`.
  - update `public/mcp-tools.ts` to re-export `conceptGraph` and related
    types from generation instead of local `../mcp/property-graph-data.js`.
  - update `src/mcp/ontology-data.ts` to import `conceptGraph` from
    generation.
  - keep runtime aggregated tool composition local while consuming generated
    descriptor layers from generation exports.
- REFACTOR:
  - delete dead compatibility glue; simplify barrels to a single source.

**Export parity**: generation `src/index.ts` must export all symbols currently
in `public/bulk.ts`. Derive the export list from `public/bulk.ts` before
removing it to ensure no consumer breakage.

**Boundary verification**: after rewiring, run `pnpm lint` and confirm
SDK boundary rules reject reverse imports and deep imports. The rules created
in Phase 1 enforce this automatically.

**Test mock paths**: update all `vi.mock('@oaknational/curriculum-sdk/public/bulk', ...)`
in search CLI tests to `vi.mock('@oaknational/curriculum-sdk-generation', ...)`.

**Intermediate compilation gate**: `pnpm build && pnpm type-check && pnpm lint`
must pass before proceeding to Phase 5. Lint is added to this gate because
Phase 4 establishes boundary compliance.

File-level tasks (minimum):

Runtime SDK rewiring (completed in Phase 2):

- ~70 files in `packages/sdks/oak-curriculum-sdk/src/` — rewired to
  `@oaknational/curriculum-sdk-generation/<subpath>` imports.

Remaining Phase 4 tasks (depend on Phase 3 moves):

- `packages/sdks/oak-curriculum-sdk/src/public/bulk.ts` — remove
- `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` — re-export
  `conceptGraph` from generation
- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` — import
  `conceptGraph` from generation
- `packages/sdks/oak-curriculum-sdk-generation/vocab-gen/lib/index.ts` —
  resolve generation->runtime import (natural after Phase 3)

Search CLI rewiring (22 files):

- `apps/oak-search-cli/package.json` (add generation dependency)
- `apps/oak-search-cli/src/adapters/bulk-data-adapter.ts`
- `apps/oak-search-cli/src/adapters/bulk-lesson-transformer.ts`
- `apps/oak-search-cli/src/adapters/bulk-unit-transformer.ts`
- `apps/oak-search-cli/src/adapters/bulk-sequence-transformer.ts`
- `apps/oak-search-cli/src/adapters/bulk-thread-transformer.ts`
- `apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts`
- `apps/oak-search-cli/src/adapters/bulk-transform-helpers.ts`
- `apps/oak-search-cli/src/adapters/vocabulary-mining-adapter.ts`
- `apps/oak-search-cli/src/adapters/hybrid-data-source.ts`
- `apps/oak-search-cli/src/adapters/hybrid-batch-processor.ts`
- `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts`
- `apps/oak-search-cli/scripts/analyze-elser-failures.ts`
- `apps/oak-search-cli/scripts/diagnose-elser-failures.ts`
- (plus corresponding test files)

### Phase 5 - Tests, Scripts, Config Migration, and Reviewer Hardening

Goal: migrate remaining coupling points that assume monolithic SDK layout,
and address all test/config/resilience findings from Phase 2 specialist
reviews.

**Scope note**: E2E test migration (`typegen-core.e2e.test.ts`,
`zodgen.e2e.test.ts`), stale runtime vitest globs, dead runtime ESLint
overrides, and runtime SDK config cleanup were completed in Phase 2.

- RED:
  - remaining lint/type-check/build configs fail due to stale include paths.
- GREEN:
  - update remaining scripts/config for split ownership.
  - update scope guard script paths and allowlist entries (add generation
    workspace paths: `packages/sdks/oak-curriculum-sdk-generation/type-gen/**`,
    `packages/sdks/oak-curriculum-sdk-generation/src/types/generated/**`).
  - update root `package.json` scripts: `vocab-gen` must target
    `@oaknational/curriculum-sdk-generation`, not `@oaknational/curriculum-sdk`.
  - **[config-reviewer]** fix turbo `test:e2e` input filename mismatch:
    `vitest.e2e.config.ts` vs actual `vitest.config.e2e.ts` — stale cache
    invalidation risk.
  - **[config-reviewer]** add explicit `tsup` devDependency to runtime SDK
    (currently resolves via hoisting — fragile).
  - **[config-reviewer]** remove phantom `@next/eslint-plugin-next`
    devDependency from runtime SDK (unused).
  - **[test-reviewer]** rename `typegen-core.test.ts` to
    `typegen-core.unit.test.ts` (naming convention violation); extract
    filesystem IO tests to `typegen-core-file-operations.integration.test.ts`.
  - **[test-reviewer]** remove vacuous `expect(true).toBe(true)` assertions
    in `zodgen.e2e.test.ts` (lines 78, 145).
  - **[test-reviewer]** remove silent error suppression in
    `zodgen.e2e.test.ts` `beforeEach` — `rmSync` with `force: true` already
    handles ENOENT; let unexpected errors propagate.
  - **[wilma]** add unit test asserting the `client-types.ts` import path
    in `generate-tool-file.ts` resolves correctly — hardcoded relative path
    `../../../../client-types.js` is brittle.
  - **[betty/barney]** resolve `SearchFacetsSchema` dual export: currently
    exported from both `/search` and `/zod` subpaths, creating two canonical
    import paths for one concept. Choose one authoritative subpath.
  - **[code-reviewer]** simplify runtime SDK `src/types/index.ts` — it
    re-exports many symbols already available via `src/index.ts`, creating
    duplicate public paths. Evaluate whether this barrel is still needed.
- REFACTOR:
  - tighten config inputs to avoid cache drift and excess coupling.
  - **[wilma]** make `generate:clean` resilient: add documentation or
    implement atomic write pattern (write to `src/types/generated.tmp`,
    rename to `src/types/generated` on success) to prevent broken state
    when `type-gen` fails after `generate:clean`.

**Intermediate compilation gate**: `pnpm build && pnpm type-check` must pass
before proceeding to Phase 6.

File-level tasks (minimum):

- `packages/sdks/oak-curriculum-sdk/package.json` (remove phantom deps,
  add explicit tsup)
- `packages/sdks/oak-curriculum-sdk/tsconfig.json`
- `packages/sdks/oak-curriculum-sdk/tsconfig.lint.json`
- `packages/sdks/oak-curriculum-sdk/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk/typedoc.json`
- `packages/sdks/oak-curriculum-sdk/src/types/index.ts` (simplify)
- `packages/sdks/oak-curriculum-sdk-generation/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig*.json`
- `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen-core.test.ts`
  (rename + split)
- `packages/sdks/oak-curriculum-sdk-generation/e2e-tests/scripts/zodgen.e2e.test.ts`
  (fix assertions and error handling)
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-tool-file.ts`
  (add path resolution test)
- `package.json` (root — update `vocab-gen` filter target)
- `scripts/check-generator-scope.sh`
- `turbo.json` (fix `test:e2e` input filename)

### Phase 6 - Generated Provenance, TSDoc, Documentation Alignment, and
Structural Refinements

Goal: documentation and generated comments reflect the new ownership model.
Architectural refinements identified by reviewers that don't fit earlier
phases are completed here.

- RED:
  - documentation/typedoc checks fail when references still point to monolith
    paths.
- GREEN:
  - **[fred W1]** update generator template banners/provenance paths — these
    still reference pre-split monolith paths (e.g. `type-gen/typegen/mcp-tools/`
    as if it were within `oak-curriculum-sdk`). Each generated file banner must
    correctly reference its generation workspace path.
  - add/update comprehensive TSDoc on generation public interfaces and runtime
    facades.
  - update READMEs and architecture docs.
  - **[betty]** evaluate generating barrel files from the generator pipeline
    instead of hand-authoring them — keeps exports in sync with generated
    artefacts automatically. If adopted, implement in type-gen pipeline and
    update the plan accordingly.
  - **[barney]** evaluate subpath granularity: `query-parser`, `observability`,
    and `admin` have very small surfaces (1–3 symbols each). Consider merging
    into semantically related neighbours (e.g. `/search`, `/api-schema`) to
    reduce public API surface area. Document decision either way.
  - **[betty]** clarify `OakApiPathBasedClient` ownership: this type currently
    lives in generation but depends on `openapi-fetch` (a runtime concern).
    Evaluate whether it should be a thin re-export in the runtime SDK. Document
    decision.
- REFACTOR:
  - keep progressive disclosure coherent: root -> workspace -> deep docs.
  - **[fred W2]** audit runtime SDK wildcard exports for barrel discipline
    consistency (cross-reference with ESLint override removal plan).

File-level tasks (minimum):

- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-execute-file.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-scopes-supported-file.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/generate-widget-constants.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/client-types/generate-client-types.ts`
  (provenance banner update)
- `packages/sdks/oak-curriculum-sdk/README.md`
- `packages/sdks/oak-curriculum-sdk-generation/README.md`
- `docs/architecture/openapi-pipeline.md`
- `docs/architecture/programmatic-tool-generation.md`
- `docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`
  (update pipeline location paths to generation workspace)
- `docs/development/build-system.md`
- `.agent/plans/semantic-search/active/sdk-workspace-separation.md`

### Phase 7 - Full Quality Gates, Evidence Capture, and CI Hardening

Goal: prove determinism, boundary compliance, and behavioural parity. Add
CI-level checks that prevent regression of the architectural invariants
established by this plan.

- RED:
  - run full chain and capture failures before fixes.
- GREEN:
  - pass every gate in strict order and capture evidence.
  - **[wilma]** add CI check that generated files are unmodified after
    `pnpm type-gen` — run `pnpm type-gen && git diff --exit-code
    packages/sdks/oak-curriculum-sdk-generation/src/types/generated/` to
    detect committed drift. This prevents manually-edited generated files
    from surviving review.
- REFACTOR:
  - simplify any brittle checks discovered during gate runs.

Mandatory quality gates (root, one at a time):

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

## 9. Acceptance Criteria (all mandatory)

1. **Pre-split baseline invariants are explicit and reproducible**
   - a committed `sdk-workspace-separation-baseline.json` evidence file
     captures baseline metrics at Phase 0 completion.
   - baseline commands in Section 4 replay matches the committed evidence.
   - `ls -1 packages/sdks` does not include
     `oak-curriculum-sdk-generation` at baseline time.

2. **Ownership split physically complete**
   - generation workspace contains moved `type-gen/`, `schema-cache/`,
     `vocab-gen/`, `src/types/generated/`, and `src/bulk/`.
   - runtime workspace no longer contains those directories.

3. **All vocab-generated artefacts moved now**
   - no generation-owned vocab outputs remain under runtime
     `packages/sdks/oak-curriculum-sdk/src/mcp/**`.
   - runtime consumes vocab generated data via generation package exports.

4. **Runtime imports no local generated paths**
   - this command returns zero matches:

```bash
rg "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \
  packages/sdks/oak-curriculum-sdk/src \
  --glob '!**/*.test.ts'
```

5. **No deep imports into generation internals**
   - runtime imports only `@oaknational/curriculum-sdk-generation` barrel
     exports, not internal paths like
     `@oaknational/curriculum-sdk-generation/src/...`,
     `@oaknational/curriculum-sdk-generation/type-gen/...`, or
     `@oaknational/curriculum-sdk-generation/vocab-gen/...`.

6. **One-way dependency enforced**
   - runtime depends on generation package.
   - generation package does not import runtime package internals, including
     removal of reverse dependency in
     `packages/sdks/oak-curriculum-sdk-generation/vocab-gen/lib/index.ts`.
   - boundary linting fails illegal imports and passes legal imports.

7. **Turbo graph and build dependencies are split-aware**
   - `turbo.json` dependency chain reflects runtime/generation split and
     remains aligned with ADR-065 task dependency intent.
   - cache-relevant inputs/outputs remain valid after path moves.

8. **Coupled tests/scripts/config migrated**
   - no tests import `../../type-gen/*` from runtime package.
   - `scripts/check-generator-scope.sh` allowlist is updated for split layout.

9. **Generated provenance and docs match split ownership**
   - generator template banners/provenance comments point to split paths.
   - runtime/generation READMEs and architecture docs describe split ownership
     and execution flow.

10. **Determinism and parity proven**

    - full quality gate sequence passes.
    - re-running `pnpm type-gen` without input changes yields no diff.
    - runtime/consumer behavioural tests pass with no regression.

11. **Generation as shared foundation — consumer rewiring complete**
    - search CLI imports from `@oaknational/curriculum-sdk-generation`, not
      `@oaknational/curriculum-sdk/public/bulk`.
    - runtime `public/bulk.ts` re-export surface is removed.
    - `apps/oak-search-cli/package.json` lists
      `@oaknational/curriculum-sdk-generation` as a dependency.
    - search CLI builds and tests pass with the rewired imports.

12. **SDK boundary lint rules exist and are enforced**
    - `createSdkBoundaryRules()` exists in
      `packages/core/oak-eslint/src/rules/boundary.ts`.
    - both SDK ESLint configs apply the boundary rules.
    - `pnpm lint` fails on a generation → runtime import.
    - `pnpm lint` fails on a deep import into generation internals.

## 10. Validation Commands

```bash
# required ADR anchors are present
rg -n "108-sdk-workspace-decomposition|065-turbo-task-dependencies|086-vocab-gen-graph-export-pattern|113-mcp-spec-compliant-auth-for-all-methods|115-proxy-oauth-as-for-cursor" \
  .agent/plans/semantic-search/active/sdk-workspace-separation.md

# baseline commands (must match section 4 exactly)
find packages/sdks/oak-curriculum-sdk/type-gen -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src/types/generated -type f | wc -l
ls -1 packages/sdks
rg -l "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \
  packages/sdks/oak-curriculum-sdk/src \
  --glob '!**/types/generated/**' \
  --glob '!**/*.test.ts' | wc -l
```

## Execution Invariants

See [ADR-108 § Boundary Invariants](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
for the permanent rules (run from root, file placement, one-way dependency,
barrel-only imports).

## 11. Risks and Mitigations

- Baseline drift before split starts:
  keep G0 hard blocker and refresh Section 4 metrics before file moves.
- Partial vocab move creates split ownership entropy:
  enforce D1 and explicit acceptance criterion 3.
- Hidden reverse dependency in generation tooling:
  fail lint/build on generation->runtime imports and fix root causes.
- Config/task graph breakage after split:
  update turbo/package scripts alongside moves, not afterwards.
- Root script wiring (`pnpm vocab-gen`, `pnpm type-gen`) targets monolithic
  filters: update root `package.json` and `scripts/check-generator-scope.sh`
  alongside workspace moves.
- Documentation drift:
  treat docs/TSDoc as same-phase deliverables, not post-merge cleanup.
- **[wilma]** `generate:clean` atomicity: if `type-gen` fails after `clean`,
  the workspace is left without generated artefacts. Mitigated in Phase 5
  (atomic write pattern or documented recovery procedure).
- **[wilma]** Generated file drift: manually edited generated files can
  survive review undetected. Mitigated in Phase 7 (CI drift check).
- **[barney/betty]** Dual export paths for the same symbol (e.g.
  `SearchFacetsSchema` from `/search` and `/zod`): consumers choose
  inconsistently, complicating renames. Mitigated in Phase 5 (choose one
  authoritative subpath).
- **[betty]** Hand-authored barrel files drift from generated artefacts:
  new generated types are silently omitted from the public API. Mitigated in
  Phase 6 (evaluate auto-generating barrels from the pipeline).
- **[config-reviewer]** Turbo cache invalidation fragility: stale input
  patterns (e.g. wrong E2E config filename) cause false cache hits.
  Mitigated in Phase 5 (fix turbo input patterns).
- ESLint override tech debt: see
  [eslint-override-removal.plan.md](../../developer-experience/eslint-override-removal.plan.md)
  for the phased removal strategy.

## 12. Pre-Phase-1 Decisions (all resolved 23 Feb 2026)

All five pre-Phase-1 decisions have been resolved. Full analysis and rationale
(alternatives considered, user direction, trade-offs):
[sdk-separation-pre-phase1-decisions.md](../archive/completed/sdk-separation-pre-phase1-decisions.md)
(archived — all decisions integrated into this plan).

Summary:

- **D1 `public/bulk` ownership**: all of `src/bulk/` moves to generation.
  No thin facade; consumers import directly from generation. Search CLI
  (22 files) rewired. Caching strategy deferred to vocabulary convergence
  pipeline (D2). See [ADR-108 § Two Data Pipelines, Consumer Model](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
  for the full architectural rationale.
- **D2 Vocabulary convergence**: proceed with the split as planned. Converged
  mining pipeline is post-split work. Generation public API uses barrel exports.
- **D3 Phase 3 move list**: `property-graph-data.ts` moves to generation
  (authored domain ontology). `aggregated-*` files stay runtime (composition).
- **D4 Baseline gate**: commit-anchored evidence file replaces hard-coded
  numbers. AC1 updated.
- **D5 Phase collapse**: keep sequential phases with intermediate compilation
  gates (`pnpm build && pnpm type-check` after each phase).

## 13. Phase 2 Reviewer Findings Registry

All findings from the 8 specialist reviews after Phase 2 completion.
Every finding is either resolved or mapped to a specific execution phase.
**No finding is deferred indefinitely or left untracked.**

### 13.1 Resolved in Phase 2

| # | Reviewer | Finding | Resolution |
|---|---------|---------|------------|
| R1 | barney | Redundant ESLint override for `src/types/generated/search/**` | Removed — parent `src/types/generated/**` override already covers it |
| R2 | code-reviewer | Mixed `export { type ... }` / `export type { ... }` syntax in `mcp-tools.ts` | Fixed — normalised to `export type { ... }` |
| R3 | code-reviewer | Stale TSDoc references in `elasticsearch.ts` and `widget-constants.ts` | Fixed — updated to reference generation workspace paths |
| R4 | config-reviewer | Orphaned E2E tests not covered by generation tsconfig | Fixed — added to `include` arrays |
| R5 | config-reviewer | Dead ESLint overrides in runtime SDK for moved paths | Fixed — removed `type-gen/`, `src/types/generated/`, `src/types/helpers.ts` overrides |
| R6 | config-reviewer | Stale vitest globs in runtime SDK | Fixed — removed `type-gen/**` patterns |
| R7 | test-reviewer | Orphaned `vi.mock` path in `universal-tools.unit.test.ts` | Fixed — corrected path. Mock uses `vi.importActual` with runtime narrowing to preserve real `SCOPES_SUPPORTED` from schema. Underlying issue: `vi.mock` in a `.unit.test.ts` file violates testing rules (NO MOCKS in unit tests). Proper fix is DI refactoring — see F18. |
| R8 | type-reviewer | `ToolStatusForName` not re-exported | Verified latent — no consumers exist; harmless |

### 13.2 Tracked for Phase 5

| # | Reviewer | Finding | Plan |
|---|---------|---------|------|
| F1 | config-reviewer | Turbo `test:e2e` input filename mismatch (`vitest.e2e.config.ts` vs `vitest.config.e2e.ts`) | Fix turbo.json input pattern |
| F2 | config-reviewer | Runtime SDK missing explicit `tsup` devDependency | Add to `package.json` |
| F3 | config-reviewer | Phantom `@next/eslint-plugin-next` devDependency in runtime SDK | Remove |
| F4 | test-reviewer | `typegen-core.test.ts` naming convention violation | Rename to `*.unit.test.ts`, split IO tests to `*.integration.test.ts` |
| F5 | test-reviewer | Vacuous `expect(true).toBe(true)` in `zodgen.e2e.test.ts` | Replace with meaningful assertions |
| F6 | test-reviewer | Silent error suppression in `zodgen.e2e.test.ts` `beforeEach` | Remove try/catch — `rmSync` with `force: true` handles ENOENT |
| F7 | wilma | Hardcoded relative import path in `generate-tool-file.ts` (`../../../../client-types.js`) | Add unit test asserting path resolves correctly |
| F8 | wilma | `generate:clean` leaves workspace broken if `type-gen` fails | Implement atomic write pattern or document recovery |
| F9 | barney/betty | `SearchFacetsSchema` exported from both `/search` and `/zod` subpaths | Choose one authoritative subpath, remove the other |
| F10 | code-reviewer | `src/types/index.ts` duplicates symbols from `src/index.ts` | Evaluate necessity and simplify or remove |
| F18 | rules-review | `universal-tools.unit.test.ts` uses `vi.mock`/`vi.hoisted` for module-level mocking | Refactor `listUniversalTools`, `isUniversalToolName`, `createUniversalToolExecutor` to accept dependencies as parameters (DI). Rename test to `.integration.test.ts` or eliminate mocks entirely. Also remove ad-hoc `McpToolDefinition` interface and `Record<string, McpToolDefinition>`. |

### 13.3 Tracked for Phase 6

| # | Reviewer | Finding | Plan |
|---|---------|---------|------|
| F11 | fred W1 | Generator template banners reference pre-split paths | Update all provenance comments to generation workspace paths |
| F12 | betty | Barrel files are hand-authored — risk drifting from generated artefacts | Evaluate auto-generating barrels from the pipeline |
| F13 | barney | Subpath granularity — `query-parser`, `observability`, `admin` are very small | Evaluate merging into semantically related neighbours |
| F14 | betty | `OakApiPathBasedClient` depends on `openapi-fetch` (runtime concern) in generation | Evaluate ownership; document decision |
| F15 | fred W2 | Runtime SDK wildcard exports inconsistent with barrel discipline | Audit and align (cross-ref ESLint override removal plan) |

### 13.4 Tracked for Phase 7

| # | Reviewer | Finding | Plan |
|---|---------|---------|------|
| F16 | wilma | No CI check that generated files are unmodified | Add `pnpm type-gen && git diff --exit-code` CI step |

### 13.5 Cross-referenced to separate plans

| # | Reviewer | Finding | Plan Reference |
|---|---------|---------|---------------|
| F17 | all | ESLint override tech debt across both SDK workspaces | [eslint-override-removal.plan.md](../../developer-experience/eslint-override-removal.plan.md) |

## 14. Relationship to ADRs

- **ADR-108** (`108-sdk-workspace-decomposition.md`)
  — defines Step 1 split intent, boundary direction, and phased decomposition.
- **ADR-065** (`065-turbo-task-dependencies.md`)
  — defines task graph dependency/caching principles for split rewiring.
- **ADR-086** (`086-vocab-gen-graph-export-pattern.md`)
  — defines vocab pipeline ownership and generated graph artefact patterns.
- **ADR-113** (`113-mcp-spec-compliant-auth-for-all-methods.md`)
  — establishes completed OAuth/auth baseline context for merge-prep.
- **ADR-115** (`115-proxy-oauth-as-for-cursor.md`)
  — establishes completed Cursor OAuth compatibility baseline context.

## 15. Related Plans

- [ESLint Override Removal](../../developer-experience/eslint-override-removal.plan.md)
  — phased removal of all ESLint overrides across both SDK workspaces.
  Cross-referenced by findings F15 and F17.
- [Architectural Enforcement Adoption](../../agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md)
  — Phase 1 SDK boundary rules (`createSdkBoundaryRules()`) are an early,
  targeted implementation of the canonical import matrix (sdks DAG) defined
  in that plan's Phase 2. When `eslint-plugin-boundaries` is adopted later,
  the SDK-specific rules should integrate with the broader layer enforcement.

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
    content: "Phase 3: Physical moves complete (vocab-gen, bulk, graph data, synonyms, property-graph-data). Barrel exports and config updated. Phase 3+4 form single RED-GREEN cycle."
    status: completed
  - id: runtime-rewire-and-boundaries
    content: "Phase 4: All steps complete. 4.1-4.2 (reverse dep, runtime SDK rewire), 4.3 (22 search CLI files rewired), 4.4 (public/bulk facade removed). Compilation gate passed. Architecture review remediation N1-N6 completed and integrated."
    status: completed
  - id: tests-scripts-config-migration
    content: "Phase 5 COMPLETED. Scope guard stale entries removed (F1). Test split to integration (F4). Barrel simplification — duplicate exports removed, single canonical source via types/index.ts (F10). DI refactoring — GeneratedToolRegistry interface, ToolRegistryDescriptor (ISP), eliminated vi.mock/vi.hoisted, removed all as assertions (F18). generate:clean already documented (F8). F1–F3, F5, F6, F9 verified already resolved. All gates pass. 4 specialist reviewers approved. Phase 5 reviewer suggestions tracked in §13.6 for Phase 6 priority."
    status: completed
  - id: docs-tsdoc-and-adr
    content: "Phase 6: Update TSDoc, READMEs, architecture docs, ADR references, generator provenance banners. Architecture remediation N5–N6 COMPLETED (MCP tool dir flattening, generator bootstrap cycle). Evaluate barrel auto-generation, subpath granularity, OakApiPathBasedClient ownership. Reviewer findings F11–F15."
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

## 4. Repo-Grounded Baseline and Current State

### 4a. Pre-Split Baseline (22 February 2026)

Captured in
[`sdk-workspace-separation-baseline.json`](sdk-workspace-separation-baseline.json)
at Phase 0, before any file moves.

| Metric | Pre-split value |
|--------|----------------|
| `packages/sdks/oak-curriculum-sdk-generation` | did not exist |
| `packages/sdks/` workspaces | 2 (`oak-curriculum-sdk`, `oak-search-sdk`) |
| `packages/core/` packages | 4 (`env`, `oak-eslint`, `openapi-zod-client-adapter`, `result`) |
| Runtime SDK `type-gen/` files | 192 |
| Runtime SDK `src/` files | 303 |
| Runtime SDK `src/types/generated/` files | 106 |
| Runtime non-test files importing local `types/generated/` | 56 |

### 4b. Post-Phase-4 Current State (24 February 2026)

| Metric | Current value | Change |
|--------|--------------|--------|
| `packages/sdks/oak-curriculum-sdk-generation` | exists | created Phase 1 |
| `packages/sdks/` workspaces | 3 | +1 (generation SDK) |
| `packages/core/` packages | 5 | +1 (`type-helpers`, N3) |
| Generation SDK `type-gen/` files | 193 | moved from runtime |
| Generation SDK `src/` files | 163 | moved from runtime + generated |
| Runtime SDK `src/` files | 152 | reduced (generation code moved out) |
| Runtime SDK `type-gen/`, `src/types/generated/`, `src/bulk/` | absent | moved to generation |
| Runtime SDK `public/bulk.ts` | absent | deleted Phase 4.4 |
| Runtime non-test files importing local `types/generated/` | 0 | all rewired to generation subpaths |
| Generation SDK subpath exports | 11 (`.`, `/api-schema`, `/mcp-tools`, `/search`, `/zod`, `/bulk`, `/vocab`, `/query-parser`, `/observability`, `/admin`, `/widget-constants`) | — |

### 4c. Verification Commands

```bash
# Compare against baseline JSON
cat .agent/plans/semantic-search/active/sdk-workspace-separation-baseline.json

# Verify post-split structural invariants
ls -1 packages/sdks                                    # 3 workspaces
ls -1 packages/core                                    # 5 packages
test -d packages/sdks/oak-curriculum-sdk/type-gen && echo "FAIL" || echo "OK: no type-gen"
test -d packages/sdks/oak-curriculum-sdk/src/bulk && echo "FAIL" || echo "OK: no bulk"
test -f packages/sdks/oak-curriculum-sdk/src/public/bulk.ts && echo "FAIL" || echo "OK: no facade"

# Zero local generated imports in runtime SDK (was 56)
rg -l "from ['\"](\.{1,2}/)+types/generated" \
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
| Vocab-generated artefacts are runtime-owned today and must move now | Runtime `src/mcp/**` still contains generated graph data and mined synonym output (`definition-synonyms.ts`); Step 1 moves these. Curated synonym lists (`src/mcp/synonyms/`, 25 files) are agent context injection, not generation-owned artefacts — they stay runtime for Step 1. Co-location of all synonym content is a follow-on refinement. | Phase 3 | AC3 |
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
| Architecture review remediation (6 findings) | N1–N6 identified by four-reviewer sweep and deep import analysis post-Phase 4.4. All completed: N1 (turbo schema-cache inputs), N2 (ESLint boundary gap), N3 (type-helpers extraction), N4 (/vocab subpath), N5 (MCP tool dir flattening), N6 (generator bootstrap cycle). See [architecture-review-remediation.md](../archive/completed/architecture-review-remediation.md) for details. | Phase 5, 6 | AC5, AC7 |
| Synonym system conflates two concerns (agent context vs search expansion) | `synonymsData` serves both ontology injection (agent context, primary intent of curated lists) and ES query expansion (interim, pending bulk-data-derived pipeline). Authoritative search synonyms should derive from the bulk curriculum data (13,349 keywords with definitions) via a processing pipeline not yet built. Co-location of all synonym content is a follow-on target. See ADR-063 (predates this insight; needs revision post-pipeline). | Post-Step 1 | -- |

### Reverse-dependency inventory (generation -> runtime imports)

Files in `type-gen/` and `vocab-gen/` that import from runtime `src/`:

| File | Imports from |
|---|---|
| `vocab-gen/lib/index.ts` | `../../src/types/generated/bulk/index.js`, `../../src/bulk/reader.js` |
| `vocab-gen/generators/analysis-report-generator.ts` | `../../src/types/helpers/type-helpers.js` |
| `type-gen/generate-ai-doc.ts` | `../src/types/generated/api-schema/path-parameters.js`, `../src/types/generated/api-schema/mcp-tools/index.js` (now dynamic imports, N6) |
| `type-gen/mcp-security-policy.unit.test.ts` | `../src/types/generated/api-schema/mcp-tools/scopes-supported.js` (flattened by N5) |
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
    mcp/synonyms/**                      # curated agent vocabulary hints (co-location follow-on)
    mcp/synonym-export.ts                # synonym transform utilities (co-location follow-on)
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

Note on synonyms: `buildElasticsearchSynonyms` and related synonym utilities
currently conflate two concerns. The curated synonym lists (`src/mcp/synonyms/`)
are primarily **agent context injection** — vocabulary hints for AI agents
interpreting teacher queries. They also serve as an interim source for
Elasticsearch query expansion, but the authoritative source of truth for search
synonyms is the bulk curriculum data (13,349 keywords with definitions) via a
processing pipeline not yet built. ADR-063 will need revision when that pipeline
exists, to distinguish agent context (curated) from search expansion
(bulk-derived). See §16 (Synonym System Reference) for the full domain
knowledge reference.

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
| `@oaknational/curriculum-sdk-generation/bulk` | bulk pipeline APIs, schemas, types | `src/bulk.ts` |
| `@oaknational/curriculum-sdk-generation/vocab` | static graph data, ontology, mined synonyms | `src/vocab.ts` |
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

**Phases 3 and 4 form a single RED-GREEN cycle**: the build WILL be broken
after Phase 3 (RED) because consumers still import from old paths. Phase 4
fixes all broken imports (GREEN). Do NOT attempt the intermediate compilation
gate until Phase 4 is complete.

**Intermediate compilation gate** (after Phase 4):

```bash
pnpm type-gen    # explicit — Phase 3 moves vocab-gen
pnpm build
pnpm type-check
pnpm lint:fix    # Phase 4 establishes boundary compliance
```

File-level tasks (minimum):

Vocab-gen (39 files):

- `packages/sdks/oak-curriculum-sdk/vocab-gen/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/vocab-gen/**`
  - root (6 files): `vocab-gen.ts`, `vocab-gen.unit.test.ts`,
    `vocab-gen.integration.test.ts`, `vocab-gen-format.ts`,
    `vocab-gen-core.ts`, `run-vocab-gen.ts`
  - `lib/` (2 files): `index.ts`, `bulk-schemas.unit.test.ts`
  - `generators/` (16 files)
  - `extractors/` (13 files)
  - `reports/` (2 files)

Bulk data infrastructure (36 files):

- `packages/sdks/oak-curriculum-sdk/src/bulk/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/src/bulk/**`
  - root (4 files): `index.ts`, `reader.ts`, `reader.unit.test.ts`,
    `processing.ts`
  - `extractors/` (16 files)
  - `generators/` (16 files)

Generated artefacts:
- `packages/sdks/oak-curriculum-sdk/src/mcp/thread-progression-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/nc-coverage-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/generated/definition-synonyms.ts`

Authored domain ontology:

- `packages/sdks/oak-curriculum-sdk/src/mcp/property-graph-data.ts`

Generation workspace config updates:

- Update `tsconfig.json` / `tsconfig.lint.json` includes for new directories
- Update `vitest.config.ts` to include `vocab-gen/` test patterns
- Update ESLint config for new directories — copy relevant ESLint overrides
  from runtime SDK (lesson from Phase 2: forgetting this caused 270 lint errors)

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

**Phase 3+4 intermediate compilation gate**: see Phase 3 above for the
combined gate commands. Must pass before proceeding to Phase 5.

**Phase 3+4 review and consolidation**:

1. Invoke `code-reviewer` with instruction to recommend follow-on specialist
   reviews based on the change profile: architecture reviewers
   (structural/boundary changes), `test-reviewer` (test file moves, mock path
   updates), `type-reviewer` (import path type safety), `config-reviewer`
   (package.json and tsconfig changes).
2. Invoke all recommended specialists.
3. Address all blocking findings before proceeding.
4. Run `/jc-consolidate-docs` — extract permanent knowledge, update prompt and
   plan status, check napkin size.

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
    `../../client-types.js` is now shallow (was `../../../../`, flattened by N5).
  - **[N1 COMPLETED]** add `**/schema-cache/**` to turbo.json `type-gen`
    inputs — prevents stale cache when OpenAPI spec changes.
  - **[N2 COMPLETED]** extend `createSdkBoundaryRules('generation')` to cover
    `type-gen/**/*.ts` and `vocab-gen/**/*.ts` in generation ESLint config.
  - **[N3 COMPLETED]** extract `@oaknational/type-helpers` core package from
    duplicated `type-helpers.ts`. Both SDKs now depend on the shared package.
    Added to `LIB_PACKAGES` in boundary.ts.
  - **[N4 COMPLETED]** create `/vocab` subpath exporting static graph data
    and ontology; rewire 6 runtime SDK files from `/bulk` to `/vocab`.
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

**Phase 5 intermediate compilation gate**:

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
```

**Phase 5 review and consolidation**:

1. Invoke `code-reviewer` with instruction to recommend follow-on reviews.
   Consider: `test-reviewer` (test rename, assertion fixes, DI refactoring),
   `config-reviewer` (turbo.json, package.json dependency fixes),
   `type-reviewer` (if DI refactoring affects type flow).
2. Invoke all recommended specialists.
3. Address all blocking findings.
4. Run `/jc-consolidate-docs`.

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
  - **[N5 COMPLETED]** flatten MCP tool generated directory structure — removed
    `generated/data/` intermediate dirs, reducing tool file depth from 8 to 6
    levels. Import paths shortened (e.g. `../../../../` to `../../`). 26 tool
    files + definitions + stubs regenerated.
  - **[N6 COMPLETED]** break generator bootstrap cycle in `generate-ai-doc.ts`
    — static imports from generated output replaced with dynamic `import()`,
    deferring module resolution to runtime.
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
  - ~~**[consolidation]** extract §16 synonym system domain knowledge to
    synonyms README and ADR-063 revision note~~ — DONE (2026-02-24)
  - ~~**[consolidation]** add subpath export table to generation SDK
    README~~ — DONE (2026-02-24)
  - ~~**[consolidation]** add `createSdkBoundaryRules` to ESLint plugin
    README~~ — DONE (2026-02-24)
  - ~~**[consolidation]** create type-helpers README~~ — DONE (2026-02-24)

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

**Phase 6 intermediate gate**:

```bash
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
```

**Phase 6 review and consolidation**:

1. Invoke `code-reviewer` with instruction to recommend follow-on reviews.
   Consider: `docs-adr-reviewer` (README/TSDoc/ADR completeness and drift),
   `architecture-reviewer-barney` (subpath granularity decision),
   `architecture-reviewer-betty` (barrel auto-generation, OakApiPathBasedClient
   ownership).
2. Invoke all recommended specialists.
3. Address all blocking findings.
4. Run `/jc-consolidate-docs`.

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

**Determinism verification**: re-run `pnpm type-gen` without input changes
and verify no diff:

```bash
pnpm type-gen
git diff --exit-code packages/sdks/oak-curriculum-sdk-generation/src/types/generated/
```

**Phase 7 review and final consolidation**:

1. Invoke `code-reviewer` with instruction to recommend follow-on reviews for
   final sign-off. Consider: all four architecture reviewers (final structural
   compliance), `config-reviewer` (CI check configuration), `test-reviewer`
   (determinism verification), `release-readiness-reviewer` (merge readiness).
2. Invoke all recommended specialists including `release-readiness-reviewer`.
3. Address all blocking findings.
4. Run `/jc-consolidate-docs` — final consolidation:
   - Update `semantic-search.prompt.md`: mark SDK workspace separation complete.
   - Archive this canonical plan to `.agent/plans/semantic-search/archive/completed/`.
   - Extract any remaining permanent knowledge to ADRs or docs.
   - Update the [roadmap](.agent/plans/semantic-search/roadmap.md).

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

### 13.2 Tracked for Phase 5 — ALL COMPLETED

| # | Reviewer | Finding | Status |
|---|---------|---------|--------|
| F1 | config-reviewer | Turbo `test:e2e` input filename mismatch | **Resolved** — verified `vitest.config.e2e.ts` already matches turbo pattern |
| F2 | config-reviewer | Runtime SDK missing explicit `tsup` devDependency | **Resolved** — `tsup: ^8.5.1` already present |
| F3 | config-reviewer | Phantom `@next/eslint-plugin-next` devDependency | **Resolved** — not present in current codebase |
| F4 | test-reviewer | `typegen-core.test.ts` naming convention violation | **Fixed** — split IO test to `typegen-core-file-operations.integration.test.ts` |
| F5 | test-reviewer | Vacuous `expect(true).toBe(true)` in `zodgen.e2e.test.ts` | **Resolved** — no vacuous assertions found |
| F6 | test-reviewer | Silent error suppression in `zodgen.e2e.test.ts` | **Resolved** — `rmSync` called directly with `force: true`, no try/catch |
| F7 | wilma | Hardcoded relative import in `generate-tool-file.ts` | **Resolved** — path test already implemented and passing |
| F8 | wilma | `generate:clean` leaves workspace broken if `type-gen` fails | **Resolved** — recovery documented in generation SDK README (lines 52-58) |
| F9 | barney/betty | `SearchFacetsSchema` dual export | **Resolved** — only exported from `/search` subpath |
| F10 | code-reviewer | `src/types/index.ts` duplicates symbols from `src/index.ts` | **Fixed** — removed duplicates from `src/index.ts`, re-exports from `./types/index.js` |
| F18 | rules-review | `universal-tools.unit.test.ts` uses `vi.mock`/`vi.hoisted` | **Fixed** — `GeneratedToolRegistry` DI interface + `ToolRegistryDescriptor` (ISP). Eliminated all `vi.mock`/`vi.hoisted`. Removed all `as` assertions. Updated 10 call sites. |

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

### 13.6 Phase 5 Reviewer Suggestions — Priority for Next Session

Non-blocking suggestions from the Phase 5 final review (4 specialists:
code-reviewer, architecture-reviewer-barney, test-reviewer, type-reviewer).
These should be addressed at the **start of Phase 6** before beginning
Phase 6's own scope.

| # | Source | Suggestion | Action |
|---|--------|-----------|--------|
| S1 | code-reviewer, test-reviewer | Duplicated `generatedTools` stub across 4 integration test files (`aggregated-browse`, `aggregated-explore`, `aggregated-search`, `aggregated-fetch`). DRY violation — 5 copies of identical 8-line block. | Extract shared `createNullGeneratedToolRegistry()` helper into a test-utils module. |
| S2 | test-reviewer | `universal-tools.unit.test.ts` contains `vi.fn()` mocks in `createUniversalToolExecutor` tests (lines 126-261). Per testing strategy, `vi.fn()` makes these integration tests, not unit tests. | Consider splitting executor tests to `*.integration.test.ts`, keeping pure-function tests in `*.unit.test.ts`. |
| S3 | code-reviewer | `'_meta' in descriptor` guard in `list-tools.ts` (lines 52, 68) is redundant — `_meta` is already an optional property on `ToolRegistryDescriptor`. | Simplify to direct property access: `_meta: descriptor._meta`. |
| S4 | architecture-reviewer-barney | `listUniversalTools`, `isUniversalToolName`, and `createUniversalToolExecutor` gained new required parameters — source-breaking change for external consumers. | Account for API surface change in next semver version bump. |
| S5 | type-reviewer | `requiresDomainContext` is required (`boolean`) on full `ToolDescriptor` but optional (`boolean?`) on `ToolRegistryDescriptor`. Omitting it defaults to "include context hint" (`undefined !== false` is `true`). | Informational — safe default. Document the semantic difference if it becomes a concern. |
| S6 | code-reviewer | `createFakeRegistry` in unit test ignores its argument to `getToolFromToolName` — returns same descriptor for any name. | If a second tool name is added to tests, use `Map.get` or switch. No action needed with single-tool fixture. |

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

## 16. Synonym System Reference

This section documents the full synonym landscape to preserve domain knowledge
through the separation and beyond.

### 16.1 Architectural Framing: Two Distinct Concerns

The synonym system currently serves two fundamentally different purposes that
are conflated into a single data structure (`synonymsData`). Understanding
this distinction is essential:

**Concern 1 — Search synonym expansion** (search quality)

The authoritative source of truth for what terms mean the same thing in the
Oak curriculum is the **bulk curriculum data itself** — 13,349 keywords with
definitions, lesson titles, unit titles, thread names. A processing pipeline
to extract authoritative synonyms from this data does not yet exist. When it
does, it will supersede the hand-written lists for search purposes. The
current regex-based synonym miner (`synonym-miner.ts`) was an early experiment
that demonstrated the need for language understanding (LLM-powered extraction)
rather than pattern matching.

**Concern 2 — Agent context injection** (MCP tool quality)

The hand-written curated synonym lists are vocabulary hints injected into the
`get-ontology` MCP tool response. They help AI agents understand how teachers
and students talk about curriculum concepts — colloquialisms ("sohcahtoa"),
abbreviations ("PE"), UK/US variants ("factorising" / "factoring"), and
informal phrasings ("solving for x"). These are curated context for natural
language interpretation, not an authoritative synonym database.

**The conflation**: Currently both concerns are served by the same
`synonymsData` object flowing to both Elasticsearch (search expansion) and
the ontology (agent context). ADR-063 frames this as "single source of truth
for all consumers." In reality, the curated lists are a useful interim for
search while the bulk data pipeline does not exist, but the long-term
architecture separates these concerns by source and intent.

### 16.2 Co-location Decision

All synonym-related content should be co-located in one place, organised by
source and intent. This co-location is a **follow-on target** after the SDK
workspace separation (ADR-108 Step 1) is complete — it is not in-scope for
the current plan. Step 1 moves only the mined/generated synonym file
(`definition-synonyms.ts`); the curated synonym lists remain in runtime for
now. The natural next step after the separation is to move all synonym content
to one location, organised as described below:

| Source                                        | Intent                           | Current state                                  | Target state                                            |
| --------------------------------------------- | -------------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| **Curated** (hand-written, 23 files)          | Agent context injection          | Runtime SDK `src/mcp/synonyms/`                | Co-located, clearly labelled as agent vocabulary hints  |
| **Mined** (regex-extracted, 1 file)           | Early search pipeline experiment | Generation SDK `src/generated/vocab/synonyms/` | Co-located alongside curated                            |
| **Bulk-derived** (pipeline output)            | Authoritative search synonyms    | Does not exist yet                             | Future: co-located, clearly labelled as pipeline output |
| **Transform utilities** (`synonym-export.ts`) | Consumer-format adapters         | Runtime SDK `src/mcp/synonym-export.ts`        | Co-located with the data they transform                 |
| **Audit trail** (`bucket-c-analysis.ts`)      | Removed-entry documentation      | Runtime SDK `src/mcp/synonyms/`                | Co-located                                              |

### 16.3 Three Current Synonym Sources

**1. Curated subject-specific synonyms** (17 files, ~400 entries)

Hand-authored vocabulary hints for AI agent context. Each of the 17 Oak
subjects has a dedicated file currently in
`packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`:

| File                     | Subject             | Entries | Sensitivity | Examples                                                   |
| ------------------------ | ------------------- | ------- | ----------- | ---------------------------------------------------------- |
| `art.ts`                 | Art                 | ~45     | —           | watercolour ↔ watercolor, collage ↔ mixed media            |
| `citizenship.ts`         | Citizenship         | ~35     | MEDIUM      | democracy ↔ democratic system                              |
| `computing.ts`           | Computing           | ~15     | —           | raster ↔ bitmap, algorithm ↔ set of instructions           |
| `cooking-nutrition.ts`   | Cooking & Nutrition | ~25     | —           | nutrition ↔ nutrients                                      |
| `design-technology.ts`   | Design Technology   | ~40     | —           | prototype ↔ model, mechanism ↔ moving parts                |
| `english.ts`             | English             | ~10     | —           | punctuation ↔ grammar marks                                |
| `french.ts`              | French              | ~25     | —           | verb ↔ action word                                         |
| `geography.ts`           | Geography           | ~10     | —           | climate change ↔ global warming                            |
| `german.ts`              | German              | ~25     | —           | nominative case terminology                                |
| `history.ts`             | History             | ~10     | —           | ww1 ↔ world war 1                                          |
| `maths.ts`               | Maths               | ~40     | —           | trigonometry ↔ sohcahtoa, linear-equations ↔ solving for x |
| `music.ts`               | Music               | ~15     | —           | semibreve ↔ whole note                                     |
| `physical-education.ts`  | PE                  | ~45     | —           | invasion games ↔ team games, stamina ↔ endurance           |
| `religious-education.ts` | RE                  | ~70     | HIGH        | church ↔ chapel, mosque ↔ masjid (distinct concepts)       |
| `rshe-pshe.ts`           | RSHE/PSHE           | ~25     | HIGH        | mental health ↔ emotional wellbeing                        |
| `science.ts`             | Science             | ~15     | —           | photosynthesis ↔ chlorophyll                               |
| `spanish.ts`             | Spanish             | ~20     | —           | ser/estar distinction                                      |

**2. Curated structural/generic synonyms** (6 files, ~100 entries)

Cross-cutting educational vocabulary hints, not tied to a single subject:

| File             | Category           | Entries | Examples                                     |
| ---------------- | ------------------ | ------- | -------------------------------------------- |
| `subjects.ts`    | Subject names      | ~13     | maths ↔ mathematics, pe ↔ physical education |
| `key-stages.ts`  | Key stages         | ~4      | ks1 ↔ key stage 1                            |
| `exam-boards.ts` | Exam boards        | ~5      | aqa ↔ assessment and qualifications alliance |
| `numbers.ts`     | Number words       | ~10     | squared ↔ quadratic, one ↔ 1                 |
| `education.ts`   | Generic + acronyms | ~15     | sen ↔ special educational needs              |

Single source of truth rule: Subject names (e.g. `physical-education → pe`)
are ONLY in `subjects.ts`, never duplicated in subject-specific files.

**3. Mined definition synonyms** (1 generated file, 397 entries)

Generated by `vocab-gen/generators/synonym-miner.ts` from bulk download
keyword definitions using regex patterns ("also known as", "sometimes called",
parenthetical abbreviations). This was an early experiment towards deriving
synonyms from the bulk data — the intent was correct (bulk data is the
authoritative source) but the method was insufficient (regex cannot distinguish
synonyms from translations, phonemes, or examples).

Location after Phase 3 move:
`packages/sdks/oak-curriculum-sdk-generation/src/generated/vocab/synonyms/definition-synonyms.ts`

Quality finding: ~93% of regex-mined synonyms were noise (language
translations, phoneme patterns, examples). Only ~27 genuinely useful entries
were manually promoted to curated files. Regex mining is deprecated. The
future direction is LLM-powered extraction from the same bulk data source,
which can apply language understanding to distinguish true synonyms from
definitions, translations, and examples.

**Supporting file**: `bucket-c-analysis.ts` — documents 9 MFL translation
entries deliberately removed from French/German/Spanish synonym files (they
were definitions, not true synonyms). Not exported to the synonym set. Exists
for audit trail and future reference.

### 16.4 Barrel and Aggregation

All 23 curated categories are aggregated in `synonyms/index.ts` into a single
`synonymsData` object (typed as `SynonymsData`). This barrel is the only
import point for consumers. Adding a new category to `synonymsData`
automatically propagates to all four consumer domains.

### 16.5 Four Consumer Domains (Two Concerns)

The four consumers map to the two architectural concerns:

#### Concern 1: Agent Context Injection

**Domain 1 — AI Agent Ontology** (runtime, `ontology-data.ts`)

`synonymsData` is spread into the ontology returned by the `get-ontology` MCP
tool. This is the **primary intended use** of the curated lists — giving AI
agents vocabulary awareness for interpreting teacher queries. The synonyms
appear under `ontologyData.synonyms` with metadata explicitly noting they are
not exhaustive ("Use your language understanding to recognise other
variations").

Consumer chain: `synonyms/index.ts` → `ontology-data.ts` → MCP tool response
→ AI agent

#### Concern 2: Search Expansion (interim, pending bulk data pipeline)

The following three consumers use the curated lists as an interim synonym
source for search. When a bulk-data-derived synonym pipeline exists, these
consumers should transition to pipeline output for authoritative search
expansion, while the curated lists continue serving agent context.

**Domain 2 — Elasticsearch Query Expansion** (search infrastructure)

`buildElasticsearchSynonyms()` in `synonym-export.ts` transforms all
categories into ES entries with IDs like `{categoryName}_{canonical}` and
comma-separated synonym strings. Deployed as the `oak-syns` synonym set via
`PUT /_synonyms/oak-syns`. The `oak_text_search` analyser applies the
`synonym_graph` filter at query time — no reindexing needed for updates.

Consumer chain: `synonyms/index.ts` → `synonym-export.ts` →
`public/mcp-tools.ts` (re-export) → search SDK
`admin/create-admin-service.ts` (`upsertSynonyms`) → Elasticsearch

Also consumed by: search CLI `operations/utilities/generate-synonyms.ts`
(standalone JSON export), search CLI `lib/elasticsearch/setup/index.ts` (ES
setup command).

**Domain 3 — Phrase Detection and Boosting** (search quality)

`buildPhraseVocabulary()` extracts all multi-word terms (containing spaces)
into a `Set<string>`. Critical because ES synonym filters apply after
tokenisation — multi-word synonyms like "straight line" → "linear" cannot
expand via the synonym filter. ~40% of current synonyms are multi-word.

The phrase vocabulary feeds `detectCurriculumPhrases()` which adds
`match_phrase` boosting to RRF retrievers for exact phrase matches. Documented
in ADR-084.

Consumer chain: `synonyms/index.ts` → `synonym-export.ts` →
`public/mcp-tools.ts` → search SDK
`retrieval/query-processing/detect-curriculum-phrases.ts` and search CLI
`lib/query-processing/detect-curriculum-phrases.ts`

**Domain 4 — Term Normalisation** (lookup)

`buildSynonymLookup()` builds a flat `ReadonlyMap<string, string>` mapping
alternative terms (lowercased) to canonical terms. Used for normalising user
input before API calls.

Consumer chain: `synonyms/index.ts` → `synonym-export.ts` →
`public/mcp-tools.ts` → consumers

### 16.6 Sensitivity Handling

Three categories carry sensitivity notices and have undergone additional
review:

- **HIGH**: `religiousEducationConcepts` (~70 entries) — theological/cultural
  precision, avoidance of conflating distinct faith concepts (mosque ≠ masjid
  — these are kept as distinct for different contexts)
- **HIGH**: `rshePsheConcepts` (~25 entries, placeholder) — mental health,
  relationships terminology requiring inclusive and respectful handling
- **MEDIUM**: `citizenshipConcepts` (~35 entries) — political terminology
  handled neutrally

### 16.7 Current Location After Phase 3 (Fragmented)

| Workspace      | Path                                                  | Files                                                                              | Type                              |
| -------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| Runtime SDK    | `src/mcp/synonyms/`                                   | 25 (17 subject + 6 structural + `index.ts` + `README.md` + `bucket-c-analysis.ts`) | Curated agent context             |
| Runtime SDK    | `src/mcp/synonym-export.ts`                           | 1                                                                                  | Transform utilities (4 functions) |
| Generation SDK | `src/generated/vocab/synonyms/definition-synonyms.ts` | 1                                                                                  | Mined (early pipeline experiment) |
| Generation SDK | `vocab-gen/generators/synonym-miner.ts`               | 1                                                                                  | Mining generator                  |

This split is undesirable — all synonym content should be co-located and
organised by source and intent. See §16.2.

### 16.8 Governing ADRs

- **ADR-063**: SDK as single source of truth for domain synonyms. Established
  that all synonym definitions live in the SDK and flow to consumers via
  export utilities. Note: this ADR predates the two-concern insight. It frames
  the curated lists as "single source of truth" for all consumers, but the
  actual source of truth for search synonyms is the bulk curriculum data via a
  pipeline that does not yet exist. ADR-063 will need revision when that
  pipeline is built, to distinguish agent context (curated) from search
  expansion (bulk-derived).
- **ADR-084**: Phrase query boosting. Documents the complementary mechanism
  for multi-word synonym terms.
- **ADR-030**: SDK as single source of truth (parent decision).

### 16.9 Future Direction: Bulk Data Synonym Pipeline

The authoritative source of truth for curriculum synonyms is the bulk download
data: 13,349 unique keywords with definitions, lesson and unit titles, thread
names. A processing pipeline to extract synonyms from this data does not yet
exist. When it does:

1. **LLM-powered extraction** replaces regex mining. The synonym-miner
   experiment proved that regex finds text patterns, not semantic
   relationships. An LLM can distinguish true same-language synonyms from
   translations, phonemes, definitions, and examples — the exact categories
   that produced 93% noise in the regex approach.
2. **Pipeline output becomes the search synonym source**. The bulk-derived
   synonyms feed Elasticsearch query expansion (Domain 2), phrase detection
   (Domain 3), and term normalisation (Domain 4). The curated agent context
   lists continue to serve the ontology (Domain 1) independently.
3. **Search log analysis** supplements pipeline output. Actual failing user
   queries reveal vocabulary gaps that the bulk data may not cover (teacher
   colloquialisms, student slang).
4. **Teacher feedback** provides real-world validation. Gaps reported by
   users are the highest-signal input.

The curated lists and the pipeline output may overlap but serve different
masters: one serves AI agent understanding, the other serves search precision.
They should be co-located but clearly separated by intent.

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
    status: pending
  - id: baseline-inventory
    content: "Capture and persist reproducible baseline metrics and command definitions before file moves."
    status: pending
  - id: turbo-task-alignment
    content: "Update turbo.json to reflect the new cross-package task dependencies (runtime:build depends on generation:type-gen)."
    status: pending
  - id: generation-workspace-scaffold
    content: "Create packages/sdks/oak-curriculum-sdk-generation with package metadata, TS/ESLint/tsup configs, scripts, and README."
    status: pending
  - id: move-typegen-and-generated
    content: "Move type-gen/, schema-cache/, src/types/generated/, and vocab-gen/ into generation workspace with git-aware moves."
    status: pending
  - id: move-vocab-generated-runtime-artefacts
    content: "Move all vocab-generated runtime artefacts now (including src/mcp graph and synonym outputs) into generation ownership."
    status: pending
  - id: runtime-rewire-and-boundaries
    content: "Rewire runtime imports to generation public API, remove local generation ownership, and enforce runtime->generation only dependency direction."
    status: pending
  - id: tests-scripts-config-migration
    content: "Migrate coupled tests, script wiring, and config references (tsconfig/eslint/vitest/typedoc/check-generator-scope/turbo)."
    status: pending
  - id: docs-tsdoc-and-adr
    content: "Update TSDoc, READMEs, architecture docs, and ADR references so onboarding and ownership remain accurate."
    status: pending
  - id: validation-and-evidence
    content: "Run full gate chain and capture evidence for all acceptance criteria."
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

### G0. Prerequisite baseline gate (hard blocker) ✅ SATISFIED

**Decision (preserved)**: split implementation starts only from a verified,
reproducible pre-split baseline.

**Gate satisfied 22 February 2026**:

- generation workspace is absent (split not yet started)
- baseline file counts and import counts are measured with locked commands
- WS5 historical blocker is closed; split execution is unblocked
- OAuth/auth prerequisites are treated as completed architectural baseline via
  ADR-113 and ADR-115 (no plan-status dependency)

### D1. Move all vocab-generated artefacts now

**Decision (preserved)**: all vocab-generated artefacts move in Step 1 now;
no phased partial ownership.

This explicitly includes generated files currently emitted under runtime
`src/mcp/**`, not only `src/types/generated/**`.

### D2. One-way dependency remains strict

`@oaknational/curriculum-sdk` may depend on
`@oaknational/curriculum-sdk-generation`; generation may not depend on runtime.

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
- `packages/sdks/oak-curriculum-sdk/src`: 302 files
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
- Rewire runtime SDK to import from generation public exports only.
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
  type-gen/
  schema-cache/
  vocab-gen/
  src/
    types/generated/**
    generated/vocab/**           # or equivalent generation-owned path
    index.ts                     # public generation exports only

packages/sdks/oak-curriculum-sdk/
  src/
    client/**
    mcp/**                       # runtime composition/facades only
    public/**
    validation/**
    index.ts
  (no local type-gen/, schema-cache/, vocab-gen/, src/types/generated/)
```

Dependency direction:

```text
@oaknational/curriculum-sdk-generation  -> no dependency on runtime SDK
@oaknational/curriculum-sdk             -> depends on generation SDK
apps/* and search SDK                   -> continue depending on runtime SDK
```

## 8. Execution Phases (RED -> GREEN -> REFACTOR)

### Phase 0 - Baseline Lock and Prerequisite Verification

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

### Phase 1 - Scaffold Generation Workspace

Goal: introduce first-class generation workspace before moving content.

- RED:
  - `pnpm -F @oaknational/curriculum-sdk-generation build` fails before scaffold.
- GREEN:
  - create workspace package/config/readme/entrypoint.
  - register in `pnpm-workspace.yaml`.
  - workspace build and type-check pass.
  - align task graph with ADR-065 split-aware dependency strategy.
- REFACTOR:
  - align config shape with existing SDK workspace conventions.

File-level tasks:

- `pnpm-workspace.yaml`
- `packages/sdks/oak-curriculum-sdk-generation/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.build.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig.lint.json`
- `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk-generation/tsup.config.ts`
- `packages/sdks/oak-curriculum-sdk-generation/README.md`
- `packages/sdks/oak-curriculum-sdk-generation/src/index.ts`
- `turbo.json`

### Phase 2 - Move Type-Gen Core and Generated API Artefacts

Goal: move generation ownership for core type-gen pipeline and generated API
artefacts.

- RED:
  - generation scripts fail from old runtime paths after move starts.
- GREEN:
  - move `type-gen/`, `schema-cache/`, `src/types/generated/`.
  - rewire scripts/paths to generation workspace.
  - `pnpm -F @oaknational/curriculum-sdk-generation type-gen` regenerates
    artefacts in generation workspace.
- REFACTOR:
  - remove stale runtime references to moved paths.

File-level tasks:

- `packages/sdks/oak-curriculum-sdk/type-gen/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/type-gen/**`
- `packages/sdks/oak-curriculum-sdk/schema-cache/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/schema-cache/**`
- `packages/sdks/oak-curriculum-sdk/src/types/generated/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/src/types/generated/**`
- `packages/sdks/oak-curriculum-sdk/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/package.json`

### Phase 3 - Move All Vocab-Generated Artefacts (Now)

Goal: complete the preserved decision to move all vocab-generated artefacts now.

- RED:
  - runtime modules fail until imports are rewired from moved vocab outputs.
- GREEN:
  - move `vocab-gen/**` into generation workspace.
  - move generated vocab outputs currently in runtime `src/mcp/**`.
  - update vocab output roots and export barrels so runtime consumes generation
    package exports, not local generated files.
- REFACTOR:
  - normalise generated-path naming for clarity and future decomposition.

File-level tasks (minimum):

- `packages/sdks/oak-curriculum-sdk/vocab-gen/**` ->
  `packages/sdks/oak-curriculum-sdk-generation/vocab-gen/**`
- `packages/sdks/oak-curriculum-sdk/src/mcp/thread-progression-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/property-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/nc-coverage-graph-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/generated/definition-synonyms.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts`

### Phase 4 - Runtime Rewire and Boundary Corrections

Goal: runtime consumes only generation package public exports; no reverse
imports from generation to runtime.

- RED:
  - runtime build/type-check fails until imports/dependencies are corrected.
  - failing checks added for deep imports and reverse dependency attempts.
- GREEN:
  - replace local generated imports in runtime with
    `@oaknational/curriculum-sdk-generation` exports.
  - remove generation->runtime import in `vocab-gen/lib/index.ts`.
  - keep runtime aggregated tool composition local while consuming generated
    descriptor layers from generation exports.
- REFACTOR:
  - delete dead compatibility glue; simplify barrels to a single source.

File-level tasks (minimum):

- `packages/sdks/oak-curriculum-sdk/src/index.ts`
- `packages/sdks/oak-curriculum-sdk/src/public/*.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/**/*.ts`
- `packages/sdks/oak-curriculum-sdk/src/bulk/**/*.ts`
- `packages/sdks/oak-curriculum-sdk/src/validation/**/*.ts`
- `packages/sdks/oak-curriculum-sdk-generation/src/index.ts`
- `packages/sdks/oak-curriculum-sdk-generation/vocab-gen/lib/index.ts`

### Phase 5 - Tests, Scripts, and Config Migration

Goal: migrate coupling points that assume monolithic SDK layout.

- RED:
  - e2e/typegen script tests fail due to moved internals.
  - lint/type-check/build configs fail due to stale include paths.
- GREEN:
  - migrate tests importing `../../type-gen/*` internals.
  - update scripts/config for split ownership.
  - update scope guard script paths and allowlist entries.
- REFACTOR:
  - tighten config inputs to avoid cache drift and excess coupling.

File-level tasks (minimum):

- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/typegen-core.e2e.test.ts`
- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/zodgen.e2e.test.ts`
- `packages/sdks/oak-curriculum-sdk/package.json`
- `packages/sdks/oak-curriculum-sdk/tsconfig.json`
- `packages/sdks/oak-curriculum-sdk/tsconfig.lint.json`
- `packages/sdks/oak-curriculum-sdk/vitest.config.ts`
- `packages/sdks/oak-curriculum-sdk/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk/typedoc.json`
- `packages/sdks/oak-curriculum-sdk-generation/package.json`
- `packages/sdks/oak-curriculum-sdk-generation/tsconfig*.json`
- `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts`
- `scripts/check-generator-scope.sh`
- `turbo.json`

### Phase 6 - Generated Provenance, TSDoc, and Documentation Alignment

Goal: documentation and generated comments reflect the new ownership model.

- RED:
  - documentation/typedoc checks fail when references still point to monolith
    paths.
- GREEN:
  - update generator template banners/provenance paths.
  - add/update comprehensive TSDoc on generation public interfaces and runtime
    facades.
  - update READMEs and architecture docs.
- REFACTOR:
  - keep progressive disclosure coherent: root -> workspace -> deep docs.

File-level tasks (minimum):

- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-execute-file.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/mcp-tools/parts/generate-scopes-supported-file.ts`
- `packages/sdks/oak-curriculum-sdk-generation/type-gen/typegen/generate-widget-constants.ts`
- `packages/sdks/oak-curriculum-sdk/README.md`
- `packages/sdks/oak-curriculum-sdk-generation/README.md`
- `docs/architecture/openapi-pipeline.md`
- `docs/architecture/programmatic-tool-generation.md`
- `docs/development/build-system.md`
- `.agent/plans/semantic-search/active/sdk-workspace-separation.md`

### Phase 7 - Full Quality Gates and Evidence Capture

Goal: prove determinism, boundary compliance, and behavioural parity.

- RED:
  - run full chain and capture failures before fixes.
- GREEN:
  - pass every gate in strict order and capture evidence.
- REFACTOR:
  - simplify any brittle checks discovered during gate runs.

Mandatory quality gates (root, one at a time):

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

## 9. Acceptance Criteria (all mandatory)

1. **Pre-split baseline invariants are explicit and reproducible**
   - baseline commands in Section 4 return:
     - `type-gen` files = `192`
     - `src` files = `302`
     - `src/types/generated` files = `106`
     - runtime non-test local generated imports = `56`
   - `ls -1 packages/sdks` does not include
     `oak-curriculum-sdk-generation` at baseline time.

2. **Ownership split physically complete**
   - generation workspace contains moved `type-gen/`, `schema-cache/`,
     `vocab-gen/`, and `src/types/generated/`.
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

## 12. Pre-Phase-1 Open Decisions

Several architectural decisions must be resolved before Phase 1 starts.
See [sdk-separation-pre-phase1-decisions.md](sdk-separation-pre-phase1-decisions.md)
for full analysis and options:

- **`public/bulk` ownership**: generation-time pipeline vs runtime facade
  (CRITICAL — 22 consumer files in search CLI)
- **Vocabulary mining convergence**: single pipeline replacing fragmented
  synonym/alias/paraphrase sources
- **Phase 3 move list**: distinguish generated, authored, and
  runtime-composition files
- **Baseline gate strategy**: commit-anchored evidence vs hard-coded numbers
- **Phase collapse**: atomic vs sequential with intermediate compilation gates

## 13. Relationship to ADRs

- **ADR-108** (`108-sdk-workspace-decomposition.md`)
  - defines Step 1 split intent, boundary direction, and phased decomposition.
- **ADR-065** (`065-turbo-task-dependencies.md`)
  - defines task graph dependency/caching principles for split rewiring.
- **ADR-086** (`086-vocab-gen-graph-export-pattern.md`)
  - defines vocab pipeline ownership and generated graph artefact patterns.
- **ADR-113** (`113-mcp-spec-compliant-auth-for-all-methods.md`)
  - establishes completed OAuth/auth baseline context for merge-prep.
- **ADR-115** (`115-proxy-oauth-as-for-cursor.md`)
  - establishes completed Cursor OAuth compatibility baseline context.

---
name: SDK Workspace Separation (Canonical Merge Blocker)
overview: >
  Execute ADR-108 Step 1 by splitting generation-time responsibilities from
  runtime responsibilities into a dedicated
  `@oaknational/curriculum-sdk-generation` workspace, while preserving runtime
  behaviour and enforcing strict one-way boundaries.
  WS5 search replacement is complete; this plan is unblocked.
todos:
  - id: gate-ws5-completion
    content: "Hard gate: do not start split implementation until WS5 tasks are completed in phase-3a-mcp-search-integration.md."
    status: completed
  - id: grounding-and-decisions
    content: "Re-read directives and lock architectural decisions (WS5 gate, all vocab artefacts move now, one-way dependency)."
    status: pending
  - id: baseline-inventory
    content: "Capture and persist reproducible baseline metrics and command definitions before file moves."
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

This plan is merge-blocking for semantic-search branch work and is explicitly
aligned to the canonical findings in:

- `.agent/plans/semantic-search/active/sdk-workspace-separation-meta-plan.md`

## 2. Hard Gates and Non-Negotiable Decisions

### G0. WS5 completion gate (hard blocker) ✅ SATISFIED

**Decision (preserved)**: split execution is blocked until WS5 is complete.

**Gate satisfied 2026-02-22**: WS5 tasks (`ws5-skip-old-gen`,
`ws5-promote-search`, `ws5-quality-gates`) completed and verified
before Phase 3a plan was archived. See
[archived plan](../archive/completed/phase-3a-mcp-search-integration.md)
for evidence.

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

### D4. Cross-plan references must stay current

Use:

- `.agent/plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md`

Do not reference any legacy OAuth plan filename.

## 3. Grounding Commitments (mandatory per phase boundary)

Re-read and recommit before Phase 0, and at each phase transition:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

Primary references:

- `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md`
- `docs/architecture/openapi-pipeline.md`
- `docs/architecture/programmatic-tool-generation.md`
- `docs/development/build-system.md`
- `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md`
- `.agent/plans/pipeline-enhancements/sdk-workspace-separation-plan.md`
- `.agent/plans/semantic-search/active/phase-3a-mcp-search-integration.md`
- `.agent/plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md`

## 4. Repo-Grounded Baseline Snapshot (20 February 2026)

- `packages/sdks/oak-curriculum-sdk-generation`: does not exist
- `packages/sdks/oak-curriculum-sdk/type-gen`: 192 files
- `packages/sdks/oak-curriculum-sdk/src`: 310 files
- `packages/sdks/oak-curriculum-sdk/src/types/generated`: 110 files
- non-test runtime source files importing local `types/generated/*`: 58 files
- WS5 tasks `ws5-skip-old-gen`, `ws5-promote-search`, `ws5-quality-gates`:
  all pending

Method-locked baseline commands:

```bash
find packages/sdks/oak-curriculum-sdk/type-gen -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src/types/generated -type f | wc -l

rg -l "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \
  packages/sdks/oak-curriculum-sdk/src \
  --glob '!**/types/generated/**' \
  --glob '!**/*.test.ts' | wc -l

rg -n "ws5-skip-old-gen|ws5-promote-search|ws5-quality-gates" \
  .agent/plans/semantic-search/active/phase-3a-mcp-search-integration.md
```

## 5. Scope

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

## 6. Target State

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

## 7. Execution Phases (RED -> GREEN -> REFACTOR)

### Phase 0 - Gate Validation and Baseline Lock

Goal: enforce prerequisites and freeze reproducible baseline.

- RED:
  - prove gate is closed while WS5 tasks are pending.
  - prove baseline commands fail if paths/queries are invalid.
- GREEN:
  - record baseline metrics and command definitions in this plan.
  - confirm WS5 status via explicit IDs.
- REFACTOR:
  - simplify baseline command set to minimum reproducible set.

File-level tasks:

- `.agent/plans/semantic-search/active/phase-3a-mcp-search-integration.md`
  (status checks only)
- `.agent/plans/semantic-search/active/sdk-workspace-separation.md`
  (baseline updates)
- `.agent/plans/semantic-search/active/sdk-workspace-separation-meta-plan.md`
  (findings log updates)

### Phase 1 - Scaffold Generation Workspace

Goal: introduce first-class generation workspace before moving content.

- RED:
  - `pnpm -F @oaknational/curriculum-sdk-generation build` fails before scaffold.
- GREEN:
  - create workspace package/config/readme/entrypoint.
  - register in `pnpm-workspace.yaml`.
  - workspace build and type-check pass.
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
  - update scope guard script paths and plan reference.
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
- `.agent/plans/semantic-search/active/sdk-workspace-separation-meta-plan.md`

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

## 8. Acceptance Criteria (all mandatory)

1. **WS5 gate satisfied before execution**
   - `ws5-skip-old-gen`, `ws5-promote-search`, `ws5-quality-gates` are
     `completed` in
     `.agent/plans/semantic-search/active/phase-3a-mcp-search-integration.md`.

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

5. **One-way dependency enforced**
   - runtime depends on generation package.
   - generation package does not import runtime package internals.
   - boundary linting fails illegal imports and passes legal imports.

6. **Coupled tests/scripts/config migrated**
   - no tests import `../../type-gen/*` from runtime package.
   - `scripts/check-generator-scope.sh` allowlist and plan path are updated for
     split layout.

7. **Cross-reference drift fixed**
   - no references remain to legacy OAuth plan filenames in active SDK split
     plan documents.
   - all OAuth references use
     `.agent/plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md`.

8. **Determinism and parity proven**
   - full quality gate sequence passes.
   - re-running `pnpm type-gen` without input changes yields no diff.
   - runtime/consumer behavioural tests pass with no regression.

9. **Documentation and TSDoc are complete**
   - generation public APIs and runtime facades have comprehensive TSDoc.
   - workspace and architecture docs reflect new ownership and execution flow.
   - ADR update/addendum is recorded if any architectural intent diverges from
     ADR-108 assumptions during implementation.

## 9. Risks and Mitigations

- WS5 drift reopens moving target risk:
  keep G0 hard blocker and verify WS5 IDs before implementation starts.
- Partial vocab move creates split ownership entropy:
  enforce D1 and explicit acceptance criterion 3.
- Hidden reverse dependency in generation tooling:
  fail lint/build on generation->runtime imports and fix root causes.
- Config/task graph breakage after split:
  update turbo/package scripts alongside moves, not afterwards.
- Documentation drift:
  treat docs/TSDoc as same-phase deliverables, not post-merge cleanup.

## 10. Relationship to Other Plans

- Executes **ADR-108 Step 1**.
- Blocked by WS5 completion in:
  `.agent/plans/semantic-search/active/phase-3a-mcp-search-integration.md`.
- OAuth and cursor-flow dependencies tracked in:
  `.agent/plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md`.
- Follow-on decomposition remains deferred to ADR-108 Step 2/3.

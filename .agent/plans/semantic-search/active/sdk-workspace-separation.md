---
name: SDK Workspace Separation (Canonical Merge Blocker)
overview: >
  Execute Step 1 of ADR-108 by splitting generation-time responsibilities from
  runtime responsibilities: create `@oaknational/curriculum-sdk-generation`,
  move all generators and generated artefacts into it, and make
  `@oaknational/curriculum-sdk` consume only its public exports. This plan is
  executable, measurable, and merge-blocking for semantic search branch work.
todos:
  - id: grounding-and-decisions
    content: "Grounding and decisions: re-read directives/ADRs, lock the three architectural decisions (artefact ownership, aggregated-tool boundary, versioning policy), and record them in this plan before implementation."
    status: pending
  - id: baseline-inventory
    content: "Baseline inventory: capture exact pre-change state (file counts, import graph, workspace dependencies, type-gen/build pipelines) and persist the snapshot in this plan."
    status: pending
  - id: generation-workspace-scaffold
    content: "Create `packages/sdks/oak-curriculum-sdk-generation` with package metadata, TS/ESLint/tsup configs, scripts, and README."
    status: pending
  - id: move-generation-assets
    content: "Move `type-gen/`, `schema-cache/`, `vocab-gen/`, and `src/types/generated/` from runtime SDK to generation SDK using git-aware moves."
    status: pending
  - id: generation-public-api
    content: "Implement comprehensive generation package public API (barrels + TSDoc) that covers every runtime-consumed generated surface."
    status: pending
  - id: runtime-rewire
    content: "Update `@oaknational/curriculum-sdk` to depend on `@oaknational/curriculum-sdk-generation`, remove local generated artefacts, and replace all internal imports to generation package exports."
    status: pending
  - id: boundary-enforcement
    content: "Add lint/import boundary enforcement so runtime cannot import generation internals and generation cannot import runtime code."
    status: pending
  - id: monorepo-pipeline-updates
    content: "Update root workspace/task orchestration (`pnpm-workspace.yaml`, `turbo.json`, dependent package scripts/config) for deterministic type-gen and build ordering across two SDK workspaces."
    status: pending
  - id: docs-and-onboarding
    content: "Update READMEs/docs/plan cross-references to reflect new ownership and execution flow."
    status: pending
  - id: validation-and-evidence
    content: "Run full quality gates and acceptance checks, capture measurable evidence, and confirm no behavioural regression in MCP servers/search CLI."
    status: pending
isProject: false
---

# SDK Workspace Separation Plan (Canonical)

## 1. Intent

Execute **Step 1** of [ADR-108](../../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md):
separate the current monolithic `@oaknational/curriculum-sdk` into:

1. `@oaknational/curriculum-sdk-generation`
   (generation-time ownership)
2. `@oaknational/curriculum-sdk`
   (runtime ownership)

This is a **merge blocker** for current semantic search branch work because the
branch has increased generated surface area and therefore increased coupling
cost if separation is delayed.

## 2. Grounding Commitments (Mandatory)

Re-read and recommit at the start of the work and at every major phase boundary:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

Additional architecture/context references used for this plan:

- `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md`
- `docs/architecture/openapi-pipeline.md`
- `docs/architecture/programmatic-tool-generation.md`
- `docs/development/build-system.md`
- `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md`
- `.agent/plans/pipeline-enhancements/sdk-workspace-separation-plan.md`
- `.agent/plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md`
- `.agent/plans/semantic-search/active/phase-3a-mcp-search-integration.md`
- `.agent/plans/semantic-search/active/oauth-spec-compliance.md`

## 3. Scope

### In scope (Step 1 only)

- Introduce a dedicated generation workspace.
- Move generation code and generated artefacts into that workspace.
- Rewire runtime SDK to consume generation exports.
- Enforce one-way dependency and boundary rules.
- Keep runtime behaviour unchanged.

### Out of scope (deferred)

- ADR-108 Step 2/3 generic extraction (WS1/WS3 split).
- Full aggregated-tool type-gen refactor from
  `.agent/plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md`.
- Castr migration itself (planned after Step 1 boundary is proven).

## 4. Resolved Architectural Decisions

These close the open questions in prior drafts for Step 1 execution.

### D1. Generated artefact ownership

**Decision**: Generated artefacts are committed and owned in
`@oaknational/curriculum-sdk-generation`, not in runtime SDK.

**Why**:

- Aligns ownership with generation responsibility.
- Preserves schema-first contract where generator output is the source for runtime.
- Prevents runtime workspace re-assuming generation concerns.

### D2. Aggregated tool boundary in Step 1

**Decision**: Aggregated tool runtime composition (`search`, `fetch`,
`browse-curriculum`, `explore-topic`, etc.) remains in runtime SDK for Step 1.
Generated MCP descriptor/runtime layers remain generation-owned.

**Why**:

- Keeps Step 1 focused on generation/runtime separation.
- Avoids coupling this blocker to Phase 0 of the advanced tools plan.
- Still preserves schema-first generated universal tools.

### D3. Versioning and publish policy for Step 1

**Decision**: `@oaknational/curriculum-sdk-generation` is introduced as an
internal workspace package for now; no independent public release policy is
introduced in this step.

**Why**:

- Reduces release risk during structural migration.
- Keeps semantic versioning policy changes out of the merge blocker.
- Allows later ADR/plan to define external publication policy explicitly.

## 5. Baseline Snapshot (From Repository Audit)

This plan is based on direct repository inspection at planning time.

### Current SDK monolith footprint

- `packages/sdks/oak-curriculum-sdk/type-gen`: **192 files**
- `packages/sdks/oak-curriculum-sdk/src`: **310 files**
- `packages/sdks/oak-curriculum-sdk/src/types/generated`: **110 files**
- Non-test runtime source files importing `types/generated/*`: **58 files**

### Generated top-level domains currently present

- `api-schema/` (including MCP tool generation output)
- `zod/`
- `search/`
- `bulk/`
- `query-parser/`
- `admin/`
- `observability/`
- `widget-constants.ts`

### Monorepo dependency/consumer signal

- `pnpm-workspace.yaml` currently includes only `@oaknational/curriculum-sdk`
  and `@oaknational/oak-search-sdk` under SDKs.
- `@oaknational/curriculum-sdk` is imported widely by apps and search SDK
  (191 files matched in non-dist code for direct package imports).
- Root Turbo pipeline currently assumes one curriculum SDK workspace with
  `type-gen -> build -> test/type-check/lint` chaining.

## 6. Target State

```text
packages/sdks/oak-curriculum-sdk-generation/
  package.json
  tsconfig*.json
  eslint.config.ts
  tsup.config.ts
  README.md
  type-gen/
  schema-cache/
  vocab-gen/
  src/
    types/generated/**
    index.ts (public generation exports)

packages/sdks/oak-curriculum-sdk/
  src/
    client/**
    mcp/**           (runtime composition + facades)
    validation/**
    public/**
    index.ts         (runtime API, imports generation package)
  (no local type-gen/, schema-cache/, vocab-gen/, src/types/generated/)
```

Dependency direction after split:

```text
@oaknational/curriculum-sdk-generation  -> no dependency on runtime SDK
@oaknational/curriculum-sdk             -> depends on generation SDK
apps/*, @oaknational/oak-search-sdk     -> continue depending on runtime SDK
```

## 7. Execution Plan (RED -> GREEN -> REFACTOR)

Each phase includes explicit RED/GREEN/REFACTOR steps and measurable checks.

### Phase 0 - Foundation and Inventory

- Goal:
  Capture a hard baseline so migration correctness is provable.
- RED:
  Add or update audit scripts/tests that fail if generation surfaces are
  missing, runtime still uses local `src/types/generated/**`, or dependency
  direction becomes cyclical.
- GREEN:
  Capture in-plan baseline evidence (file counts, import graph, task graph,
  workspace dependencies).
- REFACTOR:
  Keep inventory commands reusable for future plan updates.
- Commands:

```bash
rg -l "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \
  packages/sdks/oak-curriculum-sdk/src \
  --glob '!**/types/generated/**' \
  --glob '!**/*.test.ts'

find packages/sdks/oak-curriculum-sdk/type-gen -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src/types/generated -type f | wc -l
```

### Phase 1 - Create Generation Workspace

- Goal:
  Scaffold a first-class workspace matching monorepo conventions.
- GREEN:
  Create:
  - `packages/sdks/oak-curriculum-sdk-generation/package.json`
  - `packages/sdks/oak-curriculum-sdk-generation/tsconfig.json`
  - `packages/sdks/oak-curriculum-sdk-generation/tsconfig.build.json`
  - `packages/sdks/oak-curriculum-sdk-generation/tsconfig.lint.json`
  - `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts`
  - `packages/sdks/oak-curriculum-sdk-generation/tsup.config.ts`
  - `packages/sdks/oak-curriculum-sdk-generation/README.md`
  - `packages/sdks/oak-curriculum-sdk-generation/src/index.ts`
  - Register workspace in `pnpm-workspace.yaml`.
- RED checks:
  `pnpm -F @oaknational/curriculum-sdk-generation build` fails before
  scaffolding exists.
- GREEN checks:
  Workspace build and type-check pass with no moved content yet.
- REFACTOR:
  Align config shape with `packages/sdks/oak-search-sdk` conventions.

### Phase 2 - Move Generation Ownership

- Goal:
  Move generation code and generated artefacts with history-preserving moves.
- GREEN:
  Move from `packages/sdks/oak-curriculum-sdk/` to
  `packages/sdks/oak-curriculum-sdk-generation/`:
  - `type-gen/`
  - `schema-cache/`
  - `vocab-gen/`
  - `src/types/generated/`
  - Update scripts and paths in both packages.
- RED checks:
  Existing generation commands fail until rewiring is complete.
- GREEN checks:
  - `pnpm -F @oaknational/curriculum-sdk-generation type-gen` regenerates
    `src/types/generated/**` in generation workspace.
  - `pnpm -F @oaknational/curriculum-sdk-generation build` passes.
- REFACTOR:
  Remove stale runtime references to moved generation directories.

### Phase 3 - Generation Public API

- Goal:
  Expose stable generation exports for runtime consumption.
- GREEN:
  Implement comprehensive generation exports via
  `packages/sdks/oak-curriculum-sdk-generation/src/index.ts` and supporting
  barrels.
  Export categories:
  - OpenAPI types and path constants.
  - Generated request/response validators and response maps.
  - Generated MCP descriptors/runtime layers.
  - Search/query-parser/admin/observability generated schemas and types.
  - Bulk and widget constants generated output.
- RED checks:
  Add compile checks/tests that fail when runtime requires non-exported
  generation surfaces.
- GREEN checks:
  Runtime compiles via package exports only (no deep paths).
- REFACTOR:
  Add TSDoc to generation entry points and remove duplicate runtime re-export
  indirections where sensible.

### Phase 4 - Runtime Rewire

- Goal:
  Convert runtime SDK from local-generated imports to package imports.
- GREEN:
  Update imports across:
  - `packages/sdks/oak-curriculum-sdk/src/index.ts`
  - `packages/sdks/oak-curriculum-sdk/src/public/*.ts`
  - `packages/sdks/oak-curriculum-sdk/src/validation/*.ts`
  - `packages/sdks/oak-curriculum-sdk/src/mcp/**/*.ts`
  - `packages/sdks/oak-curriculum-sdk/src/bulk/**/*.ts`
  - `packages/sdks/oak-curriculum-sdk/src/client/*.ts`
  - `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
  - `packages/sdks/oak-curriculum-sdk/src/elasticsearch.ts`
  Remove local generation ownership:
  - `packages/sdks/oak-curriculum-sdk/type-gen/`
  - `packages/sdks/oak-curriculum-sdk/schema-cache/`
  - `packages/sdks/oak-curriculum-sdk/vocab-gen/`
  - `packages/sdks/oak-curriculum-sdk/src/types/generated/`
- RED checks:
  Runtime build fails until dependencies/imports are rewired.
- GREEN checks:
  - `pnpm -F @oaknational/curriculum-sdk build` passes.
  - Runtime tests pass with no behavioural regression.
- REFACTOR:
  Remove dead runtime glue and stale comments about local generation ownership.

### Phase 5 - Boundary Enforcement

- Goal:
  Enforce the new boundaries through lint/tooling.
- GREEN:
  Enforce:
  1. Runtime cannot import generation internals via relative paths.
  2. Runtime uses public package imports for generation surfaces.
  3. Generation cannot import runtime modules.
  Likely updates:
  - `packages/sdks/oak-curriculum-sdk/eslint.config.ts`
  - `packages/sdks/oak-curriculum-sdk-generation/eslint.config.ts`
  - Potentially `packages/core/oak-eslint/src/rules/boundary.ts`
    (only if package-level rules are insufficient).
- RED checks:
  Add failing lint fixture cases for illegal imports.
- GREEN checks:
  `pnpm lint` fails for illegal imports and passes for legal imports.
- REFACTOR:
  Keep rules minimal and maintainable.

### Phase 6 - Monorepo Orchestration and Consumer Validation

- Goal:
  Keep `type-gen`, build, and consumer behaviour deterministic.
- GREEN:
  Update orchestration:
  - `pnpm-workspace.yaml`
  - `turbo.json`
  - package scripts affected by ordering changes
  Validate downstream consumers:
  - `packages/sdks/oak-search-sdk`
  - `apps/oak-curriculum-mcp-stdio`
  - `apps/oak-curriculum-mcp-streamable-http`
  - `apps/oak-search-cli`
- RED checks:
  Build/test tasks fail before dependency graph updates are complete.
- GREEN checks:
  - `pnpm type-gen` runs generation before runtime consumers.
  - `pnpm build` succeeds across all workspaces.
  - No consumer import breakage.
- REFACTOR:
  Simplify task graph inputs per ADR-065.

### Phase 7 - Documentation and Plan Alignment

- Goal:
  Prevent onboarding drift and keep architecture docs accurate.
- GREEN:
  Update at least:
  - `packages/sdks/oak-curriculum-sdk/README.md`
  - `packages/sdks/oak-curriculum-sdk-generation/README.md`
  - `docs/architecture/openapi-pipeline.md`
  - `docs/architecture/programmatic-tool-generation.md`
  - `docs/development/build-system.md` (if command graph changes)
  - relevant `.agent/plans/**` cross-references still assuming monolithic SDK
- RED/GREEN checks:
  `rg '@oaknational/curriculum-sdk/src/types/generated' --glob '*.md'`
  returns only intentional historical references.
- REFACTOR:
  Keep progressive disclosure path coherent:
  root README -> onboarding -> workspace README -> deep docs.

## 8. File-Level Worklist (Primary)

### Root

- `pnpm-workspace.yaml`
- `turbo.json`
- `package.json` (if root script routing changes)

### New workspace

- `packages/sdks/oak-curriculum-sdk-generation/**`

### Existing runtime workspace

- `packages/sdks/oak-curriculum-sdk/package.json`
- `packages/sdks/oak-curriculum-sdk/tsconfig*.json`
- `packages/sdks/oak-curriculum-sdk/tsup.config.ts`
- `packages/sdks/oak-curriculum-sdk/eslint.config.ts`
- `packages/sdks/oak-curriculum-sdk/src/**/*.ts` (import rewiring)
- `packages/sdks/oak-curriculum-sdk/typedoc*.json`

### Downstream workspaces likely requiring updates

- `packages/sdks/oak-search-sdk/package.json`
  (if dependency needs explicit generation package)
- `apps/oak-curriculum-mcp-stdio/package.json`
- `apps/oak-curriculum-mcp-streamable-http/package.json`
- `apps/oak-search-cli/package.json`

## 9. Measurable Acceptance Criteria

All criteria are mandatory.

1. **Ownership split is physically complete**
   - `test -d packages/sdks/oak-curriculum-sdk-generation/type-gen`
   - `test -d packages/sdks/oak-curriculum-sdk-generation/src/types/generated`
   - `test ! -d packages/sdks/oak-curriculum-sdk/type-gen`
   - `test ! -d packages/sdks/oak-curriculum-sdk/src/types/generated`

2. **Runtime no longer imports local generated paths**
   - `rg "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \`
     `packages/sdks/oak-curriculum-sdk/src --glob '!**/*.test.ts'`
     returns no matches.

3. **Runtime imports generation package exports only**
   - `rg "@oaknational/curriculum-sdk-generation" packages/sdks/oak-curriculum-sdk/src`
     returns expected import set.
   - No `@oaknational/curriculum-sdk-generation/src/*` deep imports exist.

4. **One-way dependency enforced**
   - `@oaknational/curriculum-sdk` depends on generation package.
   - generation package has no dependency on runtime package.

5. **Boundary linting is active**
   - Illegal fixture imports fail lint.
   - Legal imports pass lint.

6. **Build and test determinism preserved**
   - `pnpm type-gen` succeeds.
   - `pnpm build` succeeds.
   - Re-running `pnpm type-gen` without input changes yields no diff.

7. **Behavioural parity preserved**
   - SDK unit/integration tests pass.
   - MCP app test suites pass.
   - Search SDK/CLI tests pass (targeted suites at minimum).

8. **Documentation reflects new architecture**
   - No active onboarding docs claim generation artefacts are owned by runtime
     SDK.

## 10. Quality Gates and Validation Commands

Run from repository root, one at a time:

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

If full suite is too expensive during intermediate phases, run targeted
workspace gates first, but final sign-off requires full suite.

## 11. Risks and Mitigations

- Hidden runtime dependence on local generated files:
  Baseline import audit + boundary lint rules + explicit acceptance checks.
- Turbo cache instability after workspace split:
  Follow ADR-065 patterns and avoid directory-hash anti-patterns in `inputs`.
- Behaviour regression in universal/aggregated tools:
  Keep runtime composition code in place for Step 1 and run MCP integration
  and E2E tests.
- Docs and command drift:
  Update docs in the same change, run markdown lint, and verify onboarding
  chain continuity.
- Scope creep into Step 2/3 decomposition:
  Keep this plan strictly on generation/runtime separation and defer generic
  extraction.

## 12. Exit Criteria (Definition of Done)

This plan is complete only when all are true:

1. The two-workspace split is merged with enforced boundaries.
2. Runtime SDK has no local generation ownership.
3. All measurable acceptance criteria in Section 9 pass.
4. Full quality gate sequence in Section 10 passes.
5. Canonical docs and this plan are updated to match the implemented state.

## 13. Relationship to Other Plans

- This plan executes **ADR-108 Step 1**.
- After completion, proceed with:
  - Castr integration (Step 2 trajectory), then
  - generic extraction (Step 3 trajectory), and
  - aggregated tools type-gen refactor per
    `.agent/plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md`.

---
name: Search CLI-SDK Boundary Migration - Implementation Plan
last_updated: 2026-03-12
overview: >
  Execute the diagnosed CLI/SDK boundary doctrine by splitting read/admin surfaces,
  removing leaked internal and duplicate retrieval semantics, and enforcing the contract with
  lint and fitness checks so boundary drift becomes a blocking quality failure.
todos:
  - id: phase-0-boundary-contract
    content: "Lock boundary contract and ownership matrix in code-facing artefacts."
    status: pending
  - id: phase-1-sdk-surface-split
    content: "Split SDK export surfaces (read/admin) and remove internal leakage from default entrypoint."
    status: pending
  - id: phase-2-cli-import-migration
    content: "Migrate CLI modules to explicit SDK surfaces and preserve semi-separate admin entrypoints."
    status: pending
  - id: phase-3-duplication-removal
    content: "Remove CLI-local retrieval duplication and align canonical semantics to SDK."
    status: pending
  - id: phase-4-lint-fitness-enforcement
    content: "Encode boundary contract in lint rules with positive/negative proof fixtures."
    status: pending
  - id: phase-5-doc-adr-closeout
    content: "Publish ADR/docs updates and close with deterministic gates and reviewer evidence."
    status: pending
isProject: false
---

# Search CLI-SDK Boundary Migration - Implementation Plan

**Last Updated**: 12 March 2026

## Source Strategy

- Canonical doctrine source: `docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md`
- Active incident lane to align with: `cli-robustness.plan.md`
- ADR target number: `ADR-134`.
- ADR status: `ADR-134` exists and is accepted; Phase 0 validates and amends it if new
  boundary decisions emerge during RED proofing.
- Historical diagnostic context exists in a Cursor-local artefact, but this plan must remain
  standalone without runtime dependency on platform-local paths.
- Foundation docs:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`

## Preflight

Before implementation edits:

1. Re-read foundation docs listed above.
2. Confirm current boundary state and imports:

```bash
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/oak-search-sdk lint
```

3. Record baseline package surfaces:

```bash
rg -n "exports|from './admin|from './internal|createSearchSdk" packages/sdks/oak-search-sdk/{package.json,src/index.ts}
```

## Final As-Is Boundary Map

### Ownership Matrix (Current)

| Module family | Current owner | Correct owner | Boundary status |
|---|---|---|---|
| `apps/oak-search-cli/src/cli/search/**` command UX and handlers | CLI | CLI | Healthy, but currently consumes broad SDK root |
| `apps/oak-search-cli/src/cli/admin/**` admin command UX | CLI | CLI | Healthy if constrained to admin surface only |
| `apps/oak-search-cli/src/cli/shared/build-search-sdk-config.ts` | CLI | CLI | Healthy |
| `apps/oak-search-cli/src/cli/shared/build-lifecycle-service.ts` | CLI | Move to `src/cli/admin/shared/**` as admin-only orchestration over SDK admin | Boundary ambiguity while located under `shared/**` |
| `packages/sdks/oak-search-sdk/src/retrieval/**` | SDK | SDK | Canonical owner |
| `packages/sdks/oak-search-sdk/src/admin/**` | SDK | SDK | Canonical owner |
| `apps/oak-search-cli/src/lib/hybrid-search/**` | CLI | SDK (canonical retrieval semantics) | Boundary violation (duplicate semantics) |
| `apps/oak-search-cli/src/lib/query-processing/**` | CLI | SDK (canonical preprocessing) | Boundary violation (duplicate semantics) |
| `apps/oak-search-cli/src/lib/search-index-target.ts` | Shared/mixed | Split: SDK canonical constants + CLI coercion | Boundary drift (duplicate index resolver concern) |
| `packages/sdks/oak-search-sdk/src/internal/**` re-exported by `src/index.ts` | SDK root surface | Internal only | Boundary violation (internal leakage) |

### Boundary Evidence Anchors

- SDK currently exports only root `"."` surface (`packages/sdks/oak-search-sdk/package.json`).
- SDK root currently re-exports admin lifecycle helpers and internal index resolver symbols (`packages/sdks/oak-search-sdk/src/index.ts`).
- CLI currently imports SDK root broadly for both read and admin usage (`apps/oak-search-cli/src/cli/**`).

## Strict To-Be Boundary Contract

### Capability Surfaces

1. `@oaknational/oak-search-sdk/read`
   - Canonical retrieval semantics only.
   - Default consumer path for non-admin CLI modules.
2. `@oaknational/oak-search-sdk/admin`
   - Privileged lifecycle/write/admin operations only.
   - Allowed only in explicit admin entrypoints.
3. `internal/*`
   - Never importable by app code.
   - Never re-exported from root/default SDK surface.

### Import Policy

- Non-admin CLI modules must not import admin surface.
- App code must not import `internal/*` or deep SDK implementation paths.
- Root SDK entrypoint must not expose admin/write or internal symbols transitively.
- Experiment modules are deferred until a first real consumer exists (YAGNI).

## Violations Catalogue (Current, Prioritised)

### Critical

1. SDK root surface leaks `internal` symbols and admin lifecycle helpers.
   - Impact: privilege and layering boundaries are unenforced by API shape.
2. CLI and SDK both contain canonical retrieval/query-preprocessing semantics.
   - Impact: semantic drift risk under search quality and ingestion incidents.

### High

1. Single root SDK import path allows read code to reach admin capabilities.
   - Impact: read-only default cannot be guaranteed statically.
2. CLI-local resolver and indexing concerns overlap with SDK ownership.
   - Impact: duplicated boundary logic and migration friction.

### Medium

1. Lint does not yet encode read-vs-admin import policy in a targeted way.
   - Impact: violations are possible until discovered by review.
2. Operations/evaluation pathways can bypass intended SDK composition boundaries.
   - Impact: policy drift in low-visibility scripts.

## Long-Term Excellence Criteria and Fitness Functions

The boundary is healthy only when all checks below are true and blocking:

1. No duplicate canonical retrieval/preprocessing module families across CLI and SDK.
2. No app imports from SDK `internal/*` or deep implementation paths.
3. Non-admin CLI modules cannot import SDK admin surface.
4. Default SDK root entrypoint does not expose admin/write or internal symbols.
5. Any future experiment seam is introduced only with its own ADR and boundary tests.
6. Boundary fitness failures break lint/type gates and block merges.

## ADR and Documentation Targets

Required updates during this implementation:

1. ADR update/new ADR for final CLI/SDK capability contract:
   - read/admin surface doctrine
   - rejected alternatives and rationale
   - enforcement mechanisms (lint + package exports + tests)
2. `apps/oak-search-cli/README.md` and `apps/oak-search-cli/docs/ARCHITECTURE.md`:
   - explicit read-by-default and admin entrypoint boundaries
3. `packages/sdks/oak-search-sdk/README.md`:
   - subpath export usage guidance and privilege model
4. Semantic search planning docs:
   - ensure this implementation plan is indexed in active lane docs
   - ensure incident lane references the boundary policy once enforced

## TDD Execution Plan

### Phase 0 - Boundary Contract Validation + RED Proofs

- Step 0a (contract validation): verify ADR-134 still matches active boundary decisions,
  then amend ADR-134 only if decisions changed.
  - ADR file target: `docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md`
- Step 0b (RED proofs): write tests/checks that assert the target contract and fail on current state:
  - root SDK must not export admin/internal symbols (fails today, passes in GREEN)
  - non-admin CLI modules must not import admin helpers (fails today, passes in GREEN)
- Test/check locations:
  - extend `packages/core/oak-eslint/src/rules/sdk-boundary.unit.test.ts` for generic boundary primitives only
  - keep CLI-specific capability-matrix proof fixtures in the CLI workspace (no app-topology doctrine embedded in core)

Deterministic validation:

- `pnpm --filter @oaknational/eslint-plugin-standards test`
- `pnpm markdownlint:root`

### Phase 1 - SDK Surface Split (GREEN)

- Add explicit SDK exports for `read` and `admin` in package manifest.
- Restrict root `src/index.ts` to safe default surface (read-first, no internal leakage).
- Keep `internal/*` unexported.

Deterministic validation:

- `pnpm --filter @oaknational/oak-search-sdk build`
- `pnpm --filter @oaknational/oak-search-sdk type-check`
- `pnpm --filter @oaknational/oak-search-sdk test`

### Phase 2 - CLI Import Migration (GREEN)

- Migrate CLI imports:
  - `src/cli/search/**` -> `@oaknational/oak-search-sdk/read`
  - `src/cli/observe/**` -> `@oaknational/oak-search-sdk/read`
  - `src/cli/admin/**` -> `@oaknational/oak-search-sdk/admin`
- Shared modules:
  - `src/cli/shared/build-search-sdk-config.ts` -> read-safe config shape only
  - move `src/cli/shared/build-lifecycle-service.ts` -> `src/cli/admin/shared/**` (admin-only surface)
- Preserve semi-separate admin command structure.

Deterministic validation:

- `pnpm --filter @oaknational/search-cli type-check`
- `pnpm --filter @oaknational/search-cli test`

### Phase 3 - Duplication Removal and Canonical Semantics (REFACTOR)

- Remove CLI-local duplicate retrieval/preprocessing modules.
- Route canonical semantics through SDK retrieval surface only.
- Keep CLI as orchestration/runtime policy layer.

Deterministic validation:

- `pnpm --filter @oaknational/search-cli lint:fix`
- `pnpm --filter @oaknational/search-cli test`

### Phase 4 - Lint and Boundary Fitness Enforcement (REFACTOR)

- Enforcement mechanism split:
  1. Extend shared boundary primitives in `packages/core/oak-eslint/src/rules/boundary.ts`
     only where logic is reusable and app-agnostic.
  2. Define search-cli capability matrix policy in `apps/oak-search-cli/eslint.config.ts`
     (or an app-local lint helper).
  3. Keep existing `appArchitectureRules` deep-path/internal blocking (`**/internal/**`).
- Add at least one positive and one negative proof fixture per boundary class:
  - negative: `src/cli/search/**` importing `@oaknational/oak-search-sdk/admin` fails
  - positive: `src/cli/search/**` importing `@oaknational/oak-search-sdk/read` passes
  - negative: app code importing SDK deep/internal path fails
  - positive: `src/cli/admin/**` importing `@oaknational/oak-search-sdk/admin` passes

Deterministic validation:

- `pnpm --filter @oaknational/eslint-plugin-standards test`
- `pnpm --filter @oaknational/search-cli lint`

### Phase 5 - Docs Closeout

- Publish remaining docs updates listed above (ADR is validated/amended in Phase 0).
- Run full quality gates one gate at a time from repo root.
- Run required reviewer passes:
  - `code-reviewer`
  - architecture reviewer(s)
  - `type-reviewer`
  - `test-reviewer`
  - `docs-adr-reviewer`
  - `elasticsearch-reviewer` for ingestion/search-adjacent changes

Deterministic validation:

- `pnpm sdk-codegen`
- `pnpm build`
- `pnpm type-check`
- `pnpm lint:fix`
- `pnpm test`
- `pnpm markdownlint:root`

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Breaking import paths for existing CLI modules | Stage migration by module family and keep deterministic checks per phase |
| Admin/read split regresses operator workflows | Preserve admin command surface and add E2E command contract checks |
| Future experiment seam accidentally bypasses boundary | Add a separate ADR + boundary tests only when first experiment consumer is approved |
| Boundary rules drift over time | Treat lint fitness as blocking and maintain rule unit tests |

## Done When

1. SDK surfaces are split and root leakage removed.
2. CLI imports align to capability surfaces with admin semi-separate.
3. Duplicate canonical retrieval semantics are removed.
4. Lint fitness functions enforce boundary policy with proof fixtures.
5. ADR/docs are updated and this plan is the active executable reference.

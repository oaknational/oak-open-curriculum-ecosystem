# SDK Workspace Separation Plan

**Status**: PROPOSED  
**Created**: 08/11/2025  
**Last Updated**: 2026-02-12  
**ADR**: [ADR-108: SDK Workspace Decomposition](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)

---

## 1. Intent

Separate the monolithic `@oaknational/oak-curriculum-sdk`
into distinct workspaces with explicit, enforceable
boundaries.

This plan covers **Step 1** of the 4-workspace
decomposition defined in [ADR-108][adr-108]. Step 1
splits the SDK into two workspaces along the
generation-time / runtime axis:

1. `@oaknational/oak-curriculum-sdk-generation` — owns
   schema ingestion, type generation, validators,
   constants, MCP descriptors, search/ES mappings, and
   all code that runs at `pnpm type-gen` time.

2. `@oaknational/oak-curriculum-sdk` — consumes the
   generated artifacts to provide runtime clients,
   validation, MCP facades, and domain features.

**Step 2** (extracting generic OpenAPI pipeline from
Oak-specific configuration) follows after Castr
integration. See [ADR-108][adr-108] for the full
4-workspace end state.

[adr-108]: ../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md

---

## 2. Goals

- **G1**: Relocate all type-gen code, schema caches, and
  generated artifacts into a dedicated generation workspace
  without altering behaviour.
- **G2**: Introduce a comprehensive public API in the
  generation workspace that satisfies the schema-first
  execution directive.
- **G3**: Update the runtime workspace to consume only the
  new package exports, backed by ESLint/Turborepo rules
  enforcing the boundary.
- **G4**: Publish updated documentation and CI workflows
  reflecting the new workspace ownership.
- **G5**: Prepare the generation workspace for the
  generic/Oak-specific split that follows in Step 2.

---

## 3. Context

### Current state

All code lives in a single workspace:

```text
packages/sdks/oak-curriculum-sdk/
  type-gen/          (~180 files: generators, orchestrators, config)
  schema-cache/      (cached OpenAPI snapshots)
  vocab-gen/         (vocabulary generation)
  src/
    types/generated/ (output of type-gen)
    client/          (HTTP client, middleware)
    mcp/             (tool execution, aggregated tools)
    validation/      (response/request validators)
    ...
```

Generation-time and runtime code share a workspace, a
`package.json`, and a build pipeline. Oak-specific constants
are imported directly by generic generators. Generated files
sit alongside hand-written runtime code.

### Target state (Step 1)

```text
packages/sdks/oak-curriculum-sdk-generation/
  type-gen/          (all generators)
  schema-cache/      (OpenAPI snapshots)
  vocab-gen/         (vocabulary generation)
  src/               (public API: generated artifacts)

packages/sdks/oak-curriculum-sdk/
  src/
    client/          (HTTP client, middleware)
    mcp/             (tool execution, aggregated tools)
    validation/      (response/request validators)
    ...
  (depends on @oaknational/oak-curriculum-sdk-generation)
```

### Target state (Step 2 — after Castr, see ADR-108)

```text
packages/core/openapi-to-sdk/           (WS1: Generic Pipeline)
packages/sdks/oak-curriculum-sdk-generation/ (WS2: Oak Type-Gen)
packages/core/openapi-sdk-runtime/      (WS3: Generic Runtime)
packages/sdks/oak-curriculum-sdk/       (WS4: Oak Runtime)
```

Step 1 establishes the generation/runtime boundary. Step 2
draws the generic/Oak-specific boundary within each side.

---

## 4. Prerequisites

| Prerequisite | Status |
|---|---|
| MCP search integration complete | 📋 In progress |
| Search SDK extraction complete | ✅ |
| All quality gates pass | ✅ |

---

## 5. References

- [ADR-108: SDK Workspace Decomposition][adr-108]
- [ADR-030: SDK as Single Source of Truth](../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](../../../docs/architecture/architectural-decisions/031-generation-time-extraction.md)
- [ADR-038: Compilation-Time Revolution](../../../docs/architecture/architectural-decisions/038-compilation-time-revolution.md)
- `.agent/directives/schema-first-execution.md`
- `.agent/directives/rules.md`

---

## 6. Deliverables

1. `packages/sdks/oak-curriculum-sdk-generation` workspace
   (package.json, tsconfig, lint config, docs).
2. Runtime workspace updated to depend on the generation
   package only via public exports.
3. Generation workspace public API exporting all
   schema-first artifacts with TSDoc.
4. ESLint/Turborepo rules enforcing package boundaries.
5. Updated CI scripts, README files, and migration notes.

---

## 7. Phase Plan

### Phase 0 — Foundations

- Review ADRs and directives; confirm alignment.
- Inventory current type-gen outputs and runtime
  dependencies (every import from `types/generated/`).
- Capture current CI pipelines and identify updates.

### Phase 1 — Public API Blueprint

- Document every `src/types/generated/**` export the
  runtime currently consumes.
- Group exports into categories (OpenAPI types, path
  constants, MCP descriptors, Zod schemas, search assets,
  helpers).
- Draft the barrel export layout.

### Phase 2 — Workspace Scaffolding

- Create `oak-curriculum-sdk-generation` workspace; move
  `type-gen/`, `schema-cache/`, `vocab-gen/`, and generated
  artifacts using git-aware moves.
- Set up package.json, tsconfig, ESLint config, tsup config,
  and README.
- Define script pipeline (`type-gen`, `build`, `lint`,
  `test`, `docs`).

### Phase 3 — Barrel Export and Boundary Enforcement

- Build `src/index.ts` with comprehensive exports and TSDoc.
- Configure ESLint rules to forbid runtime workspace imports
  from generation internals.
- Update `turbo.json` and `pnpm-workspace.yaml`.

### Phase 4 — Runtime Workspace Updates

- Switch runtime imports to the new package.
- Remove generated artifacts from runtime workspace.
- Verify runtime tests, build, and CI pipelines.

### Phase 5 — Documentation

- Update workspace READMEs.
- Align logging/setup docs with new package boundaries.

### Phase 6 — Validation

- Execute validation plan (Section 9).
- Capture metrics (build latency, coverage, CI gate timings).

---

## 8. Acceptance Criteria

1. Generation workspace contains all type-gen logic, schema
   caches, and generated artifacts; runtime workspace
   contains no generated files.
2. Runtime workspace builds, tests, and lints using only
   public exports from the generation package.
3. ESLint boundary rules prevent cross-package leakage.
4. Generation public API exports all schema-first artifacts,
   with TSDoc.
5. CI pipelines run deterministically.
6. Documentation reflects the new structure.
7. All quality gates pass.

---

## 9. Validation Strategy

### Structural

- Verify file moves via `git status` (no content changes).
- Run `pnpm lint` with boundary rules to confirm no illegal
  imports.
- Check `pnpm build` orchestrates generation then runtime.

### Behavioural

- Runtime integration tests pass unchanged.
- MCP servers behave identically.

### Determinism

- Run generation twice and diff outputs.
- Record build and test durations.

---

## 10. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Hidden coupling between runtime and generated internals | Audit imports before move; ESLint boundary rules |
| CI complexity increases | Centralise scripts via Turborepo |
| Incomplete documentation | Dry-run onboarding and document |
| Future generator upgrade breaks API | Public API references manifest-based exports |

---

## 11. Open Questions

1. Should the generation workspace publish a CLI entry
   point, or remain library-only until the generic pipeline
   extraction (Step 2)?
2. How will versioning be handled if the generation package
   becomes public (semver policy)?
3. What is the right boundary for generated artifacts —
   committed in the generation workspace and consumed as a
   package, or committed in the runtime workspace?

---

## 12. Relationship to Other Plans

| Plan | Relationship |
|---|---|
| [openapi-to-tooling-integration-plan.md](openapi-to-tooling-integration-plan.md) | Describes the generic pipeline (WS1) extracted from WS2 in Step 2 |
| [openapi-to-mcp-framework-extraction-plan.md](openapi-to-mcp-framework-extraction-plan.md) | Describes the full framework extraction including runtime (WS3) |
| [Castr requirements](../external/castr/README.md) | Castr replaces openapi-zod-client after this separation |
| [MCP Infrastructure plan](../sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md) | Aggregated tools refactor targets WS2 (type-gen) and WS4 (runtime) |

---

## 13. Revision History

- **08/11/2025** — Plan created for 2-way split.
- **2026-02-12** — Rewritten to reference ADR-108
  4-workspace decomposition. Step 1 (2-way split) scoped
  as first phase of larger architecture. Prerequisites
  updated, stale references removed.

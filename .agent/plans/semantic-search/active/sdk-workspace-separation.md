---
name: SDK Workspace Separation (Merge Blocker)
overview: >
  Split the Curriculum SDK into two workspaces along the generation-time /
  runtime axis. The runtime package depends on the type-gen package, never
  the other way around. This is Step 1 of the 4-workspace decomposition
  defined in ADR-108 and is required before the current branch can merge.
todos:
  - id: phase-0-foundations
    content: "Phase 0 — Foundations: Review ADRs and directives, inventory current type-gen outputs and runtime dependencies (every import from types/generated/), capture current CI pipelines and identify updates."
    status: pending
  - id: phase-1-public-api
    content: "Phase 1 — Public API Blueprint: Document every src/types/generated/** export the runtime currently consumes. Group exports into categories (OpenAPI types, path constants, MCP descriptors, Zod schemas, search assets, helpers). Draft the barrel export layout."
    status: pending
  - id: phase-2-scaffold
    content: "Phase 2 — Workspace Scaffolding: Create oak-curriculum-sdk-generation workspace. Move type-gen/, schema-cache/, vocab-gen/, and generated artifacts using git-aware moves. Set up package.json, tsconfig, ESLint config, tsup config, and README."
    status: pending
  - id: phase-3-boundary
    content: "Phase 3 — Barrel Export and Boundary Enforcement: Build src/index.ts with comprehensive exports and TSDoc. Configure ESLint rules to forbid runtime workspace imports from generation internals. Update turbo.json and pnpm-workspace.yaml."
    status: pending
  - id: phase-4-runtime
    content: "Phase 4 — Runtime Workspace Updates: Switch runtime imports to the new package. Remove generated artifacts from runtime workspace. Verify runtime tests, build, and CI pipelines."
    status: pending
  - id: phase-5-docs
    content: "Phase 5 — Documentation: Update workspace READMEs. Align logging/setup docs with new package boundaries."
    status: pending
  - id: phase-6-validation
    content: "Phase 6 — Validation: Execute validation plan. Capture metrics (build latency, coverage, CI gate timings). Full quality gate chain."
    status: pending
isProject: false
---

## Intent

Separate the monolithic `@oaknational/curriculum-sdk` into two
workspaces with explicit, enforceable boundaries:

1. **`@oaknational/curriculum-sdk-generation`** — owns schema
   ingestion, type generation, validators, constants, MCP
   descriptors, search/ES mappings, and all code that runs at
   `pnpm type-gen` time.

2. **`@oaknational/curriculum-sdk`** — consumes the generated
   artifacts to provide runtime clients, validation, MCP
   facades, and domain features. Depends on the generation
   package. **Never the other way around.**

## Why Merge-Blocking

The current branch (`feat/semantic_search_deployment`) has
significantly expanded the surface area of generated artifacts
(search tool definitions, Zod schemas for search args, source
exclude lists, response formatters). Merging without the
boundary in place would:

- Entrench more runtime/type-gen coupling that must be
  unpicked later
- Make the subsequent Castr integration harder (Castr targets
  the generation workspace)
- Increase the cost of the separation with every additional
  generated artifact added to the monolithic workspace

## Relationship to Existing Plans

This plan is a merge-focused summary of the detailed
[SDK Workspace Separation Plan](../../pipeline-enhancements/sdk-workspace-separation-plan.md),
which contains the full context including goals (G1-G5),
acceptance criteria, validation strategy, risks and
mitigations, and open questions. The detailed plan also
describes the relationship to ADR-108's 4-workspace end
state.

See also:

- [ADR-108: SDK Workspace Decomposition](../../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [Meta-plan for improving this plan](sdk-workspace-separation-meta-plan.md)

## Rough Execution Outline

### Phase 0 — Foundations

- Review ADR-108 and directives (schema-first-execution,
  rules.md)
- Inventory type-gen outputs: `type-gen/`, `schema-cache/`,
  `vocab-gen/`, `src/types/generated/`
- Map every runtime import from generated artifacts
- Capture current CI pipelines and identify required updates

### Phase 1 — Public API Blueprint

- Document every `src/types/generated/**` export consumed
  by runtime code
- Group into categories: OpenAPI types, path constants, MCP
  descriptors, Zod schemas, search assets, helpers
- Draft barrel export layout for the generation package

### Phase 2 — Workspace Scaffolding

- Create `packages/sdks/oak-curriculum-sdk-generation/`
- Move `type-gen/`, `schema-cache/`, `vocab-gen/`, and
  generated artifacts using git-aware moves
- Set up `package.json`, `tsconfig.json`, ESLint config,
  `tsup` config, README
- Define script pipeline (`type-gen`, `build`, `lint`, `test`)

### Phase 3 — Barrel Export and Boundary Enforcement

- Build `src/index.ts` with comprehensive exports and TSDoc
- Configure ESLint import rules forbidding runtime-to-
  generation internal imports
- Update `turbo.json` and `pnpm-workspace.yaml`

### Phase 4 — Runtime Workspace Updates

- Switch all runtime imports to `@oaknational/curriculum-sdk-generation`
- Remove generated artifacts from runtime workspace
- Verify tests, build, and CI

### Phase 5 — Documentation

- Update workspace READMEs
- Align docs with new package boundaries

### Phase 6 — Validation

- File moves via `git status` (no content changes)
- `pnpm lint` with boundary rules (no illegal imports)
- `pnpm build` orchestrates generation then runtime
- Runtime integration tests pass unchanged
- MCP servers behave identically
- Full quality gate chain

## Target State

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
  (depends on @oaknational/curriculum-sdk-generation)
```

## Acceptance Criteria

1. Generation workspace contains all type-gen logic, schema
   caches, and generated artifacts; runtime workspace
   contains no generated files.
2. Runtime workspace builds, tests, and lints using only
   public exports from the generation package.
3. ESLint boundary rules prevent cross-package leakage.
4. One-way dependency: runtime depends on generation, never
   the reverse.
5. All quality gates pass.

## Open Questions

See [detailed plan](../../pipeline-enhancements/sdk-workspace-separation-plan.md#11-open-questions)
for the full list. Key questions to resolve during Phase 0:

1. Should generated artifacts be committed in the generation
   workspace or the runtime workspace?
2. How will versioning work if the generation package
   becomes public?
3. Where do aggregated tool definitions land (they are
   currently hand-written runtime code but are conceptually
   type-gen output)?

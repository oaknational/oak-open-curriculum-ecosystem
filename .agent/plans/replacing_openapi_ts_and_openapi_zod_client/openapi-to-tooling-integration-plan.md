# OpenAPI-to-Tooling Integration Plan

**Status**: PROPOSED  
**Created**: 08/11/2025  
**Owner**: Engineering

## Purpose

Define how we replace `openapi-typescript` and `openapi-zod-client` with the new `@oaknational/openapi-to-tooling` generator while keeping the Oak Curriculum SDK and MCP artefacts behaviourally identical. The plan centres on strongly typed interfaces, behavioural guarantees, and hook-driven customisation rather than byte-for-byte reproduction of today’s output.

## Context and References

- `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/mcp_ecosystem_integration_requirements.md`
- `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/PHASE-4-ARTEFACT-EXPANSION.md`
- `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/openapi-to-mcp-framework-extraction-plan.md`
- `.agent/directives-and-memory/rules.md`
- `.agent/directives-and-memory/schema-first-execution.md`
- `docs/agent-guidance/testing-strategy.md`

## Problem Statement

Our current pipeline shell-executes `openapi-typescript` and `openapi-zod-client`, layering significant post-processing to reach the artefacts our SDK and MCP runtime consume. This split increases maintenance overhead and constrains design choices. We need a single generator that emits all artefacts in one pass while permitting independent evolution of both the external library and this repository.

## Goals

1. Publish `@oaknational/openapi-to-tooling` as a workspace providing a strongly typed `generate` API and CLI manifest output.
2. Migrate all generic writers (types, parameter maps, response metadata, Zod catalogue, MCP scaffolding) into the new library.
3. Keep Oak-specific behaviour (canonical URL decoration, 404 augmentation, search fixtures, synonym maps) as configurable hooks or downstream consumers.
4. Guarantee SDK/MCP behavioural parity via structural assertions and runtime tests, avoiding brittle byte-for-byte comparisons.
5. Provide deterministic manifests inside the library and simple integration points for repositories to write artefacts or consume them in-memory.

## Non-Goals

- Re-implement Oak-specific schema decorations inside the external library.
- Maintain compatibility layers for the legacy generator scripts.
- Freeze the new library’s output to today’s file layout or formatting.

## Approach

### 1. Library Scaffold and IR Alignment

- Create `packages/libs/openapi-to-tooling` (name TBD) exporting `generate({ schema, transforms, writers, hooks })`.
- Define a declarative configuration schema (e.g. `openapi-tooling.config.ts`) that maps repository preferences—hook implementations, writer selection, output layout—into the generator.
- Reuse the Phase 3 IR schema to drive modular writers (`types`, `metadata`, `zod`, `schema-json`, `client`, `mcp`).
- Emit a manifest:

  ```ts
  interface GeneratedFile {
    readonly path: string;
    readonly contents: string;
    readonly kind: 'typescript' | 'json' | 'metadata';
  }
  interface GenerationResult {
    readonly files: readonly GeneratedFile[];
    readonly schemaInfo: SchemaInfo;
    readonly warnings: readonly string[];
  }
  ```

- Guarantee deterministic ordering and include provenance headers sourced from `SchemaInfo`.

### 2. Writer Migration

- Move generic writers from `packages/sdks/oak-curriculum-sdk/type-gen/typegen/**` into the library, refactoring them to consume the shared IR.
- Consolidate the Zod generation logic so the library emits endpoints, schema collections, helper maps, and JSON Schema siblings in a single pass.
- Port MCP generation to accept tool naming and sample hooks, returning tool descriptors, runtime executors, aliases, and stub payload metadata.

### 3. Hook Surface for Oak Customisation

- Provide extension points for:
  - Schema transforms (canonical URLs, legitimate 404 responses).
  - Enum renaming/filters.
  - Tool naming and alias generation.
  - Stub payload overrides and sample hints.
- Document each hook with TypeDoc, emphasising that vendor-specific logic must live outside the core generator.

### 4. Repository Integration

- Update `packages/sdks/oak-curriculum-sdk/type-gen/typegen.ts` to:
  - Fetch/decorate the schema (unchanged).
  - Load repository configuration (hooks, writer selection, output layout) from `openapi-tooling.config.ts`.
  - Invoke the new generator programmatically.
  - Apply Oak-specific transforms via hooks.
  - Persist emitted manifest entries.
- Remove direct dependencies on `openapi-typescript` and `openapi-zod-client`.
- Retain search/ontology/query parser writers in-repo, fed by the generator manifest rather than the legacy helpers.

## Validation Strategy

- **Structural assertions**:
  - Each generated tool descriptor exposes validated args/results for every documented operation.
  - Response maps enumerate the same status codes as the source schema.
  - Zod schema collections expose the lookup helpers consumed by runtime validators.
- **Behavioural tests**:
  - Re-use existing request/response validator tests to prove runtime behaviour (no golden file comparisons).
  - Exercise MCP execution paths to confirm parameter validation, client invocation, and result typing work via generated descriptors.
  - Compile a fixture project against the generated `paths`/`operations` interfaces to verify `openapi-fetch` compatibility.
- **Cross-schema validation**: run the generator against at least one non-Oak reference schema to prove vendor-agnostic behaviour, exercising the same structural and behavioural tests where feasible.
- **Determinism**: Library-level tests run the generator twice on the same fixture and assert identical manifests.
- **Hook coverage**: Add unit tests for canonical URL and legitimate 404 transforms, plus tool naming overrides, ensuring extension points satisfy Oak needs.

## Quality Metrics & Reporting

- Track generation latency for Oak and reference schemas (target ≤ 60 s locally, ≤ 5 min in CI).
- Enforce minimum coverage thresholds: ≥ 85 % for generated SDK integration tests, ≥ 90 % for library packages.
- Capture CI gate timings (format, type-check, lint, test, build, docs) and maintain a dashboard mirroring the framework extraction plan metrics.
- Verify documentation health by running `pnpm docs:verify` and Lighthouse audits (≥ 95 % accessibility) on generated docs/examples.
- Log onboarding dry-run results to confirm new consumers can integrate the generator in < 4 hours.

## Deliverables

- `@oaknational/openapi-to-tooling` workspace with typed API, CLI, and documentation.
- Updated SDK type generation scripts relying solely on the new library.
- Behavioural test suites demonstrating SDK and MCP parity.
- Migration notes outlining replaced dependencies and hook usage.
- Configuration guide documenting available hooks, defaults, and expected CI quality gates.

## Dependencies

- Phase 3 IR completion (`.agent/plans/replacing_openapi_ts_and_openapi_zod_client/PHASE-4-ARTEFACT-EXPANSION.md`).
- SDK workspace separation (`.agent/plans/sdk-workspace-separation-plan.md`) to ensure a clean boundary between generation and runtime workspaces.
- Stable schema cache workflow for offline generation.
- Agreement on workspace naming and publication strategy.

## Risks and Mitigations

- **Risk**: Hidden coupling to legacy file layouts.  
  **Mitigation**: Rely on structural/behavioural assertions and manifest contracts, not snapshot diffs.

- **Risk**: Hook API insufficient for Oak customisation.  
  **Mitigation**: Capture all current in-repo extensions before migration; add targeted tests around each hook.

- **Risk**: Determinism regressions when writers evolve.  
  **Mitigation**: Library CI enforces manifest determinism across runs and Node versions.

## Open Questions

1. Should the manifest support incremental writes or only whole-directory emission?
2. Do we need an adapter layer for other Oak repos, or is the manifest sufficient?
3. What release cadence and versioning strategy should the new workspace follow (e.g., semver with prereleases)?

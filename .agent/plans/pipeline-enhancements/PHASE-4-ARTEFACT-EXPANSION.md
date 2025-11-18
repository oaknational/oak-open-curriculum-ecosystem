# Phase 4 Plan – Artefact Expansion & SDK Integration

**Status:** Draft  
**Prerequisites:** Phase 3 (Typed IR & ts-morph migration) complete; Scalar pipeline + MCP enhancements (Phase 2) stable  
**Reference:** `.agent/plans/additional_project_requirements.md`

---

## Session Summary

| #   | Session                                  | Intent                                                                           |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| 4.1 | Writer Framework & Manifest              | Introduce modular writers, manifest orchestration, and CLI/API parity.           |
| 4.2 | OpenAPI Fetch Type Suite                 | Emit `paths/operations/components/webhooks` types compatible with openapi-fetch. |
| 4.3 | Constants & Guards Expansion             | Generate catalogues, enums, metadata, and parameter schema maps.                 |
| 4.4 | Runtime Schema & Zod Catalogue           | Produce decorated schema modules, Zod outputs, and JSON Schema companions.       |
| 4.5 | Client Wrappers & MCP Tooling            | Deliver client helpers plus MCP summaries, samples, and naming utilities.        |
| 4.6 | Validation, Documentation & Release Prep | Consolidate testing, documentation, and release readiness.                       |

---

## 1. Vision & Goals

Deliver the multi-artefact toolchain described in the additional project requirements so a single run of the generator produces every SDK deliverable:

- TypeScript interfaces for `openapi-fetch` (`paths`, `operations`, `components`, `webhooks`)
- Deterministic enumerated constants and type guards
- Request/response metadata maps (including per-channel parameter schemas)
- Decorated schema JSON/TS modules with provenance
- Zod validators, helper maps, and runtime schema collections
- OpenAPI Fetch client wrappers and manifest outputs
- MCP-specific summaries, sample utilities, and tool scaffolding inputs

All artefacts consume the **Phase 3 IR** and continue to validate against official OpenAPI schemas and MCP Draft 2025-06-18 requirements. Output must be deterministic and configurable through modular writers.

---

## 2. Guiding Principles

1. **Single Pass:** Reuse the prepared IR from Phase 3; no additional schema parsing.
2. **Writer Modularity:** Introduce pluggable writers (types, zod, metadata, clients, MCP) that share the same IR.
3. **Deterministic & Stable:** Byte-for-byte identical output for identical input + config.
4. **Schema Compliance:** All regenerated OpenAPI documents and derived JSON Schemas validate against `.agent/reference/openapi_schema/*.json` and MCP schemas.
5. **Vendor Agnostic:** Oak-specific behaviour remains opt-in via hooks; defaults stay platform neutral.
6. **Documentation First:** Every emitted module includes TSDoc sourced from the OpenAPI descriptions.

---

## 3. Milestones

### M1. Writer Orchestration & Manifest (est. 1 week)

- Define writer API (`types`, `zod`, `metadata`, `client`, `mcp`, `schema-json`).
- Implement generation manifest (`GeneratedFile`, `GenerationResult`) consumed by both CLI and programmatic API.
- Add CLI options mirroring programmatic `writers[]`, `outputDir`, and transform hooks.

### M2. OpenAPI Fetch Type Suite (est. 1–2 weeks)

- Emit `paths`, `operations`, `components`, `webhooks` interfaces compatible with `openapi-fetch@^0.15`.
- Produce deterministic parameter decomposition (`path/query/header/cookie`) and numeric status literal responses.
- Generate TSDoc per operation/parameter from OpenAPI descriptions.
- Validate by compiling a fixture project that imports the generated interfaces.

### M3. Derived Constants & Guards (est. 1 week)

- Emit path catalogues (`PATHS`, `ValidPath`, `allowedMethods`, `isAllowedMethod`).
- Produce enum constants/guards for all schema-defined `enum`/`const` values with renaming hooks.
- Generate operation metadata (`PATH_OPERATIONS`, `OPERATIONS_BY_ID`) and request parameter schema maps.

### M4. Runtime Schema & Zod Catalogue (est. 1–2 weeks)

- Emit decorated schema as `schema.ts` + JSON snapshots with provenance header.
- Produce single-pass Zod outputs: endpoints array, helper maps (operation IDs, primary status), `buildSchemaCollection`.
- Attach JSON Schema counterparts for request/response validators to satisfy downstream tooling requirements.

### M5. Client & MCP Tooling (est. 1–2 weeks)

- Generate `createApiClient` / `createPathClient` wrappers around `openapi-fetch`.
- Provide MCP operation summaries, sample generators, tool naming helpers, and JSON Schema payloads derived from the same IR.
- Ensure MCP tool bundle can be rebuilt using only generated artefacts (integration test).

### M6. Validation & Documentation (est. 1 week)

- Expand characterisation tests to cover full artefact set (types, zod, clients, MCP).
- Add integration tests: diff output determinism, compile-time checks, MCP tool regeneration, schema validation.
- Update README, CLI help, migration guides, and changelog.

---

## 4. Deliverables

- Modular writer API and CLI with manifest output.
- Full type suite (`paths`, `operations`, `components`, `webhooks`) with TSDoc.
- Deterministic constants/guards and parameter schema maps.
- Decorated schema JSON/TS modules with provenance.
- Zod endpoints + helper maps + JSON Schema validators.
- OpenAPI Fetch client helpers.
- MCP tool metadata, sample utility, and naming helpers.
- Comprehensive tests ensuring compliance and determinism.

---

## 5. Success Criteria

- Running `generate({ schema, writers: 'all' })` produces types, Zod, metadata, clients, MCP artefacts, and schema snapshots in one execution.
- Emitted `paths` interface compiles with `openapi-fetch@^0.15` and matches existing SDK behaviour.
- Zod validators cover every request channel and response status; JSON Schema siblings align.
- Enumerated constants, request parameter maps, and operation metadata require no downstream patching.
- MCP tool generation consumes only generated artefacts to match current behaviour.
- Two identical runs produce identical manifests (verified via CI).
- All outputs documented with TSDoc derived from OpenAPI descriptions.

---

**Next Steps:**

1. Finalise Phase 3 implementation and capture IR schema/versioning.
2. Spike on writer orchestration to confirm API ergonomics.
3. Begin Milestone 1 with TDD + characterisation groundwork.

---

## Sessions

### Session 4.1 – Writer Framework & Manifest

- **Intent:** Implement the modular writer framework and manifest return structure used by both CLI and programmatic APIs.
- **Acceptance Criteria:**
  - Writer API defined (`types`, `zod`, `metadata`, `client`, `mcp`, `schema-json`).
  - `GenerationResult` manifest implemented with file metadata and warnings.
  - CLI mirrors programmatic options for selecting writers, output directory, and transform hooks.
- **Definition of Done:**
  - Manifest-driven generation integrated with CLI command (including dry-run support).
  - Unit tests validate manifest structure for sample writers.
  - Documentation snippet describing writer selection appended to README/CLI help draft.
- **Validation Steps:**
  1. `pnpm test -- run src/generation/generation-manifest.test.ts`
  2. CLI smoke run (`pnpm openapi-zod-validation ... --writers types --dry-run`)
  3. Manual inspection of manifest JSON for complex fixture.

### Session 4.2 – OpenAPI Fetch Type Suite

- **Intent:** Emit the `paths`, `operations`, `components`, and `webhooks` interfaces compatible with `openapi-fetch@^0.15`.
- **Acceptance Criteria:**
  - Generated interfaces honour shared + operation-specific parameters, decomposed per channel (`path`, `query`, `header`, `cookie`).
  - Numeric response status keys preserved as number literals; fallback methods resolve to `never`.
  - TSDoc derived from OpenAPI summaries/descriptions embedded.
- **Definition of Done:**
  - Type writer integrated and enabled when `writers` includes `types`.
  - Characterisation snapshots added for representative specs.
  - Sample TypeScript project compiles using emitted interfaces.
- **Validation Steps:**
  1. `pnpm test -- run src/writers/types/*.test.ts`
  2. `pnpm test --filter characterisation -- types`
  3. `pnpm --filter openapi-fetch-fixture type-check` (or equivalent sample project).

### Session 4.3 – Constants & Guards Expansion

- **Intent:** Generate path catalogues, enumerated constants/guards, operation metadata, and parameter schema maps.
- **Acceptance Criteria:**
  - `PATHS`, `ValidPath`, `allowedMethods`, `isAllowedMethod` emitted deterministically.
  - Enum detection surfaces component and inline enums with optional renaming hooks.
  - Operation metadata exposes operation ID lookups and request parameter schema maps per channel.
- **Definition of Done:**
  - Constants writer outputs packaged with manifest and documented usage.
  - Tests cover enum exports, method guards, and parameter schema maps.
  - README section drafted for constants/guards.
- **Validation Steps:**
  1. `pnpm test -- run src/writers/constants/*.test.ts`
  2. Snapshot review for enum exports on complex fixture.
  3. Manual validation of parameter schema map for edge-case spec.

### Session 4.4 – Runtime Schema & Zod Catalogue

- **Intent:** Produce decorated schema modules, Zod endpoints, helper maps, and JSON Schema validators from the shared IR.
- **Acceptance Criteria:**
  - Decorated schema emitted as JSON + TS with provenance header (title/version/digest).
  - Zod outputs cover success + error responses with helper maps (operation IDs, primary status codes).
  - JSON Schema counterparts generated for request/response validators to support MCP tooling.
- **Definition of Done:**
  - Zod writer integrated; JSON Schema writer optionally toggled via writers list.
  - Tests confirm parity with existing Zod outputs and JSON Schema validation via AJV.
  - Characterisation fixtures updated accordingly.
- **Validation Steps:**
  1. `pnpm test -- run src/writers/zod/*.test.ts`
  2. `pnpm test -- run src/writers/json-schema/*.test.ts`
  3. AJV validation of generated schemas against Draft 07 or chosen draft.

### Session 4.5 – Client Wrappers & MCP Tooling

- **Intent:** Generate OpenAPI Fetch client wrappers plus MCP summaries, sample payload utilities, and naming helpers.
- **Acceptance Criteria:**
  - `createApiClient` / `createPathClient` wrappers export typed helpers with middleware support.
  - MCP operation summaries expose parameters, responses, schema references, and deterministically named tools.
  - Sample payload utility handles cycles and failure modes gracefully.
- **Definition of Done:**
  - Client writer and MCP writer integrated with manifest/CLI.
  - Integration test recreates current MCP bundle using only generated artefacts.
  - Documentation outlines MCP helper usage and configuration hooks.
- **Validation Steps:**
  1. `pnpm test -- run src/writers/client/*.test.ts`
  2. MCP integration test pipeline (CLI script or vitest suite).
  3. Manual verification of generated tool names and samples.

### Session 4.6 – Validation, Documentation & Release Prep

- **Intent:** Consolidate validation strategy, update documentation, and prepare release once writers stabilise.
- **Acceptance Criteria:**
  - Comprehensive characterisation suite covering all writers passes.
  - README/CLI docs updated with new command examples and artefact descriptions.
  - Release notes capture Phase 4 deliverables and migration guidance.
- **Definition of Done:**
  - Full quality gate (format/build/type-check/test) passes from clean tree.
  - Documentation PR merged; release checklist ticked off.
  - Stakeholder sign-off recorded.
- **Validation Steps:**
  1. Run full quality gate (`pnpm format && pnpm build && pnpm type-check && pnpm test -- --run`)
  2. `pnpm test --filter characterisation`
  3. Documentation lint/check and release dry-run (if applicable).

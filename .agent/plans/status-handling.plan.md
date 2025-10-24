# Status Handling Strategy – Schema-First Response Branching

## Mission

- Remove the final hard-coded HTTP `200` assumptions from the MCP tool generation pipeline so every documented response status becomes first-class.
- Ensure the Open Curriculum SDK can react to upstream schema changes by re-running `pnpm type-gen`, keeping the Cardinal Rule unbroken (`.agent/directives-and-memory/rules.md:13`).
- Preserve the mandated flow: **original OpenAPI schema → schema decoration pipeline → generated handling code**, with authored runtime remaining a thin façade (`.agent/directives-and-memory/schema-first-execution.md:5`).

## Problem Statement

- Current generator artefacts assume `method + path + 200` uniquely identify responses; documented non-2xx statuses (Phase 7’s 404 example) still fail at runtime, as observed during the transcript investigation.
- `emit-index.ts` returns `response.data` without checking `response.response.status`, ignoring the error branch from `openapi-fetch` (`packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts` context).
- `response-map.ts` exposes helpers that only retrieve the `200` descriptor even though `RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS` already stores every status (`packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/response-map.ts`).
- Validation attempts only the success schema, causing documented error payloads to be rejected, breaking fail-fast guarantees.

## Directives and Constraints

- **Cardinal Rule**: All branching logic must be generated; runtime code cannot infer or widen unions (`.agent/directives-and-memory/rules.md:13`).
- **Schema-First Execution**: Runtime remains a façade; generator outputs must provide readonly literal descriptors for every status (`.agent/directives-and-memory/schema-first-execution.md:11`).
- **Decoration Pipeline Safeguard**: Decorations may add new status descriptors, but any attempt to mutate an existing status (identical method + path + status tuple) must throw immediately to protect fidelity (new requirement).
- **First Question**: Prefer the simplest compliant approach—extend existing method/path tables rather than introducing new registries (`.agent/directives-and-memory/AGENT.md:17`).
- **Strict typings**: No runtime narrowing or type assertions; unions produced at type-gen time must describe the full status space.

## Current Context Snapshot (24 October 2025)

- Phase 7 delivered schema decorations for transcript 404 responses and verified parity across stub/live/remote runs (`.agent/plans/semantic-search/context.md` prior state).
- Remote smoke harness remains green for the Vercel preview URL, providing end-to-end coverage once multi-status handling lands.
- Generator unit suites (`mcp-tool-generator`) already exist and will host the new TDD work.

## Implementation Plan

### Phase 1 – Response Map Status Projection

- **Goal**: Emit `getResponseDescriptorsByOperationId` returning a readonly map of every documented status for an operation.
- **Actions**:
  - Extend `build-response-map.ts` template to generate the helper using `RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS`.
  - Ensure emitted object preserves literal status codes (no `string` keys widened to `number` unions).
- **Acceptance**: Helper returns every documented status without duplicating schema data; attempting to mutate the map at runtime is impossible (frozen/readonly export).
- **Validation**: `pnpm --filter @oaknational/oak-curriculum-sdk test -- mcp-tool-generator`

### Phase 2 – Schema Decoration Guardrails

- **Goal**: Guarantee the decoration pipeline can append new statuses but never overwrite existing ones.
- **Actions**:
  - Update `schema-enhancement-404.ts` and shared decorators to assert that `(operationId, status)` pairs are new before insertion.
  - Surface a descriptive error if a decorator collides with an existing status, guiding engineers to adjust upstream schema instead.
- **Acceptance**: Running decorations against an unchanged schema succeeds; duplicating a status throws during type-gen with clear guidance.
- **Validation**: `pnpm --filter @oaknational/oak-curriculum-sdk type-gen` (expect pass) and targeted decorator unit tests.

### Phase 3 – Invoke and Validation Generation

- **Goal**: Rewrite generated executors so method + path + status drive payload selection and validation.
- **Actions**:
  - Update `emit-index.ts` to:
    - Read `response.response.status` and select payload from `.data` (2xx) or `.error` (non-2xx).
    - Throw a fail-fast `TypeError` when the status is undocumented, listing known statuses.
  - Generate `validateOutput` that iterates every documented schema, returning structured success `{ data, status }` or detailed failure diagnostics.
  - Emit discriminated union result types keyed by literal status or schema-specific discriminants.
- **Acceptance**: Generated code contains no runtime `if` branches keyed on inferred unions; all status checks resolve against generated literal tables.
- **Validation**: `pnpm --filter @oaknational/oak-curriculum-sdk test -- mcp-tool-generator`, followed by `pnpm --filter @oaknational/oak-curriculum-sdk type-check`

### Phase 4 – Runtime and Behavioural Proof

- **Goal**: Demonstrate multi-status support across SDK and MCP surfaces.
- **Actions**:
  - Regenerate artefacts with `pnpm --filter @oaknational/oak-curriculum-sdk type-gen`.
  - Run SDK integration tests ensuring `get-lessons-transcript` handles both 200 and 404.
  - Execute smoke suites (`smoke:dev:live`, `smoke:remote`) capturing payloads for both statuses.
  - Add a targeted integration test that simulates an undocumented status and asserts the fail-fast error message.
- **Acceptance**: Transcript tool succeeds for both documented statuses; undocumented status test fails fast with actionable messaging.
- **Validation**:
  - `pnpm --filter @oaknational/oak-curriculum-sdk test`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url <preview>`

### Phase 5 – Documentation and Quality Gates

- **Goal**: Capture architectural intent and confirm repository-wide health.
- **Actions**:
  - Update generator documentation, schema-first directive annotations, and MCP architecture notes with the method + path + status flow.
  - Refresh `.agent/plans/semantic-search/context.md` with outcomes and next steps.
  - Run full gates to guarantee compliance.
- **Acceptance**: Documentation explicitly diagrams original → decorated → generated flow, including the new collision guard; quality gates all green.
- **Validation**: `pnpm make`, `pnpm qg`

## Testing Matrix

| Feature                           | Test Type        | Proof                                                                  |
| --------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| Status descriptor helper          | Unit             | Generator spec under `mcp-tool-generator`                              |
| Decoration collision guard        | Unit             | Decorator spec asserting thrown error on duplicates                    |
| Invoke payload selection          | Integration      | Generated executor integration test validating 2xx vs non-2xx branches |
| Undocumented status fail-fast     | Unit/Integration | Spec injecting fake status, expecting `TypeError`                      |
| Transcript multi-status behaviour | System           | `smoke:dev:live` and `smoke:remote`                                    |

## Risks & Mitigations

- **Union Collapse**: Generated unions may widen if status keys are coerced to `number`; lock keys as literal numeric types during emission.
- **Performance**: Iterating all schemas adds runtime cost; use precomputed arrays during generation to avoid dynamic object traversal.
- **Decorator Drift**: New decorators might forget the collision guard; enforce via shared utility enforcing uniqueness and unit tests.
- **Remote Dependency**: Smoke runs rely on preview availability; schedule validation when preview is online, keep stub/live captures for comparison.

## Dependencies

- Phase 7 schema decorations remain in place and green.
- Remote smoke base URL reachable for final validation.
- Existing generator test harness (`mcp-tool-generator`) available for TDD.

## Completion Criteria

1. Type generation emits status-aware helpers, executors, and unions with no runtime widening.
2. Attempting to decorate an existing status fails during type-gen with clear guidance.
3. Transcript tool passes for both 200 and 404 locally and remotely.
4. Undocumented status paths fail fast with actionable errors.
5. Documentation and context updated; `pnpm make` / `pnpm qg` pass.

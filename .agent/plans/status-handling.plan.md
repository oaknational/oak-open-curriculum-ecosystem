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
- **Implementation Tasks**:
  1. Add failing generator unit tests in `mcp-tool-generator` that assert:
     - All documented statuses are returned as literal numeric keys.
     - Returned descriptors are referentially equal to the existing `RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS` entries.
  2. Extend `build-response-map.ts` to generate `getResponseDescriptorsByOperationId` by reusing the existing descriptor map and freezing the result (e.g. `Object.freeze`) to prevent mutation.
  3. Regenerate artefacts via `pnpm --filter @oaknational/oak-curriculum-sdk type-gen` and inspect the generated helper for literal status keys and readonly enforcement.
  4. Update or add exports in `response-map.ts` consumers so later phases can import the helper without circular dependencies.
- **Acceptance**:
  - Generated helper lists every documented status without widening to `number`.
  - Helper export is readonly both at type level (`Readonly<Record<...>>`) and runtime (`Object.freeze` or equivalent).
  - No duplication of schema data; helper returns references to the existing descriptor objects.
- **Validation Commands**:
  - `pnpm --filter @oaknational/oak-curriculum-sdk test -- mcp-tool-generator`
  - `pnpm --filter @oaknational/oak-curriculum-sdk type-gen`
  - `pnpm --filter @oaknational/oak-curriculum-sdk lint`
- **Status**: ✅ Completed 24 October 2025 21:55 BST — helper emitted with deterministic literals, new unit coverage added, regenerated artefacts include frozen descriptor map, and lint/test suite confirmed clean.

### Phase 2 – Schema Decoration Guardrails

- **Goal**: Guarantee the decoration pipeline can append new statuses but never overwrite existing ones.
- **Implementation Tasks**:
  1. Introduce a shared guard utility (e.g. `assertStatusCollisionFree`) that verifies `(operationId, status)` pairs are unique before decoration mutation.
  2. Add failing unit tests around the decorator pipeline to prove the guard throws with descriptive messaging when a collision occurs.
  3. Apply the guard to existing decorators, including `schema-enhancement-404.ts`, ensuring legitimate additions still succeed.
  4. Regenerate schemas to confirm the pipeline remains stable and to capture any necessary fixture updates.
- **Acceptance**:
  - Running decorations against the current schema passes without modification.
  - Unit tests confirm collisions raise actionable errors referencing method, path, and status, nudging engineers toward upstream schema fixes.
  - No new duplication appears in generated schema outputs.
- **Validation Commands**:
  - `pnpm --filter @oaknational/oak-curriculum-sdk test -- schema-separation`
  - `pnpm --filter @oaknational/oak-curriculum-sdk type-gen`
  - `pnpm --filter @oaknational/oak-curriculum-sdk lint`
- **Status**: ✅ Completed 24 October 2025 22:20 BST — shared status guard introduced, decorator updated to use it, duplicate-config tests added, and regeneration/lint suite confirmed green.

### Phase 3 – Invoke and Validation Generation

- **Goal**: Rewrite generated executors so method + path + status drive payload selection and validation.
- **Implementation Tasks**:
  1. Extend generator tests to cover:
     - Successful handling of multi-status operations (e.g. transcript 200/404).
     - Single-status operations remaining unchanged.
     - Undocumented status triggering the fail-fast TypeError with documented statuses listed.
  2. Update `emit-index.ts` (and any supporting templates) to:
     - Import the Phase 1 helper and derive a readonly array of documented statuses per tool.
     - Select payload from `.data` for 2xx responses and `.error` otherwise.
     - Throw a descriptive TypeError when actual status is absent from the documented set.
  3. Regenerate `validateOutput` logic to iterate documented schemas and return `{ ok: true, data, status }` on first match, otherwise accumulate structured issues for debugging.
  4. Emit discriminated union result types (status-tagged or schema-specific discriminant) with no runtime assertions; ensure type aliases for `ToolResultForName` reflect the union.
  5. Regenerate artefacts and review diffs, confirming no manual narrowing remains in authored runtime code.
- **Acceptance**:
  - Generator unit tests pass, covering success, failure, and regression scenarios.
  - Generated code references only literal status descriptors and contains no ad-hoc branching or assertions.
  - TypeScript compilation succeeds with new unions, and consumers require no manual casting.
- **Validation Commands**:
  - `pnpm --filter @oaknational/oak-curriculum-sdk test -- mcp-tool-generator`
  - `pnpm --filter @oaknational/oak-curriculum-sdk type-gen`
  - `pnpm --filter @oaknational/oak-curriculum-sdk type-check`
  - `pnpm --filter @oaknational/oak-curriculum-sdk lint`
  - Repository-wide gates: `pnpm make`, `pnpm qg`

### Phase 4 – Runtime and Behavioural Proof

- **Goal**: Demonstrate multi-status support across SDK and MCP surfaces.
- **Implementation Tasks**:
  1. Add integration tests verifying generated executors handle transcript 200/404 responses, plus a test simulating an undocumented status to assert fail-fast behaviour.
  2. Run full SDK test suite post-generation to cover broader regression surface.
  3. Execute smoke suites in stub, live, and remote modes capturing payload snapshots for both transcript outcomes.
  4. Spot-check other high-use tools (e.g. search/fetch) through smoke output to confirm no regressions introduced.
- **Acceptance**:
  - Transcript tool succeeds for documented statuses with recorded analysis artefacts.
  - Undocumented status test fails fast with the generated error message.
  - Smoke suites and SDK tests remain green, showing no regressions across the MCP surface.
- **Validation Commands**:
  - `pnpm --filter @oaknational/oak-curriculum-sdk test`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url <preview>`
  - Repository-wide gates: `pnpm make`, `pnpm qg`

### Phase 5 – Documentation and Quality Gates

- **Goal**: Capture architectural intent and confirm repository-wide health.
- **Implementation Tasks**:
  1. Update generator documentation, schema-first directive annotations, and MCP architecture notes to describe the method + path + status branching and collision guard.
  2. Refresh `.agent/plans/semantic-search/context.md` with completed outcomes, residual risks, and verification notes; mark phases complete in this plan.
  3. Run markdown lint across documentation updates.
  4. Execute final full quality gates to ensure every workspace remains compliant.
- **Acceptance**:
  - Documentation clearly states original → decorated → generated flow and the immutable status handling requirements.
  - Context log reflects latest state, and plan checkboxes or summaries indicate completion.
  - `pnpm make` and `pnpm qg` succeed without manual intervention.
- **Validation Commands**:
  - `pnpm markdownlint:root`
  - `pnpm make`
  - `pnpm qg`

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

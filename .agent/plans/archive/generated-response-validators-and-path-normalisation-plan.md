# Generated Response Validators and Path Normalisation — Implementation Plan

## Summary

Generate response validators and path-handling utilities at compile time as part of `pnpm type-gen`, eliminating manual mappings and ensuring consistent, data‑driven validation. Apply strict TDD with pure functions and unit tests, aligned with the repository’s rules and guidance.

## Goals

- Generate a response validator map from the OpenAPI schema (and Zod output) at type‑gen time.
- Normalise path formats consistently (curly and colon styles) and validate both.
- Cross‑validate schema‑derived operations with generated `endpoints` to detect drift early.
- Keep a single source of truth: OpenAPI → generated types/schemas/validators.

## Non‑Goals

- Adding non‑schema error responses (the current schema defines only 200s). When the API defines 4xx/5xx, extend generation accordingly.
- Refactoring unrelated validation or client logic beyond what’s necessary to consume the generated outputs.

## Deliverables

- New generated file: `packages/sdks/oak-curriculum-sdk/src/types/generated/zod/response-validators.ts`
  - Exports a compile‑time built map: `{ [operationId:string]: { [statusCode:number]: z.ZodSchema } }`.
  - Exports `validateResponse(operationIdOrPath: string, method: HttpMethod, statusCode: number, data: unknown)` – thin wrapper that resolves operationId and applies the map.
  - No type assertions; rely on Zod types and TypeScript predicates.
- New generated file: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-utils.ts`
  - Exports `toCurly(path: string): string`, `toColon(path: string): string`, `isCurly(path: string)`, `isColon(path: string)` – used by request and response validators.
- Type‑gen updates:
  - Extend `scripts/typegen-core.ts` to generate the above files via pure functions in `scripts/typegen/...`.
  - Add schema ↔ endpoints cross‑validation; fail fast with clear messages when mismatches occur.
- Documentation updates:
  - Update SDK README and relevant ADR references to note “response validators are generated at type‑gen time”.

## Alignment With Project Rules

- Development Practice: fail fast, single source of truth, pure functions, no duplication, strict quality gates.
- Testing Strategy: strict TDD, behaviour‑focused unit tests, no implementation tests, use Vitest.
- TypeScript Practice: no `any`, no type assertions/casts, validate at boundaries with Zod, use `as const` for constants.
- Agents Rules: keep the plan simple without compromising quality; include the British spelling reminder in TODOs.

## High‑Level Design

1. Response mapping generation
   - Input: OpenAPI `OpenAPI3` object and Zod `schemas.ts`/`endpoints.ts` (already generated in the same run).
   - For each path+method in the OpenAPI, read `responses["200"].content["application/json"].schema`.
     - If `$ref` to `#/components/schemas/<Name>`, bind to `schemas.<Name>`.
     - Else, fallback: match the path+method in generated `endpoints` and bind to its `response` schema.
   - Emit a static ES module that imports `PATH_OPERATIONS` and `schemas` and exports the map + `validateResponse`.

2. Path normalisation
   - Generate `toCurly`, `toColon`, and format detectors; use simple, explicit string transforms:
     - toColon: `/{([\w-]+)}/g -> ":$1"`
     - toCurly: `/:(\w+)/g -> "{$1}"` (only inside path segments)
   - Update (or later refactor) request/response validators to use these helpers.

3. Schema ↔ endpoints cross‑validation
   - Confirm that every OpenAPI path+method has a corresponding colon‑style entry in `endpoints.ts` and vice versa.
   - On mismatch, throw a clear error during type‑gen, explaining the missing/extra entry.

## TDD Plan (Strict Unit Tests)

REMINDER: UseBritish spelling

1. Unit tests for response map generator (pure function)
   - File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/response-map/response-map.unit.test.ts`
   - Given a minimal in‑memory OpenAPI doc with `$ref` 200 responses, expect the function to produce a structure mapping `operationId → {200: 'ComponentName'}`.
   - Given a non‑`$ref` 200 schema, and a mock of `endpoints` metadata, expect fallback to endpoint `response` to be selected.
   - Invalid/missing 200s yield an explicit error.

2. Unit tests for path utils generator (pure function)
   - File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/paths/path-utils.unit.test.ts`
   - `toColon("/a/{id}/b/{type}") === "/a/:id/b/:type"` and reverse with `toCurly`.
   - Idempotency checks and detection functions `isCurly`/`isColon` behaviours.

3. Unit tests for schema ↔ endpoints cross‑validation
   - File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/validation/cross-validate.unit.test.ts`
   - Matching sets pass; extra/missing entries produce descriptive errors that list diffs.

4. Unit tests for generated validator wrapper behaviour (pure logic contract)
   - File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/response-map/wrapper-behaviour.unit.test.ts`
   - Given an operationId and a mock Zod schema, verify successful parse returns `{ ok: true }` and invalid data returns `{ ok: false }` with issues.
   - Both curly and colon style inputs resolve the same operation via normalisation.

5. Integration‑style unit test for emitter output shape
   - File: `packages/sdks/oak-curriculum-sdk/scripts/typegen/response-map/emitter.unit.test.ts`
   - Assert the emitted TypeScript string contains the expected imports, exported constants, and no assertions.

All tests MUST be written first, then implemented incrementally until green.

## Implementation Steps

1. Scaffolding (tests only)
   - Add the 5 unit test files above with fixtures and explicit behaviours.

2. Implement pure generators
   - `scripts/typegen/response-map/build-response-map.ts` — pure builder from `OpenAPI3` + minimal endpoint metadata to `{ [operationId]: { [status]: componentName | 'endpointResponse' } }`.
   - `scripts/typegen/response-map/emit-response-validators.ts` — converts the built map into a TypeScript module string that imports `schemas`, `PATH_OPERATIONS`, and emits the final map + `validateResponse` wrapper.
   - `scripts/typegen/paths/generate-path-utils.ts` — emits `path-utils.ts` with `toCurly`, `toColon`, detectors.
   - `scripts/typegen/validation/cross-validate.ts` — compares schema paths vs generated endpoints metadata.

3. Wire into type‑gen pipeline
   - In `scripts/typegen-core.ts`:
     - After Zod generation, read the schema and generate `response-validators.ts` and `path-utils.ts` to `src/types/generated/...`.
     - Run cross‑validation and fail fast on mismatch.

4. Consume generated outputs (minimal changes)
   - Update `src/validation/response-validators.ts` to re‑export from generated module (or remove and replace with generated file path in build entry where appropriate) without altering runtime behaviour.
   - Ensure both request/response validators use `path-utils.ts` for normalisation.

5. Documentation
   - Update SDK README and ADR references to state response validators and path utils are generated at type‑gen time.

## Testing & Quality Gates

- Run `pnpm test` iteratively (unit tests). No integration/E2E changes required for this feature.
- Ensure `pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test` all pass before merging.

## Risks & Mitigations

- OZC template drift: our logic does not depend on OZC internal paths for response mapping (uses OpenAPI first; endpoints fallback only as needed).
- Missing non‑200 schemas: current API defines only 200 responses; generator is designed to extend easily when 4xx/5xx appear.
- Path format inconsistencies: centralised normalisation + cross‑validation detect and prevent drift.

## Rollout

- Feature branch, PR with green quality gates.
- Merge once type‑gen outputs are committed and CI passes in offline mode (using cached schema).

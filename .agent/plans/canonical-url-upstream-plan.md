# Canonical URL Upstream Migration Plan

## Intent

Move canonical URL generation from consuming applications into the SDK core, ensuring all API responses automatically include canonical URLs. This eliminates manual URL generation in applications and provides consistent, context-aware URL generation across all SDK usage.

**Impact**: Any application using the Oak Curriculum SDK will automatically receive canonical URLs for curriculum resources without additional code, improving developer experience and ensuring consistency.

## Current Status

**COMPLETED PHASES:**

- ✅ Phase 1: TDD Foundation - All tests written and passing
- ✅ Phase 2: URL Generation - Fallback patterns removed, warning logging added
- ✅ Phase 3: Response Augmentation - Pure function implemented and tested
- ✅ Phase 4: SDK Core Integration - Response pipeline updated, schema decoration implemented
- ✅ Phase 5: Manual URL Generation Removal - All manual code removed from applications
- ✅ Phase 6: Quality Gates - All tests pass, linting clean, docs generated

**What’s done:**

- Logger integration in augmentation and generated URL helpers
- Response augmentation wired into `validateResponse`
- Generated helpers in `path-parameters.ts` provide precise typing (e.g., `AllowedMethodsForPath`, normalized `JsonBody200`)
- Schema pipeline emits only `api-schema-original.json` and `api-schema-sdk.json`; generators read the SDK schema
- Added schema-backed guard `isResponseJsonBody200` for exact 200 JSON bodies

**What’s left:**

- Fix remaining type errors in tests (uppercase HTTP methods)
- Remove casts from `validateResponse` return paths; rely on guard narrowing
- Re-run and pass all quality gates (build, type-check, lint, tests, e2e)

## Notes

- This plan follows TDD principles: tests first, then implementation
- All tests must focus on behaviour, not implementation details
- No compatibility layers: old approaches are replaced directly
- Pure functions: all URL generation logic is pure
- Fail fast: broken fallbacks removed immediately
- Self-reviews replace sub-agent reviews as per GO.md

## Completed Work Summary

### ✅ Phase 1: TDD Foundation - COMPLETED

- Unit tests for URL generation behaviour (lessons, sequences, units, subjects)
- Unit tests for response augmentation behaviour (all content types)
- Integration tests for SDK response pipeline behaviour
- All tests written and passing

### ✅ Phase 2: URL Generation - COMPLETED

- Updated URL helpers generator to remove fallback patterns
- Added warning logging for missing context instead of invalid URLs
- Regenerated URL helpers with updated logic
- All quality gates pass

### ✅ Phase 3: Response Augmentation - COMPLETED

- Created pure function `augmentResponseWithCanonicalUrl()`
- Implemented context extraction for units and subjects
- Created response augmentation types
- All code compiles and type-checks

### ✅ Phase 4: SDK Core Integration - COMPLETED

- Updated `validateResponse()` to automatically augment responses
- Created schema decoration system with two-step process:
  - `api-schema-original.json` (canonical source of truth)
  - `api-schema-sdk.json` (decorated with canonicalUrl fields)
- Updated type generation to use decorated schema
- All API responses now automatically include canonical URLs

### ✅ Phase 5: Manual URL Generation Removal - COMPLETED

- Removed manual URL generation from HTTP MCP server
- Removed manual URL generation from OpenAI connector
- Updated E2E tests to expect canonical URLs automatically
- All applications now rely on SDK's automatic URL generation

### ✅ Phase 6: Quality Gates - COMPLETED

- All quality gates pass: `pnpm i`, `pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint -- --fix`, `pnpm test`, `pnpm test:e2e`
- Documentation generated successfully
- All tests pass (24/24 e2e tests, all unit tests)

## Next Steps (Atomic)

1. Emit generic error schemas and wildcard entries in `response-map.ts`:
   - Generate Zod schemas for common error statuses (401, 403, 500, 503).
   - Add `*:<status>` keys in `responseSchemaMap` so non-operation-specific errors validate (e.g., `*:401`).

2. Support empty-body responses (204/304):
   - Generate per-operation `:204` and `:304` entries using Zod `void`/`undefined` schemas.
   - Add tests proving correct validation of no-content responses.

3. Use canonical `RESPONSE_CODES` with descriptions:
   - Update `scripts/typegen/operations/operation-generators.ts` to emit the official HTTP status list (RFC 9110) including `description` labels.

4. Relocate/extend generated guards and typed accessors (fewer-files approach):
   - In `path-parameters.ts`, continue to expose `getOperationIdByPathAndMethod` (single source of truth).
   - In `response-map.ts`, add a typed accessor `getResponseSchema(operationId, statusCode)` and keep `isResponseJsonBody200<P,M>(path, method, value)` using the generated map.

5. Tighten `validateResponse` using generated types only (no casts):
   - Import and use `getOperationIdByPathAndMethod`, `getResponseSchema`, and `isResponseJsonBody200`.
   - Keep overloads: `200` → `ValidationResult<JsonBody200<P, M>>`, non-`200` → `ValidationResult<unknown>`.
   - Remove any `String()` conversions; use literal status/methods and a small formatter when needed.
   - Fail fast: throw `TypeError` for invalid `path` (use `isValidPath`).

6. Ensure all generators consume `api-schema-sdk.json` only:
   - Remove all legacy references/tests for `api-schema.json`.

7. Tests (behaviour-first):
   - Lower-case `HttpMethod` everywhere; use literal `200` to select the 200-overload.
   - Assert fail-fast on invalid `path` (expect throw), and validate unsupported status via error branches.
   - Add tests for 204 no-content and generic errors (401/403/500/503).
   - Prove canonical URL augmentation occurs only for GET 200 JSON bodies.

8. Schema separation and `$ref` handling (already implemented, re-verify):
   - Keep union-safe `$ref` handling via specific type guards and helper functions; no `as`.

9. Quality gates (repeat until green):
   - `pnpm type-gen && pnpm build && pnpm type-check`.
   - `pnpm lint -- --fix && pnpm format && pnpm markdownlint`.
   - `pnpm test && pnpm test:e2e`.
   - `pnpm make && pnpm qg`.

10. Self-review and finalize:

- Verify adherence to `.agent/directives-and-memory/rules.md` (no assertions, schema-driven types).
- Commit and push without bypassing checks.

## Success Criteria

- All API responses automatically include canonical URLs in the correct format
- Applications receive canonical URLs without any additional code changes
- Missing context results in warnings being logged via adaptive logger, not invalid URLs being generated
- All tests prove the correct behaviour of canonical URL generation
- All tests pass and follow TDD principles
- Code follows pure function principles
- Type safety is maintained throughout
- Quality gates pass completely

## Key Files Created/Modified

**Core Implementation:**

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` - Pure function for response augmentation
- `packages/sdks/oak-curriculum-sdk/src/types/response-augmentation.ts` - Type definitions
- `packages/sdks/oak-curriculum-sdk/src/validation/response-validators.ts` - Updated to include augmentation

**Schema Management:**

- `packages/sdks/oak-curriculum-sdk/scripts/schema-separation-core.ts` - Two-step schema process
- `packages/sdks/oak-curriculum-sdk/scripts/schema-decoration-core.ts` - Schema decoration logic
- `packages/sdks/oak-curriculum-sdk/scripts/typegen.ts` - Updated to use decorated schema
- `packages/sdks/oak-curriculum-sdk/scripts/zodgen.ts` - Updated to use decorated schema

**Generated Files:**

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-original.json` - Upstream schema (pure)
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - Decorated schema (includes canonicalUrl)
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts` - Updated URL helpers
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts` - Now also exports generated `findOperationId`
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/response-map.ts` - Now also exports generated `findResponseSchema` and `isResponseJsonBody200`
- Generator scripts updated to never emit empty enums and to handle `$ref` properly without type assertions.

**Tests:**

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts` - Unit tests
- `packages/sdks/oak-curriculum-sdk/src/response-validation.integration.test.ts` - Integration tests
- `packages/sdks/oak-curriculum-sdk/scripts/schema-separation.unit.test.ts` - Schema tests

**Application Updates:**

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` - Removed manual URL generation
- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/openai-connector/index.ts` - Updated to use automatic URLs

**Generator Updates:**

- `packages/sdks/oak-curriculum-sdk/scripts/typegen/parameters/parameter-generators.ts` - Stop emitting empty enumerations and their guards; adjust `PATH_PARAMETERS` and `isValidPathParameter` generation for open-ended domains.
- `packages/sdks/oak-curriculum-sdk/scripts/typegen-core.ts` and writers - Emit the new guards in `path-parameters.ts` and `response-map.ts`; ensure generators consume `api-schema-sdk.json` only.
- `packages/sdks/oak-curriculum-sdk/scripts/schema-separation-core.ts` - Add type guards for `ReferenceObject` vs `SchemaObject`; process arrays of union types safely; no `as` assertions.
- `packages/sdks/oak-curriculum-sdk/scripts/typegen-core.test.ts` - Use minimal valid `OpenAPI3` objects in tests instead of strings; keep tests behaviour-first.

## Handoff Prompt (paste this into a new chat)

Goal: Finish canonical URL upstream migration in the SDK, with all types/guards generated at compile time.

Context:

- `validateResponse` augments GET 200 responses; `isResponseJsonBody200` narrows runtime values using generated schemas.
- Generators emit helper types in `path-parameters.ts` (`AllowedMethodsForPath`, `JsonBody200`) and generated guards (`findOperationId`).
- Generators emit response schema map and guards in `response-map.ts` (`responseSchemaMap`, `findResponseSchema`, `isResponseJsonBody200`).
- Schema pipeline writes only `api-schema-original.json` and `api-schema-sdk.json` and all generators consume the SDK schema.
- Logger integration is complete.
- Tests must be updated to use lower-case `HttpMethod` values and literal `200` where 200-specific types are expected, and to reflect fail-fast behaviour for invalid `path`.

Tasks:

1. Remove empty enumerations and related guards from generator outputs; adjust `PATH_PARAMETERS`/`isValidPathParameter` for open-ended domains.
2. Relocate runtime guards into generated files: add `findOperationId` (path-parameters.ts) and `findResponseSchema` + `isResponseJsonBody200` (response-map.ts).
3. Update `validateResponse` to import the generated guards; remove local duplicates and casts; use overloads for 200 vs non-200 return types.
4. Confirm all generators read `api-schema-sdk.json`; remove legacy `api-schema.json` references.
5. Update tests to use lower-case `HttpMethod`, literal `200`, and to reflect fail-fast invalid path.
6. Update generator scripts for `$ref`-aware handling (no `as`), and export any functions required by tests (or update the tests accordingly).
7. Run `pnpm type-gen && pnpm build && pnpm type-check` and fix types without assertions.
8. Run `pnpm lint -- --fix && pnpm format && pnpm markdownlint`.
9. Run `pnpm test && pnpm test:e2e`.
10. Run `pnpm make && pnpm qg` until green, then commit and push.

Rules:

- Follow `.agent/directives-and-memory/rules.md` and `GO.md` (self-reviews, no runtime-defined types, no assertions).
- Tests must prove behaviour, not implementation.
- Absolutely do not use `as`, non-null assertions, or type-widening shortcuts. Prefer generated type guards and overloads to obtain narrowing. Handle OpenAPI `$ref` via proper type guards and union-safe processing.

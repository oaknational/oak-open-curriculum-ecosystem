# Plan: Oak Curriculum SDK — Add Zod Validation for Requests and Responses

## Core References

### Planning & Guidance

- GO.md (workspace root): `GO.md`
- Testing Strategy: `docs/agent-guidance/testing-strategy.md`
- Rules & Best Practices: `docs/README.md#rules-and-best-practices`
- Current SDK Reference: `packages/oak-curriculum-sdk/docs/oak-open-curriculum-api-sdk-reference.md`

### Architecture Decision Records (ADRs)

- [ADR-029: No Manual API Data Structures](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) - Prohibits hardcoded API data
- [ADR-030: SDK as Single Source of Truth](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK provides all API knowledge
- [ADR-031: Generation-Time Extraction Pattern](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) - Extract metadata at build time, not runtime
- [ADR-026: OpenAPI Type Generation Strategy](../../docs/architecture/architectural-decisions/026-openapi-type-generation-strategy.md) - Type generation approach
- [ADR-003: Zod for Validation](../../docs/architecture/architectural-decisions/003-zod-for-validation.md) - Runtime validation strategy

## Intent & Impact

- Add runtime validation to the SDK for both:
  - Request arguments (path params, query params, and request bodies)
  - Response payloads (data returned by the API)
- Maintain developer ergonomics and performance while improving reliability and safety in user code.
- Changes MUST be additive-only to the public API; no breaking changes.

## Current State (Summary)

- Compile-time types are generated (`openapi-typescript`).
- Request-side type guards for path params exist (generated) and are exported from the SDK root.
- No runtime validation of request bodies, query params, or response payloads.
- ESM, Node >= 22, tsup build with externalized deps, root-only exports.

## Progress Update (2025-08-13 Afternoon Session)

- __ACTION__: Request validation module refactored to remove type assertions and use runtime type guards; helper extraction reduced complexity; all changes remain additive and ADR-030/031 compliant.
- __ACTION__: Docs generator improved for Type aliases:
  - `scripts/lib/ai-doc-types.ts`: added `TDReflection.type` and `sources[]` support (with Zod schemas) to parse alias underlying types and source locations from TypeDoc JSON.
  - `scripts/lib/ai-doc-render.ts`: special-case “Type alias” to render `type Name = ...` and a “Source:” line (with link when available).
- __QUALITY-GATE__: SDK lint, type-check, and tests pass locally. Docs pipeline re-run scheduled next step to verify alias rendering in markdown.
- __GROUNDING__: Changes align with GO.md principles (no any, prefer type guards, small pure functions) and keep docs pipeline plugin-free.

### Remaining Work (Brief)

- Re-run docs pipeline and verify alias rendering:
  - Command: `pnpm -F @oaknational/oak-curriculum-sdk docs:all`
  - Confirm `packages/oak-curriculum-sdk/docs/api-md/types.md` shows: `type Alias = <underlying>` and a “Source:” line.
- If sources are missing in TypeDoc JSON for some symbols, adjust TypeDoc config only if necessary; otherwise keep current plugin-free setup.

## Progress Update (2025-08-12 Initial Session)

- __Generator implemented__: Added `scripts/zodgen-core.ts` and CLI `scripts/zodgen.ts` using `openapi-zod-client` with the `schemas-only` template to produce Zod schemas deterministically.
- __Single-command regeneration__: In `packages/oak-curriculum-sdk/package.json`, `generate:types` now runs both OpenAPI typegen and Zod schema generation. `prebuild` calls `generate:types`, so `pnpm build` auto-regenerates.
- __Programmatic exports__: Implemented and tested `schema` re-export and `toolGeneration` namespace utilities (`PATH_OPERATIONS`, `PARAM_TYPE_MAP`, `parsePathTemplate`). See `src/tool-generation.unit.test.ts`.
- __E2E tests__: Added resilient e2e test for Zod generation output formatting; passes locally.
- __Type-safety__: Strict guards in `zodgen-core.ts` (no unsafe assertions). Reduced complexity with small helper guards.
- __Outstanding__: ESLint error triggered by generated test artifact path: `packages/oak-curriculum-sdk/test-cache/zod-out/schemas.ts` not included in TS project for lint parsing. Plan to exclude `test-cache/**` from lint/ts parsing or adjust eslint TS config `allowDefaultProject`.

## Progress Update (2025-08-12 Evening Session)

### Phase 2 Completed: Generation-Time Extraction

- __Generation-time extraction implemented__: Created modular extraction system in `scripts/typegen/operations/` that extracts ALL operation metadata at build time
- __Operations extraction__: Added `extractPathOperations()` function that generates `PATH_OPERATIONS` constant with full operation details
- __Runtime refactoring__: Completely eliminated runtime processing from `src/tool-generation/index.ts` - now just imports and re-exports pre-generated constants
- __Type safety achieved__: Zero type assertions in runtime code - all metadata is pre-extracted at generation time
- __TDD approach__: Used test-driven development throughout, writing failing tests first before implementation
- __E2E tests fixed__: Updated e2e tests to focus on behaviour (values present) rather than implementation details (quote style)

### Key Architecture Improvements

1. __Extraction at generation time__ (typegen-core.ts):
   - Extract operations from OpenAPI3 schema (loose type)
   - Generate TypeScript code as strings
   - Write constants to path-parameters.ts

2. __Runtime simplicity__ (tool-generation/index.ts):
   - Import pre-generated constants
   - Re-export for public API
   - No schema iteration, no type assertions

3. __Modular organization with pure functions__:
   - `/scripts/typegen/operations/` - Operation extraction logic
   - `/scripts/typegen/parameters/` - Parameter generation
   - `/scripts/typegen/paths/` - Path generation
   - Pure functions for testability and reusability
   - Each module has unit tests following TDD

### Phase 3: ESLint Compliance - COMPLETED (Major refactoring by user)

**Final State (2025-08-13 03:00):**

The user performed a major architectural refactoring to eliminate all runtime type assertions by fully implementing the generation-time extraction pattern. This resolved the fundamental issue where runtime code was attempting to iterate over `as const` schemas.

**Key Pattern Established:**
- ✅ __ONE type assertion allowed__: Only at generation time when asserting API response is OpenAPI3
- ✅ __No runtime type assertions__: All runtime code uses proper type narrowing
- ✅ __Object.getOwnPropertyDescriptor pattern__: Safe property access without assertions
- ✅ __Generation vs runtime boundary__: Clear separation between build-time and runtime code

**Files Refactored (by user intervention):**
- `scripts/typegen-extraction.ts` - Uses Object.getOwnPropertyDescriptor for safe access
- `scripts/typegen-extraction-helpers.ts` - Proper type narrowing without assertions
- `scripts/test-fixtures.ts` - Type guard implementation without type assertions
- `scripts/typegen/operations/operation-validators.ts` - Safe property access patterns

**Remaining Issues (2 violations only):**
- `src/config/index.ts`: Line 22 - unnecessary conditional
- `src/config/index.ts`: Line 34 - unsafe assignment

### Testing Philosophy Applied

- __Test behaviour, not implementation__: E2E tests now check for presence of values, not specific quote styles
- __TDD for pure functions__: Created failing tests first, then implementation for all extraction functions
- __Immediate use of refactored code__: New functions immediately replace old code (no backwards compatibility layers)

### Deep Review Findings (sweep 1)

- __ESLint flat-config present__: `packages/oak-curriculum-sdk/eslint.config.ts` now exists and sets:
  - `ignores`: `dist/**`, `coverage/**`, `.turbo/**`, `examples/**`, `src/types/generated/**`, `test-cache/**`
  - Type-aware linting via `parserOptions.project: './tsconfig.lint.json'`
  - Resolver settings synced to the lint tsconfig
  This should address the earlier parsing error on `test-cache/zod-out/schemas.ts`.
- __Generation wiring__: `scripts/zodgen-core.ts` + `scripts/zodgen.ts` use `openapi-zod-client` `schemas-only` correctly. Output path in CLI is `src/types/generated/zod/`.
- __Build integration__: `package.json` uses `generate:types` -> runs both OpenAPI typegen and Zod generation. `prebuild` delegates to `generate:types`. Verified in logs during `pnpm lint` (build step runs and succeeds).
- __Programmatic exports__: Tests at `packages/oak-curriculum-sdk/src/tool-generation.unit.test.ts` validate `schema` presence, `PATH_OPERATIONS` coverage for `/lessons/{lesson}/transcript`, curated enums alignment (`KEY_STAGES`, `SUBJECTS`), and `parsePathTemplate()` behaviour.
- __Type guard quality__: `isOpenAPIObject()` refactored to smaller helpers to satisfy complexity rule; adheres to “no unsafe assertions”.
- __Next lint pass__: After the ESLint config update, re-run `pnpm -w -F @oaknational/oak-curriculum-sdk lint` to confirm clean status.

### Alignment and Clarifications

- __Output paths__:
  - OpenAPI types: `src/types/generated/api-schema/`
  - Zod schemas (ozc): `src/types/generated/zod/`
- __Public API stance__: Keep ozc inferred types internal; expose curated validators and `toolGeneration` utilities additively.
- __Docs plan__: Continue with TypeDoc for public exports only; exclude generated folders.

## Non-Goals

- Do not change the existing request API surface (no breaking changes to `createOakClient` / `createOakPathBasedClient`).
- Do not introduce global runtime validation by default for all requests (avoid perf regressions). Validation is opt-in or applied via explicit helpers/wrappers.

## Principles

- TDD-first (unit for pure logic, integration for assembly). All IO mocked.
- Pure functions and small modules with no side effects.
- Root-only exports; no internal path leakage.
- Prefer type guards and Zod schemas over custom runtime logic.
- Keep bundle size reasonable; tree-shake where possible.

## Approach Selection

Considered options:

- Option A: `openapi-zod-client` to generate operation-aware Zod schemas and inferred types.
  - Pros: Best DX and type safety; generates per-operation validators for both requests and responses; easier wiring to paths/methods; strong ergonomics for curated helpers.
  - Cons: Some duplication with existing `openapi-typescript` types; must ensure tree-shaking and avoid redundant public types.
- Option B: `openapi-zod-schema` to generate only component-level schemas.
  - Pros: Minimal duplication; lightweight.
  - Cons: We must hand-map operations, which reduces ergonomics.

Decision: Prioritize DX and type safety — adopt Option A (`openapi-zod-client`).

- Use ozc to generate per-operation Zod schemas for request/response.
- Keep existing `openapi-typescript` types for continuity, but do not re-export duplicate inferred types from ozc. Public API remains additive and focused on validators and helpers.
- Ensure codegen output is tree-shakeable and kept internal except curated exports.

## Public API (Additive)

Exports from package root:

- `validation` namespace (or named exports) providing:
  - Per-operation validators (curated): e.g., `validateLessonsSummaryResponse(data)`, `validateLessonTranscriptResponse(data)`, etc. Backed by ozc-generated schemas.
  - Generic operation helpers:
    - `validateRequest(path, method, args)` -> `{ ok: true, value } | { ok: false, issues }`
    - `validateResponse(path, method, status, data)` -> same discriminated result
  - Wrapper client for top DX:
    - `makeValidatedClient(baseClient, { validateRequest?: boolean, validateResponse?: boolean, strict?: boolean })`
      - `strict` throws on validation failure; otherwise returns discriminated results.
- Note: All exports are additive and optional.

- Additional programmatic generation support (additive):
  - Raw OpenAPI schema export:
    - `export { schema } from './types/generated/api-schema/api-schema'`
  - `toolGeneration` namespace:
    - `PathOperationMetadata`, `ParameterMetadata` interfaces
    - `PATH_OPERATIONS: PathOperationMetadata[]` — derived from `schema.paths` (path, method, operationId, summary, description, parameters)
    - `PARAM_TYPE_MAP: Record<string, JsonSchemaLike>` — JSON Schema-like mappings for known params; overlays reference `KEY_STAGES`, `SUBJECTS`, etc.
    - `parsePathTemplate(template, method?)` -> `{ pathParams: string[]; toMcpToolName(): string }`
    - Optional: `OPERATIONS_BY_ID: Record<string, PathOperationMetadata>` if needed later (kept internal initially or added additively).

## Code Organization & Generation

### CRITICAL ARCHITECTURAL PRINCIPLES

Per [ADR-031: Generation-Time Extraction Pattern](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md):

- __ALL metadata extraction and constant generation MUST happen at build/generation time__, not runtime
- The generated schema with `as const` is for type definitions only
- ALL runtime constants (paths, operations, parameters, etc.) are pre-computed during generation
- Runtime code becomes a simple, performant mapping between pre-generated constants
- This enables total type safety without type assertions and creates very performant code

Per [ADR-030: SDK as Single Source of Truth](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md):

- The SDK is the ONLY source for API-related information
- All consumers (MCP, other clients) must derive API knowledge from SDK exports
- No duplicate definitions or manual validation logic outside the SDK

Per [ADR-029: No Manual API Data Structures](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md):

- ZERO hardcoded API paths, parameters, or validation rules in consumer code
- Only decorative metadata (descriptions, examples, categories) allowed in consumers
- Everything structural must come from SDK imports

### Generation Scripts (Build Time)

- Existing generator scripts:
  - `packages/oak-curriculum-sdk/scripts/typegen-core.ts` — MUST be updated to extract ALL operation metadata
  - `packages/oak-curriculum-sdk/scripts/typegen.ts` — CLI runner
- Operation extraction additions to `typegen-core.ts`:
  - Extract all path/method combinations with their operations
  - Generate `PATH_OPERATIONS` constant with full metadata
  - Generate `OPERATIONS_BY_ID` map for quick lookup
  - Generate method constants and type guards
  - Write these to `path-parameters.ts` as generated code strings (like reference implementation)
- Zod generator scripts:
  - `packages/oak-curriculum-sdk/scripts/zodgen-core.ts` — pure generator using `openapi-zod-client` with `schemas-only` template, deterministic output.
  - `packages/oak-curriculum-sdk/scripts/zodgen.ts` — CLI runner that imports the runtime `schema` and writes to `src/types/generated/zod/` (internal modules; tree-shakeable).

### Runtime Modules (Use Pre-Generated Constants)

- New index module: `src/validation/index.ts`
  - Import ozc-generated schemas.
  - Implement per-operation curated validators and generic helpers `validateRequest`/`validateResponse`.
  - Implement `makeValidatedClient` wrapper that consults ozc maps to pick the correct validators for a given path/method.
- Updated module: `src/tool-generation/index.ts`
  - NO DYNAMIC PROCESSING of schema at runtime
  - Simply re-export the pre-generated constants from `path-parameters.ts`
  - Add utility functions like `parsePathTemplate` that work with the constants
  - Everything is already extracted and typed at build time
- Update `src/index.ts`
  - Add additive re-exports: `export * as validation from './validation/index'` (or named explicit exports for clarity).
  - Export `schema` and `export * as toolGeneration from './tool-generation'`
- Build integration
  - Add `generate:ozc` script and call it from `prebuild` after `generate:types`.

## API Docs Generation (TypeDoc)

- Tooling
  - Dev deps: `typedoc`, `typedoc-plugin-markdown`
  - Entry point: `packages/oak-curriculum-sdk/src/index.ts` (root-only public API)
  - Output: `packages/oak-curriculum-sdk/docs/api/`
  - Exclude internals: `src/types/generated/**`, `src/**/__tests__/**`

- Config: `packages/oak-curriculum-sdk/typedoc.json`

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["src/index.ts"],
  "plugin": ["typedoc-plugin-markdown"],
  "out": "docs/api",
  "readme": "none",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "hideGenerator": true,
  "exclude": [
    "src/types/generated/**",
    "src/**/__tests__/**"
  ]
}
```

- Package scripts (SDK `package.json`)
  - `"docs:api": "typedoc --options typedoc.json"`
  - Optionally add to CI or prepublish checks.

- Authoring guidance
  - Add concise TSDoc to all public exports in `src/index.ts` and re-exported namespaces (`validation`, `toolGeneration`).
  - Keep narrative/recipes in `docs/oak-open-curriculum-api-sdk-reference.md`; link to `docs/api/` for exhaustive API.

## TDD Plan

- Unit tests (pure):
  - `src/validation/validate.unit.test.ts` covering `validateRequest` & `validateResponse` using ozc-generated schemas (data-only, no IO).
  - Per-operation validator tests for curated operations (e.g., lessons summary, transcript, search): valid passes, invalid fails.
- Integration tests (no IO):
  - `src/client/validated-client.integration.test.ts` for `makeValidatedClient` with a fake fetch; assert request and response validation paths and strict vs non-strict behaviours.
  - Tests import from the SDK root to enforce public API discipline.
- Docs tests (lint/examples): ensure examples compile where feasible (type-only).

- Programmatic tool generation tests (pure):
  - Root export `schema` exists and includes `openapi: '3.0.3'`.
  - `toolGeneration.PATH_OPERATIONS` contains `GET /lessons/{lesson}/transcript` with correct `operationId` and path param `lesson`.
  - `toolGeneration.PARAM_TYPE_MAP.keyStage.enum` equals `KEY_STAGES`; `subject.enum` equals `SUBJECTS`.
  - `toolGeneration.parsePathTemplate('/lessons/{lesson}/transcript', 'get')` returns `{ pathParams: ['lesson'], toMcpToolName(): 'oak-get-lessons-transcript' }`.
  - Minimal integration: generate one MCP tool definition from these exports without IO.

## Todo List (GO.md-aligned)

### Phase 1: Completed Foundation Work

- [x] ACTION: Evaluate and add dev dependency `openapi-zod-client` (and minimal helpers) to SDK package
- [x] REVIEW: Architecture review — generator placement, dependency impact, and tree-shaking
- [x] ACTION: Create `scripts/zodgen-core.ts` and `scripts/zodgen.ts` with generation to `src/types/generated/zod/`
- [x] REVIEW: Code-reviewer — confirm script purity, deterministic output, and error handling
- [x] ACTION: Add ESLint flat-config for SDK with ignores for generated/test-cache
- [x] ACTION: Wire generator into build — `generate:types` runs both OpenAPI and Zod generation; `prebuild` calls `generate:types`
- [x] ACTION: Add programmatic generation exports (partial - runtime processing, needs refactor to generation-time)

### Phase 2: Critical Generation-Time Extraction Implementation (COMPLETED)

__Based on reviewer feedback, these are the CRITICAL actions required:__

- [x] ACTION: Implement generation-time extraction in `scripts/typegen-core.ts`
  - Add `extractPathOperations(schema: OpenAPI3)` function to extract ALL operations at build time
  - Generate TypeScript code strings (not runtime objects) for:

    ```typescript
    export const PATH_OPERATIONS = [...] as const;
    export const OPERATIONS_BY_ID = {...} as const;
    export const ALLOWED_METHODS = [...] as const;
    ```

  - Update `generatePathParametersContent()` to include operations code
  - Ensure extraction handles all OpenAPI operation fields (operationId, summary, description, parameters, requestBody, responses)
  - TESTS: Add unit tests for extraction functions using TDD approach

- [x] ACTION: Refactor `src/tool-generation/index.ts` to eliminate runtime processing
  - DELETE all runtime schema iteration code (lines 74-109)
  - DELETE type assertions and complex type guards
  - REPLACE with simple imports and re-exports:

    ```typescript
    import { PATH_OPERATIONS, OPERATIONS_BY_ID, PARAM_TYPE_MAP } from '../types/generated/api-schema/path-parameters';
    export { PATH_OPERATIONS, OPERATIONS_BY_ID, PARAM_TYPE_MAP };
    export function parsePathTemplate(template: string, method?: string) { /* utility only */ }
    ```

  - TESTS: Update tests to verify pre-generated constants are used

- [ ] ACTION: Fix all type assertion violations
  - Remove `as Record<string, unknown>` from tool-generation/index.ts
  - Keep ONLY the necessary assertion at system boundary in typegen-core.ts (line 112) with proper validation
  - Ensure no other type assertions exist in runtime code

### Phase 3: Fix Quality Gate Violations (COMPLETED - Major refactoring by user)

Based on linting results, core rules, and sub-agent reviews:

__CRITICAL PRINCIPLES TO FOLLOW:__

1. __TDD ALWAYS__ - Write failing tests FIRST, then implementation (Red → Green → Refactor)
2. __No type assertions__ - Never use `as`, `any`, `!` except at external signal boundaries with validation
3. __Never disable checks__ - Fix root causes, never work around linting/type errors
4. __Pure functions first__ - Extract complex logic into testable pure functions
5. __Delete unused code__ - If it's not used, delete it immediately

__SUB-AGENT REVIEW SUMMARY:__

- **Architecture-Reviewer (85% Compliance)**: Approach is sound but needs stronger boundary definitions
- **Code-Reviewer (High Success)**: All 19 violations fixable with planned approach
- **Test-Auditor (Partial Compliance)**: Must show explicit Red → Green → Refactor cycle

#### 3.1: Type Assertion Violations (CRITICAL - violates "No type shortcuts" rule)

- [ ] ACTION: Fix type assertion in `typegen-core.ts:119`
  - Current: `as Record<string, unknown>`
  - Solution: This is the ONLY allowed assertion at system boundary (reading external file)
  - **TDD Steps**:
    1. RED: Write failing test for `validateAndParseSchema()` function
    2. GREEN: Implement validation with proper type guards
    3. REFACTOR: Add assertion ONLY after validation
  - Document why this one assertion is necessary (external signal boundary)

- [ ] ACTION: Fix 3 type assertions in `operation-extraction.ts` (lines 30, 58, 91)
  - Current: Using `as` for type coercion
  - Solution: Extract pure validation functions
  - **TDD Steps**:
    1. RED: Write failing tests for `isValidOperation()`, `isValidParameter()`, `isValidResponse()`
    2. GREEN: Implement type predicates that return proper type guards
    3. REFACTOR: Replace all `as` assertions with type guard calls
  - Use discriminated unions or type predicates

#### 3.2: Function Complexity Violations (violates "Splitting long functions" rule)

- [ ] ACTION: Reduce `processPath` complexity from 9 to 8 (`typegen-extraction.ts:180`)
  - **TDD Steps**:
    1. RED: Write failing test for `collectPathParameters()` function
    2. GREEN: Extract and implement parameter collection logic
    3. RED: Write failing test for `processParameterEnums()` function
    4. GREEN: Extract and implement enum processing logic
    5. RED: Write failing test for `processPathOperations()` function
    6. GREEN: Extract operation processing loop
    7. REFACTOR: Compose functions in `processPath` to reduce complexity to ≤8
  - Ensure each function has single responsibility

#### 3.3: Unnecessary Conditionals (violates "Never work around checks" rule)

- [ ] ACTION: Fix unnecessary optional chain (`typegen-extraction.ts:94`)
  - Line 94: Remove optional chain on non-nullish value
  - Analyse why the value cannot be null and fix root cause

- [ ] ACTION: Fix unnecessary conditionals (`typegen-extraction.ts:103,122`)
  - Line 103: Types have no overlap - remove impossible condition
  - Line 122: Left side of `??` cannot be null - use direct assignment

- [ ] ACTION: Fix config conditionals (`src/config/index.ts:22,34`)
  - Line 22: Types have no overlap - fix type definitions
  - Line 34: Fix unsafe assignment from any

- [ ] ACTION: Fix test conditional (`src/tool-generation.unit.test.ts:15`)
  - Comparison always true (`"get" === "get"`)
  - Remove redundant test or fix test logic

#### 3.4: Unused Code (violates "No unused code" rule)

- [ ] ACTION: Remove unused `OperationObject` import (`typegen-extraction.ts:8`)
  - Delete the import
  - Verify no other code depends on it

#### 3.5: Type Safety in Tests (violates testing principles)

- [ ] ACTION: Fix unsafe assignments in test files
  - **TDD Steps**:
    1. Create `test-fixtures.ts` with properly typed OpenAPI3 fixtures
    2. Replace all `any` types with typed fixtures:
       - `typegen-writers.unit.test.ts:23` - Use `OpenAPI3` typed mock
       - `schema-generators.test.ts:15,41,43` - Use typed test data
    3. Ensure fixtures are minimal and focused on test needs
  - Never use `any` in tests - use proper types or unknown
  - Example fixture:
    ```typescript
    export const mockSchema: OpenAPI3 = {
      openapi: '3.0.3',
      info: { title: 'Test', version: '1.0.0' },
      paths: { /* minimal paths for test */ }
    };
    ```

#### 3.6: Template Expression Type Error

- [ ] ACTION: Fix template literal with number (`operation-generators.ts:46`)
  - Convert number to string explicitly before template use
  - Add type guard if needed

#### 3.7: Type Parameter Usage

- [ ] ACTION: Fix single-use type parameter (`typegen-helpers.ts:12`)
  - Remove unnecessary generic or use it properly
  - Simplify function signature if generic not needed

### Phase 4: Sub-agent Review Cycle (After Linting Fixes)

#### 4.1: Review Tasks for Linting Resolution

- [ ] REVIEW: Architecture-reviewer validates linting resolution approach
  - Confirm TDD is used for all refactoring (Red → Green → Refactor shown explicitly)
  - Verify pure functions are extracted properly (organelles within cells)
  - Validate no workarounds or disabled checks
  - Check adherence to biological architecture:
    - No cross-organ imports in refactored code
    - Chorai remain pervasive and organa remain discrete
    - Pure functions truly have no side effects
  - Verify system boundary definition for type assertion

- [ ] REVIEW: Code-reviewer validates linting fixes
  - Confirm ALL 19 violations are resolved
  - Verify no new violations introduced
  - Check code quality improvements
  - Validate type safety without assertions

- [ ] REVIEW: Test-auditor validates new tests
  - Confirm TDD approach (test written first)
  - Verify tests prove useful behaviour
  - Check no complex mocks
  - Validate test simplicity (KISS)

#### 4.2: Expected Outcomes After Reviews

__Success Criteria:__

- `pnpm lint` returns 0 violations
- `pnpm type-check` returns 0 errors
- All functions have complexity ≤ 8
- Zero type assertions (except validated boundary in typegen-core.ts:119)
- All tests pass and follow TDD principles
- No disabled linting rules or workarounds

__Quality Metrics:__

- Function complexity: Max 8 (currently 9 in processPath)
- Type assertions: Max 1 at boundary (currently 4)
- Unsafe operations: 0 (currently 3 in tests)
- Unused imports: 0 (currently 1)
- Test coverage: 100% for new pure functions

### Phase 5: Full Quality Gates (PRIORITY 4)

- [ ] QUALITY-GATE: Run complete quality checks in order
  1. `pnpm format:check` - MUST PASS with zero violations
  2. `pnpm lint` - MUST PASS with zero errors
  3. `pnpm type-check` - MUST PASS with zero errors
  4. `pnpm test` - MUST PASS all tests
  5. `pnpm build` - MUST build successfully
  6. Verify generated `path-parameters.ts` contains PATH_OPERATIONS

- [ ] ACTION: Fix any remaining issues from quality gates
  - Apply formatters if needed
  - Fix any new lint violations
  - Resolve any type errors
  - Update failing tests
  - Document any breaking changes

### Phase 6: Validation Implementation - ARCHITECTURAL VIOLATION DISCOVERED (2025-08-13)

#### Critical Issue Found (14:30):

**MAJOR VIOLATION**: Request validators are using MANUALLY defined Zod schemas instead of generated ones from the API schema. This breaks the CORE principle that ALL types must flow from the API schema.

**What's Wrong:**
- `request-validators.ts` contains hand-coded Zod schemas like:
  ```typescript
  const schemaBuilders = {
    lessonTranscript: () => z.object({ lesson: z.string() }),
    searchLessons: () => z.object({
      q: z.string(),
      keyStage: z.enum(['ks1', 'ks2', 'ks3', 'ks4', 'eyfs']).optional(),
      // ... manual definitions
    })
  };
  ```
- These duplicate information from the OpenAPI spec
- When API changes, manual updates are required (breaks trivial updatability)
- Risk of drift between API spec and validation logic

**What's Correct:**
- Response validators properly use generated Zod schemas from `src/types/generated/zod/schemas.ts`
- Zod generation pipeline (`generate:zod`) correctly generates schemas from OpenAPI

#### Previously Completed Items:
- [x] ACTION: Created `src/validation/` directory structure
- [x] ACTION: Defined validation types (`ValidationResult`, `ValidationIssue`, `ValidatedClientOptions`)
- [x] ACTION: Written failing tests for `validateRequest` (TDD Red phase)
- [x] ACTION: Implemented `validateRequest` function ~~using generated Zod schemas~~ **USING MANUAL SCHEMAS** ❌
- [x] ACTION: Written failing tests for `validateResponse` (TDD Red phase)
- [x] ACTION: Implemented `validateResponse` function with tests (TDD Green phase) ✅
- [x] ACTION: Updated `src/index.ts` with explicit validation exports (no export * for tree-shaking)
- [x] ACTION: Refactored for ESLint compliance (complexity reduction from 15 to 2)
- [x] ACTION: Eliminated all type assertions using `parseWithSchema` helper
- [x] ACTION: All tests passing (91 total)
- [x] REVIEW: Code-reviewer validated implementation
- [x] REVIEW: Test-auditor confirmed exemplary TDD approach
- [x] REVIEW: Type-reviewer added type safety improvements

### Phase 7: Fix Request Validation to Use Generated Schemas (IN PROGRESS - 2025-08-13)

**Core Principle:** ALL types MUST flow from the API schema for trivial updatability.

**Critical Issue Identified**: Request validators use manually defined Zod schemas instead of generated ones. This violates:
- ADR-030: SDK as single source of truth
- ADR-031: Generation-time extraction pattern

#### Investigation Complete (15:00)
- [x] ACTION: Investigate if request parameter schemas are being generated
  - **Finding**: NO - only response schemas are generated using `schemas-only` template
- [x] ACTION: Identify root cause
  - **Finding**: `zodgen-core.ts` uses `schemas-only` template which doesn't generate parameter schemas
- [x] ACTION: Find solution
  - **Finding**: `default` template from openapi-zod-client can generate full endpoint definitions with parameters
- [x] REVIEW: Architecture-reviewer verified approach aligns with ADRs
- [x] REVIEW: Code-reviewer confirmed solution is correct

#### Implementation Plan (TDD Approach)
- [x] ACTION: Write failing test for `generateZodEndpointsArtifacts` function (TDD Red)
- [ ] ACTION: Implement `generateZodEndpointsArtifacts` in `zodgen-core.ts` (TDD Green)
- [ ] ACTION: Update `zodgen.ts` to call both generation functions
- [ ] ACTION: Generate endpoint schemas with parameter validation
- [ ] ACTION: Write failing test for request validators using generated schemas
- [ ] ACTION: Refactor `request-validators.ts` to import generated parameter schemas
- [ ] ACTION: Remove ALL manual schema definitions from `request-validators.ts`
- [ ] ACTION: Verify all validation tests pass
- [ ] REVIEW: Architecture-reviewer to verify single source of truth achieved
- [ ] QUALITY-GATE: Run all SDK quality checks

#### Expected Outcome
- Request validation schemas generated from OpenAPI spec
- No manual schema definitions in validation layer
- SDK trivially updatable - just run `generate:types` when API changes
- Full compliance with ADR-030 and ADR-031

### Phase 8: Per-Operation Validators for Compile-Time Safety (CRITICAL for SDK usability)

**Why This Is Now Critical (not deferred):**
- Next project after MCP will use SDK directly and needs compile-time type safety
- Current generic validators (`validateRequest`) only provide runtime validation
- Without per-operation validators, SDK users get no TypeScript help catching errors
- This violates developer ergonomics expectations for a TypeScript SDK

**Core Requirement: Fully Programmatic Generation**
- ✅ MUST be 100% generated from OpenAPI schema - zero magic strings
- ✅ MUST automatically update when API changes (single `generate:types` command)
- ✅ MUST NOT contain any hardcoded paths or operation names
- ✅ MUST maintain trivial updatability principle

#### Implementation Plan (1-2 days effort)

**Approach: Generate Typed Wrapper Functions**

1. **Add generator function to `zodgen-core.ts`**:
```typescript
export async function generateTypedValidators(
  openApiDoc: OpenAPI3,
  outDir: string
): Promise<void> {
  const validators: string[] = [];
  
  // Iterate OpenAPI document - NO hardcoded paths!
  for (const [path, pathItem] of Object.entries(openApiDoc.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!isHttpMethod(method)) continue;
      
      // Everything comes FROM the OpenAPI spec
      const funcName = `validate${toPascalCase(operation.operationId)}`;
      const typePath = `paths['${path}']['${method}']['parameters']`;
      
      validators.push(`
export function ${funcName}(
  args: ${typePath}
): ValidationResult<${typePath}> {
  return genericValidate('${path}', '${method}', args);
}`);
    }
  }
  
  // Write generated file
  const content = `
// AUTO-GENERATED from OpenAPI schema - DO NOT EDIT
import { validateRequest as genericValidate } from '../../validation/request-validators';
import type { ValidationResult } from '../../validation/types';
import type { paths } from '../api-schema/api-schema';

${validators.join('\n')}
`;
  
  await writeFile(path.join(outDir, 'validators.ts'), content);
}
```

2. **What Gets Generated** (example):
```typescript
// This entire file is AUTO-GENERATED
export function validateGetLessonsTranscript(
  args: paths['/lessons/{lesson}/transcript']['get']['parameters']
): ValidationResult<paths['/lessons/{lesson}/transcript']['get']['parameters']> {
  return genericValidate('/lessons/{lesson}/transcript', 'get', args);
}

export function validateSearchLessons(
  args: paths['/search/lessons']['get']['parameters']
): ValidationResult<paths['/search/lessons']['get']['parameters']> {
  return genericValidate('/search/lessons', 'get', args);
}
// ... one function per operation in the API
```

3. **Benefits for SDK Users**:
```typescript
// Full compile-time type checking
validateGetLessonsTranscript({ 
  lesson: 'adding-fractions' // ✅ TypeScript knows this needs to be a string
});

// TypeScript catches errors at compile time
validateGetLessonsTranscript({ 
  lessson: 'typo' // ❌ TS Error: Did you mean 'lesson'?
});

validateSearchLessons({
  q: 'mathematics',
  keyStage: 'invalid' // ❌ TS Error: not assignable to type 'ks1' | 'ks2' | 'ks3' | 'ks4'
});
```

#### Why This Approach Is Correct:
- **No magic strings**: Paths come from iterating the OpenAPI document
- **Automatic updates**: When API changes, regeneration creates/removes/updates functions
- **Type safety**: Links to generated `paths` type ensures consistency
- **Tree-shakeable**: Each validator is a separate export
- **Zero maintenance**: Never needs manual updates

#### Action Items:
- [ ] ACTION: Write failing tests for typed validator generation (TDD Red)
- [ ] ACTION: Implement `generateTypedValidators` in `zodgen-core.ts` (TDD Green)
- [ ] ACTION: Update `zodgen.ts` CLI to call typed validator generation
- [ ] ACTION: Add generated validators to SDK exports
- [ ] ACTION: Write tests demonstrating compile-time type safety
- [ ] REVIEW: Architecture-reviewer to verify fully programmatic approach
- [ ] QUALITY-GATE: Ensure all quality checks still pass

**Deferred Items (Actually Future Work):**
- [ ] ACTION: Implement `makeValidatedClient(baseClient, opts)` wrapper
- [ ] ACTION: Document validation usage patterns

#### Key Achievements:
- ✅ Request validation maps paths/methods to Zod schemas for parameter validation
- ✅ Response validation maps operation IDs and status codes to response schemas
- ✅ Type-safe discriminated unions for `ValidationResult<T>`
- ✅ Tree-shaking support with explicit exports
- ✅ Full test coverage for validation functions
- ✅ ESLint compliance (refactored complex functions)

#### Architecture Notes:
- SDK remains a pure utility library (Moria-like abstractions)
- Validation functions are pure utilities with no side effects
- Using generated Zod schemas from `src/types/generated/zod/schemas.ts`
- All exports are explicit to enable tree-shaking
- Followed strict TDD approach (Red-Green-Refactor)

- ACTION: Add TypeDoc + typedoc-plugin-markdown and `typedoc.json` in SDK package
- ACTION: Add TSDoc comments to public exports (`src/index.ts`, `src/validation/index.ts`, `src/tool-generation/index.ts`)
- ACTION: Add `docs:api` script in SDK `package.json`; generate docs to `docs/api/`
- REVIEW: Docs-reviewer — verify generated `docs/api/` structure and content; confirm only root exports are documented
- QUALITY-GATE: verify exclude patterns; run docs generation locally and in CI

### Sub-agent Checkpoints (per GO.md)

- __Architecture-Reviewer__
  - Confirm generator placement doesn’t bloat public surface; output is tree-shakeable.
  - Ensure `toolGeneration` shapes are stable and minimal.
- __Code-Reviewer__
  - Verify generator functions are pure, deterministic, and have robust error handling.
  - Confirm no type assertions beyond `as const`; favour type guards.
- __Docs-Reviewer__
  - Validate TSDoc coverage for all public exports; examples align with runtime behaviour.
- __Release-Reviewer__
  - Audit additive-only changes; confirm semantic versioning and CI quality gates.

### Acceptance Criteria (next milestone)

- Lint, type-check, unit and e2e tests pass in SDK with zero errors.
- `validation` helpers implemented for at least two key operations (lessons summary, transcript) with TDD.
- `makeValidatedClient` wrapper provides strict and non-strict modes, documented with examples.
- Public API docs generated into `docs/api/` excluding generated folders, and linked from the reference doc.

## Risks & Mitigations

- __Bundle size__: Curate exports; generate schemas but re-export only commonly used ones. Keep others internal and tree-shakeable.
- __Perf overhead__: Validation is opt-in. The default client remains unchanged.
- __Schema drift__: Generate schemas at build-time from the same OpenAPI source as types; version pin the generator; add CI check step.
- __DX confusion__: Provide clear docs and examples; keep API minimal and predictable.
- __Stability of programmatic exports__: Keep under a dedicated `toolGeneration` namespace; document non-breaking evolution policy; avoid leaking internal file paths.
- __ESLint/TS project parsing of generated artifacts__: Exclude `test-cache/**` and other generated outputs from ESLint TypeScript project parsing or enable `allowDefaultProject`. Add `.eslintignore` or parserOptions overrides. Verify with `pnpm -F @oaknational/oak-curriculum-sdk lint`.

## Success Criteria

- New additive exports exist for runtime validation.
- Developers can opt-in to request/response validation with minimal friction.
- Tests cover pure helpers and the validated client wrapper.
- Build artifacts (`dist/index.d.ts`) reflect new exports; no internal path leaks.
- Docs updated with a concise “Runtime Validation (Zod)” section.
- Docs updated with a concise “Programmatic Tool Generation” section showing `schema`, `toolGeneration.PATH_OPERATIONS`, `PARAM_TYPE_MAP`, and `parsePathTemplate` usage.

## Rollout

- Start with a curated set of response schemas (e.g., lessons summary/transcript) to validate approach and bundle impact.
- Gather feedback, then expand coverage iteratively via codegen mappings.

## Open Questions

- Which operations' responses should be prioritized first? (Proposed: lessons summary/transcript, search results)
- Should we expose per-operation validators (e.g., `validateLessonsSummaryResponse`) for ergonomics, in addition to generic helpers?
- Do we want a strict mode in the wrapper client that throws on validation failure vs returning discriminated result?

## Decisions (added)

- __Tool naming format__: `oak-<method>-<kebab-path>` (e.g., `/lessons/{lesson}/transcript` GET -> `oak-get-lessons-transcript`).
- __Input schemas__: include both path and query parameters by default in generated tool input schemas.
- __OPERATIONS_BY_ID__: optional nicety; may be added additively later if needed by consumers.

## Implementation Note: Generation Time vs Runtime (2025-08-12)

After deep analysis comparing the reference implementation with current approach, we discovered a fundamental architectural issue:

__Problem__: The current `tool-generation/index.ts` attempts to dynamically iterate the `as const` schema at runtime, which requires type assertions and loses type safety.

__Solution__ (from reference implementation):

1. At __generation time__ (`typegen-core.ts`), extract ALL metadata from the OpenAPI schema
2. Generate TypeScript code __as strings__ that define runtime constants
3. Write these constants to files (e.g., `path-parameters.ts`)
4. At __runtime__, simply import and use these pre-generated, fully-typed constants

__Key Insight__: The `for (const path in schema.paths)` pattern in the reference works because it's in a __template string__ being generated, not actual TypeScript code being executed. The generated code has access to the `as const` schema for types, but all the actual data is pre-extracted into constants.

__Benefits__:

- Zero type assertions needed at runtime
- Perfect type safety maintained  
- Very performant - no runtime processing needed
- Single source of truth - the OpenAPI schema at build time

### Examples from Reference Implementation

__1. Generation Time (typegen.ts lines 338-350):__

```typescript
// This code GENERATES a string that becomes TypeScript code
const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {  // schema here is OpenAPI3 type
  if (!isValidPath(path)) {
    throw new TypeError(`Invalid path: ${path}`);
  }
  const methods = Object.keys(schema.paths[path]);  // Works because OpenAPI3 allows indexing
  for (const method of methods) {
    allowedMethodsSet.add(method as AllowedMethods);
  }
}

// Generate the TypeScript code as a STRING
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
```

__2. Generated Output (path-parameters.ts lines 68-86):__

```typescript
// This is the GENERATED code that gets written to the file
const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {  // schema here has 'as const'
  if (!isValidPath(path)) {
    throw new TypeError(`Invalid path: ${path}`);
  }
  const methods = Object.keys(schema.paths[path]);  // Works in generated code!
  for (const method of methods) {
    allowedMethodsSet.add(method as AllowedMethods);
  }
}

// The full set of allowed methods for all paths.
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
```

__3. Pattern for Generating Constants (typegen.ts lines 374-384):__

```typescript
// Extract at generation time
const parameters = extractPathParameters(schema);  // schema is OpenAPI3

// Generate the code string
const pathParameterFileContent = `/**
 * Key stages extracted from the API schema
 */
export const KEY_STAGES = ${JSON.stringify(
  parameters.keyStage,
  undefined,
  2
)} as const;
type KeyStages = typeof KEY_STAGES;
export type KeyStage = KeyStages[number];
export function isKeyStage(value: string): value is KeyStage {
  const keyStages: readonly string[] = KEY_STAGES;
  return keyStages.includes(value);
}`;

// Write to file
fs.writeFileSync(outFile, pathParameterFileContent);
```

__4. What We Need to Generate for PATH_OPERATIONS:__

```typescript
// In typegen-core.ts, extract operations at generation time
function extractOperations(schema: OpenAPI3) {
  const operations = [];
  for (const path in schema.paths) {
    const pathItem = schema.paths[path];
    for (const method of ['get', 'post', 'put', 'delete']) {
      const operation = pathItem[method];
      if (operation) {
        operations.push({
          path,
          method,
          operationId: operation.operationId,
          summary: operation.summary,
          description: operation.description,
          parameters: operation.parameters || []
        });
      }
    }
  }
  return operations;
}

// Generate the TypeScript code string
const operations = extractOperations(schema);
const operationsCode = `
export const PATH_OPERATIONS = ${JSON.stringify(operations, null, 2)} as const;

export const OPERATIONS_BY_ID = {
${operations.map(op => `  "${op.operationId}": PATH_OPERATIONS[${operations.indexOf(op)}]`).join(',\n')}
} as const;
`;

// Write to path-parameters.ts
```

## Comments

### From: Claude (MCP Tool Generation Agent) - 2025-08-12

I'm implementing Phase 6.5 (Programmatic MCP Tool Generation) and have reviewed this Zod validators plan. The runtime validation capabilities will be extremely helpful for MCP tool input/output validation. However, for programmatic MCP tool generation from the SDK, I need additional exports that aren't currently covered in this plan.

#### What This Plan Provides (That I Can Use):

✅ __Runtime validation__ - The `validateRequest` and `validateResponse` functions can replace our manual validators  
✅ __Per-operation validators__ - These will ensure MCP tool inputs match API expectations  
✅ __Type safety__ - Generated Zod schemas maintain consistency between SDK and MCP layers

#### Additional Exports Needed for Programmatic MCP Tool Generation:

1. __Raw OpenAPI Schema Export__:

```typescript
// Need in SDK index.ts:
export { schema } from './types/generated/api-schema/api-schema';
```

*Rationale*: I need to parse the OpenAPI schema to extract operation metadata (descriptions, parameter details) for generating MCP tool definitions.

2. __Path Operation Metadata__:

```typescript
export interface PathOperationMetadata {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  operationId: string;
  summary?: string;
  description?: string;
  parameters: ParameterMetadata[];
}

export const PATH_OPERATIONS: PathOperationMetadata[];
```

*Rationale*: MCP tools need human-readable descriptions and operation details that aren't in the type definitions alone.

3. __Parameter Type Mappings__:

```typescript
export const PARAM_TYPE_MAP = {
  keyStage: { type: 'string', enum: KEY_STAGES },
  subject: { type: 'string', enum: SUBJECTS },
  lesson: { type: 'string', pattern: '^[a-z0-9-]+$' },
  // ... other parameter types
};
```

*Rationale*: I need to convert OpenAPI parameter types to JSON Schema format for MCP tool input schemas.

4. __Path Template Utilities__:

```typescript
export function parsePathTemplate(template: string): {
  pathParams: string[];
  toMcpToolName(): string;
};
```

*Rationale*: Need to parse paths like `/lessons/{lesson}/transcript` to generate consistent MCP tool names like `oak-get-lesson-transcript`.

#### SDK Constants Verification:

__UPDATE (2025-08-12)__: After testing with the actual API, I've confirmed that __the SDK is correct and the MCP validators are wrong__.

__Verified API Reality (tested with API key):__

1. __Key Stages - SDK is CORRECT__:
   - API supports exactly: `['ks1', 'ks2', 'ks3', 'ks4']` ✅
   - API rejects `'eyfs'` with: "Invalid enum value. Expected 'ks1' | 'ks2' | 'ks3' | 'ks4', received 'eyfs'"
   - API rejects `'ks5'` with: "Invalid enum value. Expected 'ks1' | 'ks2' | 'ks3' | 'ks4', received 'ks5'"
   - __SDK correctly exports__: `['ks1', 'ks2', 'ks3', 'ks4']`
   - __MCP validators incorrectly have__: `['eyfs', 'ks1', 'ks2', 'ks3', 'ks4', 'ks5']` ❌

2. __Subjects - SDK is CORRECT__:
   - API returns exactly 17 subjects (verified via `/subjects` endpoint):

     ```text
     art, citizenship, computing, cooking-nutrition, design-technology,
     english, french, geography, german, history, maths, music,
     physical-education, religious-education, rshe-pshe, science, spanish
     ```

   - __SDK correctly exports__ all 17 subjects including `'cooking-nutrition'` ✅
   - __MCP validators incorrectly have__ 18 subjects including non-existent `'latin'` ❌

__Root Cause:__

The MCP validators were manually created with __incorrect assumptions__ about what a UK education API "should" have (EYFS for early years, KS5 for sixth form, Latin as a classical subject) rather than what the Oak API __actually supports__.

__Impact for Programmatic Generation:__

This is actually __good news__! It means:

1. ✅ The SDK is already correct and can be trusted as the source of truth
2. ✅ No SDK updates needed - it accurately reflects the API
3. ✅ Programmatic generation from SDK will give correct values
4. ❌ Manual MCP validators must be deleted and replaced with SDK imports

__Immediate Action Required:__

The MCP validators file (`ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/validators/tool-validators.ts`) needs to be updated to:

```typescript
// DELETE all manual constants
// IMPORT from SDK instead
import { KEY_STAGES, SUBJECTS } from '@oaknational/oak-curriculum-sdk';
export { KEY_STAGES, SUBJECTS }; // Re-export for organ use
```

This confirms that programmatic generation from the SDK is the correct approach and will eliminate these kinds of errors.

#### Integration with MCP Tool Generation:

With these additional exports, the programmatic MCP tool generation can:

1. Iterate over `PATH_OPERATIONS` to generate all tools automatically
2. Use `PARAM_TYPE_MAP` for JSON Schema generation without duplication
3. Use Zod validators for runtime validation of MCP inputs
4. Use `parsePathTemplate` to generate consistent tool names

#### Recommendation:

Consider adding a new export namespace specifically for tool generation support:

```typescript
export * as toolGeneration from './tool-generation';
```

This would keep the concerns separated while providing the necessary building blocks for programmatic MCP tool generation.

#### MCP Tool Generation File Locations:

The programmatic MCP tool generation code that would consume these exports is located at:

```text
ecosystem/psycha/oak-curriculum-mcp/
├── src/
│   ├── chorai/
│   │   └── aither/
│   │       └── tool-generation/          # Infrastructure for generation
│   │           ├── generator.ts          # Main generation logic
│   │           ├── metadata-registry.ts  # Tool metadata and descriptions
│   │           └── path-parser.ts        # Path template parsing
│   └── organa/
│       └── mcp/
│           ├── generated/
│           │   └── tools.generated.ts    # AUTO-GENERATED tool definitions
│           ├── tools/
│           │   ├── index.ts              # Re-exports generated + custom tools
│           │   └── composite-tools.ts    # Manual composite tools
│           └── validators/
│               └── tool-validators.ts    # Currently has duplicated constants
```

#### Example Usage in MCP Tool Generation:

__File: `ecosystem/psycha/oak-curriculum-mcp/src/chorai/aither/tool-generation/generator.ts`__

```typescript
import {
  PATHS,
  KEY_STAGES,
  SUBJECTS,
  schema,
  PATH_OPERATIONS,
  PARAM_TYPE_MAP,
  parsePathTemplate,
  validateRequest,  // From Zod plan
} from '@oaknational/oak-curriculum-sdk';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

// Generate MCP tools from SDK exports
export function generateMcpTools(): Tool[] {
  return PATH_OPERATIONS.map(operation => {
    const { pathParams, toMcpToolName } = parsePathTemplate(operation.path);
    
    return {
      name: toMcpToolName(),
      description: operation.summary || operation.description || `Operation: ${operation.operationId}`,
      inputSchema: {
        type: 'object',
        properties: generatePropertiesFromParams(operation.parameters),
        required: operation.parameters.filter(p => p.required).map(p => p.name),
      },
    };
  });
}

function generatePropertiesFromParams(params: ParameterMetadata[]) {
  const properties: Record<string, any> = {};
  
  for (const param of params) {
    // Use SDK's PARAM_TYPE_MAP instead of duplicating
    if (param.name in PARAM_TYPE_MAP) {
      properties[param.name] = PARAM_TYPE_MAP[param.name];
    } else {
      properties[param.name] = {
        type: param.type || 'string',
        description: param.description,
      };
    }
  }
  
  return properties;
}
```

__File: `ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts`__

```typescript
import { validateRequest, validateResponse } from '@oaknational/oak-curriculum-sdk';

export async function handleToolCall(
  toolName: string,
  args: unknown,
  curriculumOrgan: CurriculumOrgan
): Promise<unknown> {
  const path = toolNameToPath(toolName);
  
  // Use SDK's Zod validators instead of manual validation
  const validation = validateRequest(path, 'get', args);
  if (!validation.ok) {
    throw new McpValidationError(validation.issues);
  }
  
  // Make API call
  const response = await curriculumOrgan.executeOperation(path, validation.value);
  
  // Validate response using SDK's Zod schemas
  const responseValidation = validateResponse(path, 'get', 200, response);
  if (!responseValidation.ok) {
    throw new ApiResponseError('Invalid API response', responseValidation.issues);
  }
  
  return responseValidation.value;
}
```

__File: `ecosystem/psycha/oak-curriculum-mcp/scripts/generate-tools.ts`__

```typescript
import { generateMcpTools } from '../src/chorai/aither/tool-generation/generator';
import { TOOL_METADATA } from '../src/chorai/aither/tool-generation/metadata-registry';
import fs from 'node:fs';
import path from 'node:path';

// Build-time generation script
async function main() {
  console.log('🔧 Generating MCP tools from SDK...');
  
  const tools = generateMcpTools();
  
  // Enhance with custom metadata
  const enhancedTools = tools.map(tool => ({
    ...tool,
    ...TOOL_METADATA[tool.name], // Add categories, examples, etc.
  }));
  
  // Write to generated file
  const outputPath = path.join(
    __dirname,
    '../src/organa/mcp/generated/tools.generated.ts'
  );
  
  const content = `// AUTO-GENERATED - DO NOT EDIT
// Generated from Oak Curriculum SDK on ${new Date().toISOString()}

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const GENERATED_TOOLS: Tool[] = ${JSON.stringify(enhancedTools, null, 2)} as const;

export const TOOL_COUNT = ${enhancedTools.length} as const;
`;
  
  fs.writeFileSync(outputPath, content);
  console.log(`✅ Generated ${enhancedTools.length} MCP tools`);
}

main().catch(console.error);
```

__File: `ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/validators/tool-validators.ts`__

```typescript
// BEFORE: Manual duplication (DELETE THIS)
const VALID_KEY_STAGES = ['eyfs', 'ks1', 'ks2', 'ks3', 'ks4', 'ks5'] as const;
const VALID_SUBJECTS = ['english', 'maths', ...] as const;

// AFTER: Use SDK exports directly
import { KEY_STAGES, SUBJECTS, isValidPath } from '@oaknational/oak-curriculum-sdk';
export { KEY_STAGES, SUBJECTS, isValidPath }; // Re-export for organ use
```

This shows exactly how the MCP code would consume the new SDK exports to eliminate duplication and enable programmatic tool generation.

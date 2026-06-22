# Plan: Generic Multi-Status Response Handling

**Status**: Draft  
**Created**: 2025-10-27  
**Workspace**: `packages/sdks/oak-curriculum-sdk` (SDK), `apps/oak-curriculum-mcp-stdio` (MCP Server)

## Objective

Establish complete test coverage proving generic multi-status response handling, then implement a schema-driven system where ANY response status code documented in the OpenAPI schema is treated as a valid, typed response. Remove all hardcoded status assumptions.

## Guiding Principles

- **TDD First**: Write ALL tests BEFORE modifying ANY product code
- **Baseline Recorded**: Capture green `pnpm type-check`, `pnpm lint`, and full quality gate runs before adding new tests. Every phase must return to this baseline.
- **Behavior Over Implementation**: Tests prove WHAT works, not HOW it works
- **Schema-First**: ALL status codes flow from schema at type-gen time. If the generator cannot emit the target `{status,data}` discriminated union, stop and fix the generator first.
- **Public API Only**: Tests and production code must consume the SDK through public exports (`@oaknational/oak-curriculum-sdk`). No deep imports from `types/generated/**`.
- **Generic Solution**: No special cases for 404, 200, or any other status
- **Fail Fast**: Undocumented statuses fail immediately with clear errors
- **No Complex Mocks**: Use simple fakes passed as function arguments. If that is impossible, refactor production code to make it possible.
- **Phase Gate**: After authoring each test suite, run it (expecting red) and record the failure before touching product code.
- **Quality Gate Loop**: At the end of every phase, rerun `pnpm type-check`, `pnpm lint`, and the relevant test suites. Resolve failures immediately before moving on.

## Success Criteria

1. ✅ System validates responses against schema for their actual status code
2. ✅ All documented status codes (200, 404, 500, etc.) treated as valid responses
3. ✅ Only undocumented status codes cause validation errors
4. ✅ Status code information flows from schema → SDK → MCP server → user
5. ✅ Zero hardcoded status assumptions anywhere in the codebase

## Phase 0: Baseline Quality Net

> **Objective**: Record the clean starting point and guarantee we can return to it after every phase.

### Tasks

- [x] Run `pnpm type-check`, `pnpm lint`, and the full quality gate (`pnpm test`, `pnpm test:e2e`, and any workspace-specific suites) from the repo root.
- [x] Capture command output locations (logs or summaries) for comparison later.
- [x] Resolve and document any failure before moving forward.

### Baseline Record — 27 October 2025 19:27 BST

- `pnpm type-check` ✅ (SDK `dist` rebuilt via `pnpm --filter @oaknational/oak-curriculum-sdk build` to clear stale tool result types)
- `pnpm lint` ✅ (turbo multi-package run)
- `pnpm test` ✅ (all workspaces green, full turbo replay)
- `pnpm test:e2e` ✅ (stdio + streamable HTTP + SDK harnesses clean)

### Exit Criteria

- [x] All baseline commands succeed and the outputs are recorded.
- [x] Any initial failures are fixed and explained in the plan log.

## Phase 1: Test Coverage for Expected Behavior

> **Cardinal Rule**: NO PRODUCT CODE CHANGES during this phase. Tests prove the behavior we WANT, not the behavior we HAVE.
>
> **Generator Gate**: If the generator cannot emit the `{status,data}` discriminated union demanded by a test, stop and address the generator before touching runtime code.

### Phase 1 Status — 28 October 2025 10:33 GMT

- `pnpm --filter @oaknational/oak-curriculum-sdk test` ✅ red-to-green cycle complete; the schema-first 404 envelope now matches the live API (`message/code/data` shape) and the new unit/integration suites assert the generated descriptors and response-map entries.
- `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test -- --runInBand` ✅ stdio unit/integration suites consuming the `{status,data}` envelope are passing with the revised error schema.
- `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e` ✅ multi-status E2E harness now observes 200 and 404 responses without erroring.
- Full-repo `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e` ➡️ pending until streamable HTTP adjustments land (Phase 2), then the quality gate loop will be rerun end-to-end.

### Phase 2 Status — 28 October 2025 10:50 GMT

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` ✅ unit suites green after wiring the status-aware executor results through `registerHandlers`.
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e` ✅ stub/live SSE helpers now parse `{status,data}` envelopes for aggregated and generated tools.
- Streamable HTTP + stdio both consume the SDK’s `{status,data}` envelopes; remaining work is the repo-wide quality gate loop prior to commit.

### 1.1 SDK: Schema Enhancement Unit Tests

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.unit.test.ts`

**Behaviour to Prove**:

- [x] `add404ResponsesWhereExpected` adds ANY documented error response to endpoints
- [x] Added responses contain proper schema definitions (now reflects `{ message, code, data }` envelope)
- [x] Function is generic (not specific to 404)
- [x] Function fails fast if response already exists in upstream schema
- [x] Function fails fast if configured endpoint doesn't exist

**Test Type**: Unit (pure function, no IO, no mocks)

**Note**: These tests likely pass, but we'll verify the function is truly generic

### 1.2 SDK: Zod Schema Generation Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.integration.test.ts`

**Behaviour to Prove**:

- [x] Generated Zod schemas include schemas for ALL documented response statuses
- [x] Schemas generated for inline response definitions (not just components)
- [x] Schema names follow consistent convention for any status code
- [x] Generated schemas accessible via `curriculumSchemas.{operationId}_{status}`
- [x] Works for 200, 404, 500, or any other documented status

**Test Type**: Integration (multiple units, mock filesystem as argument)

**Expected Initial State**: Tests WILL FAIL (inline schemas not generated)

### 1.3 SDK: Response Map Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/response-map/build-response-map.integration.test.ts`

**Behaviour to Prove**:

- [x] Response map includes entries for ALL documented status codes per operation
- [x] Each entry includes valid Zod schema (never undefined)
- [x] `getResponseDescriptorsByOperationId` returns ALL status descriptors
- [x] `getResponseSchemaByOperationIdAndStatus` works for any documented status
- [x] Function fails fast for undocumented status codes (as intended)

**Test Type**: Integration (multiple units, no IO)

**Expected Initial State**: Partial fail (map exists but schemas undefined)

### 1.4 SDK: Tool Descriptor Generic Validation Unit Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor-validation.unit.test.ts`

**Behaviour to Prove**:

- [x] `validateOutput` tries ALL documented statuses from schema (not just 200)
- [x] Returns `{ok: true, data, status: N}` for valid response matching status N
- [x] Returns `{ok: false, message, issues}` only when data matches NO documented status
- [x] Does not assume or prefer any particular status code
- [x] Includes attempted statuses in failure message

**Test Type**: Unit (pure function testing validation logic)

**Expected Initial State**: Tests WILL FAIL (may crash on undefined schemas)

### 1.5 SDK: Tool Descriptor Invoke Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-lessons-transcript.integration.test.ts`

**Behaviour to Prove**:

- [x] `invoke` returns appropriate data for ANY documented response status
- [x] Response payload extracted from correct location (response.data vs response.error)
- [x] Returned data shape matches schema for that status code
- [x] No hardcoded status handling (works generically)

**Test Type**: Integration (mock API client passed as argument)

**Expected Initial State**: Partial pass (200 works, others may fail)

### 1.6 SDK: Execute Tool Call Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/runtime/execute.integration.test.ts`

**Behaviour to Prove**:

- [x] `executeToolCall` validates output against actual response status
- [x] Output validation succeeds for ANY documented status code
- [x] Validation fails for undocumented status codes
- [x] Error messages indicate which statuses are documented

**Test Type**: Integration (mock client, multiple units working together)

**Expected Initial State**: Tests WILL FAIL (validation not status-aware)

### 1.7 SDK: execute-tool-call Result Envelope Unit Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.unit.test.ts`

**Behaviour to Prove**:

- [x] `executeToolCall` returns a structured success result that preserves `{ data, status }` from the underlying descriptor
- [x] Legitimate non-200 responses (e.g. 404 transcript) surface as successes rather than errors
- [x] Error results include the original attempted statuses and validation issues for observability
- [x] Backwards compatibility: existing `UNKNOWN_TOOL`, parameter, and execution error branches remain unchanged

**Test Type**: Unit (pure fakes for the generated descriptor; no network)

**Expected Initial State**: Tests WILL FAIL (current executor drops status metadata)

### 1.8 MCP Server: Generic Response Validation Integration Tests

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.integration.test.ts`

**Behaviour to Prove**:

- [x] `validateOutput` accepts actual status from tool execution result
- [x] Validates data against schema for that specific status
- [x] Does not hardcode status 200 or any other status
- [x] Tool handler treats ALL documented statuses as valid responses
- [x] Only undocumented statuses trigger error state

**Test Type**: Integration (mock tool descriptors passed as arguments)

**Expected Initial State**: Tests WILL FAIL (hardcoded to status 200)

### 1.9 MCP Tools Module: Transcript 404 User Experience Tests

**Location**: `apps/oak-curriculum-mcp-stdio/src/tools/index.integration.test.ts`

**Behaviour to Prove**:

- [x] `createMcpToolsModule().handleTool` treats legitimate 404 transcript responses as successful tool calls
- [x] Successful responses include surfaced status metadata/message derived from the SDK, not raw error serialisations
- [x] Error flows (unknown tool, genuine validation failure) still emit `isError: true` payloads with helpful text
- [x] Bridge honours the richer executor result shape without JSON parse regressions

**Test Type**: Integration (exercise the universal executor with a fake SDK client result)

**Expected Initial State**: Tests WILL FAIL (404 currently rejected as error output)

### 1.10 MCP Server: Response Status Metadata Integration Tests

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/tool-response-handlers.integration.test.ts`

**Behaviour to Prove**:

- [x] Handler includes actual status code in response
- [x] Response structure consistent regardless of status code
- [x] Client can determine response status from response content
- [x] isError flag false for all documented statuses
- [x] isError flag true only for validation failures

**Test Type**: Integration (mock handlers as arguments)

**Expected Initial State**: Tests WILL FAIL (status not included)

### 1.11 E2E: Multi-Status Flow Tests

**Location**: `apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts`

**Behaviour to Prove**:

- [x] Can fetch transcript for lesson with video (200 response)
- [x] Can fetch transcript for lesson without video (404 response)
- [x] Both responses are not errors (isError: false)
- [x] Response content includes status information
- [x] User experience clear for each status type

**Test Type**: E2E (real MCP protocol, may trigger real API calls)

**Expected Initial State**: Tests WILL FAIL (404 flow broken)

### Phase 1 Exit Checklist

- [x] Each new test suite has been run in isolation, fails for the intended reason, and the failure mode is recorded.
- [x] `pnpm type-check` (repo root) passes.
- [x] `pnpm lint` (repo root) passes.
- [x] Targeted unit/integration/e2e suites for touched workspaces pass once product code changes are implemented in later phases.

## Phase 2: Document Test Results

Before making ANY product code changes:

1. Run ALL tests from Phase 1
2. Document which tests pass and which fail
3. Analyze failure modes to understand exact gaps
4. Confirm test failures align with generic solution needs
5. Get approval that tests prove correct behavior

**Deliverable**: Test results document showing test status and failure analysis

### Phase 2 Findings (27 October 2025, 19:34 BST)

- ❌ `pnpm type-check`
  - `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.unit.test.ts:23` — new assertions expect `execution.status` yet the SDK still returns bare payloads.
  - `apps/oak-curriculum-mcp-streamable-http/e2e-tests/live-mode.e2e.test.ts:42`, `tool-call-envelope.e2e.test.ts:95`, `tool-call-success.e2e.test.ts:38`, and `src/index.unit.test.ts:84` — simple fakes now include `status` to model the desired envelope, triggering type errors until the SDK types expand.
- ❌ `pnpm lint`
  - Prettier alignment failures mirror the above files (status/data serialisation blocks).
  - `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.unit.test.ts:23` flagged by `@typescript-eslint/no-unsafe-argument` because we pass `execution.status` (typed as `never` today) into `validateCurriculumResponse`.
- ❌ `pnpm test`
  - `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.unit.test.ts:69` and `src/mcp/universal-tools.unit.test.ts:185` now demand `{status,data}` results; current executor returns raw JSON.
  - `apps/oak-curriculum-mcp-stdio/src/tools/index.unit.test.ts` and `src/tools/index.integration.test.ts` fail because the MCP adapter still unwraps the SDK payload.
  - `apps/oak-curriculum-mcp-streamable-http/src/index.unit.test.ts:84` plus the associated e2e helpers assert that SSE responses serialise the status metadata.
- ❌ `pnpm test:e2e`
  - `apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts:117` confirms the current transcript 404 flow still surfaces as an MCP error instead of a successful multi-status envelope.

## Phase 3: Fix Product Code (TDD Cycle)

Only after Phase 2 approval, fix product code in this order:

### Phase 3 Progress — 28 October 2025 12:25 GMT

- ✅ Steps 3.1–3.8 are complete: stdio and streamable HTTP now propagate the schema-derived `{status, data}` envelope without widening, the SDK executors/stubs preserve literal status unions, and Accept enforcement tolerates authenticated 406s while still failing unauthorised 401s.
- ✅ Repo-wide quality gates (type-check, lint, test, test:e2e, test:ui) together with `pnpm smoke:dev:stub` and `pnpm smoke:dev:live` ran green on 28 October 2025 12:14 GMT; logs captured in the shared analysis artefacts.
- ✅ Plan and `context.md` refreshed with post-Phase 3 notes (28 October 2025 12:25 GMT).
- 🔁 Next: prepare documentation addenda (if any remaining) and assemble the commit bundle for stakeholder review.

### 3.1 Generate Zod Schemas for ALL Documented Response Statuses

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`

**Goal**: Make tests in 1.2 pass

**Approach**:

- Modify Zod generation to create schemas for ALL documented responses (any status)
- Include inline response schemas, not just component references
- Generate consistent naming for inline schemas based on operationId + status

**Verification**: Run tests from 1.2, confirm they pass

### 3.2 Wire ALL Zod Schemas into Response Map

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/response-map/`

**Goal**: Make tests in 1.3 pass

**Approach**:

- Response map generation includes ALL documented statuses
- Every status gets a descriptor with valid Zod schema
- No special cases or status-specific logic

**Verification**: Run tests from 1.3, confirm they pass

### 3.3 Make Tool Descriptor Validation Generic

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`

**Goal**: Make tests in 1.4 pass

**Approach**:

- `validateOutput` iterates ALL documented statuses (already does this)
- Ensure it works when schemas actually exist
- Return status information with validation result

**Verification**: Run tests from 1.4, confirm they pass

### 3.4 Make Tool Invoke Status-Aware

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`

**Goal**: Make tests in 1.5 pass

**Approach**:

- `invoke` extracts payload based on actual status (not hardcoded 200 vs 4xx logic)
- Use response.data for 2xx, response.error for 4xx/5xx
- Return payload with status information

**Verification**: Run tests from 1.5, confirm they pass

### 3.5 Update Execute Tool Call

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/runtime/execute.ts`

**Goal**: Make tests in 1.6 pass

**Approach**:

- Pass actual status to validation
- Treat all documented statuses as valid results
- Only fail on validation errors (data doesn't match any documented status)

**Verification**: Run tests from 1.6, confirm they pass

### 3.6 Remove Status Hardcoding from MCP Server

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

**Goal**: Make tests in 1.7 pass

**Approach**:

- Remove hardcoded `200` from `validateCurriculumResponse` call
- Extract actual status from tool execution result
- Pass status to validation function
- Treat all successful validations as valid responses (regardless of status)

**Verification**: Run tests from 1.7, confirm they pass

### 3.7 Include Status in Response Metadata

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/tool-response-handlers.ts`

**Goal**: Make tests in 1.8 pass

**Approach**:

- Include HTTP status in MCP response content
- Maintain consistent response structure
- Set isError flag based on validation success, not status code

**Verification**: Run tests from 1.8, confirm they pass

### 3.8 Verify E2E

**Goal**: Make tests in 1.9 pass

**Verification**: Run E2E tests, confirm complete flow works for all statuses

## Phase 4: Quality Gates

Run complete quality gate sequence:

```bash
pnpm i
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm -F @oaknational/oak-curriculum-sdk docs:all
pnpm format
pnpm markdownlint
pnpm test
```

**Expected Result**: All gates pass, zero regressions

## Phase 5: Documentation

Update documentation:

1. Document generic multi-status handling in SDK README
2. Add examples of 200, 404, and other status responses
3. Update MCP server documentation with status handling patterns
4. Document how new status codes are automatically supported via schema
5. Update architectural notes about schema-driven response handling

## Benefits of Generic Approach

- **Future-proof**: Any new status in schema automatically supported
- **Schema-first**: Truly driven by schema, not code assumptions
- **Simpler**: No special cases, one consistent path
- **Cardinal Rule compliant**: `pnpm type-gen` handles all schema changes
- **Maintainable**: Less code, clearer intent

## Non-Goals

- Backwards compatibility (none required per rules)
- Changing upstream OpenAPI schema (temporary SDK enhancement for 404 only)
- Custom error recovery logic (fail fast is preferred)
- Status code interpretation or routing (just validation and typing)

## Dependencies

- No external dependencies
- Blocks: Any work that depends on non-200 response handling
- Blocked by: None

## Risks and Mitigations

**Risk**: Tests may reveal additional gaps beyond current analysis  
**Mitigation**: Phase 2 approval gate prevents premature fixes

**Risk**: Zod generation approach may be complex  
**Mitigation**: Test-first approach will reveal simplest solution

**Risk**: Changes may affect other endpoints  
**Mitigation**: Generic solution applies uniformly, comprehensive test coverage

## Acceptance Criteria

- [x] All Phase 1 tests written and failing appropriately
- [ ] Phase 2 analysis document approved
- [x] All tests pass after Phase 3 fixes
- [ ] Zero test modifications during Phase 3 (tests were correct from start)
- [x] Quality gates pass
- [x] System handles 200, 404, and any other documented status generically
- [x] No hardcoded status values anywhere in runtime code
- [x] Adding new status to schema requires only `pnpm type-gen`

## Timeline Estimate

- Phase 1: 1.5-2 days (comprehensive test writing)
- Phase 2: 0.5 days (analysis and approval)
- Phase 3: 2-3 days (generic implementation guided by tests)
- Phase 4: 0.5 days (quality gates)
- Phase 5: 0.5 days (documentation)

**Total**: 5-6.5 days

## Troubleshooting: Avoiding Union Type Collapse

### The Problem

When dealing with branching schema possibilities (path → method → status code), a common anti-pattern is to create union types that collapse at compile time and require runtime resolution. This breaks the schema-first approach and leads to type assertions, `unknown` types, and runtime lookups that destroy type information.

**❌ Wrong Approach (Union Collapse):**

```typescript
// Anti-pattern: Union type that collapses
type AllPaths = '/lessons/{lesson}/transcript' | '/search/lessons' | /* ... */;
type AllMethods = 'get' | 'post' | 'put' | /* ... */;
type AllStatuses = 200 | 404 | 500 | /* ... */;

// This loses specificity - TypeScript can't track which method goes with which path
function getResponseType(path: AllPaths, method: AllMethods, status: AllStatuses): unknown {
  // Runtime lookup required, type information lost
  return lookupInMap(path, method, status); // returns unknown
}
```

### The Solution: Literal Constants with Derived Types

The correct pattern is to create **literal constants** with `as const`, then derive ALL types and type guards from those constants. Never resolve branching at runtime.

**✅ Correct Approach (Literal Constants):**

#### Step 1: Create Literal Constant

```typescript
export const PATH_OPERATIONS = [
  {
    path: '/lessons/{lesson}/transcript',
    method: 'get',
    operationId: 'getLessonTranscript-getLessonTranscript',
    responses: {
      '200': {
        /* ... */
      },
      '404': {
        /* ... */
      },
    },
  },
  // ... more operations
] as const;
```

#### Step 2: Derive Types from Constant

```typescript
// Type derived from the literal constant
export type PathOperation = (typeof PATH_OPERATIONS)[number];

// Map derived from the literal constant
export const OPERATIONS_BY_ID = {
  'getLessonTranscript-getLessonTranscript': PATH_OPERATIONS[0],
  // ... more entries
} as const;

export type OperationId = keyof typeof OPERATIONS_BY_ID;
```

#### Step 3: Type Guards Reference the Constant

```typescript
// Type guard uses the constant directly
export function isOperationId(value: string): value is OperationId {
  return value in OPERATIONS_BY_ID;
}

// For array-based constants
export const VALID_RESPONSE_CODES = ['200', '404'] as const;
export type ValidResponseCode = (typeof VALID_RESPONSE_CODES)[number];

export function isValidResponseCode(value: string): value is ValidResponseCode {
  const stringCodes: readonly string[] = VALID_RESPONSE_CODES;
  return stringCodes.includes(value);
}
```

### Real Examples from This Codebase

#### Example 1: PATH_OPERATIONS Pattern

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/operations/operation-generators.ts`

```typescript
// Generator creates literal constant
export function generatePathOperationsConstant(operations: ExtractedOperation[]): string {
  const operationsJson = JSON.stringify(operations, null, 2);

  return `
export const PATH_OPERATIONS = ${operationsJson} as const;
export type PathOperation = (typeof PATH_OPERATIONS)[number];
`;
}
```

**Result**: `PATH_OPERATIONS[0]` has a specific literal type with exact path, method, and response structure. No union collapse.

#### Example 2: Parameter Constants Pattern

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/parameters/parameter-generators.ts`

```typescript
// Generates literal constant for each parameter type
export const KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
export type KeyStages = typeof KEY_STAGES;
export type KeyStage = KeyStages[number]; // "ks1" | "ks2" | "ks3" | "ks4"

export function isKeyStage(value: string): value is KeyStage {
  const keyStages: readonly string[] = KEY_STAGES;
  return keyStages.includes(value);
}
```

**Result**: `KeyStage` is a precise string literal union, not widened to `string`.

#### Example 3: Response Code Pattern

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/operations/operation-generators.ts`

```typescript
// Collects all used response codes from schema
const validResponseCodes = Array.from(
  new Set(operationsWithId.flatMap((op) => Object.keys(op.responses ?? {}))),
);

// Generates literal constant
export const VALID_RESPONSE_CODES = ['200', '404'] as const;
export type ValidResponseCode = (typeof VALID_RESPONSE_CODES)[number];

export function isValidResponseCode(value: string): value is ValidResponseCode {
  const stringCodes: readonly string[] = VALID_RESPONSE_CODES;
  return stringCodes.includes(value);
}
```

**Result**: Only response codes actually used in the schema are valid. Type-safe.

### Key Rules for This Plan

When implementing multi-status handling:

1. **Generate Literal Constants**: Create `as const` arrays/objects for all response statuses per operation
2. **Derive All Types**: Use `typeof` and indexed access, never hand-write union types
3. **Type Guards Reference Constants**: Guards must check against the literal constant, not a copied list
4. **No Runtime Branching**: Don't create functions that take status as parameter and return different types
5. **Lookup via Constants**: Use `PATH_OPERATIONS.find()` or `OPERATIONS_BY_ID[key]`, not runtime maps

### Anti-Patterns to Avoid

❌ **Don't**: Create separate union types

```typescript
type Status = 200 | 404; // Hand-written, will go out of sync
```

✅ **Do**: Derive from constant

```typescript
export const STATUSES = [200, 404] as const;
type Status = (typeof STATUSES)[number];
```

❌ **Don't**: Use runtime maps without type derivation

```typescript
const statusMap: Record<string, unknown> = {
  /* ... */
}; // unknown!
```

✅ **Do**: Create literal constant, derive types

```typescript
const STATUS_MAP = {
  /* ... */
} as const;
type StatusKey = keyof typeof STATUS_MAP;
```

❌ **Don't**: Resolve branching at runtime

```typescript
function getSchema(path: string, method: string, status: number): unknown {
  return lookupSchema(path, method, status); // loses types!
}
```

✅ **Do**: Preserve compile-time type information

```typescript
const operation = PATH_OPERATIONS.find((op) => op.path === path && op.method === method);
const statusKey = String(status) as ValidResponseCode;
const schema = RESPONSE_SCHEMAS[`${operation.operationId}:${statusKey}`];
// schema has specific type based on constant lookups
```

### Verification Checklist

When implementing, verify:

- [ ] All branching handled via literal constants (`as const`)
- [ ] All types derived from `typeof` those constants
- [ ] Zero hand-written union types for schema-derived data
- [ ] Type guards reference the constant as `readonly T[]`
- [ ] No functions that return `unknown` due to branching
- [ ] No runtime type resolution (all type info at compile time)
- [ ] `pnpm type-check` passes with full type safety

## Review Checklist

- [ ] All tests follow behavior-not-implementation principle
- [ ] No complex mocks (only simple fakes as arguments)
- [ ] Tests named correctly (_.unit.test.ts or_.integration.test.ts)
- [ ] All generators follow schema-first-execution directive
- [ ] No type shortcuts or workarounds
- [ ] No status code hardcoding or special cases
- [ ] Fail-fast error handling throughout
- [ ] TSDoc comments on all new/modified code
- [ ] Aligns with TDD red-green-refactor cycle
- [ ] Aligns with Cardinal Rule (schema changes → type-gen → done)
- [ ] **Literal constant pattern used throughout** (see troubleshooting section)

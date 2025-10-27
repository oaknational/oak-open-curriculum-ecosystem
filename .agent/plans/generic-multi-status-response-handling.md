# Plan: Generic Multi-Status Response Handling

**Status**: Draft  
**Created**: 2025-10-27  
**Workspace**: `packages/sdks/oak-curriculum-sdk` (SDK), `apps/oak-curriculum-mcp-stdio` (MCP Server)

## Objective

Establish complete test coverage proving generic multi-status response handling, then implement a schema-driven system where ANY response status code documented in the OpenAPI schema is treated as a valid, typed response. Remove all hardcoded status assumptions.

## Guiding Principles

- **TDD First**: Write ALL tests BEFORE modifying ANY product code
- **Behavior Over Implementation**: Tests prove WHAT works, not HOW it works
- **Schema-First**: ALL status codes flow from schema at type-gen time
- **Generic Solution**: No special cases for 404, 200, or any other status
- **Fail Fast**: Undocumented statuses fail immediately with clear errors
- **No Complex Mocks**: Simple fakes passed as function arguments only

## Success Criteria

1. ✅ System validates responses against schema for their actual status code
2. ✅ All documented status codes (200, 404, 500, etc.) treated as valid responses
3. ✅ Only undocumented status codes cause validation errors
4. ✅ Status code information flows from schema → SDK → MCP server → user
5. ✅ Zero hardcoded status assumptions anywhere in the codebase

## Phase 1: Test Coverage for Expected Behavior

> **Cardinal Rule**: NO PRODUCT CODE CHANGES during this phase. Tests prove the behavior we WANT, not the behavior we HAVE.

### 1.1 SDK: Schema Enhancement Unit Tests

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.unit.test.ts`

**Behaviour to Prove**:

- [ ] `add404ResponsesWhereExpected` adds ANY documented error response to endpoints
- [ ] Added responses contain proper schema definitions
- [ ] Function is generic (not specific to 404)
- [ ] Function fails fast if response already exists in upstream schema
- [ ] Function fails fast if configured endpoint doesn't exist

**Test Type**: Unit (pure function, no IO, no mocks)

**Note**: These tests likely pass, but we'll verify the function is truly generic

### 1.2 SDK: Zod Schema Generation Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.integration.test.ts`

**Behaviour to Prove**:

- [ ] Generated Zod schemas include schemas for ALL documented response statuses
- [ ] Schemas generated for inline response definitions (not just components)
- [ ] Schema names follow consistent convention for any status code
- [ ] Generated schemas accessible via `curriculumSchemas.{operationId}_{status}`
- [ ] Works for 200, 404, 500, or any other documented status

**Test Type**: Integration (multiple units, mock filesystem as argument)

**Expected Initial State**: Tests WILL FAIL (inline schemas not generated)

### 1.3 SDK: Response Map Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/response-map/build-response-map.integration.test.ts`

**Behaviour to Prove**:

- [ ] Response map includes entries for ALL documented status codes per operation
- [ ] Each entry includes valid Zod schema (never undefined)
- [ ] `getResponseDescriptorsByOperationId` returns ALL status descriptors
- [ ] `getResponseSchemaByOperationIdAndStatus` works for any documented status
- [ ] Function fails fast for undocumented status codes (as intended)

**Test Type**: Integration (multiple units, no IO)

**Expected Initial State**: Partial fail (map exists but schemas undefined)

### 1.4 SDK: Tool Descriptor Generic Validation Unit Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor-validation.unit.test.ts`

**Behaviour to Prove**:

- [ ] `validateOutput` tries ALL documented statuses from schema (not just 200)
- [ ] Returns `{ok: true, data, status: N}` for valid response matching status N
- [ ] Returns `{ok: false, message, issues}` only when data matches NO documented status
- [ ] Does not assume or prefer any particular status code
- [ ] Includes attempted statuses in failure message

**Test Type**: Unit (pure function testing validation logic)

**Expected Initial State**: Tests WILL FAIL (may crash on undefined schemas)

### 1.5 SDK: Tool Descriptor Invoke Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-lessons-transcript.integration.test.ts`

**Behaviour to Prove**:

- [ ] `invoke` returns appropriate data for ANY documented response status
- [ ] Response payload extracted from correct location (response.data vs response.error)
- [ ] Returned data shape matches schema for that status code
- [ ] No hardcoded status handling (works generically)

**Test Type**: Integration (mock API client passed as argument)

**Expected Initial State**: Partial pass (200 works, others may fail)

### 1.6 SDK: Execute Tool Call Integration Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/runtime/execute.integration.test.ts`

**Behaviour to Prove**:

- [ ] `executeToolCall` validates output against actual response status
- [ ] Output validation succeeds for ANY documented status code
- [ ] Validation fails for undocumented status codes
- [ ] Error messages indicate which statuses are documented

**Test Type**: Integration (mock client, multiple units working together)

**Expected Initial State**: Tests WILL FAIL (validation not status-aware)

### 1.7 SDK: execute-tool-call Result Envelope Unit Tests

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.unit.test.ts`

**Behaviour to Prove**:

- [ ] `executeToolCall` returns a structured success result that preserves `{ data, status }` from the underlying descriptor
- [ ] Legitimate non-200 responses (e.g. 404 transcript) surface as successes rather than errors
- [ ] Error results include the original attempted statuses and validation issues for observability
- [ ] Backwards compatibility: existing `UNKNOWN_TOOL`, parameter, and execution error branches remain unchanged

**Test Type**: Unit (pure fakes for the generated descriptor; no network)

**Expected Initial State**: Tests WILL FAIL (current executor drops status metadata)

### 1.8 MCP Server: Generic Response Validation Integration Tests

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.integration.test.ts`

**Behaviour to Prove**:

- [ ] `validateOutput` accepts actual status from tool execution result
- [ ] Validates data against schema for that specific status
- [ ] Does not hardcode status 200 or any other status
- [ ] Tool handler treats ALL documented statuses as valid responses
- [ ] Only undocumented statuses trigger error state

**Test Type**: Integration (mock tool descriptors passed as arguments)

**Expected Initial State**: Tests WILL FAIL (hardcoded to status 200)

### 1.9 MCP Tools Module: Transcript 404 User Experience Tests

**Location**: `apps/oak-curriculum-mcp-stdio/src/tools/index.integration.test.ts`

**Behaviour to Prove**:

- [ ] `createMcpToolsModule().handleTool` treats legitimate 404 transcript responses as successful tool calls
- [ ] Successful responses include surfaced status metadata/message derived from the SDK, not raw error serialisations
- [ ] Error flows (unknown tool, genuine validation failure) still emit `isError: true` payloads with helpful text
- [ ] Bridge honours the richer executor result shape without JSON parse regressions

**Test Type**: Integration (exercise the universal executor with a fake SDK client result)

**Expected Initial State**: Tests WILL FAIL (404 currently rejected as error output)

### 1.10 MCP Server: Response Status Metadata Integration Tests

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/tool-response-handlers.integration.test.ts`

**Behaviour to Prove**:

- [ ] Handler includes actual status code in response
- [ ] Response structure consistent regardless of status code
- [ ] Client can determine response status from response content
- [ ] isError flag false for all documented statuses
- [ ] isError flag true only for validation failures

**Test Type**: Integration (mock handlers as arguments)

**Expected Initial State**: Tests WILL FAIL (status not included)

### 1.11 E2E: Multi-Status Flow Tests

**Location**: `apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts`

**Behaviour to Prove**:

- [ ] Can fetch transcript for lesson with video (200 response)
- [ ] Can fetch transcript for lesson without video (404 response)
- [ ] Both responses are not errors (isError: false)
- [ ] Response content includes status information
- [ ] User experience clear for each status type

**Test Type**: E2E (real MCP protocol, may trigger real API calls)

**Expected Initial State**: Tests WILL FAIL (404 flow broken)

## Phase 2: Document Test Results

Before making ANY product code changes:

1. Run ALL tests from Phase 1
2. Document which tests pass and which fail
3. Analyze failure modes to understand exact gaps
4. Confirm test failures align with generic solution needs
5. Get approval that tests prove correct behavior

**Deliverable**: Test results document showing test status and failure analysis

## Phase 3: Fix Product Code (TDD Cycle)

Only after Phase 2 approval, fix product code in this order:

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

- [ ] All Phase 1 tests written and failing appropriately
- [ ] Phase 2 analysis document approved
- [ ] All tests pass after Phase 3 fixes
- [ ] Zero test modifications during Phase 3 (tests were correct from start)
- [ ] Quality gates pass
- [ ] System handles 200, 404, and any other documented status generically
- [ ] No hardcoded status values anywhere in runtime code
- [ ] Adding new status to schema requires only `pnpm type-gen`

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

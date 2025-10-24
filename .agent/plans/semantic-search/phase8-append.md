---

## Phase 8 – Generic Multi-Status Response Handler

### Mission

Eliminate hardcoded status code assumptions from the MCP tool generator, enabling it to handle ANY response codes documented in the OpenAPI schema. This ensures the SDK automatically adapts to upstream schema changes without requiring generator updates for each new status code.

### Problem Statement

**Discovery (24 October 2025):** While implementing Phase 7's 404 enhancement, we identified that the tool generator has fundamental limitations:

1. **Hardcoded 200 assumption in `emit-index.ts` (lines 55-56)**:

   ```typescript
   const response = await call(validation.data);
   return response.data; // ❌ Assumes success, ignores response.error
   ```

   The generated `invoke` function blindly returns `response.data` without checking the HTTP status or whether the response was successful.

2. **Hardcoded 200 lookup in `response-map.ts` (line 427)**:

   ```typescript
   const key = operationId + ':' + '200'; // ❌ Only looks up 200 response
   ```

   The `getDescriptorSchemaForEndpoint` function only retrieves the 200 response descriptor, even though `RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS` contains entries for all documented statuses.

3. **Single-schema validation in `emit-index.ts` (lines 71-82)**:
   The generated `validateOutput` function only validates against the 200 response schema, causing validation failures for any other documented status.

**Impact:**

- Phase 7's schema enhancement adds 404 to the schema, but generated tools still fail at runtime
- Adding future status codes (201, 204, 409, 422, etc.) would require generator changes
- Violates the Cardinal Rule: behavior should flow automatically from schema changes

**Example Failure:**

```text
Tool: get-lessons-transcript
Lesson: "making-apple-flapjack-bites"
API Response: HTTP 404 (documented in enhanced schema)
Runtime: Returns undefined/false, fails validation
Expected: Should return the 404 error payload as a valid result
```

### Investigation Summary

**Root Cause Analysis:**

1. **Generator Template Assumptions:**
   - `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`
   - `buildExports` function generates invoke logic that assumes all responses are 2xx
   - openapi-fetch returns `{ data, error, response }` where `data` is for 2xx, `error` is for others
   - Generated code ignores `response.response.status` and `response.error`

2. **Response Map Limitations:**
   - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/response-map.ts`
   - `RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS` contains ALL documented statuses
   - Helper functions only expose the 200 response
   - No function exists to retrieve all statuses for an operation

3. **Validation Logic:**
   - Generated `validateOutput` only tries one schema (the 200 response)
   - Should try all documented response schemas until one matches
   - Current approach makes documented non-200 responses impossible to handle

### Proposed Solution: Schema-Driven Multi-Status Handler

**Core Principle:** Generate code that dynamically matches actual HTTP status to documented schemas, without hardcoding ANY status codes (not even 200).

#### Design Overview

**1. Response Map Enhancement**

Add a new generator function in `build-response-map.ts`:

```typescript
/**
 * Generate a runtime function that returns ALL documented response descriptors
 * for a given operation. This enables invoke functions to validate against
 * ANY documented status without hardcoding assumptions.
 */
export function emitStatusDescriptorMap(entries: readonly ResponseMapEntry[]): string;
```

This function will be called during response-map generation to emit:

```typescript
export function getResponseDescriptorsByOperationId(
  operationId: OperationId,
): Record<number, { readonly zod: CurriculumSchemaDefinition; readonly json: unknown }>;
```

**2. Tool Generator Enhancement**

Update `emit-index.ts` `buildExports` to generate status-aware invoke logic:

```typescript
// NEW: Get ALL response descriptors for this operation
const responseDescriptors = getResponseDescriptorsByOperationId('${operationId}');
const documentedStatuses = Object.keys(responseDescriptors).map(Number);

// ... inside invoke function ...

const response = await call(validation.data);

// Generic status handling: match actual status against documented statuses
const actualStatus = response.response.status;
if (!documentedStatuses.includes(actualStatus)) {
  throw new TypeError(
    `Undocumented response status ${actualStatus} for ${operationId}. ` +
      `Documented statuses: ${documentedStatuses.join(', ')}. ` +
      `This suggests the upstream OpenAPI schema is out of sync with the API.`,
  );
}

// Return appropriate data (openapi-fetch uses .data for 2xx, .error for others)
const payload = actualStatus >= 200 && actualStatus < 300 ? response.data : response.error;
return payload;
```

**3. Multi-Schema Validation**

Update `validateOutput` generation to try all documented schemas:

```typescript
validateOutput: (data: unknown) => {
  const errors: Array<{ status: number; issues: unknown[] }> = [];

  for (const [statusStr, descriptor] of Object.entries(responseDescriptors)) {
    const result = descriptor.zod.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data, status: Number(statusStr) };
    }
    errors.push({
      status: Number(statusStr),
      issues: result.error.issues,
    });
  }

  return {
    ok: false,
    message: `Response does not match any documented schema for statuses: ${documentedStatuses.join(', ')}`,
    attemptedStatuses: errors,
  };
};
```

**4. Type System Updates**

For operations with multiple documented statuses, generate union types:

```typescript
// For get-lessons-transcript with 200 and 404:
type ToolResultForName<'get-lessons-transcript'> =
  | TranscriptResponse  // 200
  | NotFoundError       // 404
```

#### Implementation Strategy

**Status:** Pending implementation

**Prerequisites:**

- Phase 7 complete (provides test case with documented 404)
- All quality gates green

**Phases:**

1. **Response Map Generator Enhancement** (TDD)
   - Add unit tests for `emitStatusDescriptorMap`
   - Implement function in `build-response-map.ts`
   - Update response-map generation to emit `getResponseDescriptorsByOperationId`
   - Verify generated `response-map.ts` includes new function

2. **Tool Generator Update** (TDD)
   - Add unit tests for multi-status invoke generation
   - Update `emit-index.ts` `buildExports` to:
     - Accept `operationId` parameter
     - Generate status-checking logic
     - Generate multi-schema validation
   - Update callers to pass `operationId`

3. **ToolDescriptor Contract Update**
   - Update `ToolDescriptor` interface to include `responseDescriptors`
   - Update type aliases to generate unions for multi-status operations

4. **Integration Testing**
   - Verify `get-lessons-transcript` handles both 200 and 404
   - Test operations with only 200 (should still work)
   - Test operations with multiple success codes (201, 204, etc.)
   - Verify fail-fast on undocumented status

5. **Documentation**
   - Update generator documentation
   - Update schema-first execution directive
   - Document the flow from schema to runtime handling

### Reasoning and Trade-offs

#### Why This Approach?

**Alignment with Cardinal Rule:**

- ✅ ALL behavior flows from OpenAPI schema at compile-time
- ✅ Running `pnpm type-gen` after ANY schema change generates correct handling
- ✅ No runtime shims, no hardcoded assumptions, no special cases

**Future-Proof:**

- ✅ Works for ANY status codes (200, 201, 204, 400, 404, 409, 422, etc.)
- ✅ Upstream adds new status → `pnpm type-gen` → automatic support
- ✅ No generator updates needed for new status codes

**Type-Safe:**

- ✅ TypeScript knows result type is union of all possible responses
- ✅ Consumers can discriminate by status or error fields
- ✅ Validation matches actual runtime possibilities

**Fail-Fast:**

- ✅ Undocumented statuses throw with actionable error message
- ✅ Points to schema/API mismatch, not tool bug
- ✅ Encourages proper upstream documentation

#### Alternatives Considered

**Alternative 1: Hardcode 404 Handling**

```typescript
// In emit-index.ts
if (has404(operation)) {
  // Generate special 404 logic
} else {
  // Generate 200-only logic
}
```

**Rejected because:**

- ❌ Violates "no assumptions" requirement
- ❌ Requires generator updates for each new status code
- ❌ Doesn't scale to 201, 204, 409, 422, etc.
- ❌ Makes Phase 7's schema enhancement insufficient

**Alternative 2: Runtime Status Registry**

Create a runtime registry that maps statuses to validators:

```typescript
// In runtime code (not generated)
const statusHandlers = {
  200: validate200,
  404: validate404,
  // ...
};
```

**Rejected because:**

- ❌ Violates schema-first execution directive
- ❌ Duplicates type information outside generator
- ❌ Runtime complexity increases
- ❌ Cannot leverage TypeScript's compile-time guarantees

**Alternative 3: Make Phase 7 Enhancement Sufficient**

Accept that Phase 7's schema enhancement is enough, don't change generators.

**Rejected because:**

- ❌ Phase 7 adds 404 to schema but tools still fail at runtime
- ❌ Doesn't actually fix the problem we set out to solve
- ❌ Future status codes require both schema enhancement AND generator changes
- ❌ Violates Cardinal Rule (schema changes should be sufficient)

### Success Criteria

When Phase 8 is complete:

1. ✅ Tool generator makes ZERO assumptions about status codes
2. ✅ Generated tools handle ANY documented status automatically
3. ✅ Validation tries all documented response schemas
4. ✅ Undocumented statuses fail with helpful error messages
5. ✅ `get-lessons-transcript` works for both 200 and 404 responses
6. ✅ Type system reflects union of all possible responses
7. ✅ Full test coverage (unit tests for generator, integration tests for runtime)
8. ✅ All quality gates remain green
9. ✅ Documentation explains the generic approach

### Validation Plan

```bash
# 1. Generator tests
pnpm --filter @oaknational/oak-curriculum-sdk test -- mcp-tool-generator

# 2. Regenerate with new logic
pnpm --filter @oaknational/oak-curriculum-sdk type-gen

# 3. SDK tests with generated code
pnpm --filter @oaknational/oak-curriculum-sdk test

# 4. Integration: transcript tool with 200 and 404
# Should handle both: lessons with transcripts (200) and without (404)
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live

# 5. Remote verification
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote \
  --remote-base-url https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp

# 6. Full quality gates
pnpm make
pnpm qg
```

### Dependencies

- **Blocked by:** Phase 7 completion (provides test case with documented 404)
- **Blocks:** Any future endpoints with non-200 responses
- **Related:** `.agent/directives-and-memory/schema-first-execution.md` (must comply with schema-first mandate)


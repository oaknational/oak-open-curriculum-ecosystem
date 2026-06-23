# P0: E2E Test Type Safety and Workspace Boundary Fix

**Status**: PLANNED  
**Created**: 2025-11-18  
**Priority**: P0 (blocking completion of flat schema fix)  
**Duration**: 1-2 days  
**Prerequisite**: P0 flat schema generator fix (complete)

## Purpose

Fix type safety violations and workspace boundary violations in E2E tests discovered during P0 flat schema implementation, ensuring full compliance with @principles.md, @schema-first-execution.md, and @testing-strategy.md.

## Context

During implementation of P0 (flat schema generator fix), we discovered that E2E test fixes introduced violations of core architectural principles:

1. **Type Safety Violations**: E2E tests use prohibited `Record<string, unknown>` instead of generated types
2. **Workspace Boundary Violations**: E2E tests in streamable-http app are testing SDK functionality
3. **Integration Test Failures**: Unit tests expect nested args, but aggregated tools now pass flat args

## Related Documents

- `.agent/directives/principles.md` - Type safety requirements, workspace boundaries
- `.agent/directives/schema-first-execution.md` - Schema-first architecture
- `.agent/directives/testing-strategy.md` - Test type definitions and boundaries
- `.agent/plans/p0-mcp-flat-schema-generator-fix.md` - Completed P0 work

## Problem Statement

### Issue 1: Type Safety Violations in E2E Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/sdk-client-stub.e2e.test.ts`

**Violations**:

```typescript
// Line 22 - PROHIBITED per @principles.md
type ToolArguments = Record<string, unknown>;

// Line 35 - PROHIBITED
readonly sequenceSlugs?: readonly Record<string, unknown>[];

// Lines 41, 48 - PROHIBITED
readonly [key: string]: unknown;
```

**@principles.md states**:

> "Never use `as`, `any`, `!`, or `Record<string, unknown>`, or `{ [key: string]: unknown }` - they ALL disable the type system."

**Root Cause**: Tests define ad-hoc types instead of importing generated SDK types.

### Issue 2: Workspace Boundary Violations

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/sdk-client-stub.e2e.test.ts`

**Violation**:

```typescript
// Line 58 - Importing SDK code into HTTP app E2E tests
const stubExecutor = createStubToolExecutionAdapter();

// Line 60 - Testing SDK functionality in HTTP app
async function executeStubTool(name: ToolName, args: ToolArguments): Promise<unknown> {
  const result = await stubExecutor(name, args);  // ❌ Testing SDK internals
  ...
}
```

**@principles.md states**:

> "Each workspace unit tests its own code ONLY"

**@testing-strategy.md states**:

> "E2E test: A test that verifies the behaviour of a running system."

**Root Cause**: E2E tests are mixing SDK integration testing with HTTP server testing.

### Issue 3: Unit Test Failures

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/index.unit.test.ts`

**Issue**: Tests expect nested argument structure but aggregated tools now pass flat arguments.

## Target State

### Type Safety

```typescript
// ✅ Import generated types from SDK
import type { ToolArgsForName, ToolResultForName, ToolName } from '@oaknational/oak-curriculum-sdk';

// ✅ Use specific types for each tool
type GetSubjectDetailArgs = ToolArgsForName<'get-subject-detail'>;
type GetSubjectDetailResult = ToolResultForName<'get-subject-detail'>;

// ✅ Generic helper with type parameter
function callTool<T extends ToolName>(
  app: Express,
  name: T,
  args: ToolArgsForName<T>,
): Promise<{ result?: JsonRpcResult; envelope: JsonRpcEnvelope; text: string }> {
  // ...
}
```

### Workspace Boundaries

```typescript
// ✅ E2E tests only test HTTP server via HTTP requests
async function callTool(
  app: Express,
  name: string,
  args: unknown, // Validated by server, not our concern in E2E
): Promise<{ result?: JsonRpcResult }> {
  const response = await request(app)
    .post('/mcp')
    .send({
      jsonrpc: '2.0',
      id: `test-${name}`,
      method: 'tools/call',
      params: { name, arguments: args },
    });
  return parseResponse(response);
}

// ❌ REMOVE: No SDK imports in E2E tests
// const stubExecutor = createStubToolExecutionAdapter();
```

## Implementation Plan

### Session 1: Fix Type Safety Violations in E2E Tests

**Duration**: 2-3 hours

#### Step 1.1: Remove Prohibited Types (RED)

**Task**: Replace all `Record<string, unknown>` and index signatures with specific types

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/sdk-client-stub.e2e.test.ts`

**Changes**:

```typescript
// BEFORE
type ToolArguments = Record<string, unknown>;

interface SubjectSummary {
  readonly subjectSlug: string;
  readonly subjectTitle: string;
  readonly canonicalUrl?: string;
  readonly sequenceSlugs?: readonly Record<string, unknown>[]; // ❌
}

// AFTER
import type { ToolArgsForName, ToolResultForName } from '@oaknational/oak-curriculum-sdk';

// Use generated types - no ad-hoc definitions
type SubjectSummary = ToolResultForName<'get-subject-detail'>;
type GetKeyStagesResult = ToolResultForName<'get-key-stages'>;
```

**Validation**:

```bash
pnpm type-check
# Expected: Type errors initially (RED phase)
```

#### Step 1.2: Update Function Signatures (GREEN)

**Task**: Update all function signatures to use generated types

**Changes**:

```typescript
// BEFORE
async function callTool(
  app: Express,
  name: string,
  args: ToolArguments  // ❌ Prohibited type
): Promise<...>

// AFTER
async function callTool<T extends ToolName>(
  app: Express,
  name: T,
  args: ToolArgsForName<T>
): Promise<...>
```

**Validation**:

```bash
pnpm type-check
# Expected: All type errors resolved
pnpm lint
# Expected: No linting errors
```

#### Step 1.3: Run Quality Gates

```bash
pnpm type-gen  # Ensure types are up to date
pnpm build     # Build all packages
pnpm test      # Unit tests should pass
pnpm test:e2e  # E2E tests should pass
```

**Acceptance Criteria**:

- ✅ No `Record<string, unknown>` in E2E tests
- ✅ No index signatures (`[key: string]: unknown`)
- ✅ All types imported from SDK
- ✅ Type-check passes
- ✅ Lint passes
- ✅ Tests pass

---

### Session 2: Fix Workspace Boundary Violations

**Duration**: 2-3 hours

#### Step 2.1: Remove SDK Testing from E2E Tests (RED)

**Task**: Remove all SDK imports and function calls from E2E tests

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/sdk-client-stub.e2e.test.ts`

**Changes**:

```typescript
// REMOVE these lines:
import { createStubToolExecutionAdapter } from '@oaknational/oak-curriculum-sdk';
const stubExecutor = createStubToolExecutionAdapter();

// REMOVE this function:
async function executeStubTool(name: ToolName, args: ToolArguments): Promise<unknown> {
  const result = await stubExecutor(name, args); // ❌ SDK testing
  if (!('data' in result)) {
    throw new Error(`Stub executor returned error for ${name}`);
  }
  return result.data;
}
```

**Impact Analysis**:

- Tests currently use `executeStubTool` to get expected data
- Tests compare `executeStubTool` results with HTTP server results
- Need alternative approach for expected data

**Validation**:

```bash
pnpm test:e2e
# Expected: Tests fail (RED phase) - expected data missing
```

#### Step 2.2: Use Fixtures or Direct HTTP Calls (GREEN)

**Task**: Replace SDK calls with HTTP-only approach

**Option A: Use test fixtures** (recommended):

```typescript
// Create fixture file
// apps/oak-curriculum-mcp-streamable-http/e2e-tests/fixtures/stub-responses.ts

export const STUB_FIXTURES = {
  'get-key-stages': {
    args: {},
    expected: [
      { slug: 'ks1', title: 'Key Stage 1', canonicalUrl: expect.stringContaining('ks1') },
      // ... more fixtures
    ],
  },
  'get-subject-detail': {
    args: { subject: 'maths' },
    expected: {
      subjectSlug: 'maths',
      subjectTitle: 'Mathematics',
      // ... more fields
    },
  },
} as const;
```

**Option B: Self-contained E2E** (alternative):

```typescript
// E2E tests only verify HTTP contract, not exact data
it('returns subject detail for a known slug', async () => {
  const { result } = await callTool(app, 'get-subject-detail', {
    subject: 'maths',
  });

  expect(result).toBeDefined();
  const payload = expectSuccessfulPayload(result);

  // Validate structure, not exact values
  expect(payload).toHaveProperty('subjectSlug', 'maths');
  expect(payload).toHaveProperty('subjectTitle');
  expect(payload.canonicalUrl).toMatch(/\/subjects\/maths/);
});
```

**Validation**:

```bash
pnpm test:e2e
# Expected: Tests pass (GREEN phase)
```

#### Step 2.3: Run Quality Gates

```bash
pnpm type-gen
pnpm build
pnpm type-check  # No SDK imports in HTTP app E2E tests
pnpm lint
pnpm test        # SDK has its own tests
pnpm test:e2e    # HTTP app tests only HTTP server
```

**Acceptance Criteria**:

- ✅ No SDK imports in `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`
- ✅ E2E tests only make HTTP requests
- ✅ E2E tests validate HTTP contract (structure, status codes)
- ✅ SDK functionality tested in SDK workspace
- ✅ All quality gates pass

---

### Session 3: Fix Unit Test Argument Expectations

**Duration**: 1-2 hours

#### Step 3.1: Update SDK Unit Tests (RED)

**Task**: Update tests to expect flat arguments from aggregated tools

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts` (ALREADY DONE)

**Verification**:

```bash
cd packages/sdks/oak-curriculum-sdk
pnpm test src/mcp/universal-tools.unit.test.ts
# Expected: Tests pass (already fixed in previous work)
```

#### Step 3.2: Update HTTP App Unit Tests (RED → GREEN)

**Task**: Ensure HTTP app unit tests use flat arguments

**Files to verify**:

- `apps/oak-curriculum-mcp-streamable-http/src/index.unit.test.ts` (ALREADY DONE)

**Verification**:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm test src/index.unit.test.ts
# Expected: Tests pass (already fixed in previous work)
```

#### Step 3.3: Run Full Quality Gates

```bash
cd ai_experiments/oak-notion-mcp
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
```

**Acceptance Criteria**:

- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ All E2E tests pass
- ✅ All quality gates pass

---

## Validation Criteria

### Primary Criteria

| Check           | Command           | Expected Result            |
| --------------- | ----------------- | -------------------------- |
| Type Generation | `pnpm type-gen`   | Exit 0, no errors          |
| Build           | `pnpm build`      | Exit 0, all packages build |
| Type Check      | `pnpm type-check` | Exit 0, no type errors     |
| Lint            | `pnpm lint`       | Exit 0, no violations      |
| Unit Tests      | `pnpm test`       | All tests pass             |
| E2E Tests       | `pnpm test:e2e`   | All tests pass             |

### Code Quality Criteria

- ✅ No `Record<string, unknown>` in E2E tests
- ✅ No index signatures (`[key: string]: unknown`) in E2E tests
- ✅ All types imported from SDK (no ad-hoc definitions)
- ✅ No SDK imports in `apps/*/e2e-tests/` directories
- ✅ E2E tests only make HTTP requests to running servers
- ✅ Each workspace tests only its own code

### Architectural Alignment

| Directive                  | Requirement                      | Status             |
| -------------------------- | -------------------------------- | ------------------ |
| @principles.md                  | No `Record<string, unknown>`     | ✅ After Session 1 |
| @principles.md                  | Each workspace tests own code    | ✅ After Session 2 |
| @schema-first-execution.md | Types from generated artifacts   | ✅ After Session 1 |
| @testing-strategy.md       | E2E tests verify running systems | ✅ After Session 2 |

## Risks and Mitigation

### Risk 1: E2E Tests Break After Removing SDK Calls

**Likelihood**: High  
**Impact**: Medium

**Mitigation**:

- Use Option A (fixtures) for predictable, maintainable tests
- Alternative: Option B (structural validation only) if fixtures too brittle
- SDK has comprehensive unit tests - E2E tests should focus on HTTP contract

### Risk 2: Generated Types Don't Match E2E Test Needs

**Likelihood**: Low  
**Impact**: Medium

**Mitigation**:

- Generated types are source of truth
- If types don't match, it indicates SDK or API schema issue
- Fix the source, not the test

### Risk 3: Type Changes Cascade to Other Tests

**Likelihood**: Medium  
**Impact**: Low

**Mitigation**:

- Run full quality gates after each session
- Fix issues incrementally
- Each session is independently testable

## Success Metrics

### Quantitative

- **0** uses of `Record<string, unknown>` in E2E tests
- **0** uses of index signatures in E2E tests
- **0** SDK imports in HTTP app E2E tests
- **100%** test pass rate after all sessions
- **0** type errors
- **0** lint errors

### Qualitative

- E2E tests clearly validate HTTP server behavior only
- Types imported from generated SDK artifacts
- Clear separation of concerns (workspace boundaries respected)
- Tests maintainable and aligned with architectural principles

## Post-Implementation

### Documentation Updates

- ✅ Update `.agent/directives/testing-strategy.md` with examples of correct E2E test patterns
- ✅ Add section on workspace boundaries in testing
- ✅ Document fixture pattern for E2E tests

### Follow-Up Work

1. **Aggregated Tools Type-Gen Refactor** - Phase 0 of comprehensive MCP enhancement plan
2. **Curriculum Ontology Resource** - Once aggregated tools are schema-first
3. **Contract Testing** - Validate that schema evolution maintains compatibility

## Notes

- This plan addresses immediate P0 blocking issues
- Aggregated tools architectural debt is separate (planned in Phase 0 of MCP enhancements)
- All changes maintain TDD approach (RED → GREEN → REFACTOR)
- Each session is independently testable with clear acceptance criteria

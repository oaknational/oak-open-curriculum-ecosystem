# Context Grounding Optimization Plan

> **Goal**: Ensure AI agents understand they should call `get-ontology` and `get-help` to properly use Oak curriculum tools.

**Status**: Draft  
**Created**: December 2025  
**Related Documents**:

- [`.agent/research/openai-apps-sdk-data-return-optimization.md`](../../research/openai-apps-sdk-data-return-optimization.md)
- [`.agent/reference-docs/openai-apps/openai-apps-sdk-reference.md`](../../reference-docs/openai-apps/openai-apps-sdk-reference.md)
- [`.agent/directives/schema-first-execution.md`](../../directives/schema-first-execution.md)

---

## Foundation Documents

Before each phase of work, re-read and re-commit to:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

---

## 1. Problem Statement

### Current State

AI agents using the Oak MCP server often jump straight into calling curriculum tools without first understanding the domain model. This leads to:

- Incorrect parameter formats (e.g., wrong ID patterns)
- Misunderstanding of entity hierarchy (subject → unit → lesson)
- Suboptimal tool selection
- Repeated trial-and-error interactions

### Root Cause Analysis

Context guidance exists but is placed where the **model cannot see it**:

| Mechanism                        | Model Visibility  | Current State                     |
| -------------------------------- | ----------------- | --------------------------------- |
| Tool descriptions                | ✅ Sees           | Has prerequisite guidance ✓       |
| `structuredContent` in responses | ✅ Sees           | **No context hints** ✗            |
| `content` in responses           | ✅ Sees           | Summary text only                 |
| Widget description               | ✅ Sees (on load) | **Generic description** ✗         |
| `_meta` in responses             | ❌ Never sees     | Has `CONTEXT_GUIDANCE` (useless!) |

The `CONTEXT_GUIDANCE` constant in `universal-tool-shared.ts` is placed in `_meta`, which per OpenAI Apps SDK documentation is "forwarded to the component so you can hydrate UI **without exposing the data to the model**."

---

## 2. Target State

After implementation, context grounding will be supplied through **all model-visible mechanisms**:

1. **Tool descriptions** — Already have prerequisite guidance (maintain)
2. **`structuredContent`** in tool responses — New: context hints for curriculum tools
3. **Widget description** — New: context-aware description
4. **Generated tool responses** — New: context hints added at type-gen time for auth-required tools

---

## 3. Implementation Layers

### Layer Analysis

| Component                           | Location                         | Layer                      | Approach                |
| ----------------------------------- | -------------------------------- | -------------------------- | ----------------------- |
| Widget description                  | `register-resources.ts`          | App                        | Direct edit             |
| Aggregated tool `structuredContent` | `universal-tool-shared.ts`       | SDK (runtime)              | Direct edit             |
| Generated tool `structuredContent`  | `emit-index.ts` or `executor.ts` | SDK (generator or runtime) | **Generator preferred** |
| Remove useless `_meta.context`      | `universal-tool-shared.ts`       | SDK                        | Direct edit             |

### Schema-First Decision

**Question**: Should context hints in generated tool responses be added at type-gen time (generator) or runtime (executor)?

**Decision**: Generator (type-gen time) for these reasons:

1. The generator already has `requiresAuth` logic that determines whether tools need domain context
2. Schema-first principle: behaviour should flow from generated artefacts
3. Different tools may need different hints (e.g., `get-rate-limit` needs no hint, `get-lesson-overview` does)

---

## 4. Detailed Implementation Plan

### Phase 1: App-Level Changes (Non-SDK)

These changes are in the streamable-http app, not the SDK.

#### 1.1 Enhance Widget Description

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

**Current** (line 48-49):

```typescript
const WIDGET_DESCRIPTION =
  'Oak National Academy curriculum explorer showing lessons, units, quizzes, and teaching resources.';
```

**Target**:

```typescript
const WIDGET_DESCRIPTION =
  'Oak curriculum explorer. For best results, call get-ontology first to understand the curriculum domain model.';
```

**Constraints**: ≤200 characters per OpenAI guidance.

**TDD Approach**:

1. RED: Write test asserting widget description contains context guidance
2. GREEN: Update the description
3. REFACTOR: Ensure character limit is respected

---

### Phase 2: SDK Runtime Changes

These changes are in the SDK's runtime code (not generated).

#### 2.1 Add Context Hint to `structuredContent` in `formatOptimizedResult`

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`

**Centralized Pattern**: All aggregated tools use `formatOptimizedResult`:

- `aggregated-search/execution.ts`
- `aggregated-ontology.ts`
- `aggregated-help/help-content.ts`
- `aggregated-fetch.ts`

By adding the context hint to `buildStructuredContent` (called by `formatOptimizedResult`), **all current and future aggregated tools automatically get context guidance**. No per-tool changes needed.

**Current `buildStructuredContent`**:

```typescript
function buildStructuredContent(options: OptimizedResultOptions): UnknownRecord {
  const { summary, previewItems, status } = options;
  const structuredContent: UnknownRecord = { summary };
  // ... preview items logic
  return structuredContent;
}
```

**Target**:

```typescript
/**
 * Context hint included in structuredContent for model guidance.
 * This IS visible to the model (unlike _meta).
 *
 * @remarks
 * All aggregated tools use formatOptimizedResult, so adding this hint
 * here ensures ALL current and future aggregated tools automatically
 * include context guidance for the model.
 */
const OAK_CONTEXT_HINT =
  "For optimal results with Oak curriculum tools, call get-ontology and get-help first if you haven't already." as const;

function buildStructuredContent(options: OptimizedResultOptions): UnknownRecord {
  const { summary, previewItems, status } = options;
  const structuredContent: UnknownRecord = {
    summary,
    oakContextHint: OAK_CONTEXT_HINT,
  };
  // ... preview items logic
  return structuredContent;
}
```

**TDD Approach**:

1. RED: Write unit test asserting `formatOptimizedResult` includes `oakContextHint` in `structuredContent`
2. GREEN: Add the hint to `buildStructuredContent`
3. REFACTOR: Extract constant with TSDoc

**Future-Proofing**: Any new aggregated tool that uses `formatOptimizedResult` will automatically include context guidance.

#### 2.2 Remove Useless `CONTEXT_GUIDANCE` from `_meta`

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`

**Current `buildMeta`** (line 162-177):

```typescript
const CONTEXT_GUIDANCE =
  'If you have not already, use the get-help and get-ontology tools to understand the Oak context';

function buildMeta(options: OptimizedResultOptions, serialisedFullData: unknown): UnknownRecord {
  const meta: UnknownRecord = { fullResults: serialisedFullData, context: CONTEXT_GUIDANCE };
  // ...
}
```

**Target**: Remove `context: CONTEXT_GUIDANCE` from `_meta` (model never sees it).

```typescript
function buildMeta(options: OptimizedResultOptions, serialisedFullData: unknown): UnknownRecord {
  const meta: UnknownRecord = { fullResults: serialisedFullData };
  // ...
}
```

**TDD Approach**:

1. RED: Update existing tests to NOT expect `context` in `_meta`
2. GREEN: Remove the field
3. REFACTOR: Delete the unused `CONTEXT_GUIDANCE` constant

---

### Phase 3: SDK Generator Changes

These changes are in the type-gen code and affect generated tools.

#### 3.1 Add Context Hint Flag to Generated Tool Descriptors

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`

The generator already has `requiresAuth` logic (line 195-196):

```typescript
const securitySchemes = getSecuritySchemeForTool(toolName);
const requiresAuth = securitySchemes[0]?.type !== NOAUTH_SCHEME_TYPE;
```

**Target**: Add a new field to the generated tool descriptor that indicates whether the tool benefits from domain context:

```typescript
// Add to the generated descriptor
lines.push(`  requiresDomainContext: ${requiresAuth ? 'true' : 'false'},`);
```

This allows runtime code to conditionally include context hints.

#### 3.2 Modify `mapExecutionResult` to Include Context Hints

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`

**Current** (line 35-41):

```typescript
function mapExecutionResult(result: ToolExecutionResult): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }
  return formatData({ status: outcome.status, data: outcome.data });
}
```

**Target**: Include context hint in `structuredContent` for generated tools.

This requires either:

- **Option A**: Pass `requiresDomainContext` flag through to `mapExecutionResult`
- **Option B**: Create a new `formatDataWithContext` function

**Recommended**: Option B — cleaner separation of concerns.

```typescript
/**
 * Context hint for curriculum tools, visible to the model.
 */
const CURRICULUM_CONTEXT_HINT =
  "For optimal results, call get-ontology and get-help first to understand Oak's curriculum structure." as const;

function mapExecutionResult(
  result: ToolExecutionResult,
  requiresDomainContext: boolean,
): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }
  return formatDataWithContext({
    status: outcome.status,
    data: outcome.data,
    includeContextHint: requiresDomainContext,
  });
}
```

**TDD Approach**:

1. RED: Write unit test for `formatDataWithContext` with `includeContextHint: true`
2. GREEN: Implement function
3. RED: Write integration test verifying generated tools include context hint
4. GREEN: Update `createUniversalToolExecutor` to pass the flag
5. REFACTOR: Ensure types flow correctly

---

### Phase 4: Enhanced Aggregated Tool Responses

#### 4.1 Add `nextSteps` to `get-ontology` Response

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`

**Target**: Include actionable next steps in `structuredContent` that the model will see:

```typescript
return formatOptimizedResult({
  summary: 'Oak curriculum domain model loaded.',
  fullData: ontologyData,
  status: 'success',
  toolName: 'get-ontology',
  annotationsTitle: 'Get Curriculum Ontology',
  nextSteps: [
    'Use "search" to find lessons on a topic',
    'Use "fetch" with type:slug format (e.g., "lesson:adding-fractions") to retrieve specific content',
  ],
});
```

This requires extending `OptimizedResultOptions` and `buildStructuredContent`.

#### 4.2 Add `nextSteps` to `get-help` Response

Similar enhancement to guide the model on what to do after understanding tool usage.

---

## 5. Implementation Order

| Order | Task                                            | Layer          | Effort | Impact         | Auto for Future?    |
| ----- | ----------------------------------------------- | -------------- | ------ | -------------- | ------------------- |
| 1     | Widget description enhancement                  | App            | Low    | Medium         | N/A                 |
| 2     | Remove `_meta.context` (dead code)              | SDK            | Low    | None (cleanup) | N/A                 |
| 3     | Add `oakContextHint` to `formatOptimizedResult` | SDK            | Low    | High           | ✅ Yes (aggregated) |
| 4     | Add `requiresDomainContext` to generator        | SDK (type-gen) | Medium | Foundation     | ✅ Yes (generated)  |
| 5     | Update `mapExecutionResult` with context        | SDK (runtime)  | Medium | High           | ✅ Yes (generated)  |
| 6     | Add `nextSteps` to aggregated tools             | SDK            | Low    | Medium         | ⚠️ Manual per tool  |

### Automatic Future-Proofing

**Aggregated Tools**: Any new aggregated tool that uses `formatOptimizedResult` will automatically include `oakContextHint` in `structuredContent`. No per-tool changes needed.

**Generated Tools**: Any new tool in the OpenAPI schema that requires authentication will automatically:

1. Have `requiresDomainContext: true` in its descriptor (from generator)
2. Include context hints in its response (from `mapExecutionResult`)

---

## 6. Testing Strategy

### Unit Tests (RED → GREEN → REFACTOR)

| Test                                                  | File                                 | Description                               |
| ----------------------------------------------------- | ------------------------------------ | ----------------------------------------- |
| Widget description contains guidance                  | `register-resources.unit.test.ts`    | Assert substring match                    |
| `structuredContent` includes `oakContextHint`         | `universal-tool-shared.unit.test.ts` | Assert field presence                     |
| `_meta` does NOT include `context`                    | `universal-tool-shared.unit.test.ts` | Assert field absence                      |
| Generated descriptors include `requiresDomainContext` | `emit-index.unit.test.ts`            | Assert for auth/noauth tools              |
| `formatDataWithContext` includes hint when flag true  | `universal-tool-shared.unit.test.ts` | Assert `structuredContent.oakContextHint` |
| `formatDataWithContext` excludes hint when flag false | `universal-tool-shared.unit.test.ts` | Assert field absence                      |

### Integration Tests

| Test                                            | File                                  | Description         |
| ----------------------------------------------- | ------------------------------------- | ------------------- |
| Generated curriculum tools include context hint | `universal-tools.integration.test.ts` | Full execution flow |
| Aggregated tools include `nextSteps`            | `aggregated-*.integration.test.ts`    | Response structure  |

### E2E Tests (If Behaviour Changes)

Per TDD at all levels: if system behaviour changes, update E2E tests FIRST before implementation.

---

## 7. Quality Gates

After all changes, run the full quality gate suite from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**Wait for all gates to complete before analyzing issues.**

---

## 8. Success Criteria

1. **Model-visible context**: All curriculum tools return `oakContextHint` in `structuredContent`
2. **Widget guidance**: Widget description mentions `get-ontology`
3. **No dead code**: `CONTEXT_GUIDANCE` removed from `_meta`
4. **Type safety**: All changes pass type-check without assertions
5. **All quality gates pass**: No blocking issues

---

## 9. Future Considerations

### Ontology Concept-Graph Integration

The standalone `get-knowledge-graph` tool has been removed and its concept
relationship data merged into `get-ontology`. Any context guidance should
continue to reference ontology as the canonical source for structure and
relationships.

### Token Optimization (Separate Concern)

The research document also identified token optimization opportunities:

- Generated tools put full data in `structuredContent` (high token cost)
- Aggregated tools use `formatOptimizedResult` (optimized)

This is a **separate concern** from context grounding and should be addressed in a follow-up plan if desired. The approach would be:

1. Generator produces per-tool preview extractors using schema knowledge
2. `mapExecutionResult` uses these extractors to produce minimal `structuredContent`
3. Full data goes to `_meta` for widget access

---

## 10. References

- OpenAI Apps SDK Reference: Tool Results section
- Schema-First Execution Directive
- Testing Strategy: TDD at All Levels
- Cardinal Rule: Type-gen must be sufficient for schema alignment

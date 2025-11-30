# MCP Tool Metadata Enhancement Plan

**Status**: PLANNED (Phases 0 & 3 ✅ COMPLETE, Quick Win ready)  
**Created**: 2025-11-27  
**Priority**: Post-OAuth, pre-OpenAI App  
**Estimated Duration**: ~3-4 days remaining (+ 5 min quick win)

---

## Executive Summary

Enhance MCP tool metadata to improve ChatGPT/OpenAI Apps SDK integration. This consolidated plan covers:

0. **Quick Win**: STDIO tool description bug fix (~5 mins)
1. ✅ **Phase 0**: Tool annotations (COMPLETE - archived)
2. **Phase 1**: Invocation status strings in `_meta`
3. **Phase 2**: Security schemes mirrored in `_meta`
4. **Phase 3**: Parameter examples from OpenAPI
5. **Phase 4**: Enhanced error messages
6. **Phase 5**: Output schema evaluation
7. **Phase 6**: Aggregated tools alignment

All metadata flows through the type-gen pipeline following schema-first principles.

---

## Directive References

Read and follow:

- `.agent/directives-and-memory/rules.md` - TDD, no type shortcuts, fail fast
- `.agent/directives-and-memory/testing-strategy.md` - TDD at ALL levels
- `.agent/directives-and-memory/schema-first-execution.md` - Generated artifacts drive runtime

---

## Current State

From generated tool files (e.g., `get-key-stages.ts`):

```typescript
{
  name: 'get-key-stages',
  description: "Key stages\n\nThis tool returns all the key stages...",
  inputSchema: toolInputJsonSchema,
  operationId: 'getKeyStages-getKeyStages',
  path: '/key-stages',
  method: 'GET',
  documentedStatuses: ['200'],
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages",
  },
}
```

### Gap Analysis

| OpenAI Apps SDK Field                     | Purpose                             | Current Status               |
| ----------------------------------------- | ----------------------------------- | ---------------------------- |
| `annotations`                             | Tool behavior hints                 | ✅ Complete (Phase 0)        |
| `_meta["openai/toolInvocation/invoking"]` | Status while tool runs (≤64 chars)  | ❌ Missing                   |
| `_meta["openai/toolInvocation/invoked"]`  | Status after completion (≤64 chars) | ❌ Missing                   |
| `_meta["securitySchemes"]`                | Back-compat mirror in `_meta`       | ❌ Missing                   |
| `inputSchema.properties.*.examples`       | Parameter format examples           | ❌ Missing                   |
| `outputSchema`                            | Declares expected output structure  | ⚠️ Generated but not exposed |
| Error messages in tool results            | Rate limit errors, auth errors      | ⚠️ Partial                   |

---

## Quick Win: STDIO Tool Description Bug Fix

**Status**: PLANNED  
**Duration**: ~5 minutes  
**Impact**: Critical for ChatGPT tool discovery via STDIO transport

### Problem

The STDIO server currently overrides rich OpenAPI descriptions with generic "GET /path" strings, breaking ChatGPT's ability to understand what tools do.

```typescript
// Current code in apps/oak-curriculum-mcp-stdio/src/app/server.ts:170
const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;
// Produces: "GET /key-stages" instead of "This tool returns all the key stages..."
```

### Solution

Use `descriptor.description` instead of constructing generic path strings.

### Implementation

**File**: `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

**Change**:

```typescript
// Before
const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;

// After
const description =
  descriptor.description ?? `${descriptor.method.toUpperCase()} ${descriptor.path}`;
```

### Acceptance Criteria

| Criterion                                        | Test Method             |
| ------------------------------------------------ | ----------------------- |
| STDIO tools show OpenAPI descriptions            | `pnpm test` for STDIO   |
| Fallback to method/path if no description exists | Unit test               |
| No change to streamable-http server              | N/A (already uses desc) |

### Validation

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

---

## Phase 0: Tool Annotations ✅ COMPLETE

**Status**: ✅ COMPLETE (2025-11-26)  
**Archived**: `.agent/plans/archive/tool-metadata-alignment-plan.md`

### What Was Delivered

- All 26 generated tools have `annotations` property
- All tools have `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false`
- All tools have human-readable `title` derived from tool name
- Aggregated tools (`search`, `fetch`) have matching annotations
- Handler registration passes annotations to MCP SDK

### Key Files Modified

- `type-gen/typegen/mcp-tools/parts/emit-index.ts` - Added annotations block
- `type-gen/typegen/mcp-tools/parts/kebab-to-title-case.ts` - NEW: Title derivation
- `mcp-tools/contract/tool-descriptor.contract.ts` - Added annotations property
- `src/mcp/universal-tools.ts` - Added annotations to aggregated tools
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` - Pass annotations to registerTool

---

## Phase 1: Invocation Status Strings

**Status**: PLANNED  
**Duration**: ~1 day  
**Impact**: Improved UX in ChatGPT when tools are running

### Problem

ChatGPT shows generic "Running tool..." text. The OpenAI Apps SDK supports `_meta["openai/toolInvocation/invoking"]` and `_meta["openai/toolInvocation/invoked"]` to customise this.

### Solution

Generate invocation status strings from OpenAPI summary at type-gen time.

**Example output**:

```typescript
_meta: {
  'openai/toolInvocation/invoking': 'Fetching key stages…',
  'openai/toolInvocation/invoked': 'Key stages ready',
},
```

### Implementation

#### Step 1.1: Create Pure Function for Status Generation (TDD)

**Location**: `type-gen/typegen/mcp-tools/parts/invocation-status.ts`

```typescript
/**
 * Generate invocation status strings from OpenAPI operation.
 *
 * @param summary - Operation summary (e.g., "Key stages")
 * @param description - Operation description (optional, for fallback)
 * @returns Invoking and invoked status strings (≤64 chars each)
 */
export function generateInvocationStatus(
  summary: string | undefined,
  description: string | undefined,
): { invoking: string; invoked: string } {
  // Implementation
}
```

**Test cases** (write FIRST):

1. `"Key stages"` → `{ invoking: "Fetching key stages…", invoked: "Key stages ready" }`
2. `"Lesson transcript"` → `{ invoking: "Fetching lesson transcript…", invoked: "Lesson transcript ready" }`
3. `"Search lessons by title"` → `{ invoking: "Searching lessons…", invoked: "Search complete" }`
4. Long summary (>50 chars) → Truncated to fit ≤64 chars
5. No summary → Fallback to generic "Processing…" / "Complete"

#### Step 1.2: Update emit-index.ts Generator

**Location**: `type-gen/typegen/mcp-tools/parts/emit-index.ts`

Add `_meta` block after `annotations`:

```typescript
// After annotations block
const { invoking, invoked } = generateInvocationStatus(operation.summary, operation.description);
lines.push('  _meta: {');
lines.push(`    'openai/toolInvocation/invoking': ${JSON.stringify(invoking)},`);
lines.push(`    'openai/toolInvocation/invoked': ${JSON.stringify(invoked)},`);
lines.push('  },');
```

#### Step 1.3: Update ToolDescriptor Contract

**Location**: `tool-descriptor.contract.ts`

Add `_meta` property:

```typescript
readonly _meta?: {
  readonly 'openai/toolInvocation/invoking'?: string;
  readonly 'openai/toolInvocation/invoked'?: string;
  readonly [key: string]: unknown;
};
```

#### Step 1.4: Update Handler Registration

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

Pass `_meta` to `server.registerTool()`:

```typescript
const config = {
  title: tool.annotations?.title ?? tool.name,
  description: tool.description ?? tool.name,
  inputSchema: input,
  securitySchemes: tool.securitySchemes,
  annotations: tool.annotations,
  _meta: tool._meta, // Add this
};
```

### Acceptance Criteria

| Criterion                                  | Test Method          |
| ------------------------------------------ | -------------------- |
| All generated tools have `_meta` property  | Grep generated files |
| Invoking status ≤64 chars                  | Unit test            |
| Invoked status ≤64 chars                   | Unit test            |
| Status strings derive from OpenAPI summary | Unit test            |
| `pnpm type-gen` regenerates with `_meta`   | Run type-gen         |
| Handler passes `_meta` to MCP SDK          | Code inspection      |

---

## Phase 2: Security Schemes in \_meta

**Status**: PLANNED  
**Duration**: ~0.5 days  
**Impact**: Backwards compatibility with clients that only read `_meta`

### Problem

Per OpenAI Apps SDK reference:

> `_meta["securitySchemes"]` - Back-compat mirror for clients that only read `_meta`.

We provide `securitySchemes` at root but not in `_meta`.

### Solution

Mirror `securitySchemes` into `_meta` during generation.

### Implementation

#### Step 2.1: Update emit-index.ts

Add `securitySchemes` to `_meta` block:

```typescript
lines.push('  _meta: {');
lines.push(`    'openai/toolInvocation/invoking': ${JSON.stringify(invoking)},`);
lines.push(`    'openai/toolInvocation/invoked': ${JSON.stringify(invoked)},`);
lines.push(`    securitySchemes: ${securitySchemesLiteral},`);
lines.push('  },');
```

### Acceptance Criteria

| Criterion                                              | Test Method          |
| ------------------------------------------------------ | -------------------- |
| `_meta.securitySchemes` matches root `securitySchemes` | Unit test            |
| Generated files include mirrored security schemes      | Grep generated files |

---

## Phase 3: Parameter Examples from OpenAPI

**Status**: PLANNED  
**Duration**: ~1 day  
**Impact**: AI agents understand expected input formats

### Problem

1. **AI agents struggle with format inference**: Description text like "sequence slug identifier" doesn't clearly convey expected format.
2. **Our OpenAPI schema has 131 examples**: Rich metadata exists but isn't surfacing to MCP clients.
3. **Examples are more actionable than descriptions**: `"example": "english-primary"` immediately shows the expected format.

### Value for AI Agents

```typescript
// Without examples - AI must infer format from description
{
  "sequence": {
    "type": "string",
    "description": "The sequence slug identifier"
  }
}

// With examples - AI sees concrete expected format
{
  "sequence": {
    "type": "string",
    "description": "The sequence slug identifier",
    "examples": ["english-primary", "maths-secondary-higher"]
  }
}
```

### JSON Schema Specification

Per [JSON Schema draft-07](https://json-schema.org/draft-07/schema):

| OpenAPI Field                      | JSON Schema Field | Notes                  |
| ---------------------------------- | ----------------- | ---------------------- |
| `parameter.example`                | `examples[0]`     | Single example → array |
| `parameter.schema.example`         | `examples[0]`     | Fallback location      |
| `parameter.examples` (OpenAPI 3.1) | `examples`        | Direct mapping         |

### Implementation

#### Step 3.1: Extend ParamMetadata Interface

**Location**: `type-gen/typegen/mcp-tools/parts/param-metadata.ts`

```typescript
export interface ParamMetadata {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
  readonly example?: unknown; // ADD
}
```

#### Step 3.2: Extract Examples in Type-Gen

**Location**: `type-gen/typegen/mcp-tools/mcp-tool-generator.ts`

```typescript
function extractParamMetadata(param: ParameterObject): ParamMetadata {
  // ... existing code

  // Extract example from parameter level or schema level
  const paramExample = 'example' in param ? param.example : undefined;
  const schemaExample = schema && 'example' in schema ? schema.example : undefined;

  return {
    // ... existing fields
    example: paramExample ?? schemaExample,
  };
}
```

#### Step 3.3: Emit Examples to JSON Schema

**Location**: `type-gen/typegen/mcp-tools/parts/build-json-schema-property.ts`

```typescript
function buildCommon(meta: ParamMetadata): {
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
} {
  const out: { description?: string; default?: unknown; examples?: unknown[] } = {};
  if (meta.description !== undefined) {
    out.description = meta.description;
  }
  if (meta.default !== undefined) {
    out.default = meta.default;
  }
  if (meta.example !== undefined) {
    out.examples = [meta.example];
  }
  return out;
}
```

### Acceptance Criteria

| Criterion                                             | Test Method            |
| ----------------------------------------------------- | ---------------------- |
| `ParamMetadata` includes `example?: unknown`          | TypeScript compilation |
| `extractParamMetadata` extracts from `param.example`  | Unit test              |
| `extractParamMetadata` falls back to `schema.example` | Unit test              |
| JSON Schema includes `examples` array                 | Grep generated files   |
| `pnpm type-gen` succeeds with examples                | Run type-gen           |

---

## Phase 4: Enhanced Error Messages

**Status**: PLANNED  
**Duration**: ~1 day  
**Impact**: Better error handling for rate limits, auth failures

### Problem

MCP spec supports structured error information in tool results, including rate limit errors. We should return informative error messages when:

1. Rate limits are hit (upstream API returns 429)
2. Authentication fails (401/403)
3. Resource not found (404)
4. Validation fails

### Solution

Enhance `formatError` and related functions to return structured error information that ChatGPT can use.

### Implementation

#### Step 4.1: Define Error Result Structure

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`

```typescript
/**
 * Formats an error result with structured metadata.
 *
 * @param message - Human-readable error message
 * @param status - HTTP status code (if applicable)
 * @param errorCode - Machine-readable error code
 */
export function formatError(message: string, status?: number, errorCode?: string): CallToolResult {
  return {
    content: [{ type: 'text', text: message }],
    isError: true,
    _meta: {
      errorCode,
      httpStatus: status,
      ...(status === 429 && {
        errorType: 'rate_limit',
        retryAfter: 60, // Default suggestion
      }),
    },
  };
}
```

#### Step 4.2: Handle Rate Limit Responses

Update tool execution to detect and format rate limit errors:

```typescript
if (response.status === 429) {
  return formatError(
    'Rate limit exceeded. Please wait before making additional requests.',
    429,
    'RATE_LIMIT_EXCEEDED',
  );
}
```

### Acceptance Criteria

| Criterion                                        | Test Method |
| ------------------------------------------------ | ----------- |
| 429 responses return structured rate limit error | Unit test   |
| 401/403 responses return auth error              | Unit test   |
| Error messages are human-readable                | Code review |
| `_meta` includes error metadata                  | Unit test   |

---

## Phase 5: Output Schema Evaluation

**Status**: PLANNED (Evaluation)  
**Duration**: ~0.5 days  
**Impact**: Potential improved client experience

### Problem

We generate `toolOutputJsonSchema` and `zodOutputSchema` but don't expose them during tool registration. The MCP SDK supports `outputSchema` for declaring expected output structure.

**Concern**: We already use Zod for output validation internally. Is exposing `outputSchema` redundant?

### Analysis

| Aspect                    | With outputSchema | Without outputSchema |
| ------------------------- | ----------------- | -------------------- |
| Client knows output shape | ✅ Yes            | ❌ No                |
| Server validates output   | ✅ Yes (Zod)      | ✅ Yes (Zod)         |
| Redundant validation?     | ⚠️ Possibly       | ❌ No                |
| MCP SDK uses it?          | ⚠️ Optional       | N/A                  |
| OpenAI Apps uses it?      | 🔍 TBD            | N/A                  |

### Decision Points

1. **Does OpenAI Apps SDK use `outputSchema`?** - Need to verify in production
2. **Does MCP SDK validate against it?** - SDK uses it for type hints, not runtime validation
3. **Is there value for clients?** - Yes, for understanding response structure

### Recommendation

**Defer decision until Phases 1-4 complete.** Then:

1. Test if ChatGPT displays/uses `outputSchema`
2. If yes: Expose `toolOutputJsonSchema` during registration
3. If no: Keep internal-only (no change)

### Implementation (If Proceeding)

Update handler registration:

```typescript
const config = {
  title: tool.annotations?.title ?? tool.name,
  description: tool.description ?? tool.name,
  inputSchema: input,
  outputSchema: descriptor.toolOutputJsonSchema, // Add if MCP SDK supports
  securitySchemes: tool.securitySchemes,
  annotations: tool.annotations,
  _meta: tool._meta,
};
```

---

## Phase 6: Aggregated Tools Alignment

**Status**: PLANNED  
**Duration**: ~0.5 days  
**Impact**: Consistency across all tools

### Problem

Aggregated tools (`search`, `fetch`) need matching metadata updates from Phases 1-4.

### Implementation

Update `AGGREGATED_TOOL_DEFS` in `universal-tools.ts`:

```typescript
export const AGGREGATED_TOOL_DEFS = {
  search: {
    description: '...',
    inputSchema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query string to find lessons and transcripts',
          examples: ['Who were the romans?', 'photosynthesis', 'fractions year 4'],
        },
        keyStage: {
          type: 'string',
          description: 'Filter by key stage',
          enum: [...KEY_STAGES],
          examples: ['ks2'],
        },
        // ...
      },
    },
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: 'Search',
    },
    _meta: {
      'openai/toolInvocation/invoking': 'Searching lessons and transcripts…',
      'openai/toolInvocation/invoked': 'Search complete',
      securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    },
  },
  fetch: {
    // Similar structure with examples for id field
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Canonical identifier in format "type:slug"',
          examples: [
            'lesson:adding-fractions-with-the-same-denominator',
            'unit:fractions',
            'subject:maths',
          ],
        },
      },
    },
    _meta: {
      'openai/toolInvocation/invoking': 'Fetching curriculum resource…',
      'openai/toolInvocation/invoked': 'Resource ready',
      securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    },
  },
} as const;
```

---

## Future Considerations (Out of Scope)

### UI Widget Support

When building OpenAI App widgets, additional metadata will be needed:

- `_meta["openai/outputTemplate"]` - Widget HTML template URI
- `_meta["openai/widgetAccessible"]` - Allow widget→tool calls
- `_meta["openai/widgetCSP"]` - Content security policy
- `_meta["openai/widgetDomain"]` - Dedicated widget domain

These require significant additional infrastructure and are tracked in `oak-openai-app-plan.md`.

### Custom Rate Limit Hints

The MCP spec doesn't define rate limit metadata on tool descriptors. We could add custom fields:

```typescript
_meta: {
  'oak/rateLimit': {
    requestsPerMinute: 60,
    burstLimit: 10,
  },
}
```

However, no clients currently consume this. Defer until there's demand.

---

## Implementation Schedule

| Phase                       | Duration | Dependency          |
| --------------------------- | -------- | ------------------- |
| Quick Win: STDIO Bug Fix    | 5 mins   | None                |
| Phase 0: Annotations        | -        | ✅ COMPLETE         |
| Phase 1: Invocation Status  | 1 day    | None                |
| Phase 2: Security in \_meta | 0.5 days | Phase 1             |
| Phase 3: Parameter Examples | 1 day    | None (can parallel) |
| Phase 4: Error Messages     | 1 day    | None (can parallel) |
| Phase 5: Output Schema Eval | 0.5 days | Phase 1-4 complete  |
| Phase 6: Aggregated Tools   | 0.5 days | Phase 1-4           |

**Total**: ~3-4 days (Phases 0 and 3 already complete, Quick Win ready to do now)

---

## Key Files

### Type Generation (Schema-First)

| File                                                             | Change                       |
| ---------------------------------------------------------------- | ---------------------------- |
| `type-gen/typegen/mcp-tools/parts/emit-index.ts`                 | Add `_meta` block            |
| `type-gen/typegen/mcp-tools/parts/invocation-status.ts`          | NEW: Generate status strings |
| `type-gen/typegen/mcp-tools/parts/param-metadata.ts`             | Add `example` field          |
| `type-gen/typegen/mcp-tools/mcp-tool-generator.ts`               | Extract `example`            |
| `type-gen/typegen/mcp-tools/parts/build-json-schema-property.ts` | Emit `examples` array        |

### Contract

| File                                             | Change               |
| ------------------------------------------------ | -------------------- |
| `mcp-tools/contract/tool-descriptor.contract.ts` | Add `_meta` property |

### SDK

| File                               | Change                              |
| ---------------------------------- | ----------------------------------- |
| `src/mcp/universal-tools.ts`       | Add `_meta`, examples to aggregated |
| `src/mcp/universal-tool-shared.ts` | Enhanced error formatting           |

### App

| File                                                      | Change                       |
| --------------------------------------------------------- | ---------------------------- |
| `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` | Pass `_meta` to registerTool |

---

## Quality Gates

After each phase:

```bash
pnpm type-gen      # Regenerate all tools
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # Unit + integration tests pass
pnpm test:e2e      # E2E tests pass
```

---

## TDD Reminder

Per testing-strategy.md:

> "Write tests **FIRST**. Red → Green → Refactor"

All changes follow:

1. **RED**: Write test that fails (feature doesn't exist yet)
2. **GREEN**: Implement minimal code to pass test
3. **REFACTOR**: Improve implementation while keeping tests green

---

## References

- OpenAI Apps SDK Reference: `.agent/reference-docs/openai-apps-sdk-reference.md`
- OpenAI Apps Metadata Guide: `.agent/reference-docs/openai-apps-metadata.md`
- MCP TypeScript SDK: `.agent/reference-docs/mcp-typescript-sdk-readme.md`
- Tool Metadata Alignment Plan (archived): `.agent/plans/archive/tool-metadata-alignment-plan.md`

---

## Related Plans

- **02-curriculum-ontology-resource-plan.md** - Ontology resource (parallel work)
- **03-mcp-infrastructure-advanced-tools-plan.md** - Infrastructure and advanced tools (depends on aggregated tools refactor)

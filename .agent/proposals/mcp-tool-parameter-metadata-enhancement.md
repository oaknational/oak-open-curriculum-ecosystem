# MCP Tool Parameter Metadata Enhancement

**Status**: PROPOSAL  
**Date**: 2025-11-26  
**Author**: AI Assistant  
**Priority**: High - Affects OpenAI Apps compliance and developer experience

---

## Executive Summary

Our MCP tools have rich parameter metadata (descriptions, enums, defaults) in the upstream OpenAPI schema. This metadata flows correctly through code-generation into generated JSON Schema artifacts. However, the metadata is **lost before reaching MCP clients** because of how we convert to Zod for the MCP SDK.

This proposal presents two options for fixing this, with a recommendation.

---

## Table of Contents

1. [Background](#1-background)
2. [Current State Analysis](#2-current-state-analysis)
3. [The Problem](#3-the-problem)
4. [Option A: Enhance Zod Generation](#4-option-a-enhance-zod-generation)
5. [Option B: Use JSON Schema Directly](#5-option-b-use-json-schema-directly)
6. [Comparison](#6-comparison)
7. [Recommendation](#7-recommendation)
8. [References](#8-references)

---

## 1. Background

### 1.1 MCP Protocol Requirements

Per the MCP specification ([`.agent/reference/mcp-docs-for-agents.md`](../reference/mcp-docs-for-agents.md), lines 12293-12398):

> Tools are defined by:
>
> - `name`: Unique identifier
> - `description`: Human-readable description of functionality
> - `inputSchema`: **JSON Schema defining expected parameters**
> - `annotations`: Optional properties describing tool behavior

The `inputSchema` field uses **JSON Schema** format, which supports per-property metadata:

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "keyStage": {
        "type": "string",
        "description": "Key stage slug to filter by",
        "enum": ["ks1", "ks2", "ks3", "ks4"]
      }
    }
  }
}
```

### 1.2 MCP TypeScript SDK Approach

The MCP TypeScript SDK ([`.agent/reference/mcp-typescript-sdk-readme.md`](../reference/mcp-typescript-sdk-readme.md), lines 84-99) uses **Zod schemas** for tool registration:

```typescript
server.registerTool(
  'add',
  {
    title: 'Addition Tool',
    description: 'Add two numbers',
    inputSchema: { a: z.number(), b: z.number() },  // Zod, not JSON Schema
  },
  async ({ a, b }) => { ... }
);
```

The SDK internally converts Zod to JSON Schema using `zod-to-json-schema` for the `tools/list` protocol response.

**Key SDK pattern** (line 510):

```typescript
text: z.string().describe('Text to summarize'),  // .describe() adds description
```

### 1.3 OpenAI Apps Requirements

Per OpenAI Apps developer guidelines ([`.agent/reference/openai-apps-sdk-guidance.md`](../reference/openai-apps-sdk-guidance.md), lines 34-39):

> **Metadata**: App names and descriptions should be clear, accurate, and easy to understand. Tool titles and annotations should make it obvious what each tool does.

> **Transparency**: Inputs should be specific, narrowly scoped, and clearly linked to the task.

Parameter descriptions help users understand what data they're providing.

### 1.4 Schema-First Principle

Per `.agent/directives/schema-first-execution.md`:

> Every byte of runtime behaviour for MCP tool execution **must** be driven by generated artefacts sourced from the OpenAPI schema.

Our parameter metadata originates in OpenAPI and should flow through to MCP clients.

---

## 2. Current State Analysis

### 2.1 Data Flow Overview

```
OpenAPI Schema (source of truth)
  │
  ├─ description: "Key stage slug to filter by, e.g. 'ks2'"
  ├─ enum: ["ks1", "ks2", "ks3", "ks4"]
  └─ default: 0 (for pagination params)
  │
  ▼
sdk-codegen (pnpm sdk-codegen)
  │
  ├─► toolInputJsonSchema ✅ HAS descriptions, enums, defaults
  ├─► toolZodSchema ❌ MISSING .describe() calls
  └─► toolMcpFlatInputSchema ❌ Uses z.union([z.literal()]) not z.enum()
  │
  ▼
Runtime (handlers.ts)
  │
  └─► zodRawShapeFromToolInputJsonSchema() ❌ Loses descriptions
      │
      ▼
MCP SDK registerTool()
  │
  └─► zodToJsonSchema() converts back to JSON Schema
      │
      ▼
tools/list Response
  │
  └─► {"keyStage": {"type": "string"}} ❌ No description, no enum!
```

### 2.2 What We Generate (Correct)

**File**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-key-stages-subject-lessons.ts`

```typescript
export const toolInputJsonSchema = {
  type: 'object',
  properties: {
    "keyStage": {
      "type": "string",
      "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
      "enum": ["ks1", "ks2", "ks3", "ks4"]
    },
    "subject": {
      "type": "string",
      "description": "Subject slug to filter by, e.g. 'english'...",
      "enum": ["art", "citizenship", "computing", ...]
    },
    "offset": {
      "type": "number",
      "default": 0
    }
  },
  required: ["keyStage", "subject"]
};
```

**This is exactly what the MCP protocol needs.** We generate it. We just don't use it.

### 2.3 What We Send to MCP SDK (Lossy)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`, lines 58-71:

```typescript
const tools = listUniversalTools();
for (const tool of tools) {
  const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema); // ← Lossy conversion
  const config = {
    title: tool.annotations?.title ?? tool.name,
    description: tool.description ?? tool.name,
    inputSchema: input, // ← Zod without descriptions
    annotations: tool.annotations,
  };
  server.registerTool(tool.name, config, handler);
}
```

### 2.4 What MCP Clients Receive (Missing Metadata)

Actual `tools/list` response:

```json
{
  "name": "get-key-stages-subject-lessons",
  "inputSchema": {
    "properties": {
      "keyStage": { "type": "string" },
      "subject": { "type": "string" },
      "offset": { "type": "number" }
    }
  }
}
```

**Missing**: descriptions, enum values, defaults.

---

## 3. The Problem

### 3.1 Root Causes

1. **sdk-codegen doesn't emit `.describe()` on Zod schemas**
   - Location: `code-generation/typegen/mcp-tools/parts/build-zod-type.ts`
   - We generate `z.string()` instead of `z.string().describe("...")`

2. **Runtime conversion loses descriptions**
   - Location: `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`
   - `zodRawShapeFromToolInputJsonSchema()` ignores description field

3. **Enum handling doesn't convert back to JSON Schema properly**
   - We use `z.string().refine()` instead of `z.enum()`
   - `zodToJsonSchema` doesn't convert refine validators to enum arrays

### 3.2 Impact

| Affected Area                 | Impact                                         |
| ----------------------------- | ---------------------------------------------- |
| MCP clients (Cursor, ChatGPT) | Users see parameters without descriptions      |
| OpenAI Apps compliance        | Tools don't show what inputs are expected      |
| LLM tool calling              | Models lack context for proper parameter usage |
| Developer experience          | Hard to understand what tools expect           |

---

## 4. Option A: Enhance Zod Generation

### 4.1 Summary

Fix Zod schemas to include descriptions and proper enum types. The MCP SDK's `zodToJsonSchema` will then produce correct protocol output.

### 4.2 Changes Required

#### 4.2.1 Code-Gen Changes (Build Time)

**File**: `packages/sdks/oak-curriculum-sdk/code-generation/typegen/mcp-tools/parts/build-zod-type.ts`

**Current**:

```typescript
export function buildZodType(meta: ParamMetadata): string {
  if (meta.allowedValues && meta.allowedValues.length > 0) {
    const literals = meta.allowedValues.map((value) => `z.literal(${JSON.stringify(value)})`);
    return `z.union([${literals.join(', ')}])`;
  }
  switch (meta.typePrimitive) {
    case 'string':
      return 'z.string()';
    // ...
  }
}
```

**Proposed**:

```typescript
export function buildZodType(meta: ParamMetadata): string {
  let base: string;

  if (meta.allowedValues && meta.allowedValues.length > 0) {
    // Use z.enum() for proper JSON Schema conversion
    const values = meta.allowedValues.map((v) => JSON.stringify(v)).join(', ');
    base = `z.enum([${values}] as const)`;
  } else {
    switch (meta.typePrimitive) {
      case 'string':
        base = 'z.string()';
        break;
      // ...
    }
  }

  // Add .describe() if description exists
  if (meta.description) {
    base = `${base}.describe(${JSON.stringify(meta.description)})`;
  }

  return base;
}
```

#### 4.2.2 Runtime Conversion Changes

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`

**Current**:

```typescript
function buildEnumStringSchema(values: readonly unknown[]): z.ZodTypeAny {
  const allowed = values.map((v) => String(v));
  return z.string().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function zodForProperty(prop: JsonSchemaProperty): z.ZodTypeAny {
  switch (prop.type) {
    case 'string': {
      return Array.isArray(prop.enum) ? buildEnumStringSchema(prop.enum) : z.string();
    }
    // ...
  }
}
```

**Proposed**:

```typescript
function buildEnumSchema(values: readonly unknown[]): z.ZodEnum<[string, ...string[]]> {
  const stringValues = values.map((v) => String(v)) as [string, ...string[]];
  return z.enum(stringValues);
}

function zodForProperty(prop: JsonSchemaProperty): z.ZodTypeAny {
  let base: z.ZodTypeAny;

  switch (prop.type) {
    case 'string': {
      base = Array.isArray(prop.enum) ? buildEnumSchema(prop.enum) : z.string();
      break;
    }
    // ...
  }

  // Add description if present
  if (prop.description) {
    base = base.describe(prop.description);
  }

  return base;
}
```

### 4.3 Pros

- Works with existing McpServer API
- Improves Zod validation error messages
- Single source of truth for validation and documentation
- Minimal architectural change
- Schema-first compliant (changes in code-generation templates)

### 4.4 Cons

- Requires understanding zod-to-json-schema behavior
- Need to verify Zod 4.x compatibility
- Two places to fix (code-generation + runtime conversion)

### 4.5 Effort Estimate

- Code-gen changes: ~2 hours
- Runtime conversion changes: ~2 hours
- Testing: ~2 hours
- **Total: ~1 day**

---

## 5. Option B: Use JSON Schema Directly

### 5.1 Summary

Bypass the Zod-to-JSON-Schema conversion for the `tools/list` response. Use our already-generated JSON Schema directly for the protocol.

### 5.2 Approach

The MCP SDK's `McpServer` class wraps the low-level `Server` class. We can access `server.server` to set custom handlers.

**Key insight**: We can provide our own `tools/list` handler that returns our JSON Schema, while still using Zod for validation in `tools/call`.

### 5.3 Changes Required

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

```typescript
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
  const tools = listUniversalTools();

  // Register tools with Zod for validation (tools/call)
  for (const tool of tools) {
    const zodInput = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    server.registerTool(tool.name, { inputSchema: zodInput, ... }, handler);
  }

  // Override tools/list to return our JSON Schema directly
  server.server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: tools.map((tool) => ({
      name: tool.name,
      title: tool.annotations?.title,
      description: tool.description,
      inputSchema: tool.inputSchema,  // Our JSON Schema directly!
      annotations: tool.annotations,
    }))
  }));
}
```

### 5.4 Complications

1. **Handler Conflict**: McpServer sets its own `ListToolsRequestSchema` handler when you call `registerTool()`. We'd need to call `setRequestHandler` AFTER all tools are registered, and the SDK may throw if the handler is already set.

2. **Validation Still Uses Zod**: The `tools/call` handler still uses Zod from `registerTool()`. This means we still want good Zod for validation error messages.

3. **Maintenance Burden**: We're working against the SDK's grain, which could break with updates.

### 5.5 Pros

- Uses our already-generated, perfect JSON Schema
- No dependency on zod-to-json-schema behavior
- Guaranteed correct protocol output

### 5.6 Cons

- Works against MCP SDK design
- Handler override may not be supported
- Still need Zod improvements for validation
- More complex, less maintainable
- May break with SDK updates

### 5.7 Effort Estimate

- Research SDK handler override: ~2 hours
- Implementation: ~4 hours (if possible)
- Workarounds if blocked: Unknown
- Testing: ~2 hours
- **Total: ~1-2 days (with uncertainty)**

---

## 6. Comparison

| Criterion             | Option A: Enhance Zod       | Option B: Use JSON Schema  |
| --------------------- | --------------------------- | -------------------------- |
| **Complexity**        | Low                         | High                       |
| **Risk**              | Low                         | Medium (SDK compatibility) |
| **Maintainability**   | Uses SDK as designed        | Works against SDK design   |
| **Validation Errors** | ✅ Improved                 | ❌ Still poor              |
| **Protocol Output**   | ✅ Correct (via conversion) | ✅ Correct (direct)        |
| **Schema-First**      | ✅ Changes in code-generation      | ⚠️ Runtime workaround      |
| **Effort**            | ~1 day                      | ~1-2 days                  |

---

## 7. Recommendation

### 7.1 Primary Recommendation: Option A (Enhance Zod)

**Rationale**:

1. **We are generating JSON Schema for a reason** - The `toolInputJsonSchema` exists to serve MCP. We should make Zod equivalent so it converts correctly.

2. **Simple, high-impact fixes** - Adding `.describe()` and using `z.enum()` are straightforward changes that fix both validation and protocol output.

3. **Works with SDK design** - We use the SDK as intended, reducing maintenance burden.

4. **Schema-first compliance** - Changes happen in code-generation templates, not runtime workarounds.

### 7.2 Why Not Option B

Option B requires working against the SDK's design and doesn't fix Zod validation errors. Even if we bypass for protocol, we'd still want Option A's improvements for better validation. So Option A is needed either way.

### 7.3 Implementation Priority

1. **High-impact, low-effort**: Add `.describe()` to runtime Zod conversion
2. **High-impact, medium-effort**: Add `.describe()` to sdk-codegen Zod generation
3. **Medium-impact, low-effort**: Use `z.enum()` instead of refine validators

---

## 8. References

### 8.1 MCP Specification

- [`.agent/reference/mcp-docs-for-agents.md`](../reference/mcp-docs-for-agents.md)
  - Lines 12293-12402: Tool definition structure
  - Lines 6265-6290: inputSchema examples with descriptions

### 8.2 MCP TypeScript SDK

- [`.agent/reference/mcp-typescript-sdk-readme.md`](../reference/mcp-typescript-sdk-readme.md)
  - Lines 84-99: registerTool with Zod inputSchema
  - Lines 508-512: `.describe()` pattern for parameter descriptions
  - Lines 1136-1198: Low-level Server API

### 8.3 OpenAI Apps Guidelines

- [`.agent/reference/openai-apps-sdk-guidance.md`](../reference/openai-apps-sdk-guidance.md)
  - Lines 34-39: Metadata and transparency requirements
  - Lines 64-68: Data minimization and clear inputs

### 8.4 Prior Research

- [`.agent/research/mcp-tool-description-schema-flow-analysis.md`](../research/mcp-tool-description-schema-flow-analysis.md)
  - Section 2.3: Parameter description flow analysis
  - Section 3.3: Information loss in Zod conversion
  - Section 5.1: Recommended Zod enhancements

### 8.5 Related Completed Work

- [`.agent/plans/sdk-and-mcp-enhancements/tool-metadata-alignment-plan.md`](../plans/sdk-and-mcp-enhancements/tool-metadata-alignment-plan.md)
  - Completed: Tool-level annotations (readOnlyHint, title)
  - Not addressed: Parameter-level descriptions

### 8.6 Codebase Locations

| Purpose                   | File                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Code-gen Zod builder      | `packages/sdks/oak-curriculum-sdk/code-generation/typegen/mcp-tools/parts/build-zod-type.ts`                                              |
| Runtime Zod converter     | `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`                                                                     |
| Tool handler registration | `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`                                                                          |
| Generated tool example    | `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-key-stages-subject-lessons.ts` |

---

## Appendix: Summary of Current Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CURRENT STATE (LOSSY)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  OpenAPI Schema                                                     │
│  ├─ description: "Key stage slug to filter by..."      ✅          │
│  ├─ enum: ["ks1", "ks2", "ks3", "ks4"]                 ✅          │
│  └─ default: 0                                         ✅          │
│       │                                                             │
│       ▼                                                             │
│  sdk-codegen (pnpm sdk-codegen)                                          │
│  ├─► toolInputJsonSchema (JSON Schema) ────────────────────┐       │
│  │   ├─ description ✅                                      │      │
│  │   ├─ enum ✅                                             │      │
│  │   └─ default ✅                                          │      │
│  │                                                          │      │
│  └─► toolMcpFlatInputSchema (Zod)                          │      │
│      ├─ .describe() ❌ NOT GENERATED                       │      │
│      └─ z.union([z.literal()]) instead of z.enum() ❌      │      │
│           │                                                 │      │
│           ▼                                                 │      │
│  Runtime: zodRawShapeFromToolInputJsonSchema()              │      │
│  ├─ Ignores description ❌                                  │ NOT  │
│  └─ Uses refine() instead of enum() ❌                      │ USED │
│       │                                                     │      │
│       ▼                                                     │      │
│  MCP SDK: server.registerTool(inputSchema: ZodRawShape)     │      │
│       │                                                     │      │
│       ▼                                                     │      │
│  MCP SDK: zodToJsonSchema()                                 │      │
│  ├─ No descriptions (Zod doesn't have them) ❌              │      │
│  └─ No enum arrays (refine doesn't convert) ❌              │      │
│       │                                                     │      │
│       ▼                                                     │      │
│  tools/list Response                                        │      │
│  └─ {"keyStage": {"type": "string"}} ❌ MISSING METADATA ◄─┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     PROPOSED STATE (LOSSLESS)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  OpenAPI Schema                                                     │
│       │                                                             │
│       ▼                                                             │
│  sdk-codegen (pnpm sdk-codegen)                                          │
│  ├─► toolInputJsonSchema (unchanged) ✅                             │
│  └─► toolMcpFlatInputSchema (Zod)                                  │
│      ├─ .describe("Key stage slug...") ✅ NEW                      │
│      └─ z.enum(["ks1", "ks2", ...]) ✅ NEW                         │
│           │                                                         │
│           ▼                                                         │
│  Runtime: zodRawShapeFromToolInputJsonSchema() (enhanced)          │
│  ├─ Adds .describe() from JSON Schema ✅ NEW                       │
│  └─ Uses z.enum() for enums ✅ NEW                                 │
│       │                                                             │
│       ▼                                                             │
│  MCP SDK: zodToJsonSchema()                                        │
│  ├─ description from .describe() ✅                                │
│  └─ enum from z.enum() ✅                                          │
│       │                                                             │
│       ▼                                                             │
│  tools/list Response                                                │
│  └─ {"keyStage": {"type": "string", "description": "...",          │
│      "enum": ["ks1", ...]}} ✅ COMPLETE METADATA                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

**End of Proposal**

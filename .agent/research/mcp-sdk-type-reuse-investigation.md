# MCP SDK Type Reuse Investigation

**Date**: November 18, 2024  
**Scope**: Using `@modelcontextprotocol/sdk` types in `@oaknational/curriculum-sdk`  
**Status**: Investigation Complete - Recommendations Provided

---

## EXECUTIVE SUMMARY

This investigation examines whether `@oaknational/curriculum-sdk` should leverage types from `@modelcontextprotocol/sdk` to better align with our architectural principle of "use library types directly wherever possible" from `rules.md`.

**Key Finding**: We ARE already using some MCP SDK types (`Tool`, `CallToolResult`, `TextContent`, etc.), but there are opportunities to use more upstream types, particularly around input schemas and tool list responses. However, some duplication is justified by our schema-first architecture and the MCP SDK's limited type exports.

**Alignment Status**:

- ✅ Already using `CallToolResult`, `TextContent`, `Tool` from MCP SDK
- ⚠️ Duplicating JSON Schema type definitions that could potentially come from MCP SDK
- ✅ Extending `Tool` interface correctly (our `ToolDescriptor extends Tool`)
- ⚠️ Opportunity to use more MCP protocol types for consistency

---

## 1. CURRENT MCP SDK TYPE USAGE

### 1.1 Types We Currently Import

**From Generated Code** (`packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/`):

```typescript
// contract/tool-descriptor.contract.ts
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

// generated/stubs/index.ts
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

// generated/runtime/lib.ts
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type CallToolResult,
  type TextContent,
} from '@modelcontextprotocol/sdk/types.js';

// generated/runtime/execute.ts
import { CallToolRequestSchema, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
```

**From Runtime Code** (`packages/sdks/oak-curriculum-sdk/src/mcp/`):

```typescript
// universal-tools.ts
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

// universal-tool-shared.ts
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

// stub-tool-executor.ts
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

// aggregated-search.ts & aggregated-fetch.ts
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
```

**✅ GOOD**: We're already using core MCP protocol types consistently

### 1.2 Types We're NOT Using (But Could Consider)

Based on the MCP specification and SDK, additional types that might be available:

1. **JSON Schema Types**: If MCP SDK exports JSON Schema type definitions
2. **Tool List Response Types**: `ListToolsResult` or similar
3. **Protocol Error Types**: Structured error response types
4. **Request/Response Types**: Full protocol message types

---

## 2. WHAT THE MCP SDK EXPORTS

### 2.1 Known Exported Types

From our usage and the MCP specification:

**Core Protocol Types**:

- `Tool` - Tool definition interface
- `CallToolResult` - Tool execution result
- `CallToolRequest` - Tool call request
- `CallToolRequestSchema` - Zod schema for tool calls
- `ListToolsRequestSchema` - Zod schema for listing tools
- `TextContent` - Text content type
- `Server` - Server class

**Source**: Direct imports in our codebase

### 2.2 Tool Interface Structure

Our `ToolDescriptor` extends `Tool`:

```typescript
export interface ToolDescriptor<...> extends Tool {
  readonly name: TName;
  readonly description?: string;
  // ... our extensions
}
```

This means `Tool` from MCP SDK likely defines:

- `name: string`
- `description?: string`
- `inputSchema: JSONSchema` (JSON Schema object)

**✅ CORRECT USAGE**: We extend rather than redefine

### 2.3 What We Define Ourselves

**Input Schema Structure** (`ToolDescriptor` lines 32-38, 42-48):

```typescript
readonly toolInputJsonSchema: {
  readonly type: 'object';
  readonly properties?: Record<string, unknown>;
  readonly required?: string[];
  readonly additionalProperties?: boolean;
};
```

**Question**: Does MCP SDK export a `JSONSchema` or `JSONSchemaObject` type we could use instead?

---

## 3. INVESTIGATION: MCP SDK JSON SCHEMA TYPES

### 3.1 Common JSON Schema Type Definitions

**Standard Pattern**: Most TypeScript projects define JSON Schema types like:

```typescript
// Common in validation libraries
export interface JSONSchemaObject {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array' | 'null';
  properties?: Record<string, JSONSchema>;
  required?: string[];
  additionalProperties?: boolean | JSONSchema;
  // ... other JSON Schema fields
}

export type JSONSchema =
  | JSONSchemaObject
  | { type: 'string'; enum?: string[] }
  | { type: 'number'; minimum?: number; maximum?: number };
// ... other variants
```

### 3.2 Our Current Duplication

We define JSON Schema types in **multiple places**:

**1. Generator Side** (`emit-input-schema.ts` lines 3-43):

```typescript
export interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyNumber { /* ... */ }
export interface JsonSchemaPropertyBoolean { /* ... */ }
export interface JsonSchemaPropertyArray<TItem> { /* ... */ }
export interface JsonSchemaObject { /* ... */ }

export type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | /* ... */
```

**2. Runtime Side** (`zod-input-schema.ts` lines 4-48):

```typescript
interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}
// ... similar definitions
```

**3. Generated Contract** (`tool-descriptor.contract.ts` lines 32-38):

```typescript
readonly toolInputJsonSchema: {
  readonly type: 'object';
  readonly properties?: Record<string, unknown>;
  readonly required?: string[];
  readonly additionalProperties?: boolean;
};
```

**❌ ISSUE**: We're defining JSON Schema structure 3 times with slight variations
**⚠️ CONCERN**: Violates DRY and "use library types" principle

### 3.3 Possible Sources for JSON Schema Types

**Option 1: MCP SDK**

- Check if `@modelcontextprotocol/sdk/types.js` exports JSON Schema types
- **Investigation Needed**: Review MCP SDK source or type definitions

**Option 2: JSON Schema Libraries**

- `@types/json-schema` - Official JSON Schema type definitions
- `json-schema-typed` - Strongly typed JSON Schema
- `ajv` - Exports `JSONSchemaType<T>`

**Option 3: Zod**

- Zod has `z.ZodSchema` but doesn't export JSON Schema type definitions
- Zod can convert to JSON Schema but doesn't provide the types

---

## 4. RECOMMENDATIONS

### 4.1 HIGH PRIORITY: Check MCP SDK for JSON Schema Types

**Action**: Inspect `@modelcontextprotocol/sdk/types.js` exports

**If MCP SDK exports JSON Schema types**:

```typescript
// In our generated code
import type { JSONSchema, JSONSchemaObject } from '@modelcontextprotocol/sdk/types.js';

export interface ToolDescriptor<...> extends Tool {
  readonly toolInputJsonSchema: JSONSchemaObject;  // Use MCP SDK type
  readonly inputSchema: JSONSchemaObject;          // Use MCP SDK type
  // ...
}
```

**Benefits**:

- ✅ Aligns with rules.md "use library types"
- ✅ Single source of truth from MCP SDK
- ✅ Automatic updates when MCP SDK changes
- ✅ Better type compatibility with MCP ecosystem

**If MCP SDK does NOT export JSON Schema types**:

- Continue with our definitions BUT
- Consolidate into a single shared definition
- Document why we define them ourselves

### 4.2 MEDIUM PRIORITY: Use `@types/json-schema` if MCP SDK Doesn't Provide

**If MCP SDK doesn't export JSON Schema types**, use the community standard:

```bash
pnpm add -D @types/json-schema
```

```typescript
import type { JSONSchema7 } from '@types/json-schema';

// Adapt to our readonly requirements
export type ToolInputJsonSchema = Readonly<JSONSchema7Object>;
```

**Benefits**:

- ✅ Industry standard type definitions
- ✅ Well-maintained by DefinitelyTyped community
- ✅ Aligns with "use library types" principle
- ⚠️ Would need readonly wrappers for our use case

### 4.3 MEDIUM PRIORITY: Consolidate Our JSON Schema Definitions

**Current State**: 3 places defining JSON Schema structures

**Target State**: 1 shared definition module

**Action Plan**:

1. Create `packages/sdks/oak-curriculum-sdk/src/types/json-schema.ts`
2. Define comprehensive, readonly JSON Schema types once
3. Import from this single location in:
   - Generator code (`type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`)
   - Runtime code (`src/mcp/zod-input-schema.ts`)
   - Generated contract (`tool-descriptor.contract.ts` template)

**Example**:

```typescript
// src/types/json-schema.ts
/**
 * JSON Schema type definitions for MCP tool inputs.
 *
 * @remarks These are defined locally because:
 * - MCP SDK doesn't export JSON Schema types [if true]
 * - We need readonly versions for generated code
 * - We use a subset of JSON Schema features
 */

export interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

// ... complete definitions

export type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | JsonSchemaPropertyBoolean
  | JsonSchemaPropertyArray
  | JsonSchemaObject;

export interface JsonSchemaObject {
  readonly type: 'object';
  readonly properties?: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
  readonly description?: string;
}
```

### 4.4 LOW PRIORITY: Consider Other MCP SDK Types

**Types to Consider Using**:

1. **`ListToolsResult`** (if exported):

   ```typescript
   // Instead of defining our own
   export interface UniversalToolListEntry {
     readonly name: UniversalToolName;
     readonly description?: string;
     readonly inputSchema: UniversalToolInputSchema;
   }

   // Could use
   import type { Tool } from '@modelcontextprotocol/sdk/types.js';
   export type UniversalToolListEntry = Tool & {
     // our extensions if any
   };
   ```

2. **Error Types** (if exported):
   - Use MCP SDK error types instead of our custom `McpToolError`
   - Ensures protocol compliance

3. **Request/Response Types**:
   - Already using `CallToolRequest`, `CallToolResult`
   - Could extend usage to other protocol messages

### 4.5 DOCUMENTATION: Document Type Decisions

**Action**: Add TSDoc comments explaining type source decisions

```typescript
/**
 * Tool descriptor contract used by all generated MCP tools.
 *
 * Extends Tool from @modelcontextprotocol/sdk/types.js to ensure
 * protocol compliance while adding SDK-specific metadata.
 *
 * @remarks
 * - JSON Schema types defined locally because [reason]
 * - Extends MCP SDK's Tool interface for protocol compliance
 * - See .agent/research/mcp-sdk-type-reuse-investigation.md
 *
 * @see {@link https://modelcontextprotocol.io/specification/latest/server/tools}
 */
export interface ToolDescriptor<...> extends Tool {
  // ...
}
```

---

## 5. ALIGNMENT WITH PROJECT RULES

### 5.1 Rules.md Compliance

**Rule**: "Use library types directly where possible"

**Current Status**: ⚠️ PARTIAL

- ✅ Using `Tool`, `CallToolResult`, `TextContent` from MCP SDK
- ❌ Defining our own JSON Schema types (3 times!)
- ✅ Extending rather than reimplementing `Tool`

**Target Status**: ✅ FULL

- Use MCP SDK types if available
- Use `@types/json-schema` if MCP SDK doesn't provide
- Document when we must define ourselves

### 5.2 Schema-First Execution

**Rule**: "Runtime files act only as very thin façades"

**Current Status**: ✅ GOOD

- Generated descriptors are the source of truth
- Runtime code imports generated types
- No runtime type generation

**Using MCP SDK Types**:

- ✅ Would NOT violate schema-first principle
- ✅ Would improve it - fewer local definitions
- ✅ Generation would still be source of truth

### 5.3 Type Safety

**Rule**: "Preserve type information as much as possible"

**Current Status**: ✅ EXCELLENT

- Strong typing throughout
- Literal types preserved
- Generics maintain specificity

**Using MCP SDK Types**:

- ✅ Would maintain or improve type safety
- ✅ Would ensure MCP protocol compliance
- ✅ Would reduce type drift risk

---

## 6. INVESTIGATION ACTION ITEMS

### Investigation Results (COMPLETED November 18, 2024)

**✅ MCP SDK Type Exports Confirmed**

Inspected `/node_modules/@modelcontextprotocol/sdk/dist/esm/types.d.ts`:

**Types Exported**:

- `Tool`, `ToolSchema` - Tool definition with JSON Schema embedded
- `ToolAnnotations`, `ToolAnnotationsSchema` - Tool metadata/hints
- `CallToolResult`, `CallToolResultSchema` - Tool execution results
- `CallToolRequest`, `CallToolRequestSchema` - Tool call requests
- `ListToolsResult`, `ListToolsResultSchema` - List tools response
- `ToolListChangedNotification` - Tool list change notifications
- Plus all other protocol types (Resources, Prompts, etc.)

**Critical Finding: NO Reusable JSON Schema Types**

The MCP SDK's `Tool` interface defines `inputSchema` inline as:

```typescript
inputSchema: z.ZodObject<{
  type: z.ZodLiteral<"object">;
  properties: z.ZodOptional<z.ZodObject<{}, "passthrough", ...>>;
  required: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "passthrough", ...>
```

**What this means**:

- ❌ MCP SDK does NOT export reusable `JSONSchema` or `JSONSchemaObject` types
- ✅ MCP SDK uses JSON Schema for protocol compliance (embedded in schemas)
- ✅ The `properties` field uses "passthrough" allowing any structure
- ✅ We ARE correctly extending `Tool` interface
- ⚠️ We MUST define our own JSON Schema types (no upstream option)

**Decision**: Proceed with Recommendation 4.3 (consolidate our definitions)

- Cannot use MCP SDK JSON Schema types (they don't export them)
- Should NOT use `@types/json-schema` (overkill, different constraints)
- MUST consolidate our 3 definitions into 1 shared module

---

## 7. RISK ASSESSMENT

### 7.1 Risks of Current Approach

**1. Type Drift**

- **Risk**: Our JSON Schema types diverge from MCP SDK
- **Impact**: MEDIUM - Could cause protocol incompatibilities
- **Likelihood**: LOW - We test against MCP SDK

**2. Maintenance Burden**

- **Risk**: We maintain types that upstream could provide
- **Impact**: LOW - Types are stable
- **Likelihood**: HIGH - We already have 3 definitions

**3. Breaking Changes**

- **Risk**: MCP SDK changes could break our types
- **Impact**: HIGH - Would require generator updates
- **Likelihood**: MEDIUM - MCP is evolving

### 7.2 Risks of Using MCP SDK Types

**1. Dependency Coupling**

- **Risk**: Tightly coupled to MCP SDK version
- **Impact**: MEDIUM - Upgrades more complex
- **Likelihood**: HIGH - Expected trade-off

**2. Type Incompatibility**

- **Risk**: MCP SDK types don't match our needs
- **Impact**: HIGH - Would need workarounds
- **Likelihood**: LOW - MCP SDK is well-designed

**3. Loss of Control**

- **Risk**: Can't customize types to our needs
- **Impact**: MEDIUM - Might need wrappers
- **Likelihood**: MEDIUM - Depends on use cases

### 7.3 Recommendation

**ADOPT MCP SDK types where available**:

- ✅ Better protocol compliance
- ✅ Less maintenance burden
- ✅ Aligns with rules.md
- ⚠️ Accept dependency coupling (it's our protocol!)

**For types NOT in MCP SDK**:

- Use `@types/json-schema` OR
- Consolidate our definitions into one place

---

## 8. CONCLUSION

### Summary of Findings (UPDATED: November 18, 2024)

1. **We ARE using MCP SDK types correctly** (`Tool`, `CallToolResult`, `ListToolsResult`, etc.) ✅
2. **MCP SDK does NOT export JSON Schema types** (investigation complete) ✅
3. **We MUST consolidate** our JSON Schema definitions (3 → 1) ⚠️
4. **We ALIGN with rules** but have justified duplication
5. **We correctly extend `Tool`** rather than redefine it ✅

### Additional Finding 1: Nested Structure Breaks Parameter Discovery ❌ CRITICAL

**Discovery Date**: November 18, 2024

**Issue**: Our generated schema structure doesn't match MCP SDK expectations for parameter registration.

**What We Generate**:

```typescript
{
  params: z.object({
    query: z.object({ q: z.string(), keyStage: z.union([...]), ... })
  })
}
```

**What MCP SDK Expects**:

```typescript
{ q: z.string(), keyStage: z.union([...]), ... }  // Flat structure
```

**Impact on MCP Clients**:

- Cursor UI shows: "params: No description"
- Actual parameters (`q`, `keyStage`, etc.) are hidden
- Parameter types not discoverable
- Even with descriptions (P1), they won't surface because parameters are nested

**Root Cause**:

- Our generator wraps everything in `params` for internal API type safety
- Within `params`, we separate `path` and `query` parameters
- This nested structure works for our SDK but breaks MCP parameter discovery

**Priority**: P0 - Must fix before parameter descriptions (P1) will be visible

**Why TypeScript Didn't Catch This**:

The `ZodRawShape` type is defined as:

```typescript
type ZodRawShape = { [k: string]: ZodTypeAny };
```

This **index signature is too permissive** - both flat and nested structures type-check successfully:

- `{ q: z.string() }` ✅ (flat, correct for MCP)
- `{ params: z.object({ q: z.string() }) }` ✅ (nested, incorrect but passes type-check)

The MCP SDK's `registerTool` signature cannot distinguish between these at compile time.

**Short-Term Solution**:

**See comprehensive implementation plan:**

**→ `.agent/plans/p0-mcp-flat-schema-type-safety.md`**

Key features:

- **First Question Applied**: "Could it be simpler?" YES! Simple validation, no branded types
- **Type Predicates**: Standard TypeScript `is` for type narrowing (no type assertions)
- **Spread Operator**: Preserves Zod types (no `Object.assign` widening)
- **Runtime Validation**: Throws helpful errors for invalid structures
- **Behavioral Test**: Integration test proving MCP protocol compliance (TDD)
- **No Type Shortcuts**: No `as`, no `any`, no `Object.*` methods
- **Fail Fast**: Helpful error messages pointing to root cause

Implementation:

- Simple unwrapping function in `apps/oak-curriculum-mcp-stdio/src/app/flat-mcp-schema.ts`
- Integration test proving flat parameter structure via MCP protocol
- Unit tests for pure transformation logic

**Why This Is Better**:

- ✅ Simpler (answered First Question - removed branded type complexity)
- ✅ Fully compliant with @rules.md (no type assertions, no `Object.*` methods)
- ✅ Uses standard TypeScript mechanisms (type predicates)
- ✅ Spread operator preserves types exactly

**Long-Term Solution Options**:

- **Option A**: Generate two schema formats (nested for SDK, flat for MCP)
- **Option B**: Eliminate `params` wrapper entirely (breaking change)
- Decision needed on architectural approach

**See Also**:

- `.agent/research/deep-reflection-schema-first-and-findings.md` (Priority 0)
- `.agent/research/mcp-tool-description-schema-flow-analysis.md` (Section 5.0)

### Additional Finding 2: Information Loss in Conversion

**Discovery**: While JSON Schema types from MCP SDK would be ideal, we've identified a separate issue with information loss during JSON Schema → Zod conversion:

- Generated JSON Schema has descriptions ✅
- Generated Zod schemas lack descriptions ❌
- Runtime conversion loses descriptions ❌

**Impact**: Even with consolidated JSON Schema types, we must address:

1. **Priority 0**: Unwrapping nested params structure (blocks parameter visibility)
2. **Priority 1**: Adding `.describe()` calls to generated Zod schemas
3. Preserving descriptions during runtime conversion
4. Improving error messages using Zod's detailed error info

**See**: `.agent/research/mcp-tool-description-schema-flow-analysis.md` (Section 2.1, 3.3, 3.4, 5.0) and `.agent/research/deep-reflection-schema-first-and-findings.md` (Sections 1, 6, 7, Priority 0) for detailed analysis.

### Final Recommendations

1. ✅ **CONTINUE** using MCP SDK protocol types (`Tool`, `CallToolResult`, etc.)
2. ✅ **CONSOLIDATE** our JSON Schema definitions into single shared module
3. ✅ **DOCUMENT** why we define JSON Schema types (MCP SDK doesn't export them)
4. ✅ **MAINTAIN** our `extends Tool` pattern for `ToolDescriptor`
5. ✅ **CONSIDER** using additional MCP SDK types (`ListToolsResult`, `ToolAnnotations`)

### Impact Assessment

**Benefits**:

- Better alignment with rules.md
- Reduced maintenance burden
- Improved protocol compliance
- Single source of truth

**Costs**:

- Time to investigate MCP SDK exports
- Time to refactor if adopting new types
- Testing to ensure no regressions

**Verdict**: **WORTH INVESTIGATING** - Potential high value for medium effort

---

## 9. REFERENCES

**Project Rules**:

- `.agent/directives/rules.md` - "Use library types directly where possible"
- `.agent/directives/schema-first-execution.md` - Schema-first architecture

**MCP Documentation**:

- [MCP Specification - Tools](https://modelcontextprotocol.io/specification/latest/server/tools)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

**JSON Schema**:

- [`@types/json-schema`](https://www.npmjs.com/package/@types/json-schema)
- [JSON Schema Specification](https://json-schema.org/)

**Current Usage**:

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`

---

**END OF INVESTIGATION**

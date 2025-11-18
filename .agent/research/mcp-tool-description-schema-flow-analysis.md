# COMPREHENSIVE MCP TOOL DESCRIPTION & SCHEMA FLOW ANALYSIS

**Date**: November 18, 2024  
**Scope**: OpenAPI Schema → SDK Generation → MCP Server Registration  
**Status**: Research & Analysis Complete

---

## EXECUTIVE SUMMARY

This report provides a deep analysis of how MCP tool descriptions, input schemas, and output schemas flow through our system, from OpenAPI schema definition through SDK code generation to MCP server registration. The analysis identifies both strengths and areas for improvement in our schema-first architecture.

**Key Finding**: Our system generally follows schema-first principles correctly, with tool metadata flowing from OpenAPI through generation, but there are critical gaps in how we're using the MCP TypeScript SDK's `registerTool` API and opportunities to leverage upstream SDK types.

**Alignment with Directives**:

- ✅ Follows `.agent/directives-and-memory/schema-first-execution.md` - All tool metadata generated at compile time
- ✅ Follows `.agent/directives-and-memory/rules.md` - No type shortcuts, schema-first architecture
- ⚠️ Partial alignment with type reuse principle - we could leverage more upstream SDK types

---

## 0. VERIFICATION SUMMARY (November 18, 2024)

### MCP SDK Type Exports ✅ VERIFIED

**Finding**: MCP SDK exports protocol types but NOT reusable JSON Schema types

**Types Available**:

- ✅ `Tool`, `ToolSchema` - Tool definitions (extends this correctly)
- ✅ `ToolAnnotations` - Tool metadata/hints
- ✅ `CallToolResult`, `CallToolRequest` - Tool execution types
- ✅ `ListToolsResult` - Tool list responses
- ❌ NO `JSONSchema` or `JSONSchemaObject` types exported

**Implication**: We MUST define our own JSON Schema types (no upstream option available)

**See Also**: `.agent/research/mcp-sdk-type-reuse-investigation.md` for full analysis

### Parameter Descriptions ⚠️ PARTIALLY VERIFIED

**Finding**: Parameter descriptions preserved in JSON Schema, MISSING in Zod

**Where Descriptions Appear**:

- ✅ TypeScript interfaces (JSDoc comments)
- ✅ JSON Schema `description` fields
- ✅ Error messages (via serialized JSON Schema)
- ❌ Zod schemas (no `.describe()` calls)

**Example from `get-key-stages-subject-lessons.ts`**:

**TypeScript** ✅:

```typescript
/** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here */
readonly keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
```

**JSON Schema** ✅:

```json
"keyStage": {
  "description": "Key stage slug to filter by, e.g. 'ks2'...",
  "enum": ["ks1","ks2","ks3","ks4"]
}
```

**Zod Schema** ❌:

```typescript
keyStage: z.union([z.literal('ks1'), z.literal('ks2'), z.literal('ks3'), z.literal('ks4')]);
// MISSING: .describe("Key stage slug to filter by...")
```

**Impact**:

- ✅ MCP clients see descriptions (from JSON Schema)
- ❌ Zod validation errors lack context
- ❌ Generated code less self-documenting
- ❌ Information loss violates schema-first principle

**Root Causes**:

1. Generation doesn't emit `.describe()` calls
2. Runtime conversion doesn't preserve descriptions

**Detailed Analysis**: See Section 2.3 and 3.3 below

---

## 1. TOOL DESCRIPTION FLOW: SOURCE TO DESTINATION

### 1.1 Official MCP Specification Requirements

**Source 1**: [MCP Specification - Tools](https://modelcontextprotocol.io/specification/latest/server/tools)

Per the official MCP specification, tool definitions must include:

- `name`: Unique identifier
- `description`: Detailed explanation
- `inputSchema`: JSON Schema defining expected parameters
- Optional `title`: Human-readable display name

**Source 2**: [MCP TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

The MCP TypeScript SDK's `registerTool` method expects:

```typescript
server.registerTool(
  name: string,
  {
    title?: string,
    description: string,
    inputSchema: { [key: string]: ZodType },  // ZodRawShape
    outputSchema?: { [key: string]: ZodType }
  },
  handler: (args) => Promise<CallToolResult>
)
```

**Critical Discovery**: The SDK expects `inputSchema` to be a **Zod RawShape** (a plain object with Zod types as values), NOT a JSON Schema object.

### 1.2 Our Current Implementation Flow

**Phase 1: OpenAPI Schema (Source of Truth)**

```text
OpenAPI Operation → description field
                 → parameters (path, query)
                 → responses
```

**Phase 2: SDK Code Generation**
Location: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/`

Key File: `emit-index.ts` (lines 180-191)

```typescript
function toToolDescription(operation: OperationObject): string | undefined {
  const raw = typeof operation.description === 'string' ? operation.description : '';
  if (!raw.trim()) {
    return undefined;
  }
  const updated = raw
    .replace(/\bThis endpoint\b/gi, (match) => (match[0] === 'T' ? 'This tool' : 'this tool'))
    .replace(/\s+/g, ' ')
    .trim();
  return updated.length > 0 ? updated : undefined;
}
```

**✅ GOOD**: Description is extracted ONCE at generation time
**✅ GOOD**: Description transformation happens at generation time (not runtime)
**⚠️ NOTE**: Description is **optional** in generated descriptors (`description?: string`)

**Phase 3: Generated Tool Descriptors**
Location: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/*.ts`

Example (`get-subjects.ts`, line 88):

```typescript
export const getSubjects = {
  // ... other properties
  description: "This tool returns an array of all available subjects...",
  toolInputJsonSchema: { type: 'object', properties: {...}, ... },
  toolZodSchema: z.object({ params: z.object({}) }),
  inputSchema: toolInputJsonSchema,  // Duplicate field!
  // ...
} as const satisfies ToolDescriptor<...>;
```

**✅ GOOD**: Description flows from OpenAPI through to descriptor
**❌ ISSUE**: Both `toolInputJsonSchema` (JSON Schema) AND `toolZodSchema` (Zod) are generated
**❌ ISSUE**: `inputSchema` field duplicates `toolInputJsonSchema`

**Phase 4: MCP Server Registration**
Location: `apps/oak-curriculum-mcp-stdio/src/app/server.ts` (line 238)

```typescript
server.registerTool(
  name,
  {
    title: name, // ⚠️ Using tool name as title
    description, // ✅ From descriptor
    inputSchema: input, // ⚠️ This is zodRawShapeFromToolInputJsonSchema result
  },
  handler,
);
```

Where `input` comes from (line 225):

```typescript
const input = zodRawShapeFromToolInputJsonSchema(descriptor.inputSchema);
```

---

## 2. CRITICAL ISSUES IDENTIFIED

### 2.1 JSON Schema vs Zod Schema - Information Loss

**Issue**: We generate BOTH formats but lose information in the process

**What We Generate**:

1. `toolInputJsonSchema`: JSON Schema object (WITH descriptions) ✅
2. `toolZodSchema`: Zod schema (WITHOUT descriptions) ❌
3. `inputSchema`: Alias to `toolInputJsonSchema` (redundant)

**What MCP SDK Expects**:

- `registerTool` expects `inputSchema` to be a **Zod RawShape** object
- Protocol `tools/list` returns JSON Schema to clients

**Actual Flow** (Not a Cycle):

```text
Generation Time:
OpenAPI Schema
  → Extract metadata (WITH descriptions)
  → Generate JSON Schema (WITH descriptions) ✅
  → Generate Zod schema (WITHOUT descriptions) ❌
  → Both emitted to file

Runtime - MCP Server Registration:
descriptor.inputSchema (JSON Schema WITH descriptions)
  → zodRawShapeFromToolInputJsonSchema()
  → Zod RawShape (loses descriptions) ❌
  → McpServer.registerTool(inputSchema: zodRawShape)

Runtime - MCP Protocol tools/list:
descriptor.inputSchema (JSON Schema WITH descriptions)
  → Returned directly to client ✅
  → NO conversion, descriptions preserved
```

**Information Loss Occurs Twice**:

1. Generation: Zod schemas emitted without `.describe()` calls
2. Runtime: JSON Schema → Zod RawShape conversion loses descriptions

**We DON'T convert back to JSON Schema** - the JSON Schema returned to clients is the original generated one (with descriptions intact).

**✅ CORRECT**: We ARE converting JSON Schema → Zod RawShape for registration
**❌ ISSUE**: Both generated and runtime-converted Zod lack descriptions
**⚠️ INEFFICIENT**: Generate both formats when we could use generated Zod directly

**Source**: [MCP TypeScript SDK Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples) show `inputSchema` as Zod RawShape objects.

### 2.2 Runtime Modification of Descriptions

Location: `apps/oak-curriculum-mcp-stdio/src/app/server.ts` (lines 117-125)

```typescript
function ensureDescriptorDescription(
  descriptor: { readonly description?: string },
  toolName: string,
): string {
  if (typeof descriptor.description !== 'string' || descriptor.description.trim().length === 0) {
    throw new Error(`Tool descriptor missing description for ${toolName}`);
  }
  return descriptor.description;
}
```

**✅ GOOD**: No runtime modification - just validation
**⚠️ CONCERN**: Throws at runtime if description missing (should fail at generation time)
**ALIGNMENT**: Partially violates schema-first principle - validation should happen at build time

### 2.3 Parameter Description Flow

**⚠️ MIXED RESULTS**: Parameter descriptions flow correctly to JSON Schema but NOT to Zod

From OpenAPI:

```yaml
parameters:
  - name: lesson
    in: path
    description: 'The slug of the lesson'
    schema:
      type: string
```

To Generated Code (`get-lessons-summary.ts`, lines 23-26):

```typescript
export interface ToolPathParams {
  /** The slug of the lesson */
  readonly lesson: string;
}
```

To JSON Schema (line 33) **✅ HAS DESCRIPTIONS**:

```json
{
  "lesson": {
    "type": "string",
    "description": "The slug of the lesson"
  }
}
```

To Zod Schema (line 34) **❌ MISSING DESCRIPTIONS**:

```typescript
z.object({ params: z.object({ path: z.object({ lesson: z.string() }) }) });
// Should be: lesson: z.string().describe("The slug of the lesson")
```

**VERIFIED** (from `get-key-stages-subject-lessons.ts`):

**In TypeScript Interface** ✅:

```typescript
export interface ToolPathParams {
  /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here */
  readonly keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
}
```

**In JSON Schema** ✅:

```json
"keyStage": {
  "type": "string",
  "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
  "enum": ["ks1","ks2","ks3","ks4"]
}
```

**In Zod Schema** ❌:

```typescript
keyStage: z.union([z.literal('ks1'), z.literal('ks2'), z.literal('ks3'), z.literal('ks4')]);
// Missing: .describe("Key stage slug to filter by...")
```

**✅ CONFIRMED**: Descriptions ARE preserved in:

1. TypeScript JSDoc comments ✅
2. JSON Schema `description` fields ✅
3. Error messages (serialized JSON Schema) ✅

**❌ ISSUE**: Descriptions NOT preserved in:

1. Zod schemas ❌ - no `.describe()` calls generated
2. Runtime Zod validation error messages ❌ - lack context

### 2.4 Tools Without Parameters

**Handling**: Tools with no parameters use sentinel type

Example (`get-subjects.ts`, line 20):

```typescript
export interface ToolParams {
  readonly __noParams?: never;
}
```

And still generate schemas:

```typescript
toolInputJsonSchema = {
  type: 'object',
  properties: {"params":{"type":"object","properties":{},...}},
  ...
};
toolZodSchema = z.object({ params: z.object({}) });
```

**✅ GOOD**: Uniform handling - all tools have same structure
**✅ GOOD**: Type safety preserved with `never` type for sentinel
**❓ QUESTION**: Is the `{ params: {} }` wrapper necessary for MCP SDK?

---

## 3. TYPE INFORMATION PRESERVATION ANALYSIS

### 3.1 Type Widening Check

**✅ PASS**: No type widening detected in generation flow

Evidence:

- Generated types use literal types: `'get-subjects' as const`
- Enums preserved: `z.union([z.literal('value1'), z.literal('value2')])`
- Parameter types stay specific: `string`, `number`, not `unknown`

**ALIGNMENT**: ✅ Fully complies with rules.md type preservation requirements

### 3.2 Type Narrowing in Conversion

Location: `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`

```typescript
function zodForProperty(prop: JsonSchemaProperty): z.ZodTypeAny {
  switch (prop.type) {
    case 'string': {
      return Array.isArray(prop.enum) ? buildEnumStringSchema(prop.enum) : z.string();
    }
    // ... other cases
    default:
      return z.any(); // ⚠️ Falls back to `any`
  }
}
```

**❌ ISSUE**: Fallback to `z.any()` violates MULTIPLE rules (triple violation)
**SEVERITY**: CRITICAL - violates three core principles
**VIOLATIONS**:

1. "Never use `any`" - explicit type system violation
2. "Don't add fallback options" - we DO know what types are needed
3. "Fail fast and hard with helpful errors" - this fails silently

**RECOMMENDATION**: Throw TypeError with helpful message
**ALIGNMENT**: ❌ Triple violation of rules.md core principles

### 3.3 Information Loss in Zod Conversion

**VERIFIED** (November 18, 2024): Current generation and conversion loses metadata

**What's Lost**:

- ❌ Field descriptions in generated Zod (no `.describe()` calls emitted)
- ❌ Field descriptions in runtime Zod conversion (not transferred from JSON Schema)
- ❌ Default values in Zod schemas
- ⚠️ Format/Min/Max constraints (not used in our current parameters)

**Evidence from `get-key-stages-subject-lessons.ts`**:

**JSON Schema (generated, line 47)** ✅ HAS DESCRIPTIONS:

```json
{
  "keyStage": {
    "type": "string",
    "description": "Key stage slug to filter by, e.g. 'ks2'...",
    "enum": ["ks1", "ks2", "ks3", "ks4"]
  }
}
```

**Zod Schema (generated, line 48)** ❌ MISSING DESCRIPTIONS:

```typescript
keyStage: z.union([z.literal('ks1'), z.literal('ks2'), z.literal('ks3'), z.literal('ks4')]);
// Missing: .describe("Key stage slug to filter by, e.g. 'ks2'...")
```

**Impact**:

- ✅ MCP clients see descriptions (from JSON Schema in `tools/list` response)
- ❌ Zod validation errors lack parameter context
- ❌ Generated Zod schemas are less self-documenting
- ❌ Runtime Zod conversion loses descriptions
- ❌ Developer experience degraded

**Root Causes**:

1. **Generation**: `emit-input-schema.ts` doesn't emit `.describe()` calls in Zod
2. **Runtime Conversion**: `zod-input-schema.ts` doesn't add descriptions when converting

**Source**: [Zod documentation](https://zod.dev) shows `.describe()` method for adding descriptions to Zod schemas.

### 3.4 safeParse Error Handling - Incomplete

**Pattern Used** (Generated runtime code):

```typescript
const parsed = descriptor.toolZodSchema.safeParse(rawArgs);
if (!parsed.success) {
  throw new TypeError(descriptor.describeToolArgs()); // Generic JSON schema
}
const args = parsed.data;
```

**✅ CORRECT**: Using `safeParse` (Result pattern)

- Rules say: "Prefer `Result<T, E>` over exceptions, and handle all cases explicitly"
- We ARE handling all cases (checking `.success`)

**❌ INCOMPLETE**: Not using Zod's detailed error information

```typescript
// What Zod provides:
parsed.error.issues = [
  {
    path: ['params', 'path', 'keyStage'],
    message: 'Invalid enum value. Expected "ks1" | "ks2" | "ks3" | "ks4", received "ks5"',
  },
];

// What we throw:
('Invalid request parameters. Please match the following schema: {...entire JSON schema...}');
```

**Better Approach**:

```typescript
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new TypeError(
    `Invalid arguments for tool '${toolName}':\n${issues}\n\n` +
      `Expected schema:\n${descriptor.describeToolArgs()}`,
  );
}
```

**SEVERITY**: MEDIUM

- Doesn't break functionality but degrades developer experience
- Violates "fail fast and hard with HELPFUL errors"
- Information exists but we're not using it

**ALIGNMENT**:

- ✅ Follows Result pattern principle
- ❌ Misses "helpful errors" principle

**Note**: This becomes even more helpful after adding descriptions to Zod schemas (Priority 1)

---

## 4. ZOD VS JSON SCHEMA: CORRECT USAGE

### 4.1 Official Guidance

**Source 1**: [MCP Specification](https://modelcontextprotocol.io/specification/latest/server/tools)

> "Tools are schema-defined interfaces that LLMs can invoke. MCP uses JSON Schema for validation."

**Source 2**: [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

> Examples show `inputSchema` as Zod RawShape objects passed to `registerTool`

### 4.2 Correct Pattern

**For MCP Protocol** (`tools/list` response):

```json
{
  "name": "tool-name",
  "description": "...",
  "inputSchema": {
    "type": "object",
    "properties": {...},
    "required": [...]
  }
}
```

→ Use JSON Schema

**For MCP SDK Registration** (`McpServer.registerTool`):

```typescript
server.registerTool(
  'tool-name',
  {
    description: '...',
    inputSchema: {
      param1: z.string().describe('...'),
      param2: z.number().describe('...'),
    },
  },
  handler,
);
```

→ Use Zod RawShape

**For Runtime Validation**:

```typescript
const schema = z.object({ ... });
const result = schema.safeParse(input);
```

→ Use Zod schemas

### 4.3 Our Current Usage

| Location                       | What We Use              | What We Should Use            | Status     |
| ------------------------------ | ------------------------ | ----------------------------- | ---------- |
| Generated descriptors          | Both JSON Schema & Zod   | Both (for different purposes) | ✅ CORRECT |
| `registerTool` inputSchema     | Zod RawShape (converted) | Zod RawShape                  | ✅ CORRECT |
| `tools/list` protocol response | JSON Schema              | JSON Schema                   | ✅ CORRECT |
| Runtime validation             | Zod                      | Zod                           | ✅ CORRECT |
| Output validation              | Zod                      | Zod                           | ✅ CORRECT |

**Overall**: ✅ Usage is correct, but flow is inefficient

---

## 5. RECOMMENDATIONS

### 5.0 CRITICAL PRIORITY: Unwrap Nested params/query/path Structure

**Discovery Date**: November 18, 2024

**The Problem**: Architectural mismatch between our generated schema structure and MCP SDK expectations

**What Cursor UI Shows**:

```text
Parameters:
• params: No description
```

**Why This Happens**:

Our generated schemas have nested structure:

```typescript
{
  params: z.object({
    query: z.object({
      q: z.string(),
      keyStage: z.union([...]).optional(),
      subject: z.union([...]).optional(),
      unit: z.string().optional()
    })
  })
}
```

MCP SDK expects flat structure:

```typescript
{
  q: z.string(),
  keyStage: z.union([...]).optional(),
  subject: z.union([...]).optional(),
  unit: z.string().optional()
}
```

**Root Cause** (from `buildInputSchemaObject` in `emit-input-schema.ts`):

Lines 176-181 wrap everything in `params`:

```typescript
return {
  type: 'object',
  properties: { params: paramsSchema }, // ← Wraps everything
  required: ['params'],
  additionalProperties: false,
};
```

Lines 147-167 create `path` and `query` sub-objects within `paramsSchema`:

```typescript
if (Object.keys(pathSection.properties).length > 0) {
  paramsProperties.path = {
    /* path params as nested object */
  };
}
if (Object.keys(querySection.properties).length > 0) {
  paramsProperties.query = {
    /* query params as nested object */
  };
}
```

**Impact**:

- ❌ MCP clients (Cursor) see ONE parameter: `params` (opaque object)
- ❌ Actual parameters (`q`, `keyStage`, etc.) hidden from discovery
- ❌ Parameter types not visible in UI
- ❌ Parameter descriptions (even when added) won't surface
- ❌ Developers can't see what parameters the tool expects
- ❌ LLMs can't properly understand tool signatures

**Why We Have This Structure**:

- Provides internal type safety for our SDK
- Separates path parameters from query parameters
- Works well for TypeScript interfaces
- **But not appropriate for MCP tool registration**

**Why TypeScript Didn't Catch This**:

The `ZodRawShape` type is defined as:

```typescript
type ZodRawShape = { [k: string]: ZodTypeAny };
```

This **index signature is too permissive** - it allows both flat and nested structures:

- `{ q: z.string() }` ✅ (flat, correct)
- `{ params: z.object({ q: z.string() }) }` ✅ (nested, incorrect but type-checks!)

The MCP SDK's `registerTool` signature cannot distinguish between these at compile time.

**Short-Term Fix** (5.0a):

**See comprehensive implementation plan:**

**→ `.agent/plans/p0-mcp-flat-schema-type-safety.md`**

The plan includes:

- **First Question Applied**: "Could it be simpler?" YES! Simple validation, no branded types
- **Behavioral Test**: Integration test proving MCP protocol compliance (TDD - Red first)
- **Type Predicates**: Standard TypeScript `is` for type narrowing
- **Spread Operator**: Preserves Zod types (no `Object.assign` widening)
- **Error Handling**: Fail fast with helpful messages
- **No Type Shortcuts**: No `as`, no `any`, no `Object.*` methods

Key implementation:

```typescript
// In apps/oak-curriculum-mcp-stdio/src/app/flat-mcp-schema.ts
function isZodObject(zodType: z.ZodTypeAny): zodType is z.ZodObject<z.ZodRawShape> {
  return zodType._def?.typeName === 'ZodObject';
}

export function unwrapToFlatMcpSchema(zodRawShape: z.ZodRawShape): z.ZodRawShape {
  // Simple unwrapping using spread operator to preserve types
  // See .agent/plans/p0-mcp-flat-schema-type-safety.md
}

// In apps/oak-curriculum-mcp-stdio/src/app/server.ts
const nestedInput = zodRawShapeFromToolInputJsonSchema(descriptor.inputSchema);
const flatInput = unwrapToFlatMcpSchema(nestedInput);
server.registerTool(name, { title: name, description, inputSchema: flatInput }, handler);
```

**Testing Strategy**:

1. **Unit Tests**: Pure function `unwrapToFlatMcpSchema` (no I/O, no mocks)
2. **Integration Tests**: `registerMcpTools` + MCP SDK (in-process, MCP protocol compliance)
3. **Manual Verification**: Run MCP server, check Cursor UI shows individual parameters

**Why This Is Better**:

- ✅ Simpler (answered First Question)
- ✅ Fully compliant with @rules.md (no type assertions, no `Object.assign`)
- ✅ Uses standard TypeScript type predicates (`is`)
- ✅ Spread operator preserves types exactly

**Long-Term Fix** (5.0b):

**Option A**: Generate two schema variants:

```typescript
// For our SDK API (current structure)
readonly toolInputJsonSchema: { params: { query: {...}, path: {...} } }

// NEW: For MCP registration (flat structure)
readonly toolMcpFlatSchema: { param1: ..., param2: ... }
```

**Option B**: Change generator architecture:

- Eliminate `params` wrapper entirely
- Generate flat structure from the start
- Update all TypeScript interfaces
- Breaking change (requires major version bump)

**Decision Criteria**:

- Does eliminating `params` wrapper lose valuable information?
- How does it affect our SDK's API ergonomics?
- Which better aligns with schema-first principles?

### 5.1 HIGH PRIORITY: Enhance Zod Schema Generation

**Current**:

```typescript
z.string();
```

**Should Be**:

```typescript
z.string().describe('The slug of the lesson');
```

**Action**: Update `emit-input-schema.ts` to emit Zod schemas with descriptions

**Implementation**:

```typescript
function buildZodType(meta: ParamMetadata): string {
  const base = /* existing logic */;
  if (meta.description) {
    return `${base}.describe(${JSON.stringify(meta.description)})`;
  }
  return base;
}
```

**Testing Strategy**: Unit tests for `buildZodType` with description metadata
**Alignment**: ✅ Follows TDD principles from testing-strategy.md

### 5.2 MEDIUM PRIORITY: Eliminate Redundant Conversions

**Current Flow**:

```text
Generation Time: Generate both JSON Schema & Zod
Runtime: JSON Schema → Zod RawShape conversion
```

**Better Flow Option A** (Keep Both):

```text
Generation Time: Generate JSON Schema & Zod (with descriptions)
Runtime: Use pre-generated Zod directly
```

**Better Flow Option B** (Single Source):

```text
Generation Time: Generate only Zod schemas (with descriptions)
Runtime: Use Zod directly
         Generate JSON Schema from Zod for protocol (if needed)
```

**Recommendation**: Option A - Keep both for protocol compliance and performance
**Alignment**: ✅ Follows schema-first-execution.md directive

### 5.3 MEDIUM PRIORITY: Make Descriptions Required

**Current**: Descriptions are optional (`description?: string`)

**Should Be**: Descriptions required at generation time

**Action**:

1. Update `ToolDescriptor` contract to make `description` required
2. Update generator to fail if OpenAPI operation lacks description
3. Remove runtime `ensureDescriptorDescription` check (caught at build time)

**Alignment**: ✅ Aligns with schema-first-execution.md - fail fast at generation time

### 5.4 LOW PRIORITY: Tool Titles

**Current**: Using tool name as title (`title: name`)

**MCP Spec Recommends**: Separate human-readable title

**Example**:

```typescript
// Current
{ title: "get-lessons-summary", description: "..." }

// Better
{ title: "Get Lesson Summary", description: "..." }
```

**Action**: Generate proper titles from OpenAPI `summary` field or transform tool names

### 5.5 HIGH PRIORITY: Remove `z.any()` Fallback

**Location**: `zod-input-schema.ts` line 94

**Current**:

```typescript
default:
  return z.any();
```

**Should Be**:

```typescript
default:
  throw new TypeError(
    `Unsupported JSON Schema type: ${(prop as any).type}. ` +
    `This is a generator bug - all OpenAPI schema types must be supported. ` +
    `Supported types: string, number, boolean, array, object.`
  );
```

**Alignment**: ✅ Follows rules.md prohibition on type shortcuts, fallbacks, and silent failures
**Note**: This is a triple violation fix - critical priority

### 5.6 MEDIUM PRIORITY: Improve Error Message Formatting

**Location**: `generated/runtime/execute.ts` (or template that generates it)

**Current**:

```typescript
const parsed = descriptor.toolZodSchema.safeParse(rawArgs);
if (!parsed.success) {
  throw new TypeError(descriptor.describeToolArgs());
}
```

**Should Be**:

```typescript
const parsed = descriptor.toolZodSchema.safeParse(rawArgs);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      return `  - ${path}: ${issue.message}`;
    })
    .join('\n');

  throw new TypeError(
    `Invalid arguments for tool '${toolName}':\n${issues}\n\n` +
      `Expected schema:\n${descriptor.describeToolArgs()}`,
  );
}
```

**Testing Strategy**:

- Unit tests with invalid arguments
- Verify error messages contain specific field paths and issues

**Alignment**: ✅ Follows "fail fast and hard with HELPFUL errors"
**Note**: Becomes even better after Priority 1 (Zod descriptions added)

### 5.7 DOCUMENTATION: Clarify Dual Schema Purpose

**Action**: Add documentation explaining why we maintain both JSON Schema and Zod:

1. **JSON Schema**: For MCP protocol, client discovery, documentation
2. **Zod Schema**: For runtime validation, type inference, error messages

---

## 6. ANSWERS TO SPECIFIC QUESTIONS

### Q: "Where do we generate the tool descriptions?"

**A**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts` (lines 180-191)

- Extracted from OpenAPI `operation.description`
- Transformed ("endpoint" → "tool")
- Emitted as part of tool descriptor constant

### Q: "Do we modify them?"

**A**: YES, but only at generation time (✅ CORRECT):

- Text transformation: "This endpoint" → "This tool"
- Whitespace normalization
- NO runtime modifications (only runtime validation)

**ALIGNMENT**: ✅ Follows schema-first-execution.md

### Q: "Are the types properly flowing without widening?"

**A**: YES, mostly (✅ GOOD):

- Literal types preserved: `'get-subjects' as const`
- Enum types preserved: `z.union([z.literal(...), ...])`
- Parameter types stay specific
- ⚠️ ONE ISSUE: Zod conversion has `z.any()` fallback (should throw instead)

**ALIGNMENT**: ⚠️ Mostly complies with rules.md, one violation

### Q: "Are we using correct formats and metadata fields?"

**A**: PARTIALLY (⚠️ NEEDS IMPROVEMENT):

- ✅ Correct: JSON Schema format matches MCP spec
- ✅ Correct: Zod RawShape for SDK registration
- ❌ Missing: Descriptions in Zod schemas (`.describe()`)
- ❌ Missing: Proper `title` fields (using name instead)
- ❌ Missing: `summary` field extraction

### Q: "Are we doing MCP tools right?"

**A**: MOSTLY YES, with improvements needed:

**✅ Doing Right**:

1. Schema-first architecture (OpenAPI → generation → runtime)
2. Single source of truth (descriptions defined once)
3. Type safety preserved through generation
4. Correct Zod RawShape for SDK registration
5. Proper JSON Schema for protocol responses
6. Uniform handling of tools with/without parameters
7. Output validation implemented

**❌ Needs Improvement**:

0. **CRITICAL**: Nested params/query/path structure breaks parameter discovery in MCP clients
1. Zod schemas missing descriptions (both generation and runtime)
2. Information loss in JSON Schema → Zod conversion flow
3. Descriptions optional instead of required at generation time
4. Tool titles not properly generated
5. Fallback to `z.any()` violates rules (triple violation: any, fallbacks, silent failure)
6. Not using Zod's detailed error information in safeParse handling
7. Not leveraging all upstream MCP SDK types (see separate investigation)

**Impact**: System works correctly but has maintainability and DX issues

---

## 7. ALIGNMENT WITH PROJECT DIRECTIVES

### 7.1 Schema-First Execution Directive

**Reference**: `.agent/directives-and-memory/schema-first-execution.md`

| Requirement                                        | Status     | Evidence                           |
| -------------------------------------------------- | ---------- | ---------------------------------- |
| All runtime behavior driven by generated artifacts | ✅ PASS    | Descriptors generated from OpenAPI |
| Contract defines generic interfaces                | ✅ PASS    | `ToolDescriptor` contract exists   |
| Definitions are canonical literal map              | ✅ PASS    | `MCP_TOOL_DESCRIPTORS` constant    |
| Aliases derived from literal map                   | ✅ PASS    | `ToolArgsForName`, etc.            |
| Runtime uses generated helpers                     | ✅ PASS    | `executeToolCall`, validation      |
| No hand-authoring types that widen                 | ⚠️ PARTIAL | `z.any()` fallback violates        |
| No editing generated files manually                | ✅ PASS    | Clear "DO NOT EDIT" headers        |
| Generator-first mindset                            | ✅ PASS    | Changes go through templates       |

**Overall Alignment**: ✅ Strong compliance with minor violations

### 7.2 Core Rules

**Reference**: `.agent/directives-and-memory/rules.md`

| Rule                                                    | Status                 | Evidence                         |
| ------------------------------------------------------- | ---------------------- | -------------------------------- |
| Cardinal Rule: ALL types from schema at compile time    | ✅ PASS                | `pnpm type-gen` drives all types |
| No type shortcuts (as, any, !, Record<string, unknown>) | ⚠️ PARTIAL             | One `z.any()` fallback           |
| Preserve type information                               | ✅ PASS                | Literal types, enums preserved   |
| Single source of truth for types                        | ✅ PASS                | OpenAPI schema                   |
| Use library types directly                              | ⚠️ NEEDS INVESTIGATION | Not using MCP SDK types?         |
| Validate external signals                               | ✅ PASS                | Zod validation at boundaries     |
| Type imports labeled with `type`                        | ✅ PASS                | Consistent usage                 |

**Overall Alignment**: ✅ Strong compliance, areas for improvement identified

### 7.3 Testing Strategy

**Reference**: `docs/agent-guidance/testing-strategy.md`

| Principle                               | Status                | Evidence                        |
| --------------------------------------- | --------------------- | ------------------------------- |
| TDD - tests first                       | ⚠️ UNKNOWN            | Need to verify test coverage    |
| Test behavior, not implementation       | ✅ PASS               | E2E tests verify tool execution |
| Pure functions first                    | ✅ PASS               | Generation functions are pure   |
| No complex mocks                        | ✅ PASS               | Simple stub adapters            |
| Unit tests for pure functions           | ⚠️ NEEDS VERIFICATION | Check coverage                  |
| Integration tests for tool interactions | ✅ PASS               | E2E tests exist                 |

**Overall Alignment**: ⚠️ Testing principles followed, coverage needs verification

---

## 8. REFERENCES

**Official MCP Documentation**:

1. [MCP Specification - Tools](https://modelcontextprotocol.io/specification/latest/server/tools)
2. [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
3. [MCP TypeScript SDK Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples)

**Zod Documentation**:

1. [Zod Official Docs](https://zod.dev)
2. [Zod `.describe()` method](https://zod.dev/#describe)
3. [JSON Schema to Zod Conversion](https://github.com/dmitryrechkin/json-schema-to-zod)

**TypeScript Best Practices**:

1. [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
2. [Schema-First API Development](https://swagger.io/resources/articles/adopting-an-api-first-approach/)

---

## 9. APPENDIX: FILE INVENTORY

**Schema Definition**:

- OpenAPI Schema: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

**Code Generation**:

- Main Generator: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts`
- Description Extraction: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`
- Schema Generation: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`
- Parameter Metadata: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/param-metadata.ts`

**Generated Artifacts**:

- Tool Descriptors: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/*.ts`
- Definitions: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/definitions.ts`
- Contract: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/contract/tool-descriptor.contract.ts`

**Runtime Conversion**:

- Zod Conversion: `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`

**MCP Server Registration**:

- STDIO Server: `apps/oak-curriculum-mcp-stdio/src/app/server.ts`
- HTTP Server: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

---

**END OF REPORT**

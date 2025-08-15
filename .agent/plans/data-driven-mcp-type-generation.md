# Data-Driven MCP Type Generation Plan - Minimal Lookup Architecture

## Status: IMPLEMENTATION BLOCKED - TypeScript Limitation Discovered (85% Complete)

## Previous Approaches (Abandoned)

1. **TOOL_EXECUTORS**: Function references created union types when accessed dynamically
2. **Embedded Tool Information**: Duplicated data that already exists in the schema

## The Final Insight: Minimal Lookup Table

After extensive analysis, the solution is simpler than all previous approaches: **Generate only a minimal lookup from tool names to schema coordinates**. Everything else already exists in the schema.

### Core Principle

We need exactly ONE additional data structure:

```typescript
// The ONLY generated structure needed
export const TOOL_LOOKUP = {
  'oak-get-sequences-units': {
    path: '/sequences/{sequence}/units' as const,
    method: 'GET' as const
  }
} as const;

// Everything else comes from the schema
const { path, method } = TOOL_LOOKUP[toolName];
const operation = schema.paths[path][method]; // All data is here
```

## Why This Approach Succeeds

### 1. Absolute Minimum Redundancy

- Only tool name → path/method mapping is new
- Parameters, descriptions, types all live in schema
- No data duplication

### 2. Perfect Type Preservation

- Literal types in TOOL_LOOKUP
- Direct schema access maintains all types
- Type guards prove validity without assertions

### 3. Maximum Simplicity

- One lookup table
- One type guard
- Direct client access

## Implementation Plan

### Phase 1: Schema Export (First Priority) ✅ COMPLETE

#### 1.1 Export Schema as Runtime Constant

- [x] Export full OpenAPI schema as const
- [x] Ensure schema is available at runtime  
- [x] Types flow from runtime schema

### Phase 2: Minimal Lookup Generation ✅ COMPLETE

#### 2.1 Generate TOOL_LOOKUP

- [x] Map tool names to path/method only (TOOL_METADATA)
- [x] Use literal types with `as const`
- [x] No parameter duplication

#### 2.2 Generate Type Guard

- [x] Simple `isToolName` function
- [x] Returns type predicate
- [x] No complex validation

### Phase 3: Execute Tool Implementation ❌ BLOCKED

#### 3.1 Simple Execution Pattern

```typescript
export function executeToolCall(
  toolName: unknown,
  params: unknown,
  client: OakApiPathBasedClient
) {
  // Type guard narrows to specific tool
  if (!isToolName(toolName)) {
    return { error: `Unknown tool: ${String(toolName)}` };
  }
  
  // Get coordinates from lookup
  const { path, method } = TOOL_LOOKUP[toolName];
  
  // Get operation from schema for validation
  const operation = schema.paths[path][method];
  
  // Validate params against operation.parameters
  const validated = validateParams(operation, params);
  if (!validated) {
    return { error: 'Invalid parameters' };
  }
  
  // Direct client access - no intermediate functions
  return client[path][method](validated);
}
```

### Phase 4: Cleanup

- [ ] Remove all intermediate structures
- [ ] Remove TOOL_EXECUTORS
- [ ] Remove PARAM_VALIDATORS
- [ ] Remove complex generators
- [ ] Update imports across codebase

### Phase 5: Report on possibilities of generalisation

Write a short report on what about this process and workspace is specific to the Oak API and what is generic to any API with an OpenAPI schema.

Postulate as to what would be required to separate general framework from Oak API specific configuration.

Write the report to the .agent/plans directory.

Have the type reviewer review the plan, and use the review to refine the plan.

## Technical Details

### Generated TOOL_LOOKUP Structure

```typescript
// Complete structure - nothing more needed
export const TOOL_LOOKUP = {
  'oak-get-sequences-units': {
    path: '/sequences/{sequence}/units' as const,
    method: 'GET' as const
  },
  'oak-get-lessons-transcript': {
    path: '/lessons/{lesson}/transcript' as const,
    method: 'GET' as const
  },
  // ... all 27 tools with just path/method
} as const;

export type ToolName = keyof typeof TOOL_LOOKUP;

export function isToolName(value: unknown): value is ToolName {
  return typeof value === 'string' && value in TOOL_LOOKUP;
}
```

### Parameter Validation

```typescript
// Use schema's parameter definitions directly
function validateParams(operation: any, params: unknown) {
  if (!operation.parameters) return {};
  
  // Validate against operation.parameters from schema
  // Transform MCP flat structure to OpenAPI structure
  // Return null if invalid, transformed params if valid
}
```

## Success Criteria

1. **Zero type assertions** - Type guards prove everything
2. **Minimal generation** - Only TOOL_LOOKUP needed
3. **No data duplication** - Schema is single source of truth
4. **Direct access pattern** - No intermediate functions
5. **Simple validation** - Use schema's parameter definitions

## Key Differences from Previous Approaches

### What We're NOT Doing

- NOT generating TOOL_EXECUTORS (function references)
- NOT generating PARAM_VALIDATORS (complex validators)
- NOT duplicating parameter lists
- NOT creating intermediate type structures
- NOT embedding tool info in operations

### What We ARE Doing

- Exporting schema as runtime constant
- Generating minimal TOOL_LOOKUP (name → coordinates)
- Using simple type guard
- Accessing schema directly for all data
- Validating against schema's parameter definitions

## Risk Mitigation

- **Risk**: Schema might be large
- **Mitigation**: Tree-shaking removes unused parts, schemas are typically small

- **Risk**: Runtime validation performance
- **Mitigation**: Validation is O(1) lookup + O(n) param check, negligible

## Conclusion

This approach achieves maximum simplicity by recognizing that we only need to map tool names to their coordinates in the schema. Everything else - parameters, types, descriptions - already exists in the schema. No duplication, no complex transformations, just a simple lookup table and direct access.

**The ultimate lesson**: The simplest solution is often the best. Don't create what already exists.

## Implementation Discovery: TypeScript Limitation

### The Fundamental Problem

When implementing the direct access pattern `client[path][method](params)`, we discovered a fundamental TypeScript limitation:

1. **Dynamic Lookup Creates Unions**: When `path` and `method` come from a dynamic lookup (even with literal types), TypeScript creates a union of ALL possible method signatures
2. **Incompatible Signatures**: Different API endpoints have different parameter requirements, making the union uncallable
3. **No Type Narrowing Possible**: TypeScript cannot narrow the union based on the relationship between path and method

### What We Tried

1. **TOOL_GROUPINGS with Bidirectional Constraints**: Successfully preserved type relationships but still hit union problem at call site
2. **TOOL_METADATA Flat Lookup**: Simplified structure but same fundamental issue
3. **Parameter Wrapping Patterns**: Tried various ways to call the union, all failed
4. **Type Guards and Narrowing**: Cannot narrow function signature unions

### The Core Conflict

```typescript
// What we want (direct access, no assertions)
const response = await client[path][method](params);

// What TypeScript sees
const methodFunc: 
  | ((params: {path: {sequence: string}}) => Promise<Response1>)
  | ((params: {path: {lesson: string}}) => Promise<Response2>)
  | ... // 27 different incompatible signatures

// Error: This expression is not callable
```

### Conclusion

The "direct access without type assertions" pattern is **fundamentally incompatible** with TypeScript's type system when using dynamic dispatch. This is not a design flaw but a limitation of how TypeScript handles union types of functions with different signatures.

### Options Forward

1. **Accept Type Assertions at Runtime Boundaries**: Acknowledge this as a legitimate TypeScript limitation
2. **Generate Explicit Dispatch**: Create switch statements or if-else chains (hundreds of cases)
3. **Redesign Architecture**: Avoid dynamic dispatch entirely
4. **Use Type-Safe Escape Hatch**: Cast to a common function signature with runtime validation before and after

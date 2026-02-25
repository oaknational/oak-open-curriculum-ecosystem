# ADR-031: Generation-Time Extraction Pattern

**Status**: Accepted  
**Date**: 2025-08-12  
**Deciders**: Architecture team, SDK team

## Context

When working with TypeScript code generated from OpenAPI specifications, we face a challenge:

- The generated schema uses `as const` for maximum type safety
- This makes the types very specific (literal types, readonly properties)
- Attempting to iterate or process this schema at runtime requires type assertions
- Type assertions bypass TypeScript's safety and indicate a design flaw

We discovered this issue when trying to dynamically extract operation metadata from the generated schema at runtime in `tool-generation/index.ts`.

## Decision

**ALL metadata extraction and constant generation must happen at build/generation time, not runtime**.

The pattern is:

1. At **generation time**: Extract all needed data from the OpenAPI schema
2. Generate TypeScript code **as strings** containing the extracted data
3. Write these strings to files as generated TypeScript code
4. At **runtime**: Simply import and use the pre-generated constants

## Rationale

### 1. Type Safety Without Assertions

Pre-generated constants are fully typed with no need for `as` assertions or casting to `unknown`.

### 2. Performance

No runtime processing needed. Constants are ready to use immediately.

### 3. Clarity of Intent

The `as const` schema is clearly for type definitions. The pre-generated constants are clearly for runtime use.

### 4. Maintainability

The generation code can use loose types (OpenAPI3). The runtime code uses strict types (generated).

## Implementation Example

### Generation Time (codegen-core.ts)

```typescript
// This code runs during build and generates TypeScript
function extractOperations(schema: OpenAPI3) {
  const operations = [];
  for (const path in schema.paths) {
    // OpenAPI3 allows dynamic access
    const pathItem = schema.paths[path];
    for (const method of ['get', 'post', 'put', 'delete']) {
      const operation = pathItem[method];
      if (operation) {
        operations.push({
          path,
          method,
          operationId: operation.operationId,
          // ... extract all needed data
        });
      }
    }
  }
  return operations;
}

// Generate TypeScript code as a string
const code = `
export const PATH_OPERATIONS = ${JSON.stringify(operations, null, 2)} as const;

export const OPERATIONS_BY_ID = {
${operations.map((op) => `  "${op.operationId}": PATH_OPERATIONS[${operations.indexOf(op)}]`).join(',\n')}
} as const;
`;

// Write to file
fs.writeFileSync('path-parameters.ts', code);
```

### Generated Output (path-parameters.ts)

```typescript
// This is the generated file
export const PATH_OPERATIONS = [
  {
    path: '/lessons/{lesson}/transcript',
    method: 'get',
    operationId: 'getLessonTranscript',
    summary: 'Get lesson transcript',
    // ... all data pre-extracted
  },
  // ... more operations
] as const;

export const OPERATIONS_BY_ID = {
  getLessonTranscript: PATH_OPERATIONS[0],
  // ... more mappings
} as const;
```

### Runtime Usage (tool-generation/index.ts)

```typescript
// This code runs at runtime and uses pre-generated constants
import { PATH_OPERATIONS, OPERATIONS_BY_ID } from './generated/path-parameters';

// No processing needed - just use the constants
export function getOperationById(id: string) {
  return OPERATIONS_BY_ID[id]; // Fully typed, no assertions!
}

// Re-export for consumers
export { PATH_OPERATIONS, OPERATIONS_BY_ID };
```

## Consequences

### Positive

- **Type Safety**: No type assertions needed at runtime
- **Performance**: Zero runtime processing overhead
- **Simplicity**: Runtime code is trivial - just uses constants
- **Debugging**: Generated code is readable and debuggable
- **Testing**: Can test generation logic and runtime usage separately

### Negative

- **Build Complexity**: More sophisticated build process
- **File Size**: Generated files can be large (mitigated by tree-shaking)
- **Debugging**: Need to understand the generation process when issues arise

### Neutral

- **Regeneration**: Must regenerate when schema changes
- **Source Control**: Generated files are committed (provides transparency)

## Key Insight

The critical insight is that code appearing in the generated file can access the `as const` schema because it's part of the same module. The generation process creates code that "knows" about the specific shape of the schema, while the generation code itself works with general types.

This is why `for (const path in schema.paths)` works in the generated file but not in runtime code - the generated file is compiled with knowledge of the specific schema shape.

## Alternatives Considered

### Runtime Processing with Type Assertions

Use `as unknown as Record<string, unknown>` to enable dynamic access.

- **Rejected**: Defeats the purpose of TypeScript. Indicates fighting the type system.

### Less Specific Generated Types

Don't use `as const` on the generated schema.

- **Rejected**: Loses valuable type information. Makes TypeScript less helpful.

### Hybrid Approach

Generate some things, process others at runtime.

- **Rejected**: Confusing and inconsistent. All or nothing is clearer.

## Extension: Compilation-Time Revolution

ADR-038 takes this pattern to its logical extreme by embedding ALL validation and execution logic at generation time. Where this ADR focused on extracting constants, ADR-038 generates complete, self-contained tool implementations with embedded validation logic, achieving true zero-runtime-dependency execution.

## Related

- [ADR-029: No Manual API Data Structures](029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-038: Compilation-Time Revolution](038-compilation-time-revolution.md) - Takes this to the extreme
- [Programmatic Tool Generation Architecture](../programmatic-tool-generation.md)
- [Reference Implementation](../../../reference/oak-curriculum-api-client/scripts/api-types/codegen.ts)

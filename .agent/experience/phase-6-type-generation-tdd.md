# Phase 6 Type Generation TDD Experience

## Date: 2025-08-10

## Context

Implemented type generation for Oak Curriculum SDK using TDD approach to create TypeScript types and Zod validators from OpenAPI schemas.

## Key Learnings

### 1. TDD Implementation Flow

- **Success Pattern**: Writing failing tests first drives better API design
- **Key Insight**: Tests should focus on transformation behaviour, not implementation details
- **Example**: Testing pure functions with simple input/output assertions makes tests resilient to refactoring

### 2. Pure Function Architecture

- **Success Pattern**: Separating pure transformation logic from I/O operations
- **Benefits**:
  - Easy to test without mocks
  - Composable and reusable
  - Clear boundaries and responsibilities
- **Implementation**: Core transformation functions (codegen-typescript.ts, codegen-zod.ts) are pure, while I/O is handled separately (schema-fetcher.ts, generate-types.ts)

### 3. ESM Module Challenges

- **Issue**: `__dirname` not available in ESM modules
- **Solution**: Use `import.meta.url` with `fileURLToPath` and `dirname`

```typescript
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 4. TypeScript Linting Rules

- **Issue**: ESLint forbids `Array<T>` syntax, requires `T[]`
- **Challenge**: Complex types need parentheses: `({...})[]`
- **Solution**: Check if type contains special characters before applying array syntax

### 5. Test Classification Importance

- **Critical Learning**: Integration tests vs E2E tests have different boundaries
- **Integration Tests**: Test code units working together, no I/O, simple injected mocks
- **E2E Tests**: Test full system including I/O operations (network, filesystem)
- **Mistake Made**: Initially created integration test that performed I/O
- **Resolution**: Moved to E2E test directory with separate configuration

### 6. Schema Name Sanitisation

- **Issue**: OpenAPI schemas can have names with special characters (e.g., "error.UNAUTHORIZED")
- **Solution**: Sanitise names to valid TypeScript identifiers

```typescript
function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}
```

### 7. Cache Fallback Pattern

- **Success Pattern**: Try remote fetch first, fall back to local cache on failure
- **Benefits**: Enables offline development and resilience to API downtime
- **Implementation**: Separate validation logic ensures both remote and cached schemas are valid

### 8. Function Complexity Management

- **Issue**: Linting rules enforce maximum complexity and lines per function
- **Solution**: Extract helper functions and split into separate modules
- **Example**: Separated TypeScript and Zod generation into distinct modules

## What Worked Well

1. **TDD Approach**: Writing tests first led to cleaner, more focused implementation
2. **Pure Functions**: Made testing trivial and code highly maintainable
3. **Modular Structure**: Clear separation of concerns across multiple files
4. **Type Safety**: Strong typing throughout prevented runtime errors
5. **Error Handling**: Graceful degradation with meaningful error messages

## What Could Be Improved

1. **Shared Utilities**: `sanitizeName` function duplicated across modules
2. **Schema Composition**: No support for `$ref`, `allOf`, `anyOf`, `oneOf`
3. **Configuration**: Hardcoded URLs could be externalised
4. **Cache Strategy**: No cache expiration or invalidation mechanism
5. **Type Mapping**: Limited support for OpenAPI format specifiers

## Architectural Patterns Applied

### Biological Architecture Alignment

- **Moria (Foundation)**: Pure transformation functions form the core
- **Histoi (Coordination)**: Schema fetcher and pipeline coordinate operations
- **Psycha (Interface)**: Generated types provide the developer interface

### SOLID Principles

- **Single Responsibility**: Each module has one clear purpose
- **Open/Closed**: Easy to extend with new transformations
- **Dependency Inversion**: Core logic doesn't depend on I/O

## Recommendations for Future Work

1. **Extract Common Utilities**: Create shared utility module for common functions
2. **Enhance Schema Support**: Add support for OpenAPI composition schemas
3. **Configuration Management**: Create configuration file for URLs and paths
4. **Cache Management**: Implement cache expiration and refresh strategy
5. **Type Enhancement**: Support more OpenAPI format specifiers
6. **Dependency Injection**: Refactor schema-fetcher to accept injected dependencies for true integration testing

## Commands and Tools

### Key Commands Used

```bash
# Generate types from OpenAPI schema
pnpm generate:types

# Run tests
pnpm test        # Unit tests only
pnpm test:e2e    # E2E tests with I/O

# Quality gates
pnpm format:check
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

### File Structure Created

```
packages/oak-curriculum-sdk/
├── scripts/
│   ├── codegen-core.ts         # Re-exports
│   ├── codegen-typescript.ts   # TypeScript generation
│   ├── codegen-zod.ts          # Zod generation
│   ├── schema-fetcher.ts       # Fetch with cache
│   └── generate-types.ts       # Main pipeline
├── src/
│   ├── types/
│   │   ├── openapi.ts         # OpenAPI types
│   │   └── generated.ts       # Generated TypeScript
│   └── validators/
│       └── generated.ts       # Generated Zod validators
├── tests/
│   └── scripts/
│       ├── codegen.unit.test.ts
│       └── zod-gen.unit.test.ts
├── e2e-tests/
│   └── scripts/
│       └── schema-fetcher.e2e.test.ts
└── reference-types/
    └── api-schema.json         # Cached schema
```

## Conclusion

This implementation successfully demonstrates TDD principles applied to code generation, resulting in a robust, maintainable solution. The key success factors were:

1. Writing tests first to drive design
2. Maintaining pure functions for core logic
3. Clear separation of concerns
4. Proper test classification (unit vs E2E)

The experience reinforces that TDD leads to better architecture and more maintainable code, especially when combined with functional programming principles.

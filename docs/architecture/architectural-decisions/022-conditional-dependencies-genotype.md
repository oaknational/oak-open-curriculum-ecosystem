# ADR-022: Conditional Dependencies in Genotype

## Status

Accepted

## Context

Initially, we established a "zero runtime dependencies" rule for the genotype (oak-mcp-core) to ensure edge runtime compatibility. However, this creates code duplication as multiple phenotypes need the same Node.js integrations (file reading, AsyncLocalStorage, etc.).

## Decision

We refine the principle from "zero runtime dependencies" to **"zero HARD dependencies - all environmental features must gracefully degrade"**.

The genotype may contain runtime-specific code that:

1. Uses dynamic imports or requires within try-catch blocks
2. Provides fallback implementations for unsupported environments
3. Never causes parse or runtime failures in any JavaScript environment
4. Conditionally expresses features based on runtime capabilities

## Rationale

### Biological Accuracy

In genetics, genotypes contain genes for all possible traits, with environmental factors determining expression. A plant's genotype contains drought resistance genes that only activate when needed. Similarly, our genotype can contain Node.js code that only "expresses" when the runtime supports it.

### Practical Benefits

- **Reduced Duplication**: Common patterns (config reading, context tracking) live in one place
- **Consistency**: All phenotypes use the same well-tested implementations
- **Flexibility**: Phenotypes can override if needed but get good defaults
- **Progressive Enhancement**: Core functionality everywhere, enhanced features when available

### Implementation Pattern

```typescript
// Correct: Conditional expression with graceful degradation
export function createContextStorage<T>(): ContextStorage<T> {
  // Try Node.js AsyncLocalStorage
  if (typeof globalThis !== 'undefined') {
    try {
      const { AsyncLocalStorage } = require('node:async_hooks');
      return new AsyncLocalStorageAdapter(new AsyncLocalStorage<T>());
    } catch {
      // Not available, continue to fallbacks
    }
  }

  // Try other runtime APIs...

  // Ultimate fallback that works everywhere
  return new ManualContextStorage<T>();
}
```

## Consequences

### Positive

- Single source of truth for common runtime adaptations
- Better code reuse across phenotypes
- More biologically accurate architecture
- Simpler phenotype implementations

### Negative

- Genotype is larger (contains dormant code paths)
- Must test in multiple runtimes to ensure compatibility
- Linting rules need adjustment to allow this pattern

### Mitigation

- Configure ESLint to allow `require()` in try-catch blocks
- Add runtime compatibility tests to CI
- Document the pattern clearly
- Use feature detection, not user-agent detection

## Implementation Guidelines

1. **Always Provide Fallbacks**: Every runtime-specific feature must have a pure JavaScript fallback
2. **Fail Gracefully**: Use try-catch around all dynamic imports/requires
3. **Feature Detection**: Check for API availability, not runtime names
4. **Test Coverage**: Test both with and without runtime features available
5. **Document Capabilities**: Clearly indicate which features are enhanced with specific runtimes

## Examples

### Good: Graceful Enhancement

```typescript
// File operations with fallback
export async function readConfig(path: string): Promise<Config> {
  try {
    const fs = await import('node:fs/promises');
    const content = await fs.readFile(path, 'utf-8');
    return JSON.parse(content);
  } catch {
    // Fallback: return default config or fetch from network
    return getDefaultConfig();
  }
}
```

### Bad: Hard Dependency

```typescript
// This will fail in edge runtimes
import { readFileSync } from 'node:fs'; // ❌ Parse-time failure

export function readConfig(path: string): Config {
  return JSON.parse(readFileSync(path, 'utf-8'));
}
```

## Related Decisions

- ADR-021: Genotype/Phenotype Model for Chorai
- ADR-006: Cellular Architecture Pattern
- ADR-020: Biological Architecture

## Notes

This decision represents a maturation of our understanding of the biological metaphor. Just as real organisms have conditional gene expression, our genotype can contain environment-specific code that only activates when supported.

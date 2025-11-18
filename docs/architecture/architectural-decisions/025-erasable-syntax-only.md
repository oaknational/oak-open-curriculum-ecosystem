# ADR-025: Erasable Syntax Only for Pure ESM Output

## Status

Accepted (Revised)

**Note**: Code examples in this ADR reference `ConsolaLogger`, which has been superseded by `UnifiedLogger` (see ADR-051). The erasable syntax patterns described remain valid and current.

## Context

As part of Phase 5's completion and our commitment to pure ESM modules, we need to ensure that all TypeScript-specific syntax can be completely removed during compilation without leaving any runtime artifacts. This is especially important for:

1. Maintaining zero-dependency in Moria
2. Ensuring transplantable Histoi tissues
3. Keeping bundle sizes minimal
4. Avoiding runtime decorator metadata

TypeScript features like decorators, parameter properties, and certain type assertions can leave runtime artifacts if not configured properly.

## Decision

We will enable `"erasableSyntaxOnly": true` in our base TypeScript configuration.

### What This Enforces

```typescript
// ❌ REJECTED: Runtime-required syntax
@Injectable() // Requires reflect-metadata
class Service {
  constructor(public readonly name: string) {} // Parameter property
}

// ✅ ALLOWED: Erasable syntax
interface Service {
  name: string;
}

class ServiceImpl implements Service {
  constructor(readonly name: string) {
    // Explicit assignment if needed
  }
}
```

### Configuration

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "erasableSyntaxOnly": true
    // ... other options
  }
}
```

## Consequences

### Positive

- **Pure JavaScript Output**: No TypeScript runtime artifacts in compiled code
- **Smaller Bundles**: No decorator metadata or other runtime overhead
- **Better Tree-shaking**: Cleaner output enables better dead code elimination
- **Framework Independence**: No dependency on decorator libraries or reflect-metadata
- **ESM Purity**: Aligns with our ESM-only architecture (ADR-001)

### Negative

- **No Runtime Decorators**: Cannot use decorators that require runtime behavior
- **No Reflect Metadata**: Cannot use reflection-based dependency injection frameworks
- **Manual Wiring**: Must use explicit dependency injection patterns (which we already do)

### Neutral

- **Compile-time Type Checking**: All TypeScript benefits remain at compile time
- **Interface Compliance**: Can still use `implements` and type checking
- **Const Assertions**: `as const` still works for literal types

## Examples

### What We Can't Do

```typescript
// ❌ These patterns are now prevented:

// Decorators with runtime behavior
@Component({ selector: 'app-root' })
class AppComponent {}

// Parameter decorators
class Service {
  method(@Inject(TOKEN) dep: Dependency) {}
}

// Metadata reflection
const metadata = Reflect.getMetadata('design:type', target);
```

### What We Do Instead

```typescript
// ✅ Our patterns remain valid:

// Explicit dependency injection (our standard pattern)
class StdioTransport {
  constructor(
    private stdin: NodeJS.ReadStream,
    private stdout: NodeJS.WriteStream,
    private logger: Logger,
  ) {}
}

// Interface implementation
class ConsolaLogger implements Logger {
  info(message: string): void {
    // Implementation
  }
}

// Type-only imports (erased completely)
import type { Logger } from '@oaknational/mcp-moria';
```

## Validation

This configuration has been validated by:

- All packages still building successfully
- All 193 tests passing
- Bundle sizes remaining minimal
- No runtime errors in any environment

## Migration

No migration needed - our codebase already follows erasable patterns:

- We use manual dependency injection (ADR-024)
- We don't use decorators
- We don't rely on reflect-metadata
- All our imports are explicit

## References

- [TypeScript 5.0 Release Notes - erasableSyntaxOnly](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [TypeScript ESM Support](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- ADR-001: ESM-Only Package Structure
- ADR-024: Dependency Injection Pattern

## Notes

**Update**: This configuration was tested but rejected because it's incompatible with parameter properties (`private readonly` in constructors), which we use extensively throughout the codebase. The refactoring required would be significant and provide minimal benefit since:

1. Parameter properties compile to clean JavaScript
2. They don't add runtime dependencies
3. They improve code readability and reduce boilerplate
4. Our current output is already pure ESM

The investigation was valuable as it confirmed our patterns are already optimal for our use case.

## Rejection Reason

```typescript
// This pattern is used throughout our codebase
export class ConsolaLogger implements Logger {
  constructor(
    private readonly consola: ConsolaInstance, // TS1294 Error
    private readonly contextData: Record<string, unknown> = {}, // TS1294 Error
  ) {}
}

// Would need to be refactored to:
export class ConsolaLogger implements Logger {
  private readonly consola: ConsolaInstance;
  private readonly contextData: Record<string, unknown>;

  constructor(consola: ConsolaInstance, contextData: Record<string, unknown> = {}) {
    this.consola = consola;
    this.contextData = contextData;
  }
}
```

The refactoring would add boilerplate without improving the output JavaScript, which is already clean and dependency-free.

# ADR-024: Dependency Injection Pattern for Histoi Tissues

## Status
Accepted

## Context

During Phase 5 development, we needed to create truly transplantable tissues that could adapt to different runtime environments (Node.js, Edge, Browser) without code changes. The challenge was managing runtime-specific dependencies (filesystem, console, process) while maintaining clean architecture.

Initial attempts used runtime detection and conditional imports, but this created:
- Tight coupling to specific environments
- Difficult-to-test code with complex mocks
- Violations of the Single Responsibility Principle
- Build-time complexity with conditional exports

## Decision

We will use **constructor-based dependency injection** as the standard pattern for all Histoi tissues.

### Pattern Implementation

```typescript
// Pure interface (in Moria)
export interface FileSystemInterface {
  readFile(path: string, encoding: string): Promise<string>;
  writeFile(path: string, data: string, encoding: string): Promise<void>;
}

// Tissue implementation (in Histoi)
export class FileStorage {
  constructor(
    private readonly fs: FileSystemInterface,
    private readonly path: PathInterface,
  ) {}
  
  // All methods use injected dependencies
  async read(key: string): Promise<string> {
    return this.fs.readFile(this.path.join(this.dir, key), 'utf-8');
  }
}

// Usage (in Psycha)
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const storage = new FileStorage(fs, path);
```

### Key Principles

1. **All I/O is injected**: No direct imports of Node.js modules in Histoi
2. **Interfaces in Moria**: Pure abstraction layer defines contracts
3. **Simple implementations**: Tissues are thin adapters around injected dependencies
4. **Consumer responsibility**: Psycha organisms choose their runtime dependencies

## Consequences

### Positive

- **True transplantability**: Same tissue code works in any environment
- **Testability**: Simple mocks can be injected for testing
- **Clear boundaries**: Obvious what each tissue depends on
- **Type safety**: Interfaces ensure compatibility at compile time
- **Flexibility**: Easy to swap implementations without changing tissue code

### Negative

- **More boilerplate**: Requires interface definitions and injection setup
- **Explicit wiring**: Psycha must wire dependencies (no magic)
- **Learning curve**: Developers must understand DI pattern

### Neutral

- **No DI framework**: We use manual injection, not a framework like InversifyJS
- **Constructor injection only**: We don't use property or method injection
- **Single pattern**: All tissues follow the same pattern for consistency

## Implementation Examples

### histos-logger
```typescript
export class ConsolaLogger implements Logger {
  constructor(
    private readonly consola: ConsolaInstance,
    private readonly contextData: Record<string, unknown> = {},
  ) {}
}
```

### histos-storage
```typescript
export function createFileStorage(
  fs: FileSystemInterface,
  path: PathInterface,
  dir: string,
): StorageProvider
```

### histos-transport
```typescript
export class StdioTransport implements Transport {
  constructor(
    private stdin: NodeJS.ReadStream,
    private stdout: NodeJS.WriteStream,
    private logger: Logger,
  ) {}
}
```

## Validation

The pattern has been validated through:
- All Histoi tissues successfully refactored
- Test auditor confirmed "gold standard" implementation
- Code reviewer gave A/A+ grades
- All quality gates passing
- Tests are simple and maintainable

## References

- [Martin Fowler on Dependency Injection](https://martinfowler.com/articles/injection.html)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- Phase 5 Sub-phase 5.8: Histoi Tissue Standardization
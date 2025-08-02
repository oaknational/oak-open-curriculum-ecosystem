# Phase 3 Implementation Plan: Strategic Enhancements

## Overview

Phase 3 focuses on building generic MCP abstractions within oak-notion-mcp that will later be extracted to oak-mcp-core. Every enhancement must answer: "Will this help oak-mcp-core?"

## Architectural Principles

1. **Build Generic First, Specialize Second** - Create generic interfaces and base classes, then implement Notion-specific versions
2. **Validate at Boundaries** - All external data must be validated using Zod schemas and type guards at entry points
3. **Use SDK Types Directly** - After validation, use Notion SDK types throughout the codebase (no duplication)
4. **Pure Functions and Dependency Injection** - Maximize pure functions, inject all IO as arguments
5. **Zero Dependencies in Core** - Generic components must have no external dependencies

## Objectives

1. Build generic abstractions first, then specialize for Notion
2. Prepare ~3,050 LoC for future extraction (exceeding 100% of current codebase)
3. Improve performance by 20%+ while adding abstractions
4. Maintain stability through versioning (no backward compatibility layers)
5. Follow TDD/BDD with pure functions and simple mocks
6. All IO must be injected as arguments (dependency injection)
7. Fail FAST with helpful errors, never fail silently
8. No type assertions (`as`), no `any`, no `!` (non-null assertion)
9. Validate all external data at boundaries, then use SDK types internally

## Week 1: Foundation Layers (1,550 LoC extractable)

### Day 1-2: Enhanced Logging Framework (550 LoC)

**Why First**: Zero dependencies, everything else depends on logging

**Deliverables**:

- [ ] Create `src/logging/logger-interface.ts` with zero-dependency Logger interface
- [ ] Implement `src/logging/context-logger.ts` with AsyncLocalStorage
- [ ] Create console and file transports in `src/logging/transports/`
- [ ] Add JSON and pretty formatters in `src/logging/formatters/`
- [ ] Implement request tracing in `src/logging/request-tracing.ts`
- [ ] Write unit tests FIRST (TDD) with pure functions
- [ ] Ensure all transports are passed as arguments (dependency injection)
- [ ] Update existing console.log calls to use new logger

**Technical Design**:

```typescript
// Core Logger Interface (Zero Dependencies)
export interface Logger {
  trace(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
  fatal(message: string, error?: unknown, context?: LogContext): void;
  child(context: LogContext): Logger;
  isLevelEnabled(level: LogLevel): boolean;
}

// Context propagation with AsyncLocalStorage
export class ContextLogger implements Logger {
  private static correlationStorage = new AsyncLocalStorage<string>();

  static runWithCorrelation<T>(correlationId: string, fn: () => T): T {
    return ContextLogger.correlationStorage.run(correlationId, fn);
  }
}
```

**Key Design Decisions**:

- Zero external dependencies in core
- AsyncLocalStorage for correlation IDs across async boundaries
- Non-blocking async writes with buffering
- Edge-compatible abstractions (inject file system)
- Structured logging with TypeScript support
- Integration points for error framework and performance monitoring

### Day 3-4: Enhanced Error Framework (300 LoC)

**Deliverables**:

- [ ] Create `src/errors/error-chain.ts` with ChainedError class
- [ ] Implement structured error types in `src/errors/error-types.ts`
- [ ] Add ErrorContext with AsyncLocalStorage in `src/errors/error-context.ts`
- [ ] Create recovery strategies in `src/errors/recovery-strategies.ts`
- [ ] Implement error reporters in `src/errors/error-reporter.ts`
- [ ] Add error sanitizer for PII protection
- [ ] Ensure errors fail FAST with helpful messages
- [ ] Create Result<T, E> type for functional error handling
- [ ] Integrate with logging framework
- [ ] Write unit tests FIRST (TDD) with simple mock scenarios
- [ ] Ensure all error handlers are pure functions where possible

**Technical Design**:

```typescript
// Error Chain Preservation
export class ChainedError extends Error {
  public readonly cause: unknown;
  public readonly context: Record<string, unknown>;
  public readonly timestamp: Date;
  public readonly id: string;

  constructor(message: string, cause: unknown, context: Record<string, unknown> = {}) {
    super(message);
    this.cause = cause;
    this.context = context;
    this.timestamp = new Date();
    this.id = generateErrorId();

    // Preserve original stack trace
    if (cause instanceof Error && cause.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}

// Type-safe error handling
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

// Error boundaries for handlers
export function withErrorContext<T>(
  operation: string,
  context: Record<string, unknown>,
  fn: () => T,
): T {
  return ErrorContext.run(() => {
    ErrorContext.add('operation', operation);
    Object.entries(context).forEach(([k, v]) => ErrorContext.add(k, v));

    try {
      return fn();
    } catch (error) {
      throw new ChainedError(`Error in ${operation}`, error, ErrorContext.getAll());
    }
  });
}
```

**Critical Requirements**:

- Never lose original error - full chain preservation
- Always include context - operation, timestamp, correlation ID
- Sanitize sensitive data - automatic PII detection
- Support structured retry logic - exponential backoff strategies
- Fail FAST with helpful messages - never swallow errors

### Day 5: Configuration, Validation & Testing (550 LoC)

**Configuration Management (200 LoC)**:

- [ ] Create `src/config/config-manager.ts` with multi-source support
- [ ] Implement environment and file config sources
- [ ] Add Zod schema integration
- [ ] Create hot-reload capability (with injected file watcher)
- [ ] Write unit tests FIRST (TDD) with mock config sources as arguments
- [ ] Ensure config sources are injected, not imported

```typescript
// Multi-source configuration with validation
export class ConfigManager<T> {
  constructor(
    private schema: ConfigSchema<T>,
    private sources: ConfigSource[],
  ) {}

  async load(): Promise<T> {
    const raw = await this.collectConfig();
    const validation = this.schema.validate(raw);

    if (!validation.valid) {
      throw new ConfigurationError('Invalid configuration', validation.errors);
    }

    return this.schema.parse(raw);
  }
}
```

**Validation Framework (150 LoC)**:

- [ ] Create `src/validation/validator.ts` interface
- [ ] Implement ValidationChain for composable validators
- [ ] Add common validators (string, required, url, etc.)
- [ ] Create Zod integration adapter
- [ ] Write unit tests FIRST (TDD) for all validators
- [ ] Ensure validators are pure functions

```typescript
// Composable validation with boundary focus
export class ValidationChain<T> implements Validator<T> {
  validate(value: unknown): ValidationResult<T> {
    let current = value;

    for (const validator of this.validators) {
      const result = validator(current);
      if (!result.valid) {
        return result;
      }
      current = result.value;
    }

    return { valid: true, value: current as T };
  }
}

// Boundary validation for Notion data
export const notionPageValidator = z.custom<PageObjectResponse>(
  (val): val is PageObjectResponse => isFullPage(val),
  { message: 'Invalid Notion page object' },
);
```

**Testing Utilities (200 LoC)**:

- [ ] Create `src/testing/test-server.ts` for in-process testing
- [ ] Implement TestTransport for mocking
- [ ] Add TestDataBuilder for common scenarios
- [ ] Create assertion helpers
- [ ] Document testing patterns
- [ ] Ensure all test doubles are simple fakes

```typescript
// In-process test server
export class TestMcpServer<TConfig = any> {
  async sendRequest<T>(method: string, params?: any): Promise<T> {
    return this.transport.sendRequest(method, params);
  }

  async callTool(name: string, args: any): Promise<any> {
    return this.sendRequest('tools/call', { name, arguments: args });
  }
}
```

## Week 2: Core Patterns (950 LoC extractable)

### Day 1: Type Safety Enhancements (80 LoC)

**Type Guard Registry**:

- [ ] Create `src/utils/type-guards/registry.ts`
- [ ] Implement composite guard creation
- [ ] Register Notion SDK guards (isFullPage, etc.)
- [ ] Add custom domain guards
- [ ] Write unit tests FIRST (TDD) proving type narrowing
- [ ] Use meaningful `is` predicates, never type assertions

### Day 2: Pagination Framework (100 LoC)

**Generic Pagination**:

- [ ] Create `src/utils/pagination/strategy.ts` interface
- [ ] Implement PaginationHandler with AsyncGenerator
- [ ] Add NotionPaginationStrategy
- [ ] Support cursor and offset patterns
- [ ] Write unit tests FIRST (TDD) with mock paginated data
- [ ] Ensure pagination handlers are pure functions with injected IO

### Day 3: Resource Patterns (75 LoC)

**Resource Linking**:

- [ ] Create `src/mcp/patterns/resource-linking.ts`
- [ ] Implement URI extraction and reference creation
- [ ] Add response transformation
- [ ] Write unit tests FIRST (TDD) for payload size reduction
- [ ] Ensure transformers are pure functions

### Day 4: Performance & Middleware (250 LoC)

**Performance Monitoring (100 LoC)**:

- [ ] Create `src/monitoring/performance.ts` interface
- [ ] Implement timer and metric recording
- [ ] Add middleware integration
- [ ] Write unit tests FIRST (TDD) for performance monitoring
- [ ] Test overhead is <5% using simple mocks

```typescript
export class PerformanceMiddleware {
  wrapHandler<T extends (...args: any[]) => any>(handler: T, operation: string): T {
    return ((...args) => {
      const done = this.monitor.startTimer(operation);
      try {
        const result = handler(...args);
        if (result instanceof Promise) {
          return result.finally(done);
        }
        done();
        return result;
      } catch (error) {
        done();
        throw error;
      }
    }) as T;
  }
}
```

**Middleware System (150 LoC)**:

- [ ] Create `src/middleware/middleware.ts` with Next pattern
- [ ] Implement MiddlewareStack with async support
- [ ] Add common middleware (logging, validation, errors)
- [ ] Create timing and correlation middleware
- [ ] Write unit tests FIRST (TDD) for composition and error propagation
- [ ] Ensure middleware are pure functions with Next pattern
- [ ] Document middleware patterns

```typescript
export type Next<T = any> = () => Promise<T> | T;
export type Middleware<TContext = any, TResult = any> = (
  context: TContext,
  next: Next<TResult>,
) => Promise<TResult> | TResult;

// Validation middleware for boundaries
export const validationMiddleware = <T>(validator: Validator<T>): Middleware => {
  return async (context: any, next) => {
    const result = validator.validate(context);
    if (!result.valid) {
      throw new ValidationError('Invalid request', result.errors);
    }
    return next();
  };
};
```

### Day 5: MCP Base & Registry System (500 LoC)

**Generic Base Class (150 LoC)**:

- [ ] Create `src/mcp/base/mcp-server-base.ts`
- [ ] Add lifecycle management hooks
- [ ] Implement plugin architecture
- [ ] Create NotionMcpServer extending base
- [ ] Migrate existing server.ts
- [ ] Write unit tests FIRST (TDD) for startup/shutdown sequences
- [ ] Mock all IO operations, pass as arguments

```typescript
export abstract class McpServerBase<TConfig, TDeps> {
  protected server: McpServer;

  abstract validateConfig(config: TConfig): void;
  abstract setupHandlers(deps: TDeps): void;

  async start(transport: Transport): Promise<void> {
    // Generic startup logic with lifecycle hooks
  }
}

// Notion-specific implementation
export class NotionMcpServer extends McpServerBase<NotionConfig, NotionDeps> {
  validateConfig(config: NotionConfig): void {
    // Use Zod schema to validate Notion-specific config
  }

  setupHandlers(deps: NotionDeps): void {
    // Wire up Notion handlers with boundary validation
  }
}
```

**Registry System (200 LoC)**:

- [ ] Create `src/registry/registry.ts` base class
- [ ] Implement ResourceRegistry with URI matching
- [ ] Implement ToolRegistry with middleware support
- [ ] Add registry middleware composition
- [ ] Create Notion-specific registries
- [ ] Write unit tests FIRST (TDD) for registration and lookup
- [ ] Ensure registry operations are pure where possible

```typescript
export class Registry<T extends RegistryItem> {
  private items = new Map<string, T>();
  private middleware = new MiddlewareStack<{ item: T; args: any[] }, any>();

  async execute<TResult>(
    name: string,
    handler: (item: T, ...args: any[]) => Promise<TResult> | TResult,
    ...args: any[]
  ): Promise<TResult> {
    const item = this.get(name);
    if (!item) {
      throw new Error(`Item "${name}" not found`);
    }

    return this.middleware.execute({ item, args }, () => handler(item, ...args));
  }
}
```

**Lifecycle Management (100 LoC)**:

- [ ] Create `src/lifecycle/lifecycle.ts` interface
- [ ] Implement LifecycleManager with rollback
- [ ] Add component dependency ordering
- [ ] Write unit tests FIRST (TDD) for startup/shutdown sequences
- [ ] Mock all IO operations, pass as arguments
- [ ] Write unit tests FIRST (TDD) for graceful degradation
- [ ] Fail FAST with helpful error messages, never fail silently

**Additional Utilities (50 LoC)**:

- [ ] Create Result<T, E> type in `src/utils/result.ts`
- [ ] Add functional error handling helpers
- [ ] Document usage patterns

## Week 3: Integration & Polish

### Day 1: Notion-Specific Implementations

**Implement Notion versions of all abstractions**:

- [ ] NotionErrorHandler with APIErrorCode mapping
- [ ] Notion-specific configuration schema
- [ ] Notion pagination strategy
- [ ] Notion-specific type guards
- [ ] Write integration tests with mocked Notion API (simple fakes)
- [ ] Pass all IO operations as arguments, no direct imports

**Boundary Validation Focus**:

```typescript
// Notion-specific boundary validation
export class NotionBoundaryValidator {
  validatePage(raw: unknown): PageObjectResponse {
    // Use Zod schema first
    const parsed = notionPageSchema.parse(raw);

    // Then use SDK type guard for runtime safety
    if (!isFullPage(parsed)) {
      throw new ValidationError('Invalid Notion page structure');
    }

    return parsed; // Now we have trusted Notion SDK type
  }
}

// Notion error handler with SDK error types
export class NotionErrorHandler extends McpErrorHandler {
  mapToMcpError(error: unknown): McpError {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case APIErrorCode.ObjectNotFound:
          return new NotFoundError('Notion object not found', error);
        case APIErrorCode.Unauthorized:
          return new AuthorizationError('Notion API unauthorized', error);
        // Map all Notion SDK error codes
      }
    }
    return super.mapToMcpError(error);
  }
}
```

### Day 2: Registry Implementation & Pattern Application

**GROUNDING**: Read GO.md and follow all instructions

**Complete Registry Integration**:

- [ ] Register all existing resources in ResourceRegistry
- [ ] Register all existing tools in ToolRegistry
- [ ] Apply middleware to all handlers
- [ ] Implement resource linking for all responses
- [ ] Add performance monitoring to critical paths

### Day 3: Migration & Refactoring

**Update existing code to use new abstractions**:

- [ ] Replace console.log with logger
- [ ] Use ChainedError for all error handling
- [ ] Migrate to ConfigManager
- [ ] Add middleware to all handlers
- [ ] Update tests to use TestMcpServer

### Day 4: Performance & Documentation

**GROUNDING**: Read GO.md and follow all instructions

**Performance Testing**:

- [ ] Benchmark before/after each abstraction
- [ ] Ensure <5% overhead
- [ ] Profile memory usage
- [ ] Optimize hot paths

**Documentation**:

- [ ] Mark all generic components with extraction readiness
- [ ] Document design decisions
- [ ] Create migration guide
- [ ] Add usage examples

### Day 5: Final Integration & Review

**Quality Assurance**:

- [ ] Run full test suite
- [ ] Check 100% coverage on new code
- [ ] Verify all quality gates pass
- [ ] Performance regression testing
- [ ] Code review checklist

## Boundary Validation Architecture

### Core Principle

All external data from Notion API must pass through a validation boundary before entering our system:

```
Notion API Response → Boundary Validator → Trusted Notion SDK Types → Our System
                      (Zod + Type Guards)    (PageObjectResponse, etc.)
```

### Implementation Pattern

1. **At API boundaries**: Validate all responses from Notion API
2. **Use Zod schemas**: Parse and validate structure
3. **Apply type guards**: Use SDK's isFullPage, isFullDatabase, etc.
4. **Return SDK types**: Use Notion SDK types throughout internal code
5. **No type duplication**: Never recreate types that exist in SDK

### Benefits

- Runtime safety through validation
- Compile-time safety through SDK types
- Clear extraction boundary for oak-mcp-core
- No maintenance burden from duplicate types

## Success Criteria

### Technical Metrics

- [ ] All existing tests pass
- [ ] 100% test coverage on new abstractions
- [ ] Performance improvement of 20%+
- [ ] No breaking changes in existing API (use versioning if needed)
- [ ] All abstractions are edge-compatible
- [ ] All external data validated at boundaries

### Extraction Readiness

- [ ] 3,050 LoC marked as extractable (exceeding current codebase)
- [ ] Clear separation between generic/specific
- [ ] No Notion dependencies in generic code
- [ ] All abstractions follow SOLID principles
- [ ] Boundary validation clearly separates concerns

### Code Quality

- [ ] No type assertions (as)
- [ ] No any types
- [ ] All functions are pure where possible
- [ ] Simple mocks only (passed as arguments)
- [ ] Never mock with complex stubs or spies
- [ ] Comprehensive error handling
- [ ] Notion SDK types used consistently after validation

## Risk Mitigation

1. **Over-abstraction**: Start simple, iterate based on real needs
2. **Performance**: Benchmark continuously, rollback if needed
3. **Complexity**: If it's hard to explain, redesign it
4. **Time**: Focus on highest-value abstractions first
5. **Never use backward compatibility layers**: Replace old code directly
6. **Always write tests FIRST**: TDD is mandatory, not optional
7. **IO injection**: All IO must be passed as arguments, never imported directly

## Dependencies

- Current oak-notion-mcp codebase
- Node.js 22+
- TypeScript 5.8+
- Existing test infrastructure
- Notion SDK for types and guards
- Zod for schema validation

## Next Phase Preparation

This phase prepares for Phase Future 2 by:

- Creating clear module boundaries
- Establishing abstraction patterns
- Proving the abstractions work
- Documenting extraction points
- Defining validation boundaries as natural extraction points

Every line of code should be written with extraction in mind!

## Summary

Phase 3 transforms oak-notion-mcp from a monolithic integration into a layered architecture:

1. **Generic Core** (~3,050 LoC): Extractable to oak-mcp-core
2. **Validation Boundary**: Zod schemas + SDK type guards
3. **Notion Integration** (<1,000 LoC): Thin adapter layer

This architecture ensures type safety, maintainability, and enables the creation of a powerful MCP framework for the entire Oak National ecosystem.

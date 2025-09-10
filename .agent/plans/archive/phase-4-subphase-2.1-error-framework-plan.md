# Phase 4 Sub-phase 2.1: Error Framework Implementation Plan

## Overview

This document provides detailed implementation guidance for Sub-phase 2.1 of Phase 4, focusing on building a robust error framework with cause chains and async context support.

## Current State Analysis

### What Already Exists

1. **Basic Error Classification** (`error-handler.ts`):
   - `classifyNotionError()` - Classifies errors by type (rate_limit, auth, not_found, etc.)
   - `createMcpError()` - Transforms classifications into MCP-compliant errors
   - `formatErrorForUser()` - Human-readable error messages
   - Full test coverage (23 tests in `error-handler.unit.test.ts`)

2. **AsyncLocalStorage Foundation** (`context-logger.ts`):
   - Already using `AsyncLocalStorage` for correlation ID tracking
   - `mergeContexts()`, `generateCorrelationId()`, `sanitizeContext()` functions
   - Context flows through async boundaries for logging

3. **Result-like Pattern** (`ValidationResult<T>` in query-building):
   - Basic success/failure pattern with `{ valid: boolean; errors?: string[]; data?: T }`
   - Used for validation flows in Notion query building

### What's Missing for Sub-phase 2.1

1. **ChainedError Class**:
   - No error chaining implementation
   - No context preservation across error boundaries
   - No cause chain traversal

2. **ErrorContext with AsyncLocalStorage**:
   - Have AsyncLocalStorage for logging, but not for error context
   - No error-specific context tracking
   - No integration between error handling and async context

3. **Result<T,E> Type Utilities**:
   - Only have `ValidationResult`, not a generic `Result<T,E>` type
   - No functional combinators (map, flatMap, match)
   - No error accumulation patterns

4. **Integration Points**:
   - Current error handler is Notion-specific
   - Needs abstraction to genotype with phenotype extensions

## Architectural Considerations

### Genotype vs Phenotype

- ChainedError, ErrorContext, Result<T,E> belong in genotype (universal patterns)
- NotionErrorHandler classification stays in phenotype (Notion-specific)

### Morphai Pattern

- Error morphai already exist in `chora/morphai/errors/types.ts`
- Need to implement the shadows (concrete implementations) of these forms

### Zero Dependencies

- AsyncLocalStorage is Node.js built-in (acceptable)
- Need fallback for environments without AsyncLocalStorage

## Implementation Design

### 1. ChainedError with Cause Chain Preservation

The cause chain approach preserves the entire history of errors as they propagate through the system:

```typescript
class ChainedError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);

    // Preserve the original stack trace
    if (cause?.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }

  // Helper to get root cause
  getRootCause(): Error {
    let current: Error = this;
    while (current instanceof ChainedError && current.cause) {
      current = current.cause;
    }
    return current;
  }

  // Collect all context from the chain
  getAllContext(): Record<string, unknown>[] {
    const contexts: Record<string, unknown>[] = [];
    let current: Error | undefined = this;

    while (current) {
      if (current instanceof ChainedError && current.context) {
        contexts.push(current.context);
      }
      current = (current as ChainedError).cause;
    }

    return contexts;
  }
}
```

#### Example Error Chain Flow

```
1. Original Notion API error
   NotionAPIError: "Rate limited"
   status: 429
   notionRequestId: "abc-123"

2. Wrapped by service layer
   ServiceError: "Failed to fetch page data"
   cause: NotionAPIError
   context: { pageId: "page-456", attempt: 3 }

3. Wrapped by MCP handler
   MCPError: "Tool execution failed"
   cause: ServiceError
   context: { toolName: "notion-get-page", userId: "user-789" }

4. User sees: "Unable to retrieve the requested page. Please try again later."
   But full chain is preserved for debugging
```

#### Key Benefits

- **Complete Error History**: Every transformation and handling point is preserved
- **Context Accumulation**: Each layer adds its own context without losing previous information
- **Original Stack Traces**: The original error's stack trace is preserved, not replaced
- **Debugging Power**: Can traverse the chain to find the root cause

### 2. AsyncLocalStorage with Runtime Abstraction

Since AsyncLocalStorage is Node.js-specific and won't work in edge runtimes like Cloudflare Workers, we need an abstraction:

```typescript
/**
 * Abstract context storage interface
 * This is the morphe (Platonic form) of context storage
 */
export interface ContextStorage<T> {
  run<R>(context: T, callback: () => R): R;
  getStore(): T | undefined;
}

/**
 * Factory that creates appropriate storage for the runtime
 * Detects capabilities and provides fallback
 */
export function createContextStorage<T>(): ContextStorage<T> {
  // Feature detection for AsyncLocalStorage
  if (typeof globalThis !== 'undefined') {
    try {
      // Try to access Node.js AsyncLocalStorage
      const { AsyncLocalStorage } = require('node:async_hooks');
      return new AsyncLocalStorageAdapter(new AsyncLocalStorage<T>());
    } catch {
      // Not available, fall through to alternatives
    }
  }

  // Check for Cloudflare Workers' AsyncContext (TC39 Stage 2 proposal)
  if ('AsyncContext' in globalThis) {
    return new AsyncContextAdapter<T>();
  }

  // Fallback: Manual context passing
  return new ManualContextStorage<T>();
}
```

#### Runtime Implementations

**Node.js/Bun - Full AsyncLocalStorage:**

```typescript
class AsyncLocalStorageAdapter<T> implements ContextStorage<T> {
  constructor(private als: AsyncLocalStorage<T>) {}

  run<R>(context: T, callback: () => R): R {
    return this.als.run(context, callback);
  }

  getStore(): T | undefined {
    return this.als.getStore();
  }
}
```

**Cloudflare Workers - Manual Context Passing:**

```typescript
class ManualContextStorage<T> implements ContextStorage<T> {
  private stack: T[] = [];

  run<R>(context: T, callback: () => R): R {
    this.stack.push(context);
    try {
      return callback();
    } finally {
      this.stack.pop();
    }
  }

  getStore(): T | undefined {
    return this.stack[this.stack.length - 1];
  }
}
```

#### Cloudflare Workers Specific Notes

For Cloudflare Workers, we have several options for context storage:

1. **Request Context Pattern** (Simplest - Recommended for now):

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const errorContext: ErrorContext = {
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      url: request.url,
    };
    // Pass context explicitly through the call chain
    return handleRequest(request, errorContext);
  },
};
```

2. **Temporary Storage Options** (Can use while waiting for AsyncContext standard):
   - **Durable Objects**: For persistent context across requests
   - **Workers KV**: For longer-term context storage
   - **R2**: For error log persistence
   - **D1**: For structured error tracking

**Note**: For now, we'll use the simplest approach (manual context passing) and can leverage Cloudflare's storage APIs if needed in the future. The abstraction allows us to swap implementations without changing the API.

### 3. Result<T,E> Type Utilities

Building on the existing ValidationResult pattern:

```typescript
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },

  err<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },

  map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    return result.ok ? Result.ok(fn(result.value)) : result;
  },

  flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
    return result.ok ? fn(result.value) : result;
  },

  match<T, E, R>(result: Result<T, E>, handlers: { ok: (value: T) => R; err: (error: E) => R }): R {
    return result.ok ? handlers.ok(result.value) : handlers.err(result.error);
  },

  // Convert from existing ValidationResult
  fromValidation<T>(validation: ValidationResult<T>): Result<T, string[]> {
    return validation.valid
      ? Result.ok(validation.data!)
      : Result.err(validation.errors || ['Unknown error']);
  },
};
```

## Implementation Approach

### TDD Process (Mandatory)

1. **Start with ChainedError tests**:
   - Test cause chain preservation
   - Test context accumulation
   - Test stack trace merging
   - Test root cause retrieval

2. **ErrorContext tests**:
   - Test context creation and retrieval
   - Test async boundary crossing
   - Test fallback behavior for non-Node.js environments

3. **Result<T,E> tests**:
   - Test creation and type safety
   - Test combinators (map, flatMap)
   - Test pattern matching
   - Test integration with ValidationResult

### File Structure

```
oak-mcp-core/src/chora/aither/errors/
├── chained-error.ts           # ChainedError implementation
├── chained-error.unit.test.ts # Tests for ChainedError
├── error-context.ts            # ErrorContext with storage abstraction
├── error-context.unit.test.ts # Tests for ErrorContext
├── context-storage.ts          # Runtime abstraction for AsyncLocalStorage
├── result.ts                   # Result<T,E> type and utilities
├── result.unit.test.ts        # Tests for Result
└── index.ts                    # Public API exports
```

### Integration with Existing Code

1. **Preserve existing error-handler.ts**:
   - Keep Notion-specific classification in phenotype
   - ChainedError can wrap these classifications

2. **Extend AsyncLocalStorage usage**:
   - Reuse patterns from context-logger.ts
   - Share correlation ID between logging and errors

3. **Migration path for ValidationResult**:
   - Provide conversion utilities
   - Gradual migration to Result<T,E>

## Best Practices

### Industry Standards

- Follow Error Cause TC39 proposal patterns
- Implement stack trace preservation
- Provide both synchronous and asynchronous error context
- Use feature detection over runtime detection

### Zero Dependencies

- No external polyfills
- Uses only what's available in the runtime
- Falls back to manual implementation
- Same TypeScript interfaces regardless of runtime

### Type Safety

- Generic Result<T,E> for flexibility
- Proper discriminated unions
- No unsafe type assertions
- Preserve type information through chains

## Estimated Lines of Code

- **ChainedError class**: ~100 LoC
- **ErrorContext with AsyncLocalStorage**: ~80 LoC
- **Context storage abstraction**: ~60 LoC
- **Result<T,E> utilities**: ~80 LoC
- **Integration code**: ~40 LoC
- **Total**: ~360 LoC (slightly over 300 estimate due to runtime abstraction)

## Success Criteria

1. All tests passing with 100% coverage
2. Works in Node.js, Bun, and Cloudflare Workers
3. Preserves complete error history through chains
4. Context flows across async boundaries (where supported)
5. Graceful fallback for edge runtimes
6. Type-safe Result<T,E> with functional combinators
7. Integration with existing error classification

## Next Steps

1. Write ChainedError unit tests
2. Implement ChainedError class
3. Write ErrorContext tests
4. Implement context storage abstraction
5. Write Result<T,E> tests
6. Implement Result utilities
7. Integrate with existing NotionErrorHandler
8. Update documentation

This error framework will provide the foundation for robust error handling throughout the oak-mcp ecosystem, working across all runtime environments while preserving the complete context of what went wrong.

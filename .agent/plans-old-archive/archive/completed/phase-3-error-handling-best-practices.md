# Phase 3: Enhanced Error Framework - Best Practices

## Core Principles

1. **Never lose the original error** - Always preserve the full error chain
2. **Fail fast, fail hard** - Don't attempt recovery without explicit strategy
3. **Structured error information** - Consistent, actionable error format
4. **Context preservation** - Include relevant context at each error boundary
5. **Type safety** - Errors should be as type-safe as success paths

## Enhanced Error Framework Design

### 1. Error Chain Preservation

```typescript
// src/errors/error-chain.ts (GENERIC)
export class ChainedError extends Error {
  public readonly cause: unknown;
  public readonly context: Record<string, unknown>;
  public readonly timestamp: Date;
  public readonly id: string;

  constructor(message: string, cause: unknown, context: Record<string, unknown> = {}) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
    this.context = context;
    this.timestamp = new Date();
    this.id = generateErrorId(); // Unique ID for tracking

    // Preserve original stack trace
    if (cause instanceof Error && cause.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }

  toJSON(): ErrorReport {
    return {
      id: this.id,
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      cause:
        this.cause instanceof Error
          ? {
              name: this.cause.name,
              message: this.cause.message,
              stack: this.cause.stack,
            }
          : this.cause,
      stack: this.stack,
    };
  }
}
```

### 2. Structured Error Types

```typescript
// src/errors/error-types.ts (GENERIC)
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  INTERNAL = 'INTERNAL',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
}

export interface StructuredError {
  category: ErrorCategory;
  code: string;
  message: string;
  userMessage?: string; // Safe to show to end users
  retryable: boolean;
  retryAfter?: number; // Seconds until retry
  metadata?: Record<string, unknown>;
}

export abstract class McpError extends ChainedError {
  abstract readonly category: ErrorCategory;
  abstract readonly code: string;
  abstract readonly retryable: boolean;

  constructor(
    message: string,
    cause?: unknown,
    public readonly userMessage?: string,
    context: Record<string, unknown> = {},
  ) {
    super(message, cause, context);
  }
}
```

### 3. Error Context Enrichment

```typescript
// src/errors/error-context.ts (GENERIC)
export class ErrorContext {
  private static storage = new AsyncLocalStorage<Map<string, unknown>>();

  static run<T>(fn: () => T): T {
    return ErrorContext.storage.run(new Map(), fn);
  }

  static add(key: string, value: unknown): void {
    const store = ErrorContext.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  static getAll(): Record<string, unknown> {
    const store = ErrorContext.storage.getStore();
    if (!store) return {};

    return Object.fromEntries(store);
  }
}

// Usage in error boundaries
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

### 4. Error Recovery Strategies

```typescript
// src/errors/recovery-strategies.ts (GENERIC)
export interface RecoveryStrategy<T> {
  canRecover(error: unknown): boolean;
  recover(error: unknown): T | Promise<T>;
}

export class RecoveryChain<T> {
  private strategies: RecoveryStrategy<T>[] = [];

  add(strategy: RecoveryStrategy<T>): this {
    this.strategies.push(strategy);
    return this;
  }

  async attempt(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      for (const strategy of this.strategies) {
        if (strategy.canRecover(error)) {
          return await strategy.recover(error);
        }
      }
      throw error; // No recovery possible
    }
  }
}

// Example: Exponential backoff retry strategy
export class ExponentialBackoffStrategy<T> implements RecoveryStrategy<T> {
  constructor(
    private maxAttempts: number = 3,
    private baseDelay: number = 1000,
    private shouldRetry: (error: unknown) => boolean = () => true,
  ) {}

  canRecover(error: unknown): boolean {
    return this.shouldRetry(error);
  }

  async recover(error: unknown): Promise<T> {
    // Implementation with proper error chain preservation
  }
}
```

### 5. Error Reporting and Monitoring

```typescript
// src/errors/error-reporter.ts (GENERIC)
export interface ErrorReporter {
  report(error: StructuredError): void;
}

export class CompositeErrorReporter implements ErrorReporter {
  constructor(private reporters: ErrorReporter[]) {}

  report(error: StructuredError): void {
    // Report to all backends in parallel, don't fail if one fails
    Promise.allSettled(
      this.reporters.map((r) => Promise.resolve(r.report(error)).catch(console.error)),
    );
  }
}

// Implementations
export class ConsoleErrorReporter implements ErrorReporter {
  report(error: StructuredError): void {
    console.error('[ERROR]', JSON.stringify(error, null, 2));
  }
}

export class MetricsErrorReporter implements ErrorReporter {
  constructor(private metrics: PerformanceMonitor) {}

  report(error: StructuredError): void {
    this.metrics.recordMetric(`error.${error.category}.${error.code}`, 1);
  }
}
```

### 6. Error Boundaries for Handlers

```typescript
// src/errors/error-boundary.ts (GENERIC)
export function createErrorBoundary<TArgs extends any[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
  options: {
    operation: string;
    errorMapper: (error: unknown) => McpError;
    contextExtractor?: (...args: TArgs) => Record<string, unknown>;
  },
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    const context = options.contextExtractor?.(...args) ?? {};

    try {
      return await withErrorContext(options.operation, context, () => handler(...args));
    } catch (error) {
      const mcpError = options.errorMapper(error);

      // Report error
      errorReporter.report(mcpError);

      // Log with full context
      logger.error({
        ...mcpError.toJSON(),
        args: sanitizeArgs(args),
      });

      throw mcpError;
    }
  };
}
```

### 7. Type-Safe Error Handling

```typescript
// src/errors/result.ts (GENERIC)
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

  mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    return result.ok ? result : Result.err(fn(result.error));
  },
};

// Usage example
export async function safeOperation<T>(fn: () => Promise<T>): Promise<Result<T, McpError>> {
  try {
    const value = await fn();
    return Result.ok(value);
  } catch (error) {
    return Result.err(normalizeError(error));
  }
}
```

## Best Practices Implementation

### 1. Never Swallow Errors

```typescript
// ❌ BAD
try {
  await riskyOperation();
} catch (error) {
  // Silent failure
}

// ✅ GOOD
try {
  await riskyOperation();
} catch (error) {
  throw new ChainedError('Risky operation failed', error, {
    operation: 'riskyOperation',
    timestamp: Date.now(),
  });
}
```

### 2. Always Include Context

```typescript
// ❌ BAD
throw new Error('Database query failed');

// ✅ GOOD
throw new ChainedError('Database query failed', originalError, {
  query: 'SELECT * FROM users WHERE id = ?',
  params: { id: userId },
  database: 'production',
  attempt: retryCount,
});
```

### 3. Use Specific Error Types

```typescript
// ❌ BAD
throw new Error('Not found');

// ✅ GOOD
export class ResourceNotFoundError extends McpError {
  readonly category = ErrorCategory.NOT_FOUND;
  readonly code = 'RESOURCE_NOT_FOUND';
  readonly retryable = false;

  constructor(resourceType: string, id: string) {
    super(
      `${resourceType} with id ${id} not found`,
      undefined,
      'The requested resource could not be found',
      { resourceType, id },
    );
  }
}
```

### 4. Sanitize Sensitive Data

```typescript
// src/errors/sanitizer.ts (GENERIC)
export class ErrorSanitizer {
  private sensitivePatterns = [/api[_-]?key/i, /password/i, /token/i, /secret/i, /credential/i];

  sanitize(data: unknown): unknown {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (typeof data === 'object' && data !== null) {
      return this.sanitizeObject(data);
    }

    return data;
  }

  private sanitizeObject(obj: any): any {
    const result: any = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      if (this.isSensitiveKey(key)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = this.sanitize(value);
      }
    }

    return result;
  }

  private isSensitiveKey(key: string): boolean {
    return this.sensitivePatterns.some((pattern) => pattern.test(key));
  }
}
```

## Testing Error Handling

```typescript
// src/errors/error-handler.test.ts
describe('Error Handler', () => {
  it('should preserve error chain', () => {
    const cause = new Error('Original error');
    const wrapped = new ChainedError('Wrapped error', cause);

    expect(wrapped.cause).toBe(cause);
    expect(wrapped.stack).toContain('Caused by:');
  });

  it('should include context in serialization', () => {
    const error = new ChainedError('Test error', null, { userId: '123', operation: 'test' });

    const json = error.toJSON();
    expect(json.context).toEqual({
      userId: '123',
      operation: 'test',
    });
  });

  it('should sanitize sensitive data', () => {
    const sanitizer = new ErrorSanitizer();
    const data = {
      username: 'john',
      api_key: 'secret123',
      nested: {
        password: 'pass123',
      },
    };

    const sanitized = sanitizer.sanitize(data);
    expect(sanitized.api_key).toBe('[REDACTED]');
    expect(sanitized.nested.password).toBe('[REDACTED]');
    expect(sanitized.username).toBe('john');
  });
});
```

## Integration with MCP

```typescript
// src/mcp/error-mapping.ts (GENERIC)
export function mapToMcpError(error: unknown): McpError {
  // Already an MCP error
  if (error instanceof McpError) {
    return error;
  }

  // Known error patterns
  if (isTimeoutError(error)) {
    return new TimeoutError('Operation timed out', error);
  }

  if (isNetworkError(error)) {
    return new NetworkError('Network request failed', error);
  }

  // Unknown error
  return new InternalError(
    'An unexpected error occurred',
    error,
    'Something went wrong. Please try again later.',
  );
}
```

## Benefits

1. **Never lose errors**: Full chain preservation with context
2. **Debuggable**: Unique IDs, timestamps, and full context
3. **Type-safe**: Result types and typed errors
4. **Recoverable**: Structured retry strategies
5. **Monitorable**: Built-in reporting and metrics
6. **Secure**: Automatic sanitization of sensitive data
7. **Testable**: Pure functions and clear boundaries
8. **Extensible**: Registry pattern for error handlers

This comprehensive error framework will be ~300 LoC of immediately extractable code for oak-mcp-core, providing a solid foundation for all MCP servers.

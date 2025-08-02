# Phase 3: Logging Framework Design

## Architecture Overview

The logging system is a **foundational dependency** that other systems (including error handling) consume. It should be:

1. **Zero-dependency core** - No external dependencies in the core logger interface
2. **Transport-agnostic** - Support file, console, remote, and custom transports
3. **Context-aware** - Integrate with AsyncLocalStorage for request tracking
4. **Performance-focused** - Minimal overhead, async non-blocking
5. **Type-safe** - Structured logging with TypeScript support

## Dependency Architecture

```
┌─────────────────────────────────────────────────┐
│                 Application Layer                │
├─────────────────────────────────────────────────┤
│                 Error Framework                  │ ← Consumes Logger
├─────────────────────────────────────────────────┤
│                Logging Framework                 │ ← Foundation Layer
├─────────────────────────────────────────────────┤
│              Transport Abstractions              │
└─────────────────────────────────────────────────┘
```

## Enhanced Logging Framework

### 1. Core Logger Interface (Zero Dependencies)

```typescript
// src/logging/logger-interface.ts (GENERIC - ~50 LoC)
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  SILENT = 6,
}

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context: LogContext;
  error?: unknown;

  // Correlation IDs
  correlationId?: string;
  traceId?: string;
  spanId?: string;
}

export interface Logger {
  // Core logging methods
  trace(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
  fatal(message: string, error?: unknown, context?: LogContext): void;

  // Child logger with additional context
  child(context: LogContext): Logger;

  // Check if level is enabled (for expensive operations)
  isLevelEnabled(level: LogLevel): boolean;
}

export interface LogTransport {
  name: string;
  level: LogLevel;
  format?: LogFormatter;

  write(entry: LogEntry): void | Promise<void>;
  flush?(): Promise<void>;
  close?(): Promise<void>;
}

export interface LogFormatter {
  format(entry: LogEntry): string | object;
}
```

### 2. Context-Aware Logger Implementation

```typescript
// src/logging/context-logger.ts (GENERIC - ~150 LoC)
export class ContextLogger implements Logger {
  private static correlationStorage = new AsyncLocalStorage<string>();
  private context: LogContext = {};
  private transports: LogTransport[] = [];

  constructor(
    private name: string,
    private level: LogLevel = LogLevel.INFO,
  ) {}

  addTransport(transport: LogTransport): this {
    this.transports.push(transport);
    return this;
  }

  private log(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
    if (level < this.level) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: {
        logger: this.name,
        ...this.context,
        ...context,
        ...ContextLogger.getCorrelationContext(),
      },
      error,
    };

    // Non-blocking write to all transports
    for (const transport of this.transports) {
      if (level >= transport.level) {
        const writeResult = transport.write(entry);
        if (writeResult instanceof Promise) {
          writeResult.catch((err) =>
            console.error(`Transport ${transport.name} write failed:`, err),
          );
        }
      }
    }
  }

  static runWithCorrelation<T>(correlationId: string, fn: () => T): T {
    return ContextLogger.correlationStorage.run(correlationId, fn);
  }

  private static getCorrelationContext(): LogContext {
    const correlationId = ContextLogger.correlationStorage.getStore();
    return correlationId ? { correlationId } : {};
  }

  child(context: LogContext): Logger {
    const child = new ContextLogger(this.name, this.level);
    child.context = { ...this.context, ...context };
    child.transports = this.transports;
    return child;
  }

  trace(message: string, context?: LogContext): void {
    this.log(LogLevel.TRACE, message, undefined, context);
  }

  // ... other log methods

  error(message: string, error?: unknown, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  isLevelEnabled(level: LogLevel): boolean {
    return level >= this.level;
  }
}
```

### 3. Transport Implementations

```typescript
// src/logging/transports/console-transport.ts (GENERIC - ~50 LoC)
export class ConsoleTransport implements LogTransport {
  name = 'console';

  constructor(
    public level: LogLevel = LogLevel.INFO,
    public format: LogFormatter = new JsonFormatter(),
  ) {}

  write(entry: LogEntry): void {
    const formatted = this.format.format(entry);
    const output = typeof formatted === 'string' ? formatted : JSON.stringify(formatted);

    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(output);
        break;
    }
  }
}

// src/logging/transports/file-transport.ts (GENERIC - ~100 LoC)
export class FileTransport implements LogTransport {
  name = 'file';
  private buffer: string[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(
    private writer: FileWriter, // Injected abstraction
    public level: LogLevel = LogLevel.INFO,
    public format: LogFormatter = new JsonFormatter(),
    private options: {
      maxBufferSize?: number;
      flushInterval?: number;
    } = {},
  ) {
    this.scheduleFlush();
  }

  write(entry: LogEntry): void {
    const formatted = this.format.format(entry);
    const line = typeof formatted === 'string' ? formatted : JSON.stringify(formatted);

    this.buffer.push(line);

    if (this.buffer.length >= (this.options.maxBufferSize ?? 100)) {
      this.flush().catch(console.error);
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const lines = this.buffer.splice(0);
    await this.writer.appendLines(lines);
  }

  async close(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
  }

  private scheduleFlush(): void {
    const interval = this.options.flushInterval ?? 1000;
    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, interval);
  }
}

// File writer abstraction for edge compatibility
export interface FileWriter {
  appendLines(lines: string[]): Promise<void>;
}
```

### 4. Formatters

```typescript
// src/logging/formatters/index.ts (GENERIC - ~100 LoC)
export class JsonFormatter implements LogFormatter {
  format(entry: LogEntry): object {
    return {
      timestamp: entry.timestamp.toISOString(),
      level: LogLevel[entry.level],
      message: entry.message,
      context: entry.context,
      error: entry.error ? this.formatError(entry.error) : undefined,
    };
  }

  private formatError(error: unknown): object {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...('cause' in error ? { cause: this.formatError(error.cause) } : {}),
      };
    }
    return { value: String(error) };
  }
}

export class PrettyFormatter implements LogFormatter {
  private colors = {
    [LogLevel.TRACE]: '\x1b[90m',
    [LogLevel.DEBUG]: '\x1b[36m',
    [LogLevel.INFO]: '\x1b[32m',
    [LogLevel.WARN]: '\x1b[33m',
    [LogLevel.ERROR]: '\x1b[31m',
    [LogLevel.FATAL]: '\x1b[35m',
  };

  format(entry: LogEntry): string {
    const color = this.colors[entry.level];
    const reset = '\x1b[0m';
    const level = LogLevel[entry.level].padEnd(5);

    let output = `${color}[${entry.timestamp.toISOString()}] ${level}${reset} ${entry.message}`;

    if (Object.keys(entry.context).length > 0) {
      output += ` ${JSON.stringify(entry.context)}`;
    }

    if (entry.error) {
      output += '\n' + this.formatError(entry.error);
    }

    return output;
  }

  private formatError(error: unknown, indent = '  '): string {
    // Error formatting implementation
  }
}
```

### 5. Integration with Error Framework

```typescript
// src/logging/error-integration.ts (GENERIC - ~50 LoC)
export class LoggingErrorReporter implements ErrorReporter {
  constructor(private logger: Logger) {}

  report(error: StructuredError): void {
    const context: LogContext = {
      errorId: error.id,
      errorCode: error.code,
      errorCategory: error.category,
      retryable: error.retryable,
      ...error.metadata,
    };

    // Use appropriate log level based on error category
    switch (error.category) {
      case ErrorCategory.INTERNAL:
      case ErrorCategory.FATAL:
        this.logger.fatal(error.message, error, context);
        break;
      case ErrorCategory.VALIDATION:
      case ErrorCategory.NOT_FOUND:
        this.logger.warn(error.message, error, context);
        break;
      default:
        this.logger.error(error.message, error, context);
    }
  }
}

// Usage in error boundaries
export function createLoggingErrorBoundary(logger: Logger) {
  return function errorBoundary<T>(operation: string, fn: () => T): T {
    const childLogger = logger.child({ operation });

    try {
      childLogger.debug(`Starting ${operation}`);
      const result = fn();
      childLogger.debug(`Completed ${operation}`);
      return result;
    } catch (error) {
      childLogger.error(`Failed ${operation}`, error);
      throw error;
    }
  };
}
```

### 6. Performance Monitoring Integration

```typescript
// src/logging/performance-integration.ts (GENERIC - ~50 LoC)
export class PerformanceLogger implements PerformanceMonitor {
  constructor(private logger: Logger) {}

  startTimer(operation: string): () => void {
    const start = process.hrtime.bigint();
    const logger = this.logger;

    return () => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1_000_000; // Convert to ms

      logger.debug(`Performance: ${operation}`, {
        operation,
        durationMs: duration,
        timestamp: new Date().toISOString(),
      });
    };
  }

  recordMetric(name: string, value: number): void {
    this.logger.debug('Metric recorded', { metric: name, value });
  }
}
```

### 7. Request Tracing

```typescript
// src/logging/request-tracing.ts (GENERIC - ~50 LoC)
export class RequestTracer {
  constructor(private logger: Logger) {}

  traceRequest<T>(requestId: string, operation: string, fn: () => Promise<T>): Promise<T> {
    return ContextLogger.runWithCorrelation(requestId, async () => {
      const logger = this.logger.child({ requestId, operation });
      const timer = logger.isLevelEnabled(LogLevel.DEBUG) ? process.hrtime.bigint() : null;

      logger.info(`Request started: ${operation}`);

      try {
        const result = await fn();

        if (timer) {
          const duration = Number(process.hrtime.bigint() - timer) / 1_000_000;
          logger.info(`Request completed: ${operation}`, { durationMs: duration });
        } else {
          logger.info(`Request completed: ${operation}`);
        }

        return result;
      } catch (error) {
        logger.error(`Request failed: ${operation}`, error);
        throw error;
      }
    });
  }
}
```

## Testing the Logger

```typescript
// src/logging/logger.test.ts
describe('ContextLogger', () => {
  it('should propagate context to child loggers', () => {
    const transport = new TestTransport();
    const logger = new ContextLogger('test').addTransport(transport);

    const child = logger.child({ userId: '123' });
    child.info('Test message');

    expect(transport.entries[0].context).toMatchObject({
      logger: 'test',
      userId: '123',
    });
  });

  it('should include correlation ID from async context', async () => {
    const transport = new TestTransport();
    const logger = new ContextLogger('test').addTransport(transport);

    await ContextLogger.runWithCorrelation('req-123', () => {
      logger.info('Test message');
    });

    expect(transport.entries[0].context.correlationId).toBe('req-123');
  });

  it('should not log below configured level', () => {
    const transport = new TestTransport();
    const logger = new ContextLogger('test', LogLevel.WARN).addTransport(transport);

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warn message');

    expect(transport.entries).toHaveLength(1);
    expect(transport.entries[0].message).toBe('Warn message');
  });
});
```

## Usage Example

```typescript
// Application setup
const logger = new ContextLogger('oak-notion-mcp', LogLevel.INFO)
  .addTransport(new ConsoleTransport(LogLevel.INFO, new PrettyFormatter()))
  .addTransport(
    new FileTransport(new EdgeCompatibleFileWriter(), LogLevel.DEBUG, new JsonFormatter()),
  );

// Error framework integration
const errorReporter = new CompositeErrorReporter([
  new LoggingErrorReporter(logger.child({ component: 'error-handler' })),
  new MetricsErrorReporter(new PerformanceLogger(logger)),
]);

// Request handling
const tracer = new RequestTracer(logger);
await tracer.traceRequest('req-123', 'notion.getPage', async () => {
  // Operation implementation
});
```

## Benefits

1. **Separation of Concerns**: Logger is independent, error framework consumes it
2. **Zero Core Dependencies**: Core logger interface has no external deps
3. **Edge Compatible**: Abstractions for file system and other Node.js APIs
4. **Performance**: Async non-blocking, level checking, buffering
5. **Testable**: All transports and formatters are easily mockable
6. **Extensible**: Plugin architecture for transports and formatters
7. **Context Propagation**: AsyncLocalStorage for request tracking
8. **Type Safe**: Full TypeScript support with structured logging

## Extractable Code Summary

- Core Logger Interface: ~50 LoC
- Context Logger Implementation: ~150 LoC
- Console Transport: ~50 LoC
- File Transport: ~100 LoC
- Formatters: ~100 LoC
- Error Integration: ~50 LoC
- Performance Integration: ~50 LoC
- Request Tracing: ~50 LoC

**Total: ~600 LoC of generic logging framework**

This brings our total extractable code to **~1,800 LoC (60% of codebase)**, exceeding our original target!

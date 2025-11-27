# Logging Guidance for AI Agents

This guide helps AI agents working on this codebase understand when and how to add, modify, and test logging functionality.

**Last Updated**: 2025-11-08  
**Phase**: Phase 2 Complete (Observability instrumentation delivered)

## Overview

The Oak MCP Ecosystem uses `@oaknational/mcp-logger` for structured logging with Phase 2 observability features:

- **Correlation IDs**: Request tracing across the system
- **Timing instrumentation**: Sub-millisecond precision with slow request warnings
- **Error context enrichment**: Full debugging context in error scenarios

All logging must follow these patterns and maintain the architectural constraints established in Phase 1 and Phase 2.

## When to Add Logging

### Always Log These Events

**Service Lifecycle:**

```typescript
// ✅ Server startup
logger.info('Server starting', { port, environment });

// ✅ Server ready
logger.info('Server ready', { port, uptime });

// ✅ Server shutdown
logger.info('Server shutting down', { uptime, reason });
```

**Request/Tool Execution Boundaries:**

```typescript
// ✅ Request started (already instrumented in middleware)
logger.debug('Request started', { correlationId, method, path });

// ✅ Tool execution started (already instrumented in server)
logger.info('Tool execution started', { correlationId, toolName });

// ✅ Request/tool completed with timing
const duration = timer.end();
logger.info('Request completed', {
  correlationId,
  duration: duration.formatted,
  durationMs: duration.ms,
});
```

**Errors:**

```typescript
// ✅ All errors must be logged
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error, {
    correlationId,
    operationName: 'riskyOperation',
    context: additionalContext,
  });
  throw error; // Re-throw after logging
}
```

**Performance-Critical Operations:**

```typescript
// ✅ Operations that might be slow
const timer = startTimer();
const result = await expensiveOperation();
const duration = timer.end();

if (duration.ms > 1000) {
  logger.warn('Slow operation detected', {
    operation: 'expensiveOperation',
    duration: duration.formatted,
    durationMs: duration.ms,
  });
}
```

### Consider Logging These Events

**State Changes:**

```typescript
// Configuration changes
logger.info('Configuration updated', {
  setting: 'maxRetries',
  oldValue: 3,
  newValue: 5,
});

// Cache operations (at DEBUG level)
logger.debug('Cache hit', { key: 'user_123', ttl: 300 });
logger.debug('Cache miss', { key: 'user_456' });
```

**External API Calls:**

```typescript
// Before calling external APIs
logger.debug('Calling external API', {
  service: 'oak-api',
  endpoint: '/lessons',
  correlationId,
});

// After receiving response
logger.debug('API response received', {
  service: 'oak-api',
  statusCode: 200,
  duration: duration.formatted,
  correlationId,
});
```

**Business Logic Decisions:**

```typescript
// Branching logic that affects behavior
if (useStubTools) {
  logger.info('Using stub tools', { reason: 'development mode' });
  return stubExecutor;
} else {
  logger.info('Using live tools', { apiKey: apiKey ? 'present' : 'missing' });
  return liveExecutor;
}
```

### Do NOT Log These

**Sensitive Data:**

```typescript
// ❌ NEVER log credentials, API keys, tokens
logger.info('User authenticated', {
  password: user.password, // ❌ NEVER
  apiKey: process.env.API_KEY, // ❌ NEVER
  token: authToken, // ❌ NEVER
});

// ✅ Log safely
logger.info('User authenticated', {
  userId: user.id, // ✅ Safe identifier
  authMethod: 'oauth', // ✅ Non-sensitive metadata
});
```

**High-Volume Repetitive Logs:**

```typescript
// ❌ Per-item logging in loops (log volume explosion)
for (const item of items) {
  logger.debug('Processing item', { itemId: item.id }); // ❌ Too many logs
}

// ✅ Aggregate logging
const startTime = Date.now();
let successCount = 0;
let errorCount = 0;

for (const item of items) {
  try {
    await processItem(item);
    successCount++;
  } catch (error) {
    errorCount++;
  }
}

logger.info('Batch processing complete', {
  totalItems: items.length,
  successCount,
  errorCount,
  duration: `${Date.now() - startTime}ms`,
});
```

**Test/Debug Noise:**

```typescript
// ❌ Leaving debug logs in production code
logger.debug('Got here'); // ❌ Useless message
logger.debug('x =', x); // ❌ Use structured context instead

// ✅ Meaningful debug logs
logger.debug('Input validation completed', {
  inputSize: input.length,
  validationTime: duration.formatted,
});
```

## Logger Entry Point Selection

### Main Entry Point: `@oaknational/mcp-logger`

**When to use:**

- Browser contexts (Next.js client/server components)
- Vercel Edge Functions
- Any code that might run in a browser environment
- HTTP MCP server (browser-compatible, stdout logging)

**Example:**

```typescript
import { createAdaptiveLogger, startTimer } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({
  name: 'http-server',
  level: 'INFO',
  sinks: {
    stdout: true, // Required for Vercel
    file: false, // Not available in browser
  },
});
```

**Constraints:**

- NO Node.js `fs` imports allowed
- Console logging only (stdout)
- Must be tree-shakeable
- No file sink support

### Node Entry Point: `@oaknational/mcp-logger/node`

**When to use:**

- Node.js backend services
- Stdio MCP server (file logging required)
- CLI tools and scripts
- Any code that needs file logging

**Example:**

```typescript
import { createAdaptiveLogger, startTimer } from '@oaknational/mcp-logger/node';

const logger = createAdaptiveLogger({
  name: 'stdio-server',
  level: 'DEBUG',
  sinks: {
    stdout: false, // MUST be false for stdio MCP
    file: {
      path: '.logs/oak-curriculum-mcp/server.log',
      append: true,
    },
  },
});
```

**Constraints:**

- File sink REQUIRED for stdio servers
- NEVER log to stdout in stdio servers (corrupts MCP protocol)
- Can import Node.js built-ins

### Decision Tree

```text
Are you working on code that might run in a browser?
├─ YES → Use @oaknational/mcp-logger (main entry)
└─ NO → Does it need file logging?
    ├─ YES → Use @oaknational/mcp-logger/node
    └─ NO → Use @oaknational/mcp-logger (main entry)
```

## Correlation ID Propagation Patterns

### HTTP Server Pattern

Correlation IDs are automatically generated and propagated via middleware. In handlers, extract and use:

```typescript
import { extractCorrelationId, createChildLogger } from './logging';

export function createHandler(logger: Logger) {
  return async (req: Request, res: Response) => {
    // Extract correlation ID from res.locals
    const correlationId = extractCorrelationId(res);

    // Create child logger with correlation context
    const requestLogger = createChildLogger(logger, correlationId);

    // All logs now include correlation ID
    requestLogger.info('Processing request', {
      path: req.path,
    });

    try {
      const result = await processRequest(req);
      requestLogger.info('Request successful');
      res.json(result);
    } catch (error) {
      requestLogger.error('Request failed', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
```

### Stdio Server Pattern

Correlation IDs are generated per tool invocation. Pass to all operations:

```typescript
import { generateCorrelationId, createChildLogger } from './correlation';
import { startTimer } from '@oaknational/mcp-logger/node';

async function executeTool(toolName: string, args: unknown, config: RuntimeConfig) {
  // Generate correlation ID for this execution
  const correlationId = generateCorrelationId();

  // Create child logger
  const toolLogger = createChildLogger(logger, correlationId, config);

  // Start timing
  const timer = startTimer();

  toolLogger.info('Tool execution started', { toolName, correlationId });

  try {
    const result = await actualToolExecution(toolName, args);
    const duration = timer.end();

    toolLogger.info('Tool execution completed', {
      toolName,
      correlationId,
      duration: duration.formatted,
      durationMs: duration.ms,
    });

    return result;
  } catch (error) {
    const duration = timer.end();
    toolLogger.error('Tool execution failed', error, {
      toolName,
      correlationId,
      duration: duration.formatted,
    });
    throw error;
  }
}
```

### Passing Correlation IDs Through Layers

```typescript
// ✅ Pass correlation ID explicitly
async function processRequest(
  request: Request,
  correlationId: string,
  logger: Logger,
): Promise<Result> {
  logger.info('Processing started', { correlationId });

  // Pass to next layer
  const data = await fetchData(request.id, correlationId, logger);
  const result = await transform(data, correlationId, logger);

  return result;
}

// ❌ Don't use global state
let globalCorrelationId: string; // ❌ Bad: global state

async function processRequest(request: Request): Promise<Result> {
  globalCorrelationId = generateCorrelationId(); // ❌ Bad: mutation
  // ...
}
```

## Timing Instrumentation Patterns

### Basic Timing

```typescript
import { startTimer } from '@oaknational/mcp-logger';

async function timedOperation() {
  const timer = startTimer();

  try {
    const result = await doWork();
    const duration = timer.end();

    logger.info('Operation completed', {
      duration: duration.formatted, // "1.23s"
      durationMs: duration.ms, // 1234.56
    });

    return result;
  } catch (error) {
    const duration = timer.end();
    logger.error('Operation failed', error, {
      duration: duration.formatted,
    });
    throw error;
  }
}
```

### Slow Operation Warnings

```typescript
const timer = startTimer();
const result = await operation();
const duration = timer.end();

// Define threshold for this operation
const SLOW_THRESHOLD_MS = 2000;

if (duration.ms > SLOW_THRESHOLD_MS) {
  logger.warn('Slow operation detected', {
    operation: 'fetchUserData',
    duration: duration.formatted,
    durationMs: duration.ms,
    threshold: `${SLOW_THRESHOLD_MS}ms`,
    slowOperation: true, // ✅ Flag for easy filtering
  });
}
```

### Multi-Stage Timing

```typescript
async function complexOperation() {
  const totalTimer = startTimer();

  // Stage 1
  const stage1Timer = startTimer();
  await stage1();
  const stage1Duration = stage1Timer.end();

  // Stage 2
  const stage2Timer = startTimer();
  await stage2();
  const stage2Duration = stage2Timer.end();

  const totalDuration = totalTimer.end();

  logger.info('Complex operation completed', {
    stages: {
      stage1: stage1Duration.formatted,
      stage2: stage2Duration.formatted,
    },
    total: totalDuration.formatted,
    breakdown: {
      stage1Ms: stage1Duration.ms,
      stage2Ms: stage2Duration.ms,
      totalMs: totalDuration.ms,
    },
  });
}
```

### Non-Destructive Timing Checks

```typescript
const timer = startTimer();

// Check elapsed time without ending the timer
const elapsed = timer.elapsed();
if (elapsed > 5000) {
  logger.warn('Operation taking longer than expected', {
    elapsedMs: elapsed,
    operation: 'longRunningTask',
  });
}

// Continue operation
await moreWork();

// End timer when operation completes
const duration = timer.end();
logger.info('Operation completed', { duration: duration.formatted });
```

## Error Enrichment Patterns

### Basic Error Enrichment

```typescript
import { enrichError, type ErrorContext, startTimer } from '@oaknational/mcp-logger';

async function handleRequest(req: Request, res: Response) {
  const timer = startTimer();
  const correlationId = extractCorrelationId(res);

  try {
    const result = await processRequest(req);
    res.json(result);
  } catch (error) {
    const duration = timer.end();

    // Enrich error with context
    const errorContext: ErrorContext = {
      correlationId,
      duration,
      requestMethod: req.method,
      requestPath: req.path,
    };

    const enrichedError = enrichError(error as Error, errorContext);

    // Log enriched error
    logger.error('Request failed', {
      message: enrichedError.message,
      stack: enrichedError.stack,
      correlationId,
      duration: duration.formatted,
      method: req.method,
      path: req.path,
    });

    res.status(500).json({ error: 'Internal server error', correlationId });
  }
}
```

### Tool-Specific Error Enrichment

```typescript
async function executeTool(toolName: string, args: unknown) {
  const correlationId = generateCorrelationId();
  const timer = startTimer();

  try {
    return await actualExecution(toolName, args);
  } catch (error) {
    const duration = timer.end();

    // Enrich with tool context
    const errorContext: ErrorContext = {
      correlationId,
      duration,
      toolName, // Tool-specific context
    };

    const enrichedError = enrichError(error as Error, errorContext);

    logger.error('Tool execution failed', {
      message: enrichedError.message,
      correlationId,
      duration: duration.formatted,
      toolName,
    });

    throw enrichedError;
  }
}
```

## Testing Logging

### Testing Log Calls

```typescript
import { describe, it, expect, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';

describe('myFunction', () => {
  it('logs operation start and completion', async () => {
    // Create mock logger
    const mockLogger: Logger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
    };

    await myFunction(mockLogger);

    // Verify logs were called
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Operation started',
      expect.objectContaining({
        operationName: 'myFunction',
      }),
    );

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Operation completed',
      expect.objectContaining({
        duration: expect.any(String),
      }),
    );
  });
});
```

### Testing Error Logging

```typescript
describe('error handling', () => {
  it('logs errors with full context', async () => {
    const mockLogger: Logger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
    };

    const error = new Error('Test error');

    await expect(async () => {
      await failingOperation(mockLogger);
    }).rejects.toThrow('Test error');

    // Verify error was logged with context
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Operation failed',
      error,
      expect.objectContaining({
        correlationId: expect.stringMatching(/^req_\d+_[a-f0-9]{6}$/),
        duration: expect.any(String),
      }),
    );
  });
});
```

### Testing Timing

```typescript
import { startTimer } from '@oaknational/mcp-logger';

describe('timing', () => {
  it('logs operation duration', async () => {
    vi.useFakeTimers();

    const mockLogger: Logger = { info: vi.fn() /* ... */ };

    const promise = timedOperation(mockLogger);

    // Advance time
    vi.advanceTimersByTime(1500);

    await promise;

    // Verify timing was logged
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        durationMs: expect.closeTo(1500, 10),
        duration: expect.stringMatching(/^\d+\.\d{2}s$|^\d+ms$/),
      }),
    );

    vi.useRealTimers();
  });
});
```

### Testing Correlation ID Propagation

```typescript
describe('correlation', () => {
  it('propagates correlation ID through layers', async () => {
    const mockLogger: Logger = { info: vi.fn() /* ... */ };
    const correlationId = 'req_123_abc';

    await operation(correlationId, mockLogger);

    // Verify all log calls include the correlation ID
    const calls = (mockLogger.info as any).mock.calls;
    calls.forEach(([message, context]: [string, any]) => {
      expect(context).toHaveProperty('correlationId', correlationId);
    });
  });
});
```

## Common Pitfalls to Avoid

### Pitfall 1: Logging Before Validation

```typescript
// ❌ Logging unvalidated data
function processInput(data: unknown) {
  logger.info('Processing input', { data }); // ❌ `data` is unknown
  const validated = InputSchema.parse(data);
  // ...
}

// ✅ Log after validation
function processInput(data: unknown) {
  const validated = InputSchema.parse(data);
  logger.info('Processing input', {
    inputType: validated.type,
    inputSize: validated.items.length,
  });
  // ...
}
```

### Pitfall 2: Forgetting to Re-throw Errors

```typescript
// ❌ Swallowing errors after logging
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', error);
  // ❌ Error is lost!
}

// ✅ Log AND re-throw
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', error);
  throw error; // ✅ Propagate error
}
```

### Pitfall 3: Using Wrong Entry Point

```typescript
// ❌ Importing Node entry in browser code
import { createAdaptiveLogger } from '@oaknational/mcp-logger/node'; // ❌ Breaks in browser!

// ✅ Use main entry for browser-compatible code
import { createAdaptiveLogger } from '@oaknational/mcp-logger'; // ✅ Works everywhere
```

### Pitfall 4: Logging to Stdout in Stdio Server

```typescript
// ❌ Logging to stdout corrupts MCP protocol
const logger = createAdaptiveLogger({
  sinks: { stdout: true, file: false }, // ❌ Corrupts protocol!
});

// ✅ File-only logging for stdio
const logger = createAdaptiveLogger({
  sinks: {
    stdout: false, // ✅ MUST be false
    file: { path: '.logs/server.log' },
  },
});
```

### Pitfall 5: Not Including Timing in Error Logs

```typescript
// ❌ Missing timing information in error
const timer = startTimer();
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', error); // ❌ Lost timing!
  throw error;
}

// ✅ Include timing even on error
const timer = startTimer();
try {
  await operation();
  const duration = timer.end();
  logger.info('Operation completed', { duration: duration.formatted });
} catch (error) {
  const duration = timer.end(); // ✅ Capture timing
  logger.error('Operation failed', error, {
    duration: duration.formatted,
  });
  throw error;
}
```

### Pitfall 6: Creating New Loggers Instead of Using Injected

```typescript
// ❌ Creating new logger instance
function handler(req: Request) {
  const logger = createAdaptiveLogger({ level: 'INFO' }); // ❌ New instance!
  logger.info('Handling request');
}

// ✅ Accept logger via dependency injection
function handler(req: Request, logger: Logger) {
  logger.info('Handling request');
}
```

## Quick Reference

### Import Cheat Sheet

```typescript
// Browser-safe (HTTP server, Next.js)
import {
  createAdaptiveLogger,
  startTimer,
  enrichError,
  type Logger,
  type ErrorContext,
  type Duration,
  type Timer,
} from '@oaknational/mcp-logger';

// Node.js (Stdio server, CLI tools)
import {
  createAdaptiveLogger,
  startTimer,
  enrichError,
  type Logger,
  type ErrorContext,
  type Duration,
  type Timer,
} from '@oaknational/mcp-logger/node';
```

### Log Level Guidelines

- **TRACE**: Never use (too verbose)
- **DEBUG**: Development only, detailed operation traces
- **INFO**: Production, normal operation milestones
- **WARN**: Production, recoverable issues, slow operations
- **ERROR**: Production, operation failures
- **FATAL**: Critical failures requiring immediate intervention

### When to Use Which Log Level

```typescript
logger.debug('Cache hit', { key }); // DEBUG: detailed traces
logger.info('Request completed', { duration }); // INFO: normal operations
logger.warn('Slow request detected', { duration }); // WARN: performance issues
logger.error('Request failed', error); // ERROR: failures
logger.fatal('Database connection lost', error); // FATAL: critical failures
```

## Further Reading

- [Logger Package README](../../packages/libs/logger/README.md) - Complete API documentation
- [Testing Strategy](../../.agent/directives-and-memory/testing-strategy.md) - How to test logging code
- [HTTP Server README](../../apps/oak-curriculum-mcp-streamable-http/README.md) - HTTP logging patterns
- [Stdio Server README](../../apps/oak-curriculum-mcp-stdio/README.md) - Stdio logging patterns
- [Production Debugging Runbook](../development/production-debugging-runbook.md) - Using logs for debugging

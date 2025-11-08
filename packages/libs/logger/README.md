# @oaknational/mcp-logger

Adaptive logging library for multi-runtime MCP (Model Context Protocol) applications. Supports configurable output destinations (stdout, file, or both) and provides utilities for JSON sanitization and Express middleware integration.

## Installation

```bash
pnpm add @oaknational/mcp-logger
```

For Express middleware support, also install Express as a peer dependency:

```bash
pnpm add express
```

## Quick Start

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({ level: 'INFO' });

logger.info('Application started');
logger.debug('Debug information', { userId: '123' });
logger.error('An error occurred', error, { context: 'additional info' });
```

## Configuration

The logger can be configured via environment variables:

### Environment Variables

| Variable                 | Type   | Default | Description                                                        |
| ------------------------ | ------ | ------- | ------------------------------------------------------------------ |
| `LOG_LEVEL`              | string | `INFO`  | Minimum log level to emit (TRACE, DEBUG, INFO, WARN, ERROR, FATAL) |
| `MCP_LOGGER_STDOUT`      | string | `true`  | Enable/disable stdout output (`true` or `false`)                   |
| `MCP_LOGGER_FILE_PATH`   | string | -       | Path to log file (enables file logging when set)                   |
| `MCP_LOGGER_FILE_APPEND` | string | `true`  | Append to file (`true`) or overwrite (`false`)                     |

### Log Levels

Log levels are hierarchical (TRACE < DEBUG < INFO < WARN < ERROR < FATAL). Setting a log level will emit logs at that level and above.

- `TRACE`: Most verbose, for detailed tracing
- `DEBUG`: Debug information for development
- `INFO`: General informational messages
- `WARN`: Warning messages for potentially harmful situations
- `ERROR`: Error messages for error events
- `FATAL`: Critical errors that may cause the application to abort

## Core Concepts

### Sinks

A sink is a destination where logs are written. The logger supports three sink configurations:

- **stdout only**: Logs written to console/stdout (default for HTTP servers, Vercel-compatible)
- **file only**: Logs written to a file (required for stdio servers to keep stdout clean for MCP protocol)
- **both**: Logs written to both stdout and file (useful for local development)

### Log Levels

Log levels control the verbosity of logging. Set `LOG_LEVEL` to filter logs below the specified level.

### JSON Sanitisation

All logged data is automatically sanitised to ensure JSON-safety. The library converts:

- `undefined` → `null`
- `Date` objects → ISO string format
- `Error` objects → object with `message`, `name`, and `stack` properties
- Circular references → `'[Circular]'` string
- Unserializable values → `'[unserializable]'` string

## Usage Examples

### HTTP Server (Vercel-compatible)

For HTTP servers deployed on Vercel or similar platforms, use stdout-only logging:

```typescript
import { createAdaptiveLogger, DEFAULT_HTTP_SINK_CONFIG } from '@oaknational/mcp-logger';
import { createRequestLogger, createErrorLogger } from '@oaknational/mcp-logger';
import express from 'express';

const app = express();

// Create logger with stdout-only configuration
const logger = createAdaptiveLogger({ level: 'INFO' }, undefined, DEFAULT_HTTP_SINK_CONFIG);

// Add Express middleware
app.use(createRequestLogger(logger, { level: 'info' }));
// ... your routes ...
app.use(createErrorLogger(logger));

app.listen(3000);
```

**Environment variables:**

```bash
LOG_LEVEL=INFO
MCP_LOGGER_STDOUT=true
```

### Stdio Server (Protocol-correct)

For stdio servers, use file-only logging to keep stdout clean for MCP protocol frames:

```typescript
import { createAdaptiveLogger, DEFAULT_STDIO_SINK_CONFIG } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({ level: 'DEBUG' }, undefined, DEFAULT_STDIO_SINK_CONFIG);

logger.info('Stdio server started');
// All logs go to file, stdout remains clean for MCP protocol
```

**Environment variables:**

```bash
LOG_LEVEL=DEBUG
MCP_LOGGER_STDOUT=false
MCP_LOGGER_FILE_PATH=./logs/stdio-mcp-server.log
MCP_LOGGER_FILE_APPEND=true
```

### Local Development (Both Sinks)

For local development, you might want logs in both console and file:

```typescript
import { createAdaptiveLogger, parseSinkConfigFromEnv } from '@oaknational/mcp-logger';

const sinkConfig = parseSinkConfigFromEnv(process.env);
const logger = createAdaptiveLogger({ level: 'DEBUG' }, undefined, sinkConfig);

logger.debug('Development log', { environment: 'local' });
```

**Environment variables:**

```bash
LOG_LEVEL=DEBUG
MCP_LOGGER_STDOUT=true
MCP_LOGGER_FILE_PATH=./logs/dev.log
MCP_LOGGER_FILE_APPEND=true
```

### Express Middleware Integration

The logger provides Express middleware for request and error logging:

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger';
import { createRequestLogger, createErrorLogger } from '@oaknational/mcp-logger';
import express from 'express';

const app = express();
const logger = createAdaptiveLogger({ level: 'INFO' });

// Log all incoming requests (register before routes)
app.use(createRequestLogger(logger, { level: 'debug' }));

// Your routes here
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

// Log errors (register after all routes)
app.use(createErrorLogger(logger));

app.listen(3000);
```

The request logger extracts and sanitises:

- HTTP method
- URL and path
- Headers
- Query parameters
- Route parameters
- Client IP address
- Request body (optional, via `includeBody` option)

### Timing Utilities

The logger provides high-precision timing utilities for measuring operation duration:

```typescript
import { startTimer } from '@oaknational/mcp-logger';

const timer = startTimer();

// Do some work...
await performOperation();

// Check elapsed time without stopping
console.log(`Elapsed: ${timer.elapsed()}ms`);

// Get final duration
const duration = timer.end();
console.log(`Operation took ${duration.formatted}`); // "123ms" or "1.23s"
console.log(`Precise duration: ${duration.ms}ms`); // 1234.56
```

**Key Features:**

- **Sub-millisecond precision**: Uses `performance.now()` for accurate timing
- **Human-readable formatting**: Durations < 1s show as "123ms", >= 1s show as "1.23s"
- **Browser and Node compatible**: Works in all JavaScript runtimes
- **Non-destructive**: Can check `elapsed()` multiple times before calling `end()`

**Example: Timing with logging**

```typescript
import { createAdaptiveLogger, startTimer } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({ level: 'INFO' });
const timer = startTimer();

try {
  await processRequest();
  const duration = timer.end();

  logger.info('Request processed successfully', {
    duration: duration.formatted,
    durationMs: duration.ms,
  });
} catch (error) {
  const duration = timer.end();

  logger.error('Request failed', error, {
    duration: duration.formatted,
    durationMs: duration.ms,
  });
}
```

### Correlation ID Support

The HTTP server (`@oaknational/oak-curriculum-mcp-streamable-http`) includes built-in correlation ID support for request tracing. The logger package provides helper functions for working with correlation IDs:

```typescript
import {
  createChildLogger,
  extractCorrelationId,
} from '@oaknational/oak-curriculum-mcp-streamable-http/logging';

// Extract correlation ID from Express response
const correlationId = extractCorrelationId(res);

// Create a child logger with correlation ID in context
if (correlationId) {
  const correlatedLogger = createChildLogger(logger, correlationId);
  correlatedLogger.info('Processing request'); // Logs include correlationId
}
```

For more details on correlation IDs, see the [HTTP Server README](../../apps/oak-curriculum-mcp-streamable-http/README.md#request-tracing-with-correlation-ids).

### Error Context Enrichment

The logger package provides error enrichment utilities to add debugging context (correlation IDs, timing, request details) to errors before logging. This enables better production debugging and request tracing.

```typescript
import { enrichError, startTimer, type ErrorContext } from '@oaknational/mcp-logger';

const timer = startTimer();
const correlationId = 'req_1699123456789_a3f2c9';

try {
  await riskyOperation();
} catch (error) {
  const duration = timer.end();

  // Enrich error with context
  const errorContext: ErrorContext = {
    correlationId,
    duration,
    requestMethod: 'POST',
    requestPath: '/api/search',
  };

  const enrichedError = enrichError(error as Error, errorContext);

  // Log enriched error with full context
  logger.error('Operation failed', {
    message: enrichedError.message,
    stack: enrichedError.stack,
    correlationId,
    duration: duration.formatted,
    durationMs: duration.ms,
  });
}
```

**ErrorContext Interface:**

```typescript
interface ErrorContext {
  readonly correlationId?: string; // Correlation ID for request tracing
  readonly duration?: Duration; // Timing information
  readonly requestMethod?: string; // HTTP method (for HTTP servers)
  readonly requestPath?: string; // HTTP path (for HTTP servers)
  readonly toolName?: string; // MCP tool name (for stdio servers)
}
```

**Key Features:**

- **Preserves original error**: Stack trace and message remain intact
- **Non-enumerable attachment**: Context attached as non-enumerable property
- **JSON-serializable**: Context can be safely serialized for logging
- **Type-safe**: Structured context with specific field types
- **Optional fields**: Include only the context available at error time

**Example: Stdio server error enrichment**

```typescript
import { enrichError, startTimer, type ErrorContext } from '@oaknational/mcp-logger/node';

const timer = startTimer();
const correlationId = generateCorrelationId();

try {
  const result = await executeToolCall('searchLessons', params);
} catch (error) {
  const duration = timer.end();

  const errorContext: ErrorContext = {
    correlationId,
    duration,
    toolName: 'searchLessons',
  };

  const enrichedError = enrichError(error as Error, errorContext);

  logger.error('Tool execution failed', {
    message: enrichedError.message,
    correlationId,
    duration: duration.formatted,
    toolName: 'searchLessons',
  });
}
```

**Example enriched error log output:**

```json
{
  "level": "error",
  "message": "Tool execution failed",
  "context": {
    "message": "Invalid input parameters",
    "correlationId": "req_1699123456789_a3f2c9",
    "duration": "145ms",
    "durationMs": 145.23,
    "toolName": "searchLessons"
  },
  "timestamp": "2024-11-06T12:34:56.789Z"
}
```

For implementation examples, see the HTTP and Stdio server READMEs for detailed error debugging workflows.

## API Reference

### Logger Interface

```typescript
interface Logger {
  trace(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
  fatal(message: string, error?: unknown, context?: unknown): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: JsonObject): Logger;
}
```

### Sink Configuration

```typescript
interface LoggerSinkConfig {
  readonly stdout: boolean;
  readonly file?: FileSinkConfig;
}

interface FileSinkConfig {
  readonly path: string;
  readonly append?: boolean;
}
```

Functions:

- `parseSinkConfigFromEnv(env: LoggerSinkEnvironment): LoggerSinkConfig` - Parse environment variables into sink config
- `createAdaptiveLogger(options?, consolaInstance?, sinkConfig?): Logger` - Create logger with sink configuration

Constants:

- `DEFAULT_HTTP_SINK_CONFIG` - Stdout-only configuration for HTTP servers
- `DEFAULT_STDIO_SINK_CONFIG` - File-only configuration for stdio servers

### JSON Sanitisation Functions

```typescript
function sanitiseForJson(value: unknown): JsonValue;
function isJsonValue(value: unknown): value is JsonValue;
function sanitiseObject(value: unknown): JsonObject | null;
```

### Express Middleware Functions

```typescript
function createRequestLogger(logger: Logger, options?: RequestLoggerOptions): RequestHandler;

function createErrorLogger(logger: Logger): ErrorRequestHandler;

function extractRequestMetadata(req: Request): JsonObject;

interface RequestLoggerOptions {
  level?: 'trace' | 'debug' | 'info';
  includeBody?: boolean;
}
```

## Migration Guide

### From Legacy `MCP_STREAMABLE_HTTP_*` Variables

The following environment variables have been replaced:

| Legacy Variable                 | New Variable               | Notes                       |
| ------------------------------- | -------------------------- | --------------------------- |
| `MCP_STREAMABLE_HTTP_LOG_LEVEL` | `LOG_LEVEL`                | Shared across all apps      |
| `MCP_STREAMABLE_HTTP_FILE_LOGS` | Set `MCP_LOGGER_FILE_PATH` | More explicit configuration |
| `MCP_STREAMABLE_HTTP_LOG_PATH`  | `MCP_LOGGER_FILE_PATH`     | Shared configuration        |

**Migration Steps:**

1. Replace `MCP_STREAMABLE_HTTP_LOG_LEVEL` with `LOG_LEVEL`
2. If `MCP_STREAMABLE_HTTP_FILE_LOGS=true`, set `MCP_LOGGER_FILE_PATH` to your desired log file path
3. Replace `MCP_STREAMABLE_HTTP_LOG_PATH` with `MCP_LOGGER_FILE_PATH`
4. Remove all legacy variable references from your codebase

**Example:**

```bash
# Before
MCP_STREAMABLE_HTTP_LOG_LEVEL=DEBUG
MCP_STREAMABLE_HTTP_FILE_LOGS=true
MCP_STREAMABLE_HTTP_LOG_PATH=./logs/app.log

# After
LOG_LEVEL=DEBUG
MCP_LOGGER_FILE_PATH=./logs/app.log
MCP_LOGGER_STDOUT=true
MCP_LOGGER_FILE_APPEND=true
```

### From App-Specific Loggers

If you have custom logger implementations in your application:

1. Replace custom logger creation with `createAdaptiveLogger()`
2. Update imports to use `@oaknational/mcp-logger`
3. Use `parseSinkConfigFromEnv()` to configure sinks from environment
4. Remove custom logging utilities (they're now in the shared package)

## Troubleshooting

### File Path Issues

**Problem:** Log file is not being created.

**Solutions:**

- Ensure the directory path exists or can be created
- Check file system permissions
- Verify `MCP_LOGGER_FILE_PATH` is set correctly
- On some platforms (e.g., Vercel), file system may be read-only - use stdout-only logging

### Permission Errors

**Problem:** Permission denied when writing to log file.

**Solutions:**

- Check directory and file permissions
- Ensure the application has write access to the log directory
- Consider using a directory like `./logs/` that your application owns

### Vercel Considerations

**Problem:** File logging doesn't work on Vercel.

**Solution:** Vercel's file system is read-only. Use stdout-only logging:

```typescript
const logger = createAdaptiveLogger({ level: 'INFO' }, undefined, DEFAULT_HTTP_SINK_CONFIG);
```

Vercel automatically captures stdout logs, so no file configuration is needed.

### Stdio Protocol Issues

**Problem:** MCP protocol frames are corrupted by log output.

**Solution:** Ensure stdio servers use file-only logging:

```typescript
const logger = createAdaptiveLogger({ level: 'DEBUG' }, undefined, DEFAULT_STDIO_SINK_CONFIG);
```

Never write to stdout in stdio servers - it's reserved for MCP protocol JSON-RPC frames.

### Log Level Not Working

**Problem:** Changing `LOG_LEVEL` doesn't affect log output.

**Solutions:**

- Verify the environment variable is set correctly
- Check for typos in log level value (must be uppercase: `DEBUG`, not `debug`)
- Ensure you're not overriding the log level in code
- Restart your application after changing environment variables

## License

MIT

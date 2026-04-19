# @oaknational/logger

Structured OpenTelemetry JSON logging for Oak runtimes.

`@oaknational/logger` exposes a single logger implementation,
`UnifiedLogger`, which writes one canonical `LogEvent` to one or more
`LogSink` destinations. The logger owns JSON serialisation, redaction, and
trace-correlation; sinks only receive immutable events.

## Current Contract

- `UnifiedLogger` fans out to `readonly LogSink[]`
- `error()` and `fatal()` support only these call shapes:
  - `(message, context?)`
  - `(message, error: NormalizedError, context?)`
- unknown caught values must be converted with `normalizeError()`
- `@oaknational/logger` is runtime-agnostic
- `@oaknational/logger/node` adds Node-only sink helpers

## Quick Start

```typescript
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogSink,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const level = parseLogLevel(process.env.LOG_LEVEL, 'INFO');
const sinks: readonly LogSink[] = [createNodeStdoutSink()];

const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(level),
  resourceAttributes: buildResourceAttributes(process.env, 'oak-http', '1.0.0'),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});

logger.info('Application started');
logger.debug('Loaded request context', {
  requestId: 'req-123',
});
```

## Choosing Sinks

### HTTP runtime

Use stdout only.

```typescript
import type { LogSink } from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const sinks: readonly LogSink[] = [createNodeStdoutSink()];
```

### Stdio MCP runtime

Never write logs to stdout in stdio MCP runtimes because stdout is reserved
for MCP protocol frames. A file sink is the recommended durable option.

```typescript
import { createNodeFileSink } from '@oaknational/logger/node';
import type { LogSink } from '@oaknational/logger';

const configuredFileOutput = createNodeFileSink({
  path: '.logs/oak-curriculum-mcp/server.log',
  append: true,
});

const sinks: readonly LogSink[] = configuredFileOutput ? [configuredFileOutput] : [];
```

### Local development

Use both sinks when you want console visibility and a durable log file.

```typescript
import { createNodeFileSink, createNodeStdoutSink } from '@oaknational/logger/node';
import type { LogSink } from '@oaknational/logger';

const configuredFileOutput = createNodeFileSink({
  path: '.logs/dev.log',
  append: true,
});

const sinks: readonly LogSink[] = configuredFileOutput
  ? [createNodeStdoutSink(), configuredFileOutput]
  : [createNodeStdoutSink()];
```

## Error Logging

Convert unknown caught values before passing them to `error()` or `fatal()`.

```typescript
import { normalizeError } from '@oaknational/logger';

try {
  await runOperation();
} catch (error) {
  logger.error('Operation failed', normalizeError(error), {
    operation: 'runOperation',
  });
  throw error;
}
```

## Express Middleware

The package exposes request and error middleware helpers for Express runtimes.

```typescript
import {
  UnifiedLogger,
  buildResourceAttributes,
  createErrorLogger,
  createRequestLogger,
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogSink,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const sinks: readonly LogSink[] = [createNodeStdoutSink()];

const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(parseLogLevel(process.env.LOG_LEVEL, 'INFO')),
  resourceAttributes: buildResourceAttributes(process.env, 'oak-http', '1.0.0'),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});

app.use(createRequestLogger(logger, { level: 'info' }));
app.use(createErrorLogger(logger));
```

`createRequestLogger()` and `createErrorLogger()` apply the shared
observability header-redaction policy by default. Pass `redactHeaders` when
you need a runtime-specific header projection in logs.

## Sink Configuration Helpers

`parseSinkConfigFromEnv()` resolves `stdout` and optional `file` settings from
environment input. Use it to decide which sinks to construct in the
composition root; `UnifiedLogger` only accepts concrete
`readonly LogSink[]` destinations.

Useful exports:

- `DEFAULT_HTTP_SINK_CONFIG`
- `parseSinkConfigFromEnv`
- `createNodeStdoutSink`
- `createNodeFileSink`
- `createFileSink`

## Public Surface

From `@oaknational/logger`:

- `UnifiedLogger`
- `normalizeError`, `buildNormalizedError`, `isNormalizedError`
- `mergeLogContext`
- `parseLogLevel`, `compareLogLevels`, `shouldLog`
- `buildResourceAttributes`
- `createRequestLogger`, `createErrorLogger`, `extractRequestMetadata`
- `RequestLoggerOptions`, `ErrorLoggerOptions`, `HeaderRedactor`
- `startTimer`, `createPhasedTimer`
- `parseSinkConfigFromEnv`, `DEFAULT_HTTP_SINK_CONFIG`
- `LogSink`, `LogEvent`, `Logger`, `NormalizedError`, `LogContext`

From `@oaknational/logger/node`:

- `createNodeStdoutSink`
- `createNodeFileSink`
- `createFileSink`
- `FileSinkInterface`
- `DEFAULT_STDIO_SINK_CONFIG`

## JSON types and sanitisation live in `@oaknational/observability`

As of 2026-04-19 (see [ADR-160 history entry](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md#history)), `JsonValue`, `JsonObject`, `sanitiseForJson`, `sanitiseObject`, and `isJsonValue` are owned by `@oaknational/observability`. Consumers that previously imported these from `@oaknational/logger` now import them from `@oaknational/observability` directly. The logger re-export surface was removed — there is no backwards-compatibility shim.

## Notes

- `createNodeFileSink()` may return `null` if the file sink cannot be
  initialised. Handle that in the composition root.
- Sinks should treat `LogEvent` as immutable input.
- Express middleware redacts sensitive headers before request metadata is
  logged unless you supply a custom `redactHeaders` implementation.
- The logger already applies redaction and active-span correlation before any
  sink receives the event.

# Logging Guide for SDK Consumers

This guide shows how to pair `@oaknational/curriculum-sdk` with the current
`@oaknational/logger` contract.

## Current Logger Contract

- Build a `UnifiedLogger`
- Construct sinks in the composition root
- Pass `sinks: readonly LogSink[]`
- Convert unknown errors with `normalizeError()`
- Use `@oaknational/logger/node` only when you need Node-only sink helpers

The SDK accepts any object that matches the logger interface, but
`UnifiedLogger` is the recommended implementation.

## Quick Start (Node.js)

```typescript
import { createOakClient } from '@oaknational/curriculum-sdk';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  normalizeError,
  parseLogLevel,
  startTimer,
  type LogSink,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const sinks: readonly LogSink[] = [createNodeStdoutSink()];
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(parseLogLevel(process.env.LOG_LEVEL, 'INFO')),
  resourceAttributes: buildResourceAttributes(process.env, 'oak-curriculum-sdk-consumer', '1.0.0'),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});
const apiKey = process.env.OAK_API_KEY;

if (!apiKey) {
  throw new Error('OAK_API_KEY is required');
}

const client = createOakClient({
  apiKey,
  logger,
});

async function fetchSubjects() {
  const timer = startTimer();
  const { data, error } = await client.GET('/api/v0/subjects');
  const duration = timer.end();

  if (error) {
    logger.error('Failed to fetch subjects', normalizeError(error), {
      duration: duration.formatted,
      operation: 'GET /api/v0/subjects',
    });
    throw error;
  }

  logger.info('Fetched subjects', {
    count: data.length,
    duration: duration.formatted,
  });

  return data;
}
```

## Runtime Patterns

### Browser or Edge Runtime

Use the main entry point and inject a browser-safe sink.

```typescript
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogSink,
} from '@oaknational/logger';

const consoleSink: LogSink = {
  write(event) {
    console.log(event.line.trimEnd());
  },
};

const level = parseLogLevel('INFO', 'INFO');
const sinks: readonly LogSink[] = [consoleSink];
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(level),
  resourceAttributes: buildResourceAttributes(
    { ENVIRONMENT_OVERRIDE: 'development' },
    'curriculum-sdk-browser-consumer',
    '1.0.0',
  ),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});
```

### HTTP Server

Stdout is a good default for HTTP services.

```typescript
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogSink,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const sinks: readonly LogSink[] = [createNodeStdoutSink()];
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(parseLogLevel(process.env.LOG_LEVEL, 'INFO')),
  resourceAttributes: buildResourceAttributes(process.env, 'curriculum-sdk-http-consumer', '1.0.0'),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});
```

### Stdio MCP Server

Never write logs to stdout in a stdio MCP runtime because stdout is reserved
for protocol frames.

```typescript
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogSink,
} from '@oaknational/logger';
import { createNodeFileSink } from '@oaknational/logger/node';

const configuredFileOutput = createNodeFileSink({
  path: '.logs/oak-curriculum-mcp/server.log',
  append: true,
});
const sinks: readonly LogSink[] = configuredFileOutput ? [configuredFileOutput] : [];

const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(parseLogLevel(process.env.LOG_LEVEL, 'INFO')),
  resourceAttributes: buildResourceAttributes(
    process.env,
    'curriculum-sdk-stdio-consumer',
    '1.0.0',
  ),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});
```

### CLI

CLI tools often want both stdout logging and a durable file.

```typescript
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  parseLogLevel,
  type LogSink,
} from '@oaknational/logger';
import { createNodeFileSink, createNodeStdoutSink } from '@oaknational/logger/node';

const configuredFileOutput = createNodeFileSink({
  path: '.logs/curriculum-cli.log',
  append: true,
});
const sinks: readonly LogSink[] = configuredFileOutput
  ? [createNodeStdoutSink(), configuredFileOutput]
  : [createNodeStdoutSink()];

const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(parseLogLevel(process.env.LOG_LEVEL, 'INFO')),
  resourceAttributes: buildResourceAttributes(process.env, 'curriculum-sdk-cli-consumer', '1.0.0'),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});
```

## Useful Patterns

### Correlation IDs

```typescript
function generateCorrelationId(): string {
  return `req_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

async function fetchWithCorrelation() {
  const correlationId = generateCorrelationId();
  const requestLogger = logger.child?.({ correlationId }) ?? logger;

  requestLogger.info('Starting SDK request');

  const { data, error } = await client.GET('/api/v0/subjects');

  if (error) {
    requestLogger.error('SDK request failed', normalizeError(error));
    throw error;
  }

  requestLogger.info('SDK request completed', { count: data.length });
  return data;
}
```

### Timing

```typescript
async function fetchLesson(lessonSlug: string) {
  const timer = startTimer();

  try {
    const { data, error } = await client.GET(
      '/api/v0/key-stages/{keyStageSlug}/subjects/{subjectSlug}/lessons/{lessonSlug}/summary',
      {
        params: {
          path: {
            keyStageSlug: 'ks3',
            subjectSlug: 'maths',
            lessonSlug,
          },
        },
      },
    );
    const duration = timer.end();

    if (error) {
      logger.error('Lesson fetch failed', normalizeError(error), {
        lessonSlug,
        duration: duration.formatted,
      });
      throw error;
    }

    logger.info('Lesson fetch completed', {
      lessonSlug,
      duration: duration.formatted,
    });

    return data;
  } catch (error) {
    const duration = timer.end();
    logger.error('Unexpected lesson fetch failure', normalizeError(error), {
      lessonSlug,
      duration: duration.formatted,
    });
    throw error;
  }
}
```

## Best Practices

- Build sinks at the application boundary, not inside shared library code.
- Use `readonly LogSink[]` to make fan-out explicit.
- Normalise unknown caught values before passing them to `error()` or `fatal()`.
- Avoid logging PII or secrets; prefer IDs and operational metadata.
- Keep stdout disabled in stdio MCP runtimes.
- Include enough context to understand which SDK operation failed.

## Further Reading

- [Logger Package README](../../../libs/logger/README.md)
- [Logging Guidance](../../../../docs/governance/logging-guidance.md)
- [HTTP Server README](../../../../apps/oak-curriculum-mcp-streamable-http/README.md)
- [Testing Strategy](../../../../.agent/directives/testing-strategy.md)

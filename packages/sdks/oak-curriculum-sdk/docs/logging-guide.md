# Logging Guide for SDK Consumers

This guide helps you integrate the `@oaknational/mcp-logger` package with the Oak Curriculum SDK to add structured logging, request tracing, and observability to your applications.

## Why Logging Matters

Effective logging is crucial for:

- **Production debugging**: Trace issues back to their root cause
- **Performance monitoring**: Identify slow operations and bottlenecks
- **Request tracing**: Follow requests through your application stack
- **Error investigation**: Understand failure context and patterns

The Oak Curriculum SDK integrates seamlessly with the `@oaknational/mcp-logger` package, which provides:

- Structured JSON logging
- Request correlation IDs
- Sub-millisecond timing instrumentation
- Error context enrichment
- Multi-sink support (stdout, file)
- Browser and Node.js compatibility

## Quick Start

### Installation

```bash
# Install both SDK and logger
pnpm add @oaknational/oak-curriculum-sdk @oaknational/mcp-logger
```

### Basic Integration

```typescript
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

// Create logger
const logger = createAdaptiveLogger({
  name: 'curriculum-app',
  level: 'INFO',
});

// Create SDK client
const client = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
  baseUrl: 'https://api.oak.academy',
});

// Log SDK operations
logger.info('SDK client initialized', {
  baseUrl: client.baseUrl,
});

try {
  const lessons = await client.searchLessons({ subject: 'maths' });
  logger.info('Search completed', {
    resultCount: lessons.length,
  });
} catch (error) {
  logger.error('Search failed', error);
}
```

## Logger Selection

The logger package provides two entry points to support different runtime environments:

### Browser/Edge Runtime (Next.js, Vercel Edge)

Use the **main entry point** for browser-safe logging:

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({
  level: 'INFO',
  sinks: {
    stdout: true, // Console logging only
    file: false, // Not available in browser
  },
});
```

**When to use:**

- Next.js applications (client or server components)
- Vercel Edge Functions
- Browser-based tools
- Any environment without Node.js `fs` API

### Node.js Runtime (CLI tools, MCP servers)

Use the **Node entry point** for full file logging support:

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger/node';

const logger = createAdaptiveLogger({
  level: 'INFO',
  sinks: {
    stdout: true,
    file: {
      path: '.logs/app.log',
      append: true,
    },
  },
});
```

**When to use:**

- Node.js backend services
- CLI tools and scripts
- MCP servers (especially stdio servers)
- Any environment with Node.js `fs` API

## Pattern: Logging API Calls and Errors

### Basic API Call Logging

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger';
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';

const logger = createAdaptiveLogger({ level: 'DEBUG' });
const client = new OakCurriculumClient({ apiKey: process.env.OAK_API_KEY });

async function fetchLesson(lessonSlug: string) {
  logger.debug('Fetching lesson', { lessonSlug });

  try {
    const lesson = await client.getLessonSummary(lessonSlug);

    logger.info('Lesson fetched successfully', {
      lessonSlug,
      title: lesson.title,
      subject: lesson.subjectSlug,
    });

    return lesson;
  } catch (error) {
    logger.error('Failed to fetch lesson', error, {
      lessonSlug,
    });
    throw error;
  }
}
```

### Structured Error Logging

```typescript
try {
  const result = await client.searchLessons({ subject: 'invalid' });
} catch (error) {
  // Log with structured context
  logger.error('Search operation failed', error, {
    operation: 'searchLessons',
    parameters: { subject: 'invalid' },
    timestamp: new Date().toISOString(),
  });
}
```

## Pattern: Using Correlation IDs with the SDK

Correlation IDs help trace requests across your application and into the SDK.

### Generating Correlation IDs

```typescript
function generateCorrelationId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `req_${timestamp}_${random}`;
}
```

### Using Child Loggers for Correlation

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

const baseLogger = createAdaptiveLogger({ level: 'INFO' });

async function processRequest(requestId: string) {
  // Create child logger with correlation context
  const logger = baseLogger.child?.({ correlationId: requestId }) ?? baseLogger;

  logger.info('Processing request');

  try {
    const result = await client.searchLessons({ subject: 'maths' });
    logger.info('Request completed', { resultCount: result.length });
    return result;
  } catch (error) {
    logger.error('Request failed', error);
    throw error;
  }
}
```

### Web Framework Integration (Express)

```typescript
import express from 'express';
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

const app = express();
const logger = createAdaptiveLogger({ level: 'INFO' });

// Correlation middleware
app.use((req, res, next) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();

  res.locals.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  next();
});

app.get('/lessons/:slug', async (req, res) => {
  const correlationId = res.locals.correlationId;
  const requestLogger = logger.child?.({ correlationId }) ?? logger;

  try {
    const lesson = await client.getLessonSummary(req.params.slug);
    requestLogger.info('Lesson retrieved', { slug: req.params.slug });
    res.json(lesson);
  } catch (error) {
    requestLogger.error('Failed to retrieve lesson', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Pattern: Timing SDK Operations

Use the timing utilities to measure SDK operation performance:

```typescript
import { createAdaptiveLogger, startTimer } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({ level: 'INFO' });

async function searchWithTiming(query: string) {
  const timer = startTimer();

  logger.debug('Starting search', { query });

  try {
    const results = await client.searchLessons({ query });
    const duration = timer.end();

    // Log with timing
    logger.info('Search completed', {
      query,
      resultCount: results.length,
      duration: duration.formatted,
      durationMs: duration.ms,
    });

    // Warn on slow operations
    if (duration.ms > 1000) {
      logger.warn('Slow search operation detected', {
        query,
        duration: duration.formatted,
      });
    }

    return results;
  } catch (error) {
    const duration = timer.end();
    logger.error('Search failed', error, {
      query,
      duration: duration.formatted,
    });
    throw error;
  }
}
```

### Timing Multiple Operations

```typescript
import { startTimer } from '@oaknational/mcp-logger';

async function fetchFullLessonData(lessonSlug: string) {
  const totalTimer = startTimer();

  // Time individual operations
  const summaryTimer = startTimer();
  const summary = await client.getLessonSummary(lessonSlug);
  const summaryDuration = summaryTimer.end();

  const planTimer = startTimer();
  const plan = await client.getLessonPlan(lessonSlug);
  const planDuration = planTimer.end();

  const totalDuration = totalTimer.end();

  logger.info('Lesson data fetched', {
    lessonSlug,
    timings: {
      summary: summaryDuration.formatted,
      plan: planDuration.formatted,
      total: totalDuration.formatted,
    },
  });

  return { summary, plan };
}
```

## Pattern: Error Context Enrichment

Enrich errors with debugging context before logging:

```typescript
import { enrichError, startTimer, type ErrorContext } from '@oaknational/mcp-logger';

async function searchWithContext(query: string, correlationId: string) {
  const timer = startTimer();

  try {
    return await client.searchLessons({ query });
  } catch (error) {
    const duration = timer.end();

    // Enrich error with context
    const errorContext: ErrorContext = {
      correlationId,
      duration,
      requestPath: '/api/search',
      requestMethod: 'POST',
    };

    const enrichedError = enrichError(error as Error, errorContext);

    // Log enriched error
    logger.error('Search failed with context', {
      message: enrichedError.message,
      stack: enrichedError.stack,
      correlationId,
      duration: duration.formatted,
      query,
    });

    throw enrichedError;
  }
}
```

## Best Practices

### Structured Logging with SDK Operations

Always include relevant context in log messages:

```typescript
// ❌ BAD: Vague message, no context
logger.info('Search completed');

// ✅ GOOD: Descriptive message with context
logger.info('Lesson search completed', {
  query: 'algebra',
  subject: 'maths',
  keyStage: 'ks3',
  resultCount: 42,
  duration: '234ms',
});
```

### Log Levels for Different Scenarios

Use appropriate log levels:

```typescript
// TRACE: Very detailed debugging (usually disabled)
logger.trace?.('Entering function', { params });

// DEBUG: Development debugging
logger.debug('Cache miss, fetching from API', { key });

// INFO: Normal operation milestones
logger.info('Lesson data fetched successfully', { lessonSlug });

// WARN: Recoverable issues or performance concerns
logger.warn('API response time exceeded threshold', { duration: '5.2s' });

// ERROR: Operation failures
logger.error('Failed to fetch lesson', error, { lessonSlug });

// FATAL: Critical failures requiring intervention
logger.fatal('Database connection lost', error);
```

### Avoiding PII in Logs

Never log personally identifiable information:

```typescript
// ❌ BAD: Logging PII
logger.info('User logged in', {
  email: user.email, // PII
  fullName: user.name, // PII
  dateOfBirth: user.dob, // PII
});

// ✅ GOOD: Log identifiers only
logger.info('User logged in', {
  userId: user.id, // Safe identifier
  accountType: user.type, // Non-PII metadata
});
```

### Log Volume Management

Be mindful of log volume in production:

```typescript
// Use DEBUG level for verbose logs
logger.debug('Processing item', { itemId, index }); // Only in development

// Use INFO for significant events
logger.info('Batch processing complete', {
  itemCount: 1000,
  duration: '2.3s',
  successCount: 998,
  failureCount: 2,
});

// Aggregate instead of logging per-item
const errors: string[] = [];
for (const item of items) {
  try {
    await processItem(item);
  } catch (error) {
    errors.push(item.id); // Collect, don't log yet
  }
}
if (errors.length > 0) {
  logger.error('Batch processing had failures', {
    failedItems: errors,
    failureRate: `${((errors.length / items.length) * 100).toFixed(1)}%`,
  });
}
```

## Integration Examples

### Next.js App Using SDK + Logger

```typescript
// app/lib/curriculum-client.ts
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

// Browser-safe logger (no file sink)
export const logger = createAdaptiveLogger({
  name: 'curriculum-app',
  level: process.env.NEXT_PUBLIC_LOG_LEVEL || 'INFO',
});

export const curriculumClient = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
});

// app/api/lessons/[slug]/route.ts
import { NextRequest } from 'next/server';
import { curriculumClient, logger } from '@/lib/curriculum-client';
import { startTimer } from '@oaknational/mcp-logger';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const timer = startTimer();
  const correlationId = request.headers.get('x-correlation-id') || `req_${Date.now()}`;

  const requestLogger = logger.child?.({ correlationId }) ?? logger;

  try {
    requestLogger.info('Fetching lesson', { slug: params.slug });

    const lesson = await curriculumClient.getLessonSummary(params.slug);
    const duration = timer.end();

    requestLogger.info('Lesson fetched', {
      slug: params.slug,
      duration: duration.formatted,
    });

    return Response.json(lesson, {
      headers: {
        'X-Correlation-ID': correlationId,
      },
    });
  } catch (error) {
    const duration = timer.end();
    requestLogger.error('Failed to fetch lesson', error, {
      slug: params.slug,
      duration: duration.formatted,
    });

    return Response.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}
```

### MCP Server Using SDK + Logger

```typescript
// server.ts
import { createAdaptiveLogger } from '@oaknational/mcp-logger/node';
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';
import { startTimer } from '@oaknational/mcp-logger';

// File-only logger (stdout reserved for MCP protocol)
const logger = createAdaptiveLogger({
  name: 'mcp-server',
  level: process.env.LOG_LEVEL || 'INFO',
  sinks: {
    stdout: false, // MUST be false for stdio MCP
    file: {
      path: '.logs/mcp-server.log',
      append: true,
    },
  },
});

const client = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
});

async function executeTool(toolName: string, args: unknown) {
  const correlationId = `req_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  const timer = startTimer();
  const toolLogger = logger.child?.({ correlationId }) ?? logger;

  toolLogger.info('Tool execution started', { toolName, args });

  try {
    const result = await client[toolName](args);
    const duration = timer.end();

    toolLogger.info('Tool execution completed', {
      toolName,
      duration: duration.formatted,
    });

    return result;
  } catch (error) {
    const duration = timer.end();
    toolLogger.error('Tool execution failed', error, {
      toolName,
      duration: duration.formatted,
    });
    throw error;
  }
}
```

### CLI Tool Using SDK + Logger

```typescript
#!/usr/bin/env node
// cli.ts
import { createAdaptiveLogger } from '@oaknational/mcp-logger/node';
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';

const logger = createAdaptiveLogger({
  name: 'curriculum-cli',
  level: process.env.LOG_LEVEL || 'INFO',
  sinks: {
    stdout: true, // CLI output
    file: {
      path: '.logs/cli.log',
      append: true,
    },
  },
});

const client = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
});

async function main() {
  const [command, ...args] = process.argv.slice(2);

  logger.info('CLI command started', { command, args });

  try {
    switch (command) {
      case 'search':
        const results = await client.searchLessons({ query: args[0] });
        console.log(JSON.stringify(results, null, 2));
        logger.info('Search completed', { resultCount: results.length });
        break;

      case 'get-lesson':
        const lesson = await client.getLessonSummary(args[0]);
        console.log(JSON.stringify(lesson, null, 2));
        logger.info('Lesson retrieved', { slug: args[0] });
        break;

      default:
        logger.error('Unknown command', { command });
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    logger.error('CLI command failed', error, { command, args });
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
```

## Further Reading

- [Logger Package README](../../libs/logger/README.md) - Complete logger API documentation
- [HTTP Server README](../../../apps/oak-curriculum-mcp-streamable-http/README.md) - HTTP server with correlation IDs
- [Stdio Server README](../../../apps/oak-curriculum-mcp-stdio/README.md) - Stdio server with file logging
- [Testing Strategy](../../../.agent/directives/testing-strategy.md) - How to test logging code

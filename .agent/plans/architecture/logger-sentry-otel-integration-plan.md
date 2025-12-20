# Logger Sentry & OpenTelemetry Integration Plan

**Status**: Ready for implementation  
**Created**: 2025-11-11  
**Related**: None listed

## Executive Summary

This plan details the integration of [Sentry](https://docs.sentry.io/platforms/javascript/) and [OpenTelemetry (OTel)](https://opentelemetry.io/docs/languages/js/getting-started/) SDKs into `@oaknational/mcp-logger` to provide comprehensive error tracking, performance monitoring, and distributed tracing across the Oak MCP ecosystem.

**Key Goals:**

1. **Unified Observability**: Combine Sentry's error tracking with OTel's distributed tracing
2. **Dependency Injection**: Allow consuming apps to inject their own Sentry/OTel instances OR use logger-provided defaults
3. **Zero Configuration**: Work out-of-the-box with sensible defaults
4. **Framework Agnostic**: Support Node.js, Next.js, Edge, and Browser runtimes
5. **Correlation**: Ensure trace IDs, span IDs, and correlation IDs flow through logs, errors, and traces

## Context

### Current State

The logger workspace (`packages/libs/logger`) provides:

- ✅ OpenTelemetry-format structured logging (JSON with PascalCase fields)
- ✅ Pure dependency injection via `UnifiedLogger` class
- ✅ Runtime-specific sinks (stdout, file)
- ✅ Error enrichment with `enrichError(error, context)`
- ✅ High-precision timing with `startTimer()`
- ✅ Express middleware for request/error logging
- ✅ Child logger support for correlation IDs

**What's Missing:**

- ❌ Sentry SDK integration for error tracking and alerting
- ❌ OpenTelemetry SDK for distributed tracing
- ❌ Automatic trace/span context propagation
- ❌ Performance monitoring beyond basic timing
- ❌ Error grouping and deduplication
- ❌ User session tracking

### Why Integrate Sentry + OTel?

**Sentry Strengths:**

- Best-in-class error tracking UI
- Automatic error grouping and deduplication
- Release tracking and regression detection
- User session replay (browser)
- Performance monitoring with real user metrics
- Alerting and notifications

**OpenTelemetry Strengths:**

- Vendor-neutral distributed tracing
- Rich context propagation (W3C Trace Context)
- Multi-backend export (Sentry, Jaeger, Zipkin, etc.)
- Auto-instrumentation for HTTP, DB, etc.
- Metrics and logs alongside traces

**Combined Benefits:**

- Sentry uses OTel under the hood ([source](https://docs.sentry.io/platforms/javascript/guides/node/opentelemetry/))
- OTel traces automatically flow into Sentry
- Unified correlation: trace ID → spans → errors → logs
- Future-proof: OTel is the industry standard

## Architecture Decisions

### Decision 1: DI Pattern with Fallback Defaults

**Approach**: Extend `UnifiedLoggerOptions` to accept **optional** Sentry and OTel instances. If not provided, logger initializes them with environment-based defaults.

**Rationale**:

- Consuming apps have full control (can configure Sentry/OTel before passing to logger)
- Simple apps get zero-config observability
- Adheres to existing pure DI pattern

**Example**:

```typescript
interface UnifiedLoggerOptions {
  readonly minSeverity: number;
  readonly resourceAttributes: ResourceAttributes;
  readonly context: JsonObject;
  readonly stdoutSink: StdoutSink | null;
  readonly fileSink: FileSinkInterface | null;

  // NEW - Optional Sentry/OTel instances (DI)
  readonly sentryClient?: SentryClient;
  readonly otelTracer?: Tracer;
}

// Consuming app (full control):
const logger = new UnifiedLogger({
  ...baseConfig,
  sentryClient: Sentry.getClient(), // App-configured Sentry
  otelTracer: trace.getTracer('my-app'),
});

// Simple app (zero-config):
const logger = new UnifiedLogger(baseConfig);
// Logger auto-initializes Sentry/OTel from env if SENTRY_DSN is set
```

### Decision 2: Sentry as Primary OTel Exporter

**Approach**: Use Sentry's [built-in OTel support](https://docs.sentry.io/platforms/javascript/guides/node/opentelemetry/) as the primary trace exporter.

**Rationale**:

- Sentry SDKs are built on OTel ([source](https://docs.sentry.io/platforms/javascript/guides/node/opentelemetry/))
- No need for separate OTel backend (simplifies architecture)
- Unified error + trace + log correlation in Sentry UI
- Can add additional exporters later (Jaeger, Zipkin) if needed

**Configuration**:

```typescript
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initSentryFromEnv(env: NodeJS.ProcessEnv): void {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT ?? 'development',

    // Tracing
    tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),

    // Profiling (optional)
    profilesSampleRate: parseFloat(env.SENTRY_PROFILES_SAMPLE_RATE ?? '0.1'),
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration(), // Auto-instrument HTTP
    ],

    // Logs (optional, requires enableLogs: true)
    enableLogs: parseBoolFlag(env.SENTRY_ENABLE_LOGS, false),
  });
}
```

### Decision 3: Correlation ID Flow

**Approach**: Ensure correlation IDs flow through all observability layers:

1. **HTTP Request** → `x-correlation-id` header or generate new ID
2. **Logger** → `correlationId` in log context
3. **OTel** → Span attribute `correlation_id`
4. **Sentry** → Error tag `correlation_id`

**Implementation**:

```typescript
// Express middleware (HTTP server)
app.use(correlationMiddleware());

// Create child logger with correlation ID
const correlatedLogger = logger.child({ correlationId });

// Start OTel span with correlation ID
const span = tracer.startSpan('operation', {
  attributes: { correlation_id: correlationId },
});

// Enrich error with correlation ID
const enrichedError = enrichError(error, { correlationId });

// Log error with correlation ID (auto-included in child logger context)
correlatedLogger.error('Operation failed', enrichedError);

// Sentry captures error with correlation ID as tag
```

### Decision 4: Runtime-Specific Initialization

**Approach**: Provide separate initialization for Node.js, Next.js, and Edge runtimes.

**Rationale**:

- [Next.js requires specific instrumentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- Edge runtime has different APIs
- Node.js stdio servers need file-only logging

**Entry Points**:

```typescript
// Node.js (stdio/HTTP servers)
import { initSentryNode } from '@oaknational/mcp-logger/node';

// Next.js (App Router)
import { initSentryNextjs } from '@oaknational/mcp-logger/nextjs';

// Browser (client-side)
import { initSentryBrowser } from '@oaknational/mcp-logger/browser';
```

## Implementation Plan

### Phase 1: Core Sentry Integration (Node.js)

**Goal**: Integrate Sentry SDK into logger for Node.js runtimes (stdio and HTTP servers).

#### Session 1.1: Sentry Initialization & DI

**Tasks**:

1. Add `@sentry/node` and `@sentry/profiling-node` to logger dependencies
2. Create `src/sentry-node.ts` with `initSentryNode(options)` function
3. Extend `UnifiedLoggerOptions` to accept optional `sentryClient`
4. Add environment variable validation for Sentry config

**Deliverables**:

```typescript
// src/sentry-node.ts
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export interface SentryNodeOptions {
  readonly dsn: string;
  readonly environment?: string;
  readonly tracesSampleRate?: number;
  readonly profilesSampleRate?: number;
  readonly enableLogs?: boolean;
  readonly sendDefaultPii?: boolean;
}

export function initSentryNode(options: SentryNodeOptions): void {
  Sentry.init({
    dsn: options.dsn,
    environment: options.environment || 'development',
    tracesSampleRate: options.tracesSampleRate ?? 0.1,
    profilesSampleRate: options.profilesSampleRate ?? 0.1,
    enableLogs: options.enableLogs ?? false,
    sendDefaultPii: options.sendDefaultPii ?? true,
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration(),
      Sentry.consoleIntegration({ logErrors: true }),
    ],
  });
}

export function buildSentryOptionsFromEnv(env: NodeJS.ProcessEnv): SentryNodeOptions | null {
  const dsn = env.SENTRY_DSN;
  if (!dsn) return null;

  return {
    dsn,
    environment: env.SENTRY_ENVIRONMENT,
    tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    profilesSampleRate: parseFloat(env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
    enableLogs: env.SENTRY_ENABLE_LOGS === 'true',
    sendDefaultPii: env.SENTRY_SEND_DEFAULT_PII !== 'false',
  };
}
```

**Testing**:

- Unit tests for `buildSentryOptionsFromEnv`
- Integration test: Initialize Sentry, capture error, verify sent to Sentry

**Acceptance Criteria**:

- ✅ `initSentryNode` initializes Sentry with provided options
- ✅ Environment-based configuration helper works correctly
- ✅ Test error appears in Sentry UI with correct environment/release

#### Session 1.2: Automatic Error Capture in Logger

**Tasks**:

1. Update `UnifiedLogger.error()` and `UnifiedLogger.fatal()` to send errors to Sentry
2. Ensure `enrichError` context flows to Sentry as tags/context
3. Add Sentry breadcrumbs for non-error log levels (debug, info, warn)

**Deliverables**:

```typescript
// src/unified-logger.ts (updated)
export class UnifiedLogger implements Logger {
  // ... existing fields

  error(message: string, error?: unknown, context?: unknown): void {
    // Existing structured logging
    const mergedContext = this.mergeContext(context);
    const normalizedError = normalizeError(error);
    this.emitLog(SeverityNumber.ERROR, message, mergedContext, normalizedError);

    // NEW - Send to Sentry
    if (this.sentryEnabled) {
      Sentry.captureException(normalizedError, {
        level: 'error',
        contexts: {
          log: mergedContext,
        },
        tags: {
          correlation_id: mergedContext.correlationId,
        },
      });
    }
  }

  info(message: string, context?: unknown): void {
    // Existing structured logging
    const mergedContext = this.mergeContext(context);
    this.emitLog(SeverityNumber.INFO, message, mergedContext);

    // NEW - Add breadcrumb to Sentry
    if (this.sentryEnabled) {
      Sentry.addBreadcrumb({
        level: 'info',
        message,
        data: mergedContext,
      });
    }
  }

  // Similar for debug(), warn(), trace()
}
```

**Testing**:

- Unit test: `logger.error()` calls `Sentry.captureException`
- Integration test: Error logged → appears in Sentry with correct context

**Acceptance Criteria**:

- ✅ Errors logged via `logger.error()` appear in Sentry
- ✅ Error context (correlation ID, timing, etc.) visible in Sentry UI
- ✅ Non-error logs appear as breadcrumbs in Sentry error detail pages

#### Session 1.3: Express Middleware Integration

**Tasks**:

1. Update `createRequestLogger` to add Sentry request context
2. Update `createErrorLogger` to send errors to Sentry with HTTP context
3. Ensure correlation IDs flow from middleware → logger → Sentry

**Deliverables**:

```typescript
// src/express-middleware.ts (updated)
import * as Sentry from '@sentry/node';

export function createRequestLogger(
  logger: Logger,
  options?: RequestLoggerOptions,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const correlationId = res.locals.correlationId || generateCorrelationId();
    res.locals.correlationId = correlationId;

    // Existing request logging
    const metadata = extractRequestMetadata(req);
    const childLogger = logger.child({ correlationId });
    childLogger[options?.level || 'info']('Incoming request', metadata);

    // NEW - Add Sentry request context
    Sentry.setContext('http', {
      method: req.method,
      url: req.url,
      headers: sanitiseForJson(req.headers),
      query: sanitiseForJson(req.query),
    });
    Sentry.setTag('correlation_id', correlationId);

    next();
  };
}

export function createErrorLogger(logger: Logger): ErrorRequestHandler {
  return (error: Error, req: Request, res: Response, next: NextFunction): void => {
    const correlationId = res.locals.correlationId;
    const childLogger = logger.child({ correlationId });

    // Existing error logging
    childLogger.error('Request error', error, {
      method: req.method,
      url: req.url,
    });

    // NEW - Send to Sentry with HTTP context
    Sentry.captureException(error, {
      contexts: {
        http: {
          method: req.method,
          url: req.url,
          headers: req.headers,
        },
      },
      tags: {
        correlation_id: correlationId,
      },
    });

    next(error);
  };
}
```

**Testing**:

- Integration test: HTTP request → error → Sentry error has HTTP context and correlation ID

**Acceptance Criteria**:

- ✅ HTTP errors captured by Sentry include request method, URL, headers
- ✅ Correlation IDs flow from HTTP request → logger → Sentry
- ✅ Sentry UI shows full request context for errors

### Phase 2: OpenTelemetry Tracing Integration

**Goal**: Integrate OpenTelemetry SDK for distributed tracing, with traces flowing to Sentry.

#### Session 2.1: OTel SDK Initialization

**Tasks**:

1. Add `@opentelemetry/api` and `@opentelemetry/sdk-node` to dependencies
2. Create `src/otel-node.ts` with `initOtelNode(options)` function
3. Configure Sentry as OTel trace exporter
4. Add auto-instrumentation for HTTP, Express, etc.

**Deliverables**:

```typescript
// src/otel-node.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import * as Sentry from '@sentry/node';
import { SentrySpanProcessor, SentryPropagator, SentrySampler } from '@sentry/opentelemetry';

export interface OtelNodeOptions {
  readonly serviceName: string;
  readonly serviceVersion: string;
  readonly environment?: string;
  readonly tracesSampleRate?: number;
}

export function initOtelNode(options: OtelNodeOptions): NodeSDK {
  const sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: options.serviceName,
      [ATTR_SERVICE_VERSION]: options.serviceVersion,
      'deployment.environment': options.environment || 'development',
    }),

    // Use Sentry as trace exporter
    spanProcessor: new SentrySpanProcessor(),
    textMapPropagator: new SentryPropagator(),
    sampler: new SentrySampler(options.tracesSampleRate ?? 0.1),

    // Auto-instrument common libraries
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false }, // Too noisy
        '@opentelemetry/instrumentation-http': { enabled: true },
        '@opentelemetry/instrumentation-express': { enabled: true },
      }),
    ],
  });

  sdk.start();
  return sdk;
}

export function buildOtelOptionsFromEnv(env: NodeJS.ProcessEnv): OtelNodeOptions {
  return {
    serviceName: env.OTEL_SERVICE_NAME || env.npm_package_name || 'unknown-service',
    serviceVersion: env.OTEL_SERVICE_VERSION || env.npm_package_version || '0.0.0',
    environment: env.OTEL_ENVIRONMENT || env.SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: parseFloat(
      env.OTEL_TRACES_SAMPLE_RATE || env.SENTRY_TRACES_SAMPLE_RATE || '0.1',
    ),
  };
}
```

**Testing**:

- Integration test: Start OTel SDK, create span, verify span sent to Sentry

**Acceptance Criteria**:

- ✅ OTel SDK initializes with Sentry exporter
- ✅ Auto-instrumentation captures HTTP requests as spans
- ✅ Spans appear in Sentry Performance UI

#### Session 2.2: Manual Span Creation Helpers

**Tasks**:

1. Create helper functions for manual span creation
2. Ensure spans inherit correlation ID from context
3. Add timing integration (spans use `startTimer` for precision)

**Deliverables**:

```typescript
// src/otel-helpers.ts
import { trace, context, SpanStatusCode, type Span } from '@opentelemetry/api';
import { startTimer, type Duration } from './timing';

export interface SpanAttribute {
  readonly key: string;
  readonly value: string | number | boolean;
}

export interface SpanOptions {
  readonly name: string;
  readonly operation: string;
  readonly correlationId?: string;
  readonly attributes?: ReadonlyArray<SpanAttribute>;
}

export async function withSpan<T>(
  options: SpanOptions,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  const tracer = trace.getTracer('mcp-logger');
  const timer = startTimer();

  return tracer.startActiveSpan(options.name, async (span) => {
    try {
      // Add correlation ID and custom attributes
      if (options.correlationId) {
        span.setAttribute('correlation_id', options.correlationId);
      }
      span.setAttribute('operation', options.operation);
      if (options.attributes) {
        for (const attribute of options.attributes) {
          span.setAttribute(attribute.key, attribute.value);
        }
      }

      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const recordedError = error instanceof Error ? error : new Error('Unknown error');
      span.recordException(recordedError);
      span.setStatus({ code: SpanStatusCode.ERROR, message: recordedError.message });
      throw error;
    } finally {
      const duration = timer.end();
      span.setAttribute('duration_ms', duration.ms);
      span.end();
    }
  });
}

// Synchronous version
export function withSpanSync<T>(options: SpanOptions, fn: (span: Span) => T): T {
  const tracer = trace.getTracer('mcp-logger');
  const timer = startTimer();

  return tracer.startActiveSpan(options.name, (span) => {
    try {
      if (options.correlationId) {
        span.setAttribute('correlation_id', options.correlationId);
      }
      span.setAttribute('operation', options.operation);
      if (options.attributes) {
        for (const attribute of options.attributes) {
          span.setAttribute(attribute.key, attribute.value);
        }
      }

      const result = fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const recordedError = error instanceof Error ? error : new Error('Unknown error');
      span.recordException(recordedError);
      span.setStatus({ code: SpanStatusCode.ERROR, message: recordedError.message });
      throw error;
    } finally {
      const duration = timer.end();
      span.setAttribute('duration_ms', duration.ms);
      span.end();
    }
  });
}
```

**Usage Example**:

```typescript
import { withSpan } from '@oaknational/mcp-logger/node';

// In an API route
app.post('/api/search', async (req, res) => {
  const correlationId = res.locals.correlationId;

  const result = await withSpan(
    {
      name: 'search.lessons',
      operation: 'search',
      correlationId,
      attributes: {
        query: req.body.query,
        scope: req.body.scope,
      },
    },
    async (span) => {
      // Perform search operation
      return await performSearch(req.body);
    },
  );

  res.json(result);
});
```

**Testing**:

- Unit test: `withSpan` creates span with correct attributes
- Integration test: Nested spans create parent-child relationship

**Acceptance Criteria**:

- ✅ `withSpan` helper creates spans with correlation ID
- ✅ Spans include operation timing from `startTimer`
- ✅ Nested spans create proper trace hierarchy

#### Session 2.3: Logger + Tracer Integration

**Tasks**:

1. Update `UnifiedLogger` to accept optional `otelTracer`
2. Ensure logs include trace ID and span ID for correlation
3. Add log events to active spans

**Deliverables**:

```typescript
// src/unified-logger.ts (updated)
import { trace, type Tracer } from '@opentelemetry/api';

export interface UnifiedLoggerOptions {
  // ... existing fields
  readonly otelTracer?: Tracer;
}

export class UnifiedLogger implements Logger {
  private readonly otelTracer?: Tracer;

  constructor(options: UnifiedLoggerOptions) {
    // ... existing initialization
    this.otelTracer = options.otelTracer;
  }

  private emitLog(
    severity: SeverityNumber,
    message: string,
    context: JsonObject,
    error?: Error,
  ): void {
    // Get active span context for trace/span IDs
    const spanContext = trace.getActiveSpan()?.spanContext();
    const enrichedContext = {
      ...context,
      // Add trace/span IDs if available
      ...(spanContext && {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
      }),
    };

    // Existing log emission
    const logRecord = buildOtelLogRecord(
      severity,
      message,
      enrichedContext,
      this.resourceAttributes,
      error,
    );

    // ... emit to sinks

    // NEW - Add log event to active span
    if (this.otelTracer && spanContext) {
      const span = trace.getActiveSpan();
      span?.addEvent('log', {
        'log.level': severityToLogLevel(severity),
        'log.message': message,
        ...enrichedContext,
      });
    }
  }
}
```

**Testing**:

- Integration test: Log within span → log includes trace ID → span includes log event

**Acceptance Criteria**:

- ✅ Logs emitted within active span include trace ID and span ID
- ✅ Log events appear in span timeline in Sentry UI
- ✅ Correlation between logs, spans, and errors is visible

### Phase 3: Next.js Integration

**Goal**: Provide Next.js-specific Sentry and OTel initialization for the semantic search app.

#### Session 3.1: Next.js Sentry Setup

**Tasks**:

1. Create `src/sentry-nextjs.ts` entry point
2. Provide separate initialization for server, client, and edge
3. Document Next.js instrumentation file setup

**Deliverables**:

```typescript
// src/sentry-nextjs.ts
import * as Sentry from '@sentry/nextjs';

export interface SentryNextjsOptions {
  readonly dsn: string;
  readonly environment?: string;
  readonly tracesSampleRate?: number;
  readonly replaysSessionSampleRate?: number;
  readonly replaysOnErrorSampleRate?: number;
}

// Server-side initialization
export function initSentryNextjsServer(options: SentryNextjsOptions): void {
  Sentry.init({
    dsn: options.dsn,
    environment: options.environment || 'development',
    tracesSampleRate: options.tracesSampleRate ?? 0.1,
    integrations: [Sentry.httpIntegration()],
  });
}

// Client-side initialization
export function initSentryNextjsClient(options: SentryNextjsOptions): void {
  Sentry.init({
    dsn: options.dsn,
    environment: options.environment || 'development',
    tracesSampleRate: options.tracesSampleRate ?? 0.1,
    replaysSessionSampleRate: options.replaysSessionSampleRate ?? 0.1,
    replaysOnErrorSampleRate: options.replaysOnErrorSampleRate ?? 1.0,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  });
}
```

**Next.js App Setup**:

```typescript
// instrumentation.ts (root of Next.js app)
export async function register() {
  const env = process.env;
  if (env.NEXT_RUNTIME === 'nodejs') {
    const { initSentryNextjsServer, buildSentryOptionsFromEnv } = await import('@oaknational/mcp-logger/nextjs');
    const options = buildSentryOptionsFromEnv(env);
    if (options) {
      initSentryNextjsServer(options);
    }
  }
}

// app/layout.tsx (client-side)
'use client';
import { useEffect } from 'react';
import { initSentryNextjsClient, buildSentryOptionsFromEnv } from '@oaknational/mcp-logger/nextjs';

export default function RootLayout({ children }) {
  useEffect(() => {
    const env = process.env;
    const options = buildSentryOptionsFromEnv(env);
    if (options) {
      initSentryNextjsClient(options);
    }
  }, []);

  return <html>{children}</html>;
}
```

**Documentation**: Update [Next.js Sentry docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) reference in logger README.

**Testing**:

- Integration test: Next.js app → error thrown → Sentry captures with correct runtime context

**Acceptance Criteria**:

- ✅ Server-side errors captured with Node.js context
- ✅ Client-side errors captured with browser context
- ✅ Session replay works for user interactions

#### Session 3.2: Next.js API Route Instrumentation

**Tasks**:

1. Create middleware wrapper for Next.js App Router API routes
2. Ensure correlation IDs flow through async context
3. Add span creation for API route handlers

**Deliverables**:

```typescript
// src/nextjs-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { withSpan } from './otel-helpers';

export function withSentryApiRoute<T>(handler: (req: NextRequest) => Promise<NextResponse<T>>) {
  return async (req: NextRequest): Promise<NextResponse<T>> => {
    const correlationId = req.headers.get('x-correlation-id') || generateCorrelationId();

    return withSpan(
      {
        name: `${req.method} ${req.nextUrl.pathname}`,
        operation: 'http.server',
        correlationId,
        attributes: {
          'http.method': req.method,
          'http.url': req.nextUrl.pathname,
        },
      },
      async (span) => {
        try {
          // Set Sentry context
          Sentry.setContext('http', {
            method: req.method,
            url: req.nextUrl.pathname,
            headers: sanitiseHeaders(req.headers),
          });
          Sentry.setTag('correlation_id', correlationId);

          // Call handler
          const response = await handler(req);

          span.setAttribute('http.status_code', response.status);
          return response;
        } catch (error) {
          Sentry.captureException(error, {
            tags: { correlation_id: correlationId },
          });
          throw error;
        }
      },
    );
  };
}
```

**Usage Example**:

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withSentryApiRoute } from '@oaknational/mcp-logger/nextjs';

async function searchHandler(req: NextRequest) {
  const body = await req.json();
  const results = await performSearch(body);
  return NextResponse.json(results);
}

export const POST = withSentryApiRoute(searchHandler);
```

**Testing**:

- E2E test: API route → error → Sentry error has correlation ID and trace context

**Acceptance Criteria**:

- ✅ API route errors captured with full HTTP context
- ✅ Spans created for each API route with timing
- ✅ Correlation IDs flow through async operations

### Phase 4: Environment Variables & Documentation

**Goal**: Standardize environment variable configuration and document integration for consuming apps.

#### Session 4.1: Environment Variable Schema

**Tasks**:

1. Document all Sentry/OTel environment variables
2. Provide validation schemas (Zod)
3. Update logger README with configuration guide

**Environment Variables**:

| Variable                              | Type    | Default                     | Description                                        |
| ------------------------------------- | ------- | --------------------------- | -------------------------------------------------- |
| `SENTRY_DSN`                          | string  | -                           | Sentry project DSN (required for Sentry)           |
| `SENTRY_ENVIRONMENT`                  | string  | `development`               | Deployment environment                             |
| `SENTRY_TRACES_SAMPLE_RATE`           | number  | `0.1`                       | Percentage of traces to sample (0.0-1.0)           |
| `SENTRY_PROFILES_SAMPLE_RATE`         | number  | `0.1`                       | Percentage of profiles to sample (0.0-1.0)         |
| `SENTRY_ENABLE_LOGS`                  | boolean | `false`                     | Send logs to Sentry (in addition to local logging) |
| `SENTRY_SEND_DEFAULT_PII`             | boolean | `true`                      | Include user IP and request headers                |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE`  | number  | `0.1`                       | Browser: session replay sample rate                |
| `SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | number  | `1.0`                       | Browser: replay sample rate when error occurs      |
| `OTEL_SERVICE_NAME`                   | string  | `npm_package_name`          | Service name for traces                            |
| `OTEL_SERVICE_VERSION`                | string  | `npm_package_version`       | Service version for traces                         |
| `OTEL_TRACES_SAMPLE_RATE`             | number  | `SENTRY_TRACES_SAMPLE_RATE` | OTel trace sample rate (fallback to Sentry)        |

**Validation Schema**:

```typescript
// src/sentry-env-schema.ts
import { z } from 'zod';

export const SentryEnvSchema = z.object({
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
  SENTRY_PROFILES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
  SENTRY_ENABLE_LOGS: z.coerce.boolean().default(false),
  SENTRY_SEND_DEFAULT_PII: z.coerce.boolean().default(true),
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1.0),
  OTEL_SERVICE_NAME: z.string().optional(),
  OTEL_SERVICE_VERSION: z.string().optional(),
  OTEL_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).optional(),
});

export type SentryEnv = z.infer<typeof SentryEnvSchema>;
```

#### Session 4.2: Documentation & Examples

**Tasks**:

1. Update `packages/libs/logger/README.md` with Sentry/OTel sections
2. Provide example configurations for each runtime
3. Document correlation ID flow and best practices

**README Additions**:

````markdown
## Sentry & OpenTelemetry Integration

The logger provides built-in integration with Sentry and OpenTelemetry for comprehensive error tracking, performance monitoring, and distributed tracing.

### Node.js (stdio/HTTP servers)

```typescript
import {
  initSentryNode,
  initOtelNode,
  UnifiedLogger,
  buildSentryOptionsFromEnv,
  buildOtelOptionsFromEnv,
} from '@oaknational/mcp-logger/node';

// Initialize Sentry (optional - auto-initialized if SENTRY_DSN is set)
const env = process.env;
const sentryOptions = buildSentryOptionsFromEnv(env);
if (sentryOptions) {
  initSentryNode(sentryOptions);
}

// Initialize OpenTelemetry (optional)
const otelOptions = buildOtelOptionsFromEnv(env);
const otelSdk = initOtelNode(otelOptions);

// Create logger
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber('INFO'),
  resourceAttributes: buildResourceAttributes(env, 'my-service', '1.0.0'),
  context: {},
  stdoutSink: createNodeStdoutSink(),
  fileSink: null,
});

// Errors and logs are automatically sent to Sentry
logger.error('Something went wrong', new Error('Test error'));
```
````

### Next.js

See [Next.js Sentry Integration Guide](./docs/nextjs-sentry-integration.md) for detailed setup instructions.

### Correlation IDs

Correlation IDs flow through all observability layers:

1. HTTP request → `x-correlation-id` header or generated
2. Logger → `correlationId` in structured logs
3. OpenTelemetry → `correlation_id` span attribute
4. Sentry → `correlation_id` error tag

This enables end-to-end tracing: HTTP request → trace → spans → logs → errors.

````

**Acceptance Criteria**:
- ✅ README documents all Sentry/OTel environment variables
- ✅ Examples provided for Node.js, Next.js, and Edge runtimes
- ✅ Correlation ID flow documented with diagrams

## Testing Strategy

### Unit Tests

**Coverage Requirements**: 90%+ for new code

**Key Test Cases**:
- Environment variable parsing and validation
- Sentry options builder from env
- OTel options builder from env
- Logger methods call Sentry APIs when enabled
- Breadcrumb creation for non-error logs

**Example**:

```typescript
describe('initSentryNode', () => {
  it('should initialize Sentry with provided options', () => {
    const options = {
      dsn: 'https://test@sentry.io/123',
      environment: 'test',
      tracesSampleRate: 1.0,
    };

    initSentryNode(options);

    expect(Sentry.getCurrentHub().getClient()).toBeDefined();
    // Further assertions on Sentry configuration
  });
});
````

### Integration Tests

**Test Scenarios**:

1. Initialize Sentry → log error → error captured in test transport
2. Initialize OTel → create span → span exported to test exporter
3. Logger + Sentry → error with context → context appears in Sentry event
4. Express middleware → HTTP request → correlation ID flows to Sentry

**Example**:

```typescript
describe('Sentry integration', () => {
  it('should capture errors with correlation ID', async () => {
    const testTransport = createTestTransport();
    initSentryNode({
      dsn: 'https://test@sentry.io/123',
      transport: testTransport,
    });

    const logger = createTestLogger();
    const correlatedLogger = logger.child({ correlationId: 'test-123' });

    correlatedLogger.error('Test error', new Error('Test'));

    await waitForSentryFlush();

    const events = testTransport.getCapturedEvents();
    expect(events).toHaveLength(1);
    expect(events[0].tags.correlation_id).toBe('test-123');
  });
});
```

### E2E Tests

**Test Scenarios**:

1. HTTP server → API call with error → Sentry receives error with HTTP context
2. Next.js app → API route error → Sentry receives error with trace ID
3. Stdio server → tool execution error → Sentry receives error with tool context

**Example** (using existing E2E infrastructure):

```typescript
describe('E2E: Sentry integration', () => {
  it('should capture HTTP errors with full context', async () => {
    const { app, testTransport } = await createLiveHttpApp({ sentry: true });

    const response = await request(app).post('/tools/call').send({
      name: 'nonExistentTool',
      arguments: {},
    });

    expect(response.status).toBe(500);

    await waitForSentryFlush();

    const events = testTransport.getCapturedEvents();
    expect(events).toHaveLength(1);
    expect(events[0].contexts.http.method).toBe('POST');
    expect(events[0].contexts.http.url).toBe('/tools/call');
  });
});
```

## Risk Management

### Risk 1: Performance Overhead

**Problem**: Sentry/OTel instrumentation adds performance overhead.

**Mitigation**:

- Use sampling (default 10% trace sample rate)
- Profile with `@sentry/profiling-node` to identify bottlenecks
- Disable expensive integrations (e.g., `fs` instrumentation)
- Monitor overhead in production with Sentry Performance

**Acceptance Threshold**: < 5% overhead on P95 latency

### Risk 2: PII Leakage

**Problem**: Logs/traces might include sensitive user data.

**Mitigation**:

- Default `sendDefaultPii: true` but configurable via env
- Sanitize all logged data with `sanitiseForJson`
- Use Sentry's data scrubbing rules for sensitive fields
- Document PII handling in README

### Risk 3: Dual Error Paths

**Problem**: Errors might be logged twice (console + Sentry).

**Mitigation**:

- Logger automatically deduplicates: log to stdout/file + send to Sentry
- Sentry breadcrumbs for non-error logs provide context
- Document that this is intentional (structured logs + alerts)

### Risk 4: Environment Variable Conflicts

**Problem**: `SENTRY_DSN` set but user wants to disable Sentry.

**Mitigation**:

- Provide explicit `SENTRY_ENABLED=false` env var
- Log warning if DSN is set but Sentry is disabled
- Document that omitting `SENTRY_DSN` disables Sentry entirely

## Success Metrics

### Phase 1 Complete

- ✅ Sentry SDK initialized in Node.js servers
- ✅ Errors logged via `logger.error()` appear in Sentry UI
- ✅ HTTP middleware captures request context in Sentry errors
- ✅ 100% unit test coverage for Sentry initialization

### Phase 2 Complete

- ✅ OpenTelemetry SDK initialized with Sentry exporter
- ✅ Auto-instrumentation captures HTTP spans
- ✅ Manual span helpers (`withSpan`) functional
- ✅ Logs include trace ID and span ID for correlation

### Phase 3 Complete

- ✅ Next.js semantic search app integrated with Sentry
- ✅ Server-side and client-side errors captured
- ✅ Session replay functional for user interactions
- ✅ API route errors include correlation ID and trace context

### Phase 4 Complete

- ✅ All environment variables documented
- ✅ README includes setup examples for all runtimes
- ✅ E2E tests validate end-to-end observability flow

## Next Steps (When Ready)

1. **RFC Phase**
   - Review this plan with team
   - Gather feedback on DI pattern and environment variable naming

2. **Prototype Phase** (Phase 1)
   - Implement Sentry integration for Node.js
   - Validate with HTTP server integration tests

3. **OTel Phase** (Phase 2)
   - Add OpenTelemetry SDK
   - Validate trace correlation with Sentry

4. **Next.js Phase** (Phase 3)
   - Integrate with semantic search app
   - Run E2E tests with Playwright

5. **Documentation Phase** (Phase 4)
   - Update all READMEs
   - Provide migration guide for existing apps

## References

- [Sentry Node.js SDK](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Browser SDK](https://docs.sentry.io/platforms/javascript/)
- [OpenTelemetry JavaScript Getting Started](https://opentelemetry.io/docs/languages/js/getting-started/)
- [Sentry OpenTelemetry Integration](https://docs.sentry.io/platforms/javascript/guides/node/opentelemetry/)
- [Logger Enhancement Plan](./logger-enhancement-plan.md)
- [Semantic Search Service Plan](./semantic-search/search-service/schema-first-ontology-implementation.md)
- [Semantic Search UI Plan](./semantic-search/search-ui/frontend-implementation.md)

---

**Status**: Ready for implementation  
**Next Action**: Review plan with team, then begin Phase 1 (Sentry integration for Node.js)

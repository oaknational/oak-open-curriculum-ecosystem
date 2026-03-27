import type { LogEvent, LogSink } from '@oaknational/logger';
import type {
  FixtureSentryStore,
  ParsedSentryConfig,
  SentryLiveConfig,
  SentryNodeSdk,
} from './types.js';

function getTraceContextFromEvent(event: LogEvent): {
  readonly traceId?: string;
  readonly spanId?: string;
} {
  return {
    traceId: event.otelRecord.TraceId,
    spanId: event.otelRecord.SpanId,
  };
}

function toSentrySeverityLevel(
  level: LogEvent['level'],
): 'debug' | 'error' | 'fatal' | 'info' | 'warning' {
  switch (level) {
    case 'TRACE':
    case 'DEBUG':
      return 'debug';
    case 'INFO':
      return 'info';
    case 'WARN':
      return 'warning';
    case 'ERROR':
      return 'error';
    case 'FATAL':
      return 'fatal';
  }

  throw new Error(`Unsupported log level: ${level}`);
}

export function createSentryTags(
  config: { readonly environment: string; readonly release: string },
  serviceName: string,
  traceContext: { readonly traceId?: string; readonly spanId?: string } | undefined,
): {
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly traceId?: string;
  readonly spanId?: string;
} {
  return {
    service: serviceName,
    environment: config.environment,
    release: config.release,
    ...(traceContext?.traceId ? { traceId: traceContext.traceId } : {}),
    ...(traceContext?.spanId ? { spanId: traceContext.spanId } : {}),
  };
}

function createSentryLogExtra(event: LogEvent): {
  readonly attributes: LogEvent['otelRecord']['Attributes'];
  readonly resource: LogEvent['otelRecord']['Resource'];
  readonly line: string;
} {
  return {
    attributes: event.otelRecord.Attributes,
    resource: event.otelRecord.Resource,
    line: event.line.trimEnd(),
  };
}

export function createFixtureLogSink(
  config: Extract<ParsedSentryConfig, { readonly mode: 'fixture' }>,
  store: FixtureSentryStore,
): LogSink | null {
  if (!config.enableLogs) {
    return null;
  }

  return {
    write(event): void {
      const traceContext = getTraceContextFromEvent(event);

      store.push({
        kind: 'log',
        level: event.level,
        message: event.message,
        line: event.line,
        traceId: traceContext.traceId,
        spanId: traceContext.spanId,
        environment: config.environment,
        release: config.release,
      });
    },
  };
}

export function createLiveLogSink(
  config: SentryLiveConfig,
  sdk: SentryNodeSdk,
  serviceName: string,
): LogSink | null {
  if (!config.enableLogs) {
    return null;
  }

  return {
    write(event): void {
      const traceContext = getTraceContextFromEvent(event);

      sdk.captureMessage(event.message, {
        level: toSentrySeverityLevel(event.level),
        tags: createSentryTags(config, serviceName, traceContext),
        extra: createSentryLogExtra(event),
      });
    },
  };
}

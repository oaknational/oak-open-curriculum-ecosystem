import type { Log } from '@sentry/node';
import type { LogEvent, LogSink } from '@oaknational/logger';
import { typeSafeEntries } from '@oaknational/type-helpers';
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

type SentryLoggerLevel = 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn';

function toSentryLoggerLevel(level: LogEvent['level']): SentryLoggerLevel {
  switch (level) {
    case 'TRACE':
      return 'trace';
    case 'DEBUG':
      return 'debug';
    case 'INFO':
      return 'info';
    case 'WARN':
      return 'warn';
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

function flattenToSentryAttributes(
  prefix: string,
  entries: readonly (readonly [string, unknown])[],
): NonNullable<Log['attributes']> {
  const result: NonNullable<Log['attributes']> = {};
  for (const [key, value] of entries) {
    result[`${prefix}.${key}`] = typeof value === 'object' ? JSON.stringify(value) : value;
  }
  return result;
}

function createFlatSentryLogAttributes(event: LogEvent): NonNullable<Log['attributes']> {
  const otelAttributes = event.otelRecord.Attributes;
  const otelResource = event.otelRecord.Resource;

  return {
    ...flattenToSentryAttributes('otel.attributes', typeSafeEntries(otelAttributes)),
    ...flattenToSentryAttributes('otel.resource', typeSafeEntries(otelResource)),
    'log.line': event.line.trimEnd(),
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
      const level = toSentryLoggerLevel(event.level);
      const tags = createSentryTags(config, serviceName, traceContext);
      const flatAttributes = createFlatSentryLogAttributes(event);

      sdk.logger[level](event.message, {
        ...tags,
        ...flatAttributes,
      });
    },
  };
}

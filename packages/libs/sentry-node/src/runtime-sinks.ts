import type { LogEvent, LogSink } from '@oaknational/logger';
import type {
  FixtureSentryStore,
  ParsedSentryConfig,
  SentryLogAttributes,
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
      const level = toSentryLoggerLevel(event.level);
      const tags = createSentryTags(config, serviceName, traceContext);
      const extra = createSentryLogExtra(event);
      const attributes: SentryLogAttributes = {
        ...tags,
        line: extra.line,
      };

      sdk.logger[level](event.message, attributes);
    },
  };
}

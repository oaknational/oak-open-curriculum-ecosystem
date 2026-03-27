import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeError } from './error-normalisation';
import { correlationIdToTraceId } from './otel-format';
import { parseOtelLogRecord } from './test-helpers/parse-otel-log-record';
import type { LogContextInput, LogEvent, LogSink } from './types';
import type { ResourceAttributes } from './resource-attributes';
import { UnifiedLogger } from './unified-logger';
import type { ActiveSpanContextSnapshot } from '@oaknational/observability';

function createCapturingSink(options?: { readonly fail?: boolean }): {
  readonly events: LogEvent[];
  readonly sink: LogSink;
} {
  const events: LogEvent[] = [];

  return {
    events,
    sink: {
      write(event): void {
        events.push(event);

        if (options?.fail) {
          throw new Error('sink failure');
        }
      },
    },
  };
}

const resourceAttributes: ResourceAttributes = {
  'service.name': 'test-service',
  'service.version': '1.0.0',
  'deployment.environment': 'test',
};

const NO_ACTIVE_SPAN_CONTEXT = (): ActiveSpanContextSnapshot | undefined => undefined;
const EMPTY_CONTEXT: LogContextInput = {};

function createActiveSpanContextProvider(
  activeSpanContext: ActiveSpanContextSnapshot | undefined,
): () => ActiveSpanContextSnapshot | undefined {
  return activeSpanContext === undefined ? NO_ACTIVE_SPAN_CONTEXT : () => activeSpanContext;
}

function createLogger(options?: {
  readonly context?: LogContextInput;
  readonly minSeverity?: number;
  readonly sinks?: readonly LogSink[];
  readonly activeSpanContext?: ActiveSpanContextSnapshot;
}): UnifiedLogger {
  const context = options?.context ?? EMPTY_CONTEXT;
  const sinks = options?.sinks ?? [];
  const activeSpanContext = options?.activeSpanContext;

  return new UnifiedLogger({
    minSeverity: options?.minSeverity ?? 9,
    resourceAttributes,
    context,
    sinks,
    getActiveSpanContext: createActiveSpanContextProvider(activeSpanContext),
  });
}

function expectLogEvent(event: LogEvent | undefined): LogEvent {
  if (!event) {
    throw new Error('Expected the sink to receive a log event.');
  }

  return event;
}

function expectRedactedContext(event: LogEvent): void {
  expect(event.context.authorization).toBe('[REDACTED]');
  expect(event.otelRecord.Attributes.nested).toEqual({
    callbackUrl: 'https://example.com/callback?token=%5BREDACTED%5D&state=%5BREDACTED%5D',
  });
  expect(event.otelRecord.Attributes.args).toEqual(['--api-key=[REDACTED]', '--mode=test']);
}

function expectRedactedError(event: LogEvent): void {
  expect(event.error?.metadata?.apiKey).toBe('[REDACTED]');
}

function expectSensitiveStringsRemoved(line: string): void {
  expect(line).not.toContain('super-secret');
  expect(line).not.toContain('abc123');
  expect(line).not.toContain('xyz');
  expect(line).not.toContain('hidden');
  expect(line).not.toContain('secret-api-key');
}

function expectRedactedLine(event: LogEvent): void {
  expect(event.line).toContain('[REDACTED]');
  expectSensitiveStringsRemoved(event.line);
}

describe('UnifiedLogger', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-11-08T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('locks the INFO JSON line output with a golden assertion', () => {
    const stdout = createCapturingSink();
    const logger = createLogger({
      sinks: [stdout.sink],
    });

    logger.info('golden message', {
      requestId: 'req-123',
      userId: 'user-456',
    });

    expect(stdout.events).toHaveLength(1);

    const event = stdout.events[0];
    expect(event).toBeDefined();
    expect(event?.line).toBe(
      '{"Timestamp":"2025-11-08T12:00:00.000Z","ObservedTimestamp":"2025-11-08T12:00:00.000Z","SeverityNumber":9,"SeverityText":"INFO","Body":"golden message","Attributes":{"requestId":"req-123","userId":"user-456"},"Resource":{"service.name":"test-service","service.version":"1.0.0","deployment.environment":"test"}}\n',
    );
    expect(parseOtelLogRecord(event?.line ?? '')).toEqual(event?.otelRecord);
  });

  it('locks the ERROR JSON line output with a golden assertion', () => {
    const stdout = createCapturingSink();
    const logger = createLogger({
      sinks: [stdout.sink],
    });
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test.ts:1:1';

    logger.error('error occurred', normalizeError(error), {
      requestId: 'req-123',
    });

    expect(stdout.events).toHaveLength(1);

    const event = stdout.events[0];
    expect(event).toBeDefined();
    expect(event?.line).toBe(
      '{"Timestamp":"2025-11-08T12:00:00.000Z","ObservedTimestamp":"2025-11-08T12:00:00.000Z","SeverityNumber":17,"SeverityText":"ERROR","Body":"error occurred","Attributes":{"requestId":"req-123","exception.type":"Error","exception.message":"Test error","exception.stacktrace":"Error: Test error\\n    at test.ts:1:1"},"Resource":{"service.name":"test-service","service.version":"1.0.0","deployment.environment":"test"}}\n',
    );
  });

  it('accepts a readonly sink array and fans the same immutable event out to every sink', () => {
    const stdout = createCapturingSink();
    const file = createCapturingSink();
    const logger = createLogger({
      sinks: Object.freeze([stdout.sink, file.sink]),
    });

    logger.info('fan-out message');

    expect(stdout.events).toHaveLength(1);
    expect(file.events).toHaveLength(1);
    expect(stdout.events[0]).toBe(file.events[0]);
    expect(stdout.events[0]?.line).toBe(file.events[0]?.line);
  });

  it('isolates sink failures so later sinks still receive the event', () => {
    const failingSink = createCapturingSink({
      fail: true,
    });
    const healthySink = createCapturingSink();
    const logger = createLogger({
      sinks: [failingSink.sink, healthySink.sink],
    });

    expect(() => logger.warn('still writes')).not.toThrow();
    expect(healthySink.events).toHaveLength(1);
    expect(healthySink.events[0]?.message).toBe('still writes');
  });

  it('redacts context and normalised errors before any sink sees the event', () => {
    const stdout = createCapturingSink();
    const file = createCapturingSink();
    const logger = createLogger({
      sinks: [stdout.sink, file.sink],
    });
    const error = Object.assign(new Error('Bearer super-secret'), {
      apiKey: 'secret-api-key',
    });
    error.stack = 'Error: Bearer super-secret\n    at test.ts:1:1';

    logger.error('request failed', normalizeError(error), {
      authorization: 'Bearer super-secret',
      nested: {
        callbackUrl: 'https://example.com/callback?token=abc123&state=xyz',
      },
      args: ['--api-key=hidden', '--mode=test'],
    });

    const event = expectLogEvent(stdout.events[0]);
    expect(event).toBe(file.events[0]);
    expectRedactedContext(event);
    expectRedactedError(event);
    expectRedactedLine(event);
  });

  it('prefers the active span context over correlation-id hashing', () => {
    const stdout = createCapturingSink();
    const spanContext = {
      traceId: '0123456789abcdef0123456789abcdef',
      spanId: '0123456789abcdef',
      traceFlags: 1,
    } as const;
    const logger = createLogger({
      sinks: [stdout.sink],
      activeSpanContext: spanContext,
    });

    logger.info('inside span', {
      correlationId: 'fallback-correlation-id',
    });

    const event = stdout.events[0];
    expect(event?.otelRecord.TraceId).toBe(spanContext.traceId);
    expect(event?.otelRecord.SpanId).toBe(spanContext.spanId);
    expect(event?.otelRecord.TraceFlags).toBe(spanContext.traceFlags);
    expect(event?.otelRecord.TraceId).not.toBe(correlationIdToTraceId('fallback-correlation-id'));
  });

  it('preserves child context, sinks, and severity thresholds', () => {
    const stdout = createCapturingSink();
    const parent = createLogger({
      context: {
        app: 'parent',
      },
      minSeverity: 17,
      sinks: [stdout.sink],
    });

    const child = parent.child({
      requestId: 'req-123',
    });

    child.info('skipped');
    child.error('emitted');

    expect(stdout.events).toHaveLength(1);

    const record = parseOtelLogRecord(stdout.events[0]?.line ?? '');
    expect(record.SeverityText).toBe('ERROR');
    expect(record.Attributes).toMatchObject({
      app: 'parent',
      requestId: 'req-123',
    });
  });

  it('reports level enablement from the configured minimum severity', () => {
    const logger = createLogger({
      minSeverity: 13,
    });

    expect(logger.shouldLog(13)).toBe(true);
    expect(logger.shouldLog(9)).toBe(false);
    expect(logger.isLevelEnabled(17)).toBe(true);
    expect(logger.isLevelEnabled(5)).toBe(false);
  });
});

import {
  context,
  trace,
  type Context,
  type Span,
  type SpanOptions,
  type Tracer,
} from '@opentelemetry/api';
import { describe, expect, it, vi } from 'vitest';
import { getActiveSpanContextSnapshot, withActiveSpan } from './span-context.js';

function createTestSpan() {
  const setAttributes = vi.fn();
  const setStatus = vi.fn();
  const recordException = vi.fn();
  const end = vi.fn();

  const span: Span = {
    spanContext() {
      return {
        traceId: 'fedcba9876543210fedcba9876543210',
        spanId: 'fedcba9876543210',
        traceFlags: 1,
      };
    },
    setAttribute() {
      return span;
    },
    setAttributes(attributes) {
      setAttributes(attributes);
      return span;
    },
    addEvent() {
      return span;
    },
    addLink() {
      return span;
    },
    addLinks() {
      return span;
    },
    setStatus(status) {
      setStatus(status);
      return span;
    },
    updateName() {
      return span;
    },
    end(endTime) {
      end(endTime);
    },
    isRecording() {
      return true;
    },
    recordException(exception, time) {
      recordException(exception, time);
    },
  };

  return {
    span,
    setAttributes,
    setStatus,
    recordException,
    end,
  };
}

function resolveSpanCallback<T>(
  optionsOrFn: SpanOptions | ((span: Span) => T),
  contextOrFn?: Context | ((span: Span) => T),
  fn?: (span: Span) => T,
): (span: Span) => T {
  if (typeof optionsOrFn === 'function') {
    return optionsOrFn;
  }

  if (typeof contextOrFn === 'function') {
    return contextOrFn;
  }

  if (fn !== undefined) {
    return fn;
  }

  throw new Error('Missing span callback.');
}

class TestTracer implements Tracer {
  private readonly span: Span;

  constructor(span: Span) {
    this.span = span;
  }

  startSpan(name: string, options?: SpanOptions, activeContext?: Context): Span {
    void name;
    void options;
    void activeContext;
    return this.span;
  }

  startActiveSpan<T>(name: string, fn: (span: Span) => T): T;
  startActiveSpan<T>(name: string, options: SpanOptions, fn: (span: Span) => T): T;
  startActiveSpan<T>(
    name: string,
    options: SpanOptions,
    activeContext: Context,
    fn: (span: Span) => T,
  ): T;
  startActiveSpan<T>(
    name: string,
    optionsOrFn: SpanOptions | ((span: Span) => T),
    contextOrFn?: Context | ((span: Span) => T),
    fn?: (span: Span) => T,
  ): T {
    void name;
    const callback = resolveSpanCallback(optionsOrFn, contextOrFn, fn);
    return callback(this.span);
  }
}

describe('getActiveSpanContextSnapshot', () => {
  it('returns undefined when no span is active', () => {
    expect(getActiveSpanContextSnapshot()).toBeUndefined();
  });

  it('reads the active span context when a span is present', () => {
    const spanContext = {
      traceId: '0123456789abcdef0123456789abcdef',
      spanId: '0123456789abcdef',
      traceFlags: 1,
      isRemote: false,
    } as const;

    const activeContext = trace.setSpan(context.active(), trace.wrapSpanContext(spanContext));

    expect(getActiveSpanContextSnapshot(activeContext)).toStrictEqual({
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
      traceFlags: spanContext.traceFlags,
    });
  });
});

describe('withActiveSpan', () => {
  it('runs the callback without a tracer when tracing is disabled', async () => {
    await expect(
      withActiveSpan({
        tracer: undefined,
        name: 'test-span',
        run: async () => 'ok',
      }),
    ).resolves.toBe('ok');
  });

  it('starts, annotates, and ends a manual span when a tracer is provided', async () => {
    const { span, setAttributes, setStatus, recordException, end } = createTestSpan();
    const tracer = new TestTracer(span);

    await expect(
      withActiveSpan({
        tracer,
        name: 'oak.manual',
        attributes: {
          phase: 'test',
        },
        run: async () => 'done',
      }),
    ).resolves.toBe('done');

    expect(setAttributes).toHaveBeenCalledWith({
      phase: 'test',
    });
    expect(setStatus).toHaveBeenCalledWith({
      code: 1,
    });
    expect(recordException).not.toHaveBeenCalled();
    expect(end).toHaveBeenCalledOnce();
  });
});

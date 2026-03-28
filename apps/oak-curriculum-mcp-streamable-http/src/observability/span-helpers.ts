import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes } from 'node:crypto';
import { SpanStatusCode, type Span, type SpanContext, type Tracer } from '@opentelemetry/api';
import {
  getActiveSpanContextSnapshot,
  type SpanAttributeValue,
  type SpanAttributes,
} from '@oaknational/observability';

const VALID_TRACE_ID_PATTERN = /^(?!0{32})[0-9a-f]{32}$/i;

export interface HttpSpanHandle {
  setAttribute(name: string, value: SpanAttributeValue): void;
  setAttributes(attributes: SpanAttributes): void;
}

export interface HttpSpanOptions<T> {
  readonly name: string;
  readonly attributes?: SpanAttributes;
  readonly run: (span: HttpSpanHandle) => Promise<T> | T;
}

export interface HttpSyncSpanOptions<T> {
  readonly name: string;
  readonly attributes?: SpanAttributes;
  readonly run: (span: HttpSpanHandle) => T;
}

const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // Synthetic spans only provide active context for correlation.
  },
  setAttributes(): void {
    // Synthetic spans only provide active context for correlation.
  },
};

function isValidTraceId(traceId: string | undefined): traceId is string {
  return traceId !== undefined && VALID_TRACE_ID_PATTERN.test(traceId);
}

function randomTraceId(): string {
  return randomBytes(16).toString('hex');
}

function randomSpanId(): string {
  return randomBytes(8).toString('hex');
}

function toActiveSpanContextSnapshot(
  spanContext: SpanContext,
): NonNullable<ReturnType<typeof getActiveSpanContextSnapshot>> {
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
  };
}

function createSyntheticSpanContext(
  parentSpan?:
    | Pick<SpanContext, 'traceFlags' | 'traceId'>
    | ReturnType<typeof getActiveSpanContextSnapshot>,
): SpanContext {
  const activeSpan = parentSpan ?? getActiveSpanContextSnapshot();

  return {
    traceId: isValidTraceId(activeSpan?.traceId) ? activeSpan.traceId : randomTraceId(),
    spanId: randomSpanId(),
    traceFlags: activeSpan?.traceFlags ?? 1,
    isRemote: false,
  };
}

function getSyntheticActiveSpanContext(
  syntheticSpanStore: AsyncLocalStorage<SpanContext>,
): ReturnType<typeof getActiveSpanContextSnapshot> {
  const syntheticSpan = syntheticSpanStore.getStore();

  return syntheticSpan
    ? toActiveSpanContextSnapshot(syntheticSpan)
    : getActiveSpanContextSnapshot();
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function createLiveSpanHandle(span: Span): HttpSpanHandle {
  return {
    setAttribute(name, value): void {
      span.setAttribute(name, value);
    },
    setAttributes(attributes): void {
      span.setAttributes(attributes);
    },
  };
}

function setInitialSpanAttributes(span: Span, attributes: SpanAttributes | undefined): void {
  if (attributes) {
    span.setAttributes(attributes);
  }
}

function runWithSyntheticSpanSync<T>(
  syntheticSpanStore: AsyncLocalStorage<SpanContext>,
  options: HttpSyncSpanOptions<T>,
): T {
  const spanContext = createSyntheticSpanContext(
    syntheticSpanStore.getStore() ?? getActiveSpanContextSnapshot(),
  );

  return syntheticSpanStore.run(spanContext, () => options.run(noopSpanHandle));
}

async function runWithSyntheticSpan<T>(
  syntheticSpanStore: AsyncLocalStorage<SpanContext>,
  options: HttpSpanOptions<T>,
): Promise<T> {
  const spanContext = createSyntheticSpanContext(
    syntheticSpanStore.getStore() ?? getActiveSpanContextSnapshot(),
  );

  return await syntheticSpanStore.run(spanContext, async () => await options.run(noopSpanHandle));
}

function runWithLiveSpanSync<T>(tracer: Tracer, options: HttpSyncSpanOptions<T>): T {
  return tracer.startActiveSpan(options.name, (span) => {
    setInitialSpanAttributes(span, options.attributes);
    const spanHandle = createLiveSpanHandle(span);

    try {
      const result = options.run(spanHandle);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const errorAsError = toError(error);
      span.recordException(errorAsError);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: errorAsError.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

async function runWithLiveSpan<T>(tracer: Tracer, options: HttpSpanOptions<T>): Promise<T> {
  return await tracer.startActiveSpan(options.name, async (span) => {
    setInitialSpanAttributes(span, options.attributes);
    const spanHandle = createLiveSpanHandle(span);

    try {
      const result = await options.run(spanHandle);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const errorAsError = toError(error);
      span.recordException(errorAsError);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: errorAsError.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

export interface SpanFunctions {
  readonly getActiveSpanContext: () => ReturnType<typeof getActiveSpanContextSnapshot>;
  readonly withSpan: <T>(options: HttpSpanOptions<T>) => Promise<T>;
  readonly withSpanSync: <T>(options: HttpSyncSpanOptions<T>) => T;
}

export function createSpanFunctions(tracer: Tracer | undefined): SpanFunctions {
  const syntheticSpanStore = new AsyncLocalStorage<SpanContext>();

  const getActiveSpanContext = (): ReturnType<typeof getActiveSpanContextSnapshot> =>
    tracer ? getActiveSpanContextSnapshot() : getSyntheticActiveSpanContext(syntheticSpanStore);

  const withSpanSync = <T>(spanOptions: HttpSyncSpanOptions<T>): T =>
    tracer
      ? runWithLiveSpanSync(tracer, spanOptions)
      : runWithSyntheticSpanSync(syntheticSpanStore, spanOptions);

  const withSpan = async <T>(spanOptions: HttpSpanOptions<T>): Promise<T> =>
    tracer
      ? await runWithLiveSpan(tracer, spanOptions)
      : await runWithSyntheticSpan(syntheticSpanStore, spanOptions);

  return { getActiveSpanContext, withSpan, withSpanSync };
}

import { createInMemoryMcpObservationRecorder } from '@oaknational/sentry-mcp';
import { context, trace } from '@opentelemetry/api';
import {
  getActiveSpanContextSnapshot,
  type WithActiveSpanOptions,
} from '@oaknational/observability';
import type {
  HttpObservability,
  HttpSpanHandle,
  HttpSyncSpanOptions,
  HttpSpanOptions,
} from '../observability/http-observability.js';
import { createFakeLogger } from './logger-fakes.js';

let fakeSpanCounter = 0;

function nextFakeSpanContext() {
  const activeSpan = getActiveSpanContextSnapshot();
  fakeSpanCounter += 1;

  return {
    traceId: activeSpan?.traceId ?? '0123456789abcdef0123456789abcdef',
    spanId: fakeSpanCounter.toString(16).padStart(16, '0'),
    traceFlags: activeSpan?.traceFlags ?? 1,
    isRemote: false,
  } as const;
}

const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // No-op in test fakes.
  },
  setAttributes(): void {
    // No-op in test fakes.
  },
};

async function withFakeActiveContext<T>(run: () => Promise<T> | T): Promise<T> {
  const activeContext = trace.setSpan(
    context.active(),
    trace.wrapSpanContext(nextFakeSpanContext()),
  );
  return await context.with(activeContext, async () => await run());
}

export function createFakeHttpObservability(): HttpObservability {
  const recorder = createInMemoryMcpObservationRecorder();
  const logger = createFakeLogger();

  const observability: HttpObservability = {
    service: 'test-http',
    environment: 'test',
    release: 'test-release',
    tracer: undefined,
    mcpRecorder: recorder,
    getActiveSpanContext: getActiveSpanContextSnapshot,
    async withActiveSpan<T>(options: WithActiveSpanOptions<T>): Promise<T> {
      return await withFakeActiveContext(async () => await options.run());
    },
    createLogger() {
      return logger;
    },
    createMcpObservationOptions() {
      return {
        service: 'test-http',
        environment: 'test',
        release: 'test-release',
        recorder,
        runtime: observability,
        tracer: undefined,
      };
    },
    async withSpan<T>(options: HttpSpanOptions<T>): Promise<T> {
      return await withFakeActiveContext(async () => await options.run(noopSpanHandle));
    },
    withSpanSync<T>(options: HttpSyncSpanOptions<T>): T {
      const activeContext = trace.setSpan(
        context.active(),
        trace.wrapSpanContext(nextFakeSpanContext()),
      );
      return context.with(activeContext, () => options.run(noopSpanHandle));
    },
    captureHandledError() {
      // No-op in the default fake; tests can override this with a recording implementation.
    },
    async flush() {
      return { ok: true, value: undefined };
    },
  };

  return observability;
}

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

function createSpanCounter(): () => number {
  let counter = 0;
  return () => {
    counter += 1;
    return counter;
  };
}

function nextFakeSpanContext(nextId: () => number) {
  const activeSpan = getActiveSpanContextSnapshot();
  const id = nextId();

  return {
    traceId: activeSpan?.traceId ?? '0123456789abcdef0123456789abcdef',
    spanId: id.toString(16).padStart(16, '0'),
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

function createFakeActiveContext(nextId: () => number) {
  return trace.setSpan(context.active(), trace.wrapSpanContext(nextFakeSpanContext(nextId)));
}

export function createFakeHttpObservability(): HttpObservability {
  const nextId = createSpanCounter();
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
      return await context.with(createFakeActiveContext(nextId), async () => await options.run());
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
      return await context.with(
        createFakeActiveContext(nextId),
        async () => await options.run(noopSpanHandle),
      );
    },
    withSpanSync<T>(options: HttpSyncSpanOptions<T>): T {
      return context.with(createFakeActiveContext(nextId), () => options.run(noopSpanHandle));
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

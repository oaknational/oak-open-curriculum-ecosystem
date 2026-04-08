import type { ActiveSpanContextSnapshot, WithActiveSpanOptions } from '@oaknational/observability';
import { describe, expect, it, vi } from 'vitest';

import { createInMemoryMcpObservationRecorder } from './recorder.js';
import type { McpObservationRuntime } from './types.js';
import { wrapPromptHandler, wrapResourceHandler, wrapToolHandler } from './wrappers.js';

function createTestRuntime(): {
  readonly runtime: McpObservationRuntime;
  readonly getActiveSpanContextMock: ReturnType<
    typeof vi.fn<() => ActiveSpanContextSnapshot | undefined>
  >;
  readonly withActiveSpanMock: ReturnType<typeof vi.fn>;
} {
  const getActiveSpanContextMock = vi.fn<() => ActiveSpanContextSnapshot | undefined>();
  const withActiveSpanMock = vi.fn((options: WithActiveSpanOptions<unknown>) => options);

  return {
    getActiveSpanContextMock,
    withActiveSpanMock,
    runtime: {
      getActiveSpanContext: getActiveSpanContextMock,
      async withActiveSpan<T>(options: WithActiveSpanOptions<T>): Promise<T> {
        withActiveSpanMock(options);
        return await options.run();
      },
    },
  };
}

describe('MCP observation wrappers', () => {
  it('records metadata-only tool observations on success', async () => {
    const { runtime, withActiveSpanMock } = createTestRuntime();
    const recorder = createInMemoryMcpObservationRecorder();
    const handler = wrapToolHandler(
      'find-lessons',
      async (query: { readonly topic: string }) => ({ count: query.topic.length }),
      {
        service: 'oak-http',
        environment: 'test',
        release: 'release-123',
        recorder,
        runtime,
        now: (() => {
          let current = 0;
          return () => (current += 5);
        })(),
      },
    );

    await expect(handler({ topic: 'fractions' })).resolves.toEqual({
      count: 9,
    });

    expect(recorder.observations).toEqual([
      {
        kind: 'tool',
        name: 'find-lessons',
        status: 'success',
        durationMs: 5,
        service: 'oak-http',
        environment: 'test',
        release: 'release-123',
      },
    ]);
    expect(JSON.stringify(recorder.observations)).not.toContain('fractions');
    expect(withActiveSpanMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'oak.mcp.tool.find-lessons',
      }),
    );
  });

  it('records resource errors and rethrows the original failure', async () => {
    const { runtime } = createTestRuntime();
    const recorder = createInMemoryMcpObservationRecorder();
    const handler = wrapResourceHandler(
      'oak://docs/start-here',
      async () => {
        throw new Error('resource lookup failed');
      },
      {
        service: 'oak-http',
        environment: 'test',
        release: 'release-123',
        recorder,
        runtime,
      },
    );

    await expect(handler()).rejects.toThrow('resource lookup failed');
    expect(recorder.observations).toHaveLength(1);
    expect(recorder.observations[0]).toMatchObject({
      kind: 'resource',
      name: 'oak://docs/start-here',
      status: 'error',
      service: 'oak-http',
      environment: 'test',
      release: 'release-123',
    });
  });

  it('still returns the handler result when the recorder throws on success', async () => {
    const throwingRecorder = {
      record: () => {
        throw new Error('recorder boom');
      },
      observations: [],
    };
    const { runtime } = createTestRuntime();
    const handler = wrapToolHandler('find-lessons', async () => ({ result: 'ok' }), {
      service: 'oak-http',
      environment: 'test',
      release: 'v1',
      recorder: throwingRecorder,
      runtime,
    });

    await expect(handler()).resolves.toEqual({ result: 'ok' });
  });

  it('still rethrows the original error when the recorder throws on failure', async () => {
    const { runtime } = createTestRuntime();
    const throwingRecorder = {
      record: () => {
        throw new Error('recorder boom');
      },
      observations: [],
    };
    const handler = wrapToolHandler(
      'find-lessons',
      async () => {
        throw new Error('handler boom');
      },
      {
        service: 'oak-http',
        environment: 'test',
        release: 'v1',
        recorder: throwingRecorder,
        runtime,
      },
    );

    await expect(handler()).rejects.toThrow('handler boom');
  });

  it('records prompt metadata with trace correlation when a span is active', async () => {
    const { runtime, getActiveSpanContextMock } = createTestRuntime();
    const recorder = createInMemoryMcpObservationRecorder();
    getActiveSpanContextMock.mockReturnValue({
      traceId: '0123456789abcdef0123456789abcdef',
      spanId: '0123456789abcdef',
      traceFlags: 1,
    });
    const handler = wrapPromptHandler(
      'lesson-planning',
      async () => ({
        messages: [],
      }),
      {
        service: 'oak-http',
        environment: 'test',
        release: 'release-123',
        recorder,
        runtime,
      },
    );

    await handler();

    expect(recorder.observations[0]).toMatchObject({
      kind: 'prompt',
      name: 'lesson-planning',
      status: 'success',
      service: 'oak-http',
      environment: 'test',
      release: 'release-123',
      traceId: '0123456789abcdef0123456789abcdef',
      spanId: '0123456789abcdef',
    });
    expect(recorder.observations[0]?.durationMs).toEqual(expect.any(Number));
  });

  it('wraps async tool handlers with single-layer Promise return type', async () => {
    const { runtime } = createTestRuntime();
    const recorder = createInMemoryMcpObservationRecorder();
    const asyncHandler = async (): Promise<{ readonly ok: true }> => ({ ok: true });
    const wrapped = wrapToolHandler('test-tool', asyncHandler, {
      service: 'oak-http',
      environment: 'test',
      release: 'v1',
      recorder,
      runtime,
    });

    const result = await wrapped();

    /** Type-level proof: result is `{ ok: true }`, not `Promise<{ ok: true }>`. */
    result satisfies { readonly ok: true };
    expect(result).toEqual({ ok: true });
  });

  it('wraps async resource handlers with single-layer Promise return type', async () => {
    const { runtime } = createTestRuntime();
    const recorder = createInMemoryMcpObservationRecorder();
    const asyncHandler = async (): Promise<{ readonly contents: readonly string[] }> => ({
      contents: ['html'],
    });
    const wrapped = wrapResourceHandler('test-resource', asyncHandler, {
      service: 'oak-http',
      environment: 'test',
      release: 'v1',
      recorder,
      runtime,
    });

    const result = await wrapped();

    /** Type-level proof: result is the inner type, not doubly wrapped. */
    result satisfies { readonly contents: readonly string[] };
    expect(result).toEqual({ contents: ['html'] });
  });

  it('wraps async prompt handlers with single-layer Promise return type', async () => {
    const { runtime } = createTestRuntime();
    const recorder = createInMemoryMcpObservationRecorder();
    const asyncHandler = async (): Promise<{ readonly messages: readonly string[] }> => ({
      messages: ['hello'],
    });
    const wrapped = wrapPromptHandler('test-prompt', asyncHandler, {
      service: 'oak-http',
      environment: 'test',
      release: 'v1',
      recorder,
      runtime,
    });

    const result = await wrapped();

    /** Type-level proof: result is the inner type, not doubly wrapped. */
    result satisfies { readonly messages: readonly string[] };
    expect(result).toEqual({ messages: ['hello'] });
  });
});

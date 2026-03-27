import type { ActiveSpanContextSnapshot, WithActiveSpanOptions } from '@oaknational/observability';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createInMemoryMcpObservationRecorder } from './recorder.js';
import type { McpObservationRuntime } from './types.js';
import { wrapPromptHandler, wrapResourceHandler, wrapToolHandler } from './wrappers.js';

const getActiveSpanContextSnapshotMock = vi.fn<() => ActiveSpanContextSnapshot | undefined>();
const withActiveSpanMock = vi.fn((options: WithActiveSpanOptions<unknown>) => options);

const runtime: McpObservationRuntime = {
  getActiveSpanContext: getActiveSpanContextSnapshotMock,
  async withActiveSpan<T>(options: WithActiveSpanOptions<T>): Promise<T> {
    withActiveSpanMock(options);
    return await options.run();
  },
};

describe('MCP observation wrappers', () => {
  afterEach(() => {
    getActiveSpanContextSnapshotMock.mockReset();
    withActiveSpanMock.mockClear();
  });

  it('records metadata-only tool observations on success', async () => {
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

  it('records prompt metadata with trace correlation when a span is active', async () => {
    const recorder = createInMemoryMcpObservationRecorder();
    getActiveSpanContextSnapshotMock.mockReturnValue({
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
});

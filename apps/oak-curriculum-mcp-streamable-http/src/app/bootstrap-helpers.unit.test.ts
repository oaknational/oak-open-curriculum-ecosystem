import { describe, it, expect } from 'vitest';
import { createPhasedTimer, type Logger } from '@oaknational/logger';
import {
  runAsyncBootstrapPhase,
  runBootstrapPhase,
  type BootstrapPhaseName,
} from './bootstrap-helpers.js';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

const TEST_PHASE: BootstrapPhaseName = 'fetchUpstreamMetadata';
const TEST_APP_ID = 1;
const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // No-op in unit test.
  },
  setAttributes(): void {
    // No-op in unit test.
  },
};

interface LogEntry {
  readonly message: string;
  readonly context: unknown;
}

function createRecordingLogger(): { log: Logger; entries: LogEntry[] } {
  const entries: LogEntry[] = [];
  const record = (message: string, context?: unknown) => {
    entries.push({ message, context });
  };
  const log = {
    debug: record,
    info: record,
    warn: record,
    error: record,
  } as Logger;
  return { log, entries };
}

describe('runAsyncBootstrapPhase', () => {
  it('returns the resolved value of an async operation', async () => {
    const { log } = createRecordingLogger();
    const timer = createPhasedTimer();

    const result = await runAsyncBootstrapPhase(log, timer, TEST_PHASE, TEST_APP_ID, () =>
      Promise.resolve('metadata-value'),
    );

    expect(result).toBe('metadata-value');
  });

  it('re-throws when the async operation rejects', async () => {
    const { log } = createRecordingLogger();
    const timer = createPhasedTimer();
    const expectedError = new Error('upstream fetch failed');

    await expect(
      runAsyncBootstrapPhase(log, timer, TEST_PHASE, TEST_APP_ID, () =>
        Promise.reject(expectedError),
      ),
    ).rejects.toThrow('upstream fetch failed');
  });

  it('logs phase start and finish on success', async () => {
    const { log, entries } = createRecordingLogger();
    const timer = createPhasedTimer();

    await runAsyncBootstrapPhase(log, timer, TEST_PHASE, TEST_APP_ID, () => Promise.resolve('ok'));

    const messages = entries.map((e) => e.message);
    expect(messages).toContain('bootstrap.phase.start');
    expect(messages).toContain('bootstrap.phase.finish');
  });

  it('logs phase start and error on failure', async () => {
    const { log, entries } = createRecordingLogger();
    const timer = createPhasedTimer();

    await runAsyncBootstrapPhase(log, timer, TEST_PHASE, TEST_APP_ID, () =>
      Promise.reject(new Error('boom')),
    ).catch(() => {
      /* expected rejection */
    });

    const messages = entries.map((e) => e.message);
    expect(messages).toContain('bootstrap.phase.start');
    expect(messages).toContain('bootstrap.phase.error');
    expect(messages).not.toContain('bootstrap.phase.finish');
  });

  it('includes duration in the finish log', async () => {
    const { log, entries } = createRecordingLogger();
    const timer = createPhasedTimer();

    await runAsyncBootstrapPhase(log, timer, TEST_PHASE, TEST_APP_ID, () =>
      Promise.resolve('done'),
    );

    const finishEntry = entries.find((e) => e.message === 'bootstrap.phase.finish');
    expect(finishEntry).toBeDefined();
    const context = finishEntry?.context as { durationMs?: number };
    expect(typeof context.durationMs).toBe('number');
  });

  it('measures duration that includes async resolution time', async () => {
    const { log, entries } = createRecordingLogger();
    const timer = createPhasedTimer();
    const delayMs = 50;

    await runAsyncBootstrapPhase(
      log,
      timer,
      TEST_PHASE,
      TEST_APP_ID,
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('delayed'), delayMs);
        }),
    );

    const finishEntry = entries.find((e) => e.message === 'bootstrap.phase.finish');
    const context = finishEntry?.context as { durationMs?: number };
    expect(context.durationMs).toBeGreaterThanOrEqual(delayMs - 10);
  });

  it('wraps async bootstrap work in an observability span when provided', async () => {
    const { log } = createRecordingLogger();
    const timer = createPhasedTimer();
    const spanCalls: {
      readonly name: string;
      readonly attributes?: Record<string, unknown>;
    }[] = [];
    const withSpan: HttpObservability['withSpan'] = async ({ name, attributes, run }) => {
      spanCalls.push({ name, attributes });
      return await run(noopSpanHandle);
    };
    const withSpanSync: HttpObservability['withSpanSync'] = ({ run }) => run(noopSpanHandle);

    await runAsyncBootstrapPhase(log, timer, TEST_PHASE, TEST_APP_ID, () => Promise.resolve('ok'), {
      withSpan,
      withSpanSync,
    });

    const expectedAsyncAttrs: unknown = expect.objectContaining({
      'oak.bootstrap.phase': 'fetchUpstreamMetadata',
      'oak.bootstrap.app_id': TEST_APP_ID,
    });
    expect(spanCalls).toEqual([
      expect.objectContaining({
        name: 'oak.http.bootstrap.fetchUpstreamMetadata',
        attributes: expectedAsyncAttrs,
      }),
    ]);
  });
});

describe('runBootstrapPhase', () => {
  it('wraps sync bootstrap work in an observability span when provided', () => {
    const { log } = createRecordingLogger();
    const timer = createPhasedTimer();
    const spanCalls: {
      readonly name: string;
      readonly attributes?: Record<string, unknown>;
    }[] = [];
    const withSpan: HttpObservability['withSpan'] = async ({ run }) => await run(noopSpanHandle);
    const withSpanSync: HttpObservability['withSpanSync'] = ({ name, attributes, run }) => {
      spanCalls.push({ name, attributes });
      return run(noopSpanHandle);
    };

    const result = runBootstrapPhase(log, timer, 'setupBaseMiddleware', TEST_APP_ID, () => 'done', {
      withSpan,
      withSpanSync,
    });

    expect(result).toBe('done');
    const expectedSyncAttrs: unknown = expect.objectContaining({
      'oak.bootstrap.phase': 'setupBaseMiddleware',
      'oak.bootstrap.app_id': TEST_APP_ID,
    });
    expect(spanCalls).toEqual([
      expect.objectContaining({
        name: 'oak.http.bootstrap.setupBaseMiddleware',
        attributes: expectedSyncAttrs,
      }),
    ]);
  });
});

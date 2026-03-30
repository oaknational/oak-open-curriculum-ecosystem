import { describe, it, expect } from 'vitest';
import { createPhasedTimer } from '@oaknational/logger';
import {
  runAsyncBootstrapPhase,
  runBootstrapPhase,
  type BootstrapPhaseName,
} from './bootstrap-helpers.js';
import { createRecordingLogger } from '../test-helpers/fakes.js';
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

function hasDurationMs(context: unknown): context is { readonly durationMs: number } {
  return (
    typeof context === 'object' &&
    context !== null &&
    'durationMs' in context &&
    typeof context.durationMs === 'number'
  );
}

describe('runAsyncBootstrapPhase', () => {
  it('returns the resolved value of an async operation', async () => {
    const { logger } = createRecordingLogger();
    const timer = createPhasedTimer();

    const result = await runAsyncBootstrapPhase(logger, timer, TEST_PHASE, TEST_APP_ID, () =>
      Promise.resolve('metadata-value'),
    );

    expect(result).toBe('metadata-value');
  });

  it('re-throws when the async operation rejects', async () => {
    const { logger } = createRecordingLogger();
    const timer = createPhasedTimer();
    const expectedError = new Error('upstream fetch failed');

    await expect(
      runAsyncBootstrapPhase(logger, timer, TEST_PHASE, TEST_APP_ID, () =>
        Promise.reject(expectedError),
      ),
    ).rejects.toThrow('upstream fetch failed');
  });

  it('logs phase start and finish on success', async () => {
    const { logger, entries } = createRecordingLogger();
    const timer = createPhasedTimer();

    await runAsyncBootstrapPhase(logger, timer, TEST_PHASE, TEST_APP_ID, () =>
      Promise.resolve('ok'),
    );

    const messages = entries.map((e) => e.message);
    expect(messages).toContain('bootstrap.phase.start');
    expect(messages).toContain('bootstrap.phase.finish');
  });

  it('logs phase start and error on failure', async () => {
    const { logger, entries } = createRecordingLogger();
    const timer = createPhasedTimer();

    await runAsyncBootstrapPhase(logger, timer, TEST_PHASE, TEST_APP_ID, () =>
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
    const { logger, entries } = createRecordingLogger();
    const timer = createPhasedTimer();

    await runAsyncBootstrapPhase(logger, timer, TEST_PHASE, TEST_APP_ID, () =>
      Promise.resolve('done'),
    );

    const finishEntry = entries.find((e) => e.message === 'bootstrap.phase.finish');
    expect(finishEntry).toBeDefined();
    expect(hasDurationMs(finishEntry?.context)).toBe(true);
  });

  it('wraps async bootstrap work in an observability span when provided', async () => {
    const { logger } = createRecordingLogger();
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

    await runAsyncBootstrapPhase(
      logger,
      timer,
      TEST_PHASE,
      TEST_APP_ID,
      () => Promise.resolve('ok'),
      { withSpan, withSpanSync },
    );

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
    const { logger } = createRecordingLogger();
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

    const result = runBootstrapPhase(
      logger,
      timer,
      'setupBaseMiddleware',
      TEST_APP_ID,
      () => 'done',
      { withSpan, withSpanSync },
    );

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

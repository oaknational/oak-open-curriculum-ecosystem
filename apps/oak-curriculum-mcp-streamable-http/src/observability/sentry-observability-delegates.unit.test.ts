/**
 * Unit tests for the Sentry delegation bridge.
 *
 * Proves that `createSentryDelegates` correctly delegates each method
 * to `SentryNodeRuntime` and maps error types from Sentry-specific to
 * provider-neutral at the boundary.
 */

import { describe, expect, it, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { SentryNodeRuntime } from '@oaknational/sentry-node';
import { createSentryDelegates } from './sentry-observability-delegates.js';

function createFakeRuntime(): SentryNodeRuntime {
  return {
    config: {
      mode: 'fixture',
      environment: 'test',
      environmentSource: 'NODE_ENV',
      release: 'test',
      releaseSource: 'local-dev',
      enableLogs: false,
      sendDefaultPii: false,
      debug: false,
    },
    tracePropagationTargets: [],
    sink: null,
    captureHandledError: vi.fn(),
    flush: vi.fn().mockResolvedValue(ok(undefined)),
    close: vi.fn().mockResolvedValue(ok(undefined)),
    setUser: vi.fn(),
    setTag: vi.fn(),
    setContext: vi.fn(),
  };
}

describe('createSentryDelegates', () => {
  it('setUser delegates to runtime', () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    delegates.setUser({ id: 'user_123' });

    expect(runtime.setUser).toHaveBeenCalledWith({ id: 'user_123' });
  });

  it('setUser(null) clears user on runtime', () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    delegates.setUser(null);

    expect(runtime.setUser).toHaveBeenCalledWith(null);
  });

  it('setTag delegates to runtime', () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    delegates.setTag('mcp.method', 'tools/call');

    expect(runtime.setTag).toHaveBeenCalledWith('mcp.method', 'tools/call');
  });

  it('setContext delegates to runtime', () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    delegates.setContext('mcp_request', { tool: 'search', method: 'POST' });

    expect(runtime.setContext).toHaveBeenCalledWith('mcp_request', {
      tool: 'search',
      method: 'POST',
    });
  });

  it('flush delegates and returns ok on success', async () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    const result = await delegates.flush(3000);

    expect(result.ok).toBe(true);
    expect(runtime.flush).toHaveBeenCalledWith(3000);
  });

  it('flush maps sentry timeout error to provider-neutral', async () => {
    const runtime = createFakeRuntime();
    vi.mocked(runtime.flush).mockResolvedValue(
      err({ kind: 'sentry_flush_timeout', timeoutMs: 3000 }),
    );
    const delegates = createSentryDelegates(runtime);

    const result = await delegates.flush(3000);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toStrictEqual({
      kind: 'observability_flush_timeout',
      timeoutMs: 3000,
    });
  });

  it('flush maps sentry flush failed error to provider-neutral', async () => {
    const runtime = createFakeRuntime();
    vi.mocked(runtime.flush).mockResolvedValue(
      err({ kind: 'sentry_flush_failed', message: 'transport down' }),
    );
    const delegates = createSentryDelegates(runtime);

    const result = await delegates.flush();

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toStrictEqual({
      kind: 'observability_flush_failed',
      message: 'transport down',
    });
  });

  it('close delegates and returns ok on success', async () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    const result = await delegates.close(5000);

    expect(result.ok).toBe(true);
    expect(runtime.close).toHaveBeenCalledWith(5000);
  });

  it('close maps sentry close error to provider-neutral', async () => {
    const runtime = createFakeRuntime();
    vi.mocked(runtime.close).mockResolvedValue(
      err({ kind: 'sentry_close_failed', message: 'drain failed' }),
    );
    const delegates = createSentryDelegates(runtime);

    const result = await delegates.close(5000);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toStrictEqual({
      kind: 'observability_close_failed',
      message: 'drain failed',
    });
  });

  it('close maps sentry close timeout error to provider-neutral', async () => {
    const runtime = createFakeRuntime();
    vi.mocked(runtime.close).mockResolvedValue(
      err({ kind: 'sentry_close_timeout', timeoutMs: 5000 }),
    );
    const delegates = createSentryDelegates(runtime);

    const result = await delegates.close(5000);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toStrictEqual({
      kind: 'observability_close_timeout',
      timeoutMs: 5000,
    });
  });

  it('captureHandledError normalises and delegates', () => {
    const runtime = createFakeRuntime();
    const delegates = createSentryDelegates(runtime);

    delegates.captureHandledError(new Error('boom'), { boundary: 'test' });

    expect(runtime.captureHandledError).toHaveBeenCalledOnce();
    const args = vi.mocked(runtime.captureHandledError).mock.calls[0];
    expect(args?.[0]?.message).toBe('boom');
    expect(args?.[1]).toStrictEqual({ boundary: 'test' });
  });
});

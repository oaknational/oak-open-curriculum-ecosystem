import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/logger';

const loggerStubs = vi.hoisted(() => {
  const info = vi.fn();
  const error = vi.fn();
  const noop = vi.fn();
  const stub: Logger = {
    trace: noop,
    debug: noop,
    info,
    warn: noop,
    error,
    fatal: noop,
  };
  return { info, error, noop, stub };
});

vi.mock('../logger', () => ({
  searchLogger: loggerStubs.stub,
}));

const persistenceStubs = vi.hoisted(() => ({
  persistZeroHitEvent: vi.fn<(payload: unknown) => Promise<void>>(),
  zeroHitPersistenceEnabled: vi.fn(() => false),
}));

vi.mock('./zero-hit-persistence', () => persistenceStubs);

const { info, error, noop } = loggerStubs;
const { persistZeroHitEvent, zeroHitPersistenceEnabled } = persistenceStubs;

import { logZeroHit } from './zero-hit';
import { getZeroHitSummary, resetZeroHitStore } from './zero-hit-store';

describe('logZeroHit', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    info.mockReset();
    error.mockReset();
    noop.mockReset();
    fetchMock.mockReset();
    resetZeroHitStore();
    persistZeroHitEvent.mockReset();
    zeroHitPersistenceEnabled.mockReturnValue(false);
  });

  it('emits a structured log and webhook payload when hits are zero', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 202 }));

    await logZeroHit({
      total: 0,
      scope: 'units',
      query: 'mountain formation',
      subject: 'geography',
      keyStage: 'ks4',
      indexVersion: 'v2025-03-16',
      webhookUrl: 'https://hooks.example.com/zero-hit',
      fetchImpl: fetchMock,
    });

    expect(info).toHaveBeenCalledWith('semantic-search.zero-hit', {
      scope: 'units',
      query: 'mountain formation',
      filters: { subject: 'geography', keyStage: 'ks4' },
      indexVersion: 'v2025-03-16',
    });
    expect(fetchMock).toHaveBeenCalledWith('https://hooks.example.com/zero-hit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'semantic-search.zero-hit',
        scope: 'units',
        query: 'mountain formation',
        filters: { subject: 'geography', keyStage: 'ks4' },
        indexVersion: 'v2025-03-16',
      }),
    });

    const summary = getZeroHitSummary();
    expect(summary.total).toBe(1);
    expect(summary.byScope.units).toBe(1);
  });

  it('does nothing when total is above zero', async () => {
    await logZeroHit({
      total: 3,
      scope: 'lessons',
      query: 'fractions',
      indexVersion: 'v2025-03-16',
    });

    expect(info).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getZeroHitSummary().total).toBe(0);
  });

  it('persists zero-hit events when persistence is enabled', async () => {
    zeroHitPersistenceEnabled.mockReturnValue(true);
    persistZeroHitEvent.mockResolvedValueOnce();

    await logZeroHit({
      total: 0,
      scope: 'lessons',
      query: 'fractions',
      indexVersion: 'v2025-03-16',
      webhookUrl: 'none',
      took: 123,
      timedOut: false,
      requestId: 'req-123',
    });

    expect(persistZeroHitEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'lessons',
        query: 'fractions',
        indexVersion: 'v2025-03-16',
        tookMs: 123,
        timedOut: false,
        requestId: 'req-123',
      }),
    );
  });

  it('allows skipping log, persistence, and webhook', async () => {
    zeroHitPersistenceEnabled.mockReturnValue(true);

    await logZeroHit({
      total: 0,
      scope: 'lessons',
      query: 'fixture zero hit',
      indexVersion: 'v-fixture',
      webhookUrl: 'https://hooks.example.com/zero-hit',
      fetchImpl: fetchMock,
      skipLog: true,
      skipPersistence: true,
      skipWebhook: true,
    });

    expect(info).not.toHaveBeenCalled();
    expect(persistZeroHitEvent).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getZeroHitSummary().total).toBe(1);
  });
});

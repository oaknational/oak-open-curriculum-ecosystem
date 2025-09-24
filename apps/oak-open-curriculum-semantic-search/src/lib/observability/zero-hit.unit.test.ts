import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';

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

const { info, error, noop } = loggerStubs;

import { logZeroHit } from './zero-hit';

describe('logZeroHit', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    info.mockReset();
    error.mockReset();
    noop.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('emits a structured log and webhook payload when hits are zero', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 202 }));

    await logZeroHit({
      total: 0,
      scope: 'units',
      text: 'mountain formation',
      subject: 'geography',
      keyStage: 'ks4',
      indexVersion: 'v2025-03-16',
      webhookUrl: 'https://hooks.example.com/zero-hit',
    });

    expect(info).toHaveBeenCalledWith('semantic-search.zero-hit', {
      scope: 'units',
      text: 'mountain formation',
      filters: { subject: 'geography', keyStage: 'ks4' },
      indexVersion: 'v2025-03-16',
    });
    expect(fetchMock).toHaveBeenCalledWith('https://hooks.example.com/zero-hit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'semantic-search.zero-hit',
        scope: 'units',
        text: 'mountain formation',
        filters: { subject: 'geography', keyStage: 'ks4' },
        indexVersion: 'v2025-03-16',
      }),
    });
  });

  it('does nothing when total is above zero', async () => {
    await logZeroHit({
      total: 3,
      scope: 'lessons',
      text: 'fractions',
      indexVersion: 'v2025-03-16',
    });

    expect(info).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

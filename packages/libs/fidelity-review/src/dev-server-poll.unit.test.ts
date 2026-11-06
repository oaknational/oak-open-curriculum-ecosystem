import { afterEach, describe, expect, it, vi } from 'vitest';

import { pollUntil } from './dev-server-poll';

/** The poll loop over fake timers: no socket is opened and no real time passes. */

describe('pollUntil', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true as soon as the predicate holds', async () => {
    expect(await pollUntil(() => Promise.resolve(true), 1000)).toBe(true);
  });

  it('wakes from its sleep when the signal aborts, without waiting out the interval', async () => {
    vi.useFakeTimers();
    const stop = new AbortController();
    const predicate = vi.fn(() => Promise.resolve(false));
    const polled = pollUntil(predicate, 60_000, stop.signal);
    // Let the first probe run, so the loop is asleep when the abort lands.
    await vi.advanceTimersByTimeAsync(0);
    stop.abort();
    // No timer is advanced past this point: only the abort can end the sleep.
    await expect(polled).resolves.toBe(false);
    expect(predicate).toHaveBeenCalledTimes(1);
  });
});

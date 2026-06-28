import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  productionCollaborationStateRuntime,
  waitForAnyDirectoryChange,
} from '../../src/collaboration-state/cli-runtime';

/**
 * Regression pin (Luminous c3) for the invariant that pre-cured the worse
 * version of the 2026-06-10 comms-watch stall: the directory-change wait is
 * poll-bounded BY CONSTRUCTION — a `setTimeout(pollMs)` fallback runs
 * ALONGSIDE the fs.watch subscriptions, so a dropped FSEvents subscription
 * (the macOS suspect) delays a wake by at most `pollMs` rather than stalling
 * the watcher forever. The injectable `watchFactory` keeps both paths
 * deterministic without relying on real, non-deterministic FS events.
 */
describe('waitForAnyDirectoryChange — poll-bounded wait (Luminous c3 regression pin)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves within pollMs via the timer when the watch never fires (dropped subscription)', async () => {
    const watched: string[] = [];
    let resolved = false;
    const wait = waitForAnyDirectoryChange({
      directories: ['/watched'],
      pollMs: 500,
      // Subscription is created but its change callback never fires — models
      // a dropped FSEvents subscription.
      watchFactory: (directory) => {
        watched.push(directory);
        return { close: () => undefined };
      },
    }).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(499);
    expect(resolved).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await wait;
    expect(resolved).toBe(true);
    expect(watched).toStrictEqual(['/watched']);
  });

  it('resolves early via the watch callback without waiting for pollMs (the fires path)', async () => {
    const watched: string[] = [];
    let fireChange = (): void => undefined;
    const wait = waitForAnyDirectoryChange({
      directories: ['/watched'],
      pollMs: 500,
      watchFactory: (directory, onChange) => {
        watched.push(directory);
        fireChange = onChange;
        return { close: () => undefined };
      },
    });

    // Fire the change immediately — no timer advance — and the wait resolves.
    fireChange();
    await expect(wait).resolves.toBeUndefined();
    expect(watched).toStrictEqual(['/watched']);
  });

  it('closes every watch handle when the wait settles', async () => {
    const closed: boolean[] = [];
    const wait = waitForAnyDirectoryChange({
      directories: ['/a', '/b'],
      pollMs: 500,
      watchFactory: () => {
        const index = closed.push(false) - 1;
        return {
          close: () => {
            closed[index] = true;
          },
        };
      },
    });

    await vi.advanceTimersByTimeAsync(500);
    await wait;
    expect(closed).toStrictEqual([true, true]);
  });

  it('tolerates a null handle (unwatchable directory) and still resolves via the timer', async () => {
    const wait = waitForAnyDirectoryChange({
      directories: ['/unwatchable'],
      pollMs: 500,
      watchFactory: () => null,
    });

    await vi.advanceTimersByTimeAsync(500);
    await expect(wait).resolves.toBeUndefined();
  });

  it('settles cleanly when a factory fires onChange synchronously (no temporal-dead-zone crash)', async () => {
    const subscribed: string[] = [];
    const wait = waitForAnyDirectoryChange({
      directories: ['/sync', '/second'],
      pollMs: 500,
      watchFactory: (directory, onChange) => {
        subscribed.push(directory);
        onChange(); // fire synchronously during subscription
        return { close: () => undefined };
      },
    });

    // Resolves without a timer advance and without throwing; the synchronous
    // settle also stops subscribing the remaining directory.
    await expect(wait).resolves.toBeUndefined();
    expect(subscribed).toStrictEqual(['/sync']);
  });
});

describe('productionCollaborationStateRuntime — supervisor-liveness seam wired (F-101)', () => {
  it('provides a processIsAlive probe that reports this live process alive', () => {
    // The composition-root guard: the production runtime MUST wire the
    // signal-0 probe, or `comms watch --supervisor-pid` would throw at runtime
    // (the wiring gap the F-101 observation proof surfaced). `process.pid` is
    // this test runner — guaranteed alive — so no flaky absent-pid is needed.
    const runtime = productionCollaborationStateRuntime();
    expect(runtime.processIsAlive).toBeDefined();
    expect(runtime.processIsAlive?.(process.pid)).toBe(true);
  });
});

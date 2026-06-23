import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  emitWatcherError,
  reportTimeout,
  runWithDeadline,
  WatcherTimeoutError,
} from '../../src/collaboration-state/comms-watch-errors';

/** A call that never settles — models a hung step / hung emit channel. */
function hangsForever(): Promise<never> {
  return new Promise<never>(() => undefined);
}

describe('runWithDeadline', () => {
  it('resolves with the step value when the step settles before the deadline', async () => {
    const value = await runWithDeadline('drain', async () => 'done', 60_000);
    expect(value).toBe('done');
  });

  it("rejects with the step's own error when the step rejects before the deadline", async () => {
    await expect(
      runWithDeadline(
        'emit',
        async () => {
          throw new Error('step failed');
        },
        60_000,
      ),
    ).rejects.toThrow('step failed');
  });

  describe('with fake timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('rejects with a WatcherTimeoutError naming the step when the deadline fires first', async () => {
      const raced = runWithDeadline('markSeen', () => hangsForever(), 60_000);
      const rejection = expect(raced).rejects.toThrow(/step "markSeen" exceeded 60000ms/u);
      await vi.advanceTimersByTimeAsync(60_000);
      await rejection;
    });

    it('exposes the timed-out step name on the thrown error', async () => {
      const raced = runWithDeadline('drain', () => hangsForever(), 60_000);
      const captured = raced.catch((error: unknown) => error);
      await vi.advanceTimersByTimeAsync(60_000);
      const error = await captured;
      expect(error).toBeInstanceOf(WatcherTimeoutError);
      if (error instanceof WatcherTimeoutError) {
        expect(error.step).toBe('drain');
      }
    });
  });
});

describe('reportTimeout', () => {
  it('emits a kind=timeout WATCHER ERROR line naming the step over a healthy channel', async () => {
    const emitted: string[] = [];
    await reportTimeout(
      async (text) => {
        emitted.push(text);
      },
      new WatcherTimeoutError('emit', 60_000),
      60_000,
    );

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toContain('--- WATCHER ERROR ---');
    expect(emitted[0]).toContain('kind=timeout');
    expect(emitted[0]).toContain('step "emit"');
  });

  describe('with fake timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves (swallows) within its own deadline when the emit channel is permanently hung', async () => {
      let settled = false;
      const report = reportTimeout(
        () => hangsForever(),
        new WatcherTimeoutError('emit', 60_000),
        60_000,
      ).then(() => {
        settled = true;
      });

      await vi.advanceTimersByTimeAsync(60_000);
      await report;
      // The hung report does not wedge: it is cut off by its own deadline and
      // resolves rather than hanging forever.
      expect(settled).toBe(true);
    });
  });
});

describe('emitWatcherError', () => {
  it('formats kind and message, appending event_ids when present', async () => {
    const emitted: string[] = [];
    await emitWatcherError(
      async (text) => {
        emitted.push(text);
      },
      'markSeen',
      new Error('seen-file write failed'),
      ['evt-a', 'evt-b'],
    );

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toBe(
      '--- WATCHER ERROR --- kind=markSeen message=seen-file write failed event_ids=evt-a,evt-b\n',
    );
  });

  it('omits the event_ids suffix when no event IDs are supplied', async () => {
    const emitted: string[] = [];
    await emitWatcherError(
      async (text) => {
        emitted.push(text);
      },
      'drain',
      'malformed JSON event file',
    );

    expect(emitted[0]).toBe('--- WATCHER ERROR --- kind=drain message=malformed JSON event file\n');
  });

  it('swallows an emit failure rather than throwing (error reporting must not kill the watcher)', async () => {
    await expect(
      emitWatcherError(
        async () => {
          throw new Error('stdout write failed');
        },
        'emit',
        new Error('original failure'),
      ),
    ).resolves.toBeUndefined();
  });
});

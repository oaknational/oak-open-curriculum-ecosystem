import { describe, expect, it } from 'vitest';

import {
  watchCommsLoop,
  type WatcherErrorKind,
} from '../../src/collaboration-state/comms-watch-loop';
import { type DrainResult } from '../../src/collaboration-state/types';

function emptyDrain(): DrainResult {
  return { output: '', eventCount: 0, eventIds: [] };
}

function describeStream(...payloads: readonly DrainResult[]): {
  readonly drain: () => Promise<DrainResult>;
  readonly drainCalls: () => number;
} {
  let cursor = 0;
  let calls = 0;
  return {
    drain: async () => {
      calls += 1;
      const next = payloads[cursor] ?? emptyDrain();
      cursor = Math.min(cursor + 1, payloads.length - 1 < 0 ? 0 : payloads.length);
      return next;
    },
    drainCalls: () => calls,
  };
}

describe('watchCommsLoop — contract per FM-2 cure (2026-05-23)', () => {
  it('emits drained text, marks the same event IDs seen, and stops when maxEvents is reached', async () => {
    const emitted: string[] = [];
    const marked: (readonly string[])[] = [];
    const drainPayload: DrainResult = {
      output: 'one\ntwo\n',
      eventCount: 2,
      eventIds: ['evt-one', 'evt-two'],
    };

    const stream = describeStream(drainPayload);

    const output = await watchCommsLoop({
      maxEvents: 2,
      drain: stream.drain,
      waitForChange: async () => undefined,
      emit: async (text) => {
        emitted.push(text);
      },
      markSeen: async (eventIds) => {
        marked.push(eventIds);
      },
    });

    expect(output).toBe('one\ntwo\n');
    expect(emitted).toStrictEqual(['one\ntwo\n']);
    expect(marked).toStrictEqual([['evt-one', 'evt-two']]);
    expect(stream.drainCalls()).toBe(1);
  });

  it('calls markSeen only AFTER emit succeeds (Zephyrous post-emit-seen invariant)', async () => {
    const sequence: string[] = [];
    const drainPayload: DrainResult = {
      output: 'payload\n',
      eventCount: 1,
      eventIds: ['evt-one'],
    };
    const stream = describeStream(drainPayload);

    await watchCommsLoop({
      maxEvents: 1,
      drain: stream.drain,
      waitForChange: async () => undefined,
      emit: async () => {
        sequence.push('emit');
      },
      markSeen: async () => {
        sequence.push('markSeen');
      },
    });

    expect(sequence).toStrictEqual(['emit', 'markSeen']);
  });

  it('fires the tick callback on every loop iteration with the latest status snapshot', async () => {
    const ticks: number[] = [];
    const stream = describeStream(
      { output: 'a\n', eventCount: 1, eventIds: ['a'] },
      { output: 'b\n', eventCount: 1, eventIds: ['b'] },
    );

    await watchCommsLoop({
      maxEvents: 2,
      drain: stream.drain,
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
      tick: async (status) => {
        ticks.push(status.emittedCount);
      },
    });

    expect(ticks).toStrictEqual([1, 2]);
  });

  it('fires tick even when the drain step yields no events (quiet-stream heartbeat — Zephyrous slice 1)', async () => {
    const ticks: number[] = [];
    let drainCalls = 0;
    let waits = 0;

    await watchCommsLoop({
      maxEvents: 1,
      drain: async () => {
        drainCalls += 1;
        if (drainCalls === 1) {
          return emptyDrain();
        }
        return { output: 'finally\n', eventCount: 1, eventIds: ['final'] };
      },
      waitForChange: async () => {
        waits += 1;
      },
      emit: async () => undefined,
      markSeen: async () => undefined,
      tick: async (status) => {
        ticks.push(status.emittedCount);
      },
    });

    expect(drainCalls).toBe(2);
    expect(waits).toBe(1);
    expect(ticks).toStrictEqual([0, 1]);
  });

  it('emits a WATCHER ERROR line when drain throws and continues the loop (Zephyrous slice 2 + slice 3 — bad event file no silent kill)', async () => {
    const emitted: string[] = [];
    let drainCalls = 0;

    await watchCommsLoop({
      maxEvents: 1,
      drain: async () => {
        drainCalls += 1;
        if (drainCalls === 1) {
          throw new Error('malformed JSON event file');
        }
        return { output: 'recovered\n', eventCount: 1, eventIds: ['evt-recovered'] };
      },
      waitForChange: async () => undefined,
      emit: async (text) => {
        emitted.push(text);
      },
      markSeen: async () => undefined,
    });

    expect(emitted.length).toBeGreaterThanOrEqual(2);
    expect(emitted[0]).toContain('--- WATCHER ERROR ---');
    expect(emitted[0]).toContain('kind=drain');
    expect(emitted[0]).toContain('malformed JSON event file');
    expect(emitted.at(-1)).toBe('recovered\n');
  });

  it('emits a WATCHER ERROR when markSeen throws AND includes the event_ids (Zephyrous slice 5 — preservation constraint)', async () => {
    const emitted: string[] = [];

    await watchCommsLoop({
      maxEvents: 1,
      drain: async () => ({
        output: 'payload\n',
        eventCount: 1,
        eventIds: ['evt-a', 'evt-b'],
      }),
      waitForChange: async () => undefined,
      emit: async (text) => {
        emitted.push(text);
      },
      markSeen: async () => {
        throw new Error('seen-file write failed');
      },
    });

    const errorLine = emitted.find((text) => text.includes('--- WATCHER ERROR ---'));
    expect(errorLine).toBeDefined();
    expect(errorLine).toContain('kind=markSeen');
    expect(errorLine).toContain('seen-file write failed');
    expect(errorLine).toContain('event_ids=evt-a,evt-b');
  });

  it('does NOT mark events seen when emit throws — events re-emit on the next iteration', async () => {
    const emitted: string[] = [];
    const marked: (readonly string[])[] = [];
    let emitCalls = 0;

    await watchCommsLoop({
      maxEvents: 1,
      drain: async () => ({
        output: 'payload\n',
        eventCount: 1,
        eventIds: ['evt-one'],
      }),
      waitForChange: async () => undefined,
      emit: async (text) => {
        emitCalls += 1;
        // The first emit attempt of the iteration fails; every subsequent
        // emit succeeds. The fake does not introspect the text — call-count
        // is the sole switch, so changes to the watcher's error-line format
        // do not silently re-wire this test.
        if (emitCalls === 1) {
          throw new Error('stdout write failed');
        }
        emitted.push(text);
      },
      markSeen: async (eventIds) => {
        marked.push(eventIds);
      },
    });

    // The loop emits 3 things across the two iterations:
    //   1) iteration 1 attempts to emit the payload — throws
    //   2) iteration 1 emits WATCHER ERROR kind=emit (via the swallow-safe
    //      error-reporter; counted as emit call 2, succeeds)
    //   3) iteration 2 drains the same event again (still unseen) and
    //      emits the payload successfully (counted as emit call 3, succeeds)
    expect(emitCalls).toBe(3);
    // markSeen fires exactly once — only after the payload emit succeeded
    // on iteration 2; the iteration-1 attempt left the event unseen.
    expect(marked).toStrictEqual([['evt-one']]);
    // The second successful emit must include the recovered payload, and
    // the error-report emit must surface the kind=emit failure mode.
    expect(emitted.length).toBeGreaterThanOrEqual(2);
    expect(emitted.some((text) => text.includes('kind=emit'))).toBe(true);
    expect(emitted.includes('payload\n')).toBe(true);
  });

  it('treats onError returning true as a fatal signal that exits the loop', async () => {
    let drainCalls = 0;
    const errorKinds: WatcherErrorKind[] = [];

    const output = await watchCommsLoop({
      drain: async () => {
        drainCalls += 1;
        throw new Error('boom');
      },
      waitForChange: async () => {
        throw new Error('waitForChange must not be reached after fatal');
      },
      emit: async () => undefined,
      markSeen: async () => undefined,
      onError: async (kind) => {
        errorKinds.push(kind);
        return true;
      },
    });

    expect(drainCalls).toBe(1);
    expect(errorKinds).toStrictEqual(['drain']);
    expect(output).toBe('');
  });

  it('treats onError throwing as non-fatal — the loop continues', async () => {
    let drainCalls = 0;

    await watchCommsLoop({
      maxEvents: 1,
      drain: async () => {
        drainCalls += 1;
        if (drainCalls === 1) {
          throw new Error('first failure');
        }
        return { output: 'ok\n', eventCount: 1, eventIds: ['evt-ok'] };
      },
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
      onError: async () => {
        throw new Error('onError itself failed');
      },
    });

    expect(drainCalls).toBe(2);
  });

  it('does NOT kill the watcher when tick throws (heartbeat failures must not be fatal)', async () => {
    let tickCalls = 0;
    let emitCalls = 0;

    await watchCommsLoop({
      maxEvents: 1,
      drain: async () => ({ output: 'ok\n', eventCount: 1, eventIds: ['evt-ok'] }),
      waitForChange: async () => undefined,
      emit: async () => {
        emitCalls += 1;
      },
      markSeen: async () => undefined,
      tick: async () => {
        tickCalls += 1;
        throw new Error('heartbeat write failed');
      },
    });

    expect(tickCalls).toBe(1);
    expect(emitCalls).toBe(1);
  });

  it('passes remainingEvents to drain so the underlying source can bound its batch', async () => {
    const remainingArgs: (number | undefined)[] = [];

    await watchCommsLoop({
      maxEvents: 3,
      drain: async (remainingEvents) => {
        remainingArgs.push(remainingEvents);
        return { output: 'one\n', eventCount: 1, eventIds: ['x'] };
      },
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
    });

    expect(remainingArgs).toStrictEqual([3, 2, 1]);
  });
});

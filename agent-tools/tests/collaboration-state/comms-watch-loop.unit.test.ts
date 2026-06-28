import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  watchCommsLoop,
  WatcherTimeoutError,
  type WatcherErrorKind,
} from '../../src/collaboration-state/comms-watch-loop';
import { type DrainResult } from '../../src/collaboration-state/types';

/** A step that never settles — models the hang-but-run failure mode (2026-06-10). */
function neverResolves<T>(): Promise<T> {
  return new Promise<T>(() => undefined);
}

/** A void-returning step that never settles (the hang for `emit` / `markSeen`). */
function hangsForever(): Promise<void> {
  return new Promise<never>(() => undefined);
}

const ONE_PAYLOAD: DrainResult = { output: 'payload\n', eventCount: 1, eventIds: ['evt'] };

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

describe('watchCommsLoop — per-step deadlines fail loud (Luminous c1, hang-but-run cure 2026-06-10)', () => {
  const STEP_TIMEOUT_MS = 60_000;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects with a kind=timeout diagnostic naming the step when DRAIN hangs, within the deadline', async () => {
    const emitted: string[] = [];

    const loop = watchCommsLoop({
      maxEvents: 1,
      stepTimeoutMs: STEP_TIMEOUT_MS,
      drain: () => neverResolves<DrainResult>(),
      waitForChange: async () => undefined,
      emit: async (text) => {
        emitted.push(text);
      },
      markSeen: async () => undefined,
    });

    const rejection = expect(loop).rejects.toThrow(WatcherTimeoutError);
    await vi.advanceTimersByTimeAsync(STEP_TIMEOUT_MS);
    await rejection;

    const errorLine = emitted.find((text) => text.includes('--- WATCHER ERROR ---'));
    expect(errorLine).toBeDefined();
    expect(errorLine).toContain('kind=timeout');
    expect(errorLine).toContain('drain');
  });

  it('rejects naming the EMIT step when emit hangs — fail-loud even when the diagnostic channel is the hung one', async () => {
    const loop = watchCommsLoop({
      maxEvents: 1,
      stepTimeoutMs: STEP_TIMEOUT_MS,
      drain: async () => ONE_PAYLOAD,
      waitForChange: async () => undefined,
      // The emit channel is permanently hung, so BOTH the payload emit and the
      // loop's own timeout-error report wedge on it. The loop must still exit
      // (reject), proving fail-loud does not depend on the diagnostic channel.
      // (The bounded report's behaviour in isolation is pinned directly on
      // reportTimeout in comms-watch-errors.unit.test.ts.)
      emit: () => hangsForever(),
      markSeen: async () => undefined,
    });

    const rejection = expect(loop).rejects.toThrow(/step "emit"/u);
    // Worst case is 2x the deadline: one for the hung emit step, one for the
    // hung error report bounded by reportTimeout.
    await vi.advanceTimersByTimeAsync(STEP_TIMEOUT_MS * 2);
    await rejection;
  });

  it('rejects with a kind=timeout diagnostic naming the step when MARKSEEN hangs, within the deadline', async () => {
    const emitted: string[] = [];

    const loop = watchCommsLoop({
      maxEvents: 1,
      stepTimeoutMs: STEP_TIMEOUT_MS,
      drain: async () => ONE_PAYLOAD,
      waitForChange: async () => undefined,
      emit: async (text) => {
        emitted.push(text);
      },
      markSeen: () => hangsForever(),
    });

    const rejection = expect(loop).rejects.toThrow(WatcherTimeoutError);
    await vi.advanceTimersByTimeAsync(STEP_TIMEOUT_MS);
    await rejection;

    const errorLine = emitted.find((text) => text.includes('--- WATCHER ERROR ---'));
    expect(errorLine).toBeDefined();
    expect(errorLine).toContain('kind=timeout');
    expect(errorLine).toContain('markSeen');
  });

  it('does NOT time out when every step resolves within the deadline (normal operation unaffected)', async () => {
    const output = await watchCommsLoop({
      maxEvents: 1,
      stepTimeoutMs: STEP_TIMEOUT_MS,
      drain: async () => ({ output: 'ok\n', eventCount: 1, eventIds: ['evt-ok'] }),
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
    });

    expect(output).toBe('ok\n');
  });

  it('a timed-out step is fatal regardless of onError (timeout is always non-recoverable)', async () => {
    const onErrorKinds: WatcherErrorKind[] = [];

    const loop = watchCommsLoop({
      maxEvents: 1,
      stepTimeoutMs: STEP_TIMEOUT_MS,
      drain: () => neverResolves<DrainResult>(),
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
      // onError returning false (non-fatal) must NOT rescue a timeout.
      onError: async (kind) => {
        onErrorKinds.push(kind);
        return false;
      },
    });

    const rejection = expect(loop).rejects.toThrow(WatcherTimeoutError);
    await vi.advanceTimersByTimeAsync(STEP_TIMEOUT_MS);
    await rejection;

    // The timeout path is fatal-by-construction and never consults onError —
    // onError must not be invoked AT ALL for a timed-out step.
    expect(onErrorKinds).toHaveLength(0);
  });
});

describe('watchCommsLoop — supervisor-death detection (F-101 refined-(i) kill-tree)', () => {
  it('self-exits cleanly the iteration after supervisorAlive reports the supervisor dead, with no further drain or wait', async () => {
    let aliveChecks = 0;
    let drainCalls = 0;
    let waits = 0;

    const output = await watchCommsLoop({
      // No maxEvents: the loop is unbounded, exactly as the live watcher runs.
      // Supervisor death is the ONLY exit — proving the cure terminates an
      // otherwise-immortal watcher when its agent is gone.
      drain: async () => {
        drainCalls += 1;
        return emptyDrain();
      },
      waitForChange: async () => {
        waits += 1;
      },
      emit: async () => undefined,
      markSeen: async () => undefined,
      // Alive on the first check, dead on the second.
      supervisorAlive: async () => {
        aliveChecks += 1;
        return aliveChecks < 2;
      },
    });

    expect(output).toBe('');
    // The check sits at the TOP of each iteration: iteration 1 sees alive →
    // one drain + one wait; iteration 2 sees dead → returns BEFORE draining or
    // waiting again. So exactly one drain, one wait, two checks.
    expect(aliveChecks).toBe(2);
    expect(drainCalls).toBe(1);
    expect(waits).toBe(1);
  });

  it('exits immediately without draining when the supervisor is already dead at start', async () => {
    let drainCalls = 0;

    const output = await watchCommsLoop({
      drain: async () => {
        drainCalls += 1;
        return emptyDrain();
      },
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
      supervisorAlive: async () => false,
    });

    expect(output).toBe('');
    expect(drainCalls).toBe(0);
  });

  it('keeps running while supervisorAlive reports alive (no behaviour change on the live path)', async () => {
    let aliveChecks = 0;
    const stream = describeStream({ output: 'a\n', eventCount: 1, eventIds: ['a'] });

    const output = await watchCommsLoop({
      maxEvents: 1,
      drain: stream.drain,
      waitForChange: async () => undefined,
      emit: async () => undefined,
      markSeen: async () => undefined,
      supervisorAlive: async () => {
        aliveChecks += 1;
        return true;
      },
    });

    expect(output).toBe('a\n');
    expect(aliveChecks).toBeGreaterThanOrEqual(1);
  });
});

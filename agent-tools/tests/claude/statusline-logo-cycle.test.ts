import {
  frameCounterPath,
  frameIndex,
  isMotionDisabled,
  parseFrameCounter,
  readAndAdvanceFrame,
  type FrameCounterStore,
} from '../../src/claude/statusline-logo-cycle';

/** Simple in-memory counter store fake, injected as an argument (no IO). */
function fakeStore(): FrameCounterStore {
  const values = new Map<string, string>();
  return {
    read: (sessionId) => values.get(sessionId),
    write: (sessionId, value) => {
      values.set(sessionId, value);
    },
  };
}

describe('frameIndex', () => {
  it('wraps the counter modulo the frame count', () => {
    expect([0, 1, 2, 3, 4, 5].map((counter) => frameIndex(3, counter))).toEqual([0, 1, 2, 0, 1, 2]);
  });

  it('tolerates negative and fractional counters', () => {
    expect(frameIndex(3, -1)).toBe(2);
    expect(frameIndex(3, -3)).toBe(0);
    expect(frameIndex(3, 1.9)).toBe(1);
  });

  it('returns 0 for a degenerate count rather than dividing by zero', () => {
    expect(frameIndex(0, 5)).toBe(0);
  });
});

describe('isMotionDisabled', () => {
  it('treats the reduce-motion values as disabled, case-insensitively', () => {
    for (const value of ['off', 'static', 'none', 'reduce', 'OFF', '  Reduce  ']) {
      expect(isMotionDisabled(value)).toBe(true);
    }
  });

  it('treats unset, auto, and unknown values as enabled', () => {
    for (const value of [undefined, '', 'auto', 'on', 'fast']) {
      expect(isMotionDisabled(value)).toBe(false);
    }
  });
});

describe('parseFrameCounter', () => {
  it('parses a non-negative integer counter', () => {
    expect(parseFrameCounter('0')).toBe(0);
    expect(parseFrameCounter('7')).toBe(7);
    expect(parseFrameCounter('  12  ')).toBe(12);
  });

  it('resets any missing, negative, or non-integer value to 0', () => {
    expect(parseFrameCounter(undefined)).toBe(0);
    expect(parseFrameCounter('')).toBe(0);
    expect(parseFrameCounter('nope')).toBe(0);
    expect(parseFrameCounter('-3')).toBe(0);
  });
});

describe('frameCounterPath', () => {
  it('keeps the file inside the base directory and sanitises the session id', () => {
    const base = '/tmp/oak-frames';
    expect(frameCounterPath(base, 'sess-12_AB')).toBe('/tmp/oak-frames/sess-12_AB');

    const traversal = frameCounterPath(base, '../../evil');
    expect(traversal.startsWith(`${base}/`)).toBe(true);
    expect(traversal).not.toContain('..');
  });

  it('falls back to a default name for an empty session id', () => {
    expect(frameCounterPath('/tmp/oak-frames', '')).toBe('/tmp/oak-frames/default');
  });
});

describe('readAndAdvanceFrame', () => {
  it('returns the stored counter and persists the next one', () => {
    const store = fakeStore();
    expect([0, 1, 2, 3, 4].map(() => readAndAdvanceFrame(store, 'session-a'))).toEqual([
      0, 1, 2, 3, 4,
    ]);
  });

  it('keeps each session on its own independent counter', () => {
    const store = fakeStore();
    readAndAdvanceFrame(store, 'session-a');
    readAndAdvanceFrame(store, 'session-a');
    expect(readAndAdvanceFrame(store, 'session-b')).toBe(0);
    expect(readAndAdvanceFrame(store, 'session-a')).toBe(2);
  });

  it('self-heals from a corrupt stored counter, restarting at 0', () => {
    const store = fakeStore();
    store.write('session-c', 'garbage');
    expect(readAndAdvanceFrame(store, 'session-c')).toBe(0);
    expect(readAndAdvanceFrame(store, 'session-c')).toBe(1);
  });
});

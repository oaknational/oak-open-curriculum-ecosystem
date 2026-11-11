import { describe, expect, it } from 'vitest';

import { pushWithRetry, type PushAttempt } from './push-attempts.js';

/**
 * The bounded retry over a run of attempts, with its policy injected. Which
 * attempt GitHub refuses is the fake's answer to the attempt number the retry
 * passes, 1-based, which is the retry's contract with its attempt: a
 * parametric fake over contract data, pre-flagged on its pull request. Each run
 * reads only what the retry returns and writes. The schedule's own values are
 * configuration, guaranteed by `PUSH_RETRY_WAITS_MS`, and never pinned here.
 */

const REFUSED: PushAttempt = { kind: 'refused' };
const PUSHED: PushAttempt = { kind: 'ended', exit: 0 };

/** Two waits, so three attempts in all. */
const WAITS_MS: readonly number[] = [1, 1];

/** A retry over the injected waits, an instant sleep and a stderr record. */
function retrying(attempt: (attemptNumber: number) => Promise<PushAttempt>): {
  readonly exit: Promise<number>;
  readonly text: () => string;
} {
  let text = '';
  const exit = pushWithRetry(attempt, {
    waitsMs: WAITS_MS,
    sleep: () => Promise.resolve(),
    stderr: {
      write: (chunk: string) => {
        text += chunk;
        return true;
      },
    },
  });
  return { exit, text: () => text };
}

/** Attempts GitHub refuses up to and including `last`, then pushes. */
function refusedThrough(last: number): (attemptNumber: number) => Promise<PushAttempt> {
  return (attemptNumber) => Promise.resolve(attemptNumber <= last ? REFUSED : PUSHED);
}

describe('pushWithRetry', () => {
  it.each([0, WAITS_MS.length])(
    'returns the push that went through after %i refusals the schedule allows',
    async (refusals) => {
      await expect(retrying(refusedThrough(refusals)).exit).resolves.toBe(0);
    },
  );

  it('stops once every attempt the schedule allows was refused, though the next would push', async () => {
    const run = retrying(refusedThrough(WAITS_MS.length + 1));

    await expect(run.exit).resolves.toBe(1);
    expect(run.text()).toContain('nothing was pushed');
  });

  it('asks for each injected wait in turn, and names each retry with its wait', async () => {
    const waited: number[] = [];
    let text = '';
    const exit = await pushWithRetry(() => Promise.resolve(REFUSED), {
      waitsMs: [5_000, 7_000],
      sleep: (ms) => {
        waited.push(ms);
        return Promise.resolve();
      },
      stderr: {
        write: (chunk: string) => {
          text += chunk;
          return true;
        },
      },
    });

    expect(exit).toBe(1);
    expect(waited).toEqual([5_000, 7_000]);
    const [first = '', second = '', last = '', ...more] = text.trimEnd().split('\n');
    expect(first).toContain('1 of 3');
    expect(first).toContain('5 s');
    expect(second).toContain('2 of 3');
    expect(second).toContain('7 s');
    expect(last).toContain('nothing was pushed');
    expect(more).toEqual([]);
  });

  it('returns any other failure at once, trying nothing again', async () => {
    const run = retrying(() => Promise.resolve({ kind: 'ended', exit: 7 }));

    await expect(run.exit).resolves.toBe(7);
    expect(run.text()).toBe('');
  });
});

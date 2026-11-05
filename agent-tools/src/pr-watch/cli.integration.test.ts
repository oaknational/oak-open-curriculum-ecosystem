import { describe, expect, it } from 'vitest';

import { runPrWatchCli } from './cli.js';
import type { PrSnapshot } from './index.js';

function makeSnapshot(overrides: Partial<PrSnapshot> = {}): PrSnapshot {
  return {
    number: 221,
    state: 'OPEN',
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'CLEAN',
    reviewDecision: '',
    headRefOid: '20d61cb74d4c9cffdcd536d11992be960756f800',
    checks: { total: 1, passed: 1, failed: 0, pending: 0 },
    reviewComments: [],
    issueComments: [],
    reviewThreads: { total: 1, unresolved: 0 },
    ...overrides,
  };
}

function capture(): {
  out: () => string;
  err: () => string;
  stdout: { write(s: string): boolean };
  stderr: { write(s: string): boolean };
} {
  let outText = '';
  let errText = '';
  return {
    out: () => outText,
    err: () => errText,
    stdout: {
      write: (s: string) => {
        outText += s;
        return true;
      },
    },
    stderr: {
      write: (s: string) => {
        errText += s;
        return true;
      },
    },
  };
}

const noSleep = (): Promise<void> => Promise.resolve();

/** A snapshot reader that answers the given snapshots in turn and then holds the last. */
function sequenceReader(snapshots: readonly PrSnapshot[]): () => PrSnapshot {
  let index = 0;
  return () => {
    const snapshot = snapshots[Math.min(index, snapshots.length - 1)];
    index += 1;
    return snapshot;
  };
}

describe('runPrWatchCli — one-shot', () => {
  it('prints the formatted snapshot line for a PR number', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221'],
      stdout: io.stdout,
      stderr: io.stderr,
      readSnapshot: () => makeSnapshot(),
    });
    expect(code).toBe(0);
    expect(io.out()).toContain('PR #221 OPEN');
    expect(io.out()).toContain('checks 1✓ 0✗ 0⋯');
  });

  it('prints structured JSON with --json', async () => {
    const io = capture();
    await runPrWatchCli({
      args: ['221', '--json'],
      stdout: io.stdout,
      stderr: io.stderr,
      readSnapshot: () => makeSnapshot(),
    });
    expect(JSON.parse(io.out())).toMatchObject({ number: 221, state: 'OPEN' });
  });

  it('reports the PR that the URL positional names', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['https://github.com/o/r/pull/7'],
      stdout: io.stdout,
      stderr: io.stderr,
      readSnapshot: (target) => makeSnapshot({ number: target.number }),
    });
    expect(code).toBe(0);
    expect(io.out()).toContain('PR #7');
  });

  it('rejects an invalid PR identifier with a non-zero exit and stderr message', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['--repo', 'o/r', 'not-a-pr'],
      stdout: io.stdout,
      stderr: io.stderr,
      readSnapshot: () => makeSnapshot(),
    });
    expect(code).toBe(2);
    expect(io.err()).toMatch(/Invalid PR identifier/u);
  });

  it('prints usage for --help and exits 0', async () => {
    const io = capture();
    const code = await runPrWatchCli({ args: ['--help'], stdout: io.stdout, stderr: io.stderr });
    expect(code).toBe(0);
    expect(io.out()).toContain('pr-watch <pr-number');
  });
});

describe('runPrWatchCli — watch', () => {
  // Waiting-state snapshots keep one check pending: an all-green open PR is
  // itself a watch exit since the all-green standardisation.
  const waiting = { checks: { total: 1, passed: 0, failed: 0, pending: 1 } };

  it('emits the initial snapshot, change lines, and ends on a terminal state', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: sequenceReader([
        makeSnapshot(waiting),
        makeSnapshot({ ...waiting, mergeStateStatus: 'BLOCKED' }),
        makeSnapshot({ ...waiting, state: 'MERGED', mergeStateStatus: 'BLOCKED' }),
      ]),
    });
    expect(code).toBe(0);
    const out = io.out();
    expect(out).toContain('mergeStateStatus: CLEAN → BLOCKED');
    expect(out).toContain('state: OPEN → MERGED');
    expect(out).toContain('MERGED — watch ending');
  });

  it('emits a line naming the author of a new review comment during watch', async () => {
    const io = capture();
    await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: sequenceReader([
        makeSnapshot(waiting),
        makeSnapshot({ ...waiting, reviewComments: [{ id: '9', author: 'bugbot' }] }),
        makeSnapshot({
          ...waiting,
          state: 'CLOSED',
          reviewComments: [{ id: '9', author: 'bugbot' }],
        }),
      ]),
    });
    expect(io.out()).toContain('new review comment from bugbot');
    expect(io.out()).toContain('CLOSED — watch ending');
  });

  it('emits a change line when a review thread becomes unresolved with nothing else changing', async () => {
    // The REST-blind error class this surface exists to kill: no new comment, no check
    // change — only a thread flipping to unresolved must still wake the reader.
    const io = capture();
    await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: sequenceReader([
        makeSnapshot({ reviewThreads: { total: 2, unresolved: 1 } }),
        makeSnapshot({ reviewThreads: { total: 2, unresolved: 2 } }),
        makeSnapshot({ state: 'CLOSED', reviewThreads: { total: 2, unresolved: 2 } }),
      ]),
    });
    expect(io.out()).toContain('unresolved threads: 1/2 → 2/2');
  });

  it('stops at max-polls when the PR never reaches a terminal state', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch', '--max-polls', '2'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot(waiting),
    });
    expect(code).toBe(0);
    expect(io.out()).toMatch(/max polls \(2\) reached/u);
  });

  it('exits 2 and writes stderr when the snapshot reader throws during a poll', async () => {
    const io = capture();
    let calls = 0;
    const code = await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => {
        calls += 1;
        if (calls === 1) {
          return makeSnapshot(waiting);
        }
        throw new Error('gh: token expired');
      },
    });
    expect(code).toBe(2);
    expect(io.err()).toContain('gh: token expired');
  });

  it('emits nothing between the initial snapshot and the max-polls line when unchanged', async () => {
    const io = capture();
    await runPrWatchCli({
      args: ['221', '--watch', '--max-polls', '3'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot(waiting),
    });
    const lines = io.out().split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('PR #221');
    expect(lines[1]).toMatch(/max polls \(3\) reached/u);
  });

  it('ends the watch when the initial snapshot is already all green (checks + threads)', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot(),
    });
    expect(code).toBe(0);
    expect(io.out()).toContain('all green');
    expect(io.out()).toContain('watch ending');
  });

  it('ends the watch when a poll turns all green', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: sequenceReader([
        makeSnapshot({ checks: { total: 1, passed: 0, failed: 0, pending: 1 } }),
        makeSnapshot(),
      ]),
    });
    expect(code).toBe(0);
    expect(io.out()).toContain('checks: 0✓ 0✗ 1⋯ → 1✓ 0✗ 0⋯');
    expect(io.out()).toContain('all green');
  });

  it('keeps watching on green checks while review threads stay unresolved', async () => {
    // The standardisation this exit exists for: 'green' REQUIRES thread
    // resolution — passing checks alone must not end the watch.
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch', '--max-polls', '2'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot({ reviewThreads: { total: 2, unresolved: 1 } }),
    });
    expect(code).toBe(0);
    expect(io.out()).not.toContain('all green');
    expect(io.out()).toMatch(/max polls \(2\) reached/u);
  });

  it('never treats a zero-check PR as all green', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch', '--max-polls', '2'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot({ checks: { total: 0, passed: 0, failed: 0, pending: 0 } }),
    });
    expect(code).toBe(0);
    expect(io.out()).not.toContain('all green');
    expect(io.out()).toMatch(/max polls \(2\) reached/u);
  });

  it('rejects a non-positive --interval', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch', '--interval', '0'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot(),
    });
    expect(code).toBe(2);
    expect(io.err()).toMatch(/--interval requires a positive integer/u);
  });
});

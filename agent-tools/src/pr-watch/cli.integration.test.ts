import { describe, expect, it } from 'vitest';

import { runPrWatchCli } from './cli.js';
import type { PrSnapshot } from './index.js';
import type { PrTarget } from './gh.js';

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

  it('passes the parsed target and gh path through to the reader', async () => {
    const io = capture();
    const seen: { target?: PrTarget; ghPath?: string } = {};
    await runPrWatchCli({
      args: ['https://github.com/o/r/pull/7', '--gh', '/x/gh'],
      stdout: io.stdout,
      stderr: io.stderr,
      readSnapshot: (target, ghPath) => {
        seen.target = target;
        seen.ghPath = ghPath;
        return makeSnapshot({ number: 7 });
      },
    });
    expect(seen.target).toStrictEqual({ number: 7, repo: 'o/r' });
    expect(seen.ghPath).toBe('/x/gh');
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
  function sequenceReader(snapshots: readonly PrSnapshot[]): () => PrSnapshot {
    let index = 0;
    return () => {
      const snapshot = snapshots[Math.min(index, snapshots.length - 1)];
      index += 1;
      return snapshot;
    };
  }

  it('emits the initial snapshot, change lines, and ends on a terminal state', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: sequenceReader([
        makeSnapshot(),
        makeSnapshot({ mergeStateStatus: 'BLOCKED' }),
        makeSnapshot({ state: 'MERGED', mergeStateStatus: 'BLOCKED' }),
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
        makeSnapshot(),
        makeSnapshot({ reviewComments: [{ id: '9', author: 'bugbot' }] }),
        makeSnapshot({ state: 'CLOSED', reviewComments: [{ id: '9', author: 'bugbot' }] }),
      ]),
    });
    expect(io.out()).toContain('new review comment from bugbot');
    expect(io.out()).toContain('CLOSED — watch ending');
  });

  it('stops at max-polls when the PR never reaches a terminal state', async () => {
    const io = capture();
    const code = await runPrWatchCli({
      args: ['221', '--watch', '--max-polls', '2'],
      stdout: io.stdout,
      stderr: io.stderr,
      sleep: noSleep,
      readSnapshot: () => makeSnapshot(),
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
          return makeSnapshot();
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
      readSnapshot: () => makeSnapshot(),
    });
    const lines = io.out().split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('PR #221');
    expect(lines[1]).toMatch(/max polls \(3\) reached/u);
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

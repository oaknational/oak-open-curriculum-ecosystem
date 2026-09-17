import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { PrStateReading } from '../pr-watch/state-types.js';
import { runMergeBotCli, type MergeBotCliInput } from './cli.js';
import { ReadingUnavailableError } from './merge.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { settledReading } from './test-helpers/pr-state-reading.js';

import { generateKeyPairSync } from 'node:crypto';

/**
 * The `merge-bot merge` front door over injected seams (fetch, key, config,
 * reading, sleep, clocks): exit map (0=merged, 1=operational, 2=usage,
 * 3=typed refusal — MERGED exits 3), the bounded poll loop under ONE minted
 * token, and the two review pins: the minted token appears in NEITHER
 * output stream on any path (A7), and the pr-lifecycle merge-base deletion
 * sweep is named as undischarged (A6). The pure argv contract lives in
 * merge-args.unit.test.ts.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const TOKEN = 'sekrit-installation-token';

function runningChecksReading(): PrStateReading {
  return settledReading({
    checks: { total: 3, passed: 2, failed: 0, pending: 1 },
    namedChecks: [{ name: 'e2e', bucket: 'pending' }],
    checksGreenAt: null,
  });
}

function capture(): { text: () => string; sink: Pick<NodeJS.WriteStream, 'write'> } {
  let buffer = '';
  return {
    text: () => buffer,
    sink: {
      write(chunk: string): boolean {
        buffer += chunk;
        return true;
      },
    },
  };
}

/** Serves mint, repo-settings, and merge endpoints; records every call URL and body. */
function mergeFetch(
  input: { mergeStatus?: number; mergeBody?: unknown; tokenExpiresAt?: string } = {},
): {
  fetchImpl: GithubApiFetch;
  urls: string[];
  bodies: { url: string; body: string }[];
} {
  const urls: string[] = [];
  const bodies: { url: string; body: string }[] = [];
  const fetchImpl: GithubApiFetch = (url, init) => {
    urls.push(url);
    if (init?.body !== undefined) {
      bodies.push({ url, body: String(init.body) });
    }
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    if (url.endsWith('/access_tokens')) {
      return Promise.resolve({
        status: 201,
        json: () =>
          Promise.resolve({
            token: TOKEN,
            expires_at: input.tokenExpiresAt ?? '2026-08-06T10:00:00Z',
          }),
      });
    }
    if (url.endsWith('/pulls/42/merge')) {
      return Promise.resolve({
        status: input.mergeStatus ?? 200,
        json: () => Promise.resolve(input.mergeBody ?? { merged: true, sha: 'mergesha1' }),
      });
    }
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ allow_merge_commit: true }),
    });
  };
  return { fetchImpl, urls, bodies };
}

function runMerge(input: {
  readonly args: readonly string[];
  /** Non-empty: the LAST reading repeats once the queue drains. */
  readonly readings: readonly [PrStateReading, ...PrStateReading[]];
  readonly fetch?: ReturnType<typeof mergeFetch>;
  readonly overrides?: Partial<MergeBotCliInput>;
}): {
  exit: Promise<number>;
  out: () => string;
  errText: () => string;
  sleeps: number[];
  expectSeen: (readonly string[])[];
  urls: string[];
  bodies: { url: string; body: string }[];
} {
  const out = capture();
  const errSink = capture();
  const sleeps: number[] = [];
  const expectSeen: (readonly string[])[] = [];
  const { fetchImpl, urls, bodies } = input.fetch ?? mergeFetch();
  const readings = [...input.readings];
  const exit = runMergeBotCli({
    args: ['merge', ...input.args],
    env: { HOME: '/test-home' },
    stdout: out.sink,
    stderr: errSink.sink,
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: '/repo',
    nowEpochSeconds: () => 1_800_000_000,
    readReadingImpl: (options) => {
      expectSeen.push(options.expectedReviewers ?? []);
      const next = readings.length > 1 ? readings.shift() : readings[0];
      return ok(next ?? input.readings[0]);
    },
    sleepImpl: (ms) => {
      sleeps.push(ms);
      return Promise.resolve();
    },
    nowIsoImpl: () => '2026-08-06T09:00:00Z',
    ...input.overrides,
  });
  return { exit, out: out.text, errText: errSink.text, sleeps, expectSeen, urls, bodies };
}

const EXPECT_ARGS = ['--pr', '42', '--expect', 'copilot-pull-request-reviewer'] as const;

describe('runMergeBotCli merge', () => {
  it('merges a settled PR: exit 0, sha on stdout, sweep note and grounds on stderr, token in neither stream', async () => {
    const run = runMerge({ args: [...EXPECT_ARGS], readings: [settledReading()] });

    expect(await run.exit).toBe(0);
    expect(run.out()).toContain('mergesha1');
    expect(
      run.errText(),
      'A6 sentinel: re-adjudicate amendment A6 before changing the sweep note',
    ).toContain('merge-base deletion sweep');
    expect(run.errText()).toContain('NOT discharged');
    // The irreversible act discloses its grounds (security H3): the verdict
    // evidence prints, so "merged with nobody having reviewed" can never be
    // silent.
    expect(run.errText()).toContain('every expected reviewer leg settled');
    expect(run.out()).not.toContain(TOKEN);
    expect(run.errText()).not.toContain(TOKEN);
  });

  it('mints the merge-only scope — never workflows write (security D3)', async () => {
    const run = runMerge({ args: [...EXPECT_ARGS], readings: [settledReading()] });

    expect(await run.exit).toBe(0);
    const mint = run.bodies.find((call) => call.url.endsWith('/access_tokens'));
    expect(mint).toBeDefined();
    expect(JSON.parse(mint?.body ?? '{}').permissions).toEqual({
      pull_requests: 'write',
      contents: 'write',
    });
  });

  it('passes the declared --expect set through to the reading', async () => {
    const run = runMerge({
      args: ['--pr', '42', '--expect', 'rev-a', '--expect', 'rev-b'],
      readings: [settledReading()],
    });

    await run.exit;
    expect(run.expectSeen[0]).toEqual(['rev-a', 'rev-b']);
  });

  it('emits the structured outcome with its grounds under --json', async () => {
    const run = runMerge({ args: [...EXPECT_ARGS, '--json'], readings: [settledReading()] });

    expect(await run.exit).toBe(0);
    const outcome: unknown = JSON.parse(run.out());
    expect(outcome).toMatchObject({ kind: 'merged', sha: 'mergesha1' });
    expect(JSON.stringify(outcome)).toContain('every expected reviewer leg settled');
  });

  it('refuses a non-wait verdict immediately: exit 3, verdict named, no sleep', async () => {
    const red = settledReading({
      checks: { total: 3, passed: 2, failed: 1, pending: 0 },
      namedChecks: [{ name: 'lint', bucket: 'failed' }],
      checksGreenAt: null,
    });
    const run = runMerge({ args: [...EXPECT_ARGS], readings: [red] });

    expect(await run.exit).toBe(3);
    expect(run.errText()).toContain('CHECKS-RED');
    expect(run.sleeps).toEqual([]);
    expect(run.errText()).not.toContain(TOKEN);
    expect(run.out()).not.toContain(TOKEN);
  });

  it('exits 3 on MERGED — another actor merging is never this invocation succeeding', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading({ state: 'MERGED' })],
    });

    expect(await run.exit).toBe(3);
    expect(run.errText()).toContain('another');
  });

  it('polls through a wait verdict under ONE minted token, then merges', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [runningChecksReading(), settledReading()],
    });

    expect(await run.exit).toBe(0);
    expect(run.sleeps).toEqual([30_000]);
    expect(run.out()).toContain('CHECKS-RUNNING');
    expect(run.urls.filter((url) => url.endsWith('/access_tokens'))).toHaveLength(1);
  });

  it('keeps --json stdout pure on a polled run: progress to stderr, outcome alone on stdout', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS, '--json'],
      readings: [runningChecksReading(), settledReading()],
    });

    expect(await run.exit).toBe(0);
    expect(JSON.parse(run.out())).toMatchObject({ kind: 'merged', sha: 'mergesha1' });
    expect(run.errText()).toContain('poll 1/');
  });

  it('exhausts the poll budget on a persistent wait verdict as a typed refusal', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS, '--max-polls', '2'],
      readings: [runningChecksReading()],
    });

    expect(await run.exit).toBe(3);
    expect(run.sleeps).toHaveLength(1);
    expect(run.errText()).toContain('CHECKS-RUNNING');
  });

  it('stops at the WALL-CLOCK deadline rather than firing a merge call that could straddle token expiry', async () => {
    // The parse-time budget counts only SLEEP; request time is unbounded, so
    // a slow round of reads can carry the final PUT past the token hour. The
    // deadline comes from the MINTED token's own expiry (10:00) less a
    // five-minute margin, and the clock reaches 09:56 on the second poll.
    const clock = ['2026-08-06T09:00:00Z', '2026-08-06T09:56:00Z'];
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [runningChecksReading(), settledReading()],
      overrides: { nowIsoImpl: () => clock.shift() ?? '2026-08-06T09:56:00Z' },
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('2026-08-06T09:55:00.000Z');
    expect(run.errText()).toContain('2026-08-06T10:00:00Z');
    expect(run.urls.filter((url) => url.endsWith('/pulls/42/merge'))).toHaveLength(0);
  });

  it('applies the deadline on the FIRST iteration — a token already inside its margin never acts', async () => {
    // R5: the margin check binds every iteration INCLUDING THE FIRST. A
    // settled reading is supplied deliberately: the only thing standing
    // between it and an irreversible merge PUT is the first-poll deadline
    // check, so guarding it from poll 2 onwards left a token already inside
    // its expiry margin free to merge on the reading it opened with.
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading()],
      overrides: { nowIsoImpl: () => '2026-08-06T09:56:00Z' },
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('2026-08-06T09:55:00.000Z');
    expect(run.urls.filter((url) => url.endsWith('/pulls/42/merge'))).toHaveLength(0);
    // Not one sleep: the run stops before the loop ever comes round.
    expect(run.sleeps).toEqual([]);
  });

  it('refuses to poll at all when the minted token expiry is unparseable — no deadline, no merge call', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading()],
      fetch: mergeFetch({ tokenExpiresAt: 'whenever' }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('whenever');
    expect(run.urls.filter((url) => url.endsWith('/pulls/42/merge'))).toHaveLength(0);
  });

  it('reports a refusal machine-readably under --json', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS, '--json'],
      readings: [settledReading({ isDraft: true })],
    });

    expect(await run.exit).toBe(3);
    const outcome: unknown = JSON.parse(run.out());
    expect(outcome).toMatchObject({ kind: 'refused', verdictState: 'DRAFT' });
    // A7 holds on the one refusal path whose stdout carries a serialised
    // product object — any future outcome field bearing token material would
    // leak exactly here.
    expect(run.out()).not.toContain(TOKEN);
    expect(run.errText()).not.toContain(TOKEN);
  });

  it('fails fast on a FIRST-poll reading failure — a broken environment never burns the budget', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading()],
      overrides: {
        readReadingImpl: () => err(new ReadingUnavailableError('gh not found')),
      },
    });

    expect(await run.exit).toBe(1);
    expect(run.sleeps).toEqual([]);
    expect(run.errText()).toContain('gh not found');
  });

  it('retries a TRANSIENT reading failure within the budget after a working first poll', async () => {
    const sequence = [
      ok(runningChecksReading()),
      err(new ReadingUnavailableError('mergeable UNKNOWN — transient')),
      ok(settledReading()),
    ];
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading()],
      overrides: {
        readReadingImpl: () => sequence.shift() ?? ok(settledReading()),
      },
    });

    expect(await run.exit).toBe(0);
    expect(run.sleeps).toHaveLength(2);
    expect(run.out()).toContain('reading unavailable');
  });

  it('surfaces a moved tip as an operational failure without leaking the token', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading()],
      fetch: mergeFetch({ mergeStatus: 409, mergeBody: { message: 'Head branch was modified.' } }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('409');
    expect(run.out()).not.toContain(TOKEN);
    expect(run.errText()).not.toContain(TOKEN);
  });

  it('rejects a missing --expect as a usage error before any call', async () => {
    const run = runMerge({ args: ['--pr', '42'], readings: [settledReading()] });

    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('--expect');
    expect(run.urls).toEqual([]);
  });

  it('fails as usage when the repo config authority is unreadable', async () => {
    const run = runMerge({
      args: [...EXPECT_ARGS],
      readings: [settledReading()],
      overrides: {
        // An unparseable authority file fails the same authority-naming path
        // as an unreadable one, without a thrown fixture.
        readConfigFileImpl: () => 'not-json',
      },
    });

    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('single authority');
  });

  it('answers merge --help with the usage on stdout, exit 0 — never the unknown-flag path', async () => {
    const run = runMerge({ args: ['--help'], readings: [settledReading()] });

    expect(await run.exit).toBe(0);
    expect(run.out()).toContain('merge --pr');
    expect(run.out()).toContain('--expect declares');
    expect(run.urls).toEqual([]);
  });

  it('documents the merge action and the undischarged sweep in the usage text', async () => {
    const out = capture();
    const errSink = capture();
    const exit = runMergeBotCli({
      args: ['--help'],
      env: {},
      stdout: out.sink,
      stderr: errSink.sink,
    });

    expect(await exit).toBe(0);
    expect(out.text()).toContain('merge --pr');
    expect(
      out.text(),
      'A6 sentinel: re-adjudicate amendment A6 before removing the sweep from usage',
    ).toContain('merge-base deletion sweep');
  });
});

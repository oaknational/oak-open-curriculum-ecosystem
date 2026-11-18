import { generateKeyPairSync } from 'node:crypto';

import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { NO_CONTENT } from '../pr-watch/content-binding.js';
import { composeReading } from '../pr-watch/state-compose.js';
import { parseStateView } from '../pr-watch/state-fields.js';
import type { ReadPrStateOptions } from '../pr-watch/state-gh.js';
import { stateViewFixture } from '../pr-watch/state-view-fixture.js';
import { runMergeBotCli } from './cli.js';
import type { GithubApiFetch } from './mint-installation-token.js';

/**
 * `merge-bot merge --unavailable <reviewer>=<comment-url>`: the door reads
 * the declaration through pr-watch's composition, with the bot's login from
 * the clone's config and each poll's clock, and merges on the stand-in or
 * refuses the declaration at once. Only gh and the network are absent; the
 * port also serves the base ref and the branch rules the door proves a
 * GitHub App's settled merge against (the fixture's tip reports
 * `run-quality-gates` green).
 */

/** The base branch's one required context, reported green on the fixture's tip. */
const RULES = [
  {
    type: 'required_status_checks',
    parameters: { required_status_checks: [{ context: 'run-quality-gates' }] },
  },
];

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const BOT = 'jimbot-oakington-iii';
const COPILOT = 'copilot-pull-request-reviewer';
const HEAD = 'f'.repeat(40);
const URL = 'https://github.com/acme/widgets/pull/42#issuecomment-1';
const COPILOT_ERROR =
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.';

const fetchImpl: GithubApiFetch = (url) => {
  const responses: Readonly<Record<string, { status: number; body: unknown }>> = {
    installation: { status: 200, body: { id: 55 } },
    access_tokens: { status: 201, body: { token: 'minted', expires_at: '2026-08-06T10:00:00Z' } },
    merge: { status: 200, body: { merged: true, sha: 'mergesha1' } },
    '42': { status: 200, body: { base: { ref: 'main' } } },
  };
  const rules = url.includes('/rules/branches/main') ? { status: 200, body: RULES } : undefined;
  const response = rules ??
    responses[url.split('/').at(-1) ?? ''] ?? { status: 200, body: { allow_merge_commit: true } };
  return Promise.resolve({ status: response.status, json: () => Promise.resolve(response.body) });
};

function reading(author: string) {
  return (options: ReadPrStateOptions) =>
    ok(
      composeReading({
        view: { ...parseStateView(stateViewFixture()), number: 42 },
        comments: [
          {
            id: 'IC_1',
            url: URL,
            author,
            body: `**${COPILOT} leg unavailable on head SHA:${HEAD}.**`,
            createdAt: '2026-07-21T12:00:00Z',
            lastEdit: null,
          },
        ],
        commits: [HEAD],
        reviewConfiguration: { kind: 'unread', reason: 'the test reading declares none' },
        requests: [],
        reviewThreads: { total: 0, unresolved: 0 },
        reviews: [
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: COPILOT_ERROR,
            commitOid: HEAD,
            submittedAt: '2026-07-21T11:50:00Z',
          },
        ],
        reviewRuns: { kind: 'read', runs: [] },
        declared: options.expectedReviewers ?? null,
        unavailable: options.unavailable,
        readContent: () => NO_CONTENT,
      }),
    );
}

function sink() {
  let text = '';
  return {
    text: () => text,
    write(chunk: string): boolean {
      text += chunk;
      return true;
    },
  };
}

async function door(commentAuthor: string) {
  const stdout = sink();
  const stderr = sink();
  const exit = await runMergeBotCli({
    args: ['merge', '--pr', '42', '--expect', COPILOT, '--unavailable', `${COPILOT}=${URL}`],
    env: { HOME: '/test-home' },
    stdout,
    stderr,
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: BOT, appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: '/repo',
    runGitImpl: () => 'worktree /repo\n',
    nowEpochSeconds: () => 1_800_000_000,
    readReadingImpl: reading(commentAuthor),
    sleepImpl: () => Promise.resolve(),
    nowIsoImpl: () => '2026-08-06T09:00:00Z',
  });
  return { exit, stdout: stdout.text(), stderr: stderr.text() };
}

describe('merge-bot merge --unavailable', () => {
  it("merges on the bot's declaration after the vendor's error review, and records the stand-in", async () => {
    const run = await door(BOT);

    expect(run.exit).toBe(0);
    expect(run.stdout).toContain('mergesha1');
    expect(run.stderr).toContain(
      `${COPILOT}: declared unavailable at 2026-07-21T12:00:00Z by ${URL} (proof: error-review at 2026-07-21T11:50:00Z) read as a review of the tip (transport: declared-stand-in)`,
    );
  });

  it('refuses at once a declaration another account posted', async () => {
    const run = await door('another-account');

    expect(run.exit).toBe(3);
    expect(run.stderr).toContain('UNCLASSIFIED-EVIDENCE');
    expect(run.stderr).toContain(
      `${COPILOT}: unavailability declaration ${URL} refused — was posted by an account other than the bot`,
    );
  });
});

import { describe, expect, it } from 'vitest';

import { runMergeExecution } from './merge.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { makeInput } from './test-helpers/merge-execution-input.js';
import { settledReading } from './test-helpers/pr-state-reading.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * A merge with no review, on the caller's stated reason, over injected
 * ports (no process, no network). What is proven: the reason is posted on
 * the pull request BEFORE the merge call, a failed post stops the merge,
 * the merged outcome says the merge had no review, and a pull request that
 * has a review is merged as reviewed with nothing posted.
 */

const REASON = 'Records only: one date in one plan.';

/** Green on everything, reviewed by nobody, nobody asked. */
const unreviewed = (): ReturnType<typeof settledReading> =>
  settledReading({ author: 'a-person', expectedReviewers: [], reviews: [] });

const COMMENT = 'POST /issues/42/comments';
const MERGE = 'PUT /pulls/42/merge';
const REPO_URL = 'https://api.github.com/repos/acme/widgets';

/** The base branch's rules, requiring two contexts by name. */
const RULES = [
  {
    type: 'required_status_checks',
    parameters: {
      required_status_checks: [{ context: 'run-quality-gates' }, { context: 'CodeQL' }],
    },
  },
];

/** What the port answers one URL with, given the statuses a case sets. */
function answerFor(
  url: string,
  statuses: { readonly comment: number; readonly merge: number },
): { status: number; body: unknown } {
  if (url.endsWith('/issues/42/comments')) {
    return statuses.comment === 201
      ? { status: 201, body: { id: 9100, html_url: 'https://example.invalid/pull/42#c9100' } }
      : { status: statuses.comment, body: { message: 'boom' } };
  }
  if (url.endsWith('/pulls/42/merge')) {
    return statuses.merge === 200
      ? { status: 200, body: { merged: true, sha: 'mergesha1' } }
      : { status: statuses.merge, body: { message: 'Head branch was modified' } };
  }
  if (url.endsWith('/pulls/42')) {
    return { status: 200, body: { base: { ref: 'main' } } };
  }
  if (url.includes('/rules/branches/main')) {
    return { status: 200, body: /[&?]page=1\b/u.test(url) ? RULES : [] };
  }
  return { status: 200, body: { allow_merge_commit: true } };
}

/** A fetch port recording each call's method and path in order, and each JSON body. */
function recordingFetch(statuses: { comment?: number; merge?: number } = {}): {
  fetchImpl: GithubApiFetch;
  lines: string[];
  bodyOf: (suffix: string) => unknown;
} {
  const lines: string[] = [];
  const bodies = new Map<string, unknown>();
  const fetchImpl: GithubApiFetch = (url, init) => {
    const [path = ''] = url.replace(REPO_URL, '').split('?');
    lines.push(`${init.method} ${path}`);
    if (init.body !== undefined) {
      bodies.set(url, JSON.parse(init.body));
    }
    const answer = answerFor(url, {
      comment: statuses.comment ?? 201,
      merge: statuses.merge ?? 200,
    });
    return Promise.resolve({ status: answer.status, json: () => Promise.resolve(answer.body) });
  };
  const bodyOf = (suffix: string): unknown =>
    [...bodies.entries()].find(([url]) => url.endsWith(suffix))?.[1];
  return { fetchImpl, lines, bodyOf };
}

/** The verdict a refusal fired on, or a string no assertion expects. */
function refusedOn(outcome: Awaited<ReturnType<typeof runMergeExecution>>): string {
  if (!outcome.ok) {
    return `(failed: ${outcome.error.message})`;
  }
  return outcome.value.kind === 'refused' ? outcome.value.verdictState : '(merged)';
}

describe('runMergeExecution, a merge with no review', () => {
  it('posts the reason on the pull request, then merges, and says so in the outcome', async () => {
    const github = recordingFetch();

    const outcome = await runMergeExecution(
      makeInput(unreviewed(), github.fetchImpl, { noReviewReason: REASON }),
    );

    expect(outcome).toMatchObject({ ok: true, value: { kind: 'merged', sha: 'mergesha1' } });
    const comment = github.lines.indexOf('POST /issues/42/comments');
    const merge = github.lines.indexOf('PUT /pulls/42/merge');
    expect(comment).toBeGreaterThanOrEqual(0);
    expect(merge).toBeGreaterThan(comment);
    expect(JSON.stringify(github.bodyOf('/issues/42/comments'))).toContain(REASON);
    expect(JSON.stringify(outcome)).toContain('merged with no review');
    expect(JSON.stringify(outcome)).toContain('9100');
  });

  it('refuses the same pull request with no reason given, posting and merging nothing', async () => {
    const github = recordingFetch();

    const outcome = await runMergeExecution(makeInput(unreviewed(), github.fetchImpl));

    expect(outcome).toMatchObject({
      ok: true,
      value: { kind: 'refused', verdictState: 'SILENT-WAIT-NO-REVIEWER' },
    });
    expect(github.lines).not.toContain('POST /issues/42/comments');
    expect(github.lines).not.toContain('PUT /pulls/42/merge');
  });

  it.each([
    {
      holds: 'a second reviewer owes a round nobody has requested',
      reading: settledReading({
        author: 'a-person',
        expectedReviewers: ['copilot-pull-request-reviewer', 'claude'],
        checksGreenAt: '2026-08-06T08:58:00Z',
      }),
      verdict: 'SILENT-WAIT-NO-REVIEWER',
    },
    {
      holds: 'a review run is in flight before anybody has reviewed',
      reading: settledReading({
        author: 'a-person',
        expectedReviewers: [],
        reviews: [],
        reviewRuns: {
          kind: 'read',
          runs: [
            { id: 'r1', name: 'review', createdAt: '2026-08-06T08:59:00Z', completedAt: null },
          ],
        },
      }),
      verdict: 'WAITING-REVIEW-RUN-LIVE',
    },
    {
      holds: 'a check is red',
      reading: settledReading({
        author: 'a-person',
        expectedReviewers: [],
        reviews: [],
        checks: { total: 3, passed: 2, failed: 1, pending: 0 },
        namedChecks: [{ name: 'lint', bucket: 'failed' }],
        checksGreenAt: null,
      }),
      verdict: 'CHECKS-RED',
    },
    {
      holds: 'the review runs could not be read, so a review may be running unseen',
      reading: settledReading({
        author: 'a-person',
        expectedReviewers: [],
        reviews: [],
        reviewRuns: { kind: 'unavailable', reason: 'the host has no run listing' },
      }),
      verdict: 'SILENT-WAIT-NO-REVIEWER',
    },
    {
      holds: 'the review-run listing is truncated, so a review may be running unseen',
      reading: settledReading({
        author: 'a-person',
        expectedReviewers: [],
        reviews: [],
        reviewRuns: { kind: 'read', runs: [], truncated: true },
      }),
      verdict: 'SILENT-WAIT-NO-REVIEWER',
    },
    {
      holds: 'a review thread is open',
      reading: settledReading({
        author: 'a-person',
        expectedReviewers: [],
        reviews: [],
        reviewThreads: { total: 2, unresolved: 1 },
      }),
      verdict: 'THREADS-OPEN',
    },
    {
      holds: 'the bot’s own pull request has a required context the tip has not reported',
      reading: settledReading({
        author: 'app/acme-bot',
        expectedReviewers: [],
        reviews: [],
        namedChecks: [{ name: 'CodeQL', bucket: 'passed' }],
        checks: { total: 1, passed: 1, failed: 0, pending: 0 },
      }),
      verdict: 'CHECKS-RUNNING',
    },
  ])(
    'refuses with a reason given while $holds, posting and merging nothing',
    async ({ reading, verdict }) => {
      const github = recordingFetch();

      const outcome = await runMergeExecution(
        makeInput(reading, github.fetchImpl, { noReviewReason: REASON }),
      );

      expect(refusedOn(outcome)).toBe(verdict);
      expect(github.lines).not.toContain(COMMENT);
      expect(github.lines).not.toContain(MERGE);
    },
  );

  it('reads no branch rules for the bot’s own pull request when a reviewer owes a round: the reason cannot apply', async () => {
    const github = recordingFetch();
    const reading = settledReading({
      author: 'app/acme-bot',
      expectedReviewers: ['copilot-pull-request-reviewer', 'claude'],
      checksGreenAt: '2026-08-06T08:58:00Z',
    });

    const outcome = await runMergeExecution(
      makeInput(reading, github.fetchImpl, { noReviewReason: REASON }),
    );

    expect(refusedOn(outcome)).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(github.lines).not.toContain('GET /rules/branches/main');
  });

  it('records that the pull request was not reviewed, which stays true if a person had been asked', async () => {
    const github = recordingFetch();

    await runMergeExecution(makeInput(unreviewed(), github.fetchImpl, { noReviewReason: REASON }));

    const body = JSON.stringify(github.bodyOf('/issues/42/comments'));
    expect(body).toContain('has not been reviewed');
    expect(body).not.toContain('No review was requested');
  });

  it('merges the bot’s own unreviewed pull request once every required context is green by name', async () => {
    const github = recordingFetch();
    const reading = settledReading({
      author: 'app/acme-bot',
      expectedReviewers: [],
      reviews: [],
      namedChecks: [
        { name: 'run-quality-gates', bucket: 'passed' },
        { name: 'CodeQL', bucket: 'passed' },
      ],
      checks: { total: 2, passed: 2, failed: 0, pending: 0 },
    });

    const outcome = await runMergeExecution(
      makeInput(reading, github.fetchImpl, { noReviewReason: REASON }),
    );

    expect(outcome).toMatchObject({ ok: true, value: { kind: 'merged' } });
    expect(github.lines).toContain('GET /rules/branches/main');
    expect(github.lines.indexOf(COMMENT)).toBeLessThan(github.lines.indexOf(MERGE));
  });

  it('fails, with the reason posted once, when the tip moved before the merge call', async () => {
    const github = recordingFetch({ merge: 409 });

    const outcome = await runMergeExecution(
      makeInput(unreviewed(), github.fetchImpl, { noReviewReason: REASON }),
    );

    expect(failureMessage(outcome)).toContain('409');
    expect(github.lines.filter((line) => line === COMMENT)).toHaveLength(1);
  });

  it('does not merge when the reason cannot be posted', async () => {
    const github = recordingFetch({ comment: 500 });

    const outcome = await runMergeExecution(
      makeInput(unreviewed(), github.fetchImpl, { noReviewReason: REASON }),
    );

    expect(failureMessage(outcome)).toContain('500');
    expect(github.lines).not.toContain('PUT /pulls/42/merge');
  });

  it('merges a reviewed pull request as reviewed, posting nothing, when a reason is also given', async () => {
    const github = recordingFetch();

    const outcome = await runMergeExecution(
      makeInput(settledReading(), github.fetchImpl, { noReviewReason: REASON }),
    );

    expect(outcome).toMatchObject({ ok: true, value: { kind: 'merged' } });
    expect(github.lines).not.toContain('POST /issues/42/comments');
    expect(JSON.stringify(outcome)).not.toContain('merged with no review');
  });
});

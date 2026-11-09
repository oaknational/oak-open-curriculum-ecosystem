import { describe, expect, it } from 'vitest';

import type { GhCommandExecutor } from '../../src/pr-watch/gh.js';
import { readLiveHarvest } from '../../src/review-cost/harvest.js';

/**
 * The live harvest reads every commit GitHub serves for a pull request, page by
 * page, so a pull request carrying more than one page of commits (a fork's
 * merge back carries thousands) is read instead of refused as truncated. The
 * gh seam is injected: no gh runs.
 */

interface CommitsPage {
  readonly hasNextPage: boolean;
  readonly endCursor: string | null;
  readonly oids: readonly string[];
}

const EMPTY = { pageInfo: { hasNextPage: false, endCursor: null }, nodes: [] };

const commits = (page: CommitsPage) => ({
  pageInfo: { hasNextPage: page.hasNextPage, endCursor: page.endCursor },
  nodes: page.oids.map((oid) => ({ commit: { oid, committedDate: '2026-11-09T12:00:00Z' } })),
});

const recording = (page: CommitsPage): string =>
  JSON.stringify({
    data: {
      repository: {
        pullRequest: {
          number: 1023,
          headRefOid: 'oid-c',
          baseRefName: 'main',
          body: '',
          baseRef: { target: { oid: 'base-tip' } },
          mergeCommit: null,
          commits: commits(page),
          reviewThreads: EMPTY,
          reviews: EMPTY,
          comments: EMPTY,
        },
      },
    },
  });

const commitPage = (page: CommitsPage): string =>
  JSON.stringify({ data: { repository: { pullRequest: { commits: commits(page) } } } });

/** A gh that answers each read by the cursor it asks after, as GitHub does; no cursor is the first read. */
const pagedGh =
  (responses: ReadonlyMap<string, string>): GhCommandExecutor =>
  (_file, args) =>
    responses.get(args.find((arg) => arg.startsWith('after='))?.slice('after='.length) ?? '') ?? '';

describe('readLiveHarvest', () => {
  it('reads every commit of a pull request whose history runs past one page', () => {
    const gh = pagedGh(
      new Map([
        ['', recording({ hasNextPage: true, endCursor: 'after-b', oids: ['oid-a', 'oid-b'] })],
        ['after-b', commitPage({ hasNextPage: false, endCursor: 'after-c', oids: ['oid-c'] })],
      ]),
    );

    const live = readLiveHarvest({ number: 1023, repo: 'oaknational/example', run: gh });

    expect(live.harvest.commits.map((commit) => commit.oid)).toStrictEqual([
      'oid-a',
      'oid-b',
      'oid-c',
    ]);
  });

  it('still refuses a history that never ends, rather than counting it short', () => {
    const gh = pagedGh(
      new Map([
        ['', recording({ hasNextPage: true, endCursor: 'again', oids: ['oid-a'] })],
        ['again', commitPage({ hasNextPage: true, endCursor: 'again', oids: ['oid-b'] })],
      ]),
    );

    expect(() => readLiveHarvest({ number: 1023, repo: 'oaknational/example', run: gh })).toThrow(
      /truncated recording/u,
    );
  });
});

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
  /** How many commits the pull request holds; GitHub serves at most its newest 250. */
  readonly totalCount: number;
}

const EMPTY = { pageInfo: { hasNextPage: false, endCursor: null }, nodes: [] };

const commits = (page: CommitsPage) => ({
  pageInfo: { hasNextPage: page.hasNextPage, endCursor: page.endCursor },
  totalCount: page.totalCount,
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
        [
          '',
          recording({
            hasNextPage: true,
            endCursor: 'after-b',
            oids: ['oid-a', 'oid-b'],
            totalCount: 3,
          }),
        ],
        [
          'after-b',
          commitPage({ hasNextPage: false, endCursor: 'after-c', oids: ['oid-c'], totalCount: 3 }),
        ],
      ]),
    );

    const live = readLiveHarvest({ number: 1023, repo: 'oaknational/example', run: gh });

    expect(live.harvest.commits.map((commit) => commit.oid)).toStrictEqual([
      'oid-a',
      'oid-b',
      'oid-c',
    ]);
    expect(live.commitsWindowed).toBe(false);
  });

  it('says the commit list is windowed when GitHub serves fewer commits than the pull request holds', () => {
    const gh = pagedGh(
      new Map([
        [
          '',
          recording({
            hasNextPage: false,
            endCursor: 'end',
            oids: ['oid-y', 'oid-z'],
            totalCount: 2583,
          }),
        ],
      ]),
    );

    expect(
      readLiveHarvest({ number: 1023, repo: 'oaknational/example', run: gh }).commitsWindowed,
    ).toBe(true);
  });

  it('still refuses a history that never ends, rather than counting it short', () => {
    const gh = pagedGh(
      new Map([
        ['', recording({ hasNextPage: true, endCursor: 'again', oids: ['oid-a'], totalCount: 9 })],
        [
          'again',
          commitPage({ hasNextPage: true, endCursor: 'again', oids: ['oid-b'], totalCount: 9 }),
        ],
      ]),
    );

    expect(() => readLiveHarvest({ number: 1023, repo: 'oaknational/example', run: gh })).toThrow(
      /truncated recording/u,
    );
  });

  it('refuses a next page that comes with no cursor to ask after', () => {
    const gh = pagedGh(
      new Map([
        ['', recording({ hasNextPage: true, endCursor: null, oids: ['oid-a'], totalCount: 9 })],
      ]),
    );

    expect(() => readLiveHarvest({ number: 1023, repo: 'oaknational/example', run: gh })).toThrow(
      /truncated recording/u,
    );
  });
});

import type { StateViewSeed } from '../state-view-fixture.js';

/**
 * The gh payloads the `readPrStateReading` integration suites answer with:
 * the view, the review threads, the commits, the reviews harvest, and the
 * dispatch of one `api graphql` call on the connection its query reads
 * (shapes mirror gh 2.x verified live 2026-07-21). One owner at the second
 * consumer (consolidate-at-second-consumer).
 */

export const HEAD = 'f'.repeat(40);
export const PR_URL = 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/461';

export function viewPayload(oid: string = HEAD, overrides: Partial<StateViewSeed> = {}): string {
  return JSON.stringify({
    number: 461,
    url: PR_URL,
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: oid,
    baseRefName: 'main',
    statusCheckRollup: [
      {
        __typename: 'CheckRun',
        name: 'secret-scan',
        status: 'COMPLETED',
        conclusion: 'SUCCESS',
        completedAt: '2026-07-21T10:33:35Z',
      },
    ],
    autoMergeRequest: null,
    reviewRequests: [{ __typename: 'User', login: 'jimCresswell' }],
    ...overrides,
  });
}

function threadsPayload(): string {
  return JSON.stringify([
    {
      data: {
        repository: {
          pullRequest: {
            reviewThreads: { totalCount: 2, nodes: [{ isResolved: true }, { isResolved: true }] },
          },
        },
      },
    },
  ]);
}

const commitsPayload = (): string =>
  JSON.stringify([
    { data: { repository: { pullRequest: { commits: { nodes: [{ commit: { oid: HEAD } }] } } } } },
  ]);

function reviewsPayload(): string {
  return JSON.stringify([
    {
      data: {
        repository: {
          pullRequest: {
            reviews: {
              nodes: [
                {
                  author: { login: 'copilot-pull-request-reviewer' },
                  state: 'COMMENTED',
                  body: 'Reviewed.',
                  submittedAt: '2026-07-21T12:00:00Z',
                  commit: { oid: HEAD },
                },
              ],
            },
          },
        },
      },
    },
  ]);
}

const emptyConnection = (connection: string): string =>
  JSON.stringify([{ data: { repository: { pullRequest: { [connection]: { nodes: [] } } } } }]);

// Each harvest query, by the connection it reads; any other query reads reviews.
const GRAPHQL_ANSWERS: readonly (readonly [string, () => string])[] = [
  ['reviewThreads', threadsPayload],
  ['comments(', () => emptyConnection('comments')],
  ['timelineItems(', () => emptyConnection('timelineItems')],
  ['commits(', commitsPayload],
];

export function graphqlPayload(query: string | undefined): string {
  const answer = GRAPHQL_ANSWERS.find(([marker]) => query?.includes(marker) === true);
  return answer === undefined ? reviewsPayload() : answer[1]();
}

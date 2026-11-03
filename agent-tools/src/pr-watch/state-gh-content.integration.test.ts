import { describe, expect, it } from 'vitest';

import { syntheticPatchId, textHasher } from './content-fixture.js';
import type { GhCommandExecutor } from './gh.js';
import { readPrStateReading } from './state-gh.js';
import type { StateViewSeed } from './state-view-fixture.js';

/**
 * The state reading carries the content leg: the base from the view, the
 * reviewed commits from both transports' harvests, each diff from the
 * compare endpoint. The fake gh answers the surfaces it models, by endpoint
 * and media type, and fails anything else; each fake diff is a patch-id's
 * text, which the fake hasher reads back. No real gh or git.
 */

const HEAD = 'f'.repeat(40);
const BEFORE_SYNC = 'e'.repeat(40);
const HEAD_PATCH = syntheticPatchId('1');
const BEFORE_PATCH = syntheticPatchId('2');
const CODEX = 'chatgpt-codex-connector';
const COPILOT = 'copilot-pull-request-reviewer';

const OPEN_VIEW: StateViewSeed = {
  number: 7,
  url: 'https://github.com/acme/widgets/pull/7',
  author: { login: 'app/el-graphael' },
  state: 'OPEN',
  isDraft: false,
  mergeable: 'MERGEABLE',
  mergeStateStatus: 'BLOCKED',
  headRefOid: HEAD,
  baseRefName: 'trunk',
  statusCheckRollup: [],
  autoMergeRequest: null,
  reviewRequests: [],
};

function page(connection: string, nodes: readonly unknown[]): string {
  return JSON.stringify([{ data: { repository: { pullRequest: { [connection]: { nodes } } } } }]);
}

const DIFFS = new Map([
  [`repos/acme/widgets/compare/refs/heads/trunk...${HEAD}`, `${HEAD_PATCH}\n`],
  [`repos/acme/widgets/compare/refs/heads/trunk...${BEFORE_SYNC}`, `${BEFORE_PATCH}\n`],
]);

interface Harvests {
  readonly reviews: readonly unknown[];
  readonly comments: readonly unknown[];
  readonly requests?: readonly unknown[];
}

function harvestFor(query: string, harvests: Harvests): string | undefined {
  if (query.includes('reviewThreads')) {
    return JSON.stringify([
      { data: { repository: { pullRequest: { reviewThreads: { totalCount: 0, nodes: [] } } } } },
    ]);
  }
  if (query.includes('comments(')) {
    return page('comments', harvests.comments);
  }
  if (query.includes('commits(')) {
    return page('commits', [{ commit: { oid: BEFORE_SYNC } }, { commit: { oid: HEAD } }]);
  }
  if (query.includes('timelineItems(')) {
    return page('timelineItems', harvests.requests ?? []);
  }
  return query.includes('reviews(') ? page('reviews', harvests.reviews) : undefined;
}

function github(harvests: Harvests, view: StateViewSeed): GhCommandExecutor {
  return (_file, args) => {
    const query = args.find((arg) => arg.startsWith('query='));
    const endpoint = args.find((arg) => arg.startsWith('repos/')) ?? '';
    let answer: string | undefined;
    switch (args[0]) {
      case 'pr':
        answer = JSON.stringify(view);
        break;
      case 'agent-task':
        answer = '[]';
        break;
      case 'api':
        answer =
          query === undefined
            ? args.includes('Accept: application/vnd.github.diff')
              ? DIFFS.get(endpoint)
              : undefined
            : harvestFor(query, harvests);
        break;
      default:
        answer = undefined;
    }
    if (answer === undefined) {
      throw new Error(`unexpected gh argv: ${args.join(' ')}`);
    }
    return answer;
  };
}

function reading(
  harvests: Harvests,
  expectedReviewers: readonly string[],
  view: StateViewSeed = OPEN_VIEW,
) {
  return readPrStateReading({
    target: { number: 7, repo: 'acme/widgets' },
    ghPath: '/usr/bin/gh',
    exists: () => true,
    execFileSync: github(harvests, view),
    expectedReviewers,
    patchIdOf: textHasher,
  });
}

describe('readPrStateReading — the content leg', () => {
  const review = {
    author: { login: COPILOT },
    state: 'COMMENTED',
    body: 'Reviewed.',
    submittedAt: '2026-07-21T12:00:00Z',
    commit: { oid: BEFORE_SYNC },
  };

  it("reads a reviewed commit's content against the view's base, for the named repository", () => {
    expect(reading({ reviews: [review], comments: [] }, [COPILOT]).content).toStrictEqual({
      kind: 'read',
      head: HEAD_PATCH,
      reviewed: [{ oid: BEFORE_SYNC, content: { kind: 'id', id: BEFORE_PATCH } }],
    });
  });

  it("reads the commit a completion comment names, the reviewer's second transport", () => {
    const comment = {
      id: 'IC_1',
      url: 'https://github.com/acme/widgets/pull/42#issuecomment-1',
      author: { login: CODEX },
      body: `Codex Review: Didn't find any major issues.\n\n**Reviewed commit:** \`${BEFORE_SYNC.slice(0, 10)}\`\n`,
      createdAt: '2026-07-21T12:10:00Z',
      lastEditedAt: null,
      editor: null,
    };
    expect(reading({ reviews: [], comments: [comment] }, [CODEX]).content).toMatchObject({
      kind: 'read',
      reviewed: [{ oid: BEFORE_SYNC, content: { kind: 'id', id: BEFORE_PATCH } }],
    });
  });

  it('reads no content for a pull request that is not open', () => {
    const merged = { ...OPEN_VIEW, state: 'MERGED' };
    expect(reading({ reviews: [review], comments: [] }, [COPILOT], merged).content).toStrictEqual({
      kind: 'unread',
      reason: 'the pull request is not open',
    });
  });
});

describe('readPrStateReading — the rounds asked of each reviewer', () => {
  it('reads the rounds from the request events and from the `@codex review` comments', () => {
    const requests = [
      {
        __typename: 'ReviewRequestedEvent',
        createdAt: '2026-07-21T12:20:00Z',
        requestedReviewer: { __typename: 'Bot', login: COPILOT },
      },
      { __typename: 'ReadyForReviewEvent', createdAt: '2026-07-21T11:00:00Z' },
    ];
    const trigger = {
      id: 'IC_2',
      url: 'https://github.com/acme/widgets/pull/42#issuecomment-2',
      author: { login: 'el-graphael' },
      body: '@codex review',
      createdAt: '2026-07-21T12:30:00Z',
      lastEditedAt: null,
      editor: null,
    };
    const rounds = reading({ reviews: [], comments: [trigger], requests }, [
      COPILOT,
      CODEX,
    ]).roundRequests;
    expect(rounds).toHaveLength(3);
    expect(rounds).toEqual(
      expect.arrayContaining([
        { reviewer: COPILOT, at: '2026-07-21T12:20:00Z' },
        { reviewer: CODEX, at: '2026-07-21T11:00:00Z' },
        { reviewer: CODEX, at: '2026-07-21T12:30:00Z' },
      ]),
    );
  });

  it('fails the reading when the request events cannot be read, never reading no round', () => {
    const unreadable = [{ __typename: 'ReviewRequestedEvent', requestedReviewer: null }];
    expect(() => reading({ reviews: [], comments: [], requests: unreadable }, [COPILOT])).toThrow(
      /review requests harvest failed/,
    );
  });
});

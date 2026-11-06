import { describe, expect, it } from 'vitest';

import type { CompletionComment } from './completion-comments.js';
import { CODEX_CONNECTOR_LOGIN } from './logins.js';
import { commentRequests, parseRequestsHarvest, roundAwaiter } from './round-requests.js';

/**
 * The rounds asked of each reviewer, read from the pull request's history
 * because GitHub's pending `reviewRequests` never lists a bot and a Codex
 * round is asked by a comment: review-request events, ready-for-review
 * events and `@codex review` comments. A review bound only by content waits
 * for a round asked of its reviewer at or after it landed.
 */

const COPILOT = 'copilot-pull-request-reviewer';
const LANDED = '2026-07-21T11:30:00Z';

function page(nodes: readonly unknown[]): unknown {
  return { data: { repository: { pullRequest: { timelineItems: { nodes } } } } };
}

function requested(requestedReviewer: unknown, createdAt = '2026-07-21T11:40:00Z'): unknown {
  return { __typename: 'ReviewRequestedEvent', createdAt, requestedReviewer };
}

function comment(overrides: Partial<CompletionComment>): CompletionComment {
  return {
    id: 'IC_1',
    author: 'el-graphael',
    body: '@codex review',
    createdAt: '2026-07-21T11:40:00Z',
    lastEdit: null,
    ...overrides,
  };
}

describe('parseRequestsHarvest', () => {
  it('reads a request of a bot and of a user, across pages, as a round asked of each', () => {
    const rounds = parseRequestsHarvest([
      page([requested({ __typename: 'Bot', login: COPILOT })]),
      page([requested({ __typename: 'User', login: 'jimCresswell' }, '2026-07-21T11:41:00Z')]),
    ]);
    expect(rounds).toEqual([
      { reviewer: COPILOT, at: '2026-07-21T11:40:00Z' },
      { reviewer: 'jimCresswell', at: '2026-07-21T11:41:00Z' },
    ]);
  });

  it('reads a ready-for-review event as a round asked of the Codex connector', () => {
    const rounds = parseRequestsHarvest([
      page([{ __typename: 'ReadyForReviewEvent', createdAt: '2026-07-21T11:45:00Z' }]),
    ]);
    expect(rounds).toEqual([{ reviewer: CODEX_CONNECTOR_LOGIN, at: '2026-07-21T11:45:00Z' }]);
  });

  it('parses a request of a team, a mannequin or a deleted account, and asks no reviewer by it', () => {
    const rounds = parseRequestsHarvest([
      page([
        requested({ __typename: 'Team', slug: 'maintainers' }),
        requested({ __typename: 'Mannequin', login: 'imported' }),
        requested(null),
      ]),
    ]);
    expect(rounds).toEqual([]);
  });

  it.each<[string, unknown]>([
    ['an empty slurp', []],
    [
      'a request with no time',
      [page([{ __typename: 'ReviewRequestedEvent', requestedReviewer: null }])],
    ],
    ['a time that is not a timestamp', [page([requested(null, 'yesterday')])]],
    ['an unknown event', [page([{ __typename: 'MergedEvent', createdAt: LANDED }])]],
    ['a bot request with no login', [page([requested({ __typename: 'Bot' })])]],
    [
      'a reviewer of an unknown kind',
      [page([requested({ __typename: 'EnterpriseTeam', login: 'x' })])],
    ],
  ])('refuses %s as misshapen input', (_what, raw) => {
    expect(() => parseRequestsHarvest(raw)).toThrow();
  });
});

describe('commentRequests', () => {
  it('reads an `@codex review` comment as a round asked of the Codex connector, wherever it sits', () => {
    expect(
      commentRequests([
        comment({ body: '@codex review' }),
        comment({ body: 'Synced with the base.\n\n@Codex Review please', createdAt: LANDED }),
      ]),
    ).toEqual([
      { reviewer: CODEX_CONNECTOR_LOGIN, at: '2026-07-21T11:40:00Z' },
      { reviewer: CODEX_CONNECTOR_LOGIN, at: LANDED },
    ]);
  });

  it.each<[string, Partial<CompletionComment>]>([
    [
      'the connector quoting its own trigger',
      { author: CODEX_CONNECTOR_LOGIN, body: 'Comment @codex review.' },
    ],
    ['a mention inside a code span', { body: 'post an `@codex review` comment' }],
    ['another request of the connector', { body: '@codex address that feedback' }],
    ['a comment with no mention', { body: 'Cured in SHA:abc.' }],
  ])('reads no round from %s', (_what, overrides) => {
    expect(commentRequests([comment(overrides)])).toEqual([]);
  });
});

describe('roundAwaiter', () => {
  const review = { submittedAt: LANDED };

  it('holds a review when a round was asked of its reviewer after it landed, or at the same moment', () => {
    const later = roundAwaiter(COPILOT, [], [{ reviewer: COPILOT, at: '2026-07-21T11:40:00Z' }]);
    const same = roundAwaiter(
      COPILOT,
      [],
      [{ reviewer: 'Copilot-Pull-Request-Reviewer', at: LANDED }],
    );
    expect([later(review), same(review)]).toEqual([true, true]);
  });

  it('lets a review stand when every round asked of its reviewer came before it', () => {
    const awaits = roundAwaiter(COPILOT, [], [{ reviewer: COPILOT, at: '2026-07-21T11:00:00Z' }]);
    expect(awaits(review)).toBe(false);
  });

  it('lets a review stand when the round after it was asked of another reviewer', () => {
    const awaits = roundAwaiter(
      COPILOT,
      ['jimCresswell'],
      [{ reviewer: CODEX_CONNECTOR_LOGIN, at: '2026-07-21T11:40:00Z' }],
    );
    expect(awaits(review)).toBe(false);
  });

  it('holds every review of a reviewer GitHub lists a pending request of', () => {
    expect(roundAwaiter(COPILOT, ['Copilot-Pull-Request-Reviewer'], [])(review)).toBe(true);
  });

  it('holds a review with no landing time when any round was asked of its reviewer', () => {
    const awaits = roundAwaiter(COPILOT, [], [{ reviewer: COPILOT, at: '2026-07-21T11:00:00Z' }]);
    expect(awaits({ submittedAt: '' })).toBe(true);
  });
});

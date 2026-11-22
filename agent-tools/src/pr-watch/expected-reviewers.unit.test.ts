import { describe, expect, it } from 'vitest';

import { expectedReviewersOf, reviewsByOthers } from './expected-reviewers.js';
import { CODEX_CONNECTOR_LOGIN } from './logins.js';
import type { HarvestedReview } from './reviewer-legs.js';
import type { RoundRequest } from './round-requests.js';

/**
 * The reviewers a pull request shows, over literal inputs: the bots a round
 * is asked of, and the authors of landed reviews that say a review occurred.
 * Nothing declares the set. Beside it, every review that is someone else's
 * word on the pull request, which the set is narrower than.
 */

const TIP = 'a'.repeat(40);
const COPILOT = 'copilot-pull-request-reviewer';
const NONE = { author: 'app/a-merge-bot', pending: [], rounds: [], connectors: [] };

function review(author: string, body: string, state = 'COMMENTED'): HarvestedReview {
  return { author, state, body, commitOid: TIP, submittedAt: '2026-07-21T12:00:00Z' };
}

describe('expectedReviewersOf — the author of the pull request', () => {
  it.each([
    ['a person', 'a-person', 'a-person'],
    ['a person, in another casing', 'A-Person', 'a-person'],
    ['an app, spelled app/<slug> on the pull request', 'app/a-merge-bot', 'a-merge-bot'],
    ['an app, spelled with the [bot] suffix on the review', 'app/a-merge-bot', 'a-merge-bot[bot]'],
  ])('is no reviewer of their own pull request: %s', (_whose, pullRequestAuthor, reviewAuthor) => {
    expect(
      expectedReviewersOf({
        ...NONE,
        author: pullRequestAuthor,
        reviews: [review(reviewAuthor, 'I have read this and it is fine.')],
      }),
    ).toEqual([]);
  });

  it('leaves another account’s review standing beside the author’s own', () => {
    expect(
      expectedReviewersOf({
        ...NONE,
        author: 'a-person',
        reviews: [review('a-person', 'Mine.'), review(COPILOT, 'Reviewed.')],
      }),
    ).toEqual([COPILOT]);
  });
});

describe('expectedReviewersOf', () => {
  it('unions the bots a round is asked of with the authors of landed reviews, once each', () => {
    const reviews = [review(COPILOT, 'Reviewed.'), review(COPILOT, 'Reviewed again.')];
    expect(
      expectedReviewersOf({
        ...NONE,
        pending: ['second-bot'],
        rounds: [{ reviewer: COPILOT, at: '2026-07-21T11:40:00Z' }],
        reviews,
      }),
    ).toEqual(['second-bot', COPILOT]);
  });

  it('reads a bot asked for a round that has not answered as a reviewer, so its review in progress is waited for', () => {
    expect(
      expectedReviewersOf({
        ...NONE,
        rounds: [{ reviewer: COPILOT, at: '2026-07-21T11:40:00Z' }],
        reviews: [],
      }),
    ).toEqual([COPILOT]);
  });

  it('leaves out the Codex connector when its only round is the one a ready-for-review event implies', () => {
    // On an estate without the connector that round is never answered.
    const implied: RoundRequest = {
      reviewer: CODEX_CONNECTOR_LOGIN,
      at: '2026-07-21T11:45:00Z',
      implied: true,
    };
    expect(expectedReviewersOf({ ...NONE, rounds: [implied], reviews: [] })).toEqual([]);
    expect(
      expectedReviewersOf({
        ...NONE,
        rounds: [implied, { reviewer: CODEX_CONNECTOR_LOGIN, at: '2026-07-21T11:50:00Z' }],
        reviews: [],
      }),
    ).toEqual([CODEX_CONNECTOR_LOGIN]);
  });

  it('reads a connector that has commented on the pull request as a reviewer: its comment is how it reports', () => {
    expect(
      expectedReviewersOf({ ...NONE, connectors: [CODEX_CONNECTOR_LOGIN], reviews: [] }),
    ).toEqual([CODEX_CONNECTOR_LOGIN]);
  });

  it('is empty when nobody has reviewed and no bot is asked', () => {
    expect(expectedReviewersOf({ ...NONE, reviews: [] })).toEqual([]);
  });

  it('drops an author seen only through EMPTY-bodied reviews, keeping one with any non-empty review', () => {
    // The empty body is a thread reply's artefact, not a round: its author
    // would otherwise mint a phantom OWED leg.
    const reviews = [
      review('el-graphael', ''),
      review(COPILOT, '  \n '),
      review(COPILOT, 'Reviewed.'),
    ];
    expect(expectedReviewersOf({ ...NONE, reviews })).toEqual([COPILOT]);
  });

  it('drops signed self-replies, unsubmitted drafts and deleted-account authors', () => {
    const reviews = [
      review('a-person', 'Fixed at source.\n\n— Moth mends Dreamscape (92e9d6)'),
      review('claude', 'Draft.', 'PENDING'),
      review('unknown', 'Reviewed.'),
    ];
    expect(expectedReviewersOf({ ...NONE, reviews })).toEqual([]);
  });

  it('drops an author whose every review says that no review occurred', () => {
    // A skip notice or a vendor's failed-run body is not a review, so its
    // author is awaited for nothing; a round asked of them is what awaits them.
    const reviews = [
      review('claude', 'Code review skipped: your organization has no extra usage available.'),
      review(
        COPILOT,
        'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.',
      ),
    ];
    expect(expectedReviewersOf({ ...NONE, reviews })).toEqual([]);
    expect(expectedReviewersOf({ ...NONE, pending: ['claude'], reviews })).toEqual(['claude']);
  });

  it('keeps an author with one real review beside a skip notice', () => {
    const reviews = [
      review('claude', 'Code review skipped: your organization has no extra usage available.'),
      review('claude', 'Code review found no issues.'),
    ];
    expect(expectedReviewersOf({ ...NONE, reviews })).toEqual(['claude']);
  });

  it('counts a person who reviewed: a real review is a review whoever wrote it', () => {
    expect(
      expectedReviewersOf({ ...NONE, reviews: [review('a-person', 'Looks right.', 'APPROVED')] }),
    ).toEqual(['a-person']);
  });
});

describe('reviewsByOthers', () => {
  it.each([
    ['an approval with an empty body', review('a-colleague', '', 'APPROVED')],
    ['a change request with an empty body', review('a-colleague', '', 'CHANGES_REQUESTED')],
    ['a comment on a line, whose review has an empty body', review('a-colleague', '')],
    [
      'the reader’s own draft, the one draft GitHub shows it',
      review('a-person', 'Half.', 'PENDING'),
    ],
    ['a review by a deleted account', review('unknown', 'This is wrong.')],
    [
      'a change request whose body reads like a skip notice',
      review(
        'a-colleague',
        'I was unable to review the migration. Do not merge.',
        'CHANGES_REQUESTED',
      ),
    ],
    [
      'an approval whose body ends like a signed reply',
      review('a-colleague', 'Fine.\n\n— Moth mends Dreamscape (92e9d6)', 'APPROVED'),
    ],
  ])('counts what the reviewer set leaves out: %s', (_what, leftOut) => {
    expect(expectedReviewersOf({ ...NONE, reviews: [leftOut] })).toEqual([]);
    expect(reviewsByOthers(NONE.author, [leftOut])).toEqual([leftOut]);
  });

  it('counts a deleted account’s review on a deleted account’s pull request: two deleted accounts share a name', () => {
    const other = review('unknown', '', 'CHANGES_REQUESTED');
    expect(reviewsByOthers('unknown', [other])).toEqual([other]);
  });

  it('counts a real review the set also counts', () => {
    const real = review(COPILOT, 'Reviewed.');
    expect(reviewsByOthers(NONE.author, [real])).toEqual([real]);
  });

  it.each([
    ['the author’s own reply on a thread', review('a-merge-bot[bot]', '')],
    [
      'a skip notice',
      review('claude', 'Code review skipped: your organization has no extra usage available.'),
    ],
    [
      'a vendor’s failed-run notice',
      review(
        COPILOT,
        'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.',
      ),
    ],
    [
      'the agent’s signed reply under a shared sign-in',
      review('a-person', 'Fixed at source.\n\n— Moth mends Dreamscape (92e9d6)'),
    ],
  ])('leaves out what is nobody’s review: %s', (_what, notOne) => {
    expect(reviewsByOthers(NONE.author, [notOne])).toEqual([]);
  });
});

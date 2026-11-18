import { describe, expect, it } from 'vitest';

import {
  readDeclaredStandIns,
  type DeclarationComment,
  type DeclarationReview,
  type ReadDeclaredStandInsInput,
} from './declared-unavailable.js';

/**
 * A vendor declared unavailable stands in for its leg only on the pull
 * request's own evidence: the bot's unedited comment, opening with the marker
 * for that vendor and head, and a timeline that shows the vendor could not
 * review (an error review on that head, or a request unanswered for over
 * sixty minutes). Anything else is refused by name.
 */

const POSTER = 'el-graphael';
const COPILOT = 'copilot-pull-request-reviewer';
const CODEX = 'chatgpt-codex-connector';
const HEAD = 'a'.repeat(40);
const OLD = 'b'.repeat(40);
const URL = 'https://github.com/acme/widgets/pull/42#issuecomment-1';
const NOW = '2026-09-28T22:00:00Z';
const COPILOT_ERROR =
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.';

function marker(login: string, sha: string): string {
  return `**${login} leg unavailable on head SHA:${sha}.**`;
}

function comment(overrides: Partial<DeclarationComment> = {}): DeclarationComment {
  return {
    id: 'IC_1',
    url: URL,
    author: POSTER,
    body: `${marker(COPILOT, HEAD)}\n\nCopilot errored on this head.`,
    createdAt: '2026-09-28T21:00:00Z',
    lastEdit: null,
    ...overrides,
  };
}

function review(overrides: Partial<DeclarationReview> = {}): DeclarationReview {
  return {
    author: COPILOT,
    state: 'COMMENTED',
    body: COPILOT_ERROR,
    commitOid: HEAD,
    submittedAt: '2026-09-28T20:57:40Z',
    ...overrides,
  };
}

function input(overrides: Partial<ReadDeclaredStandInsInput> = {}): ReadDeclaredStandInsInput {
  return {
    declarations: [{ login: COPILOT, url: URL }],
    comments: [comment()],
    poster: POSTER,
    expectedReviewers: [COPILOT, CODEX],
    reviews: [review()],
    requests: [],
    isErrorReview: (body) => body === COPILOT_ERROR,
    now: NOW,
    ...overrides,
  };
}

function refusedWith(refusal: string, login = COPILOT, url = URL) {
  return { standIns: [], refused: [{ login, url, refusal }] };
}

const standIn = {
  id: 'IC_1',
  url: URL,
  author: COPILOT,
  state: 'COMMENTED',
  body: marker(COPILOT, HEAD),
  commitOid: HEAD,
  submittedAt: '2026-09-28T21:00:00Z',
  transport: 'declared-stand-in',
};

const NO_PROOF =
  'shows no unavailability on the timeline: no error review on the named head, and no request unanswered for over sixty minutes';

describe('readDeclaredStandIns: the two proofs', () => {
  it('stands in for Copilot on the named head after its error review there', () => {
    expect(readDeclaredStandIns(input())).toStrictEqual({
      standIns: [{ ...standIn, proof: { kind: 'error-review', at: '2026-09-28T20:57:40Z' } }],
      refused: [],
    });
  });

  it('stands in on a request unanswered for more than sixty minutes', () => {
    const request = { reviewer: COPILOT, at: '2026-09-28T20:30:00Z' };
    expect(readDeclaredStandIns(input({ reviews: [], requests: [request] }))).toStrictEqual({
      standIns: [{ ...standIn, proof: { kind: 'unanswered-request', at: '2026-09-28T20:30:00Z' } }],
      refused: [],
    });
  });

  it.each([
    ['exactly sixty minutes old', '2026-09-28T21:00:00Z', false],
    ['sixty minutes and a second old', '2026-09-28T20:59:59Z', true],
  ])('a request %s is proof only past the hour', (_age, at, accepted) => {
    const reading = readDeclaredStandIns(
      input({ reviews: [], requests: [{ reviewer: COPILOT, at }] }),
    );
    expect(reading.standIns.length === 1).toBe(accepted);
  });

  it('a request answered by a content review is no proof', () => {
    const answered = review({
      body: 'Reviewed 2 of 2 files.',
      commitOid: OLD,
      submittedAt: '2026-09-28T20:30:00Z',
    });
    const reading = input({
      reviews: [answered],
      requests: [{ reviewer: COPILOT, at: '2026-09-28T20:00:00Z' }],
    });
    expect(readDeclaredStandIns(reading)).toStrictEqual(refusedWith(NO_PROOF));
  });

  it('an error review after the request is no answer, so the request still proves the outage', () => {
    const errored = review({ commitOid: OLD, submittedAt: '2026-09-28T20:30:00Z' });
    const reading = input({
      reviews: [errored],
      requests: [{ reviewer: COPILOT, at: '2026-09-28T20:00:00Z' }],
    });
    expect(readDeclaredStandIns(reading)).toStrictEqual({
      standIns: [{ ...standIn, proof: { kind: 'unanswered-request', at: '2026-09-28T20:00:00Z' } }],
      refused: [],
    });
  });

  it('an error review on another head is no proof', () => {
    const reading = input({ reviews: [review({ commitOid: OLD })] });
    expect(readDeclaredStandIns(reading)).toStrictEqual(refusedWith(NO_PROOF));
  });

  it('a review between the error and the declaration answers the error, so it proves nothing', () => {
    const answered = review({
      body: 'Reviewed 2 of 2 files.',
      commitOid: OLD,
      submittedAt: '2026-09-28T20:59:00Z',
    });
    expect(readDeclaredStandIns(input({ reviews: [review(), answered] }))).toStrictEqual(
      refusedWith(NO_PROOF),
    );
  });

  it('refuses when the timeline shows no unavailability', () => {
    expect(readDeclaredStandIns(input({ reviews: [] }))).toStrictEqual(refusedWith(NO_PROOF));
  });
});

describe('readDeclaredStandIns: the comment', () => {
  it('refuses a declaration the bot did not post', () => {
    const reading = input({ comments: [comment({ author: 'jimCresswell' })] });
    expect(readDeclaredStandIns(reading)).toStrictEqual(
      refusedWith('was posted by an account other than the bot'),
    );
  });

  it.each(['jimCresswell', 'unknown'])('refuses a declaration last edited by %s', (by) => {
    const reading = input({
      comments: [comment({ lastEdit: { at: '2026-09-28T21:05:00Z', by } })],
    });
    expect(readDeclaredStandIns(reading)).toStrictEqual(
      refusedWith('was edited by an account other than its author'),
    );
  });

  it("accepts the bot's own edit, timed at the edit", () => {
    const edited = comment({ lastEdit: { at: '2026-09-28T21:05:00Z', by: POSTER } });
    expect(readDeclaredStandIns(input({ comments: [edited] })).standIns).toStrictEqual([
      {
        ...standIn,
        submittedAt: '2026-09-28T21:05:00Z',
        proof: { kind: 'error-review', at: '2026-09-28T20:57:40Z' },
      },
    ]);
  });

  it('refuses a url that is no comment of this pull request', () => {
    const elsewhere = 'https://github.com/acme/widgets/pull/43#issuecomment-1';
    expect(
      readDeclaredStandIns(input({ declarations: [{ login: COPILOT, url: elsewhere }] })),
    ).toStrictEqual(refusedWith('names no comment on this pull request', COPILOT, elsewhere));
  });

  it.each([
    ['the marker on line two', `Copilot is down.\n${marker(COPILOT, HEAD)}`],
    ['prose after the marker', `${marker(COPILOT, HEAD)} Copilot is down.`],
    ['a short sha', marker(COPILOT, HEAD.slice(0, 10))],
    ['the display name', marker('Copilot', HEAD)],
    ['another vendor', marker(CODEX, HEAD)],
  ])('refuses a comment with %s', (_shape, body) => {
    expect(readDeclaredStandIns(input({ comments: [comment({ body })] }))).toStrictEqual(
      refusedWith('does not open with the unavailability marker for this reviewer'),
    );
  });
});

describe('readDeclaredStandIns: the reviewer', () => {
  it.each([
    [
      'a Copilot review',
      COPILOT,
      review({ body: 'Reviewed 2 of 2 files.', submittedAt: '2026-09-28T21:10:00Z' }),
    ],
    [
      'a Codex completion comment',
      CODEX,
      review({
        author: CODEX,
        body: "Codex Review: Didn't find any major issues.",
        submittedAt: '2026-09-28T21:10:00Z',
      }),
    ],
  ])('refuses when the vendor answered after the declaration: %s', (_what, login, answer) => {
    const reading = input({
      declarations: [{ login, url: URL }],
      comments: [comment({ body: marker(login, HEAD) })],
      reviews: [answer],
      requests: [{ reviewer: login, at: '2026-09-28T20:00:00Z' }],
    });
    expect(readDeclaredStandIns(reading)).toStrictEqual(
      refusedWith('meets a review from that reviewer since the declaration', login),
    );
  });

  it('reads a review whose time cannot be read as an answer, which refuses', () => {
    const unreadable = review({ body: 'Reviewed 2 of 2 files.', commitOid: OLD, submittedAt: '' });
    expect(readDeclaredStandIns(input({ reviews: [review(), unreadable] }))).toStrictEqual(
      refusedWith('meets a review from that reviewer since the declaration'),
    );
  });

  it('a pending review after the declaration is no answer', () => {
    const pending = review({
      state: 'PENDING',
      body: 'Draft notes.',
      submittedAt: '2026-09-28T21:10:00Z',
    });
    expect(readDeclaredStandIns(input({ reviews: [review(), pending] })).refused).toStrictEqual([]);
  });

  it('refuses a reviewer that is not expected', () => {
    const reading = input({ expectedReviewers: [CODEX] });
    expect(readDeclaredStandIns(reading)).toStrictEqual(
      refusedWith('names a reviewer that is not expected'),
    );
  });

  it('compares logins without case, and with or without the [bot] suffix', () => {
    const reading = input({
      declarations: [{ login: 'Copilot-Pull-Request-Reviewer[bot]', url: URL }],
      poster: 'el-graphael[bot]',
    });
    expect(readDeclaredStandIns(reading).standIns).toStrictEqual([
      { ...standIn, proof: { kind: 'error-review', at: '2026-09-28T20:57:40Z' } },
    ]);
  });

  it('reads each declaration on its own', () => {
    const missing = 'https://github.com/acme/widgets/pull/42#issuecomment-2';
    const reading = input({
      declarations: [
        { login: COPILOT, url: URL },
        { login: CODEX, url: missing },
      ],
    });
    expect(readDeclaredStandIns(reading)).toStrictEqual({
      standIns: [{ ...standIn, proof: { kind: 'error-review', at: '2026-09-28T20:57:40Z' } }],
      refused: [{ login: CODEX, url: missing, refusal: 'names no comment on this pull request' }],
    });
  });
});

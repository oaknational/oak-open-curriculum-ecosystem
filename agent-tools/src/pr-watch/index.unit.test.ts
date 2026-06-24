import { describe, expect, it } from 'vitest';

import { buildSnapshot, classifyCheck, parseReviewComments, type PrSnapshot } from './index.js';

const prViewJson = {
  number: 221,
  state: 'OPEN',
  mergeable: 'MERGEABLE',
  mergeStateStatus: 'CLEAN',
  reviewDecision: '',
  headRefOid: '20d61cb74d4c9cffdcd536d11992be960756f800',
  statusCheckRollup: [
    { __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'SUCCESS' },
    { __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'FAILURE' },
    { __typename: 'CheckRun', status: 'IN_PROGRESS', conclusion: null },
    { __typename: 'StatusContext', state: 'SUCCESS' },
  ],
  comments: [{ id: 'IC_kwDO1', author: { login: 'vercel' } }],
};

// REST-shaped review comments (numeric id, user.login) — the gh api surface.
const reviewCommentsJson = [{ id: 3465383611, user: { login: 'Copilot' } }];

describe('buildSnapshot', () => {
  it('normalises both gh surfaces into one snapshot with bucketed checks and comment refs', () => {
    expect(buildSnapshot(prViewJson, reviewCommentsJson)).toStrictEqual({
      number: 221,
      state: 'OPEN',
      mergeable: 'MERGEABLE',
      mergeStateStatus: 'CLEAN',
      reviewDecision: '',
      headRefOid: '20d61cb74d4c9cffdcd536d11992be960756f800',
      checks: { total: 4, passed: 2, failed: 1, pending: 1 },
      issueComments: [{ id: 'IC_kwDO1', author: 'vercel' }],
      reviewComments: [{ id: '3465383611', author: 'Copilot' }],
    } satisfies PrSnapshot);
  });

  it('defaults checks and comments to empty when those surfaces are absent', () => {
    const bare = buildSnapshot(
      { ...prViewJson, statusCheckRollup: undefined, comments: undefined },
      [],
    );
    expect(bare.checks).toStrictEqual({ total: 0, passed: 0, failed: 0, pending: 0 });
    expect(bare.issueComments).toStrictEqual([]);
    expect(bare.reviewComments).toStrictEqual([]);
  });

  it('treats a null statusCheckRollup (PR with no checks) as zero checks', () => {
    const snap = buildSnapshot({ ...prViewJson, statusCheckRollup: null }, []);
    expect(snap.checks).toStrictEqual({ total: 0, passed: 0, failed: 0, pending: 0 });
  });

  it('fails loud on a genuinely malformed (non-array) statusCheckRollup', () => {
    expect(() => buildSnapshot({ ...prViewJson, statusCheckRollup: 'broken' }, [])).toThrow();
  });

  it('normalises a null reviewDecision (repo with no required-review policy) to an empty string', () => {
    const snap = buildSnapshot({ ...prViewJson, reviewDecision: null }, []);
    expect(snap.reviewDecision).toBe('');
  });

  it('falls back to "unknown" for a comment whose author is null (deleted account)', () => {
    const withNullAuthor = buildSnapshot(
      { ...prViewJson, comments: [{ id: 'IC_x', author: null }] },
      [{ id: 9, user: null }],
    );
    expect(withNullAuthor.issueComments).toStrictEqual([{ id: 'IC_x', author: 'unknown' }]);
    expect(withNullAuthor.reviewComments).toStrictEqual([{ id: '9', author: 'unknown' }]);
  });

  it('throws at the boundary when a required field is missing', () => {
    const withoutMergeable = {
      number: 221,
      state: 'OPEN',
      mergeStateStatus: 'CLEAN',
      reviewDecision: '',
      headRefOid: 'abc',
      statusCheckRollup: [],
      comments: [],
    };
    expect(() => buildSnapshot(withoutMergeable, [])).toThrow();
  });

  it('counts an unrecognised rollup item type as pending rather than rejecting it', () => {
    const snap = buildSnapshot(
      { ...prViewJson, statusCheckRollup: [{ __typename: 'SomeFutureCheckType', whatever: true }] },
      [],
    );
    expect(snap.checks).toStrictEqual({ total: 1, passed: 0, failed: 0, pending: 1 });
  });
});

describe('parseReviewComments', () => {
  it('normalises numeric ids to strings and reads user.login', () => {
    expect(parseReviewComments(reviewCommentsJson)).toStrictEqual([
      { id: '3465383611', author: 'Copilot' },
    ]);
  });
});

describe('classifyCheck', () => {
  it('treats a not-yet-complete CheckRun as pending regardless of conclusion', () => {
    expect(classifyCheck({ __typename: 'CheckRun', status: 'QUEUED', conclusion: null })).toBe(
      'pending',
    );
  });

  it('treats a COMPLETED CheckRun with an unrecognised conclusion as pending, not failed', () => {
    expect(
      classifyCheck({ __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'BRAND_NEW' }),
    ).toBe('pending');
  });

  it('maps SKIPPED and NEUTRAL conclusions to passed', () => {
    expect(
      classifyCheck({ __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'SKIPPED' }),
    ).toBe('passed');
    expect(
      classifyCheck({ __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'NEUTRAL' }),
    ).toBe('passed');
  });

  it('maps a StatusContext ERROR or FAILURE state to failed and PENDING to pending', () => {
    expect(classifyCheck({ __typename: 'StatusContext', state: 'ERROR' })).toBe('failed');
    expect(classifyCheck({ __typename: 'StatusContext', state: 'FAILURE' })).toBe('failed');
    expect(classifyCheck({ __typename: 'StatusContext', state: 'PENDING' })).toBe('pending');
  });

  it('maps a CANCELLED CheckRun conclusion to failed', () => {
    expect(
      classifyCheck({ __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'CANCELLED' }),
    ).toBe('failed');
  });
});

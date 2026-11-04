import { describe, expect, it } from 'vitest';

import {
  assertWindowCovered,
  CANONICAL_REPOSITORY,
  fetchMergedPrs,
  MERGED_PR_JSON_FIELDS,
} from './gh-fetch.js';

const VALID_PAYLOAD = JSON.stringify([
  {
    number: 429,
    createdAt: '2026-07-20T08:00:00Z',
    mergedAt: '2026-07-20T19:19:49Z',
    headRefName: 'jimcresswell/aip-137-dtcg-css-consistency-validator',
  },
]);

describe('fetchMergedPrs', () => {
  it('parses the merged-PR corpus from one bounded, repo-pinned pr list search', () => {
    const calls: (readonly string[])[] = [];
    const result = fetchMergedPrs({
      executor: (...call) => {
        calls.push(call[1]);
        return VALID_PAYLOAD;
      },
      limit: 200,
      mergedSinceDate: '2026-07-13',
      mergedUntilDate: '2026-07-20',
    });

    if (!result.ok) {
      throw new Error(`expected ok, got: ${result.error.message}`);
    }
    expect(result.value).toHaveLength(1);
    expect(result.value[0].number).toBe(429);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('--limit');
    // Bounded range, not an open `merged:>=`: a historical --now run must
    // not let post-window merges consume the cap and trip the coverage
    // refusal on a window that IS complete.
    expect(calls[0]).toContain('merged:2026-07-13..2026-07-20');
    expect(calls[0]).toContain(MERGED_PR_JSON_FIELDS);
    // The canonical repository is named explicitly: without --repo, gh uses
    // the checkout's configured default and a fork checkout could append
    // rows computed from the wrong corpus.
    expect(calls[0]).toContain('--repo');
    expect(calls[0]).toContain(CANONICAL_REPOSITORY);
  });

  it('returns a typed err on non-JSON output instead of throwing or reading it as empty', () => {
    const result = fetchMergedPrs({
      executor: () => 'API rate limit exceeded',
      limit: 10,
      mergedSinceDate: '2026-07-13',
      mergedUntilDate: '2026-07-20',
    });

    if (result.ok) {
      throw new Error('expected err, got ok');
    }
    expect(result.error.message).toContain('non-JSON');
  });

  it('returns a typed err when the payload shape drifts from the schema', () => {
    const result = fetchMergedPrs({
      executor: () => JSON.stringify([{ number: 'not-a-number' }]),
      limit: 10,
      mergedSinceDate: '2026-07-13',
      mergedUntilDate: '2026-07-20',
    });

    expect(result.ok).toBe(false);
  });

  it('translates an executor throw (spawn failure) into a typed err', () => {
    const result = fetchMergedPrs({
      executor: () => {
        throw new Error('spawn EACCES');
      },
      limit: 10,
      mergedSinceDate: '2026-07-13',
      mergedUntilDate: '2026-07-20',
    });

    if (result.ok) {
      throw new Error('expected err, got ok');
    }
    expect(result.error.message).toContain('EACCES');
  });
});

describe('assertWindowCovered', () => {
  const inWindow = {
    number: 1,
    createdAt: '2026-07-19T10:00:00Z',
    mergedAt: '2026-07-19T11:00:00Z',
    headRefName: 'feature/a',
  };

  it('refuses a merge-date-bounded fetch that hit its cap', () => {
    // Order proves nothing (gh lists by creation date), so cap-hit alone is
    // the refusal condition.
    const result = assertWindowCovered({
      prs: [inWindow, { ...inWindow, number: 3 }],
      limit: 2,
      windowDays: 7,
    });

    if (result.ok) {
      throw new Error('expected err, got ok');
    }
    expect(result.error.message).toContain('--limit');
  });

  it('accepts an under-cap fetch (the bounded corpus is complete)', () => {
    expect(assertWindowCovered({ prs: [inWindow], limit: 200, windowDays: 7 }).ok).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { ok, err } from '@oaknational/result';

import { createSearchHandler } from './search-handler';
import { isSearchResults, type SearchResults } from './search-types';

/**
 * `createSearchHandler` binds an injected search function to the HTTP contract
 * of `/api/search`. The states it owns are the ones a CLIENT consumes: 200 +
 * results envelope, 200 + empty envelope for a blank query, 503 + the
 * not-configured error body, 502 + the failed error body. Only those
 * discriminants are asserted.
 */

const populated: SearchResults = {
  lessons: [
    {
      id: 'l-1',
      title: 'Comparing fractions',
      url: 'https://www.thenational.academy/teachers/lessons/comparing-fractions',
    },
  ],
  units: [],
  threads: [],
};

describe('createSearchHandler', () => {
  it('returns 200 with the results envelope when the search succeeds', async () => {
    const handler = createSearchHandler(() => Promise.resolve(ok(populated)));

    const res = await handler(new Request('https://x/api/search?q=fractions'));

    expect(res.status).toBe(200);
    const body: unknown = await res.json();
    expect(isSearchResults(body)).toBe(true);
    expect(body).toEqual(populated);
  });

  it('returns 200 with the empty envelope for a missing q, without running a search', async () => {
    // The searchFn would return hits — the empty envelope in the response is
    // the behavioural witness that a blank query short-circuits.
    const handler = createSearchHandler(() => Promise.resolve(ok(populated)));

    const res = await handler(new Request('https://x/api/search'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ lessons: [], units: [], threads: [] });
  });

  it('returns 200 with the empty envelope for a whitespace-only q', async () => {
    const handler = createSearchHandler(() => Promise.resolve(ok(populated)));

    const res = await handler(new Request('https://x/api/search?q=%20%20'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ lessons: [], units: [], threads: [] });
  });
});

describe('createSearchHandler error contract', () => {
  it('returns 503 with the not-configured error body when search is not configured', async () => {
    const handler = createSearchHandler(() => Promise.resolve(err({ kind: 'not_configured' })));

    const res = await handler(new Request('https://x/api/search?q=fractions'));

    expect(res.status).toBe(503);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ error: 'search_not_configured' });
  });

  it('returns 502 with the failed error body when the search fails', async () => {
    const handler = createSearchHandler(() =>
      Promise.resolve(err({ kind: 'failed', message: 'es down' })),
    );

    const res = await handler(new Request('https://x/api/search?q=fractions'));

    expect(res.status).toBe(502);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ error: 'search_failed' });
  });
});

// A fake modelling the seam's size semantics: each scope of the envelope
// reflects the sizes the handler forwarded (absent sizes -> empty). The flow
// is asserted on the response body, never via call inspection.
const scopeHits = (prefix: string, count?: number): { id: string; title: string; url: string }[] =>
  Array.from({ length: count ?? 0 }, (_, i) => ({
    id: `${prefix}-${i}`,
    title: 'Hit',
    url: 'https://example.org',
  }));

const sizeEcho = (
  _q: string,
  sizes?: { lessons?: number; units?: number; threads?: number },
): ReturnType<Parameters<typeof createSearchHandler>[0]> =>
  Promise.resolve(
    ok({
      lessons: scopeHits('l', sizes?.lessons),
      units: scopeHits('u', sizes?.units),
      threads: scopeHits('t', sizes?.threads),
    }),
  );

describe('createSearchHandler size params (E3)', () => {
  it('forwards valid per-scope size params to the search', async () => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(new Request('https://x/api/search?q=fractions&lessons=2'));

    expect(res.status).toBe(200);
    const body: unknown = await res.json();
    expect(isSearchResults(body) && body.lessons.length === 2).toBe(true);
  });

  it('forwards all three scope sizes, not just lessons', async () => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(
      new Request('https://x/api/search?q=fractions&lessons=2&units=3&threads=4'),
    );

    expect(res.status).toBe(200);
    const body: unknown = await res.json();
    expect(
      isSearchResults(body) &&
        [body.lessons.length, body.units.length, body.threads.length].join(','),
    ).toBe('2,3,4');
  });

  it('passes no sizes when the params are absent (hub path unchanged)', async () => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(new Request('https://x/api/search?q=fractions'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ lessons: [], units: [], threads: [] });
  });
});

describe('createSearchHandler size-param validation (E3)', () => {
  it('rejects a non-numeric size param with 400', async () => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(new Request('https://x/api/search?q=fractions&lessons=abc'));

    expect(res.status).toBe(400);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ error: 'invalid_request' });
  });

  it('rejects a zero or negative size param with 400', async () => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(new Request('https://x/api/search?q=fractions&units=0'));

    expect(res.status).toBe(400);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ error: 'invalid_request' });
  });

  it('rejects a size param above the maximum (50) with 400', async () => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(new Request('https://x/api/search?q=fractions&threads=999'));

    expect(res.status).toBe(400);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ error: 'invalid_request' });
  });
});

describe('createSearchHandler size-param strict-decimal contract (E3)', () => {
  it('accepts the maximum size (50) and rejects the first value above it (51)', async () => {
    const handler = createSearchHandler(sizeEcho);

    const at = await handler(new Request('https://x/api/search?q=fractions&lessons=50'));
    const above = await handler(new Request('https://x/api/search?q=fractions&lessons=51'));

    expect(at.status).toBe(200);
    expect(above.status).toBe(400);
  });

  // Contract: plain decimal strings only (settled with the consumer). Number()
  // would coerce every one of these; the strict-decimal gate must not.
  it.each([
    ['exponent form', '2e1'],
    ['hex form', '0x14'],
    ['explicit plus sign', '+5'],
    ['whitespace-padded', ' 7 '],
    ['decimal point', '2.0'],
  ])('rejects the %s size param (%s) with 400', async (_label, raw) => {
    const handler = createSearchHandler(sizeEcho);

    const res = await handler(
      new Request(`https://x/api/search?q=fractions&units=${encodeURIComponent(raw)}`),
    );

    expect(res.status).toBe(400);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ error: 'invalid_request' });
  });
});

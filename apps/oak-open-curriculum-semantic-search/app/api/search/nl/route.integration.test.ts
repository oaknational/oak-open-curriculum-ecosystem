import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LESSONS_SCOPE } from '../../../../src/lib/search-scopes';
import type { SearchScopeWithAll, SearchScope } from '../../../../src/types/oak';

type ParsedIntent = Extract<SearchScopeWithAll, SearchScope>;

type ParsedQuery = {
  intent: ParsedIntent;
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
};

const parseQuery = vi.hoisted(() => vi.fn<(input: string) => Promise<ParsedQuery>>());

vi.mock('../../../../src/lib/query-parser', () => ({
  parseQuery,
}));

vi.mock('../../../../src/lib/env', () => ({
  llmEnabled: () => true,
}));

import { POST } from './route';

describe('POST /api/search/nl', () => {
  beforeEach(() => {
    parseQuery.mockResolvedValue({ intent: LESSONS_SCOPE, text: 'fractions' });
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns fixture results when fixtures query parameter is provided', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions', scope: LESSONS_SCOPE }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { results?: unknown[] };
    expect(payload.results?.length).toBeGreaterThan(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
    expect(fetch).not.toHaveBeenCalled();
  });
});

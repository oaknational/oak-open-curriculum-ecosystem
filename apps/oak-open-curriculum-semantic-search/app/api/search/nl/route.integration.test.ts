import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
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
  optionalEnv: () => ({
    SEARCH_INDEX_VERSION: 'v-test-index',
  }),
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

  it('returns fixture results with a derived summary when fixtures query parameter is provided', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions about ks2 maths' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payloadJson: unknown = await response.json();
    const payload = z
      .object({
        result: z.object({ results: z.array(z.unknown()) }).loose(),
        summary: z
          .object({
            prompt: z.string(),
            structured: z.object({ scope: z.string() }).loose(),
          })
          .loose(),
      })
      .loose()
      .parse(payloadJson);

    expect(payload.summary.prompt).toBe('fractions about ks2 maths');
    expect(payload.summary.structured.scope).toBe(LESSONS_SCOPE);
    expect(payload.result.results.length).toBeGreaterThan(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an empty fixture with a derived summary when fixtures query parameter requests empty mode', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=empty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions for ks3' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payloadJson: unknown = await response.json();
    const payload = z
      .object({
        result: z.object({ results: z.array(z.unknown()) }).loose(),
        summary: z
          .object({
            prompt: z.string(),
            structured: z.object({ scope: z.string() }).loose(),
          })
          .loose(),
      })
      .loose()
      .parse(payloadJson);
    expect(payload.result.results).toHaveLength(0);
    expect(payload.summary.prompt).toBe('fractions for ks3');
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=empty');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an error fixture when fixtures query parameter requests error mode', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const payload = z.object({ error: z.string() }).parse(await response.json());
    expect(payload.error).toBe('FIXTURE_ERROR');
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=error');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('forwards live requests, returning the derived summary alongside the structured response', async () => {
    const request = new NextRequest('http://localhost/api/search/nl', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'Plan primary fractions lessons with manipulatives' }),
    });

    const structuredResponse = {
      scope: LESSONS_SCOPE,
      results: [{ id: 'lesson-1' }],
      total: 1,
      took: 12,
      timedOut: false,
    } as const;

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify(structuredResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = z
      .object({
        result: z.object({ scope: z.string(), results: z.array(z.unknown()) }).loose(),
        summary: z
          .object({
            prompt: z.string(),
            structured: z.object({
              scope: z.string(),
              text: z.string(),
            }),
          })
          .loose(),
      })
      .loose()
      .parse(await response.json());

    expect(payload.result).toMatchObject(structuredResponse);
    expect(payload.summary.prompt).toBe('Plan primary fractions lessons with manipulatives');
    expect(payload.summary.structured.text).toBe('fractions');
  });
});

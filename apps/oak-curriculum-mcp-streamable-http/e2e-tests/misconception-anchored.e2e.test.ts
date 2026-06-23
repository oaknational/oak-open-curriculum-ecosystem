/**
 * E2E (G2 c3): `tools/call` on the anchored get-misconception-graph.
 *
 * Exercises the real corpus path through the full HTTP stack — no upstream
 * stub is involved because the aggregated graph tool reads the compile-time
 * corpus, not the live API. The anchor is chosen deterministically from the
 * corpus so the test describes behaviour over any valid corpus.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createApp } from '../src/application.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  getStructuredContentData,
} from './helpers/sse.js';
import {
  createMockObservability,
  createMockRuntimeConfig,
  createNoOpRateLimiterFactory,
} from './helpers/test-config.js';

const ACCEPT = 'application/json, text/event-stream';

/**
 * Schema-driven narrowing of the loose `structuredContent` record — the
 * test-boundary alternative to a type assertion. Non-strict: the family
 * envelope adds `summary` / `oakContextHint` / `status` alongside the
 * lesson-anchored fields.
 */
const LESSON_ENVELOPE = z.object({
  anchorKind: z.literal('lesson'),
  lessons: z.array(z.object({ lesson: z.unknown(), misconceptions: z.array(z.unknown()) })),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

/** A lesson slug carrying a misconception, chosen deterministically (lexicographic minimum edge source). */
const firstLessonId = graphCorpus.edges
  .filter((edge) => edge.type === 'addressesMisconception')
  .map((edge) => edge.source)
  .sort((a, b) => a.localeCompare(b))[0];
if (firstLessonId === undefined) {
  throw new Error('corpus has no addressesMisconception edge to anchor the e2e test');
}
const knownLessonSlug: string = firstLessonId.slice(firstLessonId.indexOf(':') + 1);

async function callMisconceptionGraph(args: unknown): Promise<request.Response> {
  const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
  const app = await createApp({
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    rateLimiterFactory: createNoOpRateLimiterFactory(),
  });
  return request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', ACCEPT)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-misconception-graph', arguments: args },
    });
}

describe('get-misconception-graph anchored tools/call', () => {
  it('returns the lesson-anchored misconceptions: summary + JSON content and structuredContent', async () => {
    const response = await callMisconceptionGraph({ lessonSlugs: [knownLessonSlug] });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);

    const content = getContentArray(result);
    expect(content).toHaveLength(2);

    const structured = LESSON_ENVELOPE.parse(getStructuredContentData(result));
    expect(structured.resolvedAnchors).toStrictEqual([`lesson:${knownLessonSlug}`]);
    expect(structured.unknownAnchors).toStrictEqual([]);
    expect(structured.lessons).toHaveLength(1);
    expect(structured.lessons[0]?.misconceptions.length).toBeGreaterThan(0);
  });

  it('rejects an anchorless call at the input boundary', async () => {
    const response = await callMisconceptionGraph({});

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
  });
});

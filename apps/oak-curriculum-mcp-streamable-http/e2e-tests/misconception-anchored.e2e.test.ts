/**
 * E2E (G2 c3): `tools/call` on the anchored get-misconception-graph.
 *
 * Exercises the real corpus path through the full HTTP stack — no upstream
 * stub is involved because the aggregated graph tool reads the compile-time
 * corpus, not the live API. The anchor is chosen deterministically from the
 * corpus so the test describes behaviour over any valid corpus.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { request, type Response } from '../src/test-helpers/loopback-request.js';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createApp } from '../src/application.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  getStructuredContentData,
} from './helpers/sse.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';

const ACCEPT = 'application/json, text/event-stream';

/**
 * Schema-driven narrowing of the loose `structuredContent` record — the
 * test-boundary alternative to a type assertion. Non-strict: the family
 * envelope adds `summary` / `status` alongside the
 * lesson-anchored fields.
 */
const LESSON_ENVELOPE = z.object({
  anchorKind: z.literal('lesson'),
  lessons: z.array(z.object({ lesson: z.unknown(), misconceptions: z.array(z.unknown()) })),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

/** A lesson slug carrying a misconception, chosen deterministically (lexicographic minimum edge source). */
const UNIT_ENVELOPE = z.object({
  anchorKind: z.literal('unit'),
  units: z.array(
    z.object({
      unit: z.object({ id: z.string() }),
      lessons: z.array(z.object({ lesson: z.object({ id: z.string() }) })),
    }),
  ),
});
const THREAD_ENVELOPE = z.object({
  anchorKind: z.literal('thread'),
  threads: z.array(
    z.object({
      totalUnits: z.number(),
      hasMore: z.boolean(),
      units: z.array(z.object({ unit: z.object({ id: z.string() }) })),
    }),
  ),
});
const idSorted = (ids: readonly string[]): string[] => [...ids].sort((a, b) => a.localeCompare(b));
// Fixtures chosen for the property under test: a unit whose authored lesson
// order, and a thread whose curriculum unit order, provably differ from id
// order — so an id-sorted result anywhere between the view and the wire fails.
const reorderedRun = graphCorpus.unitLessonRuns.find(
  (run) => run.lessonIds.length > 2 && run.lessonIds.join() !== idSorted(run.lessonIds).join(),
);
if (reorderedRun === undefined) {
  throw new Error('corpus has no unit whose authored lesson order differs from id order');
}
const reorderedSequence = graphCorpus.sequences.find((sequence) => {
  const ids = sequence.placements.map((placement) => placement.unitId);
  return ids.length > 2 && ids.join() !== idSorted(ids).join();
});
if (reorderedSequence === undefined) {
  throw new Error('corpus has no thread whose curriculum order differs from id order');
}
const bare = (id: string): string => id.slice(id.indexOf(':') + 1);
const firstLessonId = graphCorpus.edges
  .filter((edge) => edge.type === 'addressesMisconception')
  .map((edge) => edge.source)
  .sort((a, b) => a.localeCompare(b))[0];
if (firstLessonId === undefined) {
  throw new Error('corpus has no addressesMisconception edge to anchor the e2e test');
}
const knownLessonSlug: string = firstLessonId.slice(firstLessonId.indexOf(':') + 1);

async function callMisconceptionGraph(args: unknown): Promise<Response> {
  const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
  const app = await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    getLandingPageHtml: () =>
      '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
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

  it('serves a unit’s lessons in authored order over the real transport', async () => {
    const response = await callMisconceptionGraph({ unitSlugs: [bare(reorderedRun.unitId)] });
    expect(response.status).toBe(200);
    const structured = UNIT_ENVELOPE.parse(
      getStructuredContentData(parseJsonRpcResult(parseSseEnvelope(response.text))),
    );
    const served = structured.units[0]?.lessons.map((entry) => entry.lesson.id) ?? [];

    expect(served).toStrictEqual([...reorderedRun.lessonIds]);
    expect(served).not.toStrictEqual(idSorted(served));
  });

  it('pages a thread’s units in curriculum order over the real transport', async () => {
    const expected = reorderedSequence.placements.map((placement) => placement.unitId);
    const response = await callMisconceptionGraph({
      threadSlug: bare(reorderedSequence.threadId),
      unitLimit: 25,
    });
    expect(response.status).toBe(200);
    const structured = THREAD_ENVELOPE.parse(
      getStructuredContentData(parseJsonRpcResult(parseSseEnvelope(response.text))),
    );
    const served = structured.threads[0]?.units.map((entry) => entry.unit.id) ?? [];
    // The window is the first page; this sequence is one subject's run, and a
    // multi-subject thread's window opens with its first subject — so the
    // served prefix must equal this run's prefix, in order.
    const prefix = expected.slice(0, served.length);

    expect(served.slice(0, prefix.length)).toStrictEqual(prefix);
    expect(served).not.toStrictEqual(idSorted(served));
  });

  it('rejects an anchorless call at the input boundary', async () => {
    const response = await callMisconceptionGraph({});

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
  });
});

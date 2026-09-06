import assert from 'node:assert/strict';
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

/** The unit-anchored envelope: each unit's lessons in the order the wire delivers them. */
const UNIT_ENVELOPE = z.object({
  anchorKind: z.literal('unit'),
  units: z.array(
    z.object({
      unit: z.object({ id: z.string() }),
      lessons: z.array(z.object({ lesson: z.object({ id: z.string() }) })),
    }),
  ),
});
/** The thread-anchored envelope: the window's units in the order the wire delivers them, with its honest totals. */
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
assert.ok(
  reorderedRun !== undefined,
  'corpus has no unit whose authored lesson order differs from id order',
);
// The thread fixture: a thread spanning subjects, small enough that one page
// holds every unit, with a subject run whose curriculum order differs from id
// order — so one served page proves the join between subject runs, the
// revisited-unit dedup, and the order, all over the real transport.
const THREAD_PAGE_LIMIT = 25;
const isReordered = (ids: readonly string[]): boolean =>
  ids.length > 2 && ids.join() !== idSorted(ids).join();
const sequencesByThread = new Map<string, (typeof graphCorpus.sequences)[number][]>();
for (const sequence of graphCorpus.sequences) {
  sequencesByThread.set(sequence.threadId, [
    ...(sequencesByThread.get(sequence.threadId) ?? []),
    sequence,
  ]);
}
const multiSubjectThread = [...sequencesByThread.entries()].find(
  ([, sequences]) =>
    sequences.length > 1 &&
    sequences.reduce((count, sequence) => count + sequence.placements.length, 0) <=
      THREAD_PAGE_LIMIT &&
    sequences.some((sequence) => isReordered(sequence.placements.map((p) => p.unitId))),
);
assert.ok(
  multiSubjectThread !== undefined,
  'corpus has no multi-subject thread that fits one page with a reordered run',
);
const [multiSubjectThreadId, multiSubjectSequences] = multiSubjectThread;
// Each subject run in corpus order, joined; a revisited unit kept at its first placement.
const expectedThreadPage = [
  ...new Set(multiSubjectSequences.flatMap((sequence) => sequence.placements.map((p) => p.unitId))),
];
const bare = (id: string): string => id.slice(id.indexOf(':') + 1);
/** A lesson slug carrying a misconception, chosen deterministically (lexicographic minimum edge source). */
const firstLessonId = graphCorpus.edges
  .filter((edge) => edge.type === 'addressesMisconception')
  .map((edge) => edge.source)
  .sort((a, b) => a.localeCompare(b))[0];
assert.ok(
  firstLessonId !== undefined,
  'corpus has no addressesMisconception edge to anchor the e2e test',
);
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
    const response = await callMisconceptionGraph({
      threadSlug: bare(multiSubjectThreadId),
      unitLimit: THREAD_PAGE_LIMIT,
    });
    expect(response.status).toBe(200);
    const structured = THREAD_ENVELOPE.parse(
      getStructuredContentData(parseJsonRpcResult(parseSseEnvelope(response.text))),
    );
    const thread = structured.threads[0];
    const served = thread?.units.map((entry) => entry.unit.id) ?? [];
    // One page holds the whole thread, so the served page must be every subject
    // run joined in corpus order with revisited units once — never interleaved,
    // never re-sorted between the view and the wire.
    expect(served).toStrictEqual(expectedThreadPage);
    expect(thread?.totalUnits).toBe(expectedThreadPage.length);
    expect(thread?.hasMore).toBe(false);
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

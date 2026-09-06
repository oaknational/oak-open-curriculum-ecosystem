/**
 * Integration tests for the anchored get-misconception-graph tool (G2 c3).
 *
 * @remarks
 * Integration, not unit: the tool reads the compile-time graph corpus, whose
 * module loads `data.json` at import time (IO), and the anchor fixtures are
 * derived from that corpus.
 *
 * These tests describe the TOOL ENVELOPE: input parsing at the MCP boundary
 * (exactly one anchor mode per call; the unit window belongs to the thread
 * anchor), dispatch to the misconception view, and the response shape
 * (summary TextContent + serialised JSON TextContent + structuredContent).
 * The chain retrieval semantics themselves — anchor resolution,
 * curriculum-ordered windows, heavy-tail coverage honesty — are specified by the view's own
 * tests in `@oaknational/graph-corpus-sdk` and are not re-specified here.
 *
 * Anchor fixtures are chosen deterministically from the corpus so the tests
 * describe behaviour over any valid corpus rather than pinning content.
 *
 * The advertised-examples coherence block deliberately pins that the
 * schema's own example values resolve against the shipped corpus (MCP-319).
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import {
  DEFAULT_THREAD_UNIT_LIMIT,
  MAX_THREAD_UNIT_LIMIT,
} from '@oaknational/graph-corpus-sdk/curriculum';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  GET_MISCONCEPTION_GRAPH_TOOL_DEF,
  GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA,
  runMisconceptionGraphTool,
} from './aggregated-misconception-graph.js';
import { advertisedExamples, wireProperties } from './test-helpers/advertised-examples.js';

/** Narrows a deterministic fixture pick, failing loudly if the corpus cannot supply it. */
function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

const bareSlug = (id: string): string => id.slice(id.indexOf(':') + 1);

/** A lesson slug carrying at least one misconception (lexicographic minimum edge source). */
const knownLessonSlug = bareSlug(
  required(
    graphCorpus.edges
      .filter((edge) => edge.type === 'addressesMisconception')
      .map((edge) => edge.source)
      .sort((a, b) => a.localeCompare(b))[0],
    'corpus has no addressesMisconception edge to anchor the tool tests',
  ),
);

/** A unit slug placing at least one lesson (lexicographic minimum edge source). */
const knownUnitSlug = bareSlug(
  required(
    graphCorpus.edges
      .filter((edge) => edge.type === 'containsLesson')
      .map((edge) => edge.source)
      .sort((a, b) => a.localeCompare(b))[0],
    'corpus has no containsLesson edge to anchor the tool tests',
  ),
);

/** The thread with the most units — the heavy-tail fixture for window honesty. */
const megaThread = required(
  (() => {
    const counts = new Map<string, number>();
    for (const edge of graphCorpus.edges) {
      if (edge.type === 'containsUnit') {
        counts.set(edge.source, (counts.get(edge.source) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([threadId, unitCount]) => ({ threadSlug: bareSlug(threadId), unitCount }))
      .sort((a, b) => b.unitCount - a.unitCount || a.threadSlug.localeCompare(b.threadSlug))[0];
  })(),
  'corpus has no containsUnit edge to anchor the tool tests',
);

const TEXT_CONTENT = z.object({ type: z.literal('text'), text: z.string() });

/** Non-strict envelope narrowing per anchor kind (the family envelope adds summary/status fields). */
const LESSON_ENVELOPE = z.object({
  anchorKind: z.literal('lesson'),
  lessons: z.array(z.object({ lesson: z.unknown(), misconceptions: z.array(z.unknown()) })),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

const UNIT_ENVELOPE = z.object({
  anchorKind: z.literal('unit'),
  units: z.array(z.object({ unit: z.unknown(), lessons: z.array(z.unknown()) })),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

const THREAD_ENVELOPE = z.object({
  anchorKind: z.literal('thread'),
  threads: z.array(
    z.object({
      thread: z.unknown(),
      totalUnits: z.number(),
      unitOffset: z.number(),
      unitLimit: z.number(),
      hasMore: z.boolean(),
      units: z.array(z.unknown()),
    }),
  ),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

describe('GET_MISCONCEPTION_GRAPH_TOOL_DEF', () => {
  it('describes the anchored bounded contract, not a whole-corpus dump', () => {
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('anchor');
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('lessonSlugs');
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('unitSlugs');
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('threadSlug');
    // The ordering basis is a served commitment (MCP-682); a later edit that
    // drops it must fail here, as the sibling thread-progressions test pins.
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('authored');
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('curriculum order');
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).not.toContain(
      'Returns the Oak Curriculum misconception graph',
    );
  });

  it('states the thread-reachability caveat (results are never subject-complete)', () => {
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('subject-complete');
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: GET_MISCONCEPTION_GRAPH_TOOL_DEF.title,
    });
  });
});

describe('runMisconceptionGraphTool', () => {
  it('returns the lesson-anchored envelope: summary + JSON content and structuredContent', () => {
    const result = runMisconceptionGraphTool({ lessonSlugs: [knownLessonSlug] });

    expect(result.isError).toBeUndefined();
    // MCP spec SHOULD: structured content is mirrored by serialised TextContent.
    expect(result.content).toHaveLength(2);
    const [summary, json] = result.content;
    expect(summary).toMatchObject({ type: 'text' });
    expect(json).toMatchObject({ type: 'text' });

    const structured = LESSON_ENVELOPE.parse(result.structuredContent);
    expect(structured.resolvedAnchors).toHaveLength(1);
    expect(structured.resolvedAnchors[0]).toContain(knownLessonSlug);
    expect(structured.unknownAnchors).toStrictEqual([]);
    expect(structured.lessons).toHaveLength(1);
    // The ratified leaf-anchor bound: every lesson carries at most two misconceptions.
    expect(structured.lessons[0]?.misconceptions.length).toBeLessThanOrEqual(2);
  });

  it('returns the unit-anchored envelope with the unit entry shape', () => {
    const result = runMisconceptionGraphTool({ unitSlugs: [knownUnitSlug] });

    expect(result.isError).toBeUndefined();
    const structured = UNIT_ENVELOPE.parse(result.structuredContent);
    expect(structured.resolvedAnchors).toHaveLength(1);
    expect(structured.units).toHaveLength(1);
    expect(structured.units[0]?.lessons.length).toBeGreaterThan(0);
  });

  it('returns the thread-anchored envelope with honest window coverage (heavy tail)', () => {
    const result = runMisconceptionGraphTool({ threadSlug: megaThread.threadSlug });

    expect(result.isError).toBeUndefined();
    const structured = THREAD_ENVELOPE.parse(result.structuredContent);
    const entry = required(structured.threads[0], 'mega-thread anchor resolved no entry');
    expect(entry.totalUnits).toBe(megaThread.unitCount);
    expect(entry.unitLimit).toBe(DEFAULT_THREAD_UNIT_LIMIT);
    expect(entry.units.length).toBeLessThanOrEqual(DEFAULT_THREAD_UNIT_LIMIT);
    expect(entry.hasMore).toBe(megaThread.unitCount > DEFAULT_THREAD_UNIT_LIMIT);
    const summary = TEXT_CONTENT.parse(result.content[0]);
    expect(summary.text).toContain(String(entry.totalUnits));
  });

  it('summarises an offset-beyond-length window as empty, never an inverted range', () => {
    const result = runMisconceptionGraphTool({
      threadSlug: megaThread.threadSlug,
      unitOffset: megaThread.unitCount,
      unitLimit: 5,
    });

    expect(result.isError).toBeUndefined();
    const summary = TEXT_CONTENT.parse(result.content[0]);
    expect(summary.text).toContain('no units in this window');
    expect(summary.text).toContain(String(megaThread.unitCount));
  });

  it('honours an explicit thread window within the ceiling', () => {
    const result = runMisconceptionGraphTool({
      threadSlug: megaThread.threadSlug,
      unitOffset: 1,
      unitLimit: 2,
    });

    expect(result.isError).toBeUndefined();
    const structured = THREAD_ENVELOPE.parse(result.structuredContent);
    expect(structured.threads[0]?.unitOffset).toBe(1);
    expect(structured.threads[0]?.unitLimit).toBe(2);
  });

  it('reports unknown anchors as information, not an error', () => {
    const result = runMisconceptionGraphTool({
      lessonSlugs: [knownLessonSlug, 'definitely-not-a-real-lesson-slug-xyz'],
    });

    expect(result.isError).toBeUndefined();
    const structured = LESSON_ENVELOPE.parse(result.structuredContent);
    expect(structured.unknownAnchors).toStrictEqual(['definitely-not-a-real-lesson-slug-xyz']);
    const summary = TEXT_CONTENT.parse(result.content[0]);
    expect(summary.text).toContain('unknown');
  });

  it('returns a well-formed empty envelope when no anchors resolve', () => {
    const result = runMisconceptionGraphTool({ lessonSlugs: ['no-such-lesson-anywhere'] });

    expect(result.isError).toBeUndefined();
    const structured = LESSON_ENVELOPE.parse(result.structuredContent);
    expect(structured.lessons).toStrictEqual([]);
    expect(structured.resolvedAnchors).toStrictEqual([]);
    expect(structured.unknownAnchors).toStrictEqual(['no-such-lesson-anywhere']);
  });

  it('rejects a call with no anchor at the input boundary', () => {
    const result = runMisconceptionGraphTool({});

    expect(result.isError).toBe(true);
  });

  it('rejects a call with two anchor modes at the input boundary', () => {
    const result = runMisconceptionGraphTool({
      lessonSlugs: [knownLessonSlug],
      unitSlugs: [knownUnitSlug],
    });

    expect(result.isError).toBe(true);
  });

  it('rejects a unit window on a non-thread anchor at the input boundary', () => {
    const result = runMisconceptionGraphTool({
      lessonSlugs: [knownLessonSlug],
      unitLimit: 5,
    });

    expect(result.isError).toBe(true);
  });

  it('rejects a unit window beyond the ceiling at the input boundary', () => {
    const result = runMisconceptionGraphTool({
      threadSlug: megaThread.threadSlug,
      unitLimit: MAX_THREAD_UNIT_LIMIT + 1,
    });

    expect(result.isError).toBe(true);
  });

  it('rejects non-object input at the input boundary', () => {
    const result = runMisconceptionGraphTool('lessonSlugs');

    expect(result.isError).toBe(true);
  });
});

describe('advertised examples are true of the shipped corpus', () => {
  // INVARIANT, do not loosen on a corpus rename: every advertised example
  // must be resolvable by the bundled corpus this package ships — a red here
  // means the metadata and the data have diverged, which is the MCP-319
  // defect class. Deployed truth beyond this corpus: the MCP-303 live drive
  // proves wire-REQUIRED examples only (fetch, download-asset); search's
  // optional-field examples have no standing live probe (routed on MCP-319).
  const shape = GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA;

  it('resolves every advertised lessonSlugs example as a lesson anchor', () => {
    for (const example of advertisedExamples(
      shape.lessonSlugs,
      'lessonSlugs',
      z.array(z.string()),
    )) {
      const result = runMisconceptionGraphTool({ lessonSlugs: example });
      expect(
        result.isError,
        `lessonSlugs example ${JSON.stringify(example)} must resolve`,
      ).toBeUndefined();
      expect(result.structuredContent).toMatchObject({ unknownAnchors: [] });
      const parsed = z
        .object({
          resolvedAnchors: z.array(z.unknown()),
          lessons: z.array(z.object({ misconceptions: z.array(z.unknown()) })),
        })
        .parse(result.structuredContent);
      expect(
        parsed.resolvedAnchors,
        `lessonSlugs example ${JSON.stringify(example)} must resolve an anchor`,
      ).not.toHaveLength(0);
      expect(
        parsed.lessons.flatMap((lesson) => lesson.misconceptions),
        `${JSON.stringify(example)}: resolving lesson anchor must carry misconceptions`,
      ).not.toHaveLength(0);
    }
  });

  it('resolves every advertised unitSlugs example as a unit anchor', () => {
    for (const example of advertisedExamples(shape.unitSlugs, 'unitSlugs', z.array(z.string()))) {
      const result = runMisconceptionGraphTool({ unitSlugs: example });
      expect(
        result.isError,
        `unitSlugs example ${JSON.stringify(example)} must resolve`,
      ).toBeUndefined();
      expect(result.structuredContent).toMatchObject({ unknownAnchors: [] });
      const parsed = z
        .object({
          resolvedAnchors: z.array(z.unknown()),
          units: z.array(z.object({ lessons: z.array(z.unknown()) })),
        })
        .parse(result.structuredContent);
      expect(
        parsed.resolvedAnchors,
        `unitSlugs example ${JSON.stringify(example)} must resolve an anchor`,
      ).not.toHaveLength(0);
      expect(
        parsed.units.flatMap((unit) => unit.lessons),
        `${JSON.stringify(example)}: resolving unit anchor must carry placed lessons`,
      ).not.toHaveLength(0);
    }
  });

  it('resolves every advertised threadSlug example as a thread anchor', () => {
    for (const example of advertisedExamples(shape.threadSlug, 'threadSlug', z.string())) {
      const result = runMisconceptionGraphTool({ threadSlug: example });
      expect(
        result.isError,
        `threadSlug example ${JSON.stringify(example)} must resolve`,
      ).toBeUndefined();
      expect(result.structuredContent).toMatchObject({ unknownAnchors: [] });
      const { resolvedAnchors } = z
        .object({ resolvedAnchors: z.array(z.unknown()) })
        .parse(result.structuredContent);
      expect(
        resolvedAnchors,
        `threadSlug example ${JSON.stringify(example)} must resolve an anchor`,
      ).not.toHaveLength(0);
    }
  });

  it('advertises every example on the wire JSON Schema', () => {
    // The corpus tests above read `.meta()` off the Zod objects; agents
    // read the CONVERTED wire form. This proves the authored metadata
    // survives `z.toJSONSchema()` for every field, wrapped or not.
    const properties = wireProperties(shape);
    const advertising = Object.entries(shape).filter(([, s]) => s.meta()?.examples !== undefined);
    expect(advertising, 'shape advertises no examples at all').not.toHaveLength(0);
    for (const [field, schema] of Object.entries(shape)) {
      expect(properties[field]?.examples, `${field} examples on the wire`).toEqual(
        schema.meta()?.examples,
      );
    }
  });
});

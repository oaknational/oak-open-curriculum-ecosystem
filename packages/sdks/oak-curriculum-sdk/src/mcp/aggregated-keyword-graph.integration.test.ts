/**
 * Integration tests for the anchored get-keyword-graph tool (G4b c3).
 *
 * @remarks
 * Integration, not unit: the tool reads the compile-time graph corpus, whose
 * module loads `data.json` at import time (IO), and the anchor fixtures are
 * derived from that corpus.
 *
 * These tests describe the TOOL ENVELOPE: input parsing at the MCP boundary
 * (`subject` + `keyStage` required together; optional `unitSlugs` /
 * `lessonSlugs` narrowing; optional `limit`), dispatch to the keyword view,
 * and the response shape (summary TextContent + serialised JSON TextContent +
 * structuredContent). The retrieval semantics themselves — scoped-count
 * ranking, per-definition lesson windowing, limit validation, narrowing — are specified
 * by the view's own tests in `@oaknational/graph-corpus-sdk` and are not
 * re-specified here.
 *
 * Anchor fixtures are chosen deterministically from the corpus so the tests
 * describe behaviour over any valid corpus rather than pinning content.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { MAX_KEYWORD_LIMIT } from '@oaknational/graph-corpus-sdk/curriculum';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  GET_KEYWORD_GRAPH_INPUT_SCHEMA,
  GET_KEYWORD_GRAPH_TOOL_DEF,
  runKeywordGraphTool,
} from './aggregated-keyword-graph.js';
import { wireExamplesOf } from './test-helpers/advertised-examples.js';

/** Narrows a deterministic fixture pick, failing loudly if the corpus cannot supply it. */
function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

/** A (subject, keyStage) pair known to carry keyworded lessons (lexicographic minimum). */
const knownAnchor = required(
  (() => {
    const keywordedLessonIds = new Set(
      graphCorpus.edges
        .filter((edge) => edge.type === 'containsKeyword')
        .map((edge) => edge.source),
    );
    return graphCorpus.nodes
      .filter((node) => node.kind === 'lesson' && keywordedLessonIds.has(node.id))
      .map((node) => (node.kind === 'lesson' ? node : undefined))
      .filter((node) => node !== undefined)
      .map((node) => ({ subject: node.subject, keyStage: node.keyStage }))
      .sort(
        (a, b) => a.subject.localeCompare(b.subject) || a.keyStage.localeCompare(b.keyStage),
      )[0];
  })(),
  'corpus has no keyworded lesson to derive a subject+keyStage anchor',
);

const TEXT_CONTENT = z.object({ type: z.literal('text'), text: z.string() });

/** Non-strict envelope narrowing (the family envelope adds summary/status fields). */
const KEYWORD_ENVELOPE = z.object({
  subject: z.string(),
  keyStage: z.string(),
  keywords: z.array(
    z.object({
      keyword: z.object({
        id: z.string(),
        term: z.string(),
        frequency: z.number(),
      }),
      scopedLessonCount: z.number(),
      definitions: z.array(
        z.object({
          term: z.string(),
          definition: z.string(),
          scopedLessonCount: z.number(),
          lessonSlugs: z.array(z.string()),
          hasMoreLessons: z.boolean(),
        }),
      ),
    }),
  ),
  totalMatchingKeywords: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
  resolvedUnitAnchors: z.array(z.string()),
  unknownUnitAnchors: z.array(z.string()),
  resolvedLessonAnchors: z.array(z.string()),
  unknownLessonAnchors: z.array(z.string()),
});

describe('GET_KEYWORD_GRAPH_TOOL_DEF', () => {
  it('describes the anchored bounded ranked contract, not a whole-corpus dump', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('anchored');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('subject');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('keyStage');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('bounded');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('rank');
  });

  it('names the per-definition fields an agent reads', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('definitions');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('lessonSlugs');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('hasMoreLessons');
  });

  it('states the snapshot semantics honestly', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('snapshot');
  });

  it('carries the large-payload hint, naming its narrowing', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('large payload at broad scope');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('`unitSlugs`');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('`lessonSlugs`');
  });

  it('states the firstYear key-stage coarseness', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('firstYear');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('key-stage');
  });

  it('disambiguates against get-keywords by name, stating when to prefer each', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description).toContain('get-keywords');
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.description.toLowerCase()).toContain('live');
  });

  it('is read-only, idempotent, and closed-world', () => {
    expect(GET_KEYWORD_GRAPH_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: GET_KEYWORD_GRAPH_TOOL_DEF.title,
    });
  });
});

describe('runKeywordGraphTool — anchor requirements at the boundary', () => {
  it('rejects a call with no anchor', () => {
    const result = runKeywordGraphTool({});

    expect(result.isError).toBe(true);
  });

  it('rejects a subject without its keyStage half', () => {
    const result = runKeywordGraphTool({ subject: knownAnchor.subject });

    expect(result.isError).toBe(true);
  });

  it('rejects a keyStage without its subject half', () => {
    const result = runKeywordGraphTool({ keyStage: knownAnchor.keyStage });

    expect(result.isError).toBe(true);
  });

  // Since the input schema carries .max(MAX_KEYWORD_LIMIT), the rejection
  // fires at the Zod parse boundary; the view-layer validateLimit remains
  // as defence-in-depth for direct unvalidated calls.
  it('rejects a limit beyond the view ceiling as a boundary error', () => {
    const result = runKeywordGraphTool({
      ...knownAnchor,
      limit: MAX_KEYWORD_LIMIT + 1,
    });

    expect(result.isError).toBe(true);
  });
});

describe('runKeywordGraphTool — anchored retrieval envelope', () => {
  it('returns ranked bounded keywords in structuredContent with paired TextContent', () => {
    const result = runKeywordGraphTool(knownAnchor);

    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(2);
    for (const block of result.content) {
      expect(TEXT_CONTENT.safeParse(block).success).toBe(true);
    }

    const envelope = KEYWORD_ENVELOPE.parse(result.structuredContent);
    expect(envelope.subject).toBe(knownAnchor.subject);
    expect(envelope.keyStage).toBe(knownAnchor.keyStage);
    expect(envelope.keywords.length).toBeGreaterThan(0);
    expect(envelope.keywords.length).toBeLessThanOrEqual(envelope.limit);
    expect(envelope.totalMatchingKeywords).toBeGreaterThanOrEqual(envelope.keywords.length);
    // Every placed keyword carries an authored definition, and every definition names a lesson.
    for (const entry of envelope.keywords) {
      expect(entry.definitions.length).toBeGreaterThan(0);
      for (const definition of entry.definitions) {
        expect(definition.lessonSlugs.length).toBeGreaterThan(0);
      }
    }
  });

  it('propagates an explicit limit into the envelope', () => {
    const result = runKeywordGraphTool({ ...knownAnchor, limit: 3 });

    expect(result.isError).toBeUndefined();
    const envelope = KEYWORD_ENVELOPE.parse(result.structuredContent);
    expect(envelope.limit).toBe(3);
    expect(envelope.keywords.length).toBeLessThanOrEqual(3);
  });

  it('reports unknown narrowing slugs without erroring', () => {
    const result = runKeywordGraphTool({
      ...knownAnchor,
      unitSlugs: ['no-such-unit-slug-xyz'],
      lessonSlugs: ['no-such-lesson-slug-xyz'],
    });

    expect(result.isError).toBeUndefined();
    const envelope = KEYWORD_ENVELOPE.parse(result.structuredContent);
    expect(envelope.unknownUnitAnchors).toEqual(['no-such-unit-slug-xyz']);
    expect(envelope.unknownLessonAnchors).toEqual(['no-such-lesson-slug-xyz']);
  });

  it('returns a well-formed empty result for an unknown subject', () => {
    const result = runKeywordGraphTool({
      subject: 'no-such-subject-xyz',
      keyStage: knownAnchor.keyStage,
    });

    expect(result.isError).toBeUndefined();
    const envelope = KEYWORD_ENVELOPE.parse(result.structuredContent);
    expect(envelope.keywords).toEqual([]);
    expect(envelope.totalMatchingKeywords).toBe(0);
    expect(envelope.hasMore).toBe(false);
  });
});

describe('get-keyword-graph wire schema — advertised examples (MCP-303 drive-leg cure)', () => {
  // Behaviour, never config (owner ruling 2026-07-28): the `.meta()` must
  // survive the z.toJSONSchema round-trip so clients can derive a call (the
  // drive leg's founding finding), and WHATEVER anchor it advertises must
  // yield a live graph from the shipped corpus — an advertised example that
  // returns an empty graph teaches every client a dead value. The values
  // themselves are config and are not pinned.
  it('every advertised subject and keyStage example yields a live keyword graph', () => {
    // Per-ELEMENT existential, not per-pair universal: every advertised
    // element must be live in at least one advertised pairing — a
    // subject × keyStage join is not promised non-empty for every pairing,
    // and isError is the wrong probe (an unmatched anchor returns a
    // well-formed EMPTY envelope by design), so liveness is counted.
    const subjects = wireExamplesOf(GET_KEYWORD_GRAPH_INPUT_SCHEMA, 'subject', z.string());
    const keyStages = wireExamplesOf(GET_KEYWORD_GRAPH_INPUT_SCHEMA, 'keyStage', z.string());
    const liveKeywordCount = (subject: string, keyStage: string): number =>
      KEYWORD_ENVELOPE.parse(runKeywordGraphTool({ subject, keyStage }).structuredContent).keywords
        .length;

    for (const subject of subjects) {
      const live = keyStages.filter((keyStage) => liveKeywordCount(subject, keyStage) > 0);
      expect(
        live,
        `subject example ${subject} is dead for every advertised keyStage`,
      ).not.toHaveLength(0);
    }
    for (const keyStage of keyStages) {
      const live = subjects.filter((subject) => liveKeywordCount(subject, keyStage) > 0);
      expect(
        live,
        `keyStage example ${keyStage} is dead for every advertised subject`,
      ).not.toHaveLength(0);
    }
  });
});

/**
 * Integration tests for the anchored get-thread-progressions tool (G3 c2).
 *
 * @remarks
 * Integration, not unit: the tool reads the compile-time graph corpus, whose
 * module loads `data.json` at import time (IO), and the anchor fixtures are
 * derived from that corpus.
 *
 * These tests describe the TOOL ENVELOPE: input parsing at the MCP boundary
 * (exactly one anchor mode per call — `threadSlug` detail, or
 * `subject`+`keyStage` discovery), dispatch to the thread-progressions view,
 * and the response shape (summary TextContent + serialised JSON TextContent +
 * structuredContent). The retrieval semantics themselves — year ordering,
 * descriptor shape, anchor resolution — are specified by the view's own tests
 * in `@oaknational/graph-corpus-sdk` and are not re-specified here.
 *
 * Anchor fixtures are chosen deterministically from the corpus so the tests
 * describe behaviour over any valid corpus rather than pinning content.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  GET_THREAD_PROGRESSIONS_TOOL_DEF,
  runThreadProgressionsTool,
} from './aggregated-thread-progressions.js';

/** Narrows a deterministic fixture pick, failing loudly if the corpus cannot supply it. */
function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

const bareSlug = (id: string): string => id.slice(id.indexOf(':') + 1);

/** A thread slug carrying at least one placement (lexicographic minimum sequence). */
const knownThreadSlug = bareSlug(
  required(
    graphCorpus.sequences.filter((sequence) => sequence.placements.length > 0)[0]?.threadId,
    'corpus has no non-empty sequence to anchor the tool tests',
  ),
);

/** A (subject, keyStage) pair known to exist on a sequenced unit. */
const knownSubjectKeyStage = required(
  (() => {
    const placedUnitIds = new Set(
      graphCorpus.sequences.flatMap((sequence) =>
        sequence.placements.map((placement) => placement.unitId),
      ),
    );
    const unit = graphCorpus.nodes.find(
      (node) => node.kind === 'unit' && placedUnitIds.has(node.id),
    );
    return unit?.kind === 'unit' ? { subject: unit.subject, keyStage: unit.keyStage } : undefined;
  })(),
  'corpus has no sequenced unit to derive a subject+keyStage anchor',
);

const TEXT_CONTENT = z.object({ type: z.literal('text'), text: z.string() });

/** Non-strict envelope narrowing per anchor kind (the family envelope adds summary/status fields). */
const THREAD_ENVELOPE = z.object({
  anchorKind: z.literal('thread'),
  threads: z.array(
    z.object({
      thread: z.unknown(),
      totalUnits: z.number(),
      entries: z.array(z.object({ unit: z.unknown(), year: z.number().optional() })),
    }),
  ),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

const DISCOVERY_ENVELOPE = z.object({
  anchorKind: z.literal('subjectKeyStage'),
  subject: z.string(),
  keyStage: z.string(),
  threads: z.array(
    z.object({ thread: z.unknown(), totalUnits: z.number(), subjects: z.array(z.string()) }),
  ),
});

describe('GET_THREAD_PROGRESSIONS_TOOL_DEF', () => {
  it('describes the anchored bounded contract, not a whole-corpus dump', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('anchor');
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('threadSlug');
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('subject + keyStage');
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).not.toContain('complete static graph');
  });

  it('states the year-axis ordering semantics honestly', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('teaching year');
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain(
      'Within one year the order is not curricular',
    );
  });

  it('is read-only, idempotent, and closed-world', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });
});

describe('runThreadProgressionsTool — anchor exclusivity at the boundary', () => {
  it('rejects a call with no anchor', () => {
    const result = runThreadProgressionsTool({});

    expect(result.isError).toBe(true);
  });

  it('rejects combining threadSlug with the discovery anchor', () => {
    const result = runThreadProgressionsTool({
      threadSlug: knownThreadSlug,
      subject: knownSubjectKeyStage.subject,
      keyStage: knownSubjectKeyStage.keyStage,
    });

    expect(result.isError).toBe(true);
  });

  it('rejects a discovery anchor missing its other half', () => {
    const result = runThreadProgressionsTool({ subject: knownSubjectKeyStage.subject });

    expect(result.isError).toBe(true);
  });
});

describe('runThreadProgressionsTool — thread detail anchor', () => {
  it('returns one thread’s progression in structuredContent with paired TextContent', () => {
    const result = runThreadProgressionsTool({ threadSlug: knownThreadSlug });

    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(2);
    for (const block of result.content) {
      expect(TEXT_CONTENT.safeParse(block).success).toBe(true);
    }

    const envelope = THREAD_ENVELOPE.parse(result.structuredContent);
    expect(envelope.threads).toHaveLength(1);
    expect(envelope.resolvedAnchors).toEqual([`thread:${knownThreadSlug}`]);
    expect(envelope.threads[0]?.entries.length).toBeGreaterThan(0);
  });

  it('reports an unknown thread slug without erroring (well-formed empty)', () => {
    const result = runThreadProgressionsTool({ threadSlug: 'no-such-thread' });

    expect(result.isError).toBeUndefined();
    const envelope = THREAD_ENVELOPE.parse(result.structuredContent);
    expect(envelope.threads).toEqual([]);
    expect(envelope.unknownAnchors).toEqual(['no-such-thread']);
  });
});

describe('runThreadProgressionsTool — subject+keyStage discovery anchor', () => {
  it('returns bounded descriptors without sequences', () => {
    const result = runThreadProgressionsTool(knownSubjectKeyStage);

    expect(result.isError).toBeUndefined();
    const envelope = DISCOVERY_ENVELOPE.parse(result.structuredContent);
    expect(envelope.threads.length).toBeGreaterThan(0);
    expect(envelope.threads.length).toBeLessThan(graphCorpus.sequences.length);
    expect(envelope.threads[0]).not.toHaveProperty('entries');
  });

  it('returns a well-formed empty result for an unmatched anchor', () => {
    const result = runThreadProgressionsTool({ subject: 'no-such-subject', keyStage: 'ks2' });

    expect(result.isError).toBeUndefined();
    const envelope = DISCOVERY_ENVELOPE.parse(result.structuredContent);
    expect(envelope.threads).toEqual([]);
  });
});

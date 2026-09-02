/**
 * Integration tests for the anchored get-prior-knowledge-graph tool.
 *
 * @remarks
 * Integration, not unit: the tool reads the compile-time graph corpus, whose
 * module loads `data.json` at import time (IO), and the anchor fixture is
 * derived from that corpus.
 *
 * These tests describe the TOOL ENVELOPE: input parsing at the MCP boundary,
 * dispatch to the statements view, and the response shape (summary
 * TextContent + serialised JSON TextContent + structuredContent). Anchor
 * resolution semantics are specified by the view's own tests in
 * `@oaknational/graph-corpus-sdk` and are not re-specified here.
 *
 * Anchor fixtures are chosen deterministically from the corpus so the tests
 * describe behaviour over any valid corpus rather than pinning content.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
  GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF,
  runPriorKnowledgeGraphTool,
} from './aggregated-prior-knowledge-graph.js';
import { wireExamplesOf } from './test-helpers/advertised-examples.js';

/** A corpus unit slug, chosen deterministically (lexicographic minimum). */
const firstUnitSlug = graphCorpus.nodes
  .filter((node) => node.kind === 'unit')
  .map((node) => node.unitSlug)
  .sort((a, b) => a.localeCompare(b))[0];
if (firstUnitSlug === undefined) {
  throw new Error('corpus has no unit nodes to anchor the tool tests');
}
const knownUnitSlug: string = firstUnitSlug;

/**
 * Schema-driven narrowing of the carrier's loose `structuredContent` — the
 * test-boundary alternative to a type assertion. Non-strict: the family
 * envelope adds `summary` / `status` alongside the statements fields.
 */
const STATEMENTS_ENVELOPE = z.object({
  units: z.array(
    z.object({
      unitSlug: z.string(),
      priorKnowledge: z.array(z.string()),
      threadSlugs: z.array(z.string()),
    }),
  ),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
});

const TEXT_CONTENT = z.object({ type: z.literal('text'), text: z.string() });

describe('GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF', () => {
  it('describes the anchored stated-statements contract, not a traversal', () => {
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('anchor');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('unitSlugs');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('stated prior knowledge');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).not.toContain('depth');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).not.toContain('subgraph');
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.title,
    });
  });
});

describe('runPriorKnowledgeGraphTool', () => {
  it('returns the statements envelope for a known anchor: summary + JSON content and structuredContent', () => {
    const result = runPriorKnowledgeGraphTool({ unitSlugs: [knownUnitSlug] });

    expect(result.isError).toBeUndefined();
    // MCP spec SHOULD: structured content is mirrored by serialised TextContent.
    expect(result.content).toHaveLength(2);
    const [summary, json] = result.content;
    expect(summary).toMatchObject({ type: 'text' });
    expect(json).toMatchObject({ type: 'text' });

    const structured = STATEMENTS_ENVELOPE.parse(result.structuredContent);
    expect(structured.resolvedAnchors).toHaveLength(1);
    expect(structured.resolvedAnchors[0]).toContain(knownUnitSlug);
    expect(structured.unknownAnchors).toStrictEqual([]);
    expect(structured.units).toHaveLength(1);
    expect(structured.units[0]?.unitSlug).toBe(knownUnitSlug);
  });

  it('reports unknown anchors as information, not an error', () => {
    const result = runPriorKnowledgeGraphTool({
      unitSlugs: [knownUnitSlug, 'definitely-not-a-real-unit-slug-xyz'],
    });

    expect(result.isError).toBeUndefined();
    const structured = STATEMENTS_ENVELOPE.parse(result.structuredContent);
    expect(structured.unknownAnchors).toStrictEqual(['definitely-not-a-real-unit-slug-xyz']);
    const summary = TEXT_CONTENT.parse(result.content[0]);
    expect(summary.text).toContain('unknown');
  });

  it('returns a well-formed empty envelope when no anchors resolve', () => {
    const result = runPriorKnowledgeGraphTool({ unitSlugs: ['no-such-unit-anywhere'] });

    expect(result.isError).toBeUndefined();
    const structured = STATEMENTS_ENVELOPE.parse(result.structuredContent);
    expect(structured.units).toStrictEqual([]);
    expect(structured.resolvedAnchors).toStrictEqual([]);
    expect(structured.unknownAnchors).toStrictEqual(['no-such-unit-anywhere']);
  });

  it('strips the retired depth input rather than erroring (old callers keep working)', () => {
    const result = runPriorKnowledgeGraphTool({ unitSlugs: [knownUnitSlug], depth: 2 });

    expect(result.isError).toBeUndefined();
    const structured = STATEMENTS_ENVELOPE.parse(result.structuredContent);
    expect(structured.resolvedAnchors).toHaveLength(1);
  });

  it('rejects input without unitSlugs at the input boundary', () => {
    const result = runPriorKnowledgeGraphTool({});

    expect(result.isError).toBe(true);
  });

  it('rejects non-object input at the input boundary', () => {
    const result = runPriorKnowledgeGraphTool('unitSlugs');

    expect(result.isError).toBe(true);
  });
});

describe('get-prior-knowledge-graph wire schema — advertised examples (MCP-303 drive-leg cure)', () => {
  // Behaviour, never config (owner ruling 2026-07-28): the `.meta()` must
  // survive the z.toJSONSchema round-trip so clients can derive a call (the
  // drive leg's founding finding), and WHATEVER anchor it advertises must
  // resolve in the corpus this SDK ships — a dead example teaches every
  // client a dead value. The value itself is config and is not pinned.
  it('every wire-advertised example invocation resolves against the shipped corpus', () => {
    // Every advertised element, not only the first: a later-added stale
    // example must not hide behind a green first element (the helper's
    // .min(1) guard guarantees this loop is never vacuous).
    for (const exampleAnchor of wireExamplesOf(
      GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
      'unitSlugs',
      z.array(z.string()).min(1),
    )) {
      const result = runPriorKnowledgeGraphTool({ unitSlugs: exampleAnchor });

      expect(
        result.isError,
        `advertised anchor ${JSON.stringify(exampleAnchor)} must resolve`,
      ).toBeUndefined();
      const envelope = STATEMENTS_ENVELOPE.parse(result.structuredContent);
      expect(envelope.unknownAnchors).toEqual([]);
      expect(envelope.resolvedAnchors.length).toBeGreaterThan(0);
    }
  });
});

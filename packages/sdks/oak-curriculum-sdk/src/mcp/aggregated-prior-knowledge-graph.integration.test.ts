/**
 * Integration tests for the anchored get-prior-knowledge-graph tool (G1b c2).
 *
 * @remarks
 * Integration, not unit: the tool reads the compile-time graph corpus, whose
 * module loads `data.json` at import time (IO), and the anchor fixture is
 * derived from that corpus.
 *
 * These tests describe the TOOL ENVELOPE: input parsing at the MCP boundary,
 * dispatch to the prior-knowledge view, and the response shape (summary
 * TextContent + serialised JSON TextContent + structuredContent). The
 * traversal semantics themselves — predecessor direction, depth bounds,
 * anchor resolution — are specified by the view's own tests in
 * `@oaknational/graph-corpus-sdk` and are not re-specified here.
 *
 * Anchor fixtures are chosen deterministically from the corpus so the tests
 * describe behaviour over any valid corpus rather than pinning content.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { MAX_PREREQUISITE_DEPTH } from '@oaknational/graph-corpus-sdk/curriculum';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF,
  runPriorKnowledgeGraphTool,
} from './aggregated-prior-knowledge-graph.js';

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
 * envelope adds `summary` / `oakContextHint` / `status` alongside the
 * subgraph fields.
 */
const SUBGRAPH_ENVELOPE = z.object({
  nodes: z.array(z.unknown()),
  edges: z.array(z.unknown()),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
  depth: z.number(),
});

const TEXT_CONTENT = z.object({ type: z.literal('text'), text: z.string() });

describe('GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF', () => {
  it('describes the anchored bounded contract, not a whole-corpus dump', () => {
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('anchor');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('unitSlugs');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('depth');
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).not.toContain(
      'complete prior knowledge graph',
    );
  });

  it('does not include prerequisite guidance (graph tools are loaded as needed, not prerequisites)', () => {
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).not.toContain(
      'You MUST call `get-curriculum-model` first',
    );
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.description).not.toContain(
      'You MUST call this tool before using other curriculum tools',
    );
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });
});

describe('runPriorKnowledgeGraphTool', () => {
  it('returns the bounded subgraph envelope for a known anchor: summary + JSON content and structuredContent', () => {
    const result = runPriorKnowledgeGraphTool({ unitSlugs: [knownUnitSlug] });

    expect(result.isError).toBeUndefined();
    // MCP spec SHOULD: structured content is mirrored by serialised TextContent.
    expect(result.content).toHaveLength(2);
    const [summary, json] = result.content;
    expect(summary).toMatchObject({ type: 'text' });
    expect(json).toMatchObject({ type: 'text' });

    const structured = SUBGRAPH_ENVELOPE.parse(result.structuredContent);
    // Anchor membership only — the corpus id scheme itself is pinned by the
    // view's tests and round-tripped exactly by the e2e test.
    expect(structured.resolvedAnchors).toHaveLength(1);
    expect(structured.resolvedAnchors[0]).toContain(knownUnitSlug);
    expect(structured.unknownAnchors).toStrictEqual([]);
    expect(structured.depth).toBe(2);
  });

  it('reports unknown anchors as information, not an error', () => {
    const result = runPriorKnowledgeGraphTool({
      unitSlugs: [knownUnitSlug, 'definitely-not-a-real-unit-slug-xyz'],
    });

    expect(result.isError).toBeUndefined();
    const structured = SUBGRAPH_ENVELOPE.parse(result.structuredContent);
    expect(structured.unknownAnchors).toStrictEqual(['definitely-not-a-real-unit-slug-xyz']);
    const summary = TEXT_CONTENT.parse(result.content[0]);
    expect(summary.text).toContain('unknown');
  });

  it('returns a well-formed empty envelope when no anchors resolve', () => {
    const result = runPriorKnowledgeGraphTool({ unitSlugs: ['no-such-unit-anywhere'] });

    expect(result.isError).toBeUndefined();
    const structured = SUBGRAPH_ENVELOPE.parse(result.structuredContent);
    expect(structured.nodes).toStrictEqual([]);
    expect(structured.edges).toStrictEqual([]);
    expect(structured.resolvedAnchors).toStrictEqual([]);
    expect(structured.unknownAnchors).toStrictEqual(['no-such-unit-anywhere']);
  });

  it('honours an explicit depth within the ceiling', () => {
    const result = runPriorKnowledgeGraphTool({ unitSlugs: [knownUnitSlug], depth: 1 });

    expect(result.isError).toBeUndefined();
    expect(SUBGRAPH_ENVELOPE.parse(result.structuredContent).depth).toBe(1);
  });

  it('rejects a depth beyond the ceiling at the input boundary', () => {
    const result = runPriorKnowledgeGraphTool({
      unitSlugs: [knownUnitSlug],
      depth: MAX_PREREQUISITE_DEPTH + 1,
    });

    expect(result.isError).toBe(true);
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

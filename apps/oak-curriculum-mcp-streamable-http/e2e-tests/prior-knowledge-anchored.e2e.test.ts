/**
 * E2E (G1b c2): `tools/call` on the anchored get-prior-knowledge-graph.
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
 * subgraph fields.
 */
const SUBGRAPH_ENVELOPE = z.object({
  nodes: z.array(z.unknown()),
  edges: z.array(z.unknown()),
  resolvedAnchors: z.array(z.string()),
  unknownAnchors: z.array(z.string()),
  depth: z.number(),
});

/** A corpus unit slug, chosen deterministically (lexicographic minimum). */
const firstUnitSlug = graphCorpus.nodes
  .filter((node) => node.kind === 'unit')
  .map((node) => node.unitSlug)
  .sort((a, b) => a.localeCompare(b))[0];
if (firstUnitSlug === undefined) {
  throw new Error('corpus has no unit nodes to anchor the e2e test');
}
const knownUnitSlug: string = firstUnitSlug;

async function callPriorKnowledgeGraph(args: unknown): Promise<Response> {
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
      params: { name: 'get-prior-knowledge-graph', arguments: args },
    });
}

describe('get-prior-knowledge-graph anchored tools/call', () => {
  it('returns the bounded subgraph for an anchor unit: summary + JSON content and structuredContent', async () => {
    const response = await callPriorKnowledgeGraph({ unitSlugs: [knownUnitSlug] });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);

    const content = getContentArray(result);
    expect(content).toHaveLength(2);

    const structured = SUBGRAPH_ENVELOPE.parse(getStructuredContentData(result));
    expect(structured.resolvedAnchors).toStrictEqual([`unit:${knownUnitSlug}`]);
    expect(structured.unknownAnchors).toStrictEqual([]);
    expect(structured.depth).toBe(2);
    expect(Array.isArray(structured.nodes)).toBe(true);
    expect(Array.isArray(structured.edges)).toBe(true);
  });

  it('rejects an anchorless call at the input boundary', async () => {
    const response = await callPriorKnowledgeGraph({});

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
  });
});

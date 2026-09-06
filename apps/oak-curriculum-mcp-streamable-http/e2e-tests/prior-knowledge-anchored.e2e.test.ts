/**
 * E2E: `tools/call` on the anchored get-prior-knowledge-graph.
 *
 * Exercises the real corpus path through the full HTTP stack — no upstream
 * stub is involved because the aggregated tool reads the compile-time
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

/** A corpus unit node, chosen deterministically (lexicographic minimum slug). */
const firstUnit = graphCorpus.nodes
  .filter((node) => node.kind === 'unit')
  .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))[0];
if (firstUnit === undefined) {
  throw new Error('corpus has no unit nodes to anchor the e2e test');
}
const knownUnitSlug: string = firstUnit.unitSlug;

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
  it('returns the stated prior knowledge for an anchor unit: summary + JSON content and structuredContent', async () => {
    const response = await callPriorKnowledgeGraph({ unitSlugs: [knownUnitSlug] });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);

    const content = getContentArray(result);
    expect(content).toHaveLength(2);

    const structured = STATEMENTS_ENVELOPE.parse(getStructuredContentData(result));
    expect(structured.resolvedAnchors).toStrictEqual([`unit:${knownUnitSlug}`]);
    expect(structured.unknownAnchors).toStrictEqual([]);
    expect(structured.units).toHaveLength(1);
    expect(structured.units[0]?.unitSlug).toBe(knownUnitSlug);
    // The refactor's core value, proven over the wire: the statements arrive
    // from the corpus, not as an empty or reshaped stand-in. Compared against
    // the deduped values — the view collapses exact duplicates by contract, so
    // raw-equality would be fragile if this unit ever gained repeats.
    expect(structured.units[0]?.priorKnowledge).toStrictEqual([
      ...new Set(firstUnit.priorKnowledge),
    ]);
    expect(structured.units[0]?.threadSlugs).toStrictEqual(firstUnit.threadSlugs);
  });

  it('strips the retired depth argument rather than erroring (old callers keep working)', async () => {
    const response = await callPriorKnowledgeGraph({ unitSlugs: [knownUnitSlug], depth: 2 });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);

    const structured = STATEMENTS_ENVELOPE.parse(getStructuredContentData(result));
    expect(structured.resolvedAnchors).toStrictEqual([`unit:${knownUnitSlug}`]);
  });

  it('rejects an anchorless call at the input boundary', async () => {
    const response = await callPriorKnowledgeGraph({});

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
  });
});

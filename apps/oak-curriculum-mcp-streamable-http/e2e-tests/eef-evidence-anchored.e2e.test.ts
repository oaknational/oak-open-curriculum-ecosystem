/**
 * E2E (snagging S1): `tools/call` on get-eef-evidence through the full HTTP
 * stack — the transport-level regression test for the 2026-06-11 Cursor
 * visibility finding.
 *
 * The EEF tool reads the compile-time corpus (no upstream stub involved).
 * The load-bearing assertion is the dual response shape: a success must
 * carry BOTH content blocks (summary + serialised JSON — the only half
 * content-block-only clients such as Cursor render) AND the decorated
 * structuredContent (the half structuredContent-only clients such as
 * Claude Code render). The structuredContent-only shape this supersedes
 * rendered as "(omitted)" in Cursor and shipped unseen precisely because
 * no e2e asserted the EEF call shape.
 *
 * The probe strand is the manual UAT guide's canonical H1 anchor — a fixed
 * published EEF Toolkit strand id.
 *
 * The tool is DORMANT in the canonical definition (owner card 2026-07-23,
 * v1 live set — gated, not removed), so the dual-shape proofs run against a
 * test-injected definition with the row live (the activation seam), keeping
 * the incident regression proof ready for the day the row flips back. The
 * canonical-surface case proves the gate itself end to end.
 */

import { request, type Response } from '../src/test-helpers/loopback-request.js';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createApp } from '../src/application.js';
import {
  SERVED_SURFACE,
  type ServedSurfaceDefinition,
} from '../src/served-surface/served-surface.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  getStructuredContentData,
} from './helpers/sse.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';

const ACCEPT = 'application/json, text/event-stream';

/** The UAT guide's canonical probe strand (fixed published EEF strand id). */
const PROBE_STRAND_ID = 'eef-tl-feedback';

/**
 * Schema-driven narrowing of the loose `structuredContent` record — the
 * envelope fields plus the family decorations the dual shape adds.
 */
const EEF_ENVELOPE = z.object({
  answerType: z.literal('strand-lookup'),
  members: z.array(z.unknown()).length(1),
  edges: z.array(z.unknown()),
  frontier: z.array(z.unknown()),
  provenance: z.object({ source: z.unknown(), licence: z.unknown(), caveats: z.unknown() }),
  summary: z.string(),
  status: z.literal('success'),
});

/** Activation-seam variant: the canonical definition with the EEF row live. */
const WITH_EEF_LIVE: ServedSurfaceDefinition = {
  ...SERVED_SURFACE,
  universalTools: { ...SERVED_SURFACE.universalTools, 'get-eef-evidence': 'live' },
};

async function callEefEvidence(
  args: unknown,
  servedSurface?: ServedSurfaceDefinition,
): Promise<Response> {
  const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
  const app = await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    ...(servedSurface ? { servedSurface } : {}),
  });
  return request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', ACCEPT)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-eef-evidence', arguments: args },
    });
}

describe('get-eef-evidence gating (canonical served surface)', () => {
  it('rejects tools/call on the dormant tool through the full HTTP stack', async () => {
    const response = await callEefEvidence({
      function: 'inspect-strand',
      strandId: PROBE_STRAND_ID,
    });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    // The dormant row is never registered, so the server answers the call
    // with an error-flagged tool result (the SDK's unknown-tool shape) —
    // no EEF content is servable from the canonical surface.
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
  });
});

describe('get-eef-evidence anchored tools/call (dual response shape, activation-seam variant)', () => {
  it('returns BOTH content blocks and decorated structuredContent for an inspect-strand success', async () => {
    const response = await callEefEvidence(
      {
        function: 'inspect-strand',
        strandId: PROBE_STRAND_ID,
      },
      WITH_EEF_LIVE,
    );

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);

    const content = getContentArray(result);
    expect(content).toHaveLength(2);

    const summaryBlock = z.object({ type: z.literal('text'), text: z.string() }).parse(content[0]);
    expect(summaryBlock.text).toMatch(/^EEF evidence \(strand-lookup\): 1 full member strand, /);

    const jsonBlock = z.object({ type: z.literal('text'), text: z.string() }).parse(content[1]);
    const serialisedEnvelope = z
      .object({ answerType: z.literal('strand-lookup'), members: z.array(z.unknown()).length(1) })
      .parse(JSON.parse(jsonBlock.text));
    expect(serialisedEnvelope.answerType).toBe('strand-lookup');

    const structured = EEF_ENVELOPE.parse(getStructuredContentData(result));
    expect(structured.summary).toBe(summaryBlock.text);
  });

  it('rejects an anchorless evidence-for-move at the handler boundary', async () => {
    const response = await callEefEvidence({ function: 'evidence-for-move' }, WITH_EEF_LIVE);

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
    // The spec's error shape carries content + isError only — a refusal
    // must never leak a structuredContent payload.
    expect(result.structuredContent).toBeUndefined();
  });
});

/**
 * The protocol-revision era contract (MCP-644, ADR-229).
 *
 * This app implements the `2025-11-25` revision — a **legacy-era** server in
 * the vocabulary of the current `2026-07-28` revision, which moved the core
 * to per-request metadata and eliminated the `initialize` handshake.
 *
 * That is a safe place to stand only because of one specific behaviour, and
 * this suite is its tripwire. Per `2026-07-28` Streamable HTTP, Backward
 * Compatibility, a dual-era client that meets an HTTP `400` inspects the
 * body before falling back:
 *
 * "If the body contains a recognized modern JSON-RPC error, the server
 * speaks a modern version of MCP — retry using the advertised `supported`
 * versions or correct the request, rather than falling back. If the body is
 * empty or is not a recognized modern JSON-RPC error, fall back to
 * `initialize` and continue with the legacy version for subsequent
 * requests."
 *
 * **Whose obligation this is.** Not the server's. The specification puts no
 * constraint on a legacy server's choice of refusal code: era detection is a
 * client **MAY** and body inspection a client **SHOULD**. The constraint is
 * ours, and it binds because MCP-497 measured that real clients do exactly
 * this at production scale — it rests on evidence, not on conformance. Do
 * not restate it as a spec MUST; ADR-229 §Decision 3 carries the full
 * attribution.
 *
 * **What would break it, stated no wider than the evidence.** If a future
 * SDK release renumbered this refusal into the specification's reserved
 * sub-range — `-32022` (`UnsupportedProtocolVersion`), `-32020`, `-32021`
 * — a client implementing that SHOULD literally would stop falling back
 * and start retrying versions this app's legacy lane cannot serve. The
 * refusal would look *more* spec-shaped and behave *worse*, and the
 * regression is silent on every other gate, so it is asserted here.
 *
 * **The reference client is not one of those clients.** Measured in
 * `@modelcontextprotocol/client@2.0.0` on 2026-09-10: `probeClassifier.ts`
 * puts `-32020` and `-32021` in a `NOT_PROBE_RECOGNIZED` set — "not era
 * evidence — all fall into the conservative legacy default" — and
 * `classifyRpcError` leaves the legacy default on `-32022` only when
 * `parseSupportedList(data)` finds a non-empty string array at
 * `data.supported`. A `-32022` carrying only a message, which is what a
 * straight renumbering of this transport's refusal would emit, still falls
 * back; so does every unlisted code, `-32602` included. The population this
 * suite protects is therefore **spec-literal clients plus the production
 * clients MCP-497 actually measured**, not the reference implementation.
 * Do not restate the risk as "dual-era clients would stop falling back".
 *
 * These tests describe the served endpoint's answers, driven over the
 * loopback harness through the production per-request factory and handler
 * (`initializeCoreEndpoints` → `createMcpHandler`), with the auth layer
 * omitted — see the `beforeAll` note. Assertions are on JSON-RPC *values*,
 * never on SSE framing; framing fidelity is the client SDK's job, per
 * `testing-patterns.md` §MCP Transport Layer Testing.
 *
 * @see ADR-229 — the revision posture and the conditions for migrating
 * @see ADR-112 — the per-request transport this composition reuses
 */

import { request } from './test-helpers/loopback-request.js';
import { beforeAll, describe, expect, it } from 'vitest';
import express, { type Express } from 'express';
import { z } from 'zod';
import { LATEST_PROTOCOL_VERSION } from '@modelcontextprotocol/sdk/types.js';
import { initializeCoreEndpoints } from './app/core-endpoints.js';
import { createMcpHandler } from './mcp-handler.js';
import { createFakeLogger, createFakeHttpObservability } from './test-helpers/fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

/** The revision this app implements, and the only one it negotiates up to. */
const LEGACY_REVISION = '2025-11-25';

/** The revision a dual-era client declares before falling back. */
const MODERN_REVISION = '2026-07-28';

/**
 * The code the transport actually emits when it refuses a declared version.
 *
 * Pinned exactly, and deliberately: this is the tripwire. Any renumbering at
 * all reds this suite, whether or not the sub-range bounds below have kept
 * pace with the specification.
 */
const OBSERVED_REFUSAL_CODE = -32000;

/**
 * The JSON-RPC implementation-defined range, partitioned by `2026-07-28`
 * §Error Codes (read 2026-09-09).
 *
 * - `-32000`..`-32019` — the **legacy** sub-range. "New codes MUST NOT be
 *   allocated in this sub-range … Apart from `-32002`, receivers MUST NOT
 *   assume any specific meaning for these codes." A refusal here cannot be
 *   read as a modern error, so a dual-era client falls back.
 * - `-32020`..`-32099` — **reserved for the MCP specification**.
 *   "Implementations MUST NOT emit any code from this sub-range that is not
 *   defined by this specification."
 *
 * Asserting membership of the legacy sub-range, rather than absence from a
 * list of the three modern codes defined today, is the point: a later
 * revision defining a fourth reserved code would silently narrow a denylist,
 * and so would an SDK renumbering to a standard code such as `-32602`.
 */
const LEGACY_SUBRANGE_MIN = -32019;
const LEGACY_SUBRANGE_MAX = -32000;

/** The modern per-request `_meta` envelope, as the current revision defines it. */
const MODERN_META = {
  'io.modelcontextprotocol/protocolVersion': MODERN_REVISION,
  'io.modelcontextprotocol/clientInfo': { name: 'EraProbe', version: '1.0.0' },
  'io.modelcontextprotocol/clientCapabilities': {},
};

const MCP_ACCEPT = 'application/json, text/event-stream';

/**
 * The two reds this suite can produce differ enormously in severity, and a
 * shared message made them read identically. They are split so the failure
 * text itself says which one happened.
 *
 * {@link CODE_MOVED} is the exact pin. It reds for *any* renumbering,
 * including one that changes nothing that matters — the contract is
 * sub-range membership, and a move from `-32000` to another legacy-sub-range
 * code satisfies it.
 *
 * {@link FALLBACK_BROKEN} is the contract itself. It reds only when the code
 * has left the legacy sub-range, which is the regression the record exists
 * to prevent.
 */
const CODE_MOVED =
  'The transport renumbered its version refusal, and this is very likely ' +
  'HARMLESS: the contract is legacy-sub-range membership, which is asserted ' +
  'BEFORE this line and has already passed, so dual-era fallback is intact. ' +
  'Re-read ADR-229 §Decision 3, update this pin to the new code, and say in ' +
  'the commit why the move is safe. Do not delete the pin.';

const FALLBACK_BROKEN =
  'FALLBACK REGRESSION: the version refusal has left the legacy error ' +
  'sub-range (-32019..-32000), so a spec-literal dual-era client will read ' +
  'it as a modern error and retry advertised versions instead of falling ' +
  'back to `initialize` — the fallback lane MCP-497 measured real clients ' +
  'relying on in production. ADR-229 §Decision 3. Re-adjudicate that record ' +
  'before changing this expectation; do not delete it.';

/** The refusal must still name what this server speaks, or fallback is blind. */
const REFUSAL_UNINFORMATIVE =
  'ADR-229 §Decision 3: the refusal no longer names the revision this ' +
  'server speaks, so a falling-back client cannot choose a version. ' +
  'Re-adjudicate ADR-229 rather than relaxing this.';

/**
 * The refusal body the transport returns for an unsupported declared version.
 *
 * Plain JSON rather than SSE, and every field the cases read is **required**:
 * a relocated or absent `code` fails the parse loudly instead of leaving a
 * downstream assertion vacuously true. That vacuity is precisely the
 * SDK-major change class this suite exists to catch, so it must not be
 * reachable through an optional chain.
 */
const RefusalBodySchema = z
  .object({
    error: z.object({ code: z.number(), message: z.string() }).loose(),
  })
  .loose();

/** A JSON-RPC error frame carried in an SSE body, `code` required. */
const ErrorFrameSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    error: z.object({ code: z.number() }).loose(),
  })
  .loose();

/** A JSON-RPC result frame carried in an SSE body, `protocolVersion` required. */
const InitResultFrameSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    result: z.object({ protocolVersion: z.string() }).loose(),
  })
  .loose();

/**
 * Returns the JSON payload of the single `data:` line of an SSE-framed body,
 * or `undefined` when the body is not exactly one SSE frame.
 *
 * Returns rather than throws (ADR-088): a malformed body must surface as the
 * failed schema parse the calling case asserts on, never as an exception that
 * reds the suite for an unrelated-looking reason. Requiring *exactly* one
 * data line is deliberate — taking the first of several would fail a case on
 * a confusing id mismatch instead of on shape.
 */
function sseData(body: string): unknown {
  const dataLines = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('data:'));
  const [dataLine] = dataLines;
  if (dataLines.length !== 1 || dataLine === undefined) {
    return undefined;
  }
  const parsed: unknown = JSON.parse(dataLine.slice('data:'.length).trim());
  return parsed;
}

describe('protocol-revision era contract (MCP-644)', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    // The production per-request factory behind the production handler. The
    // Clerk/`mcpAuth` layer that sits ahead of them in the real app (ADR-113)
    // is deliberately omitted: this suite is about protocol-era answers, and
    // in production auth settles first — which is exactly why a wire probe of
    // the deployed app cannot measure any of this (a 401 cannot distinguish
    // "not implemented" from "needs a token"). Note the consequence for era
    // detection: a client meets Oak's 401 before it can ever see the 400 that
    // reveals the era, so it can only detect the era once it holds a token.
    const observability = createFakeHttpObservability();
    const { mcpFactory } = initializeCoreEndpoints(
      app,
      {
        runtimeConfig: createMockRuntimeConfig(),
        observability,
        resourceUrl: 'https://probe.test/mcp',
        getWidgetHtml: () => '<!doctype html><html><body>test</body></html>',
      },
      createFakeLogger(),
    );
    const handler = createMcpHandler(mcpFactory, observability);
    app.post('/mcp', (req, res) => void handler(req, res));
  });

  it('refuses a modern-envelope server/discover with a code no client may read as modern', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', MCP_ACCEPT)
      .set('MCP-Protocol-Version', MODERN_REVISION)
      .set('Mcp-Method', 'server/discover')
      .send({
        jsonrpc: '2.0',
        id: 'discover-1',
        method: 'server/discover',
        params: { _meta: MODERN_META },
      });

    expect(res.status).toBe(400);
    const refusal = RefusalBodySchema.safeParse(res.body);
    expect(refusal.success, `${FALLBACK_BROKEN} Body was: ${JSON.stringify(res.body)}`).toBe(true);

    // ORDER MATTERS, and it is the whole point of splitting the messages.
    // vitest stops a case at its first failed assertion, so whichever runs
    // first is the message the reader gets. THE CONTRACT goes first: a
    // renumbering that breaks fallback fails here and reads as the
    // regression it is. Put the exact pin first instead and a
    // fallback-breaking change announces itself as "may be HARMLESS" — the
    // exact confusion this split exists to remove. Verified by mutating the
    // SDK's own emit site to -32022 and reading the message that came back.
    expect(refusal.data?.error.code, FALLBACK_BROKEN).toBeGreaterThanOrEqual(LEGACY_SUBRANGE_MIN);
    expect(refusal.data?.error.code, FALLBACK_BROKEN).toBeLessThanOrEqual(LEGACY_SUBRANGE_MAX);
    // THE TRIPWIRE: the exact emitted code, so a renumbering reds even when
    // it stayed inside the sub-range, and even if those bounds have gone
    // stale. Reaching this line means the contract above still holds, so
    // the move is very likely harmless — and the message says so.
    expect(refusal.data?.error.code, CODE_MOVED).toBe(OBSERVED_REFUSAL_CODE);
    // And the refusal names what this server does speak, so the fallback is
    // informed rather than blind.
    expect(refusal.data?.error.message, REFUSAL_UNINFORMATIVE).toContain(LEGACY_REVISION);
  });

  it('refuses on the declared version alone — a legacy-shaped control at the same version suffices to show it', async () => {
    const discover = await request(app)
      .post('/mcp')
      .set('Accept', MCP_ACCEPT)
      .set('MCP-Protocol-Version', MODERN_REVISION)
      .set('Mcp-Method', 'server/discover')
      .send({ jsonrpc: '2.0', id: 'd', method: 'server/discover', params: { _meta: MODERN_META } });
    // CONTROL: a method this server certainly implements, in LEGACY shape (no
    // `_meta`, no `Mcp-Method`), carrying only the modern version header. An
    // identical refusal shows the declared version SUFFICES on its own. It
    // does not separate the method from the envelope — one control cannot —
    // and it does not need to: what makes a `server/discover` handler
    // unreachable is that the version alone is enough to refuse.
    const legacyShaped = await request(app)
      .post('/mcp')
      .set('Accept', MCP_ACCEPT)
      .set('MCP-Protocol-Version', MODERN_REVISION)
      .send({ jsonrpc: '2.0', id: 't', method: 'tools/list', params: {} });

    const refused = RefusalBodySchema.safeParse(discover.body);
    const control = RefusalBodySchema.safeParse(legacyShaped.body);
    expect(refused.success, `Body was: ${JSON.stringify(discover.body)}`).toBe(true);
    expect(control.success, `Body was: ${JSON.stringify(legacyShaped.body)}`).toBe(true);

    expect(discover.status).toBe(400);
    expect(legacyShaped.status).toBe(400);
    expect(control.data?.error.code).toBe(refused.data?.error.code);
    // Both refusals carry the two facts a falling-back client acts on. Not
    // byte-equality of the message: an SDK that named the method in the text
    // would differ harmlessly while the era contract held perfectly.
    expect(refused.data?.error.message).toContain(MODERN_REVISION);
    expect(refused.data?.error.message).toContain(LEGACY_REVISION);
    expect(control.data?.error.message).toContain(MODERN_REVISION);
    expect(control.data?.error.message).toContain(LEGACY_REVISION);
  });

  it('answers server/discover with -32601 at a version it does support', async () => {
    // CONTROL for the case above: with the version check passed, the method
    // itself is absent. Proves it of THIS composition's registrations, by
    // driving the boundary rather than pinning an absence — the repo-wide
    // 0-hit grep behind MCP-644 is a separate claim, recorded in ADR-229
    // §Context.
    const res = await request(app)
      .post('/mcp')
      .set('Accept', MCP_ACCEPT)
      .set('MCP-Protocol-Version', LEGACY_REVISION)
      .send({ jsonrpc: '2.0', id: 'legacy-discover', method: 'server/discover', params: {} });

    expect(res.status).toBe(200);
    const frame = ErrorFrameSchema.safeParse(sseData(res.text));
    expect(frame.success, `Body was: ${res.text}`).toBe(true);
    expect(frame.data?.id).toBe('legacy-discover');
    expect(
      frame.data?.error.code,
      'ADR-229 §Decision 2: implementing this method here would be dead code behind the version check. Re-adjudicate ADR-229 rather than deleting this.',
    ).toBe(-32601);
  });

  it('still negotiates the legacy revision through initialize — the lane clients fall back to', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', MCP_ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'init-1',
        method: 'initialize',
        params: {
          protocolVersion: LEGACY_REVISION,
          capabilities: {},
          clientInfo: { name: 'EraProbe', version: '1.0.0' },
        },
      });

    expect(res.status).toBe(200);
    const frame = InitResultFrameSchema.safeParse(sseData(res.text));
    expect(frame.success, `Body was: ${res.text}`).toBe(true);
    expect(frame.data?.id).toBe('init-1');
    // This expectation is one of the few here that SURVIVES the migration.
    // ADR-229 §Decision 4 mandates a dual-era target and puts
    // `legacy: 'reject'` out of bounds, and a dual-era server still answers
    // `initialize` with the negotiated legacy revision. So a red here does
    // not mean "the migration happened, update the test" — it means the
    // legacy lane stopped being served, which is the one migration outcome
    // Decision 4 forbids.
    expect(
      frame.data?.result.protocolVersion,
      'ADR-229 §Decision 4: the legacy `initialize` lane has stopped answering with the legacy revision. A dual-era server — which Decision 4 mandates, ruling `legacy: reject` out of bounds — still answers this. Do not update this expectation to match a modern-only cutover; that cutover is the regression, and it breaks every already-installed client permanently.',
    ).toBe(LEGACY_REVISION);
  });

  it('still stands on an SDK line whose ceiling is the legacy revision — ADR-229s exit condition', () => {
    // A DESIGNED SENTINEL on the decision's premise, not a config audit. Every
    // other case here describes served behaviour; this one asserts the fact
    // that makes the posture deliberate rather than negligent — the installed
    // SDK cannot serve the modern era. The day that stops being true is the
    // day the modern-code list above can go stale and the whole record needs
    // re-reading, so that day should arrive as a failing test rather than as
    // someone remembering.
    //
    // WHY THIS STAYS, even though the probe below is behavioural and reads
    // better. The two fire on different days, and this one fires on the day
    // that matters. `@modelcontextprotocol/core@2.0.0` still declares
    // `LATEST_PROTOCOL_VERSION = '2025-11-25'` (measured 2026-09-10, in
    // `dist/internal.d.mts`), so a dual-era v2 server goes on answering a
    // legacy handshake with the legacy revision — the behavioural probe
    // would sit green through the very migration that ends this record. This
    // assertion cannot: the migration removes the `@modelcontextprotocol/sdk`
    // package, so the import at the top of this file stops resolving and the
    // suite reds. A red that arrives as an unresolved import is exactly the
    // signal wanted; do not "fix" it by re-pointing the import at the v2
    // package's `./internal` subpath.
    expect(
      LATEST_PROTOCOL_VERSION,
      'ADR-229 §The exit condition: the installed SDK line has moved past the legacy revision. Re-derive the reserved-sub-range bounds from the current spec and re-adjudicate ADR-229 — the migration is MCP-506.',
    ).toBe(LEGACY_REVISION);
  });

  it('negotiates down to the legacy revision when a client asks for the modern one', async () => {
    // The behavioural companion to the constant sentinel above: it says the
    // same thing about the SERVED surface rather than about an installed
    // file, so if the current line's ceiling ever moves this reds with a
    // message a reader can act on without opening `node_modules`.
    //
    // The modern revision is asked for in the initialize BODY, with no
    // `MCP-Protocol-Version` header — deliberately. With the header the
    // transport refuses pre-dispatch (the first case in this suite) and
    // nothing about the ceiling is observable. Through the handshake the
    // server answers with the best version it can serve, which is the
    // ceiling itself.
    const res = await request(app)
      .post('/mcp')
      .set('Accept', MCP_ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'init-ceiling',
        method: 'initialize',
        params: {
          protocolVersion: MODERN_REVISION,
          capabilities: {},
          clientInfo: { name: 'EraProbe', version: '1.0.0' },
        },
      });

    expect(res.status).toBe(200);
    const frame = InitResultFrameSchema.safeParse(sseData(res.text));
    expect(frame.success, `Body was: ${res.text}`).toBe(true);
    expect(frame.data?.id).toBe('init-ceiling');
    expect(
      frame.data?.result.protocolVersion,
      'ADR-229 §The exit condition: asked for the modern revision, this server no longer negotiates down to the legacy one. Its served ceiling has moved, so the record premise is gone — re-derive the reserved-sub-range bounds from the current spec and re-adjudicate ADR-229. The migration is MCP-506.',
    ).toBe(LEGACY_REVISION);
  });
});

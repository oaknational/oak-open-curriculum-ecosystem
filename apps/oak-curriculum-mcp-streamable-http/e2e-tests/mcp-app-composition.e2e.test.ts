/**
 * MCP App UI Composition Test (Client SDK).
 *
 * Closes the "pieces vs composition" test gap by exercising the full
 * MCP client SDK lifecycle against a running server instance:
 *
 *   Client.connect() → listTools() → assert _meta.ui → readResource() → assert HTML
 *
 * Unlike the existing `widget-metadata.e2e.test.ts` which sends raw HTTP
 * POST via supertest and parses SSE envelopes manually, this test uses the
 * official `Client` + `StreamableHTTPClientTransport` — the same transport
 * mechanism real MCP hosts (Cursor, etc.) use.
 *
 * The server runs in this process, so these tests prove what generation and
 * registration put on the wire, not what a deployed build serves; the
 * post-deploy probes in the UAT guide (rows 10.4 to 10.6) cover that.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/active/mcp-app-ui-preview-regression.plan.md
 * @see .agent/memory/active/distilled.md line 151 — "pieces vs composition" gap
 */

import { once } from 'node:events';
import type { Server } from 'node:http';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  createStubbedHttpApp,
  SERVED_SURFACE_WITH_USER_SEARCH_LIVE,
} from './helpers/create-stubbed-http-app.js';
import {
  RETIRED_WIDGET_URIS,
  WIDGET_URI,
  WIDGET_TOOL_NAMES,
} from '@oaknational/sdk-codegen/widget-constants';
import { RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';

/**
 * Retrieves the original `fetch` saved by the no-network E2E setup.
 *
 * The MCP SDK's `StreamableHTTPClientTransport` uses `globalThis.fetch`
 * by default. The E2E setup replaces it with a blocking stub to prevent
 * accidental network IO. The transport constructor accepts a custom `fetch`
 * option — we pass the saved original to allow localhost-only connections.
 *
 * This does NOT modify `globalThis.fetch` — it reads a value the setup saved.
 */
function getOriginalFetch(): typeof fetch {
  const g: typeof globalThis & { __ORIGINAL_FETCH__?: typeof fetch } = globalThis;
  const original = g.__ORIGINAL_FETCH__;
  if (!original) {
    throw new Error('Original fetch not available — is the no-network setup active?');
  }
  return original;
}

/**
 * Type guard for text-bearing resource contents.
 *
 * The MCP SDK returns a union of text and blob content items.
 * This narrows to text items without type assertions.
 */
function isTextContent(item: {
  uri: string;
  text?: string;
  blob?: string;
  mimeType?: string;
}): item is { uri: string; text: string; mimeType?: string } {
  return typeof item.text === 'string';
}

describe('MCP App UI Composition (Client SDK)', () => {
  let server: Server;
  let client: Client;
  let serverPort: number;

  beforeAll(async () => {
    // WIDGET_TOOL_NAMES includes the user-search widget tool, which is gated
    // OFF by default; opt in so this composition test sees the full widget set.
    const { app } = await createStubbedHttpApp(
      {},
      { servedSurface: SERVED_SURFACE_WITH_USER_SEARCH_LIVE },
    );
    // Explicit v4 loopback bind + dial (MCP-403): a host-less listen binds
    // `::` while ambient foreign v4 listeners can hold the same port, and
    // this harness already awaits 'listening', so the async host-ful bind
    // is safe here.
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');

    const addr = server.address();
    if (addr === null || typeof addr === 'string') {
      throw new Error('Expected server to bind to an AddressInfo');
    }
    serverPort = addr.port;

    const url = new URL(`http://127.0.0.1:${String(serverPort)}/mcp`);
    const transport = new StreamableHTTPClientTransport(url, {
      fetch: getOriginalFetch(),
    });

    client = new Client({ name: 'composition-test', version: '0.0.1' });
    await client.connect(transport);
  }, 30_000);

  afterAll(async () => {
    try {
      await client.close();
    } catch {
      // Client may already be disconnected
    }
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('widget tools have _meta.ui.resourceUri in listTools()', async () => {
    expect(WIDGET_TOOL_NAMES.size, 'WIDGET_TOOL_NAMES must be non-empty').toBeGreaterThan(0);

    const { tools } = await client.listTools();

    for (const name of WIDGET_TOOL_NAMES) {
      const tool = tools.find((t) => t.name === name);
      expect(tool, `${name} should be registered`).toBeDefined();

      const meta = tool?._meta;
      const ui = meta?.ui;
      expect(
        typeof ui === 'object' && ui !== null && 'resourceUri' in ui ? ui.resourceUri : undefined,
        `${name} should have widget URI in _meta.ui.resourceUri`,
      ).toBe(WIDGET_URI);
    }
  });

  it('advertises the published widget address that clients hold', async () => {
    // Designed sentinel (testing-strategy, "Prove behaviour, never config or
    // content"): clients keep the address from the tool list they were given,
    // so the value served here is a contract, not an implementation detail.
    const { tools } = await client.listTools();
    const tool = tools.find((t) => t.name === 'get-curriculum-model');
    const ui = tool?._meta?.ui;

    expect(
      typeof ui === 'object' && ui !== null && 'resourceUri' in ui ? ui.resourceUri : undefined,
      'Serving a different widget address breaks every client holding an earlier tool list, ' +
        'and a published plugin needs a new reviewed version first. Re-adjudicate against ' +
        'ADR-141 (widget URI identity amendment, MCP-489) before changing this expectation.',
    ).toBe('ui://widget/oak-curriculum-app-v1.html');
  });

  it('widget resource returns HTML with MCP App MIME type', async () => {
    const result = await client.readResource({ uri: WIDGET_URI });

    expect(result.contents.length).toBeGreaterThan(0);

    const content = result.contents[0];
    expect(content?.mimeType).toBe(RESOURCE_MIME_TYPE);

    if (!content || !isTextContent(content)) {
      throw new Error('Expected text content from widget resource');
    }
    expect(content.text.length, 'Widget HTML should be non-empty').toBeGreaterThan(0);
  });

  it('publishes the same widget settings on the resource listing and the served content', async () => {
    // Designed sentinel: a published plugin's snapshot records these
    // settings, so changing them is an incompatible change that takes a new
    // widget address and a new plugin version.
    const published = {
      csp: { resourceDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'] },
      prefersBorder: false,
    };
    const message =
      'The widget settings are part of its published contract. Re-adjudicate against ADR-141 ' +
      '(widget URI identity amendment, MCP-489) before changing this expectation.';

    const { resources } = await client.listResources();
    const listed = resources.find((resource) => resource.uri === WIDGET_URI);
    const { contents } = await client.readResource({ uri: WIDGET_URI });

    expect(listed?._meta?.ui, message).toEqual(published);
    expect(contents[0]?._meta?.ui, message).toEqual(published);
  });

  it('answers a retired widget address with resource-not-found, not an authentication challenge', async () => {
    expect(RETIRED_WIDGET_URIS.length).toBeGreaterThan(0);

    for (const uri of RETIRED_WIDGET_URIS) {
      // The MCP SDK answers an unregistered resource with InvalidParams
      // (-32602); the specification's SHOULD is -32002 (ADR-141).
      await expect(client.readResource({ uri }), uri).rejects.toMatchObject({
        code: ErrorCode.InvalidParams,
      });
    }
  });
});

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
 * @see .agent/plans/sdk-and-mcp-enhancements/active/mcp-app-ui-preview-regression.plan.md
 * @see .agent/memory/distilled.md line 151 — "pieces vs composition" gap
 */

import { once } from 'node:events';
import type { Server } from 'node:http';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createStubbedHttpApp } from './helpers/create-stubbed-http-app.js';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';
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
    const { app } = await createStubbedHttpApp();
    server = app.listen(0);
    await once(server, 'listening');

    const addr = server.address();
    if (addr === null || typeof addr === 'string') {
      throw new Error('Expected server to bind to an AddressInfo');
    }
    serverPort = addr.port;

    const url = new URL(`http://localhost:${String(serverPort)}/mcp`);
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
});

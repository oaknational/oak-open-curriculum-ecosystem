/*
 * Smoke test for HTTP MCP server.
 * - Local mode (default): starts server in-process on PORT (default 3333)
 * - Remote mode: if BASE_URL is set, tests against that URL without starting a server
 *
 * Usage:
 *  - Local:  pnpm -F @oaknational/oak-curriculum-mcp-streamable-http smoke:dev
 *  - Remote: BASE_URL=https://your-app.example tsx scripts/smoke-dev.ts
 */

import type { Server } from 'node:http';
import assert from 'node:assert/strict';
import { createApp } from '../src/index.js';

async function fetchJson(
  url: URL | string,
  init?: RequestInit,
): Promise<{ res: Response; text: string }> {
  const res = await fetch(url, init);
  const text = await res.text();
  return { res, text };
}

async function run(): Promise<void> {
  // Ensure a dev token exists for the server and client side
  process.env.REMOTE_MCP_DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN || 'dev-token';

  const baseUrlEnv = process.env.BASE_URL;
  const port = Number(process.env.PORT || 3333);
  const isRemote = typeof baseUrlEnv === 'string' && baseUrlEnv.length > 0;

  let server: Server | undefined;
  const baseUrl = isRemote ? baseUrlEnv! : `http://localhost:${String(port)}`;
  const devToken = process.env.REMOTE_MCP_DEV_TOKEN as string;

  try {
    if (!isRemote) {
      const app = createApp();
      server = await new Promise<Server>((resolve, reject) => {
        const s = app.listen(port, () => resolve(s));
        s.on('error', reject);
      });
    }

    // 1) Health
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), { method: 'GET' });
      assert.equal(res.status, 200, 'GET /mcp should return 200');
      assert.match(text, /"status":"ok"/, 'GET /mcp should include status ok');
    }
    {
      const { res, text } = await fetchJson(new URL('/openai_connector', baseUrl), {
        method: 'GET',
      });
      assert.equal(res.status, 200, 'GET /openai_connector should return 200');
      assert.match(text, /"status":"ok"/, 'GET /openai_connector should include status ok');
    }

    // 2) 401 without auth
    {
      const { res } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      });
      assert.equal(res.status, 401, 'POST /mcp without auth should be 401');
      const www = res.headers.get('www-authenticate') || '';
      assert.match(www.toLowerCase(), /^bearer\s+/, 'WWW-Authenticate must be Bearer');
    }
    {
      const { res } = await fetchJson(new URL('/openai_connector', baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      });
      assert.equal(res.status, 401, 'POST /openai_connector without auth should be 401');
      const www = res.headers.get('www-authenticate') || '';
      assert.match(www.toLowerCase(), /^bearer\s+/, 'WWW-Authenticate must be Bearer');
    }

    // 3) tools/list with dev token
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      });
      assert.equal(res.status, 200, 'POST /mcp tools/list should be 200');
      assert.match(text, /event: message/, 'Response should be SSE wrapped');
      assert.match(text, /"tools"\s*:/, 'Payload should include tools');
    }
    {
      const { res, text } = await fetchJson(new URL('/openai_connector', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      });
      assert.equal(res.status, 200, 'POST /openai_connector tools/list should be 200');
      assert.match(text, /event: message/, 'Response should be SSE wrapped');
      assert.match(text, /"tools"\s*:/, 'Payload should include tools');
    }

    // 4) Validation failure / error payloads
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-key-stages-subject-lessons',
            arguments: { keyStage: 123, subject: true },
          },
        }),
      });
      assert.equal(res.status, 200, 'POST /mcp validation failure should be 200');
      assert.match(text, /"error"\s*:/, 'Payload should contain JSON-RPC error');
    }
    {
      const { res, text } = await fetchJson(new URL('/openai_connector', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-key-stages-subject-lessons',
            arguments: { keyStage: 123, subject: true },
          },
        }),
      });
      assert.equal(res.status, 200, 'POST /openai_connector validation failure should be 200');
      assert.match(text, /event: message/, 'Response should be SSE wrapped');
      assert.match(text, /\"text\"\s*:/, 'Payload should contain text content item');
      assert.match(text, /\\\"(error|message)\\\"\s*:/, 'Wrapped JSON should indicate error');
    }

    console.log('Smoke OK for', baseUrl);
  } finally {
    if (server) {
      await new Promise<void>((resolve, reject) =>
        server!.close((err) => (err ? reject(err) : resolve())),
      );
    }
  }
}

run().catch((err) => {
  console.error('Smoke-dev failed:', err);
  process.exit(1);
});

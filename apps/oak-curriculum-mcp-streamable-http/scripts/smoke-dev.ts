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

const REQUIRED_ACCEPT = 'application/json, text/event-stream';
const EXPECTED_TOOLS = ['search', 'fetch', 'get-key-stages-subject-lessons'] as const;

interface JsonRpcEnvelope {
  jsonrpc?: string;
  id?: string | number;
  result?: unknown;
  error?: unknown;
}

interface ToolListResult {
  tools?: ReadonlyArray<{ name?: string }>;
}

async function fetchJson(
  url: URL | string,
  init?: RequestInit,
): Promise<{ res: Response; text: string }> {
  const res = await fetch(url, init);
  const text = await res.text();
  return { res, text };
}

function parseFirstSsePayload(raw: string): JsonRpcEnvelope {
  const line = raw
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value.startsWith('data: '));
  assert.ok(line, 'SSE payload must include at least one data line');
  const json = line!.replace(/^data: /, '');
  const parsed = JSON.parse(json) as unknown;
  assert.ok(parsed && typeof parsed === 'object', 'SSE data must be a JSON object envelope');
  return parsed as JsonRpcEnvelope;
}

function extractToolNames(raw: string): string[] {
  const envelope = parseFirstSsePayload(raw);
  const result = envelope.result as ToolListResult | undefined;
  assert.ok(result && Array.isArray(result.tools), 'tools/list must include tools array');
  const names = result.tools!.map((entry) => entry?.name).filter((name): name is string => !!name);
  const unique = new Set(names);
  assert.equal(unique.size, names.length, 'tools/list should not contain duplicate tool names');
  return names;
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

    // 1) Health endpoints
    {
      const { res, text } = await fetchJson(new URL('/healthz', baseUrl), { method: 'GET' });
      assert.equal(res.status, 200, 'GET /healthz should return 200');
      const body = JSON.parse(text) as { status?: unknown; mode?: unknown; auth?: unknown };
      assert.equal(body.status, 'ok', 'Health response should report ok status');
      assert.equal(
        body.mode,
        'streamable-http',
        'Health response should describe streamable-http mode',
      );
      assert.equal(
        body.auth,
        'required-for-post',
        'Health response should document auth expectations',
      );
    }
    {
      const { res, text } = await fetchJson(new URL('/healthz', baseUrl), { method: 'HEAD' });
      assert.equal(res.status, 200, 'HEAD /healthz should return 200');
      assert.equal(text, '', 'HEAD /healthz should not return a body');
    }

    // 2) Accept header enforcement when missing streaming requirements
    let canonicalToolNames: string[] = [];
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 'accept-1', method: 'tools/list' }),
      });
      assert.equal(res.status, 406, 'POST /mcp without required Accept header should be 406');
      assert.match(text, /Accept header must include text\/event-stream/);
    }

    {
      const { res, text } = await fetchJson(new URL('/openai_connector', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 'accept-2', method: 'tools/list' }),
      });
      assert.equal(
        res.status,
        406,
        'POST /openai_connector without required Accept header should be 406',
      );
      assert.match(text, /Accept header must include text\/event-stream/);
    }

    // 3) 401 without auth
    {
      const { res } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: REQUIRED_ACCEPT,
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
          Accept: REQUIRED_ACCEPT,
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      });
      assert.equal(res.status, 401, 'POST /openai_connector without auth should be 401');
      const www = res.headers.get('www-authenticate') || '';
      assert.match(www.toLowerCase(), /^bearer\s+/, 'WWW-Authenticate must be Bearer');
    }

    // 4) initialise handshake validation
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: REQUIRED_ACCEPT,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'init-no-client',
          method: 'initialize',
          params: {
            protocolVersion: '2025-06-18',
            capabilities: {},
          },
        }),
      });
      assert.equal(res.status, 200, 'POST /mcp initialize without clientInfo should be 200');
      const payload = parseFirstSsePayload(text);
      const error = payload.error as { message?: string } | undefined;
      const message = error?.message ?? '';
      assert.notEqual(message.length, 0, 'Initialise error payload should include a message');
      assert.match(message.toLowerCase(), /clientinfo/, 'Error message should mention clientInfo');
    }
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: REQUIRED_ACCEPT,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'init-with-client',
          method: 'initialize',
          params: {
            protocolVersion: '2025-06-18',
            capabilities: {},
            clientInfo: { name: 'smoke-dev', version: '0.0.0-local' },
          },
        }),
      });
      assert.equal(res.status, 200, 'POST /mcp initialize with clientInfo should be 200');
      const payload = parseFirstSsePayload(text);
      const result = payload.result as
        | { capabilities?: { tools?: { listChanged?: boolean } } }
        | undefined;
      assert.equal(
        result?.capabilities?.tools?.listChanged,
        true,
        'Initialise result should advertise listChanged capability',
      );
    }
    // 5) tools/list with dev token
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: REQUIRED_ACCEPT,
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      });
      assert.equal(res.status, 200, 'POST /mcp tools/list should be 200');
      assert.match(text, /event: message/, 'Response should be SSE wrapped');
      const names = extractToolNames(text);
      for (const tool of EXPECTED_TOOLS) {
        assert.ok(names.includes(tool), `tools/list should include ${tool}`);
      }
      canonicalToolNames = names;
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
      const names = extractToolNames(text);
      const canonicalNames = new Set(canonicalToolNames);
      assert.equal(
        names.length,
        canonicalNames.size,
        'Alias tools/list should mirror canonical set',
      );
      for (const tool of names) {
        assert.ok(canonicalNames.has(tool), `Alias tools/list should not introduce ${tool}`);
      }
    }

    // 6) Validation failure / error payloads
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: REQUIRED_ACCEPT,
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
          Accept: REQUIRED_ACCEPT,
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

    // 7) Synonym canonicalisation succeeds
    {
      const { res, text } = await fetchJson(new URL('/mcp', baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${devToken}`,
          'Content-Type': 'application/json',
          Accept: REQUIRED_ACCEPT,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'synonyms-success',
          method: 'tools/call',
          params: {
            name: 'get-key-stages-subject-lessons',
            arguments: {
              keyStage: 'Key Stage Four',
              subject: 'Fine Art',
            },
          },
        }),
      });
      assert.equal(res.status, 200, 'POST /mcp tools/call with synonyms should be 200');
      const envelope = parseFirstSsePayload(text);
      const error = envelope.error as { message?: string } | undefined;
      const errorMessage = error?.message ?? '';
      assert.ok(
        !errorMessage.toLowerCase().includes('unknown subject'),
        'Subject synonym should not be rejected',
      );
      assert.ok(
        !errorMessage.toLowerCase().includes('unknown key stage'),
        'Key stage synonym should not be rejected',
      );
      if (!error) {
        const result = envelope.result as {
          content?: ReadonlyArray<{ type?: string; text?: string }>;
          isError?: boolean;
        } | null;
        assert.ok(result && result.isError !== true, 'tools/call success should not signal error');
        const textContent = result?.content?.find((entry) => entry?.type === 'text')?.text;
        if (textContent && textContent.length > 0) {
          try {
            const payload = JSON.parse(textContent) as {
              subjectSlug?: string;
              keyStageSlug?: string;
            };
            if (payload?.subjectSlug) {
              assert.equal(payload.subjectSlug, 'art', 'Subject synonym should canonise to art');
            }
            if (payload?.keyStageSlug) {
              assert.equal(payload.keyStageSlug, 'ks4', 'Key stage synonym should canonise to ks4');
            }
          } catch (jsonError) {
            console.warn('Unable to parse canonicalised payload:', jsonError);
          }
        }
      }
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

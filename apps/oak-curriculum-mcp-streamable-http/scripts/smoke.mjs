#!/usr/bin/env node
// Simple smoke test for deployed HTTP server
// Usage: BASE_URL=https://your-app.vercel.app node scripts/smoke.mjs

import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  console.error('Missing BASE_URL env');
  process.exit(2);
}

const devToken = process.env.REMOTE_MCP_DEV_TOKEN || 'dev-token';

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  return { res, text };
}

async function run() {
  // 1) Health
  {
    const { res, text } = await fetchJson(new URL('/mcp', baseUrl), { method: 'GET' });
    assert.equal(res.status, 200, 'GET /mcp should return 200');
    assert.match(text, /"status":"ok"/, 'GET /mcp should include status ok');
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

  // 4) Validation failure → JSON-RPC error
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

  console.log('Smoke OK for', baseUrl);
}

run().catch((err) => {
  console.error('Smoke failed:', err);
  process.exit(1);
});

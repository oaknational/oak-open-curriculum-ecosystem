/**
 * Minimal test to verify middleware registration works
 */

import { startSmokeServer } from './local-server.js';

console.log('[TEST] Starting middleware registration test');

process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_API_KEY = 'test-key';
process.env.TRACE_MCP_FLOW = 'true';

console.log('[TEST] Starting server via startSmokeServer');
const server = await startSmokeServer(4444);

console.log('[TEST] Server started, making test request');

// Make a test request
fetch('http://localhost:4444/healthz')
  .then(async (res) => {
    console.log(`[TEST] /healthz response: ${res.status}`);
    return res.text();
  })
  .then((body) => {
    console.log(`[TEST] /healthz body: ${body}`);
    server.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('[TEST] Request failed:', err);
    server.close();
    process.exit(1);
  });

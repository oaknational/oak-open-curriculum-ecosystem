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

async function shutdown(): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

try {
  const res = await fetch('http://localhost:4444/healthz');
  console.log('[TEST] /healthz response:', res.status);
  const body = await res.text();
  console.log('[TEST] /healthz body:', body);
  await shutdown();
  process.exit(0);
} catch (error: unknown) {
  console.error('[TEST] Request failed:', error);
  await shutdown();
  process.exit(1);
}

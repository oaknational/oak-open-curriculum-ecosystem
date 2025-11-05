#!/usr/bin/env node

/**
 * Exact Smoke Test Replication
 *
 * Replicates the exact request that the smoke test makes to identify the issue.
 */

import { startSmokeServer, closeSmokeServer } from './local-server.js';

console.log('🔍 Exact Smoke Test Replication');
console.log('================================');

// Set up environment exactly like smoke test
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_API_KEY = 'test-key';
process.env.TRACE_MCP_FLOW = 'true';

async function testExactSmokeRequest() {
  console.log('\n🔥 Starting server...');
  const server = await startSmokeServer(3333);

  try {
    console.log('📤 Making exact smoke test request...');

    // Exact request from smoke test
    const response = await fetch('http://localhost:3333/mcp', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/event-stream',
        'Content-Type': 'application/json',
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

    console.log(`📥 Response status: ${response.status}`);
    const body = await response.text();
    console.log(`📥 Response body: ${body.substring(0, 200)}...`);

    if (response.status === 200) {
      console.log('✅ SUCCESS - Request worked!');
    } else {
      console.log('❌ FAILURE - Request failed with 401');
    }
  } finally {
    await closeSmokeServer(server);
    console.log('✅ Server closed');
  }
}

async function main() {
  try {
    await testExactSmokeRequest();
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

main();

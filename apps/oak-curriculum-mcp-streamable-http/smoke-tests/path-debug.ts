#!/usr/bin/env node

/**
 * Path Debug Test
 *
 * Debug the exact path that Express sees for the request.
 */

import { startSmokeServer, closeSmokeServer } from './local-server.js';

console.log('🔍 Path Debug Test');
console.log('==================');

// Set up environment
// Disable auth – this debug script inspects routing only.
// Auth enforcement is covered by auth-enforcement.e2e.test.ts and smoke-dev-auth.
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_API_KEY = 'test-key';
process.env.LOG_LEVEL = 'debug';

async function testPathDebug() {
  console.log('\n🔥 Starting server...');
  const server = await startSmokeServer(3333);

  try {
    console.log('📤 Making request to /mcp...');

    const response = await fetch('http://localhost:3333/mcp', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test',
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
        },
      }),
    });

    console.log('📥 Response status:', response.status);
    const body = await response.text();
    console.log('📥 Response body:', body.substring(0, 200), '...');
  } finally {
    await closeSmokeServer(server);
    console.log('✅ Server closed');
  }
}

async function main() {
  try {
    await testPathDebug();
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

void main();

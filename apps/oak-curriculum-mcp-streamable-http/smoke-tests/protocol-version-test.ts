#!/usr/bin/env node

/**
 * Protocol Version Test
 *
 * Tests if the protocol version difference is causing the 401 issue.
 */

import { createApp } from '../src/index.js';
import request from 'supertest';

console.log('🔍 Protocol Version Test');
console.log('========================');

// Set up environment
// Disable auth – this probe isolates protocol-version negotiation.
// Auth enforcement is covered by auth-enforcement.e2e.test.ts and smoke-dev-auth.
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_API_KEY = 'test-key';
process.env.LOG_LEVEL = 'debug';

const app = createApp();

async function testProtocolVersion(version: string) {
  console.log(`\n🧪 Testing protocol version: ${version}`);

  const res = await request(app)
    .post('/mcp')
    .set('Accept', 'application/json, text/event-stream')
    .send({
      jsonrpc: '2.0',
      id: 'test',
      method: 'initialize',
      params: {
        protocolVersion: version,
        capabilities: {},
      },
    });

  console.log('   Status:', res.status);
  if (res.status !== 200) {
    console.log('   Body:', JSON.stringify(res.body).substring(0, 200), '...');
  }

  return res.status;
}

async function main() {
  try {
    const versions = ['2024-11-05', '2025-06-18'];

    for (const version of versions) {
      const status = await testProtocolVersion(version);
      console.log('   Result:', status === 200 ? '✅ PASS' : '❌ FAIL');
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

void main();

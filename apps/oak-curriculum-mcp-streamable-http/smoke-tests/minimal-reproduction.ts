#!/usr/bin/env node

/**
 * Minimal Reproduction Test
 *
 * Tests both E2E (supertest) and Smoke (real HTTP) patterns side-by-side
 * with identical requests to identify the root cause of the 401 mystery.
 */

import { createApp } from '../src/index.js';
import request from 'supertest';
import { startSmokeServer, closeSmokeServer } from './local-server.js';

console.log('🔍 Minimal Reproduction Test - E2E vs Smoke Comparison');
console.log('====================================================');

// Set up environment
// Disable auth – this comparison isolates transport differences.
// Auth enforcement is covered by auth-enforcement.e2e.test.ts and smoke-dev-auth.
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_API_KEY = 'test-key';
process.env.LOG_LEVEL = 'debug';

console.log('\n📋 Environment Setup:');
console.log('DANGEROUSLY_DISABLE_AUTH:', process.env.DANGEROUSLY_DISABLE_AUTH);
console.log('OAK_API_KEY:', process.env.OAK_API_KEY);
console.log('LOG_LEVEL:', process.env.LOG_LEVEL);

async function testE2EPattern() {
  console.log('\n🧪 Testing E2E Pattern (supertest):');
  console.log('-----------------------------------');

  const app = createApp();
  console.log('✅ E2E: createApp() completed');

  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  console.log('📤 E2E: Making supertest request...');
  const res = await request(app)
    .post('/mcp')
    .set('Accept', 'application/json, text/event-stream')
    .send(testRequest);

  console.log('📥 E2E: Response status:', res.status);
  console.log('📥 E2E: Response body:', JSON.stringify(res.body).substring(0, 100), '...');

  return res.status;
}

async function testSmokePattern() {
  console.log('\n🔥 Testing Smoke Pattern (real HTTP):');
  console.log('-------------------------------------');

  const server = await startSmokeServer(4445);
  console.log(`✅ Smoke: Server started on port 4445`);

  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  console.log('📤 Smoke: Making fetch request...');
  const res = await fetch('http://localhost:4445/mcp', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testRequest),
  });

  console.log('📥 Smoke: Response status:', res.status);
  const body = await res.text();
  console.log('📥 Smoke: Response body:', body.substring(0, 100), '...');

  await closeSmokeServer(server);
  console.log('✅ Smoke: Server closed');

  return res.status;
}

async function main() {
  try {
    console.log('\n🚀 Starting comparison tests...\n');

    const e2eStatus = await testE2EPattern();
    const smokeStatus = await testSmokePattern();

    console.log('\n📊 Results Summary:');
    console.log('==================');
    console.log('E2E (supertest):', e2eStatus);
    console.log('Smoke (real HTTP):', smokeStatus);

    if (e2eStatus === smokeStatus) {
      console.log('✅ Both patterns return same status - mystery solved!');
    } else {
      console.log('❌ Patterns return different status - mystery confirmed!');
      console.log('   Difference:', e2eStatus, 'vs', smokeStatus);
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

void main();

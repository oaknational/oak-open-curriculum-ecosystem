/**
 * OAuth Validation Workflow via MCP Inspector
 *
 * PURPOSE: Launch the MCP Inspector against a running dev server with auth enabled
 * so a human can complete the real OAuth flow (browser interaction required).
 *
 * BOUNDARIES:
 * - Manual workflow (not CI)
 * - Network IO allowed (Clerk)
 *
 * USAGE:
 *   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http inspect:oauth
 */

import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const DEV_SERVER_URL = process.env.DEV_SERVER_URL ?? 'http://localhost:3333/mcp';

async function waitForServer(url: string, maxAttempts = 10): Promise<boolean> {
  const baseUrl = url.replace(/\/mcp$/, '');
  console.log(`⏳ Waiting for dev server at ${baseUrl}/healthz...`);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${baseUrl}/healthz`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        console.log('✅ Dev server is ready\n');
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await setTimeout(1000);
  }
  return false;
}

async function assertOAuthMetadataAvailable(url: string): Promise<void> {
  const baseUrl = url.replace(/\/mcp$/, '');
  const res = await fetch(`${baseUrl}/.well-known/oauth-protected-resource`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    throw new Error(
      `Expected OAuth metadata to be available (HTTP ${String(res.status)}). Start the server with auth enabled.`,
    );
  }
}

function printHeader(): void {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔬 OAuth Validation (MCP Inspector)');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📋 Configuration:');
  console.log(`   MCP URL: ${DEV_SERVER_URL}`);
  console.log('   Transport: http (Streamable HTTP)\n');
}

function exitServerNotReady(): never {
  console.error('❌ FAILED: Dev server not responding at', DEV_SERVER_URL);
  console.error('\n💡 Start the dev server first:');
  console.error('   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev:auth:stub\n');
  process.exit(1);
}

async function main(): Promise<void> {
  printHeader();

  if (!(await waitForServer(DEV_SERVER_URL))) {
    exitServerNotReady();
  }

  try {
    await assertOAuthMetadataAvailable(DEV_SERVER_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ FAILED: ${message}`);
    console.error('\n💡 Start the dev server with auth enabled:');
    console.error('   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev:auth:stub\n');
    process.exit(1);
  }

  console.log('🔍 Launching MCP Inspector...');
  console.log(
    `   Command: npx @modelcontextprotocol/inspector --transport http --server-url ${DEV_SERVER_URL}\n`,
  );

  const inspector = spawn(
    'npx',
    ['@modelcontextprotocol/inspector', '--transport', 'http', '--server-url', DEV_SERVER_URL],
    { stdio: 'inherit' },
  );

  await new Promise<void>((resolve, reject) => {
    inspector.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Inspector exited with code ${String(code)}`));
    });
    inspector.on('error', (err) => {
      reject(err);
    });
  });
}

main().catch((err: unknown) => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});

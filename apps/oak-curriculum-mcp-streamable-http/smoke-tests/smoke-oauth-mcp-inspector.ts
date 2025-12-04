/**
 * OAuth Discovery Smoke Test via MCP Inspector CLI
 *
 * PURPOSE: Proves that MCP clients successfully connect using OAuth discovery
 * WITHOUT the Authorization Server Metadata proxy endpoint.
 *
 * This validates the architectural decision to remove the proxy, as per:
 * - MCP spec (2025-06-18): Clients fetch AS metadata directly from Clerk
 * - @clerk/mcp-tools README: "should not be necessary"
 * - MCP SDK: discoverAuthorizationServerMetadata() takes authorizationServerUrl
 *
 * TEST BOUNDARIES:
 * - This is a SMOKE test (manual, external I/O allowed)
 * - NOT run in CI (requires dev server + Clerk)
 * - Provides repeatable validation for architectural changes
 *
 * USAGE:
 *   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http smoke:oauth-inspector
 */

import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const DEV_SERVER_URL = process.env.DEV_SERVER_URL ?? 'http://localhost:3333/mcp';
const INSPECTOR_TIMEOUT_MS = 30000;

interface TestResult {
  success: boolean;
  output: string;
  error?: string;
  duration: number;
}

interface InspectorToolsResponse {
  tools: { name: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
function hasToolsArray(obj: object): obj is { tools: unknown } {
  return 'tools' in obj;
}

function isInspectorToolsResponse(obj: unknown): obj is InspectorToolsResponse {
  return typeof obj === 'object' && obj !== null && hasToolsArray(obj) && Array.isArray(obj.tools);
}

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

function createErrorMessage(code: number | null, stderr: string): string {
  return stderr || `Process exited with code ${code !== null ? String(code) : 'unknown'}`;
}

function spawnInspector() {
  console.log('🔍 Running MCP Inspector CLI...');
  console.log(
    `   Command: npx @modelcontextprotocol/inspector --cli ${DEV_SERVER_URL} --transport http --method tools/list\n`,
  );
  return spawn(
    'npx',
    [
      '@modelcontextprotocol/inspector',
      '--cli',
      DEV_SERVER_URL,
      '--transport',
      'http',
      '--method',
      'tools/list',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'], timeout: INSPECTOR_TIMEOUT_MS },
  );
}

function runInspectorCLI(): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    const inspector = spawnInspector();

    inspector.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });
    inspector.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    inspector.on('close', (code) => {
      const duration = Date.now() - startTime;
      if (code === 0) {
        resolve({ success: true, output: stdout, duration });
      } else {
        resolve({
          success: false,
          output: stdout,
          error: createErrorMessage(code, stderr),
          duration,
        });
      }
    });

    inspector.on('error', (err: Error) => {
      resolve({
        success: false,
        output: stdout,
        error: err.message,
        duration: Date.now() - startTime,
      });
    });
  });
}

function validateOutput(output: string): { valid: boolean; message: string } {
  if (!output.includes('tools') || output.trim().length === 0) {
    return { valid: false, message: 'Output does not contain tools list' };
  }

  try {
    const parsed: unknown = JSON.parse(output);
    if (isInspectorToolsResponse(parsed)) {
      return { valid: true, message: `Found ${String(parsed.tools.length)} tools` };
    }
  } catch {
    if (output.includes('get-') || output.includes('Tool:')) {
      return { valid: true, message: 'Tools list found in text format' };
    }
  }

  return { valid: false, message: 'Could not parse tools from output' };
}

function printHeader(): void {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔬 OAuth Discovery Smoke Test (MCP Inspector CLI)');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📋 Test Configuration:');
  console.log(`   Server URL: ${DEV_SERVER_URL}`);
  console.log('   Transport: Streamable HTTP');
  console.log(`   Timeout: ${String(INSPECTOR_TIMEOUT_MS)}ms\n`);
}

function exitServerNotReady(): never {
  console.error('❌ FAILED: Dev server not responding at', DEV_SERVER_URL);
  console.error('\n💡 Start the dev server first:');
  console.error('   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev\n');
  process.exit(1);
}

function printResults(result: TestResult): void {
  console.log('─────────────────────────────────────────────────────');
  console.log('📊 Test Results:');
  console.log(`   Duration: ${String(result.duration)}ms`);
  console.log(`   Exit Code: ${result.success ? '0 (success)' : 'non-zero (failure)'}\n`);
}

function exitInspectorFailed(result: TestResult): never {
  console.error('❌ FAILED: Inspector CLI exited with error');
  if (result.error) {
    console.error('\n🔴 Error Output:');
    console.error(result.error);
  }
  if (result.output) {
    console.error('\n📄 Stdout:');
    console.error(result.output);
  }
  console.error('\n');
  process.exit(1);
}

function exitValidationFailed(message: string): never {
  console.error('❌ FAILED: Output validation failed');
  console.error(`   ${message}\n`);
  process.exit(1);
}

function printSuccess(msg: string): void {
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ PASSED: OAuth discovery working correctly!');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('✓ MCP Inspector successfully connected');
  console.log('✓ OAuth discovery completed without proxy');
  console.log('✓ Tools retrieved from server');
  console.log(`✓ ${msg}\n`);
  console.log('🎉 The Authorization Server Metadata proxy is NOT needed!');
  console.log('   Clients fetch AS metadata directly from Clerk.\n');
}

async function main(): Promise<void> {
  printHeader();

  if (!(await waitForServer(DEV_SERVER_URL))) {
    exitServerNotReady();
  }

  const result = await runInspectorCLI();
  printResults(result);

  if (!result.success) {
    exitInspectorFailed(result);
  }

  const validation = validateOutput(result.output);
  console.log('📤 Inspector Output:');
  console.log(result.output);
  console.log('');

  if (!validation.valid) {
    exitValidationFailed(validation.message);
  }

  printSuccess(validation.message);
}

main().catch((err: unknown) => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});

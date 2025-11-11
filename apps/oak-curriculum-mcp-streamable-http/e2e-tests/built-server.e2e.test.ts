/**
 * E2E test for built server artifacts
 *
 * Tests that the production build can actually start and respond.
 * This is separate from postbuild verification (which checks structure)
 * because this tests BEHAVIOR of the built system.
 *
 * This test spawns the actual dist/server.js file and verifies it:
 * - Starts successfully
 * - Listens on configured port
 * - Responds to HTTP requests
 * - Serves expected endpoints
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = resolve(__dirname, '../dist/server.js');

describe('Built Server (dist/server.js)', () => {
  let server: ChildProcess | undefined;
  const testPort = 9999;
  const startupTimeMs = 3000;

  beforeAll(async () => {
    // Start the built server
    server = spawn('node', [serverPath], {
      env: {
        ...process.env,
        PORT: String(testPort),
        DANGEROUSLY_DISABLE_AUTH: 'true',
        ALLOWED_HOSTS: 'localhost',
        OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-key',
        CLERK_PUBLISHABLE_KEY:
          process.env.CLERK_PUBLISHABLE_KEY ??
          'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ',
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? 'sk_test_dummy',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Collect output for debugging
    let stdout = '';
    let stderr = '';
    server.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });
    server.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, startupTimeMs));

    // Verify process is still running
    if (server.exitCode !== null) {
      console.error('Server stdout:', stdout);
      console.error('Server stderr:', stderr);
      throw new Error(`Server exited immediately with code ${String(server.exitCode)}`);
    }
  }, startupTimeMs + 2000);

  afterAll(() => {
    if (server) {
      server.kill('SIGTERM');
    }
  });

  it('should start and listen on configured port', () => {
    expect(server).toBeDefined();
    if (!server) {
      throw new Error('Server should be defined');
    }
    expect(server.killed).toBe(false);
    expect(server.exitCode).toBe(null);
  });

  it('should respond to healthcheck', async () => {
    const response = await fetch(`http://localhost:${String(testPort)}/healthz`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      status: 'ok',
      mode: 'streamable-http',
    });
  });

  it('should serve root landing page', async () => {
    const response = await fetch(`http://localhost:${String(testPort)}/`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
  });

  it('should have MCP endpoint available', async () => {
    // With DANGEROUSLY_DISABLE_AUTH=true, MCP endpoint should work
    const response = await fetch(`http://localhost:${String(testPort)}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'initialize', id: 1 }),
    });

    // Should not be a server error
    expect(response.status).toBeLessThan(500);
    // With auth disabled, should get 200 or similar success
    expect(response.status).toBeLessThan(400);
  });

  it('should handle CORS preflight requests', async () => {
    const response = await fetch(`http://localhost:${String(testPort)}/healthz`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBeTruthy();
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { findRepoRoot } from '@oaknational/env-resolution';

function readStartupLog(repoRoot: string): string {
  const p = join(repoRoot, '.logs', 'oak-curriculum-mcp-startup', 'startup.log');
  if (!existsSync(p)) {
    return '';
  }
  try {
    return readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

describe('MCP Startup logging', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    const apiKey = 'test-api-key';

    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
      env: {
        ...process.env,
        OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
        OAK_API_KEY: apiKey,
        LOG_LEVEL: 'debug',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
      },
    });
    client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
    await transport.close();
  });

  it('writes startup diagnostics including non-empty tool count', async () => {
    // force server to list tools so that handlers are exercised
    const tools = await client.listTools();
    expect(Array.isArray(tools.tools)).toBe(true);
    const repoRoot = findRepoRoot(process.cwd());
    if (repoRoot === undefined) {
      throw new Error('E2E tests must run inside the monorepo');
    }
    const log = readStartupLog(repoRoot);
    // Expect at least one of these diagnostics to appear once implemented
    expect(log.toLowerCase()).toContain('tool count');
    expect(log).toMatch(/tools:\s*\d+/i);
  });
});

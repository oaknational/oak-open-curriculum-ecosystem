import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('MCP dev runner (tsx src/index.ts)', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: 'tsx',
      args: ['src/index.ts'],
      env: {
        ...process.env,
        OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-key',
        LOG_LEVEL: 'error',
      },
    });
    client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
    await transport.close();
  });

  it('lists non-empty tools when running dev entry', async () => {
    const res = await client.listTools();
    expect(res.tools.length).toBeGreaterThan(0);
  });
});

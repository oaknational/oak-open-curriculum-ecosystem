import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

describe('Tool list parity with SDK', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
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

  it('lists exactly the tools available in SDK.MCP_TOOLS', async () => {
    const toolsResponse = await client.listTools();
    const listedNames = toolsResponse.tools.map((t) => t.name).sort();
    const sdkNames = Object.keys(MCP_TOOLS).sort();
    expect(listedNames).toEqual(sdkNames);
  });
});

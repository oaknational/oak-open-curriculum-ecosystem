import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';

describe('Tool list parity with SDK', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    const apiKey = process.env.OAK_API_KEY;
    if (!apiKey) {
      throw new Error('OAK_API_KEY is not set');
    }

    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
      env: {
        ...process.env,
        OAK_API_KEY: apiKey,
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

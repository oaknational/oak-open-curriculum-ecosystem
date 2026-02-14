import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { toolNames } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

describe('Tool list parity with SDK', () => {
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

  it('lists exactly the tools available in @oaknational/curriculum-sdk', async () => {
    const toolsResponse = await client.listTools();
    const listedNames = toolsResponse.tools.map((t) => t.name).sort();
    const sdkNames = [...toolNames].sort();
    expect(listedNames).toEqual(sdkNames);
  });
});

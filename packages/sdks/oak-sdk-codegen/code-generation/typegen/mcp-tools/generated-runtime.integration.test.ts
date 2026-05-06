import { describe, expect, it } from 'vitest';
import createClient, { wrapAsPathBasedClient } from 'openapi-fetch';
import { callTool } from '../../../src/types/generated/api-schema/mcp-tools/runtime/execute.js';
import type { paths } from '../../../src/types/generated/api-schema/api-paths-types.js';

describe('generated MCP runtime input validation', () => {
  it('rejects unexpected arguments for parameterless tools before invoking the client', async () => {
    const client = wrapAsPathBasedClient(
      createClient<paths>({ baseUrl: 'https://example.invalid' }),
    );

    await expect(callTool('get-key-stages', client, { unexpected: true })).rejects.toThrow(
      'Invalid request parameters',
    );
  });
});

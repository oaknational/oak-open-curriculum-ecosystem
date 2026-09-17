import { createLibConfig } from '@oaknational/workspace-config/tsup';

export default createLibConfig({
  external: ['@modelcontextprotocol/sdk', '@posthog/mcp', 'posthog-node'],
});

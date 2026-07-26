import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  external: ['@modelcontextprotocol/sdk', '@posthog/mcp', 'posthog-node'],
});

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Pure function that returns server configuration
export function getServerConfig(): { name: string; version: string } {
  return {
    name: 'oak-notion-mcp',
    version: '0.0.0-development',
  };
}

// Pure function that returns server capabilities
export function getServerCapabilities(): {
  capabilities: {
    resources: Record<string, never>;
    tools: Record<string, never>;
    prompts: Record<string, never>;
  };
} {
  return {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  };
}

// Factory function - thin wrapper around SDK
export function createServer(): Server {
  return new Server(getServerConfig(), getServerCapabilities());
}

// Application entry point - orchestrates server startup (has side effects)
export async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

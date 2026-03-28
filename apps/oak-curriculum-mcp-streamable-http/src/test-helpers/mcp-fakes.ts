import { vi } from 'vitest';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServerFactory, McpRequestContext } from '../mcp-request-context.js';

export function createFakeStreamableTransport(
  handleRequestImpl?: StreamableHTTPServerTransport['handleRequest'],
): StreamableHTTPServerTransport {
  const transport = {
    handleRequest: handleRequestImpl ?? vi.fn(),
    close: vi.fn(),
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK transport type; minimal fake for handler tests
  return transport as unknown as StreamableHTTPServerTransport;
}

export function createFakeMcpServer(): McpServer {
  const server = {
    connect: vi.fn(() => Promise.resolve()),
    close: vi.fn(),
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK server type; minimal fake for handler integration tests
  return server as unknown as McpServer;
}

export function createFakeMcpServerFactory(
  handleRequestImpl?: StreamableHTTPServerTransport['handleRequest'],
): { factory: McpServerFactory; server: McpServer; transport: StreamableHTTPServerTransport } {
  const server = createFakeMcpServer();
  const transport = createFakeStreamableTransport(handleRequestImpl);
  const context: McpRequestContext = { server, transport };
  const factory: McpServerFactory = () => context;

  return { factory, server, transport };
}

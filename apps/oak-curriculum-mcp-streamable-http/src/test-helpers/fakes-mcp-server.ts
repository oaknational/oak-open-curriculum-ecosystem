/**
 * MCP server and transport test fakes.
 *
 * Minimal implementations of MCP SDK types for handler integration tests.
 * These fakes satisfy the structural subset used by `createMcpHandler` —
 * full SDK types have many more required members.
 */

import { vi } from 'vitest';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServerFactory, McpRequestContext } from '../mcp-request-context.js';

/**
 * Minimal StreamableHTTPServerTransport fake for handler tests.
 * Only handleRequest is used by createMcpHandler.
 */
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

/**
 * Minimal McpServer fake for handler integration tests.
 * Only connect() and close() are used by createMcpHandler.
 */
export function createFakeMcpServer(): McpServer {
  const server = {
    connect: vi.fn(() => Promise.resolve()),
    close: vi.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK server type; minimal fake for handler tests
  return server as unknown as McpServer;
}

/**
 * Creates a factory that returns a pre-configured fake server + transport.
 *
 * Returns the factory and the underlying fakes so tests can inspect
 * what was called on them (e.g. transport.handleRequest args).
 */
export function createFakeMcpServerFactory(
  handleRequestImpl?: StreamableHTTPServerTransport['handleRequest'],
): { factory: McpServerFactory; server: McpServer; transport: StreamableHTTPServerTransport } {
  const server = createFakeMcpServer();
  const transport = createFakeStreamableTransport(handleRequestImpl);
  const context: McpRequestContext = { server, transport };
  const factory: McpServerFactory = () => context;
  return { factory, server, transport };
}

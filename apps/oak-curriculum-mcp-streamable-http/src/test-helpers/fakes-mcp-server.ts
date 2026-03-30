/**
 * MCP server and transport test fakes.
 *
 * Returns narrow interfaces (`McpRequestServer`, `McpRequestTransport`) that
 * the product code depends on — no type assertions needed because the fakes
 * satisfy the interfaces structurally.
 *
 * @see ADR-078 Dependency Injection for Testability
 */

import { vi } from 'vitest';
import type {
  McpRequestServer,
  McpRequestTransport,
  McpRequestContext,
  McpServerFactory,
} from '../mcp-request-context.js';

/**
 * Minimal transport fake for handler tests.
 * Satisfies `McpRequestTransport` structurally — only `handleRequest` and `close`.
 */
export function createFakeStreamableTransport(
  handleRequestImpl?: McpRequestTransport['handleRequest'],
): McpRequestTransport {
  return {
    handleRequest: handleRequestImpl ?? vi.fn(),
    close: vi.fn(),
  };
}

/**
 * Minimal server fake for handler integration tests.
 * Satisfies `McpRequestServer` structurally — only `connect` and `close`.
 */
export function createFakeMcpServer(): McpRequestServer {
  return {
    connect: vi.fn(() => Promise.resolve()),
    close: vi.fn(),
  };
}

/**
 * Creates a factory that returns a pre-configured fake server + transport.
 *
 * Returns the factory and the underlying fakes so tests can inspect
 * what was called on them (e.g. transport.handleRequest args).
 */
export function createFakeMcpServerFactory(
  handleRequestImpl?: McpRequestTransport['handleRequest'],
): { factory: McpServerFactory; server: McpRequestServer; transport: McpRequestTransport } {
  const server = createFakeMcpServer();
  const transport = createFakeStreamableTransport(handleRequestImpl);
  const context: McpRequestContext = { server, transport };
  const factory: McpServerFactory = () => context;
  return { factory, server, transport };
}

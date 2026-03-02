/**
 * Per-request MCP server + transport contract.
 *
 * Shared types used by the composition root (application.ts), request handlers,
 * auth routes, and test fakes. Lives in its own module to avoid the composition
 * root being imported by lower layers.
 *
 * @see ADR-112 Per-Request MCP Transport
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

/** Per-request MCP server + transport pair. @see ADR-112 */
export interface McpRequestContext {
  readonly server: McpServer;
  readonly transport: StreamableHTTPServerTransport;
}

/** Factory creating a fresh McpServer + transport per request (stateless mode). */
export type McpServerFactory = () => McpRequestContext;

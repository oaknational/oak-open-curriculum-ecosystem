import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Server interface for resource registration — delegates to `McpServer`.
 *
 * Uses `Pick<McpServer, 'registerResource'>` so that `registerAppResource()`
 * (which needs the full `McpServer.registerResource` overloads) can accept the
 * same server reference.
 */
export type ResourceRegistrar = Pick<McpServer, 'registerResource'>;

export interface ResourceRegistrationOptions {
  /** Returns the HTML payload served by the MCP App widget resource. */
  readonly getWidgetHtml: () => string;
}

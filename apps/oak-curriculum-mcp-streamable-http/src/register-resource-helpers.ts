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
  /**
   * Whether the EEF surface is enabled (`OAK_CURRICULUM_MCP_EEF_ENABLED`,
   * kill-switch, default ON). Gates the `eef://interpretation` resource at
   * registration — an explicit `=false` removes it. The tool and prompt are
   * co-gated by the same flag (D6 c6).
   */
  readonly eefEnabled: boolean;
}

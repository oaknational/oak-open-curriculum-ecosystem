/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Oak JSON viewer widget for tool output rendering
 * - Documentation resources for the "start here" experience
 *
 * @module register-resources
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  DOCUMENTATION_RESOURCES,
  getDocumentationContent,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';
import {
  AGGREGATED_TOOL_WIDGET_URI,
  AGGREGATED_TOOL_WIDGET_MIME_TYPE,
  AGGREGATED_TOOL_WIDGET_HTML,
} from './aggregated-tool-widget.js';

/**
 * Registers the Oak JSON viewer widget as an MCP resource.
 *
 * This widget is referenced by aggregated tools via _meta["openai/outputTemplate"]
 * and used by ChatGPT to render tool output with Oak branding.
 *
 * @param server - MCP server instance
 */
export function registerWidgetResource(server: McpServer): void {
  server.registerResource(
    'oak-json-viewer',
    AGGREGATED_TOOL_WIDGET_URI,
    {
      description: 'Oak-branded JSON viewer widget for tool output',
      mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
    },
    () => ({
      contents: [
        {
          uri: AGGREGATED_TOOL_WIDGET_URI,
          mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
          text: AGGREGATED_TOOL_WIDGET_HTML,
        },
      ],
    }),
  );
}

/**
 * Registers documentation resources for the "start here" experience.
 *
 * These markdown resources provide server-level documentation that MCP clients
 * can list via resources/list and read via resources/read. Content includes:
 * - Getting started guide
 * - Tool reference by category
 * - Common workflow guides
 *
 * @param server - MCP server instance
 */
export function registerDocumentationResources(server: McpServer): void {
  for (const resource of DOCUMENTATION_RESOURCES) {
    server.registerResource(
      resource.name,
      resource.uri,
      {
        description: resource.description,
        mimeType: resource.mimeType,
      },
      () => {
        const content = getDocumentationContent(resource.uri);
        return {
          contents: [
            {
              uri: resource.uri,
              mimeType: resource.mimeType,
              text: content ?? `# ${resource.title}\n\nContent not found.`,
            },
          ],
        };
      },
    );
  }
}

/**
 * Registers all static resources with the MCP server.
 *
 * Combines widget and documentation resource registration into a single call
 * for cleaner server setup.
 *
 * @param server - MCP server instance
 */
export function registerAllResources(server: McpServer): void {
  registerWidgetResource(server);
  registerDocumentationResources(server);
}

// Re-export prompts registration for use in handlers
export { registerPrompts } from './register-prompts.js';

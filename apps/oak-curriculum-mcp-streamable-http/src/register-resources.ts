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
  ONTOLOGY_RESOURCE,
  getOntologyJson,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';
import {
  AGGREGATED_TOOL_WIDGET_URI,
  AGGREGATED_TOOL_WIDGET_MIME_TYPE,
  AGGREGATED_TOOL_WIDGET_HTML,
} from './aggregated-tool-widget.js';

/**
 * OpenAI Apps SDK Content Security Policy for the widget.
 *
 * Defines allowed domains for outbound requests from within the widget sandbox.
 * The widget itself is protected from arbitrary iframe embedding by the MCP
 * architecture - only ChatGPT can access MCP resources.
 *
 * @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields
 */
const WIDGET_CSP = {
  /** Domains the widget can make fetch/XHR requests to */
  connect_domains: ['https://*.thenational.academy'],
  /** Domains the widget can load static resources from (fonts, images) */
  resource_domains: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://*.thenational.academy',
  ],
} as const;

/**
 * Human-readable description for the widget, shown to the model.
 * Includes context grounding guidance to call get-ontology first.
 *
 * @remarks
 * - Must be ≤200 characters per OpenAI guidance
 * - Model sees this when widget loads, reducing redundant narration
 * - Guides model to call get-ontology for domain understanding
 *
 * @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields
 */
const WIDGET_DESCRIPTION =
  'Oak curriculum explorer. For best results, call get-ontology and get-help first to understand the curriculum domain model.';

/**
 * Registers the Oak JSON viewer widget as an MCP resource.
 *
 * This widget is referenced by aggregated tools via _meta["openai/outputTemplate"]
 * and used by ChatGPT to render tool output with Oak branding.
 *
 * Includes OpenAI Apps SDK _meta fields required for production deployment:
 * - openai/widgetCSP: Content Security Policy for outbound requests
 * - openai/widgetPrefersBorder: Hint for bordered card rendering
 * - openai/widgetDescription: Human-readable summary for the model
 *
 * @param server - MCP server instance
 * @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields
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
          _meta: {
            'openai/widgetCSP': WIDGET_CSP,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDescription': WIDGET_DESCRIPTION,
          },
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
 * Registers the curriculum ontology as an MCP resource.
 *
 * This resource exposes the complete curriculum domain model as JSON,
 * complementing the `get-ontology` tool. While the tool is model-controlled,
 * this resource allows application-controlled context injection for MCP
 * clients that support pre-fetching resources.
 *
 * @param server - MCP server instance
 * @see ADR-058 for the dual exposure pattern
 */
export function registerOntologyResource(server: McpServer): void {
  server.registerResource(
    ONTOLOGY_RESOURCE.name,
    ONTOLOGY_RESOURCE.uri,
    {
      description: ONTOLOGY_RESOURCE.description,
      mimeType: ONTOLOGY_RESOURCE.mimeType,
    },
    () => ({
      contents: [
        {
          uri: ONTOLOGY_RESOURCE.uri,
          mimeType: ONTOLOGY_RESOURCE.mimeType,
          text: getOntologyJson(),
        },
      ],
    }),
  );
}

/**
 * Registers all static resources with the MCP server.
 *
 * Combines widget, documentation, and ontology resource registration into
 * a single call for cleaner server setup.
 *
 * @param server - MCP server instance
 */
export function registerAllResources(server: McpServer): void {
  registerWidgetResource(server);
  registerDocumentationResources(server);
  registerOntologyResource(server);
}

// Re-export prompts registration for use in handlers
export { registerPrompts } from './register-prompts.js';

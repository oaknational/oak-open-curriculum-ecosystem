/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Oak JSON viewer widget for tool output rendering
 * - Documentation resources for the "start here" experience
 *
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import {
  WIDGET_URI,
  DOCUMENTATION_RESOURCES,
  getDocumentationContent,
  CURRICULUM_MODEL_RESOURCE,
  getCurriculumModelJson,
  PREREQUISITE_GRAPH_RESOURCE,
  getPrerequisiteGraphJson,
  THREAD_PROGRESSIONS_RESOURCE,
  getThreadProgressionsJson,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { AGGREGATED_TOOL_WIDGET_HTML } from './aggregated-tool-widget.js';

/**
 * MCP Apps Content Security Policy for the widget.
 *
 * The widget loads Google Fonts only. All tool data flows through the host's
 * MCP bridge rather than direct HTTP requests, as verified by the WS2 audit of
 * widget renderers and widget state scripts.
 */
const WIDGET_CSP = {
  /** Domains the widget can load static resources from */
  resourceDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
} as const;

/**
 * Registers the Oak JSON viewer widget as an MCP resource.
 *
 * This widget is referenced by aggregated tools via `_meta.ui.resourceUri` and
 * renders tool output with Oak branding.
 *
 * The widget URI includes a cache-busting hash generated at sdk-codegen time.
 * Each build produces a new hash, ensuring hosts fetch the latest
 * widget bundle instead of using a stale cached version.
 *
 * Includes MCP Apps resource metadata required for the widget host:
 * - `_meta.ui.csp`: Content Security Policy for external assets
 * - `_meta.ui.prefersBorder`: Hint for bordered card rendering
 *
 * @param server - MCP server instance
 */
export function registerWidgetResource(server: Pick<McpServer, 'registerResource'>): void {
  registerAppResource(
    server,
    'oak-json-viewer',
    WIDGET_URI,
    {
      description: 'Oak-branded JSON viewer widget for tool output',
    },
    () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: AGGREGATED_TOOL_WIDGET_HTML,
          _meta: {
            ui: {
              csp: WIDGET_CSP,
              prefersBorder: true,
            },
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
export function registerDocumentationResources(server: Pick<McpServer, 'registerResource'>): void {
  for (const resource of DOCUMENTATION_RESOURCES) {
    const { name, uri, ...metadata } = resource;
    server.registerResource(name, uri, metadata, () => {
      const content = getDocumentationContent(uri);
      return {
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: content ?? `# ${resource.title}\n\nContent not found.`,
          },
        ],
      };
    });
  }
}

/** Registers the curriculum model as an MCP resource, complementing `get-curriculum-model`. */
export function registerCurriculumModelResource(server: Pick<McpServer, 'registerResource'>): void {
  const { name, uri, ...metadata } = CURRICULUM_MODEL_RESOURCE;
  server.registerResource(name, uri, metadata, () => ({
    contents: [
      {
        uri,
        mimeType: CURRICULUM_MODEL_RESOURCE.mimeType,
        text: getCurriculumModelJson(),
      },
    ],
  }));
}

/** Registers the prerequisite graph as an MCP resource, complementing `get-prerequisite-graph`. */
export function registerPrerequisiteGraphResource(
  server: Pick<McpServer, 'registerResource'>,
): void {
  const { name, uri, ...metadata } = PREREQUISITE_GRAPH_RESOURCE;
  server.registerResource(name, uri, metadata, () => ({
    contents: [
      {
        uri,
        mimeType: PREREQUISITE_GRAPH_RESOURCE.mimeType,
        text: getPrerequisiteGraphJson(),
      },
    ],
  }));
}

/** Registers thread progressions as an MCP resource, complementing `get-thread-progressions`. */
export function registerThreadProgressionsResource(
  server: Pick<McpServer, 'registerResource'>,
): void {
  const { name, uri, ...metadata } = THREAD_PROGRESSIONS_RESOURCE;
  server.registerResource(name, uri, metadata, () => ({
    contents: [
      {
        uri,
        mimeType: THREAD_PROGRESSIONS_RESOURCE.mimeType,
        text: getThreadProgressionsJson(),
      },
    ],
  }));
}

/**
 * Registers all static resources with the MCP server.
 *
 * Combines widget, documentation, curriculum model, prerequisite graph,
 * and thread progressions resource registration into a single call.
 *
 * @param server - MCP server instance
 */
export function registerAllResources(server: Pick<McpServer, 'registerResource'>): void {
  registerWidgetResource(server);
  registerDocumentationResources(server);
  registerCurriculumModelResource(server);
  registerPrerequisiteGraphResource(server);
  registerThreadProgressionsResource(server);
}

// Re-export prompts registration for use in handlers
export { registerPrompts } from './register-prompts.js';

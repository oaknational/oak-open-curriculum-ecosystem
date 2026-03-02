/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Oak JSON viewer widget for tool output rendering
 * - Documentation resources for the "start here" experience
 *
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Minimal interface for resource registration. Used by tests with fakes.
 * McpServer satisfies this.
 */
export type ResourceRegistrar = Pick<McpServer, 'registerResource'>;
import {
  DOCUMENTATION_RESOURCES,
  getDocumentationContent,
  CURRICULUM_MODEL_RESOURCE,
  getCurriculumModelJson,
  PREREQUISITE_GRAPH_RESOURCE,
  getPrerequisiteGraphJson,
  THREAD_PROGRESSIONS_RESOURCE,
  getThreadProgressionsJson,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  getToolWidgetUri,
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
 *
 * @remarks
 * - Must be ≤200 characters per OpenAI guidance
 * - Model sees this when widget loads, reducing redundant narration
 * - Guides model to call get-curriculum-model for domain understanding
 *
 * @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields
 */
const WIDGET_DESCRIPTION =
  'Oak Open Curriculum: you MUST use the get-curriculum-model tool before calling other tools in order to give relevant responses.';

/**
 * Options for widget resource registration.
 *
 * @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields
 */
export interface WidgetResourceOptions {
  /**
   * Dedicated origin for the widget sandbox, required for OpenAI app submission.
   *
   * ChatGPT renders the widget under `<domain>.web-sandbox.oaiusercontent.com`.
   * Derived from the deployment URL at runtime (e.g. VERCEL_URL).
   *
   * @example "https://curriculum-mcp-alpha.oaknational.dev"
   */
  readonly widgetDomain?: string;
}

/**
 * Registers the Oak JSON viewer widget as an MCP resource.
 *
 * This widget is referenced by aggregated tools via _meta["openai/outputTemplate"]
 * and used by ChatGPT to render tool output with Oak branding.
 *
 * The widget URI includes a cache-busting hash generated at sdk-codegen time.
 * Each build produces a new hash, ensuring ChatGPT fetches the latest
 * widget bundle instead of using a stale cached version.
 *
 * This aligns with OpenAI's best practice: "give the template a new URI"
 * whenever widget HTML/CSS/JS changes.
 *
 * Includes OpenAI Apps SDK _meta fields required for production deployment:
 * - openai/widgetCSP: Content Security Policy for outbound requests
 * - openai/widgetPrefersBorder: Hint for bordered card rendering
 * - openai/widgetDescription: Human-readable summary for the model
 * - openai/widgetDomain: Dedicated sandbox origin (when available)
 *
 * @param server - MCP server instance
 * @param options - Optional widget configuration (e.g. widgetDomain)
 * @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (cache-busting guidance)
 */
export function registerWidgetResource(
  server: ResourceRegistrar,
  options?: WidgetResourceOptions,
): void {
  const widgetUri = getToolWidgetUri();
  server.registerResource(
    'oak-json-viewer',
    widgetUri,
    {
      description: 'Oak-branded JSON viewer widget for tool output',
      mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
    },
    () => ({
      contents: [
        {
          uri: widgetUri,
          mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
          text: AGGREGATED_TOOL_WIDGET_HTML,
          _meta: {
            'openai/widgetCSP': WIDGET_CSP,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDescription': WIDGET_DESCRIPTION,
            ...(options?.widgetDomain ? { 'openai/widgetDomain': options.widgetDomain } : {}),
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
export function registerDocumentationResources(server: ResourceRegistrar): void {
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
export function registerCurriculumModelResource(server: ResourceRegistrar): void {
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
export function registerPrerequisiteGraphResource(server: ResourceRegistrar): void {
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
export function registerThreadProgressionsResource(server: ResourceRegistrar): void {
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
 * @param options - Optional widget configuration (e.g. widgetDomain)
 */
export function registerAllResources(
  server: ResourceRegistrar,
  options?: WidgetResourceOptions,
): void {
  registerWidgetResource(server, options);
  registerDocumentationResources(server);
  registerCurriculumModelResource(server);
  registerPrerequisiteGraphResource(server);
  registerThreadProgressionsResource(server);
}

// Re-export prompts registration for use in handlers
export { registerPrompts } from './register-prompts.js';

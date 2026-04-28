/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Documentation resources for the "start here" experience
 * - Curriculum model, prior knowledge graph, and thread progressions
 * - MCP App widget resource (interactive React curriculum app)
 */

import {
  DOCUMENTATION_RESOURCES,
  getDocumentationContent,
  CURRICULUM_MODEL_RESOURCE,
  getCurriculumModelJson,
  PRIOR_KNOWLEDGE_GRAPH_RESOURCE,
  getPriorKnowledgeGraphJson,
  THREAD_PROGRESSIONS_RESOURCE,
  getThreadProgressionsJson,
  MISCONCEPTION_GRAPH_RESOURCE,
  getMisconceptionGraphJson,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import {
  type ResourceRegistrar,
  type ResourceRegistrationOptions,
} from './register-resource-helpers.js';
import { registerWidgetResource } from './register-widget-resource.js';

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
 * @param observability - Observability for resource handler tracing
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

/**
 * Registers a graph resource with the MCP server.
 *
 * Generic helper that eliminates per-graph registration boilerplate.
 * Each graph surface (prior knowledge, thread progressions, misconception, etc.)
 * follows the same registration pattern — only the resource constant and
 * JSON getter differ.
 *
 * @param server - MCP server instance
 * @param resource - Resource constant from the SDK (name, uri, mimeType, etc.)
 * @param getJson - Function returning the graph data as formatted JSON
 * @param observability - Observability for resource handler tracing
 */
function registerGraphResource(
  server: ResourceRegistrar,
  resource: {
    readonly name: string;
    readonly uri: string;
    readonly title: string;
    readonly description: string;
    readonly mimeType: string;
    readonly annotations: {
      readonly priority: 0.5 | 1.0;
      readonly audience: ('user' | 'assistant')[];
    };
  },
  getJson: () => string,
): void {
  const { name, uri, ...metadata } = resource;
  server.registerResource(name, uri, metadata, () => ({
    contents: [
      {
        uri,
        mimeType: resource.mimeType,
        text: getJson(),
      },
    ],
  }));
}

/**
 * Registers all static resources with the MCP server.
 *
 * Combines documentation, curriculum model, prior knowledge graph,
 * thread progressions, and widget resource registration into a single call.
 *
 * @param server - MCP server instance
 * @param options - Resource registration options including observability
 */
export function registerAllResources(
  server: ResourceRegistrar,
  options: ResourceRegistrationOptions,
): void {
  registerDocumentationResources(server);
  registerCurriculumModelResource(server);
  registerGraphResource(server, PRIOR_KNOWLEDGE_GRAPH_RESOURCE, getPriorKnowledgeGraphJson);
  registerGraphResource(server, THREAD_PROGRESSIONS_RESOURCE, getThreadProgressionsJson);
  registerGraphResource(server, MISCONCEPTION_GRAPH_RESOURCE, getMisconceptionGraphJson);
  registerWidgetResource(server, options.getWidgetHtml);
}

export { registerPrompts } from './register-prompts.js';
export type { ResourceRegistrationOptions } from './register-resource-helpers.js';

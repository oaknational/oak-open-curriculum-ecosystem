/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Documentation resources for the "start here" experience
 * - Curriculum model, prerequisite graph, and thread progressions
 *
 * Widget resource registration was removed as part of WS3 Phase 1
 * (legacy widget framework deletion). Phase 2-3 will re-introduce
 * widget registration using the fresh React MCP App.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Minimal server interface for resource registration.
 *
 * An interface (not a type alias) that narrows McpServer to the single
 * method needed for resource registration. Avoids repeating
 * `Pick<McpServer, 'registerResource'>` at every function signature.
 */
interface ResourceRegistrar {
  registerResource: McpServer['registerResource'];
}
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
 * Combines documentation, curriculum model, prerequisite graph,
 * and thread progressions resource registration into a single call.
 *
 * Widget resource registration will be re-added in WS3 Phase 2-3
 * when the fresh React MCP App is scaffolded.
 *
 * @param server - MCP server instance
 */
export function registerAllResources(server: ResourceRegistrar): void {
  registerDocumentationResources(server);
  registerCurriculumModelResource(server);
  registerPrerequisiteGraphResource(server);
  registerThreadProgressionsResource(server);
}

// Re-export prompts registration for use in handlers
export { registerPrompts } from './register-prompts.js';

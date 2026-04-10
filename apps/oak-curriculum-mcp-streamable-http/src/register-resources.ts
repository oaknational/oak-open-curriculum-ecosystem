/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Documentation resources for the "start here" experience
 * - Curriculum model, prerequisite graph, and thread progressions
 * - MCP App widget resource (interactive React curriculum app)
 */

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
  wrapResourceHandler,
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
export function registerDocumentationResources(
  server: ResourceRegistrar,
  observability: ResourceRegistrationOptions['observability'],
): void {
  for (const resource of DOCUMENTATION_RESOURCES) {
    const { name, uri, ...metadata } = resource;
    server.registerResource(
      name,
      uri,
      metadata,
      wrapResourceHandler(
        name,
        () => {
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
        },
        observability,
      ),
    );
  }
}

/** Registers the curriculum model as an MCP resource, complementing `get-curriculum-model`. */
export function registerCurriculumModelResource(
  server: ResourceRegistrar,
  observability: ResourceRegistrationOptions['observability'],
): void {
  const { name, uri, ...metadata } = CURRICULUM_MODEL_RESOURCE;
  server.registerResource(
    name,
    uri,
    metadata,
    wrapResourceHandler(
      name,
      () => ({
        contents: [
          {
            uri,
            mimeType: CURRICULUM_MODEL_RESOURCE.mimeType,
            text: getCurriculumModelJson(),
          },
        ],
      }),
      observability,
    ),
  );
}

/** Registers the prerequisite graph as an MCP resource, complementing `get-prerequisite-graph`. */
export function registerPrerequisiteGraphResource(
  server: ResourceRegistrar,
  observability: ResourceRegistrationOptions['observability'],
): void {
  const { name, uri, ...metadata } = PREREQUISITE_GRAPH_RESOURCE;
  server.registerResource(
    name,
    uri,
    metadata,
    wrapResourceHandler(
      name,
      () => ({
        contents: [
          {
            uri,
            mimeType: PREREQUISITE_GRAPH_RESOURCE.mimeType,
            text: getPrerequisiteGraphJson(),
          },
        ],
      }),
      observability,
    ),
  );
}

/** Registers thread progressions as an MCP resource, complementing `get-thread-progressions`. */
export function registerThreadProgressionsResource(
  server: ResourceRegistrar,
  observability: ResourceRegistrationOptions['observability'],
): void {
  const { name, uri, ...metadata } = THREAD_PROGRESSIONS_RESOURCE;
  server.registerResource(
    name,
    uri,
    metadata,
    wrapResourceHandler(
      name,
      () => ({
        contents: [
          {
            uri,
            mimeType: THREAD_PROGRESSIONS_RESOURCE.mimeType,
            text: getThreadProgressionsJson(),
          },
        ],
      }),
      observability,
    ),
  );
}

/**
 * Registers all static resources with the MCP server.
 *
 * Combines documentation, curriculum model, prerequisite graph,
 * thread progressions, and widget resource registration into a single call.
 *
 * @param server - MCP server instance
 * @param options - Resource registration options including observability
 */
export function registerAllResources(
  server: ResourceRegistrar,
  options: ResourceRegistrationOptions,
): void {
  registerDocumentationResources(server, options.observability);
  registerCurriculumModelResource(server, options.observability);
  registerPrerequisiteGraphResource(server, options.observability);
  registerThreadProgressionsResource(server, options.observability);
  registerWidgetResource(server, options.getWidgetHtml, options.observability);
}

export { registerPrompts } from './register-prompts.js';
export { registerWidgetResource } from './register-widget-resource.js';
export type {
  ResourceRegistrar,
  ResourceRegistrationOptions,
} from './register-resource-helpers.js';

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
import type { HttpObservability } from './observability/http-observability.js';
import { maybeWrapResourceHandler, type ResourceRegistrar } from './register-resource-helpers.js';

export function registerDocumentationResources(
  server: ResourceRegistrar,
  observability?: HttpObservability,
): void {
  for (const resource of DOCUMENTATION_RESOURCES) {
    const { name, uri, ...metadata } = resource;
    server.registerResource(
      name,
      uri,
      metadata,
      maybeWrapResourceHandler(
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

export function registerCurriculumModelResource(
  server: ResourceRegistrar,
  observability?: HttpObservability,
): void {
  const { name, uri, ...metadata } = CURRICULUM_MODEL_RESOURCE;
  server.registerResource(
    name,
    uri,
    metadata,
    maybeWrapResourceHandler(
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

export function registerPrerequisiteGraphResource(
  server: ResourceRegistrar,
  observability?: HttpObservability,
): void {
  const { name, uri, ...metadata } = PREREQUISITE_GRAPH_RESOURCE;
  server.registerResource(
    name,
    uri,
    metadata,
    maybeWrapResourceHandler(
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

export function registerThreadProgressionsResource(
  server: ResourceRegistrar,
  observability?: HttpObservability,
): void {
  const { name, uri, ...metadata } = THREAD_PROGRESSIONS_RESOURCE;
  server.registerResource(
    name,
    uri,
    metadata,
    maybeWrapResourceHandler(
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

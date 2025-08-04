/**
 * @fileoverview Resource handlers public API
 * @module @notion-mcp/resources/handlers
 */

import type {
  Resource,
  ListResourcesResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import type { CoreDependencies } from '../../../../types/dependencies.js';
import { handleReadResource } from './read-resource.js';

// Handler functions interface
export interface ResourceHandlers {
  handleListResources(): Promise<ListResourcesResult>;
  handleReadResource(uri: string): Promise<ReadResourceResult>;
}

/**
 * Creates resource handlers with injected dependencies
 */
export function createResourceHandlers(deps: CoreDependencies): ResourceHandlers {
  const { logger } = deps;

  return {
    handleListResources(): Promise<ListResourcesResult> {
      logger.debug('Listing available resources');

      // Define available resource templates
      const resources: Resource[] = [
        {
          uri: 'notion://discovery',
          name: 'Notion Resource Discovery',
          description: 'Discover available Notion resources dynamically',
          mimeType: 'application/json',
        },
      ];

      return Promise.resolve({ resources });
    },

    handleReadResource: (uri: string) => handleReadResource(uri, deps),
  };
}

// Re-export for convenience
export { handleReadResource } from './read-resource.js';
export { handleDiscoveryResource } from './discovery.js';

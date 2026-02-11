/**
 * @fileoverview Resource handlers public API
 */

import type {
  Resource,
  ListResourcesResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import type { NotionDependencies } from '../../../types/notion-types/dependencies';
import { handleReadResource } from './read-resource';

// Handler functions interface
export interface ResourceHandlers {
  handleListResources(): Promise<ListResourcesResult>;
  handleReadResource(uri: string): Promise<ReadResourceResult>;
}

/**
 * Creates resource handlers with injected dependencies
 */
export function createResourceHandlers(deps: NotionDependencies): ResourceHandlers {
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
export { handleReadResource } from './read-resource';
export { handleDiscoveryResource } from './discovery';

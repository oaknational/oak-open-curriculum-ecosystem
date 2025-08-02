/**
 * Notion search operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../types/dependencies.js';
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints.js';
import { notionSearchSchema } from '../schemas.js';
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
} from '../../../notion/transformers.js';
import { formatSearchResults } from '../../../notion/formatters.js';
import type { ToolExecutor, ToolLogger } from '../core/types.js';

export interface SearchDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
}

/**
 * Creates a search executor
 * Handles Notion API interaction and formatting
 */
export function createSearchExecutor(deps: SearchDependencies): ToolExecutor {
  return {
    async execute(input: unknown): Promise<string> {
      // Validate input
      const validatedArgs = notionSearchSchema.parse(input);

      deps.logger.debug('Searching Notion', { query: validatedArgs.query });

      // Build search parameters
      const searchParams: Parameters<typeof deps.notionClient.search>[0] = {
        query: validatedArgs.query,
      };

      if (validatedArgs.filter?.type) {
        searchParams.filter = { property: 'object', value: validatedArgs.filter.type };
      }

      if (validatedArgs.sort) {
        searchParams.sort = {
          timestamp: validatedArgs.sort.timestamp,
          direction: validatedArgs.sort.direction,
        };
      }

      // Execute search
      const searchResponse = await deps.notionClient.search(searchParams);

      // Filter to ensure we have full objects with id property
      const results = searchResponse.results.filter(
        (result): result is PageObjectResponse | DatabaseObjectResponse => 'id' in result,
      );

      // Transform results
      const resources = results.map((result) => {
        if (result.object === 'page') {
          return transformNotionPageToMcpResource(result);
        } else {
          return transformNotionDatabaseToMcpResource(result);
        }
      });

      // Format for output
      return formatSearchResults(results, validatedArgs.query, resources);
    },
  };
}

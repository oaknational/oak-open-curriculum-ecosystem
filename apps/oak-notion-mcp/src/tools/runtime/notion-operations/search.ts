/**
 * Notion search operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../types/notion-types/notion-client';
import type { NotionOperations } from '../../../types/notion-contracts/notion-operations';
import type {
  PageObjectResponse,
  DataSourceObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { notionSearchSchema } from '../schemas';
import type { ToolExecutor, ToolLogger } from '../core/types';

export interface SearchDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
  notionOperations: NotionOperations;
}

/**
 * Builds search parameters from validated arguments
 */
function buildSearchParams(
  validatedArgs: ReturnType<typeof notionSearchSchema.parse>,
): Parameters<MinimalNotionClient['search']>[0] {
  const searchParams: Parameters<MinimalNotionClient['search']>[0] = {
    query: validatedArgs.query,
  };

  if (validatedArgs.filter?.type) {
    // Map 'database' to 'data_source' for the API
    const filterValue =
      validatedArgs.filter.type === 'database' ? 'data_source' : validatedArgs.filter.type;
    searchParams.filter = { property: 'object', value: filterValue };
  }

  if (validatedArgs.sort) {
    searchParams.sort = {
      timestamp: validatedArgs.sort.timestamp,
      direction: validatedArgs.sort.direction,
    };
  }

  return searchParams;
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
      const searchParams = buildSearchParams(validatedArgs);

      // Execute search
      const searchResponse = await deps.notionClient.search(searchParams);

      // Filter to ensure we have full objects with id property
      const results = searchResponse.results.filter(
        (result): result is PageObjectResponse | DataSourceObjectResponse => 'id' in result,
      );

      // Transform results using injected operations
      const resources = results.map((result) => {
        if (result.object === 'page') {
          return deps.notionOperations.transformers.transformNotionPageToMcpResource(result);
        } else {
          return deps.notionOperations.transformers.transformNotionDatabaseToMcpResource(result);
        }
      });

      // Format for output using injected operations
      return deps.notionOperations.formatters.formatSearchResults(
        results,
        validatedArgs.query,
        resources,
      );
    },
  };
}

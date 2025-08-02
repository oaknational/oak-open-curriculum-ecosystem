/**
 * Notion list databases operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../types/dependencies.js';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { notionListDatabasesSchema } from '../schemas.js';
import { transformNotionDatabaseToMcpResource } from '../../../notion/transformers.js';
import { formatDatabaseList } from '../../../notion/formatters.js';
import type { ToolExecutor, ToolLogger } from '../core/types.js';

export interface ListDatabasesDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
}

/**
 * Creates a list databases executor
 * Handles Notion API interaction and formatting
 */
export function createListDatabasesExecutor(deps: ListDatabasesDependencies): ToolExecutor {
  return {
    async execute(input: unknown): Promise<string> {
      // Validate input
      notionListDatabasesSchema.parse(input);

      deps.logger.debug('Listing Notion databases');

      // Search for all databases
      const searchResponse = await deps.notionClient.search({
        query: '',
        filter: { property: 'object', value: 'database' },
      });

      // Filter to ensure we have full database objects with title
      const results = searchResponse.results.filter(
        (result): result is DatabaseObjectResponse => 'title' in result,
      );

      // Transform results
      const resources = results.map(transformNotionDatabaseToMcpResource);

      // Format for output
      return formatDatabaseList(results, resources);
    },
  };
}

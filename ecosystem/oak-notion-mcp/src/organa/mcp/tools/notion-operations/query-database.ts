/**
 * Notion query database operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../../chora/stroma/notion-types/notion-client.js';
import type { NotionOperations } from '../../../../chora/stroma/notion-contracts/notion-operations.js';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { isFullDatabase } from '@notionhq/client/build/src/helpers.js';
import { notionQueryDatabaseSchema } from '../schemas.js';
import type { ToolExecutor, ToolLogger } from '../core/types.js';

export interface QueryDatabaseDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
  notionOperations: NotionOperations;
}

/**
 * Builds query parameters for database query
 */
function buildQueryParams(validatedArgs: ReturnType<typeof notionQueryDatabaseSchema.parse>) {
  const queryParams: Parameters<MinimalNotionClient['databases']['query']>[0] = {
    database_id: validatedArgs.database_id,
    page_size: validatedArgs.page_size ?? 20,
  };

  if (validatedArgs.sorts) {
    queryParams.sorts = validatedArgs.sorts;
  }

  if (validatedArgs.filter) {
    // The Notion SDK expects a specific filter type that we can't fully type
    // without importing complex internal types. The filter is validated by Zod
    // and will be runtime-checked by the Notion API.
    Object.assign(queryParams, { filter: validatedArgs.filter });
  }

  return queryParams;
}

/**
 * Creates a query database executor
 * Handles Notion API interaction and formatting
 */
export function createQueryDatabaseExecutor(deps: QueryDatabaseDependencies): ToolExecutor {
  return {
    async execute(input: unknown): Promise<string> {
      // Validate input
      const validatedArgs = notionQueryDatabaseSchema.parse(input);

      deps.logger.debug('Querying database', { database_id: validatedArgs.database_id });

      // Get database info first
      const dbResponse = await deps.notionClient.databases.retrieve({
        database_id: validatedArgs.database_id,
      });

      // Ensure we have a full database response
      if (!isFullDatabase(dbResponse)) {
        throw new Error(
          'Invalid database response - missing required fields like title. The database may have restricted permissions.',
        );
      }

      const dbResource =
        deps.notionOperations.transformers.transformNotionDatabaseToMcpResource(dbResponse);

      // Build and execute query
      const queryParams = buildQueryParams(validatedArgs);
      const queryResponse = await deps.notionClient.databases.query(queryParams);

      // Filter for full page responses
      const pages = queryResponse.results.filter(
        (result): result is PageObjectResponse =>
          result.object === 'page' && 'properties' in result,
      );

      // Transform results
      const pageResources = pages.map((page) =>
        deps.notionOperations.transformers.transformNotionPageToMcpResource(page),
      );

      // Format for output
      return deps.notionOperations.formatters.formatDatabaseQueryResults(
        dbResource,
        pages,
        pageResources,
      );
    },
  };
}

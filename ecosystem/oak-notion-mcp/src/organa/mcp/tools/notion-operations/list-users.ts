/**
 * Notion list users operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../../chora/stroma/notion-types/notion-client.js';
import type { NotionOperations } from '../../../../chora/stroma/notion-contracts/notion-operations.js';
import { notionListUsersSchema } from '../schemas.js';
import type { ToolExecutor, ToolLogger } from '../core/types.js';

export interface ListUsersDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
  notionOperations: NotionOperations;
}

/**
 * Creates a list users executor
 * Handles Notion API interaction and formatting
 */
export function createListUsersExecutor(deps: ListUsersDependencies): ToolExecutor {
  return {
    async execute(input: unknown): Promise<string> {
      // Validate input
      notionListUsersSchema.parse(input);

      deps.logger.debug('Listing Notion users');

      // List users
      const usersResponse = await deps.notionClient.users.list({});
      const users = usersResponse.results;

      // Transform results
      const resources = users.map((user) =>
        deps.notionOperations.transformers.transformNotionUserToMcpResource(user),
      );

      // Format for output
      return deps.notionOperations.formatters.formatUserList(users, resources);
    },
  };
}

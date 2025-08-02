/**
 * Notion list users operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../types/dependencies.js';
import { notionListUsersSchema } from '../schemas.js';
import { transformNotionUserToMcpResource } from '../../../notion/transformers.js';
import { formatUserList } from '../../../notion/formatters.js';
import type { ToolExecutor, ToolLogger } from '../core/types.js';

export interface ListUsersDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
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
      const resources = users.map(transformNotionUserToMcpResource);

      // Format for output
      return formatUserList(users, resources);
    },
  };
}

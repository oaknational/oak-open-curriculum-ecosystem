/**
 * Notion get page operation
 * Pure business logic with no MCP concerns
 */

import type { MinimalNotionClient } from '../../../types/notion-types/notion-client';
import type { NotionOperations } from '../../../types/notion-contracts/notion-operations';
import { isFullPage, isFullBlock } from '@notionhq/client/build/src/helpers';
import { notionGetPageSchema } from '../schemas';
import type { ToolExecutor, ToolLogger } from '../core/types';

export interface GetPageDependencies {
  notionClient: MinimalNotionClient;
  logger: ToolLogger;
  notionOperations: NotionOperations;
}

/**
 * Creates a get page executor
 * Handles Notion API interaction and formatting
 */
export function createGetPageExecutor(deps: GetPageDependencies): ToolExecutor {
  return {
    async execute(input: unknown): Promise<string> {
      // Validate input
      const validatedArgs = notionGetPageSchema.parse(input);

      deps.logger.debug('Getting page', { page_id: validatedArgs.page_id });

      // Get page
      const pageResponse = await deps.notionClient.pages.retrieve({
        page_id: validatedArgs.page_id,
      });

      // Ensure we have a full page response
      if (!isFullPage(pageResponse)) {
        throw new Error(
          'Invalid page response - missing required fields like url. The page may have restricted permissions.',
        );
      }

      const resource =
        deps.notionOperations.transformers.transformNotionPageToMcpResource(pageResponse);

      // Get content if requested
      let content: string | undefined;
      if (validatedArgs.include_content) {
        const blocksResponse = await deps.notionClient.blocks.children.list({
          block_id: validatedArgs.page_id,
          page_size: 100,
        });

        // Filter for full block responses
        const fullBlocks = blocksResponse.results.filter(isFullBlock);
        content = deps.notionOperations.transformers.extractTextFromNotionBlocks(fullBlocks);
      }

      // Format for output
      return deps.notionOperations.formatters.formatPageDetails(resource, pageResponse, content);
    },
  };
}

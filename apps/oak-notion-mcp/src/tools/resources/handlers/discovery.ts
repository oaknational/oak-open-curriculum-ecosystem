/**
 * @fileoverview Discovery resource handler for Notion workspace
 * @module @notion-mcp/resources/handlers
 */

import type { ReadResourceResult, Resource } from '@modelcontextprotocol/sdk/types.js';
import type {
  PageObjectResponse,
  DataSourceObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { isFullPage } from '@notionhq/client/build/src/helpers';
import type { NotionDependencies } from '../../../types/notion-types/dependencies';
import { scrubSensitiveData } from '../../../logging/scrubbing';

/**
 * Represents filtered search results.
 */
interface FilteredSearchResults {
  pages: PageObjectResponse[];
  dataSources: DataSourceObjectResponse[];
}

/**
 * Checks if a search result is a full DataSourceObjectResponse.
 *
 * Full data sources have `title` array; partial responses only have `id` and `object`.
 */
function isFullDataSource(
  result: PageObjectResponse | DataSourceObjectResponse | { object: string; id: string },
): result is DataSourceObjectResponse {
  return result.object === 'data_source' && 'title' in result;
}

/**
 * Handles the special discovery resource
 */
export async function handleDiscoveryResource(
  deps: NotionDependencies,
): Promise<ReadResourceResult> {
  const { notionClient, logger } = deps;

  try {
    logger.debug('Generating discovery resource');

    // Fetch available resources
    const [usersResponse, searchResponse] = await Promise.all([
      notionClient.users.list({}),
      notionClient.search({ query: '' }), // Empty query returns all
    ]);

    const users = usersResponse.results;

    // Filter search results into full pages and data sources
    const { pages, dataSources } = filterSearchResults(searchResponse);

    // Transform to MCP resources
    const userResources = users.map((user) =>
      deps.notionOperations.transformers.transformNotionUserToMcpResource(user),
    );
    const pageResources = pages.map((page) =>
      deps.notionOperations.transformers.transformNotionPageToMcpResource(page),
    );
    const dbResources = dataSources.map((ds) =>
      deps.notionOperations.transformers.transformNotionDatabaseToMcpResource(ds),
    );

    // Create discovery document
    const discovery = createDiscoveryDocument(userResources, pageResources, dbResources);

    // Format as readable text
    const text = formatDiscoveryText(discovery);

    return {
      contents: [
        {
          uri: 'notion://discovery',
          mimeType: 'application/json',
          text,
        },
      ],
    };
  } catch (error) {
    logger.error('Error generating discovery resource', { error });
    throw new Error('Failed to generate discovery resource');
  }
}

/**
 * Filter search results into full pages and data sources.
 *
 * SDK v5 search returns DataSourceObjectResponse (not DatabaseObjectResponse).
 */
function filterSearchResults(
  searchResponse: Awaited<ReturnType<NotionDependencies['notionClient']['search']>>,
): FilteredSearchResults {
  const pages: PageObjectResponse[] = [];
  const dataSources: DataSourceObjectResponse[] = [];

  for (const result of searchResponse.results) {
    if (isFullPage(result)) {
      pages.push(result);
    } else if (isFullDataSource(result)) {
      dataSources.push(result);
    }
    // Partial responses are ignored
  }

  return { pages, dataSources };
}

/**
 * Create discovery document structure
 */
function createDiscoveryDocument(
  userResources: Resource[],
  pageResources: Resource[],
  dbResources: Resource[],
): {
  workspace: {
    users: number;
    pages: number;
    databases: number;
  };
  resources: {
    users: Resource[];
    pages: Resource[];
    databases: Resource[];
  };
} {
  return {
    workspace: {
      users: userResources.length,
      pages: pageResources.length,
      databases: dbResources.length,
    },
    resources: {
      users: userResources,
      pages: pageResources,
      databases: dbResources,
    },
  };
}

/**
 * Format discovery document as readable text
 */
function formatDiscoveryText(discovery: {
  workspace: {
    users: number;
    pages: number;
    databases: number;
  };
  resources: unknown;
}): string {
  // Convert to string first, then scrub sensitive data
  const discoveryString = JSON.stringify(discovery, null, 2);
  const scrubbedDiscovery = scrubSensitiveData(discoveryString);

  return `# Notion Workspace Discovery

## Summary
- Users: ${String(discovery.workspace.users)}
- Pages: ${String(discovery.workspace.pages)}
- Databases: ${String(discovery.workspace.databases)}

## Resources
${JSON.stringify(scrubbedDiscovery, null, 2)}`;
}

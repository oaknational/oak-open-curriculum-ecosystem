/**
 * @fileoverview Discovery resource handler for Notion workspace
 * @module @notion-mcp/resources/handlers
 */

import type { ReadResourceResult, Resource } from '@modelcontextprotocol/sdk/types.js';
import type { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client';
import { isFullPage, isFullDatabase } from '@notionhq/client/build/src/helpers';
import type { NotionDependencies } from '../../../types/notion-types/dependencies';
// Transformers will be accessed through deps.notionOperations
import { scrubSensitiveData } from '../../../logging/scrubbing';

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
    // Filter only full pages and databases from search results
    const searchResults = filterFullResponses(searchResponse);

    // Transform to MCP resources
    const userResources = users.map((user) =>
      deps.notionOperations.transformers.transformNotionUserToMcpResource(user),
    );
    const pageAndDbResources = transformSearchResults(searchResults, deps);

    // Create discovery document
    const discovery = createDiscoveryDocument(userResources, pageAndDbResources);

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
 * Filter search results to only include full pages and databases
 */
function filterFullResponses(
  searchResponse: Awaited<ReturnType<NotionDependencies['notionClient']['search']>>,
): (PageObjectResponse | DatabaseObjectResponse)[] {
  const filtered: (PageObjectResponse | DatabaseObjectResponse)[] = [];

  // Process search results which can be pages, databases, or blocks
  for (const result of searchResponse.results) {
    // The SDK provides these type guards to check for full responses
    if (isFullPage(result)) {
      filtered.push(result);
    } else if (isFullDatabase(result)) {
      filtered.push(result);
    }
    // Partial responses and blocks are ignored
  }

  return filtered;
}

/**
 * Transform search results to MCP resources
 */
function transformSearchResults(
  results: (PageObjectResponse | DatabaseObjectResponse)[],
  deps: NotionDependencies,
): Resource[] {
  return results
    .map((item) => {
      // Use SDK's built-in type guards to check for full responses
      if (isFullPage(item)) {
        return deps.notionOperations.transformers.transformNotionPageToMcpResource(item);
      } else if (isFullDatabase(item)) {
        return deps.notionOperations.transformers.transformNotionDatabaseToMcpResource(item);
      }
      return null;
    })
    .filter((r): r is Resource => r !== null);
}

/**
 * Create discovery document structure
 */
function createDiscoveryDocument(
  userResources: Resource[],
  pageAndDbResources: Resource[],
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
  const pages = pageAndDbResources.filter((r) => r.uri.startsWith('notion://pages/'));
  const databases = pageAndDbResources.filter((r) => r.uri.startsWith('notion://databases/'));

  return {
    workspace: {
      users: userResources.length,
      pages: pages.length,
      databases: databases.length,
    },
    resources: {
      users: userResources,
      pages,
      databases,
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

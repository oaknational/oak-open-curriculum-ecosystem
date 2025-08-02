/**
 * MCP resource handlers for Notion integration
 */

import type {
  Resource,
  ListResourcesResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import type { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client';
import { isFullPage, isFullDatabase } from '@notionhq/client/build/src/helpers';
import type { CoreDependencies } from '../../types/dependencies.js';
import { parseResourceUri, validateResourceUri } from './uri-parser.js';
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
} from '../../notion/transformers.js';
import { scrubSensitiveData } from '../../utils/scrubbing.js';

// Handler functions interface
export interface ResourceHandlers {
  handleListResources(): Promise<ListResourcesResult>;
  handleReadResource(uri: string): Promise<ReadResourceResult>;
}

/**
 * Creates resource handlers with injected dependencies
 */
export function createResourceHandlers(deps: CoreDependencies): ResourceHandlers {
  const { notionClient, logger } = deps;

  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    async handleListResources(): Promise<ListResourcesResult> {
      logger.debug('Listing available resources');

      // For now, we return a static discovery resource
      // In the future, this could dynamically list workspace resources
      const resources: Resource[] = [
        {
          uri: 'notion://discovery',
          name: 'Notion Resource Discovery',
          description: 'Discover available Notion resources dynamically',
          mimeType: 'application/json',
        },
      ];

      return { resources };
    },

    async handleReadResource(uri: string): Promise<ReadResourceResult> {
      logger.debug('Reading resource', { uri });

      // Validate URI format
      const validation = validateResourceUri(uri);
      if (!validation.valid) {
        logger.error('Invalid resource URI', { uri });
        throw new Error(`Invalid resource URI: ${uri}`);
      }

      // Handle special discovery URI
      if (uri === 'notion://discovery') {
        return handleDiscoveryResource(deps);
      }

      // Parse resource identifier
      const resourceId = parseResourceUri(uri);
      if (!resourceId) {
        logger.error('Failed to parse resource URI', { uri });
        throw new Error(`Invalid resource URI: ${uri}`);
      }

      try {
        let content: unknown;

        switch (resourceId.type) {
          case 'pages': {
            const response = await notionClient.pages.retrieve({ page_id: resourceId.id });
            if (!isFullPage(response)) {
              throw new Error('Invalid page response');
            }
            content = response;
            break;
          }

          case 'databases': {
            const response = await notionClient.databases.retrieve({ database_id: resourceId.id });
            if (!isFullDatabase(response)) {
              throw new Error('Invalid database response');
            }
            content = response;
            break;
          }

          case 'users': {
            // For individual user, we'd need to list all and find by ID
            // For now, we'll throw an error
            throw new Error('Reading individual users is not yet supported');
          }

          default:
            // TypeScript thinks this is never, but keep for runtime safety
            throw new Error(`Unsupported resource type: ${String(resourceId.type)}`);
        }

        // Scrub sensitive data before returning
        const scrubbedContent = scrubSensitiveData(content);

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(scrubbedContent, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Error reading resource', { uri, error });
        throw new Error(`Failed to read resource: ${uri}`);
      }
    },
  };
}

/**
 * Handles the special discovery resource
 */
async function handleDiscoveryResource(deps: CoreDependencies): Promise<ReadResourceResult> {
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
    const searchResults: (PageObjectResponse | DatabaseObjectResponse)[] = [];
    for (const result of searchResponse.results) {
      // Search results can include pages, databases, blocks, and partial responses
      // We only want full pages and databases
      if (result.object === 'page' && isFullPage(result)) {
        searchResults.push(result);
      } else if (result.object === 'database' && isFullDatabase(result)) {
        searchResults.push(result);
      }
      // Blocks, partial responses, and other types are ignored
    }

    // Transform to MCP resources
    const userResources = users.map(transformNotionUserToMcpResource);
    const pageAndDbResources = searchResults
      .map((item) => {
        // Use SDK's built-in type guards to check for full responses
        // isFullPage checks for 'url' property (full pages have: url, properties, parent, created_time, etc.)
        // isFullDatabase checks for 'title' property (full DBs have: title, description, icon, cover, etc.)
        if (isFullPage(item)) {
          return transformNotionPageToMcpResource(item);
        } else if (isFullDatabase(item)) {
          return transformNotionDatabaseToMcpResource(item);
        }
        return null;
      })
      .filter((r): r is Resource => r !== null);

    // Create discovery document
    const discovery = {
      workspace: {
        users: userResources.length,
        pages: pageAndDbResources.filter((r) => r.uri.startsWith('notion://pages/')).length,
        databases: pageAndDbResources.filter((r) => r.uri.startsWith('notion://databases/')).length,
      },
      resources: {
        users: userResources,
        pages: pageAndDbResources.filter((r) => r.uri.startsWith('notion://pages/')),
        databases: pageAndDbResources.filter((r) => r.uri.startsWith('notion://databases/')),
      },
    };

    // Scrub sensitive data
    const scrubbedDiscovery = scrubSensitiveData(discovery);

    // Format as readable text
    const text = `# Notion Workspace Discovery

## Summary
- Users: ${String(discovery.workspace.users)}
- Pages: ${String(discovery.workspace.pages)}
- Databases: ${String(discovery.workspace.databases)}

## Resources
${(() => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const typed = scrubbedDiscovery as typeof discovery;
  return JSON.stringify(typed.resources, null, 2);
})()}`;

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

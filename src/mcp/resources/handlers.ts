/**
 * MCP resource handlers for Notion integration
 */

import type {
  Resource,
  ListResourcesResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import type { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client';
import type { CoreDependencies } from '../../types/dependencies.js';
import { isFullPage, isFullDatabase } from '../../notion/type-guards.js';
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
            throw new Error(`Unsupported resource type: ${resourceId.type}`);
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
    const searchResults = searchResponse.results.filter(
      (result): result is PageObjectResponse | DatabaseObjectResponse =>
        (result.object === 'page' || result.object === 'database') && 'id' in result,
    );

    // Transform to MCP resources
    const userResources = users.map(transformNotionUserToMcpResource);
    const pageAndDbResources = searchResults
      .map((item) => {
        if (item.object === 'page' && 'properties' in item) {
          return transformNotionPageToMcpResource(item);
        } else if (item.object === 'database' && 'title' in item) {
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
- Users: ${discovery.workspace.users}
- Pages: ${discovery.workspace.pages}
- Databases: ${discovery.workspace.databases}

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

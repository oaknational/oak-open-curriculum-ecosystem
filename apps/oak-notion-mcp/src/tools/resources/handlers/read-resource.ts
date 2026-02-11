/**
 * Read resource handler for Notion resources
 */

import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { isFullPage } from '@notionhq/client/build/src/helpers';
import type { NotionDependencies } from '../../../types/notion-types/dependencies';
import { parseResourceUri, validateResourceUri, type ResourceIdentifier } from '../uri-parser';
import { handleDiscoveryResource } from './discovery';

/**
 * Fetch resource content by type
 */
async function fetchResourceContent(
  resourceId: ResourceIdentifier,
  deps: NotionDependencies,
): Promise<unknown> {
  const { notionClient } = deps;

  switch (resourceId.type) {
    case 'pages': {
      const response = await notionClient.pages.retrieve({ page_id: resourceId.id });
      if (!isFullPage(response)) {
        throw new Error('Invalid page response');
      }
      return response;
    }

    case 'databases': {
      const response = await notionClient.dataSources.retrieve({ data_source_id: resourceId.id });
      return response;
    }

    case 'users': {
      // The Notion API doesn't support retrieving individual users
      // This is a limitation of the API, not our implementation
      throw new Error(
        'Reading individual user resources is not supported by the Notion API. ' +
          'Users can only be listed in bulk.',
      );
    }

    default: {
      // TypeScript exhaustiveness check
      const never: never = resourceId.type;
      throw new Error(`Unsupported resource type: ${String(never)}`);
    }
  }
}

/**
 * Handle reading a resource by URI
 */
export async function handleReadResource(
  uri: string,
  deps: NotionDependencies,
): Promise<ReadResourceResult> {
  const { logger } = deps;
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
    const content = await fetchResourceContent(resourceId, deps);

    // Return JSON content
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(content, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error('Error reading resource', {
      uri,
      error,
    });
    throw new Error(`Failed to read resource: ${uri}`);
  }
}

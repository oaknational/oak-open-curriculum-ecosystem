import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client';
import type { CoreDependencies } from '../../types/dependencies.js';
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
  extractTextFromNotionBlocks,
} from '../../notion/transformers.js';
import { isFullDatabase, isFullPage } from '../../notion/type-guards.js';
import {
  formatSearchResults,
  formatDatabaseList,
  formatDatabaseQueryResults,
  formatPageDetails,
  formatUserList,
} from '../../notion/formatters.js';
import type { McpTool, McpToolResult } from '../types.js';
import {
  notionSearchSchema,
  notionListDatabasesSchema,
  notionQueryDatabaseSchema,
  notionGetPageSchema,
  notionListUsersSchema,
} from './schemas.js';

// Use CoreDependencies for consistency
type ToolDependencies = CoreDependencies;

export function createNotionSearchTool(deps: ToolDependencies): McpTool {
  return {
    name: 'notion-search',
    description: 'Search for pages and databases in Notion',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
        filter: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['page', 'database'],
              description: 'Filter results by type',
            },
          },
        },
        sort: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              enum: ['last_edited_time'],
              description: 'Sort by timestamp',
            },
            direction: {
              type: 'string',
              enum: ['ascending', 'descending'],
              description: 'Sort direction',
            },
          },
        },
      },
      required: ['query'],
    },
    async handler(args: unknown): Promise<McpToolResult> {
      // Validate input using Zod schema
      const validatedArgs = notionSearchSchema.parse(args);
      try {
        deps.logger.debug('Searching Notion', { query: validatedArgs.query });

        const searchParams: Parameters<typeof deps.notionClient.search>[0] = {
          query: validatedArgs.query,
        };

        if (validatedArgs.filter?.type) {
          searchParams.filter = { property: 'object', value: validatedArgs.filter.type };
        }

        if (validatedArgs.sort) {
          searchParams.sort = {
            timestamp: validatedArgs.sort.timestamp,
            direction: validatedArgs.sort.direction,
          };
        }

        const searchResponse = await deps.notionClient.search(searchParams);
        const results = searchResponse.results.filter(
          (result): result is PageObjectResponse | DatabaseObjectResponse =>
            (result.object === 'page' || result.object === 'database') && 'id' in result,
        );

        const resources = results.map((result) => {
          if (result.object === 'page') {
            return transformNotionPageToMcpResource(result);
          } else {
            return transformNotionDatabaseToMcpResource(result);
          }
        });

        const text = formatSearchResults(results, validatedArgs.query, resources);

        return {
          content: [{ type: 'text', text }],
        };
      } catch (error) {
        deps.logger.error('Search failed', { error });
        return {
          content: [{ type: 'text', text: `Error searching Notion: ${error}` }],
          isError: true,
        };
      }
    },
  };
}

export function createNotionListDatabasesTool(deps: ToolDependencies): McpTool {
  return {
    name: 'notion-list-databases',
    description: 'List all databases in the Notion workspace',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    async handler(args: unknown): Promise<McpToolResult> {
      // Validate input using Zod schema
      notionListDatabasesSchema.parse(args);
      try {
        deps.logger.debug('Listing Notion databases');

        const searchResponse = await deps.notionClient.search({
          query: '',
          filter: { property: 'object', value: 'database' },
        });
        const results = searchResponse.results.filter(
          (result): result is DatabaseObjectResponse =>
            result.object === 'database' && 'title' in result,
        );

        const resources = results.map(transformNotionDatabaseToMcpResource);
        const text = formatDatabaseList(results, resources);

        return {
          content: [{ type: 'text', text }],
        };
      } catch (error) {
        deps.logger.error('List databases failed', { error });
        return {
          content: [{ type: 'text', text: `Error listing databases: ${error}` }],
          isError: true,
        };
      }
    },
  };
}

export function createNotionQueryDatabaseTool(deps: ToolDependencies): McpTool {
  return {
    name: 'notion-query-database',
    description: 'Query a Notion database with filters and sorts',
    inputSchema: {
      type: 'object',
      properties: {
        database_id: {
          type: 'string',
          description: 'The ID of the database to query',
        },
        filter: {
          type: 'object',
          description: 'Filter conditions (Notion filter format)',
        },
        sorts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property: { type: 'string' },
              direction: {
                type: 'string',
                enum: ['ascending', 'descending'],
              },
            },
          },
          description: 'Sort criteria',
        },
        page_size: {
          type: 'number',
          minimum: 1,
          maximum: 100,
          default: 20,
          description: 'Number of results to return',
        },
      },
      required: ['database_id'],
    },
    async handler(args: unknown): Promise<McpToolResult> {
      // Validate input using Zod schema
      const validatedArgs = notionQueryDatabaseSchema.parse(args);
      try {
        deps.logger.debug('Querying database', { database_id: validatedArgs.database_id });

        // Get database info first
        const dbResponse = await deps.notionClient.databases.retrieve({
          database_id: validatedArgs.database_id,
        });
        if (!isFullDatabase(dbResponse)) {
          throw new Error('Invalid database response');
        }
        const dbResource = transformNotionDatabaseToMcpResource(dbResponse);

        // Build the query
        const queryParams: Parameters<typeof deps.notionClient.databases.query>[0] = {
          database_id: validatedArgs.database_id,
          page_size: validatedArgs.page_size || 20,
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

        const queryResponse = await deps.notionClient.databases.query(queryParams);
        const pages = queryResponse.results.filter(
          (result): result is PageObjectResponse =>
            result.object === 'page' && 'properties' in result,
        );

        const pageResources = pages.map(transformNotionPageToMcpResource);
        const text = formatDatabaseQueryResults(dbResource, pages, pageResources);

        return {
          content: [{ type: 'text', text }],
        };
      } catch (error) {
        deps.logger.error('Query database failed', { error });
        return {
          content: [{ type: 'text', text: `Error querying database: ${error}` }],
          isError: true,
        };
      }
    },
  };
}

export function createNotionGetPageTool(deps: ToolDependencies): McpTool {
  return {
    name: 'notion-get-page',
    description: 'Get a specific Notion page by ID',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: {
          type: 'string',
          description: 'The ID of the page to retrieve',
        },
        include_content: {
          type: 'boolean',
          description: 'Include page content (blocks)',
          default: false,
        },
      },
      required: ['page_id'],
    },
    async handler(args: unknown): Promise<McpToolResult> {
      // Validate input using Zod schema
      const validatedArgs = notionGetPageSchema.parse(args);
      try {
        deps.logger.debug('Getting page', { page_id: validatedArgs.page_id });

        const pageResponse = await deps.notionClient.pages.retrieve({
          page_id: validatedArgs.page_id,
        });
        if (!isFullPage(pageResponse)) {
          throw new Error('Invalid page response');
        }
        const resource = transformNotionPageToMcpResource(pageResponse);

        let content: string | undefined;
        if (validatedArgs.include_content) {
          const blocksResponse = await deps.notionClient.blocks.children.list({
            block_id: validatedArgs.page_id,
            page_size: 100,
          });
          const blocks = blocksResponse.results.filter(
            (result): result is BlockObjectResponse => result.object === 'block',
          );
          content = extractTextFromNotionBlocks(blocks);
        }

        const text = formatPageDetails(resource, pageResponse, content);

        return {
          content: [{ type: 'text', text }],
        };
      } catch (error) {
        deps.logger.error('Get page failed', { error });
        return {
          content: [{ type: 'text', text: `Error getting page: ${error}` }],
          isError: true,
        };
      }
    },
  };
}

export function createNotionListUsersTool(deps: ToolDependencies): McpTool {
  return {
    name: 'notion-list-users',
    description: 'List all users in the Notion workspace',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    async handler(args: unknown): Promise<McpToolResult> {
      // Validate input using Zod schema
      notionListUsersSchema.parse(args);
      try {
        deps.logger.debug('Listing Notion users');

        const usersResponse = await deps.notionClient.users.list({});
        const users = usersResponse.results;

        const resources = users.map(transformNotionUserToMcpResource);
        const text = formatUserList(users, resources);

        return {
          content: [{ type: 'text', text }],
        };
      } catch (error) {
        deps.logger.error('List users failed', { error });
        return {
          content: [{ type: 'text', text: `Error listing users: ${error}` }],
          isError: true,
        };
      }
    },
  };
}

interface ToolHandlers extends Record<string, McpTool | (() => McpTool[])> {
  'notion-search': McpTool;
  'notion-list-databases': McpTool;
  'notion-query-database': McpTool;
  'notion-get-page': McpTool;
  'notion-list-users': McpTool;
  getTools: () => McpTool[];
}

export function createToolHandlers(deps: ToolDependencies): ToolHandlers {
  const notionSearch = createNotionSearchTool(deps);
  const notionListDatabases = createNotionListDatabasesTool(deps);
  const notionQueryDatabase = createNotionQueryDatabaseTool(deps);
  const notionGetPage = createNotionGetPageTool(deps);
  const notionListUsers = createNotionListUsersTool(deps);

  const tools: McpTool[] = [
    notionSearch,
    notionListDatabases,
    notionQueryDatabase,
    notionGetPage,
    notionListUsers,
  ];

  return {
    'notion-search': notionSearch,
    'notion-list-databases': notionListDatabases,
    'notion-query-database': notionQueryDatabase,
    'notion-get-page': notionGetPage,
    'notion-list-users': notionListUsers,
    getTools: () => tools,
  };
}

import type { Logger } from '../../logging/logger.js';
import type {
  NotionClientWrapper,
  NotionSearchQuery,
  NotionDatabaseQuery,
} from '../../notion/client.js';
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
  extractTextFromNotionBlocks,
  formatNotionRichText,
} from '../../notion/transformers.js';
import type { McpTool, McpToolResult } from '../types.js';

interface ToolDependencies {
  notionClient: NotionClientWrapper;
  logger: Logger;
}

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
    async handler(args: {
      query: string;
      filter?: { type: 'page' | 'database' };
      sort?: {
        timestamp: 'last_edited_time';
        direction: 'ascending' | 'descending';
      };
    }): Promise<McpToolResult> {
      try {
        deps.logger.debug('Searching Notion', { query: args.query });

        const searchParams: NotionSearchQuery = {
          query: args.query,
        };

        if (args.filter?.type) {
          searchParams.filter = { property: 'object', value: args.filter.type };
        }

        if (args.sort) {
          searchParams.sort = {
            timestamp: args.sort.timestamp,
            direction: args.sort.direction,
          };
        }

        const results = await deps.notionClient.search(searchParams);

        if (!results || !results.results) {
          throw new Error('Invalid search results');
        }

        let text = `Found ${results.results.length} results for "${args.query}"\n\n`;

        for (const result of results.results) {
          if (result.object === 'page') {
            const resource = transformNotionPageToMcpResource(result);
            text += `📄 Page: ${resource.name}\n`;
            text += `   URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
            text += `   Last edited: ${resource.metadata?.['last_edited_time'] || 'N/A'}\n\n`;
          } else if (result.object === 'database') {
            const resource = transformNotionDatabaseToMcpResource(result);
            text += `🗂️ Database: ${resource.name}\n`;
            text += `   URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
            const props = resource.metadata?.['properties'];
            text += `   Properties: ${Array.isArray(props) ? props.join(', ') : 'None'}\n\n`;
          }
        }

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
    async handler(_args: Record<string, never>): Promise<McpToolResult> {
      try {
        deps.logger.debug('Listing Notion databases');

        const searchQuery: NotionSearchQuery = {
          query: '',
          filter: { property: 'object', value: 'database' },
        };
        const results = await deps.notionClient.search(searchQuery);

        if (!results || !results.results) {
          throw new Error('Invalid search results');
        }

        let text = `Found ${results.results.length} database${
          results.results.length === 1 ? '' : 's'
        }\n\n`;

        for (const database of results.results) {
          if (database.object === 'database') {
            const resource = transformNotionDatabaseToMcpResource(database);
            text += `🗂️ ${resource.name}\n`;
            text += `   ID: ${database.id}\n`;
            text += `   URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
            const props = resource.metadata?.['properties'];
            text += `   Properties: ${Array.isArray(props) ? props.join(', ') : 'None'}\n\n`;
          }
        }

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
    async handler(args: {
      database_id: string;
      filter?: Record<string, unknown>;
      sorts?: { property: string; direction: 'ascending' | 'descending' }[];
      page_size?: number;
    }): Promise<McpToolResult> {
      try {
        deps.logger.debug('Querying database', { database_id: args.database_id });

        // Get database info first
        const database = await deps.notionClient.getDatabase(args.database_id);
        const dbResource = transformNotionDatabaseToMcpResource(database);

        // Build the query - note that filter is not supported due to Notion SDK type limitations
        const query: NotionDatabaseQuery = {};
        // TODO: Add filter support when Notion SDK exports filter types
        // For now, we can only support sorts and pagination
        if (args.sorts) {
          query.sorts = args.sorts;
        }
        query.page_size = args.page_size || 20;

        const pages = await deps.notionClient.queryDatabase(args.database_id, query);

        let text = `Database: ${dbResource.name}\n`;
        text += `Found ${pages.length} page${pages.length === 1 ? '' : 's'}\n\n`;

        for (const page of pages) {
          const resource = transformNotionPageToMcpResource(page);
          text += `📄 ${resource.name}\n`;

          // Show key properties
          for (const [key, value] of Object.entries(page.properties)) {
            if (typeof value === 'object' && value !== null && 'type' in value) {
              let displayValue = 'N/A';

              switch (value.type) {
                case 'select':
                  if ('select' in value && value.select) {
                    displayValue = value.select.name || 'N/A';
                  }
                  break;
                case 'multi_select':
                  if ('multi_select' in value && value.multi_select) {
                    displayValue = value.multi_select.map((s) => s.name).join(', ') || 'N/A';
                  }
                  break;
                case 'status':
                  if ('status' in value && value.status) {
                    displayValue = value.status.name || 'N/A';
                  }
                  break;
                case 'number':
                  if ('number' in value && value.number !== null) {
                    displayValue = value.number.toString();
                  }
                  break;
                case 'checkbox':
                  if ('checkbox' in value) {
                    displayValue = value.checkbox ? '✓' : '✗';
                  }
                  break;
                case 'date':
                  if ('date' in value && value.date) {
                    displayValue = value.date.start || 'N/A';
                  }
                  break;
                case 'people':
                  if ('people' in value && value.people) {
                    displayValue =
                      value.people.map((p) => ('name' in p && p.name) || 'Unknown').join(', ') ||
                      'N/A';
                  }
                  break;
                case 'rich_text':
                  if ('rich_text' in value && value.rich_text) {
                    displayValue = formatNotionRichText(value.rich_text) || 'N/A';
                  }
                  break;
              }

              if (displayValue !== 'N/A' && key !== 'title' && key !== 'Name') {
                text += `   ${key}: ${displayValue}\n`;
              }
            }
          }
          text += '\n';
        }

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
    async handler(args: { page_id: string; include_content?: boolean }): Promise<McpToolResult> {
      try {
        deps.logger.debug('Getting page', { page_id: args.page_id });

        const page = await deps.notionClient.getPage(args.page_id);
        const resource = transformNotionPageToMcpResource(page);

        let text = `📄 ${resource.name}\n\n`;
        text += `URL: ${resource.metadata?.['url'] || 'N/A'}\n`;
        text += `Created: ${resource.metadata?.['created_time'] || 'N/A'}\n`;
        text += `Last edited: ${resource.metadata?.['last_edited_time'] || 'N/A'}\n`;
        text += `Archived: ${resource.metadata?.['archived'] ? 'Yes' : 'No'}\n\n`;

        // Show properties
        text += 'Properties:\n';
        for (const [key, value] of Object.entries(page.properties)) {
          if (typeof value === 'object' && value !== null && 'type' in value) {
            let displayValue = 'N/A';

            switch (value.type) {
              case 'title':
                continue; // Skip title as it's already shown
              case 'select':
                if ('select' in value && value.select) {
                  displayValue = value.select.name || 'N/A';
                }
                break;
              case 'multi_select':
                if ('multi_select' in value && value.multi_select) {
                  displayValue = value.multi_select.map((s) => s.name).join(', ') || 'N/A';
                }
                break;
              case 'rich_text':
                if ('rich_text' in value && value.rich_text) {
                  displayValue = formatNotionRichText(value.rich_text) || 'N/A';
                }
                break;
              default:
                continue;
            }

            text += `- ${key}: ${displayValue}\n`;
          }
        }

        if (args.include_content) {
          text += '\nContent:\n';
          const blocks = await deps.notionClient.getBlockChildren(args.page_id);
          const content = extractTextFromNotionBlocks(blocks);
          text += content || 'No content';
        }

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
    async handler(_args: Record<string, never>): Promise<McpToolResult> {
      try {
        deps.logger.debug('Listing Notion users');

        const users = await deps.notionClient.listUsers();

        let text = `Found ${users.length} user${users.length === 1 ? '' : 's'}\n\n`;

        for (const user of users) {
          const resource = transformNotionUserToMcpResource(user);
          const emoji = user.type === 'bot' ? '🤖' : '👤';
          text += `${emoji} ${resource.name}\n`;
          text += `   Type: ${user.type === 'bot' ? 'Bot' : 'Person'}\n`;

          if (user.type === 'person' && resource.metadata?.['email']) {
            text += `   Email: ${resource.metadata['email']}\n`;
          }

          text += '\n';
        }

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

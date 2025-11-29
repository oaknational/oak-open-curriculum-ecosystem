import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import { createMockRuntime } from '../../test/mocks';
import type { MinimalNotionClient } from '../../types/notion-types/notion-client';
import { createMockPage } from '../../test/mocks/notion-mocks';
import {
  createNotionSearchTool,
  createNotionListDatabasesTool,
  createNotionQueryDatabaseTool,
  createNotionGetPageTool,
  createNotionListUsersTool,
  createToolHandlers,
} from './handlers';

// Helper to create a mock Notion client with all required methods
function createMockNotionClient(): MinimalNotionClient {
  return {
    search: vi.fn(),
    pages: { retrieve: vi.fn() },
    databases: { retrieve: vi.fn(), query: vi.fn() },
    users: { list: vi.fn() },
    blocks: { children: { list: vi.fn() } },
  };
}

// Simple helper to create mock operations inline
function createMockOperations() {
  return {
    transformers: {
      transformNotionPageToMcpResource: vi.fn(),
      transformNotionDatabaseToMcpResource: vi.fn(),
      transformNotionUserToMcpResource: vi.fn(),
      extractTextFromNotionBlocks: vi.fn(),
    },
    formatters: {
      formatSearchResults: vi.fn().mockReturnValue('Found 2 results\nTest Page\nTest Database'),
      formatDatabaseList: vi.fn().mockReturnValue('Found 1 database\nProjects\nStatus, Priority'),
      formatUserList: vi
        .fn()
        .mockReturnValue('Found 2 users\nJohn Doe\njoh...@example.com\nTest Bot\nBot'),
      formatDatabaseQueryResults: vi
        .fn()
        .mockReturnValue('Database: Tasks\nTask 1\nStatus: In Progress'),
      formatPageDetails: vi.fn().mockReturnValue('My Page\nPage content'),
    },
  };
}

describe('Tool Handlers', () => {
  const mockLogger: Logger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn().mockReturnThis(),
    isLevelEnabled: vi.fn().mockReturnValue(true),
  };

  describe('createNotionSearchTool', () => {
    it('should create a search tool with correct metadata', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionSearchTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });

      expect(tool.name).toBe('notion-search');
      expect(tool.description).toContain('Search');
      expect(tool.inputSchema).toEqual({
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
      });
    });

    it('should handle successful search with pages and databases', async () => {
      const mockSearchResults = {
        results: [
          {
            object: 'page' as const,
            id: 'page-123',
            created_time: '2024-01-01T00:00:00Z',
            last_edited_time: '2024-01-02T00:00:00Z',
            archived: false,
            url: 'https://notion.so/page-123',
            properties: {
              title: {
                type: 'title' as const,
                title: [
                  {
                    type: 'text' as const,
                    text: { content: 'Test Page' },
                    plain_text: 'Test Page',
                  },
                ],
              },
            },
          },
          {
            object: 'database' as const,
            id: 'db-456',
            created_time: '2024-01-01T00:00:00Z',
            last_edited_time: '2024-01-02T00:00:00Z',
            archived: false,
            url: 'https://notion.so/db-456',
            title: [
              {
                type: 'text' as const,
                text: { content: 'Test Database' },
                plain_text: 'Test Database',
              },
            ],
            description: [],
            properties: {},
          },
        ],
        has_more: false,
        next_cursor: null,
      };

      const mockClient = {
        search: vi.fn().mockResolvedValue(mockSearchResults),
        pages: { retrieve: vi.fn() },
        databases: { retrieve: vi.fn(), query: vi.fn() },
        users: { list: vi.fn() },
        blocks: { children: { list: vi.fn() } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionSearchTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const result = await tool.handler({ query: 'test' });

      expect(mockClient.search).toHaveBeenCalledWith({
        query: 'test',
        filter: undefined,
        sort: undefined,
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
      const firstContent = result.content[0];
      // Narrow to text response type
      if (!('text' in firstContent)) {
        throw new TypeError('Test: Expected text content, got blob');
      }
      expect(firstContent.text).toContain('Found 2 results');
      expect(firstContent.text).toContain('Test Page');
      expect(firstContent.text).toContain('Test Database');
    });

    it('should apply type filter when provided', async () => {
      const mockClient = {
        search: vi.fn().mockResolvedValue({ results: [], has_more: false }),
        pages: { retrieve: vi.fn() },
        databases: { retrieve: vi.fn(), query: vi.fn() },
        users: { list: vi.fn() },
        blocks: { children: { list: vi.fn() } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionSearchTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      await tool.handler({ query: 'test', filter: { type: 'page' } });

      expect(mockClient.search).toHaveBeenCalledWith({
        query: 'test',
        filter: { property: 'object', value: 'page' },
        sort: undefined,
      });
    });

    it('should handle search errors gracefully', async () => {
      const mockClient = {
        search: vi.fn().mockRejectedValue(new Error('Search failed')),
        pages: { retrieve: vi.fn() },
        databases: { retrieve: vi.fn(), query: vi.fn() },
        users: { list: vi.fn() },
        blocks: { children: { list: vi.fn() } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionSearchTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const result = await tool.handler({ query: 'test' });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
      if (result.content[0] && 'text' in result.content[0]) {
        expect(result.content[0].text).toContain('Error in notion-search: Search failed');
      }
      expect(result.isError).toBe(true);
    });
  });

  describe('createNotionListDatabasesTool', () => {
    it('should create a list databases tool with correct metadata', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionListDatabasesTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });

      expect(tool.name).toBe('notion-list-databases');
      expect(tool.description).toContain('List all databases');
      expect(tool.inputSchema).toEqual({
        type: 'object',
        properties: {},
      });
    });

    it('should list databases successfully', async () => {
      const mockDatabases = {
        results: [
          {
            object: 'database' as const,
            id: 'db-1',
            created_time: '2024-01-01T00:00:00Z',
            last_edited_time: '2024-01-02T00:00:00Z',
            archived: false,
            url: 'https://notion.so/db-1',
            title: [
              { type: 'text' as const, text: { content: 'Projects' }, plain_text: 'Projects' },
            ],
            description: [],
            properties: {
              Status: { type: 'select' as const, select: { options: [] } },
              Priority: { type: 'select' as const, select: { options: [] } },
            },
          },
        ],
        has_more: false,
        next_cursor: null,
      };

      const mockClient = {
        search: vi.fn().mockResolvedValue(mockDatabases),
        pages: { retrieve: vi.fn() },
        databases: { retrieve: vi.fn(), query: vi.fn() },
        users: { list: vi.fn() },
        blocks: { children: { list: vi.fn() } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionListDatabasesTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const result = await tool.handler({});

      expect(mockClient.search).toHaveBeenCalledWith({
        query: '',
        filter: { property: 'object', value: 'database' },
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');

      if (result.content[0] && 'text' in result.content[0]) {
        const resultText = result.content[0].text;
        expect(resultText).toContain('Found 1 database');
        expect(resultText).toContain('Projects');
        expect(resultText).toContain('Status, Priority');
      }
    });
  });

  describe('createNotionQueryDatabaseTool', () => {
    it('should create a query database tool with correct metadata', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionQueryDatabaseTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });

      expect(tool.name).toBe('notion-query-database');
      expect(tool.description).toContain('Query a Notion database');
      expect(tool.inputSchema).toEqual({
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
      });
    });

    it('should query database successfully', async () => {
      const mockPages = [
        {
          object: 'page' as const,
          id: 'page-1',
          created_time: '2024-01-01T00:00:00Z',
          last_edited_time: '2024-01-02T00:00:00Z',
          archived: false,
          url: 'https://notion.so/page-1',
          properties: {
            Name: {
              type: 'title' as const,
              title: [{ type: 'text' as const, text: { content: 'Task 1' }, plain_text: 'Task 1' }],
            },
            Status: {
              type: 'select' as const,
              select: { name: 'In Progress' },
            },
          },
        },
      ];

      const mockClient = {
        search: vi.fn(),
        pages: { retrieve: vi.fn() },
        databases: {
          retrieve: vi.fn().mockResolvedValue({
            object: 'database' as const,
            id: 'db-123',
            title: [{ type: 'text' as const, text: { content: 'Tasks' }, plain_text: 'Tasks' }],
            description: [],
            properties: {},
            parent: { type: 'workspace' as const, workspace: true },
            created_time: '2024-01-01T00:00:00Z',
            last_edited_time: '2024-01-02T00:00:00Z',
            created_by: { object: 'user' as const, id: 'user-123' },
            last_edited_by: { object: 'user' as const, id: 'user-123' },
            url: 'https://notion.so/db-123',
            archived: false,
            is_inline: false,
            public_url: null,
            icon: null,
            cover: null,
            in_trash: false,
          }),
          query: vi.fn().mockResolvedValue({ results: mockPages }),
        },
        users: { list: vi.fn() },
        blocks: { children: { list: vi.fn() } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionQueryDatabaseTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const result = await tool.handler({ database_id: 'db-123' });

      expect(mockClient.databases.query).toHaveBeenCalledWith({
        database_id: 'db-123',
        page_size: 20,
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');

      if (result.content[0] && 'text' in result.content[0]) {
        const resultText = result.content[0].text;
        expect(resultText).toContain('Database: Tasks');
        expect(resultText).toContain('Task 1');
        expect(resultText).toContain('Status: In Progress');
      }
    });
  });

  describe('createNotionGetPageTool', () => {
    it('should create a get page tool with correct metadata', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionGetPageTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });

      expect(tool.name).toBe('notion-get-page');
      expect(tool.description).toContain('Get a specific Notion page');
      expect(tool.inputSchema).toEqual({
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
      });
    });

    it('should get page with content when requested', async () => {
      const mockPage = createMockPage({
        id: 'page-123',
        url: 'https://notion.so/page-123',
        properties: {
          title: {
            type: 'title' as const,
            title: [
              {
                type: 'text' as const,
                text: { content: 'My Page', link: null },
                plain_text: 'My Page',
                href: null,
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default' as const,
                },
              },
            ],
            id: 'title',
          },
        },
      });

      const mockBlocks = [
        {
          object: 'block' as const,
          id: 'block-1',
          type: 'paragraph' as const,
          paragraph: {
            rich_text: [
              {
                type: 'text' as const,
                text: { content: 'Page content', link: null },
                plain_text: 'Page content',
                href: null,
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default' as const,
                },
              },
            ],
          },
        },
      ];

      const mockClient = {
        search: vi.fn(),
        pages: { retrieve: vi.fn().mockResolvedValue(mockPage) },
        databases: { retrieve: vi.fn(), query: vi.fn() },
        users: { list: vi.fn() },
        blocks: { children: { list: vi.fn().mockResolvedValue({ results: mockBlocks }) } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionGetPageTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const result = await tool.handler({ page_id: 'page-123', include_content: true });

      expect(mockClient.pages.retrieve).toHaveBeenCalledWith({ page_id: 'page-123' });
      expect(mockClient.blocks.children.list).toHaveBeenCalledWith({
        block_id: 'page-123',
        page_size: 100,
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');

      if (result.content[0] && 'text' in result.content[0]) {
        const resultText = result.content[0].text;
        expect(resultText).toContain('My Page');
        expect(resultText).toContain('Page content');
      }
    });
  });

  describe('createNotionListUsersTool', () => {
    it('should create a list users tool with correct metadata', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionListUsersTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });

      expect(tool.name).toBe('notion-list-users');
      expect(tool.description).toContain('List all users');
      expect(tool.inputSchema).toEqual({
        type: 'object',
        properties: {},
      });
    });

    it('should list users successfully', async () => {
      const mockUsers = [
        {
          object: 'user' as const,
          id: 'user-1',
          type: 'person' as const,
          name: 'John Doe',
          avatar_url: 'https://example.com/avatar.jpg',
          person: { email: 'joh...@example.com' },
        },
        {
          object: 'user' as const,
          id: 'user-2',
          type: 'bot' as const,
          name: 'Test Bot',
          avatar_url: null,
          bot: {},
        },
      ];

      const mockClient = {
        search: vi.fn(),
        pages: { retrieve: vi.fn() },
        databases: { retrieve: vi.fn(), query: vi.fn() },
        users: { list: vi.fn().mockResolvedValue({ results: mockUsers }) },
        blocks: { children: { list: vi.fn() } },
      };

      const runtime = createMockRuntime(mockLogger);
      const tool = createNotionListUsersTool({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const result = await tool.handler({});

      expect(mockClient.users.list).toHaveBeenCalled();

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');

      if (result.content[0] && 'text' in result.content[0]) {
        const resultText = result.content[0].text;
        expect(resultText).toContain('Found 2 users');
        expect(resultText).toContain('John Doe');
        expect(resultText).toContain('joh...@example.com');
        expect(resultText).toContain('Test Bot');
        expect(resultText).toContain('Bot');
      }
    });
  });

  describe('createToolHandlers', () => {
    it('should return all tool handlers', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const handlers = createToolHandlers({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });

      expect(handlers).toHaveProperty('notion-search');
      expect(handlers).toHaveProperty('notion-list-databases');
      expect(handlers).toHaveProperty('notion-query-database');
      expect(handlers).toHaveProperty('notion-get-page');
      expect(handlers).toHaveProperty('notion-list-users');

      expect(Object.keys(handlers)).toHaveLength(6); // 5 tools + getTools method
    });

    it('should return tools array from getTools method', () => {
      const mockClient = createMockNotionClient();

      const runtime = createMockRuntime(mockLogger);
      const { getTools } = createToolHandlers({
        notionClient: mockClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
        runtime,
      });
      const tools = getTools();

      expect(tools).toHaveLength(5);
      // Tools are returned sorted alphabetically by name
      expect(tools.map((t) => t.name)).toEqual([
        'notion-get-page',
        'notion-list-databases',
        'notion-list-users',
        'notion-query-database',
        'notion-search',
      ]);
    });
  });
});

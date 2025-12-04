import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import { createMockRuntime } from '../../test/mocks';
import type { MinimalNotionClient } from '../../types/notion-types/notion-client';

import { createNotionListDatabasesTool, createNotionQueryDatabaseTool } from './handlers';

// Helper to create a mock Notion client with all required methods
function createMockNotionClient(): MinimalNotionClient {
  return {
    search: vi.fn(),
    pages: { retrieve: vi.fn() },
    dataSources: { retrieve: vi.fn(), query: vi.fn() },
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
        databases: { retrieve: vi.fn() },
        dataSources: { retrieve: vi.fn(), query: vi.fn() },
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
        filter: { property: 'object', value: 'data_source' },
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
        },
        dataSources: {
          retrieve: vi.fn().mockResolvedValue({
            object: 'data_source',
            id: 'db-123',
            title: [{ type: 'text', text: { content: 'Tasks' }, plain_text: 'Tasks' }],
            description: [],
            properties: {},
            parent: { type: 'workspace', workspace: true },
            created_time: '2024-01-01T00:00:00Z',
            last_edited_time: '2024-01-02T00:00:00Z',
            created_by: { object: 'user', id: 'user-123' },
            last_edited_by: { object: 'user', id: 'user-123' },
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

      expect(mockClient.dataSources.query).toHaveBeenCalledWith({
        data_source_id: 'db-123',
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
});

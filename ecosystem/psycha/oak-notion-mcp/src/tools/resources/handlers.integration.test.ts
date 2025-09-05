import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createResourceHandlers } from './handlers/index.js';
import type { MinimalNotionClient } from '../../types/notion-types/notion-client.js';
import type { Logger } from '@oaknational/mcp-moria';
import {
  createMockPage,
  createMockDatabase,
  createMockPersonUser,
} from '../../test/mocks/notion-mocks.js';
import {
  createMockListUsersResponse,
  createMockSearchResponse,
} from '../../test/mocks/notion-api-mocks.js';

// Simple helper to create mock operations inline
function createMockOperations() {
  return {
    transformers: {
      transformNotionPageToMcpResource: vi.fn().mockReturnValue({
        name: 'Test Page',
        uri: 'notion://page/test-id',
        mimeType: 'text/plain',
        _meta: { last_edited_time: '2024-01-01' },
      }),
      transformNotionDatabaseToMcpResource: vi.fn().mockReturnValue({
        name: 'Test Database',
        uri: 'notion://database/test-db-id',
        mimeType: 'text/plain',
        _meta: { properties: [] },
      }),
      transformNotionUserToMcpResource: vi.fn().mockReturnValue({
        name: 'Test User',
        uri: 'notion://user/test-user-id',
        mimeType: 'text/plain',
        _meta: { email: 'test@example.com' },
      }),
      extractTextFromNotionBlocks: vi.fn().mockReturnValue('Page content'),
    },
    formatters: {
      formatSearchResults: vi.fn().mockReturnValue('Search results'),
      formatDatabaseList: vi.fn().mockReturnValue('Database list'),
      formatUserList: vi.fn().mockReturnValue('User list'),
      formatDatabaseQueryResults: vi.fn().mockReturnValue('Query results'),
      formatPageDetails: vi.fn().mockReturnValue('Page: Test Page'),
    },
  };
}

describe('createResourceHandlers', () => {
  const mockDebug = vi.fn();
  const mockInfo = vi.fn();
  const mockWarn = vi.fn();
  const mockError = vi.fn();

  const mockLogger: Logger = {
    trace: vi.fn(),
    debug: mockDebug,
    info: mockInfo,
    warn: mockWarn,
    error: mockError,
    fatal: vi.fn(),
    child: vi.fn().mockReturnThis(),
    isLevelEnabled: vi.fn().mockReturnValue(true),
  };

  const mockNotionClient: MinimalNotionClient = {
    pages: { retrieve: vi.fn() },
    databases: { retrieve: vi.fn(), query: vi.fn() },
    search: vi.fn(),
    users: { list: vi.fn() },
    blocks: { children: { list: vi.fn() } },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleListResources', () => {
    it('should list all available resources', async () => {
      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      const result = await handlers.handleListResources();

      expect(result).toEqual({
        resources: [
          {
            uri: 'notion://discovery',
            name: 'Notion Resource Discovery',
            description: 'Discover available Notion resources dynamically',
            mimeType: 'application/json',
          },
        ],
      });

      expect(mockDebug).toHaveBeenCalledWith('Listing available resources');
    });
  });

  describe('handleReadResource', () => {
    it('should handle discovery URI', async () => {
      const mockUser = {
        ...createMockPersonUser(),
        id: 'user-1',
        name: 'Test User',
        person: { email: 'test@example.com' },
      };

      const mockPage = createMockPage({
        id: 'page-1',
        properties: {
          title: {
            type: 'title' as const,
            title: [
              {
                plain_text: 'Test Page',
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                type: 'text' as const,
                text: { content: 'Test Page', link: null },
                href: null,
              },
            ],
            id: 'title-id',
          },
        },
        url: 'https://notion.so/page-1',
      });

      const mockDb = createMockDatabase({
        id: 'db-1',
        title: [
          {
            plain_text: 'Test Database',
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            type: 'text' as const,
            text: { content: 'Test Database', link: null },
            href: null,
          },
        ],
        url: 'https://notion.so/db-1',
      });

      const mockSearchResult = {
        results: [mockPage, mockDb],
        next_cursor: null,
        has_more: false,
      };

      vi.mocked(mockNotionClient.users.list).mockResolvedValueOnce(
        createMockListUsersResponse([mockUser]),
      );
      vi.mocked(mockNotionClient.search).mockResolvedValueOnce(
        createMockSearchResponse(mockSearchResult.results),
      );

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      const result = await handlers.handleReadResource('notion://discovery');

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0]).toMatchObject({
        uri: 'notion://discovery',
        mimeType: 'application/json',
      });
      expect(result.contents[0]?.text).toContain('# Notion Workspace Discovery');

      expect(mockDebug).toHaveBeenCalledWith('Reading resource', {
        uri: 'notion://discovery',
      });
      expect(mockNotionClient.users.list).toHaveBeenCalled();
      expect(mockNotionClient.search).toHaveBeenCalled();
    });

    it('should read a specific page', async () => {
      const mockPage = createMockPage({
        id: 'page-123',
        properties: {
          title: {
            type: 'title' as const,
            title: [
              {
                plain_text: 'My Page',
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                type: 'text' as const,
                text: { content: 'My Page', link: null },
                href: null,
              },
            ],
            id: 'title-id',
          },
        },
        url: 'https://notion.so/page-123',
      });

      vi.mocked(mockNotionClient.pages.retrieve).mockResolvedValueOnce(mockPage);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      const result = await handlers.handleReadResource('notion://pages/page-123');

      expect(result).toEqual({
        contents: [
          {
            uri: 'notion://pages/page-123',
            mimeType: 'application/json',
            text: JSON.stringify(mockPage, null, 2),
          },
        ],
      });

      expect(mockNotionClient.pages.retrieve).toHaveBeenCalledWith({ page_id: 'page-123' });
    });

    it('should read a specific database', async () => {
      const mockDatabase = createMockDatabase({
        id: 'db-456',
        title: [
          {
            plain_text: 'My Database',
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            type: 'text' as const,
            text: { content: 'My Database', link: null },
            href: null,
          },
        ],
        properties: {
          Status: {
            id: 'status-id',
            name: 'Status',
            type: 'select',
            description: null,
            select: { options: [] },
          },
        },
        url: 'https://notion.so/db-456',
      });

      vi.mocked(mockNotionClient.databases.retrieve).mockResolvedValueOnce(mockDatabase);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      const result = await handlers.handleReadResource('notion://databases/db-456');

      expect(result).toEqual({
        contents: [
          {
            uri: 'notion://databases/db-456',
            mimeType: 'application/json',
            text: JSON.stringify(mockDatabase, null, 2),
          },
        ],
      });

      expect(mockNotionClient.databases.retrieve).toHaveBeenCalledWith({ database_id: 'db-456' });
    });

    it('should handle invalid URI', async () => {
      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      await expect(handlers.handleReadResource('invalid://uri')).rejects.toThrow(
        'Invalid resource URI: invalid://uri',
      );

      expect(mockError).toHaveBeenCalledWith('Invalid resource URI', {
        uri: 'invalid://uri',
      });
    });

    it('should handle unsupported resource type', async () => {
      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      await expect(handlers.handleReadResource('notion://unknown/123')).rejects.toThrow(
        'Invalid resource URI: notion://unknown/123',
      );
    });

    it('should handle Notion API errors', async () => {
      const notionError = new Error('API rate limited');
      vi.mocked(mockNotionClient.pages.retrieve).mockRejectedValueOnce(notionError);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
        notionOperations: createMockOperations(),
      });

      await expect(handlers.handleReadResource('notion://pages/page-123')).rejects.toThrow(
        'Failed to read resource',
      );

      expect(mockError).toHaveBeenCalledWith(
        'Error reading resource',
        expect.objectContaining({
          uri: 'notion://pages/page-123',
          error: notionError,
        }),
      );
    });
  });
});

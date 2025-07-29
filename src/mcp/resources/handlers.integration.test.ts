import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createResourceHandlers } from './handlers.js';
import type { NotionClientWrapper } from '../../notion/client.js';
import type { Logger } from '../../logging/logger.js';
import {
  createMockPage,
  createMockDatabase,
  createMockUser,
} from '../../test-helpers/notion-mocks.js';

describe('createResourceHandlers', () => {
  const mockLogger: Logger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const mockNotionClient: NotionClientWrapper = {
    getPage: vi.fn(),
    getDatabase: vi.fn(),
    queryDatabase: vi.fn(),
    search: vi.fn(),
    listUsers: vi.fn(),
    getBlockChildren: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleListResources', () => {
    it('should list all available resources', async () => {
      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
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

      expect(mockLogger.debug).toHaveBeenCalledWith('Listing available resources');
    });
  });

  describe('handleReadResource', () => {
    it('should handle discovery URI', async () => {
      const mockUser = createMockUser({
        id: 'user-1',
        name: 'Test User',
        type: 'person',
        person: { email: 'test@example.com' },
      });

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

      vi.mocked(mockNotionClient.listUsers).mockResolvedValueOnce([mockUser]);
      vi.mocked(mockNotionClient.search).mockResolvedValueOnce(mockSearchResult);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
      });

      const result = await handlers.handleReadResource('notion://discovery');

      expect(result).toEqual({
        contents: [
          {
            uri: 'notion://discovery',
            mimeType: 'application/json',
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            text: expect.stringContaining('# Notion Workspace Discovery') as string,
          },
        ],
      });

      expect(mockLogger.debug).toHaveBeenCalledWith('Reading resource', {
        uri: 'notion://discovery',
      });
      expect(mockNotionClient.listUsers).toHaveBeenCalled();
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

      vi.mocked(mockNotionClient.getPage).mockResolvedValueOnce(mockPage);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
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

      expect(mockNotionClient.getPage).toHaveBeenCalledWith('page-123');
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

      vi.mocked(mockNotionClient.getDatabase).mockResolvedValueOnce(mockDatabase);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
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

      expect(mockNotionClient.getDatabase).toHaveBeenCalledWith('db-456');
    });

    it('should handle invalid URI', async () => {
      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
      });

      await expect(handlers.handleReadResource('invalid://uri')).rejects.toThrow(
        'Invalid resource URI: invalid://uri',
      );

      expect(mockLogger.error).toHaveBeenCalledWith('Invalid resource URI', {
        uri: 'invalid://uri',
      });
    });

    it('should handle unsupported resource type', async () => {
      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
      });

      await expect(handlers.handleReadResource('notion://unknown/123')).rejects.toThrow(
        'Invalid resource URI: notion://unknown/123',
      );
    });

    it('should handle Notion API errors', async () => {
      const notionError = new Error('API rate limited');
      vi.mocked(mockNotionClient.getPage).mockRejectedValueOnce(notionError);

      const handlers = createResourceHandlers({
        notionClient: mockNotionClient,
        logger: mockLogger,
      });

      await expect(handlers.handleReadResource('notion://pages/page-123')).rejects.toThrow(
        'Failed to read resource',
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error reading resource',
        expect.objectContaining({
          uri: 'notion://pages/page-123',
          error: notionError,
        }),
      );
    });
  });
});

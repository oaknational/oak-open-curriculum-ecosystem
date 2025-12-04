/**
 * Mock Notion Client for E2E Testing
 *
 * Returns canned responses for Notion API calls, allowing E2E tests
 * to exercise all server code without real network calls.
 *
 * Activated via: NOTION_USE_MOCK_CLIENT=true environment variable
 */

import type { MinimalNotionClient } from '../../types/notion-types/notion-client.js';
import { createMockPage, createMockDataSource, createMockPersonUser } from './notion-mocks.js';
import { createMockListUsersResponse, createMockSearchResponse } from './notion-api-mocks.js';

/**
 * Creates sample page data for E2E tests
 */
function createSamplePage() {
  return createMockPage({
    id: 'e2e-page-123',
    properties: {
      title: {
        id: 'title',
        type: 'title',
        title: [
          {
            type: 'text',
            text: { content: 'E2E Test Page', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'E2E Test Page',
            href: null,
          },
        ],
      },
    },
  });
}

/**
 * Creates sample database data for E2E tests
 */
function createSampleDatabase() {
  return createMockDataSource({
    id: 'e2e-db-456',
    title: [
      {
        type: 'text',
        text: { content: 'E2E Test Database', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'E2E Test Database',
        href: null,
      },
    ],
  });
}

/**
 * Creates sample block list response for E2E tests
 */
function createSampleBlocksList() {
  return {
    object: 'list' as const,
    results: [
      {
        object: 'block' as const,
        id: 'block-123',
        type: 'paragraph' as const,
        paragraph: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'Sample paragraph text', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'Sample paragraph text',
              href: null,
            },
          ],
          color: 'default' as const,
        },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user' as const, id: 'user-123' },
        last_edited_by: { object: 'user' as const, id: 'user-123' },
        archived: false,
        in_trash: false,
        has_children: false,
        parent: { type: 'page_id' as const, page_id: 'e2e-page-123' },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block' as const,
    block: {},
  };
}

/**
 * Creates mock Notion client for E2E testing.
 *
 * Returns MinimalNotionClient with canned responses. Uses the dataSources API
 * (not the legacy databases API) per Notion SDK v5.
 */
export function createMockNotionClientForE2E(): MinimalNotionClient {
  const samplePage = createSamplePage();
  const sampleDataSource = createSampleDatabase();
  const sampleUser = createMockPersonUser();

  return {
    users: {
      list: () => Promise.resolve(createMockListUsersResponse([sampleUser])),
    },

    pages: {
      retrieve: (args: { page_id: string }) => {
        if (args.page_id.includes('non-existent')) {
          return Promise.reject(new Error('object_not_found'));
        }
        return Promise.resolve(samplePage);
      },
    },

    dataSources: {
      retrieve: () => Promise.resolve(sampleDataSource),
      query: () =>
        Promise.resolve({
          object: 'list',
          results: [samplePage],
          next_cursor: null,
          has_more: false,
          type: 'page_or_data_source',
          page_or_data_source: {},
        }),
    },

    blocks: {
      children: {
        list: () => Promise.resolve(createSampleBlocksList()),
      },
    },

    search: () => Promise.resolve(createMockSearchResponse([samplePage, sampleDataSource])),
  };
}

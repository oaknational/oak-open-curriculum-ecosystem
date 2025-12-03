/**
 * Simple type-compliant mocks for Notion SDK types
 * Following testing strategy: simple mocks passed as arguments
 */

import type {
  PageObjectResponse,
  DataSourceObjectResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export function createMockPage(overrides: Partial<PageObjectResponse> = {}): PageObjectResponse {
  return {
    object: 'page',
    id: 'page-123',
    created_time: '2024-01-01T00:00:00Z',
    last_edited_time: '2024-01-02T00:00:00Z',
    created_by: { object: 'user', id: 'user-123' },
    last_edited_by: { object: 'user', id: 'user-123' },
    archived: false,
    in_trash: false,
    properties: {},
    parent: { type: 'workspace', workspace: true },
    url: 'https://notion.so/page-123',
    public_url: null,
    icon: null,
    cover: null,
    is_locked: false, // Added required property
    ...overrides,
  };
}

export function createMockDataSource(
  overrides: Partial<DataSourceObjectResponse> = {},
): DataSourceObjectResponse {
  return {
    object: 'data_source',
    id: 'db-123',
    created_time: '2024-01-01T00:00:00Z',
    last_edited_time: '2024-01-02T00:00:00Z',
    created_by: { object: 'user', id: 'user-123' },
    last_edited_by: { object: 'user', id: 'user-123' },
    archived: false,
    in_trash: false,
    title: [],
    description: [],
    properties: {},
    parent: { type: 'database_id', database_id: 'db-parent-123' },
    database_parent: { type: 'workspace', workspace: true },
    url: 'https://notion.so/db-123',
    public_url: null,
    icon: null,
    cover: null,
    is_inline: false,
    ...overrides,
  };
}

export function createMockPersonUser(): UserObjectResponse {
  return {
    object: 'user',
    id: 'user-123',
    type: 'person',
    name: 'Test User',
    avatar_url: null,
    person: { email: 'test@example.com' },
  };
}

export function createMockBotUser(): UserObjectResponse {
  return {
    object: 'user',
    id: 'bot-123',
    type: 'bot',
    name: 'Test Bot',
    avatar_url: null,
    bot: {},
  };
}

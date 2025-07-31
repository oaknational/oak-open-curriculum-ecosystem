/**
 * Simple type-compliant mocks for Notion SDK types
 * Following testing strategy: simple mocks passed as arguments
 */

import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  UserObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client';

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
    ...overrides,
  };
}

export function createMockDatabase(
  overrides: Partial<DatabaseObjectResponse> = {},
): DatabaseObjectResponse {
  return {
    object: 'database',
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
    parent: { type: 'workspace', workspace: true },
    url: 'https://notion.so/db-123',
    public_url: null,
    icon: null,
    cover: null,
    is_inline: false,
    ...overrides,
  };
}

export function createMockUser(overrides: Partial<UserObjectResponse> = {}): UserObjectResponse {
  const baseUser = {
    object: 'user' as const,
    id: overrides.id || 'user-123',
    name: overrides.name !== undefined ? overrides.name : 'Test User',
    avatar_url: overrides.avatar_url !== undefined ? overrides.avatar_url : null,
  };

  // Create bot user
  if (overrides.type === 'bot') {
    const botUser: UserObjectResponse = {
      ...baseUser,
      type: 'bot' as const,
      bot: overrides.bot || {},
    };
    return botUser;
  }

  // Create person user (default)
  const personUser: UserObjectResponse = {
    ...baseUser,
    type: 'person' as const,
    person:
      overrides.type === 'person' && overrides.person
        ? overrides.person
        : { email: 'test@example.com' },
  };
  return personUser;
}

export function createMockBlock(): BlockObjectResponse {
  // For now, only support paragraph blocks to maintain type safety
  // Can be extended to support other block types with proper type guards
  const paragraphBlock: BlockObjectResponse = {
    object: 'block' as const,
    id: 'block-123',
    parent: { type: 'page_id' as const, page_id: 'page-123' },
    created_time: '2024-01-01T00:00:00Z',
    last_edited_time: '2024-01-02T00:00:00Z',
    created_by: { object: 'user' as const, id: 'user-123' },
    last_edited_by: { object: 'user' as const, id: 'user-123' },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'paragraph' as const,
    paragraph: {
      rich_text: [],
      color: 'default' as const,
    },
  };
  return paragraphBlock;
}

/**
 * Type-safe mock factories for Notion API responses
 * Following AGENT.md: no `any`, no `as`, proper types
 */

import type {
  ListUsersResponse,
  SearchResponse,
  UserObjectResponse,
  PageObjectResponse,
  DataSourceObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

/**
 * Creates a mock ListUsersResponse
 */
export function createMockListUsersResponse(users: UserObjectResponse[]): ListUsersResponse {
  return {
    type: 'user',
    user: {}, // EmptyObject - required by type but not used
    object: 'list',
    results: users,
    has_more: false,
    next_cursor: null,
  };
}

/**
 * Creates a mock SearchResponse
 */
export function createMockSearchResponse(
  results: (PageObjectResponse | DataSourceObjectResponse)[],
): SearchResponse {
  return {
    type: 'page_or_data_source',
    page_or_data_source: {}, // EmptyObject - required by type but not used
    object: 'list',
    results,
    has_more: false,
    next_cursor: null,
  };
}

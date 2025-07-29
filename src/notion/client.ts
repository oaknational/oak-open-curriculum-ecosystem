import { Client } from '@notionhq/client';
import type {
  UserObjectResponse,
  PageObjectResponse,
  DatabaseObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client';
import { scrubEmail } from '../utils/scrubbing.js';

// Re-export Notion SDK types for convenience
export type NotionPage = PageObjectResponse;
export type NotionDatabase = DatabaseObjectResponse;
export type NotionUser = UserObjectResponse;
export type NotionBlock = BlockObjectResponse;

// Define search types since they're not exported by the SDK
export interface NotionSearchResult {
  results: (PageObjectResponse | DatabaseObjectResponse)[];
  next_cursor: string | null;
  has_more: boolean;
}

// Define query types based on the API
// Note: We omit filter here as Notion SDK doesn't export the filter types
// The filter will be passed through directly at the call site
export interface NotionDatabaseQuery {
  sorts?: {
    property: string;
    direction: 'ascending' | 'descending';
  }[];
  page_size?: number;
  start_cursor?: string;
}

export interface NotionSearchQuery {
  query: string;
  filter?: {
    property: 'object';
    value: 'page' | 'database';
  };
  sort?: {
    timestamp: 'last_edited_time';
    direction: 'ascending' | 'descending';
  };
  page_size?: number;
  start_cursor?: string;
}

export interface NotionClientWrapper {
  listUsers(): Promise<UserObjectResponse[]>;
  getPage(pageId: string): Promise<PageObjectResponse>;
  getDatabase(databaseId: string): Promise<DatabaseObjectResponse>;
  queryDatabase(databaseId: string, query?: NotionDatabaseQuery): Promise<PageObjectResponse[]>;
  search(query: NotionSearchQuery): Promise<NotionSearchResult>;
  getBlockChildren(blockId: string): Promise<BlockObjectResponse[]>;
}

export function createNotionClient(apiKey: string): NotionClientWrapper {
  const client = new Client({ auth: apiKey });

  return {
    async listUsers(): Promise<UserObjectResponse[]> {
      const response = await client.users.list({});
      return response.results.map((user) => {
        // Scrub email addresses from names
        if (user.name) {
          user.name = scrubEmail(user.name);
        }

        // Scrub email from person object
        if (user.type === 'person' && user.person?.email) {
          user.person.email = scrubEmail(user.person.email);
        }

        return user;
      });
    },

    async getPage(pageId: string): Promise<PageObjectResponse> {
      const response = await client.pages.retrieve({ page_id: pageId });
      if ('properties' in response) {
        return response;
      }
      throw new Error('Invalid page response');
    },

    async getDatabase(databaseId: string): Promise<DatabaseObjectResponse> {
      const response = await client.databases.retrieve({ database_id: databaseId });
      if (
        'properties' in response &&
        response.object === 'database' &&
        'title' in response &&
        'description' in response
      ) {
        return response;
      }
      throw new Error('Invalid database response');
    },

    async queryDatabase(
      databaseId: string,
      query?: NotionDatabaseQuery,
    ): Promise<PageObjectResponse[]> {
      // The Notion SDK expects the parameters directly, not nested in a query object
      const queryParams: Parameters<typeof client.databases.query>[0] = {
        database_id: databaseId,
      };

      if (query?.sorts) {
        queryParams.sorts = query.sorts;
      }
      if (query?.page_size) {
        queryParams.page_size = query.page_size;
      }
      if (query?.start_cursor) {
        queryParams.start_cursor = query.start_cursor;
      }

      const response = await client.databases.query(queryParams);
      return response.results.filter(
        (result): result is PageObjectResponse =>
          result.object === 'page' && 'properties' in result,
      );
    },

    async search(query: NotionSearchQuery): Promise<NotionSearchResult> {
      const response = await client.search(query);
      return {
        results: response.results.filter(
          (result): result is PageObjectResponse | DatabaseObjectResponse =>
            (result.object === 'page' || result.object === 'database') && 'id' in result,
        ),
        next_cursor: response.next_cursor,
        has_more: response.has_more,
      };
    },

    async getBlockChildren(blockId: string): Promise<BlockObjectResponse[]> {
      const response = await client.blocks.children.list({
        block_id: blockId,
        page_size: 100,
      });
      return response.results.filter(
        (result): result is BlockObjectResponse => result.object === 'block',
      );
    },
  };
}

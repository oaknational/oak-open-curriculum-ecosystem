import { describe, it, expect } from 'vitest';
import type { DataSourceObjectResponse as NotionDatabase } from '@notionhq/client/build/src/api-endpoints';
import { transformNotionDatabaseToMcpResource } from './database-transformer';

describe('transformNotionDatabaseToMcpResource', () => {
  it('should transform a basic database correctly', () => {
    const notionDatabase: NotionDatabase = {
      object: 'data_source',
      id: 'db-123',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-123' },
      last_edited_by: { object: 'user', id: 'user-123' },
      archived: false,
      in_trash: false,
      title: [
        {
          type: 'text',
          text: { content: 'My Database', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'My Database',
          href: null,
        },
      ],
      description: [
        {
          type: 'text',
          text: { content: 'A test database', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'A test database',
          href: null,
        },
      ],
      properties: {
        Name: {
          id: 'title',
          name: 'Name',
          type: 'title',
          title: {},
          description: null,
        },
        Status: {
          id: 'status-id',
          name: 'Status',
          type: 'select',
          description: null,
          select: {
            options: [
              { id: 'todo', name: 'To Do', color: 'red', description: null },
              { id: 'done', name: 'Done', color: 'green', description: null },
            ],
          },
        },
      },
      parent: { type: 'database_id', database_id: 'db-parent-123' },
      database_parent: { type: 'database_id', database_id: 'db-parent-123' },
      url: 'https://www.notion.so/db123',
      public_url: null,
      icon: null,
      cover: null,
      is_inline: false,
    };

    const result = transformNotionDatabaseToMcpResource(notionDatabase);

    expect(result).toEqual({
      uri: 'notion://databases/db-123',
      name: 'My Database',
      description: 'A test database',
      mimeType: 'application/json',
      _meta: {
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        url: 'https://www.notion.so/db123',
        propertyCount: 2,
        properties: ['Name', 'Status'],
      },
    });
  });

  it('should handle database without title', () => {
    const notionDatabase: NotionDatabase = {
      object: 'data_source',
      id: 'db-456',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-123' },
      last_edited_by: { object: 'user', id: 'user-123' },
      archived: false,
      in_trash: false,
      title: [],
      description: [],
      properties: {},
      parent: { type: 'database_id', database_id: 'db-parent-123' },
      database_parent: { type: 'database_id', database_id: 'db-parent-123' },
      url: 'https://www.notion.so/db456',
      public_url: null,
      icon: null,
      cover: null,
      is_inline: false,
    };

    const result = transformNotionDatabaseToMcpResource(notionDatabase);

    expect(result.name).toBe('Untitled Database');
    expect(result.description).toBe('Notion database');
  });
});

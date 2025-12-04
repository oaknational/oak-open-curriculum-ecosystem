import { describe, it, expect } from 'vitest';
import { transformNotionPageToMcpResource } from './page-transformer';
import type { PageObjectResponse } from '@notionhq/client';

describe('transformNotionPageToMcpResource', () => {
  it('should transform a basic page', () => {
    const notionPage: PageObjectResponse = {
      object: 'page',
      id: 'page-123',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-123' },
      last_edited_by: { object: 'user', id: 'user-123' },
      archived: false,
      in_trash: false,
      properties: {
        title: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: { content: 'My Test Page', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'My Test Page',
              href: null,
            },
          ],
          id: 'title-id',
        },
      },
      parent: { type: 'workspace', workspace: true },
      url: 'https://www.notion.so/My-Test-Page-page123',
      public_url: null,
      icon: null,
      cover: null,
      is_locked: false,
    };

    const result = transformNotionPageToMcpResource(notionPage);

    expect(result).toEqual({
      uri: 'notion://pages/page-123',
      name: 'My Test Page',
      description: 'Notion page',
      mimeType: 'application/json',
      _meta: {
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        url: 'https://www.notion.so/My-Test-Page-page123',
      },
    });
  });

  it('should handle page without title', () => {
    const notionPage: PageObjectResponse = {
      object: 'page',
      id: 'page-456',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-123' },
      last_edited_by: { object: 'user', id: 'user-123' },
      archived: false,
      in_trash: false,
      properties: {},
      parent: { type: 'workspace', workspace: true },
      url: 'https://www.notion.so/page-456',
      public_url: null,
      icon: null,
      cover: null,
      is_locked: false,
    };

    const result = transformNotionPageToMcpResource(notionPage);

    expect(result.name).toBe('Untitled');
    expect(result.uri).toBe('notion://pages/page-456');
  });

  it('should handle archived pages', () => {
    const notionPage: PageObjectResponse = {
      object: 'page',
      id: 'page-789',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      created_by: { object: 'user', id: 'user-123' },
      last_edited_by: { object: 'user', id: 'user-123' },
      archived: true,
      in_trash: false,
      properties: {
        title: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: { content: 'Archived Page', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Archived Page',
              href: null,
            },
          ],
          id: 'title-id',
        },
      },
      parent: { type: 'workspace', workspace: true },
      url: 'https://www.notion.so/Archived-Page-page789',
      public_url: null,
      icon: null,
      cover: null,
      is_locked: false,
    };

    const result = transformNotionPageToMcpResource(notionPage);

    expect(result.name).toBe('Archived Page');
    expect(result.description).toBe('Notion page (archived)');
    expect(result._meta?.archived).toBe(true);
  });
});

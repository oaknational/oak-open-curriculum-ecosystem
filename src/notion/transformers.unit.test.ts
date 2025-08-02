import { describe, it, expect } from 'vitest';
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
  extractTextFromNotionBlocks,
  formatNotionRichText,
} from './transformers.js';
import {
  createMockPage,
  createMockDatabase,
  createMockUser,
} from '../test-helpers/notion-mocks.js';

describe('transformNotionPageToMcpResource', () => {
  it('should transform a basic page', () => {
    const notionPage = createMockPage({
      id: 'page-123',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      properties: {
        title: {
          type: 'title' as const,
          title: [
            {
              type: 'text' as const,
              text: { content: 'My Test Page', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'My Test Page',
              href: null,
            },
          ],
          id: 'title-id',
        },
      },
      url: 'https://www.notion.so/My-Test-Page-page123',
    });

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
    const notionPage = createMockPage({
      id: 'page-456',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      properties: {},
      url: 'https://www.notion.so/page456',
    });

    const result = transformNotionPageToMcpResource(notionPage);

    expect(result.name).toBe('Untitled');
    expect(result.uri).toBe('notion://pages/page-456');
  });

  it('should handle archived pages', () => {
    const notionPage = createMockPage({
      id: 'page-789',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      archived: true,
      properties: {
        title: {
          type: 'title' as const,
          title: [
            {
              type: 'text' as const,
              text: { content: 'Archived Page', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'Archived Page',
              href: null,
            },
          ],
          id: 'title-id',
        },
      },
      url: 'https://www.notion.so/Archived-Page-page789',
    });

    const result = transformNotionPageToMcpResource(notionPage);

    expect(result.name).toBe('Archived Page');
    expect(result.description).toBe('Notion page (archived)');
    expect(result._meta?.['archived']).toBe(true);
  });
});

describe('transformNotionDatabaseToMcpResource', () => {
  it('should transform a basic database', () => {
    const notionDatabase = createMockDatabase({
      id: 'db-123',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      title: [
        {
          type: 'text' as const,
          text: { content: 'My Database', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default' as const,
          },
          plain_text: 'My Database',
          href: null,
        },
      ],
      description: [
        {
          type: 'text' as const,
          text: { content: 'A test database', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default' as const,
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
      url: 'https://www.notion.so/db123',
    });

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
    const notionDatabase = createMockDatabase({
      id: 'db-456',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-02T00:00:00.000Z',
      title: [],
      description: [],
      properties: {},
      url: 'https://www.notion.so/db456',
    });

    const result = transformNotionDatabaseToMcpResource(notionDatabase);

    expect(result.name).toBe('Untitled Database');
    expect(result.description).toBe('Notion database');
  });
});

describe('transformNotionUserToMcpResource', () => {
  it('should transform a person user', () => {
    const notionUser = createMockUser({
      id: 'user-123',
      type: 'person',
      name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      person: {
        email: 'john.doe@example.com',
      },
    });

    const result = transformNotionUserToMcpResource(notionUser);

    expect(result).toEqual({
      uri: 'notion://users/user-123',
      name: 'John Doe',
      description: 'Notion workspace user',
      mimeType: 'application/json',
      _meta: {
        type: 'person',
        avatar_url: 'https://example.com/avatar.jpg',
        email: 'joh...@example.com', // Email should be scrubbed
      },
    });
  });

  it('should transform a bot user', () => {
    const notionUser = createMockUser({
      id: 'bot-123',
      type: 'bot',
      name: 'My Integration',
      avatar_url: null,
    });

    const result = transformNotionUserToMcpResource(notionUser);

    expect(result).toEqual({
      uri: 'notion://users/bot-123',
      name: 'My Integration',
      description: 'Notion bot user',
      mimeType: 'application/json',
      _meta: {
        type: 'bot',
        avatar_url: null,
      },
    });
  });

  it('should handle user without name', () => {
    const notionUser = createMockUser({
      id: 'user-456',
      type: 'person',
      name: null,
      avatar_url: null,
      person: {
        email: 'anonymous@example.com',
      },
    });

    const result = transformNotionUserToMcpResource(notionUser);

    expect(result.name).toBe('Unknown User');
    expect(result._meta?.['email']).toBe('ano...@example.com');
  });
});

describe('extractTextFromNotionBlocks', () => {
  it('should extract text from paragraph blocks', () => {
    const blocks = [
      {
        type: 'paragraph' as const,
        paragraph: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'This is a paragraph.', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'This is a paragraph.',
              href: null,
            },
          ],
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('This is a paragraph.');
  });

  it('should extract text from heading blocks', () => {
    const blocks = [
      {
        type: 'heading_1' as const,
        heading_1: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'Main Heading', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'Main Heading',
              href: null,
            },
          ],
        },
      },
      {
        type: 'heading_2' as const,
        heading_2: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'Subheading', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'Subheading',
              href: null,
            },
          ],
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('# Main Heading\n\n## Subheading');
  });

  it('should extract text from bulleted list items', () => {
    const blocks = [
      {
        type: 'bulleted_list_item' as const,
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'First item', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'First item',
              href: null,
            },
          ],
        },
      },
      {
        type: 'bulleted_list_item' as const,
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'Second item', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'Second item',
              href: null,
            },
          ],
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('• First item\n\n• Second item');
  });

  it('should handle empty blocks array', () => {
    const result = extractTextFromNotionBlocks([]);
    expect(result).toBe('');
  });

  it('should skip unsupported block types', () => {
    const blocks = [
      {
        type: 'paragraph' as const,
        paragraph: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'Visible text', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'Visible text',
              href: null,
            },
          ],
        },
      },
      {
        type: 'image' as const,
        image: {
          type: 'external' as const,
          external: { url: 'https://example.com/image.jpg' },
        },
      },
      {
        type: 'paragraph' as const,
        paragraph: {
          rich_text: [
            {
              type: 'text' as const,
              text: { content: 'More visible text', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default' as const,
              },
              plain_text: 'More visible text',
              href: null,
            },
          ],
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('Visible text\n\nMore visible text');
  });
});

describe('formatNotionRichText', () => {
  it('should format plain text', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'Plain text', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'Plain text',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('Plain text');
  });

  it('should format bold text', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'Bold text', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'Bold text',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('**Bold text**');
  });

  it('should format italic text', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'Italic text', link: null },
        annotations: {
          bold: false,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'Italic text',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('*Italic text*');
  });

  it('should format code text', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'code text', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: true,
          color: 'default' as const,
        },
        plain_text: 'code text',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('`code text`');
  });

  it('should format strikethrough text', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'Strikethrough text', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: true,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'Strikethrough text',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('~~Strikethrough text~~');
  });

  it('should format text with links', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'Link text', link: { url: 'https://example.com' } },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'Link text',
        href: 'https://example.com',
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('[Link text](https://example.com)');
  });

  it('should handle multiple annotations', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'Bold and italic', link: null },
        annotations: {
          bold: true,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'Bold and italic',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('***Bold and italic***');
  });

  it('should concatenate multiple rich text items', () => {
    const richText = [
      {
        type: 'text' as const,
        text: { content: 'This is ', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'This is ',
        href: null,
      },
      {
        type: 'text' as const,
        text: { content: 'bold', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: 'bold',
        href: null,
      },
      {
        type: 'text' as const,
        text: { content: ' text', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        plain_text: ' text',
        href: null,
      },
    ];

    const result = formatNotionRichText(richText);

    expect(result).toBe('This is **bold** text');
  });

  it('should handle empty rich text array', () => {
    const result = formatNotionRichText([]);
    expect(result).toBe('');
  });
});

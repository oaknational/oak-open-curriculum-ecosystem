import { describe, it, expect } from 'vitest';
import { extractTextFromNotionBlocks } from './block-extractors.js';
import type { BlockObjectResponse } from '@notionhq/client';

describe('extractTextFromNotionBlocks', () => {
  it('should extract text from paragraph blocks', () => {
    const blocks: BlockObjectResponse[] = [
      {
        object: 'block',
        id: 'test-id',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'This is a paragraph.', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a paragraph.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('This is a paragraph.');
  });

  it('should extract text from heading blocks', () => {
    const blocks: BlockObjectResponse[] = [
      {
        object: 'block',
        id: 'test-id-1',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Main Heading', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Main Heading',
              href: null,
            },
          ],
          color: 'default',
          is_toggleable: false,
        },
      },
      {
        object: 'block',
        id: 'test-id-2',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Subheading', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Subheading',
              href: null,
            },
          ],
          color: 'default',
          is_toggleable: false,
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('# Main Heading\n\n## Subheading');
  });

  it('should extract text from bulleted list items', () => {
    const blocks: BlockObjectResponse[] = [
      {
        object: 'block',
        id: 'test-id-1',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'First item', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'First item',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'test-id-2',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Second item', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Second item',
              href: null,
            },
          ],
          color: 'default',
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
    const blocks: BlockObjectResponse[] = [
      {
        object: 'block',
        id: 'test-id-1',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Visible text', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Visible text',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'test-id-2',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'image',
        image: {
          type: 'external',
          external: { url: 'https://example.com/image.jpg' },
          caption: [],
        },
      },
      {
        object: 'block',
        id: 'test-id-3',
        parent: { type: 'page_id', page_id: 'test-page' },
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-01T00:00:00Z',
        created_by: { object: 'user', id: 'test-user' },
        last_edited_by: { object: 'user', id: 'test-user' },
        has_children: false,
        archived: false,
        in_trash: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'More visible text', link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'More visible text',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ];

    const result = extractTextFromNotionBlocks(blocks);

    expect(result).toBe('Visible text\n\nMore visible text');
  });
});

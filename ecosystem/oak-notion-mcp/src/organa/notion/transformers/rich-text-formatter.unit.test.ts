import { describe, it, expect } from 'vitest';
import { formatNotionRichText } from './rich-text-formatter';

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

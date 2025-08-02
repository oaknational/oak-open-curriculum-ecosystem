/**
 * Rich text formatting utilities
 * Pure functions for converting Notion rich text to markdown
 */

/**
 * Rich text item interface for formatting
 * Simplified version focusing on formatting properties
 */
interface RichTextItem {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  type: string;
  href?: string | null;
}

/**
 * Formats Notion rich text into markdown-style plain text
 * Pure function - no side effects
 */
export function formatNotionRichText(richTextArray: RichTextItem[]): string {
  return richTextArray
    .map((richText) => {
      let text = richText.plain_text;

      // Apply annotations if they exist
      if (richText.annotations && typeof richText.annotations === 'object') {
        const annotations = richText.annotations;

        if (annotations.code) {
          text = `\`${text}\``;
        }
        if (annotations.bold) {
          text = `**${text}**`;
        }
        if (annotations.italic) {
          text = `*${text}*`;
        }
        if (annotations.strikethrough) {
          text = `~~${text}~~`;
        }
      }

      // Apply link
      if (richText.href) {
        text = `[${text}](${richText.href})`;
      }

      return text;
    })
    .join('');
}

/**
 * Block text extraction strategies
 * Strategy pattern for extracting text from different block types
 */

import type { NotionBlock } from './types.js';
import { formatNotionRichText } from './rich-text-formatter.js';

/**
 * Block text extractor function type
 */
type BlockExtractor = (block: NotionBlock) => string;

/**
 * Map of block type to extraction strategy
 */
const extractors: Record<string, BlockExtractor> = {
  paragraph: (block) =>
    block.paragraph?.rich_text ? formatNotionRichText(block.paragraph.rich_text) : '',

  heading_1: (block) =>
    block.heading_1?.rich_text ? `# ${formatNotionRichText(block.heading_1.rich_text)}` : '',

  heading_2: (block) =>
    block.heading_2?.rich_text ? `## ${formatNotionRichText(block.heading_2.rich_text)}` : '',

  heading_3: (block) =>
    block.heading_3?.rich_text ? `### ${formatNotionRichText(block.heading_3.rich_text)}` : '',

  bulleted_list_item: (block) =>
    block.bulleted_list_item?.rich_text
      ? `• ${formatNotionRichText(block.bulleted_list_item.rich_text)}`
      : '',

  numbered_list_item: (block) =>
    block.numbered_list_item?.rich_text
      ? `1. ${formatNotionRichText(block.numbered_list_item.rich_text)}`
      : '',

  to_do: (block) => {
    if (!block.to_do?.rich_text) return '';
    const checkbox = block.to_do.checked ? '[x]' : '[ ]';
    return `${checkbox} ${formatNotionRichText(block.to_do.rich_text)}`;
  },

  toggle: (block) =>
    block.toggle?.rich_text ? `▸ ${formatNotionRichText(block.toggle.rich_text)}` : '',

  quote: (block) =>
    block.quote?.rich_text ? `> ${formatNotionRichText(block.quote.rich_text)}` : '',

  code: (block) => {
    if (!block.code?.rich_text) return '';
    const lang = block.code.language || '';
    const code = formatNotionRichText(block.code.rich_text);
    return `\`\`\`${lang}\n${code}\n\`\`\``;
  },
};

/**
 * Extracts plain text content from Notion blocks
 * Pure function using strategy pattern
 */
export function extractTextFromNotionBlocks(blocks: NotionBlock[]): string {
  const textParts: string[] = [];

  for (const block of blocks) {
    const extractor = extractors[block.type];
    if (extractor) {
      const blockText = extractor(block);
      if (blockText) {
        textParts.push(blockText);
      }
    }
    // Skip unsupported block types
  }

  return textParts.join('\n\n');
}

/**
 * Block text extraction strategies
 * Strategy pattern for extracting text from different block types
 */

import type { NotionBlock } from './types.js';
import { formatNotionRichText } from './rich-text-formatter.js';

/**
 * Type guards for block types
 */
function isParagraphBlock(
  block: NotionBlock,
): block is Extract<NotionBlock, { type: 'paragraph' }> {
  return block.type === 'paragraph';
}

function isHeading1Block(block: NotionBlock): block is Extract<NotionBlock, { type: 'heading_1' }> {
  return block.type === 'heading_1';
}

function isHeading2Block(block: NotionBlock): block is Extract<NotionBlock, { type: 'heading_2' }> {
  return block.type === 'heading_2';
}

function isHeading3Block(block: NotionBlock): block is Extract<NotionBlock, { type: 'heading_3' }> {
  return block.type === 'heading_3';
}

function isBulletedListBlock(
  block: NotionBlock,
): block is Extract<NotionBlock, { type: 'bulleted_list_item' }> {
  return block.type === 'bulleted_list_item';
}

function isNumberedListBlock(
  block: NotionBlock,
): block is Extract<NotionBlock, { type: 'numbered_list_item' }> {
  return block.type === 'numbered_list_item';
}

function isToDoBlock(block: NotionBlock): block is Extract<NotionBlock, { type: 'to_do' }> {
  return block.type === 'to_do';
}

function isToggleBlock(block: NotionBlock): block is Extract<NotionBlock, { type: 'toggle' }> {
  return block.type === 'toggle';
}

function isQuoteBlock(block: NotionBlock): block is Extract<NotionBlock, { type: 'quote' }> {
  return block.type === 'quote';
}

function isCodeBlock(block: NotionBlock): block is Extract<NotionBlock, { type: 'code' }> {
  return block.type === 'code';
}

/**
 * Extract text from specific block types
 */
function extractParagraphText(block: NotionBlock): string {
  if (!isParagraphBlock(block)) return '';
  return formatNotionRichText(block.paragraph.rich_text);
}

function extractHeading1Text(block: NotionBlock): string {
  if (!isHeading1Block(block)) return '';
  return `# ${formatNotionRichText(block.heading_1.rich_text)}`;
}

function extractHeading2Text(block: NotionBlock): string {
  if (!isHeading2Block(block)) return '';
  return `## ${formatNotionRichText(block.heading_2.rich_text)}`;
}

function extractHeading3Text(block: NotionBlock): string {
  if (!isHeading3Block(block)) return '';
  return `### ${formatNotionRichText(block.heading_3.rich_text)}`;
}

function extractBulletedListText(block: NotionBlock): string {
  if (!isBulletedListBlock(block)) return '';
  return `• ${formatNotionRichText(block.bulleted_list_item.rich_text)}`;
}

function extractNumberedListText(block: NotionBlock): string {
  if (!isNumberedListBlock(block)) return '';
  return `1. ${formatNotionRichText(block.numbered_list_item.rich_text)}`;
}

function extractToDoText(block: NotionBlock): string {
  if (!isToDoBlock(block)) return '';
  const checkbox = block.to_do.checked ? '[x]' : '[ ]';
  return `${checkbox} ${formatNotionRichText(block.to_do.rich_text)}`;
}

function extractToggleText(block: NotionBlock): string {
  if (!isToggleBlock(block)) return '';
  return `▸ ${formatNotionRichText(block.toggle.rich_text)}`;
}

function extractQuoteText(block: NotionBlock): string {
  if (!isQuoteBlock(block)) return '';
  return `> ${formatNotionRichText(block.quote.rich_text)}`;
}

function extractCodeText(block: NotionBlock): string {
  if (!isCodeBlock(block)) return '';
  const lang = block.code.language;
  const code = formatNotionRichText(block.code.rich_text);
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Map of block type to extraction function
 */
const blockExtractors: Record<string, (block: NotionBlock) => string> = {
  paragraph: extractParagraphText,
  heading_1: extractHeading1Text,
  heading_2: extractHeading2Text,
  heading_3: extractHeading3Text,
  bulleted_list_item: extractBulletedListText,
  numbered_list_item: extractNumberedListText,
  to_do: extractToDoText,
  toggle: extractToggleText,
  quote: extractQuoteText,
  code: extractCodeText,
};

/**
 * Extracts plain text content from Notion blocks
 * Pure function using type guards for safety
 */
export function extractTextFromNotionBlocks(blocks: NotionBlock[]): string {
  const textParts: string[] = [];

  for (const block of blocks) {
    const extractor = blockExtractors[block.type];
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

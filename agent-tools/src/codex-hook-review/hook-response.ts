/** Bounded normalization for Claude PostToolBatch response representations. */
import { Buffer } from 'node:buffer';

import { isPlainObject } from '../core/json-narrowing.js';

export type NormalizedToolResponse =
  | { readonly kind: 'supported'; readonly text: string }
  | { readonly kind: 'unsupported' };

const MAX_CONTENT_BLOCKS = 8;
const MAX_TEXT_BYTES = 16 * 1024;

interface RawTextContentBlock {
  readonly type?: unknown;
  readonly text?: unknown;
}

const isRawTextContentBlock = (value: unknown): value is RawTextContentBlock =>
  isPlainObject(value);

/** Normalize a documented serialized string or bounded text content-block array. */
export function normalizeToolResponse(value: unknown): NormalizedToolResponse {
  if (typeof value === 'string') {
    return { kind: 'supported', text: value };
  }
  return isBoundedContentBlockArray(value)
    ? normalizeContentBlocks(value)
    : { kind: 'unsupported' };
}

function isBoundedContentBlockArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value) && value.length <= MAX_CONTENT_BLOCKS;
}

function normalizeContentBlocks(blocks: readonly unknown[]): NormalizedToolResponse {
  const parts: string[] = [];
  let byteLength = 0;
  for (const block of blocks) {
    const text = contentBlockText(block);
    if (text === undefined) {
      return { kind: 'unsupported' };
    }
    byteLength += Buffer.byteLength(text, 'utf8') + separatorBytes(parts);
    if (byteLength > MAX_TEXT_BYTES) {
      return { kind: 'unsupported' };
    }
    parts.push(text);
  }
  return { kind: 'supported', text: parts.join('\n') };
}

function contentBlockText(block: unknown): string | undefined {
  if (!isRawTextContentBlock(block) || block.type !== 'text' || typeof block.text !== 'string') {
    return undefined;
  }
  return block.text;
}

function separatorBytes(parts: readonly string[]): 0 | 1 {
  return parts.length === 0 ? 0 : 1;
}

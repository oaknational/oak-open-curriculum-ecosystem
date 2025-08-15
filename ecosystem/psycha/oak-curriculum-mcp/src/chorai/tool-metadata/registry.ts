/**
 * Tool metadata registry
 * Central registry for tool metadata and categorization
 */

import type { ToolDecoration } from './types';
import { TOOL_DECORATIONS } from './tool-decorations';

/**
 * Tool categories for grouping related tools
 */
export const TOOL_CATEGORIES = [
  'metadata',
  'content',
  'assessment',
  'planning',
  'resources',
  'search',
] as const;

/**
 * Main tool metadata registry
 */
export const TOOL_METADATA = TOOL_DECORATIONS;

/**
 * Composite tools (currently empty, for future use)
 */
export const COMPOSITE_TOOLS = {} as const;

/**
 * Get metadata for a specific tool by operationId
 */
export function getToolMetadata(operationId: string): ToolDecoration | undefined {
  return TOOL_METADATA[operationId];
}

/**
 * Get all tools in a specific category
 */
export function getToolsByCategory(category: string): string[] {
  return Object.entries(TOOL_METADATA)
    .filter(([, metadata]) => metadata.category === category)
    .map(([operationId]) => operationId);
}

/**
 * Get all tools with a specific tag
 */
export function getToolsByTag(tag: string): string[] {
  return Object.entries(TOOL_METADATA)
    .filter(([, metadata]) => metadata.tags?.includes(tag))
    .map(([operationId]) => operationId);
}

/**
 * Main registry export
 */
export const toolMetadataRegistry = {
  categories: TOOL_CATEGORIES,
  metadata: TOOL_METADATA,
  compositeTools: COMPOSITE_TOOLS,
  getToolMetadata,
  getToolsByCategory,
  getToolsByTag,
};

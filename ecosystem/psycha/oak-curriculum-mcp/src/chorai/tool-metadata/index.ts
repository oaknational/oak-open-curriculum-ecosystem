/**
 * Tool metadata module exports
 * Central export point for tool metadata registry and types
 */

// Export types explicitly
export type {
  ToolCategory,
  ToolExample,
  RateLimitConfig,
  ToolComplexity,
  ToolMetadata,
  ToolGenerationConfig,
  GeneratedTool,
} from './types';

// Export registry functions and constants explicitly
export {
  TOOL_CATEGORIES,
  TOOL_METADATA,
  COMPOSITE_TOOLS,
  getToolMetadata,
  getToolsByCategory,
  getToolsByTag,
  toolMetadataRegistry,
} from './registry';

// Re-export main registry for convenience
export { toolMetadataRegistry as default } from './registry';

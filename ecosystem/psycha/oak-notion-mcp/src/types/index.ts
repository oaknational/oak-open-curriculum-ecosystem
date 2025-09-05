export type {
  McpPropertyFilter,
  McpSort,
  McpFilters,
  NotionDatabaseQuery,
  SearchOptions,
  NotionSearchQuery,
  ValidationResult,
} from '../integrations/notion/query-building/types';

export type { MinimalNotionClient } from './notion-types/notion-client';
export type { NotionOperations } from './notion-contracts/notion-operations';
export type { NotionDependencies, NotionServerDependencies } from './notion-types/dependencies';

// Public tool types
export type { McpTool, McpToolResult } from '../tools/types';

// Domain/resource types used by transformers
export type { Resource } from '@modelcontextprotocol/sdk/types.js';
export type {
  McpResource,
  NotionRichText,
  NotionBlock,
  EmailScrubber,
} from '../integrations/notion/transformers/types';

// Tools core and public types
export type {
  ToolExecutor,
  ToolDefinition,
  ErrorContext,
  ErrorHandler,
  ToolResult as CoreToolResult,
  ToolLogger,
  ToolFactory,
  ToolRegistry as CoreToolRegistry,
} from '../tools/tools/core/types';

export type {
  ToolResult,
  ToolHandler,
  NotionSearchHandler,
  NotionListDatabasesHandler,
  NotionQueryDatabaseHandler,
  NotionGetPageHandler,
  NotionListUsersHandler,
  ToolConfig,
  ToolTuple,
  ToolSchemaMap,
} from '../tools/tools/types';

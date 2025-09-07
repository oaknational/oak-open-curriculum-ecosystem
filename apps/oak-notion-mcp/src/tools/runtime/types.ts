import type { z } from 'zod';
import type {
  notionSearchSchema,
  notionListDatabasesSchema,
  notionQueryDatabaseSchema,
  notionGetPageSchema,
  notionListUsersSchema,
} from './schemas';

// Tool handler result type matching MCP SDK expectations
export interface ToolResult {
  content: {
    type: 'text';
    text: string;
  }[];
}

// Tool handler function type
export type ToolHandler<TSchema extends z.ZodSchema> = (
  args: z.infer<TSchema>,
  extra: unknown,
) => Promise<ToolResult>;

// Specific handler types for each tool
export type NotionSearchHandler = ToolHandler<typeof notionSearchSchema>;
export type NotionListDatabasesHandler = ToolHandler<typeof notionListDatabasesSchema>;
export type NotionQueryDatabaseHandler = ToolHandler<typeof notionQueryDatabaseSchema>;
export type NotionGetPageHandler = ToolHandler<typeof notionGetPageSchema>;
export type NotionListUsersHandler = ToolHandler<typeof notionListUsersSchema>;

// Tool configuration type
export interface ToolConfig<TSchema extends z.ZodType> {
  title: string;
  description: string;
  inputSchema: TSchema;
}

// Tool tuple type for McpServer.registerTool
export type ToolTuple<TSchema extends z.ZodType> = [
  name: string,
  config: ToolConfig<TSchema>,
  handler: ToolHandler<TSchema>,
];

// Map of tool names to their schemas
export interface ToolSchemaMap {
  'notion-search': typeof notionSearchSchema;
  'notion-list-databases': typeof notionListDatabasesSchema;
  'notion-query-database': typeof notionQueryDatabaseSchema;
  'notion-get-page': typeof notionGetPageSchema;
  'notion-list-users': typeof notionListUsersSchema;
}

// Tool registry type
export type ToolRegistry = {
  [K in keyof ToolSchemaMap]: ToolTuple<ToolSchemaMap[K]>;
};

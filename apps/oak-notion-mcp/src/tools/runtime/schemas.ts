import { z } from 'zod';

// Schema for notion-search tool
export const notionSearchSchema = z.object({
  query: z.string().min(1).describe('The search query'),
  filter: z
    .object({
      type: z.enum(['page', 'database', 'data_source']).describe('Filter results by type'),
    })
    .optional(),
  sort: z
    .object({
      timestamp: z.enum(['last_edited_time']).describe('Sort by timestamp'),
      direction: z.enum(['ascending', 'descending']).describe('Sort direction'),
    })
    .optional(),
});

// Schema for notion-list-databases tool
export const notionListDatabasesSchema = z.object({});

// Schema for notion-query-database tool
export const notionQueryDatabaseSchema = z.object({
  database_id: z.string().describe('The ID of the database to query'),
  filter: z
    .record(z.string(), z.unknown())
    .describe('Filter conditions (Notion filter format)')
    .optional(),
  sorts: z
    .array(
      z.object({
        property: z.string(),
        direction: z.enum(['ascending', 'descending']),
      }),
    )
    .describe('Sort criteria')
    .optional(),
  page_size: z
    .number()
    .int()
    .min(1)
    .max(100)
    .describe('Number of results per page (1-100)')
    .optional(),
  start_cursor: z.string().describe('Pagination cursor').optional(),
});

// Schema for notion-get-page tool
export const notionGetPageSchema = z.object({
  page_id: z.string().describe('The ID of the page to retrieve'),
  include_content: z.boolean().default(false).describe('Include page content (blocks)').optional(),
});

// Schema for notion-list-users tool
export const notionListUsersSchema = z.object({});

// Export inferred types
export type NotionSearchInput = z.infer<typeof notionSearchSchema>;
export type NotionListDatabasesInput = z.infer<typeof notionListDatabasesSchema>;
export type NotionQueryDatabaseInput = z.infer<typeof notionQueryDatabaseSchema>;
export type NotionGetPageInput = z.infer<typeof notionGetPageSchema>;
export type NotionListUsersInput = z.infer<typeof notionListUsersSchema>;

// Type map for all tools
export interface ToolInputMap {
  'notion-search': NotionSearchInput;
  'notion-list-databases': NotionListDatabasesInput;
  'notion-query-database': NotionQueryDatabaseInput;
  'notion-get-page': NotionGetPageInput;
  'notion-list-users': NotionListUsersInput;
}

export type ToolName = keyof ToolInputMap;

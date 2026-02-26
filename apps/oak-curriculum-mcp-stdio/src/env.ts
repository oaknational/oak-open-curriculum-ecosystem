/**
 * Environment schema for the STDIO MCP server.
 *
 * Composes shared schemas from `@oaknational/env` with app-specific
 * fields. This schema is passed to `resolveEnv` from
 * `@oaknational/env-resolution` to load, merge, and validate
 * environment variables from `.env` files and `process.env`.
 *
 * @see StdioEnvSchema for the composed schema
 * @see loadRuntimeConfig in `./runtime-config.ts` for the resolution pipeline
 */

import { z } from 'zod';
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema, LoggingEnvSchema } from '@oaknational/env';

/**
 * Zod schema for the STDIO MCP server environment.
 *
 * Composed from:
 * - `OakApiKeyEnvSchema` — `OAK_API_KEY` (required)
 * - `ElasticsearchEnvSchema` — `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY` (required)
 * - `LoggingEnvSchema` — `LOG_LEVEL`, `NODE_ENV`, `ENVIRONMENT_OVERRIDE` (optional)
 * - App-specific fields for stub tools and logger sink configuration
 */
export const StdioEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend({
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: z.enum(['true', 'false']).optional(),
    MCP_LOGGER_STDOUT: z.string().optional(),
    MCP_LOGGER_FILE_PATH: z.string().optional(),
    MCP_LOGGER_FILE_APPEND: z.string().optional(),
  });

/** Validated environment for the STDIO MCP server. */
export type StdioEnv = z.infer<typeof StdioEnvSchema>;

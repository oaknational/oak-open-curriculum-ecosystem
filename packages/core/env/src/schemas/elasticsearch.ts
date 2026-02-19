import { z } from 'zod';

/**
 * Contract schema for Elasticsearch connectivity.
 *
 * Import and merge this schema when your app requires Elasticsearch.
 * MCP servers use the full schema — credentials are required at
 * startup (fail-fast). Applications that do not require Elasticsearch
 * may use `.partial()` if needed.
 *
 * @example MCP servers (required — server fails at startup if absent)
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape);
 * ```
 *
 * @example Other applications (optional)
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema
 *   .extend(ElasticsearchEnvSchema.partial().shape);
 * ```
 */
export const ElasticsearchEnvSchema = z.object({
  ELASTICSEARCH_URL: z.string().min(1, 'ELASTICSEARCH_URL is required'),
  ELASTICSEARCH_API_KEY: z.string().min(1, 'ELASTICSEARCH_API_KEY is required'),
});

export type ElasticsearchEnv = z.infer<typeof ElasticsearchEnvSchema>;

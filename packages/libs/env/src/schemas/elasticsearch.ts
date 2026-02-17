import { z } from 'zod';

/**
 * Contract schema for Elasticsearch connectivity.
 *
 * Import and merge this schema when your app requires Elasticsearch.
 * Use `.partial()` when Elasticsearch is optional (e.g. search tools
 * are disabled when credentials are absent).
 *
 * @example Required
 * ```typescript
 * const AppEnv = ElasticsearchEnvSchema.extend(OakApiKeyEnvSchema.shape);
 * ```
 *
 * @example Optional (search features disabled when absent)
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

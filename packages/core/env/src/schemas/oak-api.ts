import { z } from 'zod';

/**
 * Contract schema for Oak API authentication.
 *
 * Import and merge this schema when your app requires access to the
 * Oak National Academy curriculum API.
 *
 * @example Required
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema.extend({ MY_VAR: z.string() });
 * ```
 *
 * @example Combined with other contracts
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema
 *   .extend(ElasticsearchEnvSchema.partial().shape)
 *   .extend(LoggingEnvSchema.shape);
 * ```
 */
export const OakApiKeyEnvSchema = z.object({
  OAK_API_KEY: z.string().min(1, 'OAK_API_KEY is required'),
});

export type OakApiKeyEnv = z.infer<typeof OakApiKeyEnvSchema>;

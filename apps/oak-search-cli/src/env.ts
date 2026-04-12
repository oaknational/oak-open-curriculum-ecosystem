/**
 * Environment schema for the Search CLI.
 *
 * Composes shared schemas from `@oaknational/env` with CLI-specific
 * fields. Overrides shared fields where the CLI requires stricter
 * validation (e.g. `z.url()` for ES URL, `min(10)` for ES API key).
 *
 * @see SearchCliEnvSchema for the composed schema
 * @see loadRuntimeConfig in `./runtime-config.ts` for the resolution pipeline
 */

import { z } from 'zod';
import {
  OakApiKeyEnvSchema,
  ElasticsearchEnvSchema,
  LoggingEnvSchema,
  BulkDataEnvSchema,
  SentryEnvSchema,
} from '@oaknational/env';

const CLI_LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error'] as const;

/**
 * Zod schema for the Search CLI environment (base, before superRefine).
 *
 * Composed from shared schemas with CLI-specific overrides and extensions.
 */
const SearchCliBaseEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(BulkDataEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend(SentryEnvSchema.shape)
  .extend({
    ELASTICSEARCH_URL: z.url(),
    ELASTICSEARCH_API_KEY: z.string().min(10),
    OAK_API_KEY: z.string().min(6).optional(),
    SEARCH_API_KEY: z.string().min(10),
    SEARCH_INDEX_VERSION: z
      .string()
      .regex(
        /^v[0-9A-Za-z._-]+$/,
        'SEARCH_INDEX_VERSION must start with v and contain version characters.',
      )
      .optional()
      .default('v0-unversioned'),
    ZERO_HIT_WEBHOOK_URL: z.union([z.literal('none'), z.url()]).default('none'),
    LOG_LEVEL: z.enum(CLI_LOG_LEVELS).default('info'),
    SEARCH_INDEX_TARGET: z.enum(['primary', 'sandbox']).default('primary'),
    ZERO_HIT_PERSISTENCE_ENABLED: z
      .union([z.literal('true'), z.literal('false'), z.boolean()])
      .default('false')
      .transform((value) => value === true || value === 'true'),
    ZERO_HIT_INDEX_RETENTION_DAYS: z.coerce.number().int().min(7).max(365).default(30),
    SDK_CACHE_ENABLED: z
      .union([z.literal('true'), z.literal('false'), z.boolean()])
      .default('false')
      .transform((value) => value === true || value === 'true'),
    SDK_CACHE_REDIS_URL: z.string().default('redis://localhost:6379'),
    SDK_CACHE_TTL_DAYS: z.coerce.number().int().min(1).max(60).default(14),
  });

/**
 * Full Search CLI env schema with runtime validation.
 *
 * Uses `superRefine` to enforce that `OAK_API_KEY` is present at runtime
 * (the field is `optional()` in the base schema to allow schema composition).
 */
export const SearchCliEnvSchema = SearchCliBaseEnvSchema.superRefine((value, ctx) => {
  if (!value.OAK_API_KEY) {
    ctx.addIssue({ code: 'custom', message: 'Set OAK_API_KEY.' });
  }
});

/** Validated environment for the Search CLI. */
export type SearchCliEnv = z.infer<typeof SearchCliEnvSchema>;

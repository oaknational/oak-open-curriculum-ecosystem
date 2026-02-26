/**
 * Legacy environment validation for the Search CLI.
 *
 * The canonical schemas live in `src/env.ts` (SearchCliEnvSchema) and
 * environment loading uses `resolveEnv` via `src/runtime-config.ts`.
 *
 * This file retains:
 * - `parseEnv()` — pure validation function used in tests
 * - `childProcessEnv()` — shallow copy of process.env for child spawns
 * - Schema exports for backward compatibility with existing test fixtures
 */

import { z } from 'zod';

/** Strict runtime env validation for semantic search workspace. */
export const BaseEnvSchema = z.object({
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
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
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

export const EnvSchema = BaseEnvSchema.superRefine((value, ctx) => {
  if (!value.OAK_API_KEY) {
    ctx.addIssue({ code: 'custom', message: 'Set OAK_API_KEY.' });
  }
});

export type Env = z.infer<typeof EnvSchema>;

type EnvResult = Env & { OAK_EFFECTIVE_KEY: string };

/**
 * Return a shallow copy of `process.env` for forwarding to child
 * process spawns (e.g. benchmark subprocesses, admin orchestration).
 */
export function childProcessEnv(): NodeJS.ProcessEnv {
  return { ...process.env };
}

/** Validate a raw env record against the schema. Exported for direct unit testing. */
export function parseEnv(raw: Record<string, string | undefined>): EnvResult {
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  const key = parsed.data.OAK_API_KEY;
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Set OAK_API_KEY.');
  }
  return { ...parsed.data, OAK_EFFECTIVE_KEY: key };
}

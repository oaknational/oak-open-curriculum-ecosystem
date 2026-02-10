import { z } from 'zod';

/** Strict runtime env validation for semantic search workspace. */
export const BaseEnvSchema = z.object({
  ELASTICSEARCH_URL: z.url(),
  ELASTICSEARCH_API_KEY: z.string().min(10),
  OAK_API_KEY: z.string().min(6).optional(),
  SEARCH_API_KEY: z.string().min(10),
  // SEARCH_INDEX_VERSION is optional - prefer reading from ES oak_meta index
  // If set, it's used as a fallback when ES metadata is unavailable
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
  // SDK Response Caching (development only)
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
 * process spawns. This is the ONLY export (alongside `readProcessEnv`)
 * that accesses `process.env` — all other code must use {@link env}.
 */
export function childProcessEnv(): NodeJS.ProcessEnv {
  return { ...process.env };
}

function readProcessEnv(): Record<string, string | undefined> {
  return {
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
    OAK_API_KEY: process.env.OAK_API_KEY,
    SEARCH_API_KEY: process.env.SEARCH_API_KEY,
    SEARCH_INDEX_VERSION: process.env.SEARCH_INDEX_VERSION,
    ZERO_HIT_WEBHOOK_URL: process.env.ZERO_HIT_WEBHOOK_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    SEARCH_INDEX_TARGET: process.env.SEARCH_INDEX_TARGET,
    ZERO_HIT_PERSISTENCE_ENABLED: process.env.ZERO_HIT_PERSISTENCE_ENABLED,
    ZERO_HIT_INDEX_RETENTION_DAYS: process.env.ZERO_HIT_INDEX_RETENTION_DAYS,
    SDK_CACHE_ENABLED: process.env.SDK_CACHE_ENABLED,
    SDK_CACHE_REDIS_URL: process.env.SDK_CACHE_REDIS_URL,
    SDK_CACHE_TTL_DAYS: process.env.SDK_CACHE_TTL_DAYS,
  };
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

/**
 * Parse and validate environment configuration.
 *
 * When called without arguments, reads from `process.env` via the internal
 * `readProcessEnv()` helper. Pass a raw env record to bypass `process.env`
 * entirely — this is the required pattern for tests (no global state mutation).
 */
export function env(rawEnv: Record<string, string | undefined> = readProcessEnv()): EnvResult {
  return parseEnv(rawEnv);
}

/**
 * Attempt to parse environment configuration, returning `null` on failure.
 *
 * Accepts the same optional raw env parameter as {@link env}.
 */
export function optionalEnv(
  rawEnv: Record<string, string | undefined> = readProcessEnv(),
): EnvResult | null {
  try {
    return env(rawEnv);
  } catch {
    return null;
  }
}

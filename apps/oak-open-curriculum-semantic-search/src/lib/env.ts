import { z } from 'zod';

/** Strict runtime env validation aligned with Next.js defaults. */
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
  AI_PROVIDER: z.enum(['openai', 'none']).default('openai'),
  OPENAI_API_KEY: z.string().min(10).optional(),
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
  if (
    value.AI_PROVIDER === 'openai' &&
    (!value.OPENAI_API_KEY || value.OPENAI_API_KEY.length < 10)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'OPENAI_API_KEY is required when AI_PROVIDER=openai.',
    });
  }
});

export type Env = z.infer<typeof EnvSchema>;

type EnvResult = Env & { OAK_EFFECTIVE_KEY: string };

function readProcessEnv(): Record<string, string | undefined> {
  return {
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
    OAK_API_KEY: process.env.OAK_API_KEY,
    SEARCH_API_KEY: process.env.SEARCH_API_KEY,
    SEARCH_INDEX_VERSION: process.env.SEARCH_INDEX_VERSION,
    ZERO_HIT_WEBHOOK_URL: process.env.ZERO_HIT_WEBHOOK_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    AI_PROVIDER: process.env.AI_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SEARCH_INDEX_TARGET: process.env.SEARCH_INDEX_TARGET,
    ZERO_HIT_PERSISTENCE_ENABLED: process.env.ZERO_HIT_PERSISTENCE_ENABLED,
    ZERO_HIT_INDEX_RETENTION_DAYS: process.env.ZERO_HIT_INDEX_RETENTION_DAYS,
    SDK_CACHE_ENABLED: process.env.SDK_CACHE_ENABLED,
    SDK_CACHE_REDIS_URL: process.env.SDK_CACHE_REDIS_URL,
    SDK_CACHE_TTL_DAYS: process.env.SDK_CACHE_TTL_DAYS,
  };
}

function parseEnv(raw: Record<string, string | undefined>): EnvResult {
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

export function env(): EnvResult {
  return parseEnv(readProcessEnv());
}

export function optionalEnv(): EnvResult | null {
  try {
    return env();
  } catch {
    return null;
  }
}

/** True when natural-language parsing (OpenAI) is available. */
export function llmEnabled(): boolean {
  const current = env();
  return (
    current.AI_PROVIDER === 'openai' &&
    typeof current.OPENAI_API_KEY === 'string' &&
    current.OPENAI_API_KEY.length > 0
  );
}

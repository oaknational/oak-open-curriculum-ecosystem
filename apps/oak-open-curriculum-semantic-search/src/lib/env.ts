import { createAdaptiveEnvironment, loadRootEnv } from '@oaknational/mcp-env';
import type { EnvironmentProvider } from '@oaknational/mcp-env';
import { z } from 'zod';

/** Strict runtime env validation (no unsafe process.env). */
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
    ),
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
});

export const EnvSchema = BaseEnvSchema.superRefine((v, ctx) => {
  if (!v.OAK_API_KEY) {
    ctx.addIssue({ code: 'custom', message: 'Set OAK_API_KEY.' });
  }
  if (v.AI_PROVIDER === 'openai' && (!v.OPENAI_API_KEY || v.OPENAI_API_KEY.length < 10)) {
    ctx.addIssue({
      code: 'custom',
      message: 'OPENAI_API_KEY is required when AI_PROVIDER=openai.',
    });
  }
});

export type Env = z.infer<typeof EnvSchema>;

type EnvResult = Env & { OAK_EFFECTIVE_KEY: string };

interface EnvOptions {
  provider?: EnvironmentProvider;
}

const REQUIRED_ENV_KEYS = [
  'ELASTICSEARCH_URL',
  'ELASTICSEARCH_API_KEY',
  'OAK_API_KEY',
  'SEARCH_API_KEY',
  'SEARCH_INDEX_VERSION',
] as const;

let defaultProvider: EnvironmentProvider | null = null;
let cachedDefaultEnv: EnvResult | null = null;

function ensureDefaultProvider(): EnvironmentProvider {
  if (!defaultProvider) {
    defaultProvider = createAdaptiveEnvironment(globalThis);
  }
  return defaultProvider;
}

function refreshDefaultProvider(): void {
  defaultProvider = createAdaptiveEnvironment(globalThis);
  cachedDefaultEnv = null;
}

function providerHasRequiredKeys(provider: EnvironmentProvider): boolean {
  for (const key of REQUIRED_ENV_KEYS) {
    if (!provider.has(key)) {
      return false;
    }
  }
  return true;
}

function getProvider(options?: EnvOptions): EnvironmentProvider {
  if (options && options.provider) {
    return options.provider;
  }
  let provider = ensureDefaultProvider();
  if (!providerHasRequiredKeys(provider)) {
    loadRootEnv({
      startDir: process.cwd(),
      requiredKeys: [...REQUIRED_ENV_KEYS],
      env: provider.getAll(),
    });
    refreshDefaultProvider();
    provider = ensureDefaultProvider();
  }
  return provider;
}

function parseEnvFromProvider(provider: EnvironmentProvider): EnvResult {
  const parsed = EnvSchema.safeParse({
    ELASTICSEARCH_URL: provider.get('ELASTICSEARCH_URL'),
    ELASTICSEARCH_API_KEY: provider.get('ELASTICSEARCH_API_KEY'),
    OAK_API_KEY: provider.get('OAK_API_KEY'),
    SEARCH_API_KEY: provider.get('SEARCH_API_KEY'),
    SEARCH_INDEX_VERSION: provider.get('SEARCH_INDEX_VERSION'),
    ZERO_HIT_WEBHOOK_URL: provider.get('ZERO_HIT_WEBHOOK_URL'),
    LOG_LEVEL: provider.get('LOG_LEVEL') ?? 'info',
    AI_PROVIDER: provider.get('AI_PROVIDER') ?? 'openai',
    OPENAI_API_KEY: provider.get('OPENAI_API_KEY'),
    SEARCH_INDEX_TARGET: provider.get('SEARCH_INDEX_TARGET'),
    ZERO_HIT_PERSISTENCE_ENABLED: provider.get('ZERO_HIT_PERSISTENCE_ENABLED'),
    ZERO_HIT_INDEX_RETENTION_DAYS: provider.get('ZERO_HIT_INDEX_RETENTION_DAYS'),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  const key = parsed.data.OAK_API_KEY;
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Set OAK_API_KEY.');
  }
  return { ...parsed.data, OAK_EFFECTIVE_KEY: key };
}

export function env(options?: EnvOptions): EnvResult {
  const provider = getProvider(options);
  const useCache = !options || !options.provider;
  if (useCache && cachedDefaultEnv) {
    return cachedDefaultEnv;
  }
  const result = parseEnvFromProvider(provider);
  if (useCache) {
    cachedDefaultEnv = result;
  }
  return result;
}

export function optionalEnv(options?: EnvOptions): EnvResult | null {
  try {
    return env(options);
  } catch {
    return null;
  }
}

/** True when natural-language parsing (OpenAI) is available. */
export function llmEnabled(options?: EnvOptions): boolean {
  const current = env(options);
  return (
    current.AI_PROVIDER === 'openai' &&
    typeof current.OPENAI_API_KEY === 'string' &&
    current.OPENAI_API_KEY.length > 0
  );
}

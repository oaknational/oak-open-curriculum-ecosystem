import { z } from 'zod';

/** Strict runtime env validation (no unsafe process.env). */
const BaseEnvSchema = z.object({
  ELASTICSEARCH_URL: z.url(),
  ELASTICSEARCH_API_KEY: z.string().min(10),
  OAK_API_KEY: z.string().min(6).optional(),
  SEARCH_API_KEY: z.string().min(10),
  AI_PROVIDER: z.enum(['openai', 'none']).default('openai'),
  OPENAI_API_KEY: z.string().min(10).optional(),
});

const EnvSchema = BaseEnvSchema.superRefine((v, ctx) => {
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
let cached: (Env & { OAK_EFFECTIVE_KEY: string }) | null = null;

export function env(): Env & { OAK_EFFECTIVE_KEY: string } {
  if (cached) {
    return cached;
  }
  const parsed = EnvSchema.safeParse({
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
    OAK_API_KEY: process.env.OAK_API_KEY,
    SEARCH_API_KEY: process.env.SEARCH_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER ?? 'openai',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  const key = parsed.data.OAK_API_KEY ?? '';
  cached = Object.assign(parsed.data, { OAK_EFFECTIVE_KEY: key });
  return cached;
}

/** True when natural-language parsing (OpenAI) is available. */
export function llmEnabled(): boolean {
  const e = env();
  return (
    e.AI_PROVIDER === 'openai' &&
    typeof e.OPENAI_API_KEY === 'string' &&
    e.OPENAI_API_KEY.length > 0
  );
}

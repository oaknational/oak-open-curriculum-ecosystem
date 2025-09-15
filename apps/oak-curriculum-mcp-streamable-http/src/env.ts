import { z } from 'zod';

const ModeSchema = z.enum(['stateless', 'session']).default('stateless');

const EnvSchema = z.object({
  OAK_API_KEY: z.string().min(1, 'OAK_API_KEY is required'),
  REMOTE_MCP_MODE: ModeSchema.optional(),
  REMOTE_MCP_DEV_TOKEN: z.string().optional(),
  REMOTE_MCP_CI_TOKEN: z.string().optional(),
  REMOTE_MCP_ALLOW_NO_AUTH: z.enum(['true', 'false']).optional(),
  DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
  ALLOWED_HOSTS: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info').optional(),
  NODE_ENV: z.string().optional(),
  // Auth (AS/RS)
  BASE_URL: z.string().url().optional(),
  MCP_CANONICAL_URI: z.string().url().optional(),
  OIDC_ISSUER: z.string().url().default('https://accounts.google.com').optional(),
  OIDC_CLIENT_ID: z.string().optional(),
  OIDC_REDIRECT_URI: z.string().url().optional(),
  ALLOWED_DOMAIN: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  ENABLE_LOCAL_AS: z.enum(['true', 'false']).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function readEnv(env: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join('; ');
    throw new Error(`Invalid environment: ${message}`);
  }
  return parsed.data;
}

export function parseCsv(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

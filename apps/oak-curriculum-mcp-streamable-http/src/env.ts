import { z } from 'zod';

const ModeSchema = z.enum(['stateless', 'session']).default('stateless');

const EnvSchema = z.object({
  OAK_API_KEY: z.string().min(1, 'OAK_API_KEY is required'),
  // Clerk Authentication
  CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY required'),
  // MCP Server Configuration
  BASE_URL: z.url().optional(),
  MCP_CANONICAL_URI: z.url().optional(),
  // Transport Mode
  REMOTE_MCP_MODE: ModeSchema.optional(),
  // Security & Development
  DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
  ALLOWED_HOSTS: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info').optional(),
  NODE_ENV: z.string().optional(),
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
  if (!value) {
    return undefined;
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

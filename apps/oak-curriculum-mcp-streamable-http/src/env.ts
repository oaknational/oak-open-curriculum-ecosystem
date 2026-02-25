import { z } from 'zod';
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema, LoggingEnvSchema } from '@oaknational/env';

const ModeSchema = z.enum(['stateless', 'session']).default('stateless');

/**
 * Derives BASE_URL from Vercel system environment variables if not explicitly set.
 *
 * Priority:
 * 1. Explicit BASE_URL (if valid URL)
 * 2. VERCEL_URL (with https:// prefix)
 * 3. undefined (will be derived from request host at runtime)
 *
 * Note: This function uses only VERCEL_URL for BASE_URL derivation. The security
 * configuration (DNS rebinding protection and CORS) separately uses all three Vercel
 * URL variables (VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL) to
 * allow access from all deployment URLs.
 *
 * @param env - Environment variables object
 * @returns Derived base URL or undefined
 * @see https://vercel.com/docs/environment-variables/system-environment-variables
 */
function deriveBaseUrl(env: NodeJS.ProcessEnv): string | undefined {
  const explicit = env.BASE_URL;
  if (explicit && explicit !== '' && explicit !== '/' && !explicit.startsWith('/')) {
    return explicit;
  }

  const vercelUrl = env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return undefined;
}

/**
 * Derives MCP_CANONICAL_URI from BASE_URL + /mcp suffix.
 */
function deriveMcpCanonicalUri(
  env: NodeJS.ProcessEnv,
  baseUrl: string | undefined,
): string | undefined {
  const explicit = env.MCP_CANONICAL_URI;
  if (explicit && explicit !== '' && explicit !== '/' && !explicit.startsWith('/')) {
    return explicit;
  }

  if (baseUrl) {
    return `${baseUrl}/mcp`;
  }

  return undefined;
}

const CorsModeSchema = z.enum(['allow_all', 'explicit', 'automatic']).default('automatic');

/**
 * Base shape for the HTTP server environment.
 *
 * Clerk keys are optional in the base shape; conditional requirement is
 * enforced via `superRefine` on the final `HttpEnvSchema`.
 */
const BaseEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend({
    CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
    CLERK_SECRET_KEY: z.string().min(1).optional(),
    BASE_URL: z.url().optional(),
    MCP_CANONICAL_URI: z.url().optional(),
    PORT: z.string().optional(),
    REMOTE_MCP_MODE: ModeSchema.optional(),
    DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: z.enum(['true', 'false']).optional(),
    ALLOWED_HOSTS: z.string().optional(),
    ALLOWED_ORIGINS: z.string().optional(),
    CORS_MODE: CorsModeSchema.optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_BRANCH_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  });

/**
 * HTTP server environment schema with conditional Clerk key requirement.
 *
 * When `DANGEROUSLY_DISABLE_AUTH` is `'true'`, Clerk keys are optional.
 * Otherwise, both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required.
 */
export const HttpEnvSchema = BaseEnvSchema.superRefine((data, ctx) => {
  if (data.DANGEROUSLY_DISABLE_AUTH === 'true') {
    return;
  }

  if (!data.CLERK_PUBLISHABLE_KEY) {
    ctx.addIssue({
      code: 'custom',
      path: ['CLERK_PUBLISHABLE_KEY'],
      message: 'CLERK_PUBLISHABLE_KEY is required when auth is enabled',
    });
  }

  if (!data.CLERK_SECRET_KEY) {
    ctx.addIssue({
      code: 'custom',
      path: ['CLERK_SECRET_KEY'],
      message: 'CLERK_SECRET_KEY is required when auth is enabled',
    });
  }
});

/** Environment with auth enabled — Clerk keys guaranteed present */
export type AuthEnabledEnv = Env & {
  readonly CLERK_PUBLISHABLE_KEY: string;
  readonly CLERK_SECRET_KEY: string;
};

/** Environment with auth disabled — Clerk keys may be absent */
export type AuthDisabledEnv = Env;

export type Env = z.infer<typeof BaseEnvSchema>;

export function readEnv(env: NodeJS.ProcessEnv): Env {
  const derivedBaseUrl = deriveBaseUrl(env);
  const derivedMcpCanonicalUri = deriveMcpCanonicalUri(env, derivedBaseUrl);

  const parsed = HttpEnvSchema.safeParse({
    ...env,
    BASE_URL: derivedBaseUrl,
    MCP_CANONICAL_URI: derivedMcpCanonicalUri,
  });

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

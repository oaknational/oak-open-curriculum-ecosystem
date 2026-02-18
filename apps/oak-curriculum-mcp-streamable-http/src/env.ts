import { z } from 'zod';
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema, LoggingEnvSchema } from '@oaknational/mcp-env';

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
  // Accept empty strings or relative paths as undefined (Vercel may set BASE_URL="/")
  if (explicit && explicit !== '' && explicit !== '/' && !explicit.startsWith('/')) {
    return explicit;
  }

  // Use VERCEL_URL as fallback (Vercel provides this without protocol)
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
  // Accept empty strings or relative paths as undefined
  if (explicit && explicit !== '' && explicit !== '/' && !explicit.startsWith('/')) {
    return explicit;
  }

  // If we have a BASE_URL (explicit or derived), append /mcp
  if (baseUrl) {
    return `${baseUrl}/mcp`;
  }

  return undefined;
}

const CorsModeSchema = z.enum(['allow_all', 'explicit', 'automatic']).default('automatic');

/**
 * HTTP server environment schema.
 *
 * Composes shared contracts from `@oaknational/mcp-env` with
 * HTTP-server-specific fields. Elasticsearch credentials are
 * required — the server fails at startup if they are absent.
 */
const EnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend({
    // Clerk Authentication
    CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY required'),
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY required'),
    // MCP Server Configuration
    BASE_URL: z.url().optional(),
    MCP_CANONICAL_URI: z.url().optional(),
    PORT: z.string().optional(),
    // Transport Mode
    REMOTE_MCP_MODE: ModeSchema.optional(),
    // Security & Development
    DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
    ALLOWED_HOSTS: z.string().optional(),
    ALLOWED_ORIGINS: z.string().optional(),
    CORS_MODE: CorsModeSchema.optional(),
    // Vercel System Environment Variables (read-only, for derivation logic)
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_BRANCH_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  });

export type Env = z.infer<typeof EnvSchema>;

/* eslint-disable-next-line no-restricted-syntax -- This is the ONLY function that reads process.env to build validated config */
export function readEnv(env: NodeJS.ProcessEnv = process.env): Env {
  // Derive BASE_URL and MCP_CANONICAL_URI from Vercel system variables if needed
  const derivedBaseUrl = deriveBaseUrl(env);
  const derivedMcpCanonicalUri = deriveMcpCanonicalUri(env, derivedBaseUrl);

  const parsed = EnvSchema.safeParse({
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

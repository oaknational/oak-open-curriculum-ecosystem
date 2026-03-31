import { z } from 'zod';
import {
  OakApiKeyEnvSchema,
  ElasticsearchEnvSchema,
  LoggingEnvSchema,
  SentryEnvSchema,
} from '@oaknational/env';

const ModeSchema = z.enum(['stateless', 'session']).default('stateless');

/**
 * Base shape for the HTTP server environment.
 *
 * Clerk keys are optional in the base shape; conditional requirement is
 * enforced via `superRefine` on the final `HttpEnvSchema`.
 *
 * CORS is unconditionally permissive (all origins allowed). Security is
 * enforced by OAuth authentication, not by origin restrictions. See the
 * ADR on permissive CORS for OAuth-protected MCP servers.
 */
const BaseEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend(SentryEnvSchema.shape)
  .extend({
    CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
    CLERK_SECRET_KEY: z.string().min(1).optional(),
    PORT: z.string().optional(),
    REMOTE_MCP_MODE: ModeSchema.optional(),
    DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: z.enum(['true', 'false']).optional(),
    ALLOWED_HOSTS: z.string().optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_BRANCH_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
    OAK_API_BASE_URL: z.url().optional(),
  });

/**
 * HTTP server environment schema with conditional Clerk key requirement.
 *
 * When `DANGEROUSLY_DISABLE_AUTH` is `'true'`, Clerk keys are optional.
 * Otherwise, both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required.
 */
export const HttpEnvSchema = BaseEnvSchema.superRefine((data, ctx) => {
  // Production safety: DANGEROUSLY_DISABLE_AUTH must NEVER be true in production.
  // This makes misconfiguration a hard startup failure rather than a silent bypass.
  if (data.DANGEROUSLY_DISABLE_AUTH === 'true' && data.VERCEL_ENV === 'production') {
    ctx.addIssue({
      code: 'custom',
      path: ['DANGEROUSLY_DISABLE_AUTH'],
      message:
        'DANGEROUSLY_DISABLE_AUTH cannot be true in production. ' +
        'This flag is for local development only.',
    });
    return;
  }

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

export type Env = z.input<typeof BaseEnvSchema>;

export function parseCsv(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

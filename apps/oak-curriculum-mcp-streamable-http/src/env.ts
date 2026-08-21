import { z } from 'zod';
import {
  BuildEnvSchema,
  ElasticsearchEnvSchema,
  LoggingEnvSchema,
  OakApiKeyEnvSchema,
  SentryEnvSchema,
} from '@oaknational/env';
import { RELEASE_ENVIRONMENTS } from '@oaknational/build-metadata';
import { isValidHostHeader } from './host-header-validation.js';
import { productAnalyticsEnvFields, refineProductAnalyticsEnv } from './env-product-analytics.js';
import { refineClerkKeyLocality } from './env-clerk-guards.js';

const ModeSchema = z.enum(['stateless', 'session']).default('stateless');

const LOOPBACK_HOSTNAMES: readonly string[] = ['localhost', '127.0.0.1', '::1'];

function isLoopbackHostname(value: string): boolean {
  return LOOPBACK_HOSTNAMES.includes(value.toLowerCase());
}

/**
 * Base shape for the HTTP server environment.
 *
 * Clerk keys are optional in the base shape; conditional requirement is
 * enforced via `superRefine` on the final `HttpEnvSchema`.
 *
 * CORS is unconditionally permissive (all origins allowed). Security is
 * enforced by OAuth authentication, not by origin restrictions. See the
 * ADR on permissive CORS for OAuth-protected MCP servers.
 *
 * Vercel system env vars (`VERCEL_ENV`, `VERCEL_BRANCH_URL`, etc.) come
 * from the shared `BuildEnvSchema` so the runtime path and the
 * build-time path validate against one contract. `BuildEnvSchema`
 * encodes `VERCEL_BRANCH_URL` as a hostname (no scheme) per the
 * Vercel docs.
 */
const BaseEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend(SentryEnvSchema.shape)
  .extend(BuildEnvSchema.shape)
  .extend({
    CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
    CLERK_SECRET_KEY: z.string().min(1).optional(),
    PORT: z.string().optional(),
    REMOTE_MCP_MODE: ModeSchema.optional(),
    DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: z.enum(['true', 'false']).optional(),
    ALLOWED_HOSTS: z.string().optional(),
    APP_VERSION_OVERRIDE: z.string().optional(),
    GIT_SHA_OVERRIDE: z.string().optional(),
    OAK_API_BASE_URL: z.url().optional(),
    /**
     * Shared secret that gates the diagnostic `/test-error` route.
     *
     * When set in `preview` or `development` environments, registers
     * `POST /test-error` for repeatable Sentry capture validation
     * (handled / unhandled / rejected modes). Forbidden in
     * production — `superRefine` below makes that a hard startup
     * failure.
     *
     * Provision a random (high-entropy) value: the secret gates the
     * route's effect — an unauthorised hit costs one 401 body and one
     * warn log line, no Sentry capture. The schema enforces only the
     * 16-char length floor; unauthorised request volume is bounded at
     * the edge (ADR-219).
     */
    TEST_ERROR_SECRET: z.string().min(16).optional(),
    /**
     * The address this server is served at, when that differs from the
     * hostname reaching it.
     *
     * Set it and every self-description surface names
     * `https://<CANONICAL_HOST>`; absent, the app self-describes per request
     * from the arriving Host. Production sets it to `mcp.thenational.academy`,
     * so every host — the canonical one, the alpha host, a preview — advertises
     * the same resource, and a token bound to it is accepted at any of them.
     *
     * History: MCP-172 introduced it while the app was served at
     * `www.thenational.academy/mcp` behind a path-scoped Cloudflare origin rule
     * that overrode the Host, where per-request derivation could not name the
     * canonical address at all. That rule was withdrawn 2026-08-20, and the
     * canonical hostname is attached to the Vercel project directly.
     *
     * A bare hostname only — ports, schemes, paths and loopback names are
     * rejected here so a misconfiguration is a startup failure rather than a
     * downgraded or unreachable URL inside a metadata document.
     */
    CANONICAL_HOST: z
      .string()
      .refine(
        (value) => isValidHostHeader(value) && !value.includes(':') && !isLoopbackHostname(value),
        'CANONICAL_HOST must be a bare public hostname — no scheme, port, path, or loopback name',
      )
      .optional(),
    /**
     * Observability selection axis plus the PostHog deployment inputs it
     * conditionally requires — field docs and the conditional rules live
     * in `env-product-analytics.ts`.
     */
    ...productAnalyticsEnvFields,
  });

interface ProductionSafetyData {
  readonly DANGEROUSLY_DISABLE_AUTH?: string;
  readonly TEST_ERROR_SECRET?: string;
  readonly VERCEL_ENV?: string;
}

/**
 * Production-only hard failures.
 *
 * @returns `true` when a fatal issue was added and refinement should stop.
 */
function refineProductionSafety(data: ProductionSafetyData, ctx: z.RefinementCtx): boolean {
  // Deployment safety: DANGEROUSLY_DISABLE_AUTH must NEVER be true in a
  // DEPLOYED environment — production OR preview (MCP-143 Guard 1b).
  // Disabling auth on an internet-reachable deployment would expose an
  // unauthenticated MCP endpoint, so misconfiguration is a hard startup
  // failure rather than a silent bypass.
  //
  // The valve is permitted on a LOCAL run only, which is exactly two cases:
  // VERCEL_ENV unset (not running on Vercel at all) or VERCEL_ENV
  // `development`. The condition is written as that ALLOWED set, negated —
  // rather than as chained `!==` comparisons — so the guard reads as its
  // intent: auth may only be disabled on a local run. Anything else,
  // including any future Vercel environment name we do not yet know about,
  // is treated as deployed and fails closed.
  const isLocalRun =
    data.VERCEL_ENV === undefined || data.VERCEL_ENV === RELEASE_ENVIRONMENTS.development;

  if (data.DANGEROUSLY_DISABLE_AUTH === 'true' && !isLocalRun) {
    ctx.addIssue({
      code: 'custom',
      path: ['DANGEROUSLY_DISABLE_AUTH'],
      message:
        'DANGEROUSLY_DISABLE_AUTH cannot be true outside development. ' +
        'This flag is for local development only; preview and production ' +
        'deployments must run with auth enabled.',
    });
    return true;
  }

  // Production safety: TEST_ERROR_SECRET must NEVER be set in production.
  // The /test-error route exists for diagnostic capture validation;
  // production has no need for it and a misconfigured secret would
  // expose a controlled-throw surface to the public internet.
  if (data.TEST_ERROR_SECRET && data.VERCEL_ENV === RELEASE_ENVIRONMENTS.production) {
    ctx.addIssue({
      code: 'custom',
      path: ['TEST_ERROR_SECRET'],
      message:
        'TEST_ERROR_SECRET must not be set in production. ' +
        'The /test-error route is for preview/development diagnostic use only.',
    });
    return true;
  }

  return false;
}

/**
 * HTTP server environment schema with conditional Clerk key requirement.
 *
 * When `DANGEROUSLY_DISABLE_AUTH` is `'true'`, Clerk keys are optional.
 * Otherwise, both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required.
 */
export const HttpEnvSchema = BaseEnvSchema.superRefine((data, ctx) => {
  // Production safety first: its diagnostics are the highest-severity
  // misconfigurations and must never be suppressed by a PostHog rule's
  // early return.
  if (refineProductionSafety(data, ctx)) {
    return;
  }

  if (refineProductAnalyticsEnv(data, ctx)) {
    return;
  }

  if (data.DANGEROUSLY_DISABLE_AUTH === 'true') {
    return;
  }

  // Auth is enabled: keys must be present (below) AND, in production,
  // live-realm keys (MCP-143 Guard 1a).
  refineClerkKeyLocality(data, ctx);

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

/** The parsed shape the validation pipeline produces (post-transform). */
export type ValidatedHttpEnv = z.output<typeof BaseEnvSchema>;

export function parseCsv(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

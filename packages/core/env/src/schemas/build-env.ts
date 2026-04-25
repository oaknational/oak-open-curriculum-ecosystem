import { z } from 'zod';

/**
 * Supported values of `VERCEL_ENV`.
 *
 * @remarks Mirrors the documented Vercel system env-var values. See
 * https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_ENV
 */
export const VERCEL_ENVS = ['production', 'preview', 'development'] as const;

const HOSTNAME_NOT_URL = z.string().refine((value) => !value.includes('://'), {
  message:
    'VERCEL_BRANCH_URL must be a hostname (no scheme). Per ' +
    'https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL ' +
    'this variable contains "the domain name of a Generated Deployment URL", ' +
    'not a full URL. Reject scheme-prefixed values at the boundary so ' +
    'downstream parsing does not silently fail or produce a corrupted label.',
});

/**
 * Build-time environment-variable contract for Vercel-deployed apps.
 *
 * @remarks Centralises the Vercel system env vars (a) the runtime
 * server reads at startup and (b) the build script reads at
 * compile-time. Both paths previously declared their own copies of
 * these fields; this schema collapses that duplication and anchors
 * one specific shape assumption — `VERCEL_BRANCH_URL` is a hostname,
 * not a URL — that escaped the test harness in 2026-04-25 and broke
 * the production preview build for several days.
 *
 * Provider scope: Vercel system env vars only. If a non-Vercel build
 * provider is added later (e.g. GitHub Actions), split this schema
 * into a `build/` subdirectory and compose providers as needed.
 *
 * Reference: https://vercel.com/docs/environment-variables/system-environment-variables
 */
export const BuildEnvSchema = z.object({
  VERCEL: z.union([z.literal('1'), z.literal('')]).optional(),
  VERCEL_ENV: z.enum(VERCEL_ENVS).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_BRANCH_URL: HOSTNAME_NOT_URL.optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  VERCEL_GIT_COMMIT_REF: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  VERCEL_GIT_PREVIOUS_SHA: z.string().optional(),
});

export type BuildEnv = z.infer<typeof BuildEnvSchema>;

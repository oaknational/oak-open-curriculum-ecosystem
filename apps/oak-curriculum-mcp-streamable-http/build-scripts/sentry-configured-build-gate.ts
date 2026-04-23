/**
 * Pre-preview repo-owned gate for the configured Sentry esbuild-plugin path.
 *
 * @remarks
 * This gate intentionally proves only the local build composition root enters
 * the configured branch with representative preview-style Vercel metadata. It
 * does NOT claim preview deployment proof, `/healthz` proof, or post-deploy
 * source-map verification.
 */

export const REPRESENTATIVE_PREVIEW_GATE_ENV = {
  VERCEL_ENV: 'preview',
  VERCEL_GIT_COMMIT_REF: 'feat/sentry-configured-build-gate',
  VERCEL_GIT_COMMIT_SHA: '0123456789abcdef0123456789abcdef01234567',
} as const;

function coerceEnvValue(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

/**
 * Build the env surface needed to exercise the configured esbuild-plugin arm.
 *
 * @throws Error when `SENTRY_AUTH_TOKEN` is absent or blank
 */
export function createConfiguredSentryBuildGateEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const authToken = env.SENTRY_AUTH_TOKEN?.trim();
  if (!authToken) {
    throw new Error(
      '[build:sentry:configured] SENTRY_AUTH_TOKEN is required to exercise the configured Sentry esbuild-plugin path.',
    );
  }

  return {
    ...env,
    SENTRY_AUTH_TOKEN: authToken,
    VERCEL_ENV: coerceEnvValue(env.VERCEL_ENV, REPRESENTATIVE_PREVIEW_GATE_ENV.VERCEL_ENV),
    VERCEL_GIT_COMMIT_REF: coerceEnvValue(
      env.VERCEL_GIT_COMMIT_REF,
      REPRESENTATIVE_PREVIEW_GATE_ENV.VERCEL_GIT_COMMIT_REF,
    ),
    VERCEL_GIT_COMMIT_SHA: coerceEnvValue(
      env.VERCEL_GIT_COMMIT_SHA,
      REPRESENTATIVE_PREVIEW_GATE_ENV.VERCEL_GIT_COMMIT_SHA,
    ),
  };
}

/**
 * Assert that the esbuild-config output exercised the configured Sentry arm.
 *
 * @throws Error when the enabled marker is missing or the output shows a
 *   disabled/skipped reason that would make the proof dishonest
 */
export function assertConfiguredSentryBuildOutput(output: string): void {
  if (output.includes('registration_disabled_by_policy')) {
    throw new Error(
      '[build:sentry:configured] esbuild.config.ts reported registration_disabled_by_policy; configured-arm proof failed.',
    );
  }

  if (output.includes('auth_token_missing')) {
    throw new Error(
      '[build:sentry:configured] esbuild.config.ts reported auth_token_missing; configured-arm proof failed.',
    );
  }

  if (!output.includes('[esbuild.config] Sentry plugin enabled:')) {
    throw new Error(
      '[build:sentry:configured] Expected esbuild.config.ts to log "Sentry plugin enabled" but it did not.',
    );
  }
}

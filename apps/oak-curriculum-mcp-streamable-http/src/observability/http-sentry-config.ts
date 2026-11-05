import type { Result } from '@oaknational/result';
import {
  createSentryConfig,
  type ObservabilityConfigError,
  type ParsedSentryConfig,
} from '@oaknational/sentry-node';
import type { RuntimeConfig } from '../runtime-config.js';

/**
 * The Sentry configuration environment as the HTTP server composes it:
 * the validated env plus the resolved version and git identity.
 */
function createSentryConfigEnvironment(runtimeConfig: RuntimeConfig) {
  return {
    ...runtimeConfig.env,
    APP_VERSION: runtimeConfig.version,
    APP_VERSION_SOURCE: runtimeConfig.versionSource,
    ...(runtimeConfig.gitSha
      ? { GIT_SHA: runtimeConfig.gitSha, GIT_SHA_SOURCE: runtimeConfig.gitShaSource }
      : {}),
  };
}

/**
 * Parse the HTTP server's Sentry configuration from the runtime config —
 * the pure half of observability composition, shared by the runtime
 * initialiser (`createHttpObservability`) and the build-time deploy-config
 * gate (`build-scripts/validate-deploy-config.ts`), so the gate refuses
 * exactly what boot would refuse before any SDK is touched.
 */
export function parseHttpSentryConfig(
  runtimeConfig: RuntimeConfig,
): Result<ParsedSentryConfig, ObservabilityConfigError> {
  return createSentryConfig(createSentryConfigEnvironment(runtimeConfig));
}

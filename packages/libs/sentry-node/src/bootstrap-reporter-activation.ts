/**
 * The bootstrap reporter's activation gate and SDK composition.
 *
 * @remarks
 * Split from `bootstrap-reporter.ts` so the decision "may this report be
 * sent at all, and to where?" is readable on its own. It is the whole of
 * the reporter's trust boundary: everything downstream assumes a
 * destination that parsed strictly under the shared `SentryEnvSchema`.
 *
 * @packageDocumentation
 */

import { SentryEnvSchema } from '@oaknational/env';
import { redactText } from '@oaknational/observability';
import type { NodeOptions } from '@sentry/node';
import { validateDsn } from './config-parsing.js';
import { resolveSentryEnvironment } from './config-resolution.js';
import { createSentryRedactionHooks } from './runtime-sdk.js';

/**
 * Why the reporter did not send anything.
 *
 * @remarks Each reason is a deliberate silence, not an error:
 * - `sentry_env_rejected` — the Sentry inputs do not parse under the
 *   shared `SentryEnvSchema`. Nothing trustworthy describes where a
 *   report would go, so nothing is sent.
 * - `mode_not_live` — `SENTRY_MODE` is `off` or `fixture`. Those modes
 *   are authoritative: they make no network call, and the bootstrap path
 *   does not get to override them.
 * - `dsn_unusable` — live mode was selected without a usable
 *   `SENTRY_DSN`, so there is no destination.
 */
export type BootstrapReportSilentReason = 'sentry_env_rejected' | 'mode_not_live' | 'dsn_unusable';

/** The minimum destination facts a bootstrap report needs. */
export interface BootstrapSentryConfig {
  readonly dsn: string;
  readonly environment: string;
  readonly release?: string;
}

export type BootstrapActivation =
  | { readonly activated: false; readonly reason: BootstrapReportSilentReason }
  | { readonly activated: true; readonly config: BootstrapSentryConfig };

/**
 * Decide whether a bootstrap report may be sent at all, from the raw
 * environment alone.
 *
 * @param env - The raw, unvalidated deployment environment.
 * @returns The destination to report to, or the reason for silence.
 *
 * @remarks The strict parse is the activation gate: anything the shared
 * schema rejects (an unknown `SENTRY_MODE`, a non-boolean flag) leaves
 * the reporter silent rather than guessing. Release resolution is
 * deliberately NOT attempted — the runtime application version is a
 * build-time value this path does not have, and requiring it would
 * silence the reporter exactly where it is needed.
 * `SENTRY_RELEASE_OVERRIDE` is used when a deployment supplies one.
 */
export function resolveBootstrapActivation(
  env: Readonly<Record<string, string | undefined>>,
): BootstrapActivation {
  const parsed = SentryEnvSchema.safeParse(env);

  if (!parsed.success) {
    return { activated: false, reason: 'sentry_env_rejected' };
  }

  if (parsed.data.SENTRY_MODE !== 'sentry') {
    return { activated: false, reason: 'mode_not_live' };
  }

  const dsn = validateDsn(parsed.data.SENTRY_DSN);

  if (!dsn.ok) {
    return { activated: false, reason: 'dsn_unusable' };
  }

  const environment = resolveSentryEnvironment({
    SENTRY_ENVIRONMENT_OVERRIDE: parsed.data.SENTRY_ENVIRONMENT_OVERRIDE,
    VERCEL_ENV: env.VERCEL_ENV,
    VERCEL_GIT_COMMIT_REF: env.VERCEL_GIT_COMMIT_REF,
  });
  const release = parsed.data.SENTRY_RELEASE_OVERRIDE;

  // Both of these are arbitrary operator-supplied strings — the shared
  // schema constrains neither beyond "a string" — and both travel to Sentry
  // as top-level event fields AND as tags. `beforeSend` sanitises event
  // CONTENT (`redactCommonEventFields` covers breadcrumbs, contexts,
  // exception, extra, logentry, message, request, transaction) but reaches
  // neither `release`, `environment`, nor `tags`. Redacting once here, as
  // they enter the config, is what keeps every downstream use inside the
  // barrier rather than beside it.
  return {
    activated: true,
    config: {
      dsn: dsn.value,
      environment: redactText(environment.value),
      ...(release ? { release: redactText(release) } : {}),
    },
  };
}

/**
 * Tags carried by the one event a bootstrap report emits.
 *
 * @remarks Every operator-supplied value on {@link BootstrapSentryConfig} was
 * already redacted as it entered the config, so this composes clean values
 * rather than re-sanitising them — one producer of the guarantee, at the
 * boundary the values cross.
 */
export function createBootstrapTags(
  config: BootstrapSentryConfig,
  serviceName: string,
): Record<string, string> {
  return {
    service: serviceName,
    environment: config.environment,
    ...(config.release ? { release: config.release } : {}),
    // Marks the one event class that comes from a server that never
    // started, so it is separable from ordinary runtime errors.
    'oak.boot_failure': 'true',
  };
}

/**
 * SDK options for the bootstrap client.
 *
 * @remarks Narrow by intent: no tracing, no logs, no PII, and exactly
 * the shared redaction hooks. Spreading {@link createSentryRedactionHooks}
 * last is what makes the barrier unbypassable — there is no local hook
 * that could run after it and re-introduce raw content.
 */
export function createBootstrapInitOptions(
  config: BootstrapSentryConfig,
  serviceName: string,
): NodeOptions {
  return {
    dsn: config.dsn,
    environment: config.environment,
    ...(config.release ? { release: config.release } : {}),
    tracesSampleRate: 0,
    enableLogs: false,
    sendDefaultPii: false,
    debug: false,
    tracePropagationTargets: [],
    // Stated rather than inherited: the frames on this path belong to the
    // composition root, whose locals include the whole process environment,
    // and `redactException` does not reach `stacktrace.frames[].vars`.
    includeLocalVariables: false,
    initialScope: { tags: createBootstrapTags(config, serviceName) },
    ...createSentryRedactionHooks(),
  };
}

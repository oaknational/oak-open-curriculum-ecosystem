/**
 * Composition-root assembly of the product-analytics runtime (MCP-241).
 *
 * @remarks
 * The single module where the application touches the PostHog adapter's
 * value exports (`@vercel/functions` is likewise injected by the roots and
 * imported nowhere else). Off mode reads nothing beyond the bootstrap
 * discriminant and creates no client. Selected mode resolves the release
 * atomically from the caller-snapshotted {@link ReleaseInput} projection,
 * builds the pseudonym capabilities from the decoded keyring, and hands one
 * closed config to the adapter factory. Every failure is a content-free
 * {@link ConfigError} and fails bootstrap whenever PostHog is selected —
 * the deliberate mirror of `resolveProductAnalyticsConfig`'s posture.
 */
import { PRODUCT_ANALYTICS_ENV_KEYS } from './product-analytics-config.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import type { Logger } from '@oaknational/logger';
import { resolveRelease, type ReleaseInput } from '@oaknational/build-metadata';
import {
  createOffProductAnalyticsRuntime,
  type ProductAnalyticsRuntime,
} from '@oaknational/observability';
import {
  createPostHogProductAnalyticsRuntime,
  createPostHogPseudonymCapabilities,
  type PostHogProductAnalyticsConfig,
  type PostHogOperationalErrorKind,
  type PostHogWaitUntil,
} from '@oaknational/posthog-node';
import { err, ok, type Result } from '@oaknational/result';

import type { ProductAnalyticsBootstrap } from './product-analytics-config.js';
import type { ConfigError } from './runtime-config-support.js';

/**
 * The hosting lifetime hook, re-exported so `@vercel/functions` has exactly
 * one import site in the application (Director ruling on 91a45718,
 * condition 2; lint-enforced by `@oaknational/no-vercel-functions-imports`,
 * which exempts only this module). Verified first-hand off-Vercel: no
 * throw, the registration is a silent no-op, and the promise still settles
 * on the local event loop — so no local fallback is needed and the roots
 * inject it unconditionally.
 */
export { waitUntil as hostingWaitUntil } from '@vercel/functions';

/**
 * Snapshots the typed release projection from the VALIDATED runtime env —
 * the same `.env`-merged surface the Sentry projection reads — never raw
 * `process.env`, whose values diverge from the validated env on any host
 * where `.env` files participate in resolution (the merge never mutates
 * `process.env`). One env surface for both telemetry systems keeps their
 * release and environment identity in agreement by construction.
 *
 * @param env - The validated runtime env (`runtimeConfig.env`).
 * @param appVersion - The authoritative resolved application version
 * (`runtimeConfig.version`), supplied as the resolver's `APP_VERSION`.
 */
export function releaseInputFromRuntimeEnv(
  env: Pick<
    ReleaseInput,
    | 'SENTRY_RELEASE_OVERRIDE'
    | 'VERCEL_ENV'
    | 'VERCEL_BRANCH_URL'
    | 'VERCEL_GIT_COMMIT_REF'
    | 'VERCEL_GIT_COMMIT_SHA'
  >,
  appVersion: string,
): ReleaseInput {
  return {
    SENTRY_RELEASE_OVERRIDE: env.SENTRY_RELEASE_OVERRIDE,
    VERCEL_ENV: env.VERCEL_ENV,
    VERCEL_BRANCH_URL: env.VERCEL_BRANCH_URL,
    VERCEL_GIT_COMMIT_REF: env.VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_SHA: env.VERCEL_GIT_COMMIT_SHA,
    APP_VERSION: appVersion,
  };
}

/**
 * Content-free operational observer the roots hand to the adapter: the
 * closed error kind is the entire payload, logged as a warning.
 */
export function operationalErrorReporter(log: Logger): (kind: PostHogOperationalErrorKind) => void {
  return (kind) => {
    log.warn('product-analytics operational signal', { kind });
  };
}

/**
 * Ambient-free inputs the composition roots assemble once at bootstrap.
 *
 * @remarks The roots own every snapshot: the release env projection is a
 * typed {@link ReleaseInput} (never `process.env` itself), the tool and
 * resource names are the canonical live registration names, and
 * `waitUntil` is the hosting hook injected here and nowhere deeper.
 */
export interface ComposeProductAnalyticsInput {
  readonly bootstrap: ProductAnalyticsBootstrap;
  /** Authoritative server version (`runtimeConfig.version`). */
  readonly serverVersion: string;
  /** Caller-snapshotted release projection, resolved only when selected. */
  readonly releaseInput: ReleaseInput;
  /** Canonical live tool registration names. */
  readonly toolNames: readonly string[];
  /** Canonical live resource registration names. */
  readonly resourceNames: readonly string[];
  /** Hosting hook for bounded post-response delivery work. */
  readonly waitUntil: PostHogWaitUntil;
  /** Content-free operational observer supplied by the roots. */
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}

/**
 * At-most-one-client semantics for a RETRIED caller (the deploy entry
 * loader clears and retries a failed app load): the first Ok composition
 * is cached and every later call returns the same runtime, so a transient
 * post-composition failure can never construct a second PostHog client in
 * the same isolate. Failures are not cached — the failure paths provably
 * construct no client, so a retry may safely compose again.
 */
export function composeProductAnalyticsRuntimeOnce(
  compose: () => Result<ProductAnalyticsRuntime<Transport>, ConfigError>,
): () => Result<ProductAnalyticsRuntime<Transport>, ConfigError> {
  let composed: ProductAnalyticsRuntime<Transport> | undefined;
  return () => {
    if (composed !== undefined) {
      return ok(composed);
    }
    const result = compose();
    if (result.ok) {
      composed = result.value;
    }
    return result;
  };
}

function compositionError(reason: string): Result<never, ConfigError> {
  return err({
    message: `invalid PostHog product-analytics composition: ${reason}`,
    diagnostics: [],
    failingKeys: PRODUCT_ANALYTICS_ENV_KEYS,
  });
}

/**
 * Builds the runtime the request path receives: the exact inert runtime when
 * PostHog is not selected, otherwise the adapter runtime from one closed
 * config.
 *
 * @param input - Root-assembled inputs; see {@link ComposeProductAnalyticsInput}.
 * @param createRuntime - Adapter factory seam (ADR-078): production uses the
 * real `createPostHogProductAnalyticsRuntime`; tests inject a fake and prove
 * off mode and every failure path never invoke it.
 */
export function composeProductAnalyticsRuntime(
  input: ComposeProductAnalyticsInput,
  createRuntime: (
    config: PostHogProductAnalyticsConfig,
  ) => ProductAnalyticsRuntime<Transport> = createPostHogProductAnalyticsRuntime,
): Result<ProductAnalyticsRuntime<Transport>, ConfigError> {
  const { bootstrap } = input;
  if (!bootstrap.selected) {
    return ok(createOffProductAnalyticsRuntime<Transport>());
  }

  const release = resolveRelease(input.releaseInput);
  if (!release.ok) {
    // The kind is a closed enum literal carrying deployment identity only,
    // so surfacing it keeps the error content-free while giving the
    // operator the actionable reason (the keyring arm below stays fully
    // opaque — that input is key material).
    return compositionError(
      `release resolution failed (${release.error.kind}) while posthog is selected`,
    );
  }

  const capabilities = createPostHogPseudonymCapabilities({
    environment: release.value.environment,
    activeKeyId: bootstrap.activeKeyId,
    keyring: bootstrap.keyring,
  });
  if (!capabilities.ok) {
    return compositionError('pseudonym capabilities could not be constructed');
  }

  return ok(
    createRuntime({
      projectApiKey: bootstrap.projectApiKey,
      host: bootstrap.host,
      serverVersion: input.serverVersion,
      release: release.value,
      activeActorProjector: capabilities.value.active,
      toolNames: input.toolNames,
      resourceNames: input.resourceNames,
      waitUntil: input.waitUntil,
      reportOperationalError: input.reportOperationalError,
    }),
  );
}

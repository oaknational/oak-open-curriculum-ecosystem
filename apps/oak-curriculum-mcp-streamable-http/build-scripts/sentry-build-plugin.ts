/**
 * Sentry build-plugin intent factory for the MCP HTTP app's esbuild build.
 *
 * @remarks
 * Pure function that maps build-time environment + Oak identity literals
 * onto the registration intent the app's esbuild composition root will
 * hand to `@sentry/esbuild-plugin`. Holds the Sentry plugin at arm's
 * length — returns a typed description of "what to tell Sentry", not a
 * plugin instance. The composition root constructs the actual plugin
 * only when intent is `configured`.
 *
 * Boundary rationale (per architecture-reviewer-betty intent-review,
 * 2026-04-21): vendor coupling stays app-local. `@oaknational/sentry-node`
 * keeps its vendor-agnostic policy surface (`resolveSentryEnvironment`,
 * `resolveSentryRegistrationPolicy`, `resolveSentryRelease`,
 * `resolveGitSha`) and is not modified to host this factory.
 *
 * Standing in §L-8 WS1 RED: stub that throws. WS2 GREEN replaces the
 * body with the policy → plugin-inputs mapping.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import {
  resolveGitSha,
  resolveSentryEnvironment,
  resolveSentryRegistrationPolicy,
  resolveSentryRelease,
  type ObservabilityConfigError,
  type SentryConfigEnvironment,
} from '@oaknational/sentry-node';

/** Repository / project identity literals owned by the MCP app deployment. */
export interface SentryBuildPluginIdentity {
  readonly org: string;
  readonly project: string;
  readonly repoSlug: string;
}

/**
 * The shape `@sentry/esbuild-plugin` expects for a registered build.
 *
 * @remarks Mirrors the plugin's documented option subset Oak uses. Kept
 * locally typed (rather than imported from `@sentry/esbuild-plugin`) so
 * the policy → intent mapping does not depend on the vendor's TypeScript
 * surface; the composition root performs the cast at the seam.
 */
export interface SentryBuildPluginInputs {
  readonly org: string;
  readonly project: string;
  readonly authToken: string | undefined;
  readonly release: {
    readonly name: string;
    readonly setCommits: { readonly commit: string; readonly repo: string };
    readonly deploy: { readonly env: string };
  };
  readonly sourcemaps: { readonly filesToDeleteAfterUpload: readonly string[] };
  readonly telemetry: false;
}

/** Outcome of policy resolution: either Sentry registration is wired or it is intentionally absent. */
export type SentryBuildPluginIntent =
  | { readonly kind: 'configured'; readonly inputs: SentryBuildPluginInputs }
  | { readonly kind: 'disabled'; readonly reason: 'registration_disabled_by_policy' };

/** Build-time environment surface = ADR-163 policy env + the host-injected auth token. */
export type SentryBuildEnvironment = SentryConfigEnvironment & {
  readonly SENTRY_AUTH_TOKEN?: string;
};

/** Errors that can short-circuit intent construction. */
export type CreateSentryBuildPluginError =
  | ObservabilityConfigError
  | { readonly kind: 'missing_commit_sha_in_registered_environment' };

/**
 * Map build-time env + identity onto the Sentry build-plugin intent.
 *
 * @remarks Behaviour proven by `sentry-build-plugin.unit.test.ts`.
 * Composes the four `@oaknational/sentry-node` policy resolvers
 * ({@link resolveSentryRegistrationPolicy}, {@link resolveSentryRelease},
 * {@link resolveGitSha}, {@link resolveSentryEnvironment}) so this
 * factory holds zero ADR-163 §3/§4 logic of its own — it only stitches
 * the resolver outputs onto the plugin's input shape.
 */
export function createSentryBuildPlugin(
  env: SentryBuildEnvironment,
  identity: SentryBuildPluginIdentity,
): Result<SentryBuildPluginIntent, CreateSentryBuildPluginError> {
  const policy = resolveSentryRegistrationPolicy(env);
  if (!policy.ok) {
    return policy;
  }

  if (!policy.value.registerRelease) {
    return ok({ kind: 'disabled', reason: 'registration_disabled_by_policy' });
  }

  const release = resolveSentryRelease(env);
  if (!release.ok) {
    return release;
  }

  const sha = resolveGitSha(env);
  if (!sha.ok) {
    return sha;
  }
  if (!sha.value) {
    return err({ kind: 'missing_commit_sha_in_registered_environment' });
  }

  const environment = resolveSentryEnvironment(env);

  return ok({
    kind: 'configured',
    inputs: {
      org: identity.org,
      project: identity.project,
      authToken: env.SENTRY_AUTH_TOKEN,
      release: {
        name: release.value.value,
        setCommits: { commit: sha.value.value, repo: identity.repoSlug },
        deploy: { env: environment.value },
      },
      sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.js.map'] },
      telemetry: false,
    },
  });
}

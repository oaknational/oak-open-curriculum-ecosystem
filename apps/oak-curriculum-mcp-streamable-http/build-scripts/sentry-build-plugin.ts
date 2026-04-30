/**
 * Sentry build-plugin intent factory for the MCP HTTP app's esbuild build.
 *
 * @remarks Pure function that maps the build-time env snapshot onto the
 * registration intent the esbuild composition root hands to
 * `@sentry/esbuild-plugin`. Holds the plugin at arm's length — returns a
 * typed "what to tell Sentry" description, not a plugin instance. Vendor
 * coupling stays app-local: `@oaknational/sentry-node` keeps its
 * vendor-agnostic policy surface; release-name resolution lives in
 * `@oaknational/build-metadata`'s {@link resolveRelease} with git-SHA
 * provenance via {@link resolveGitSha}; deployment identity is resolved
 * by {@link resolveSentryBuildPluginIdentity}.
 *
 * @packageDocumentation
 */

import {
  resolveGitSha,
  resolveRelease,
  type GitShaSource,
  type ReleaseError,
  type ReleaseInput,
  type ResolvedRelease,
  type RuntimeMetadataError,
} from '@oaknational/build-metadata';
import { err, ok, type Result } from '@oaknational/result';
import {
  resolveSentryRegistrationPolicy,
  type ObservabilityConfigError,
  type SentryConfigEnvironment,
} from '@oaknational/sentry-node';
import {
  resolveSentryBuildPluginIdentity,
  type SentryBuildPluginIdentity,
  type SentryBuildPluginIdentityError,
} from './sentry-build-plugin-identity.js';
import { trimToUndefined } from './trim-to-undefined.js';

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
  readonly authToken: string;
  readonly release: {
    readonly name: string;
    readonly setCommits: { readonly commit: string; readonly repo: string };
    readonly deploy: { readonly env: string };
  };
  readonly sourcemaps: { readonly filesToDeleteAfterUpload: readonly string[] };
  readonly telemetry: false;
}

/**
 * Git SHA + provenance resolved at build time alongside the release.
 *
 * @remarks Re-exported so the composition root can consume it to
 * persist into `BuildInfo` alongside the resolved release.
 */
export interface ResolvedBuildTimeGitSha {
  readonly value: string;
  readonly source: GitShaSource;
}

/**
 * Outcome of build-time intent resolution.
 *
 * @remarks Three success variants encode the §Truth Tables fail-policy
 * verbatim. `Result.error` is reserved for vital-identity failures —
 * the composition root throws on those.
 *
 * - `configured` — registration is enabled and every input the plugin
 *   needs is present; the composition root wires the plugin. The
 *   `gitSha` provenance is attached so the composition root can
 *   persist it into `BuildInfo`.
 * - `disabled` — registration policy decided this build does not
 *   register a release. Plugin omitted; build proceeds.
 * - `skipped` — registration policy decided this build SHOULD register
 *   a release, but optional vendor config (`SENTRY_AUTH_TOKEN`) is
 *   missing. Plugin omitted with a diagnostic warn line; build proceeds
 *   so fork-preview and credential-less rehearsals still produce an
 *   artefact.
 */
export type SentryBuildPluginIntent =
  | {
      readonly kind: 'configured';
      readonly release: ResolvedRelease;
      readonly gitSha: ResolvedBuildTimeGitSha | undefined;
      readonly inputs: SentryBuildPluginInputs;
    }
  | { readonly kind: 'disabled'; readonly reason: 'registration_disabled_by_policy' }
  | {
      readonly kind: 'skipped';
      readonly reason: 'auth_token_missing';
      readonly release: ResolvedRelease;
      readonly gitSha: ResolvedBuildTimeGitSha | undefined;
    };

/**
 * Build-time environment surface = ADR-163 policy env + auth token +
 * Sentry deployment identity vars + Vercel git-repo system vars used to
 * derive `repoSlug`. Identity vars are typed `optional` here; the strict
 * requirement lives in {@link resolveSentryBuildPluginIdentity}, which
 * only fires on the `configured` path.
 */
export type SentryBuildEnvironment = SentryConfigEnvironment &
  ReleaseInput & {
    readonly SENTRY_AUTH_TOKEN?: string;
    readonly SENTRY_ORG?: string;
    readonly SENTRY_PROJECT?: string;
    readonly SENTRY_REPO_SLUG?: string;
    readonly VERCEL_GIT_REPO_OWNER?: string;
    readonly VERCEL_GIT_REPO_SLUG?: string;
  };

/**
 * Vital-identity errors that short-circuit intent construction.
 *
 * @remarks Per the §Truth Tables fail-policy:
 *
 * - Optional vendor config missing → `kind: 'skipped'` (NOT an error).
 * - Vital identity missing → `Result.error` here → composition root
 *   throws.
 *
 * Production-only escalation: missing `SENTRY_AUTH_TOKEN` is *vital*
 * on production but *optional* on preview/development, so it surfaces
 * here only on production via `missing_auth_token_on_production`.
 */
export type CreateSentryBuildPluginError =
  | ObservabilityConfigError
  | ReleaseError
  | RuntimeMetadataError
  | { readonly kind: 'missing_commit_sha_in_registered_environment'; readonly message: string }
  | { readonly kind: 'missing_auth_token_on_production'; readonly message: string }
  | SentryBuildPluginIdentityError;

function resolveAuthTokenIntent(
  release: ResolvedRelease,
  gitSha: ResolvedBuildTimeGitSha | undefined,
  identity: SentryBuildPluginIdentity,
  env: SentryBuildEnvironment,
): Result<SentryBuildPluginIntent, CreateSentryBuildPluginError> {
  const authToken = trimToUndefined(env.SENTRY_AUTH_TOKEN);

  if (!authToken) {
    if (release.environment === 'production') {
      return err({
        kind: 'missing_auth_token_on_production',
        message:
          'SENTRY_AUTH_TOKEN is required for production builds (release artefact would not be ' +
          'attributed to a Sentry release). Set SENTRY_AUTH_TOKEN on the Vercel project for the ' +
          'production environment.',
      });
    }

    return ok({ kind: 'skipped', reason: 'auth_token_missing', release, gitSha });
  }

  if (!gitSha) {
    return err({
      kind: 'missing_commit_sha_in_registered_environment',
      message:
        'Cannot register a Sentry release without a git SHA. Set VERCEL_GIT_COMMIT_SHA or ' +
        'GIT_SHA_OVERRIDE; on Vercel this is auto-populated.',
    });
  }

  return ok({
    kind: 'configured',
    release,
    gitSha,
    inputs: {
      org: identity.org,
      project: identity.project,
      authToken,
      release: {
        name: release.value,
        setCommits: { commit: gitSha.value, repo: identity.repoSlug },
        deploy: { env: release.environment },
      },
      sourcemaps: { filesToDeleteAfterUpload: ['dist/server.js.map'] },
      telemetry: false,
    },
  });
}

/**
 * Map build-time env onto the Sentry build-plugin intent.
 *
 * @remarks Composes the registration-policy gate
 * ({@link resolveSentryRegistrationPolicy}), release-name derivation
 * ({@link resolveRelease}), git-SHA provenance ({@link resolveGitSha}),
 * and deployment identity ({@link resolveSentryBuildPluginIdentity}),
 * then runs the auth-token fail-policy split (`configured` / `skipped`
 * / `missing_auth_token_on_production`).
 *
 * Identity resolution is deferred to the `configured` path so disabled
 * / skipped builds tolerate missing identity vars (local dev, fork
 * preview without auth token still produce an artefact).
 *
 * Single-argument signature: identity is resolved from `env`, not passed
 * in. This is an open-source repository — no Sentry deployment identity
 * may be declared as a literal in source. See ADR-163.
 */
export function createSentryBuildPlugin(
  env: SentryBuildEnvironment,
): Result<SentryBuildPluginIntent, CreateSentryBuildPluginError> {
  const policy = resolveSentryRegistrationPolicy(env);
  if (!policy.ok) {
    return policy;
  }

  if (!policy.value.registerRelease) {
    return ok({ kind: 'disabled', reason: 'registration_disabled_by_policy' });
  }

  const release = resolveRelease(env);
  if (!release.ok) {
    return release;
  }

  const gitShaResult = resolveGitSha(env);
  if (!gitShaResult.ok) {
    return gitShaResult;
  }

  const identityResult = resolveSentryBuildPluginIdentity(env);
  if (!identityResult.ok) {
    return identityResult;
  }

  return resolveAuthTokenIntent(release.value, gitShaResult.value, identityResult.value, env);
}

/**
 * Re-export the canonical release resolver so the composition root can
 * persist its output to `dist/build-info.json` alongside calling
 * `createSentryBuildPlugin` — single boundary read, two consumers.
 */
export { resolveRelease } from '@oaknational/build-metadata';

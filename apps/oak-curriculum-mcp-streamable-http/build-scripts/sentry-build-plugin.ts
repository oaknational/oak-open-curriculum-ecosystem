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
 * Boundary rationale: vendor coupling stays app-local.
 * `@oaknational/sentry-node` keeps its vendor-agnostic policy surface
 * (`resolveSentryEnvironment`, `resolveSentryRegistrationPolicy`);
 * release-name resolution lives in `@oaknational/build-metadata`'s
 * canonical {@link resolveRelease}, with git-SHA provenance resolved
 * independently via {@link resolveGitSha}.
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

/** Build-time environment surface = ADR-163 policy env + the host-injected auth token. */
export type SentryBuildEnvironment = SentryConfigEnvironment &
  ReleaseInput & {
    readonly SENTRY_AUTH_TOKEN?: string;
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
  | { readonly kind: 'missing_auth_token_on_production'; readonly message: string };

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

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
 * Map build-time env + identity onto the Sentry build-plugin intent.
 *
 * @remarks Composes:
 *
 * - {@link resolveSentryRegistrationPolicy} from `@oaknational/sentry-node`
 *   for the "should this build register a release at all?" gate.
 * - {@link resolveRelease} from `@oaknational/build-metadata` for the
 *   canonical release-name derivation (production = root
 *   `package.json` semver; preview = `VERCEL_BRANCH_URL` host label;
 *   development = `dev-<shortSha>`).
 * - {@link resolveGitSha} from `@oaknational/build-metadata` for the
 *   git-SHA provenance (used by `setCommits` and persisted into
 *   `BuildInfo` by the composition root).
 *
 * Then the auth-token gate decides between `configured` (plugin runs),
 * `skipped` (warn + continue, preview/dev only), and
 * `missing_auth_token_on_production` (vital-identity error).
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

  const release = resolveRelease(env);
  if (!release.ok) {
    return release;
  }

  const gitShaResult = resolveGitSha(env);
  if (!gitShaResult.ok) {
    return gitShaResult;
  }

  return resolveAuthTokenIntent(release.value, gitShaResult.value, identity, env);
}

/**
 * Re-export the canonical release resolver so the composition root can
 * persist its output to `dist/build-info.json` alongside calling
 * `createSentryBuildPlugin` — single boundary read, two consumers.
 */
export { resolveRelease } from '@oaknational/build-metadata';

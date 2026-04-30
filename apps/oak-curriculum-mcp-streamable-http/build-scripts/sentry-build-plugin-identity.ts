/**
 * Sentry deployment-identity boundary parser for the MCP HTTP app's
 * esbuild build.
 *
 * @remarks Resolves `org`, `project`, and `repoSlug` from the build env
 * snapshot. Identity is never declared as a literal in source: this is
 * an open-source repository, and every fork must be able to set its own
 * Sentry deployment identity via env without editing source. See
 * `docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`.
 *
 * `repoSlug` resolution prefers an explicit `SENTRY_REPO_SLUG`, then
 * falls back to `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}` —
 * Vercel auto-populates both at build time on any connected repository
 * (including forks), so a Vercel-deployed fork needs no extra env
 * configuration for the slug.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { trimToUndefined } from './trim-to-undefined.js';

/**
 * Minimal env shape the identity resolver needs.
 *
 * @remarks Declared locally (rather than importing the full
 * `SentryBuildEnvironment` from `./sentry-build-plugin.js`) to keep the
 * dependency graph acyclic — `sentry-build-plugin.ts` imports from this
 * file, so this file must not import back.
 *
 * `SentryBuildEnvironment` is a structural superset of this interface.
 */
export interface SentryBuildPluginIdentityEnv {
  readonly SENTRY_ORG?: string;
  readonly SENTRY_PROJECT?: string;
  readonly SENTRY_REPO_SLUG?: string;
  readonly VERCEL_GIT_REPO_OWNER?: string;
  readonly VERCEL_GIT_REPO_SLUG?: string;
}

/**
 * Sentry deployment identity for this build.
 *
 * @remarks Resolved at the env boundary by
 * {@link resolveSentryBuildPluginIdentity}; never declared as a literal in
 * source. This is an open-source repo: every fork must be able to set its
 * own Sentry org/project/repo without editing source.
 */
export interface SentryBuildPluginIdentity {
  readonly org: string;
  readonly project: string;
  readonly repoSlug: string;
}

/**
 * Identity-resolution errors surfaced by
 * {@link resolveSentryBuildPluginIdentity}.
 *
 * @remarks `repoSlug` resolves from `SENTRY_REPO_SLUG` if set, otherwise
 * derives `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}` (Vercel auto-
 * populates both at build time on any connected repo, including forks).
 * If neither path supplies a value, the build fails loudly with a
 * fork-friendly message rather than silently registering against the wrong
 * identity.
 */
export type SentryBuildPluginIdentityError =
  | { readonly kind: 'missing_sentry_org'; readonly message: string }
  | { readonly kind: 'missing_sentry_project'; readonly message: string }
  | { readonly kind: 'missing_sentry_repo_slug'; readonly message: string };

/**
 * Resolve the Sentry deployment identity from the build env snapshot.
 *
 * @remarks Strict at the boundary: `org` and `project` are required;
 * `repoSlug` resolves from the explicit `SENTRY_REPO_SLUG` first, then
 * falls back to `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}`. Every
 * error is a typed {@link SentryBuildPluginIdentityError} variant whose
 * `message` field names the missing variable and the fallback path so a
 * fork operator can fix the deployment without reading source.
 *
 * Called only from the `configured` path inside `createSentryBuildPlugin`;
 * disabled / skipped builds do not need identity and therefore tolerate
 * missing identity vars (so local dev and fork-preview-without-auth still
 * produce an artefact).
 */
export function resolveSentryBuildPluginIdentity(
  env: SentryBuildPluginIdentityEnv,
): Result<SentryBuildPluginIdentity, SentryBuildPluginIdentityError> {
  const org = trimToUndefined(env.SENTRY_ORG);
  if (!org) {
    return err({
      kind: 'missing_sentry_org',
      message:
        'SENTRY_ORG is required for Sentry release registration. Set ' +
        'SENTRY_ORG on the project (Vercel project settings, .env, or ' +
        'CI environment) to your Sentry organisation slug. This repo ' +
        'is open source and must not embed deployment identity in source.',
    });
  }

  const project = trimToUndefined(env.SENTRY_PROJECT);
  if (!project) {
    return err({
      kind: 'missing_sentry_project',
      message:
        'SENTRY_PROJECT is required for Sentry release registration. Set ' +
        'SENTRY_PROJECT on the project (Vercel project settings, .env, or ' +
        'CI environment) to your Sentry project slug. This repo is open ' +
        'source and must not embed deployment identity in source.',
    });
  }

  const repoSlug = resolveRepoSlug(env);
  if (!repoSlug.ok) {
    return repoSlug;
  }

  return ok({ org, project, repoSlug: repoSlug.value });
}

function resolveRepoSlug(
  env: SentryBuildPluginIdentityEnv,
): Result<string, SentryBuildPluginIdentityError> {
  const explicit = trimToUndefined(env.SENTRY_REPO_SLUG);
  if (explicit) {
    return ok(explicit);
  }

  const owner = trimToUndefined(env.VERCEL_GIT_REPO_OWNER);
  const slug = trimToUndefined(env.VERCEL_GIT_REPO_SLUG);
  if (owner && slug) {
    return ok(`${owner}/${slug}`);
  }

  return err({
    kind: 'missing_sentry_repo_slug',
    message:
      'Cannot resolve Sentry repo slug. Set SENTRY_REPO_SLUG explicitly ' +
      '(e.g. "owner/repo") OR ensure VERCEL_GIT_REPO_OWNER and ' +
      'VERCEL_GIT_REPO_SLUG are both available — Vercel auto-populates ' +
      'these for any connected repository (including forks). This is ' +
      'used by Sentry setCommits to attribute the release to a specific ' +
      'GitHub repository.',
  });
}

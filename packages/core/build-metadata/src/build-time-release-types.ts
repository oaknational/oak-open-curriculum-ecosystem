/**
 * Shared types for the build-time release-name resolver.
 *
 * @remarks Extracted from `build-time-release.ts` so the public-API
 * module and the `build-time-release-internals.ts` helper module can
 * both import these types without forming an import cycle (depcruise
 * `no-circular` violation). Pure type module — no runtime exports.
 *
 * @packageDocumentation
 */

/**
 * Source the resolved build-time release name was derived from.
 *
 * @remarks Mirrors the four rows of the L-8 Correction
 * version-resolution strategy table:
 *
 * - `SENTRY_RELEASE_OVERRIDE` — operator-supplied literal, takes
 *   precedence in any environment so local-dev rehearsals and one-off
 *   probes work without code changes.
 * - `application_version` — root `package.json` semver, used only on
 *   `VERCEL_ENV === 'production'` AND `VERCEL_GIT_COMMIT_REF === 'main'`
 *   (the only context where the root version is the released semver per
 *   the Vercel `ignoreCommand` gate).
 * - `preview_branch_sha` — `preview-<branch-slug>-<shortSha>`, derived
 *   from `VERCEL_GIT_COMMIT_REF` + `VERCEL_GIT_COMMIT_SHA`. The root
 *   `package.json` version is stale on preview branches and MUST NOT
 *   be used.
 * - `development_short_sha` — `dev-<shortSha>`, derived from the local
 *   git SHA. Used for `vercel dev` and local builds where the root
 *   version is also stale.
 */
export type BuildTimeReleaseSource =
  | 'SENTRY_RELEASE_OVERRIDE'
  | 'application_version'
  | 'preview_branch_sha'
  | 'development_short_sha';

/** Effective deployment environment the release name was derived for. */
export type BuildTimeReleaseEnvironment = 'production' | 'preview' | 'development';

/**
 * Subset of build-time environment variables consumed by the
 * release-name resolver.
 *
 * @remarks Intersects the build-metadata runtime resolvers'
 * environment shape (which already covers `APP_VERSION_OVERRIDE`,
 * `GIT_SHA_OVERRIDE`, `VERCEL_GIT_COMMIT_SHA`) with the Vercel build
 * env vars and the `SENTRY_RELEASE_OVERRIDE` rehearsal hook. Carries
 * an open string-string index signature so this type is assignable to
 * `Readonly<Record<string, string | undefined>>` (the wider shape the
 * runtime-metadata resolvers accept).
 */
export interface BuildTimeReleaseEnvironmentInput {
  readonly [key: string]: string | undefined;
  readonly SENTRY_RELEASE_OVERRIDE?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_GIT_COMMIT_REF?: string;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
  readonly GIT_SHA_OVERRIDE?: string;
  readonly APP_VERSION_OVERRIDE?: string;
}

export interface ResolvedBuildTimeRelease {
  readonly value: string;
  readonly source: BuildTimeReleaseSource;
  readonly environment: BuildTimeReleaseEnvironment;
  readonly gitSha: string | undefined;
}

/**
 * Errors that may short-circuit build-time release-name resolution.
 *
 * @remarks Each `kind` corresponds to a single named failure mode in
 * the L-8 Correction `Corrected fail-policy` table. The composition
 * root branches on this discriminant to choose between
 * warn-and-continue (none of these — these are all vital-identity
 * errors) and throw-with-helpful-message (all of them).
 */
export interface BuildTimeReleaseError {
  readonly kind:
    | 'invalid_release_override'
    | 'missing_application_version'
    | 'invalid_application_version'
    | 'missing_branch_in_preview'
    | 'missing_git_sha'
    | 'invalid_git_sha';
  readonly message: string;
}

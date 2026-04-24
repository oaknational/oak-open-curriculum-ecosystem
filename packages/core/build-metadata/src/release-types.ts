/**
 * Shared types for the canonical release-name resolver.
 *
 * @remarks Extracted so the public-API module and the internals helper
 * module can both import these types without forming a depcruise
 * `no-circular` violation. Pure type module — no runtime exports.
 *
 * @packageDocumentation
 */

/**
 * Source the resolved release name was derived from.
 *
 * @remarks Mirrors the rows of the §Truth Tables release-identifier
 * table in the observability plan:
 *
 * - `SENTRY_RELEASE_OVERRIDE` — operator-supplied literal, takes
 *   precedence in any environment so local-dev rehearsals and one-off
 *   probes work without code changes.
 * - `application_version` — root `package.json` semver, used only on
 *   `VERCEL_ENV === 'production'` AND `VERCEL_GIT_COMMIT_REF === 'main'`
 *   (the only context where the root version is the released semver per
 *   the Vercel `ignoreCommand` gate).
 * - `vercel_branch_url` — leftmost label of `VERCEL_BRANCH_URL`'s
 *   hostname, used for preview builds and production-from-non-main
 *   (downgraded to preview per §Truth Tables row 2). The label is the
 *   Vercel-generated deploy hostname prefix, stable across redeploys of
 *   the same branch.
 * - `development_short_sha` — `dev-<shortSha>`, derived from
 *   `VERCEL_GIT_COMMIT_SHA`. Used for local builds without a Vercel
 *   branch URL.
 */
export type ReleaseSource =
  | 'SENTRY_RELEASE_OVERRIDE'
  | 'application_version'
  | 'vercel_branch_url'
  | 'development_short_sha';

/** Effective deployment environment the release name was derived for. */
export type ReleaseEnvironment = 'production' | 'preview' | 'development';

/**
 * Subset of environment variables consumed by `resolveRelease`.
 *
 * @remarks Both build-time callers and runtime callers supply this
 * shape — runtime callers via the
 * `SentryConfigEnvironment` extending `ReleaseInput` pattern in
 * `oaknational/sentry-node`. `APP_VERSION` is the production semver;
 * build-time callers inject it at the composition root via
 * `resolveApplicationVersion`, and runtime callers pass through the
 * env-var that build-time persisted into the deploy environment.
 *
 * Intentionally NO `[key: string]: string | undefined` index
 * signature: excess-property checking is preserved so typos in env
 * keys surface as compile errors, not as silent `undefined`-branch
 * drift at runtime. Callers pass a typed projection of `process.env`
 * (snapshotted at the boundary), not `process.env` itself.
 */
export interface ReleaseInput {
  readonly SENTRY_RELEASE_OVERRIDE?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_BRANCH_URL?: string;
  readonly VERCEL_GIT_COMMIT_REF?: string;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
  readonly APP_VERSION?: string;
}

/**
 * Resolved release identity returned by `resolveRelease`.
 *
 * @remarks Narrow contract: release-name value + provenance only.
 * Git-SHA provenance is resolved independently via `resolveGitSha`
 * (see {@link ./git-sha.js#resolveGitSha}) so the two concerns stay
 * decoupled at the resolver layer; the composition root composes both
 * into the persisted `BuildInfo` or the runtime Sentry config.
 */
export interface ResolvedRelease {
  readonly value: string;
  readonly source: ReleaseSource;
  readonly environment: ReleaseEnvironment;
}

/**
 * Errors that may short-circuit release-name resolution.
 *
 * @remarks Each `kind` corresponds to a single named failure mode in
 * the §Truth Tables fail-policy. The composition root branches on the
 * discriminant to choose between warn-and-continue (none of these —
 * these are all vital-identity errors) and throw-with-helpful-message
 * (all of them).
 */
export interface ReleaseError {
  readonly kind:
    | 'invalid_release_override'
    | 'missing_application_version'
    | 'invalid_application_version'
    | 'missing_branch_url_in_preview'
    | 'missing_git_sha';
  readonly message: string;
}

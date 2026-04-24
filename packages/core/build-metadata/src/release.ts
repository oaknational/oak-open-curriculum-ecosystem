/**
 * Canonical release-name resolver — single source of truth for
 * build-time AND runtime Sentry release identification.
 *
 * @remarks Replaces the former `resolveBuildTimeRelease` and the
 * bespoke `resolveSentryRelease` in `@oaknational/sentry-node`. Both
 * entry paths now call this function with a {@link ReleaseInput}
 * snapshot; the runtime path delegates via the thin adapter in
 * `packages/libs/sentry-node/src/config-resolution.ts` so that the
 * structural shape `SentryConfigEnvironment extends ReleaseInput`
 * makes release-resolution divergence impossible by construction.
 *
 * Precedence (mirrors §Truth Tables release-identifier table):
 *
 * 1. `SENTRY_RELEASE_OVERRIDE` — operator-supplied literal, honoured
 *    in every environment so local-dev rehearsals and one-off probes
 *    pin the release name.
 * 2. Effective environment selects one of three derivation rules:
 *    - `production` (`VERCEL_ENV=production` AND
 *      `VERCEL_GIT_COMMIT_REF=main`): `APP_VERSION` validated as
 *      stable semver. Pre-releases rejected.
 *    - `preview` (any other `VERCEL_ENV=production`/`preview`):
 *      leftmost label of `VERCEL_BRANCH_URL`'s hostname.
 *    - `development` (everything else): leftmost label of
 *      `VERCEL_BRANCH_URL` when set (for `vercel dev`); otherwise
 *      `dev-<shortSha>` from `VERCEL_GIT_COMMIT_SHA`.
 *
 * Errors are vital-identity failures per §Truth Tables; the
 * composition root MUST throw on any `err` result. This resolver is
 * pure and deterministic — no I/O, no module-init side effects.
 *
 * @example Build-time composition root
 * ```typescript
 * import { resolveApplicationVersion, resolveGitSha, resolveRelease }
 *   from '@oaknational/build-metadata';
 *
 * const version = resolveApplicationVersion(process.env);
 * if (!version.ok) throw new Error(version.error.message);
 *
 * const release = resolveRelease({
 *   SENTRY_RELEASE_OVERRIDE: process.env.SENTRY_RELEASE_OVERRIDE,
 *   VERCEL_ENV: process.env.VERCEL_ENV,
 *   VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
 *   VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
 *   VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
 *   APP_VERSION: version.value.value,
 * });
 * if (!release.ok) throw new Error(release.error.message);
 * ```
 *
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';

import {
  deriveEnvironment,
  resolveDevelopmentRelease,
  resolveOverride,
  resolvePreviewRelease,
  resolveProductionRelease,
} from './release-internals.js';
import type { ReleaseError, ReleaseInput, ResolvedRelease } from './release-types.js';

export type {
  ReleaseEnvironment,
  ReleaseError,
  ReleaseInput,
  ReleaseSource,
  ResolvedRelease,
} from './release-types.js';

/**
 * Resolve the canonical Sentry release identifier from a snapshotted
 * environment input.
 *
 * @remarks Entry point for both build-time and runtime release
 * resolution. Callers MUST pass a field-by-field snapshot of their
 * env surface (not a live `process.env` reference) so subsequent env
 * mutations cannot affect re-evaluation and tests remain deterministic.
 */
export function resolveRelease(input: ReleaseInput): Result<ResolvedRelease, ReleaseError> {
  const environment = deriveEnvironment(input);

  const override = resolveOverride(input, environment);
  if (override) {
    return override;
  }

  if (environment === 'production') {
    return resolveProductionRelease(input);
  }

  if (environment === 'preview') {
    return resolvePreviewRelease(input);
  }

  return resolveDevelopmentRelease(input);
}

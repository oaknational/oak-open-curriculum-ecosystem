import type {
  BuildTimeReleaseEnvironment,
  BuildTimeReleaseSource,
  ResolvedBuildTimeRelease,
} from './build-time-release.js';

/**
 * Persisted build-info file shape written to `dist/build-info.json`
 * during the build, consumed by the Sentry build plugin (verification),
 * runtime SDK initialisation (release tagging), and post-build
 * verification scripts.
 *
 * @remarks This is the L-8 Correction `Persist once, consume many`
 * artefact. Every consumer that needs the release name MUST read this
 * file rather than re-derive — re-derivation is what introduced the
 * `missing_app_version` drift `f9d5b0d2` shipped with.
 *
 * File path is fixed by convention at `<dist>/build-info.json`. The
 * dist directory is the workspace's esbuild output directory, not a
 * shared global location.
 */
export interface BuildInfo {
  /** Sentry release name the esbuild plugin uploaded artefacts under. */
  readonly release: string;
  /** Provenance of the release name; see {@link BuildTimeReleaseSource}. */
  readonly releaseSource: BuildTimeReleaseSource;
  /** Effective deployment environment for which the release was derived. */
  readonly environment: BuildTimeReleaseEnvironment;
  /** Full git SHA at build time (Vercel `VERCEL_GIT_COMMIT_SHA` or override), if available. */
  readonly gitSha: string | undefined;
  /** Repository branch ref at build time (Vercel `VERCEL_GIT_COMMIT_REF`), if available. */
  readonly branch: string | undefined;
  /** ISO-8601 UTC timestamp the build artefact was produced at. */
  readonly generatedAt: string;
  /** Schema version for forward-compatibility; bump when {@link BuildInfo} changes shape. */
  readonly schemaVersion: 1;
}

/**
 * Convert a resolved release record into the persisted
 * {@link BuildInfo} shape.
 *
 * @remarks Pure factory. Composition root passes the resolver result
 * + `VERCEL_GIT_COMMIT_REF` + `Date` so this function stays
 * test-friendly and deterministic.
 */
export function buildBuildInfo(input: {
  readonly release: ResolvedBuildTimeRelease;
  readonly branch: string | undefined;
  readonly now: Date;
}): BuildInfo {
  return {
    release: input.release.value,
    releaseSource: input.release.source,
    environment: input.release.environment,
    gitSha: input.release.gitSha,
    branch: input.branch,
    generatedAt: input.now.toISOString(),
    schemaVersion: 1,
  };
}

/**
 * Serialise {@link BuildInfo} to the on-disk JSON form.
 *
 * @remarks Stable two-space indent, trailing newline, and a fixed
 * field order via {@link buildBuildInfo}'s object-literal shape so
 * diffs are minimal across builds.
 */
export function serialiseBuildInfo(info: BuildInfo): string {
  return `${JSON.stringify(info, null, 2)}\n`;
}

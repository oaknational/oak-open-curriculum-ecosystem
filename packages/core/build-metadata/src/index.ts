export { resolveGitSha, type GitShaSource, type RuntimeMetadataError } from './git-sha.js';

export {
  getDisplayHostname,
  resolveApplicationVersion,
  type ApplicationVersionSource,
  type VercelDisplayHostnameEnvironment,
} from './runtime-metadata.js';

export {
  BUILD_IDENTITY_BRANCHES,
  BUILD_IDENTITY_CONTEXTS,
  RELEASE_ENVIRONMENTS,
  RELEASE_ERROR_KINDS,
  RELEASE_SOURCES,
  resolveRelease,
  type AppBuildIdentity,
  type BuildIdentityBranch,
  type BuildIdentityContext,
  type ReleaseEnvironment,
  type ReleaseError,
  type ReleaseInput,
  type ReleaseSource,
  type ResolvedRelease,
} from './release.js';

export { buildBuildInfo, serialiseBuildInfo, type BuildInfo } from './build-info.js';

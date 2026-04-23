export {
  getDisplayHostname,
  resolveApplicationVersion,
  resolveGitSha,
  type ApplicationVersionSource,
  type GitShaSource,
  type RuntimeMetadataError,
  type VercelDisplayHostnameEnvironment,
} from './runtime-metadata.js';

export {
  resolveBuildTimeRelease,
  type BuildTimeReleaseEnvironment,
  type BuildTimeReleaseEnvironmentInput,
  type BuildTimeReleaseError,
  type BuildTimeReleaseSource,
  type ResolvedBuildTimeRelease,
} from './build-time-release.js';

export { buildBuildInfo, serialiseBuildInfo, type BuildInfo } from './build-info.js';

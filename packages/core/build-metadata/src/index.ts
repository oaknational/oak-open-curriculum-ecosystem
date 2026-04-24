export { resolveGitSha, type GitShaSource, type RuntimeMetadataError } from './git-sha.js';

export {
  getDisplayHostname,
  resolveApplicationVersion,
  type ApplicationVersionSource,
  type VercelDisplayHostnameEnvironment,
} from './runtime-metadata.js';

export {
  resolveRelease,
  type ReleaseEnvironment,
  type ReleaseError,
  type ReleaseInput,
  type ReleaseSource,
  type ResolvedRelease,
} from './release.js';

export { buildBuildInfo, serialiseBuildInfo, type BuildInfo } from './build-info.js';

import { err, isErr, ok, type Result } from '@oaknational/result';

import type { WorkspaceAttributionConfig } from './config-classification-model.js';
import { EstateReviewError } from './errors.js';
import type { WorkspaceRecord } from './file-model.js';
import type {
  AuxiliaryBlobRead,
  GitSnapshotAuxiliaryReader,
  TrackedTreeEntry,
} from './git-snapshot-model.js';
import type { RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';
import {
  compileWorkspacePackageNamePattern,
  parseWorkspacePackageName,
} from './workspace-package-manifest.js';
import { matchesWorkspaceRoot } from './workspace-pattern.js';
import { parseWorkspaceYaml } from './workspace-yaml.js';

interface DiscoverWorkspacesInput {
  readonly config: WorkspaceAttributionConfig;
  readonly treeEntries: readonly TrackedTreeEntry[];
  readonly auxiliary: GitSnapshotAuxiliaryReader;
}

const REGULAR_BLOB_MODES = new Set(['100644', '100755']);

export function discoverWorkspaces(
  input: DiscoverWorkspacesInput,
): Result<readonly WorkspaceRecord[], EstateReviewError> {
  const packageNamePattern = compileWorkspacePackageNamePattern(input.config);
  if (isErr(packageNamePattern)) {
    return packageNamePattern;
  }
  const workspaceManifest = readRequired(input.auxiliary, input.config.manifestPath);
  if (isErr(workspaceManifest)) {
    return workspaceManifest;
  }
  const patterns = parseWorkspaceYaml(workspaceManifest.value.bytes, input.config);
  if (isErr(patterns)) {
    return patterns;
  }
  const candidates = selectCandidateManifests(input.treeEntries, patterns.value);
  if (isErr(candidates)) {
    return candidates;
  }
  return parseCandidates(input.auxiliary, candidates.value, packageNamePattern.value);
}

function selectCandidateManifests(
  treeEntries: readonly TrackedTreeEntry[],
  patterns: readonly string[],
): Result<readonly TrackedTreeEntry[], EstateReviewError> {
  const candidates: TrackedTreeEntry[] = [];
  for (const entry of treeEntries) {
    const root = candidateRoot(entry.path);
    if (root === null || !patterns.some((pattern) => matchesWorkspaceRoot(root, pattern))) {
      continue;
    }
    if (!isRegularBlob(entry)) {
      return err(
        new EstateReviewError(
          'SNAPSHOT_INVALID',
          `matched workspace manifest '${entry.path}' is not a regular blob with a declared size`,
        ),
      );
    }
    candidates.push({ path: entry.path, treeEntry: { ...entry.treeEntry } });
  }
  candidates.sort((left, right) => compareUtf16(left.path, right.path));
  return ok(candidates);
}

function parseCandidates(
  auxiliary: GitSnapshotAuxiliaryReader,
  candidates: readonly TrackedTreeEntry[],
  packageNamePattern: RegExp,
): Result<readonly WorkspaceRecord[], EstateReviewError> {
  const workspaces: WorkspaceRecord[] = [];
  const names = new Map<string, RepoPath>();
  for (const candidate of candidates) {
    const read = readRequired(auxiliary, candidate.path);
    if (isErr(read)) {
      return read;
    }
    const name = parseWorkspacePackageName(candidate.path, read.value.bytes, packageNamePattern);
    if (isErr(name)) {
      return name;
    }
    const previous = names.get(name.value);
    if (previous !== undefined) {
      return err(
        new EstateReviewError(
          'SNAPSHOT_INVALID',
          `workspace package name '${name.value}' is duplicated by '${previous}' and '${candidate.path}'`,
        ),
      );
    }
    names.set(name.value, candidate.path);
    const root = candidateRoot(candidate.path);
    if (root === null) {
      return err(new EstateReviewError('SNAPSHOT_INVALID', 'root package cannot be a workspace'));
    }
    workspaces.push({ root, name: name.value, manifestPath: candidate.path });
  }
  return ok(workspaces);
}

function readRequired(
  auxiliary: GitSnapshotAuxiliaryReader,
  path: RepoPath,
): Result<AuxiliaryBlobRead, EstateReviewError> {
  const read = auxiliary.read(path);
  if (!isErr(read)) {
    return read;
  }
  return read.error instanceof EstateReviewError
    ? err(read.error)
    : err(
        new EstateReviewError('SNAPSHOT_INVALID', `required pinned blob '${path}' is unavailable`, {
          cause: read.error,
        }),
      );
}

function candidateRoot(path: RepoPath): RepoPath | null {
  const segments = path.split('/');
  if (segments.length < 2 || segments.at(-1) !== 'package.json') {
    return null;
  }
  return segments.slice(0, -1).join('/');
}

function isRegularBlob(entry: TrackedTreeEntry): boolean {
  return (
    entry.treeEntry.type === 'blob' &&
    REGULAR_BLOB_MODES.has(entry.treeEntry.mode) &&
    entry.treeEntry.size !== null
  );
}

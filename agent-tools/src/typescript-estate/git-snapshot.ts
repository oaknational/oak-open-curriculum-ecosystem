import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
export { MissingAuxiliaryBlobRefusal, NonRegularAuxiliaryBlobRefusal } from './errors.js';
export type { AuxiliaryBlobReadRefusal } from './errors.js';
export type {
  AuxiliaryBlobRead,
  AuxiliaryBlobReadObservation,
  CaptureGitSnapshotInput,
  GitSnapshotAuxiliaryReader,
  GitSnapshotLimits,
  GitSourceSnapshot,
  GitTreeEnumeration,
  InvalidUtf8SnapshotSource,
  ReadableSnapshotSource,
  SnapshotPathPort,
  SnapshotSource,
  UnsupportedSnapshotSource,
  RegularBlobTreeEntry,
  TrackedTreeEntry,
} from './git-snapshot-model.js';
import type {
  CaptureGitSnapshotInput,
  GitContext,
  GitSnapshotLimits,
  GitSourceSnapshot,
} from './git-snapshot-model.js';
import { createAuxiliaryBlobReader } from './git-snapshot-auxiliary-read.js';
import { createPinnedGitBlobPort } from './git-snapshot-pinned-blob.js';
import { decodeSingleLine, gitEnvironment, runGit } from './git-snapshot-process.js';
import { readSources } from './git-snapshot-source-read.js';
import { enumerateTree } from './git-snapshot-tree.js';

const RESOLUTION_STDOUT_LIMIT = 4096;
const GIT_OBJECT_ID = /^[a-f0-9]{40,64}$/u;

/**
 * Resolve one ref and census every `.ts`/`.tsx` path from its Git tree.
 *
 * Filesystem source reads are impossible at this boundary: every source byte
 * comes from one `git show <commit>:<path>` object-store invocation.
 */
export function captureGitSnapshot(
  input: CaptureGitSnapshotInput,
): Result<GitSourceSnapshot, EstateReviewError> {
  const validInput = validateSnapshotInput(input);
  if (isErr(validInput)) {
    return validInput;
  }
  const environment = gitEnvironment(input.inheritedEnvironment);
  const root = discoverInvokingGitRoot(input, environment);
  return isErr(root) ? root : captureFromRoot(input, environment, root.value);
}

function captureFromRoot(
  input: CaptureGitSnapshotInput,
  environment: Readonly<Record<string, string>>,
  root: string,
): Result<GitSourceSnapshot, EstateReviewError> {
  const context: GitContext = {
    executable: input.gitExecutable,
    cwd: root,
    root,
    env: environment,
    stderrLimit: input.limits.maxGitStderrBytes,
    process: input.process,
  };
  const commit = resolveObject(context, `${input.inputRef}^{commit}`, 'commit');
  if (isErr(commit)) {
    return commit;
  }
  const treeObject = resolveObject(context, `${commit.value}^{tree}`, 'tree');
  if (isErr(treeObject)) {
    return treeObject;
  }
  const enumeration = enumerateTree(context, commit.value, input.limits);
  if (isErr(enumeration)) {
    return enumeration;
  }
  const files = readSources(context, commit.value, enumeration.value.sources, input.limits);
  if (isErr(files)) {
    return files;
  }
  return ok({
    invokingGitRoot: root,
    record: {
      inputRef: input.inputRef,
      commit: commit.value,
      tree: treeObject.value,
      source: 'git-tree',
    },
    treeEntries: enumeration.value.treeEntries,
    files: files.value,
    auxiliary: createAuxiliaryBlobReader({
      treeEntries: enumeration.value.treeEntries,
      sources: files.value,
      limits: input.limits,
      pinnedBlobs: createPinnedGitBlobPort(context, commit.value),
    }),
  });
}

function validateSnapshotInput(
  input: CaptureGitSnapshotInput,
): Result<undefined, EstateReviewError> {
  if (input.inputRef.length === 0 || input.inputRef.includes('\0')) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', 'snapshot ref must be one non-empty argv value'),
    );
  }
  if (!path.isAbsolute(input.gitExecutable)) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', 'trusted Git executable must be an absolute path'),
    );
  }
  const invalid = limitValues(input.limits).find(
    ({ value }) => !Number.isSafeInteger(value) || value < 1,
  );
  return invalid === undefined
    ? ok(undefined)
    : err(
        new EstateReviewError(
          'CONFIG_INVALID',
          `snapshot limit ${invalid.name} must be a positive safe integer`,
        ),
      );
}

function limitValues(
  limits: GitSnapshotLimits,
): readonly { readonly name: string; readonly value: number }[] {
  return [
    { name: 'maxTrackedPaths', value: limits.maxTrackedPaths },
    { name: 'maxTreeListingBytes', value: limits.maxTreeListingBytes },
    { name: 'maxGitStderrBytes', value: limits.maxGitStderrBytes },
    { name: 'maxTotalSourceBytes', value: limits.maxTotalSourceBytes },
    { name: 'maxSourceBytesPerFile', value: limits.maxSourceBytesPerFile },
    { name: 'maxTotalAuxiliaryBlobBytes', value: limits.maxTotalAuxiliaryBlobBytes },
    { name: 'maxAuxiliaryBlobBytesPerFile', value: limits.maxAuxiliaryBlobBytesPerFile },
  ];
}

function discoverInvokingGitRoot(
  input: CaptureGitSnapshotInput,
  env: Readonly<Record<string, string>>,
): Result<string, EstateReviewError> {
  const result = runGit(
    {
      executable: input.gitExecutable,
      cwd: input.callerCwd,
      root: input.callerCwd,
      env,
      stderrLimit: input.limits.maxGitStderrBytes,
      process: input.process,
    },
    ['-C', input.callerCwd, 'rev-parse', '--show-toplevel'],
    RESOLUTION_STDOUT_LIMIT,
    'SNAPSHOT_INVALID',
    'Git root discovery',
  );
  if (isErr(result)) {
    return result;
  }
  const printed = decodeSingleLine(result.value, 'Git root');
  return isErr(printed) ? printed : canonicalRoot(input, printed.value);
}

function canonicalRoot(
  input: CaptureGitSnapshotInput,
  printedRoot: string,
): Result<string, EstateReviewError> {
  try {
    const canonical = input.paths.canonicalRealpath(printedRoot);
    return path.isAbsolute(canonical)
      ? ok(canonical)
      : err(new EstateReviewError('SNAPSHOT_INVALID', 'Git root is not absolute'));
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', 'cannot canonicalise invoking Git root', { cause }),
    );
  }
}

function resolveObject(
  context: GitContext,
  revision: string,
  label: 'commit' | 'tree',
): Result<string, EstateReviewError> {
  const result = runGit(
    context,
    ['-C', context.root, 'rev-parse', '--verify', '--end-of-options', revision],
    RESOLUTION_STDOUT_LIMIT,
    'SNAPSHOT_INVALID',
    `${label} resolution`,
  );
  if (isErr(result)) {
    return result;
  }
  const objectId = decodeSingleLine(result.value, label);
  if (isErr(objectId)) {
    return objectId;
  }
  return GIT_OBJECT_ID.test(objectId.value)
    ? objectId
    : err(new EstateReviewError('SNAPSHOT_INVALID', `${label} is not a full Git object id`));
}

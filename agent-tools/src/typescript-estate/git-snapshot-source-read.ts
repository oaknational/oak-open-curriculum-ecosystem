import { createHash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import { EstateReviewError } from './errors.js';
import type { TreeEntry } from './file-model.js';
import type {
  GitContext,
  GitSnapshotLimits,
  InvalidUtf8SnapshotSource,
  ParsedTreeSource,
  ReadableSnapshotSource,
  SnapshotSource,
  UnsupportedSnapshotSource,
} from './git-snapshot-model.js';
import { decodeUtf8, runGit } from './git-snapshot-process.js';

const REGULAR_BLOB_MODES = new Set(['100644', '100755']);

export function readSources(
  context: GitContext,
  commit: string,
  sources: readonly ParsedTreeSource[],
  limits: GitSnapshotLimits,
): Result<readonly SnapshotSource[], EstateReviewError> {
  const files: SnapshotSource[] = [];
  let totalBytes = 0;
  for (const source of sources) {
    if (!isRegularBlob(source.treeEntry)) {
      files.push(unsupportedSource(source));
      continue;
    }
    const bytes = readSourceBytes(context, commit, source, limits);
    if (isErr(bytes)) {
      return bytes;
    }
    totalBytes += bytes.value.byteLength;
    if (totalBytes > limits.maxTotalSourceBytes) {
      return err(
        new EstateReviewError(
          'RESOURCE_LIMIT',
          `total source-byte limit ${String(limits.maxTotalSourceBytes)} exceeded`,
        ),
      );
    }
    files.push(decodeSource(source, bytes.value));
  }
  return ok(files);
}

function readSourceBytes(
  context: GitContext,
  commit: string,
  source: ParsedTreeSource,
  limits: GitSnapshotLimits,
): Result<Uint8Array, EstateReviewError> {
  const result = runGit(
    context,
    ['-C', context.root, 'show', `${commit}:${source.path}`],
    limits.maxSourceBytesPerFile,
    'SOURCE_READ_FAILED',
    `Git source read '${source.path}'`,
  );
  if (isErr(result)) {
    return result;
  }
  return source.treeEntry.size === result.value.byteLength
    ? result
    : err(
        new EstateReviewError(
          'SNAPSHOT_INVALID',
          `Git tree size and source bytes differ for '${source.path}'`,
        ),
      );
}

function decodeSource(source: ParsedTreeSource, bytes: Uint8Array): SnapshotSource {
  const digest = sha256(bytes);
  const decoded = decodeUtf8(bytes, `source '${source.path}'`);
  return isErr(decoded)
    ? invalidUtf8Source(source, bytes, digest, decoded.error.message)
    : readableSource(source, bytes, decoded.value, digest);
}

function readableSource(
  source: ParsedTreeSource,
  bytes: Uint8Array,
  text: string,
  digest: string,
): ReadableSnapshotSource {
  const sourceFile = createSourceFile(
    source.path,
    text,
    ScriptTarget.Latest,
    false,
    source.extension === '.tsx' ? ScriptKind.TSX : ScriptKind.TS,
  );
  return {
    ...source,
    bytes,
    text,
    sourceFile,
    read: {
      status: 'read',
      contentSha256: digest,
      byteCount: bytes.byteLength,
      lineCount: sourceFile.getLineStarts().length,
    },
  };
}

function invalidUtf8Source(
  source: ParsedTreeSource,
  bytes: Uint8Array,
  digest: string,
  message: string,
): InvalidUtf8SnapshotSource {
  return {
    ...source,
    bytes,
    read: {
      status: 'invalid-utf8',
      code: 'SOURCE_INVALID_UTF8',
      message,
      contentSha256: digest,
      byteCount: bytes.byteLength,
      lineCount: null,
    },
  };
}

function unsupportedSource(source: ParsedTreeSource): UnsupportedSnapshotSource {
  return {
    ...source,
    read: {
      status: 'unsupported-mode',
      mode: source.treeEntry.mode,
      message: `TypeScript path is not a regular Git blob (${source.treeEntry.mode} ${source.treeEntry.type})`,
      contentSha256: null,
      byteCount: null,
      lineCount: null,
    },
  };
}

function isRegularBlob(entry: TreeEntry): boolean {
  return entry.type === 'blob' && REGULAR_BLOB_MODES.has(entry.mode);
}

function sha256(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

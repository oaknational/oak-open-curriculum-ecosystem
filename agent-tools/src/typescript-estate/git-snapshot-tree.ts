import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import type {
  GitContext,
  GitSnapshotLimits,
  GitTreeEnumeration,
  ParsedTreeSource,
  TrackedTreeEntry,
} from './git-snapshot-model.js';
import { decodeUtf8, runGit } from './git-snapshot-process.js';
import { compareUtf16 } from './utf16-order.js';

interface ParsedHeader {
  readonly mode: string;
  readonly type: string;
  readonly object: string;
  readonly size: number | null;
}

interface FramedTreeRecord {
  readonly header: Uint8Array;
  readonly path: Uint8Array;
}

export function enumerateTree(
  context: GitContext,
  commit: string,
  limits: GitSnapshotLimits,
): Result<GitTreeEnumeration, EstateReviewError> {
  const listing = runGit(
    context,
    ['-C', context.root, 'ls-tree', '-r', '-z', '--long', commit],
    limits.maxTreeListingBytes,
    'SNAPSHOT_INVALID',
    'complete Git tree enumeration',
  );
  if (isErr(listing)) {
    return listing;
  }
  const records = splitNulRecords(listing.value);
  if (isErr(records)) {
    return records;
  }
  if (records.value.length > limits.maxTrackedPaths) {
    return err(
      new EstateReviewError(
        'RESOURCE_LIMIT',
        `tracked-path limit ${String(limits.maxTrackedPaths)} exceeded; refusing truncation`,
      ),
    );
  }
  return parseAndOrderTree(records.value);
}

function parseAndOrderTree(
  records: readonly Uint8Array[],
): Result<GitTreeEnumeration, EstateReviewError> {
  const treeEntries: TrackedTreeEntry[] = [];
  for (const record of records) {
    const parsed = parseTreeRecord(record);
    if (isErr(parsed)) {
      return parsed;
    }
    treeEntries.push(parsed.value);
  }
  treeEntries.sort((left, right) => compareUtf16(left.path, right.path));
  const duplicate = treeEntries.find((entry, index) => entry.path === treeEntries[index - 1]?.path);
  if (duplicate !== undefined) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', `duplicate tree path '${duplicate.path}'`),
    );
  }
  return ok({ treeEntries, sources: sourceEntries(treeEntries) });
}

function sourceEntries(treeEntries: readonly TrackedTreeEntry[]): readonly ParsedTreeSource[] {
  return treeEntries.flatMap((entry) => {
    const extension = sourceExtension(entry.path);
    return extension === undefined ? [] : [{ ...entry, extension }];
  });
}

function splitNulRecords(bytes: Uint8Array): Result<readonly Uint8Array[], EstateReviewError> {
  if (bytes.byteLength === 0) {
    return ok([]);
  }
  if (bytes.at(-1) !== 0) {
    return err(new EstateReviewError('SNAPSHOT_INVALID', 'Git tree listing lacks terminal NUL'));
  }
  const records: Uint8Array[] = [];
  let start = 0;
  for (let index = 0; index < bytes.byteLength; index += 1) {
    if (bytes[index] === 0) {
      const appended = appendRecord(records, bytes, start, index);
      if (isErr(appended)) {
        return appended;
      }
      start = index + 1;
    }
  }
  return ok(records);
}

function appendRecord(
  records: Uint8Array[],
  bytes: Uint8Array,
  start: number,
  end: number,
): Result<undefined, EstateReviewError> {
  if (start === end) {
    return err(new EstateReviewError('SNAPSHOT_INVALID', 'Git tree listing has an empty record'));
  }
  records.push(bytes.slice(start, end));
  return ok(undefined);
}

function parseTreeRecord(record: Uint8Array): Result<TrackedTreeEntry, EstateReviewError> {
  const framed = frameTreeRecord(record);
  if (isErr(framed)) {
    return framed;
  }
  const headerText = decodeUtf8(framed.value.header, 'Git tree header');
  if (isErr(headerText)) {
    return err(headerText.error);
  }
  const repoPath = decodeUtf8(framed.value.path, 'Git tree path');
  if (isErr(repoPath)) {
    return err(repoPath.error);
  }
  const header = parseHeader(headerText.value);
  if (isErr(header)) {
    return err(header.error);
  }
  if (!isSafeRepoPath(repoPath.value)) {
    return err(new EstateReviewError('SNAPSHOT_INVALID', 'invalid Git tree path'));
  }
  return ok({
    path: repoPath.value,
    treeEntry: header.value,
  });
}

function frameTreeRecord(record: Uint8Array): Result<FramedTreeRecord, EstateReviewError> {
  const tab = record.indexOf(9);
  if (tab < 1 || tab === record.byteLength - 1) {
    return err(new EstateReviewError('SNAPSHOT_INVALID', 'invalid Git tree record framing'));
  }
  return ok({
    header: record.slice(0, tab),
    path: record.slice(tab + 1),
  });
}

function parseHeader(value: string): Result<ParsedHeader, EstateReviewError> {
  const match = /^([0-7]{6}) (blob|tree|commit) ([a-f0-9]{40,64}) +(\d+|-)$/u.exec(value);
  if (match === null) {
    return err(new EstateReviewError('SNAPSHOT_INVALID', 'invalid Git tree record content'));
  }
  const mode = capture(match, 1);
  const type = capture(match, 2);
  const object = capture(match, 3);
  const sizeText = capture(match, 4);
  const size = sizeText === '-' ? null : Number(sizeText);
  return size === null || (Number.isSafeInteger(size) && size >= 0)
    ? ok({ mode, type, object, size })
    : err(new EstateReviewError('SNAPSHOT_INVALID', 'invalid Git tree blob size'));
}

function capture(match: RegExpExecArray, index: number): string {
  return match[index] ?? '';
}

function sourceExtension(value: string): '.ts' | '.tsx' | undefined {
  if (value.endsWith('.tsx')) {
    return '.tsx';
  }
  return value.endsWith('.ts') ? '.ts' : undefined;
}

function isSafeRepoPath(value: string): boolean {
  return (
    value.length > 0 &&
    !value.startsWith('/') &&
    !value.includes('\0') &&
    !value.split('/').includes('..')
  );
}

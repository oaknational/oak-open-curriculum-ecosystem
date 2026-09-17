import { createHash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';

import type { AuxiliaryReadRecord } from './document-model.js';
import { EstateReviewError } from './errors.js';
import type { TreeEntry } from './file-model.js';
import type { TrackedTreeEntry } from './git-snapshot-model.js';
import type { RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

export interface AuxiliaryReadObservation {
  readonly path: RepoPath;
  readonly treeEntry: TreeEntry;
  readonly bytes: Uint8Array;
}

export interface AuxiliaryReadSemanticInput {
  readonly assertedReads: readonly AuxiliaryReadRecord[];
  readonly observedReads: readonly AuxiliaryReadObservation[];
  readonly treeEntries: readonly TrackedTreeEntry[];
  readonly maxTotalAuxiliaryBlobBytes: number;
}

/** Recompute the published auxiliary ledger from exact cached pinned bytes. */
export function validateAuxiliaryReadSemantics(
  input: AuxiliaryReadSemanticInput,
): Result<undefined, EstateReviewError> {
  const assertedOrder = validateStrictPathOrder(
    input.assertedReads,
    'asserted auxiliary reads are not strictly path ordered',
  );
  if (isErr(assertedOrder)) {
    return assertedOrder;
  }
  const observedOrder = validateStrictPathOrder(
    input.observedReads,
    'observed auxiliary reads are not strictly path ordered',
  );
  if (isErr(observedOrder)) {
    return observedOrder;
  }
  if (!samePaths(input.assertedReads, input.observedReads)) {
    return invalid('auxiliary read ledger does not equal the successful read cache');
  }

  return validateReadRecords(input);
}

function validateReadRecords(
  input: AuxiliaryReadSemanticInput,
): Result<undefined, EstateReviewError> {
  const indexed = indexTreeEntries(input.treeEntries);
  if (isErr(indexed)) {
    return indexed;
  }
  const typescriptPaths = new Set(
    input.treeEntries.filter(({ path }) => isTypeScriptPath(path)).map(({ path }) => path),
  );
  let totalBytes = 0;

  for (let index = 0; index < input.assertedReads.length; index += 1) {
    const asserted = input.assertedReads[index];
    const observed = input.observedReads[index];
    if (asserted === undefined || observed === undefined) {
      return invalid('auxiliary read ledger does not equal the successful read cache');
    }
    const validated = validateReadRecord(asserted, observed, indexed.value, typescriptPaths);
    if (isErr(validated)) {
      return validated;
    }
    totalBytes += asserted.byteCount;
    if (totalBytes > input.maxTotalAuxiliaryBlobBytes) {
      return invalid('auxiliary read bytes exceed the run-wide limit');
    }
  }
  return ok(undefined);
}

function validateReadRecord(
  asserted: AuxiliaryReadRecord,
  observed: AuxiliaryReadObservation,
  indexed: ReadonlyMap<RepoPath, TreeEntry>,
  typescriptPaths: ReadonlySet<RepoPath>,
): Result<undefined, EstateReviewError> {
  if (typescriptPaths.has(asserted.path)) {
    return invalid(`auxiliary read '${asserted.path}' is in the TypeScript denominator`);
  }
  const indexedEntry = requireRegularIndexedEntry(asserted.path, indexed);
  if (isErr(indexedEntry)) {
    return indexedEntry;
  }
  const identities = validateTreeIdentities(asserted, observed, indexedEntry.value);
  return isErr(identities)
    ? identities
    : validateObservedBytes(asserted, observed, indexedEntry.value);
}

function requireRegularIndexedEntry(
  path: RepoPath,
  indexed: ReadonlyMap<RepoPath, TreeEntry>,
): Result<RegularTreeEntry, EstateReviewError> {
  const entry = indexed.get(path);
  return entry !== undefined && isRegularBlob(entry)
    ? ok(entry)
    : invalid(`auxiliary read '${path}' is not an indexed regular blob`);
}

function validateTreeIdentities(
  asserted: AuxiliaryReadRecord,
  observed: AuxiliaryReadObservation,
  indexedEntry: RegularTreeEntry,
): Result<undefined, EstateReviewError> {
  if (!sameTreeEntry(asserted.treeEntry, indexedEntry)) {
    return invalid(`auxiliary read '${asserted.path}' tree entry does not equal the index`);
  }
  if (!sameTreeEntry(observed.treeEntry, indexedEntry)) {
    return invalid(
      `auxiliary read '${asserted.path}' observed tree entry does not equal the index`,
    );
  }
  return ok(undefined);
}

function validateObservedBytes(
  asserted: AuxiliaryReadRecord,
  observed: AuxiliaryReadObservation,
  indexedEntry: RegularTreeEntry,
): Result<undefined, EstateReviewError> {
  if (asserted.byteCount !== observed.bytes.byteLength) {
    return invalid(`auxiliary read '${asserted.path}' byteCount does not equal pinned bytes`);
  }
  if (asserted.byteCount !== indexedEntry.size) {
    return invalid(`auxiliary read '${asserted.path}' byteCount does not equal indexed size`);
  }
  return asserted.contentSha256 === sha256(observed.bytes)
    ? ok(undefined)
    : invalid(`auxiliary read '${asserted.path}' digest does not equal pinned bytes`);
}

function validateStrictPathOrder(
  values: readonly { readonly path: RepoPath }[],
  message: string,
): Result<undefined, EstateReviewError> {
  const outOfOrder = values.find(
    (value, index) => index > 0 && compareUtf16(values[index - 1]?.path ?? '', value.path) >= 0,
  );
  return outOfOrder === undefined ? ok(undefined) : invalid(message);
}

function samePaths(
  left: readonly { readonly path: RepoPath }[],
  right: readonly { readonly path: RepoPath }[],
): boolean {
  return (
    left.length === right.length && left.every((value, index) => value.path === right[index]?.path)
  );
}

function indexTreeEntries(
  treeEntries: readonly TrackedTreeEntry[],
): Result<ReadonlyMap<RepoPath, TreeEntry>, EstateReviewError> {
  const indexed = new Map<RepoPath, TreeEntry>();
  for (const entry of treeEntries) {
    if (indexed.has(entry.path)) {
      return invalid(`whole-tree index repeats '${entry.path}'`);
    }
    indexed.set(entry.path, entry.treeEntry);
  }
  return ok(indexed);
}

type RegularTreeEntry = TreeEntry & {
  readonly mode: '100644' | '100755';
  readonly type: 'blob';
  readonly size: number;
};

function isRegularBlob(entry: TreeEntry): entry is RegularTreeEntry {
  return (
    entry.type === 'blob' &&
    (entry.mode === '100644' || entry.mode === '100755') &&
    entry.size !== null
  );
}

function sameTreeEntry(left: TreeEntry, right: TreeEntry): boolean {
  return (
    left.mode === right.mode &&
    left.type === right.type &&
    left.object === right.object &&
    left.size === right.size
  );
}

function isTypeScriptPath(path: RepoPath): boolean {
  return path.endsWith('.ts') || path.endsWith('.tsx');
}

function sha256(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function invalid(message: string): Result<never, EstateReviewError> {
  return err(new EstateReviewError('VALIDATION_FAILED', message));
}

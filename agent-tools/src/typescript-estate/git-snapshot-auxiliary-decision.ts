import { createHash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  EstateReviewError,
  MissingAuxiliaryBlobRefusal,
  NonRegularAuxiliaryBlobRefusal,
} from './errors.js';
import type {
  AuxiliaryBlobRead,
  GitSnapshotLimits,
  RegularBlobTreeEntry,
} from './git-snapshot-model.js';
import type { TreeEntry } from './file-model.js';
import type { RepoPath, Sha256 } from './scalar-model.js';

/** Exact captured TypeScript bytes that can be reused without auxiliary charge. */
export interface CapturedAuxiliarySource {
  readonly bytes: Uint8Array;
  readonly contentSha256: Sha256;
}

/** One internally owned, successful non-TypeScript auxiliary read. */
export interface AuxiliaryBlobCacheEntry extends CapturedAuxiliarySource {
  readonly path: RepoPath;
  readonly treeEntry: RegularBlobTreeEntry;
}

/** Explicit run-scoped state consulted by the pure read decision. */
export interface AuxiliaryBlobCacheState {
  readonly entries: readonly AuxiliaryBlobCacheEntry[];
  readonly chargedBytes: number;
  readonly terminalError: EstateReviewError | null;
}

export interface AuxiliaryBlobReadDecisionInput {
  readonly path: RepoPath;
  readonly trackedEntry: TreeEntry | undefined;
  readonly isTypescriptPath: boolean;
  readonly capturedSource: CapturedAuxiliarySource | undefined;
  readonly cache: AuxiliaryBlobCacheState;
  readonly limits: GitSnapshotLimits;
}

export interface AuxiliaryBlobFetchAction {
  readonly path: RepoPath;
  readonly treeEntry: RegularBlobTreeEntry;
  readonly maxBytes: number;
}

/**
 * Only `fetch-required` carries an action. Every other branch is therefore
 * incapable of invoking the pinned-blob port by construction.
 */
export type AuxiliaryBlobReadDecision =
  | { readonly kind: 'fatal-latched'; readonly error: EstateReviewError }
  | { readonly kind: 'missing-path'; readonly refusal: MissingAuxiliaryBlobRefusal }
  | {
      readonly kind: 'nonregular-entry';
      readonly refusal: NonRegularAuxiliaryBlobRefusal;
    }
  | { readonly kind: 'captured-source'; readonly read: AuxiliaryBlobRead }
  | { readonly kind: 'cache-hit'; readonly read: AuxiliaryBlobRead }
  | { readonly kind: 'captured-source-missing'; readonly error: EstateReviewError }
  | { readonly kind: 'budget-exceeded'; readonly error: EstateReviewError }
  | { readonly kind: 'fetch-required'; readonly action: AuxiliaryBlobFetchAction };

/** Decide one auxiliary read without performing I/O or mutating run state. */
export function decideAuxiliaryBlobRead(
  input: AuxiliaryBlobReadDecisionInput,
): AuxiliaryBlobReadDecision {
  if (input.cache.terminalError !== null) {
    return { kind: 'fatal-latched', error: input.cache.terminalError };
  }
  if (input.trackedEntry === undefined) {
    return { kind: 'missing-path', refusal: new MissingAuxiliaryBlobRefusal(input.path) };
  }
  if (!isRegularBlob(input.trackedEntry)) {
    return {
      kind: 'nonregular-entry',
      refusal: new NonRegularAuxiliaryBlobRefusal(input.path, input.trackedEntry),
    };
  }
  if (input.isTypescriptPath) {
    return decideCapturedSourceRead(input.path, input.trackedEntry, input.capturedSource);
  }
  const cached = input.cache.entries.find(({ path }) => path === input.path);
  if (cached !== undefined) {
    return { kind: 'cache-hit', read: publicRead(cached) };
  }
  const budgetError = preflightBudget(
    input.path,
    input.trackedEntry.size,
    input.cache.chargedBytes,
    input.limits,
  );
  return budgetError === null
    ? {
        kind: 'fetch-required',
        action: {
          path: input.path,
          treeEntry: { ...input.trackedEntry },
          maxBytes: input.limits.maxAuxiliaryBlobBytesPerFile,
        },
      }
    : { kind: 'budget-exceeded', error: budgetError };
}

/** Decide a TypeScript path's read from the snapshot's already-captured bytes. */
function decideCapturedSourceRead(
  path: RepoPath,
  trackedEntry: RegularBlobTreeEntry,
  capturedSource: CapturedAuxiliarySource | undefined,
): AuxiliaryBlobReadDecision {
  return capturedSource === undefined
    ? {
        kind: 'captured-source-missing',
        error: new EstateReviewError(
          'SNAPSHOT_INVALID',
          `regular TypeScript source '${path}' has no captured bytes`,
        ),
      }
    : {
        kind: 'captured-source',
        read: publicRead({
          path,
          treeEntry: trackedEntry,
          bytes: capturedSource.bytes,
          contentSha256: capturedSource.contentSha256,
        }),
      };
}

export interface AuxiliaryBlobFetchTransition {
  readonly state: AuxiliaryBlobCacheState;
  readonly result: Result<AuxiliaryBlobRead, EstateReviewError>;
}

/**
 * Apply one semantic fetch result as an immutable cache transition.
 *
 * Exact indexed size is checked before bytes are copied, hashed, charged, and
 * cached once. Any failure becomes the run's terminal auxiliary error.
 */
export function applyAuxiliaryBlobFetch(
  state: AuxiliaryBlobCacheState,
  action: AuxiliaryBlobFetchAction,
  fetched: Result<Uint8Array, EstateReviewError>,
): AuxiliaryBlobFetchTransition {
  if (state.terminalError !== null) {
    return { state, result: err(state.terminalError) };
  }
  if (isErr(fetched)) {
    return failedTransition(state, fetched.error);
  }
  if (fetched.value.byteLength !== action.treeEntry.size) {
    return failedTransition(
      state,
      new EstateReviewError(
        'SNAPSHOT_INVALID',
        `Git tree size and auxiliary bytes differ for '${action.path}'`,
      ),
    );
  }
  if (state.entries.some(({ path }) => path === action.path)) {
    return failedTransition(
      state,
      new EstateReviewError(
        'SNAPSHOT_INVALID',
        `auxiliary blob '${action.path}' was fetched after it had already been cached`,
      ),
    );
  }
  const bytes = Uint8Array.from(fetched.value);
  const cached: AuxiliaryBlobCacheEntry = {
    path: action.path,
    treeEntry: { ...action.treeEntry },
    bytes,
    contentSha256: createHash('sha256').update(bytes).digest('hex'),
  };
  return {
    state: {
      entries: [...state.entries, cached],
      chargedBytes: state.chargedBytes + bytes.byteLength,
      terminalError: null,
    },
    result: ok(publicRead(cached)),
  };
}

/** Latch a non-fetch fatal decision without changing cached successes. */
export function latchAuxiliaryBlobError(
  state: AuxiliaryBlobCacheState,
  error: EstateReviewError,
): AuxiliaryBlobCacheState {
  return state.terminalError === null ? { ...state, terminalError: error } : state;
}

function failedTransition(
  state: AuxiliaryBlobCacheState,
  error: EstateReviewError,
): AuxiliaryBlobFetchTransition {
  return {
    state: latchAuxiliaryBlobError(state, error),
    result: err(error),
  };
}

function preflightBudget(
  path: RepoPath,
  size: number,
  chargedBytes: number,
  limits: GitSnapshotLimits,
): EstateReviewError | null {
  if (size > limits.maxAuxiliaryBlobBytesPerFile) {
    return new EstateReviewError(
      'RESOURCE_LIMIT',
      `auxiliary blob '${path}' exceeds the per-file byte limit ${String(limits.maxAuxiliaryBlobBytesPerFile)}`,
    );
  }
  const remaining = limits.maxTotalAuxiliaryBlobBytes - chargedBytes;
  return size <= remaining
    ? null
    : new EstateReviewError(
        'RESOURCE_LIMIT',
        `auxiliary blob '${path}' exceeds the remaining run-wide byte budget ${String(remaining)}`,
      );
}

function isRegularBlob(entry: TreeEntry): entry is RegularBlobTreeEntry {
  return (
    entry.type === 'blob' &&
    (entry.mode === '100644' || entry.mode === '100755') &&
    entry.size !== null
  );
}

function publicRead(cached: AuxiliaryBlobCacheEntry): AuxiliaryBlobRead {
  return {
    path: cached.path,
    treeEntry: { ...cached.treeEntry },
    bytes: Uint8Array.from(cached.bytes),
    byteCount: cached.bytes.byteLength,
    contentSha256: cached.contentSha256,
  };
}

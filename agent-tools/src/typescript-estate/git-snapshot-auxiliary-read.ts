import { assertNeverResult, err, isErr, ok, type Result } from '@oaknational/result';

import type { AuxiliaryReadRecord } from './document-model.js';
import { type AuxiliaryBlobReadRefusal, EstateReviewError } from './errors.js';
import {
  applyAuxiliaryBlobFetch,
  decideAuxiliaryBlobRead,
  latchAuxiliaryBlobError,
  type AuxiliaryBlobCacheEntry,
  type AuxiliaryBlobCacheState,
  type CapturedAuxiliarySource,
} from './git-snapshot-auxiliary-decision.js';
import type {
  AuxiliaryBlobRead,
  AuxiliaryBlobReadObservation,
  GitSnapshotAuxiliaryReader,
  GitSnapshotLimits,
  PinnedBlobReadPort,
  SnapshotSource,
  TrackedTreeEntry,
} from './git-snapshot-model.js';
import type { RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

interface CreateAuxiliaryReaderInput {
  readonly treeEntries: readonly TrackedTreeEntry[];
  readonly sources: readonly SnapshotSource[];
  readonly limits: GitSnapshotLimits;
  readonly pinnedBlobs: PinnedBlobReadPort;
}

/**
 * Run-scoped auxiliary reader over the pure decision/transition core.
 *
 * Every read is routed through {@link decideAuxiliaryBlobRead}; the only
 * I/O this class performs is executing a `fetch-required` action through the
 * injected {@link PinnedBlobReadPort}, and the only state it holds is the
 * immutable {@link AuxiliaryBlobCacheState} replaced via
 * {@link applyAuxiliaryBlobFetch} and {@link latchAuxiliaryBlobError}.
 */
export function createAuxiliaryBlobReader(
  input: CreateAuxiliaryReaderInput,
): GitSnapshotAuxiliaryReader {
  return new RunScopedAuxiliaryBlobReader(input);
}

class RunScopedAuxiliaryBlobReader implements GitSnapshotAuxiliaryReader {
  readonly #treeEntries: ReadonlyMap<RepoPath, TrackedTreeEntry>;
  readonly #typescriptPaths: ReadonlySet<RepoPath>;
  readonly #typescriptBytes: ReadonlyMap<RepoPath, CapturedAuxiliarySource>;
  readonly #limits: GitSnapshotLimits;
  readonly #pinnedBlobs: PinnedBlobReadPort;
  #state: AuxiliaryBlobCacheState = { entries: [], chargedBytes: 0, terminalError: null };

  constructor(input: CreateAuxiliaryReaderInput) {
    this.#treeEntries = new Map(
      input.treeEntries.map((entry) => [
        entry.path,
        { path: entry.path, treeEntry: { ...entry.treeEntry } },
      ]),
    );
    this.#typescriptPaths = new Set(input.sources.map(({ path }) => path));
    this.#typescriptBytes = captureSourceBytes(input.sources);
    this.#limits = { ...input.limits };
    this.#pinnedBlobs = input.pinnedBlobs;
  }

  read(path: RepoPath): Result<AuxiliaryBlobRead, EstateReviewError | AuxiliaryBlobReadRefusal> {
    const decision = decideAuxiliaryBlobRead({
      path,
      trackedEntry: this.#treeEntries.get(path)?.treeEntry,
      isTypescriptPath: this.#typescriptPaths.has(path),
      capturedSource: this.#typescriptBytes.get(path),
      cache: this.#state,
      limits: this.#limits,
    });
    if (decision.kind === 'fetch-required') {
      const transition = applyAuxiliaryBlobFetch(
        this.#state,
        decision.action,
        this.#fetchPinned(decision.action.path, decision.action.maxBytes),
      );
      this.#state = transition.state;
      return transition.result;
    }
    if (decision.kind === 'captured-source-missing' || decision.kind === 'budget-exceeded') {
      this.#state = latchAuxiliaryBlobError(this.#state, decision.error);
      return err(decision.error);
    }
    return settledDecisionResult(decision);
  }

  ledger(): Result<readonly AuxiliaryReadRecord[], EstateReviewError> {
    return this.#state.terminalError === null
      ? ok(
          this.#orderedEntries().map((cached) => ({
            path: cached.path,
            treeEntry: { ...cached.treeEntry },
            byteCount: cached.bytes.byteLength,
            contentSha256: cached.contentSha256,
          })),
        )
      : err(this.#state.terminalError);
  }

  observations(): Result<readonly AuxiliaryBlobReadObservation[], EstateReviewError> {
    return this.#state.terminalError === null
      ? ok(
          this.#orderedEntries().map((cached) => ({
            path: cached.path,
            treeEntry: { ...cached.treeEntry },
            bytes: Uint8Array.from(cached.bytes),
          })),
        )
      : err(this.#state.terminalError);
  }

  /** A throwing port implementation still lands as a typed source-read failure. */
  #fetchPinned(path: RepoPath, maxBytes: number): Result<Uint8Array, EstateReviewError> {
    let fetched: Result<Uint8Array, EstateReviewError>;
    try {
      fetched = this.#pinnedBlobs.read(path, maxBytes);
    } catch (cause: unknown) {
      return err(
        new EstateReviewError('SOURCE_READ_FAILED', `Git auxiliary blob read '${path}' threw`, {
          cause,
        }),
      );
    }
    return isErr(fetched) ? fetched : ok(fetched.value);
  }

  #orderedEntries(): readonly AuxiliaryBlobCacheEntry[] {
    return [...this.#state.entries].sort((left, right) => compareUtf16(left.path, right.path));
  }
}

type SettledAuxiliaryDecision = Extract<
  ReturnType<typeof decideAuxiliaryBlobRead>,
  { kind: 'fatal-latched' | 'missing-path' | 'nonregular-entry' | 'captured-source' | 'cache-hit' }
>;

/** Total projection of the state-free decision branches onto the read result. */
function settledDecisionResult(
  decision: SettledAuxiliaryDecision,
): Result<AuxiliaryBlobRead, EstateReviewError | AuxiliaryBlobReadRefusal> {
  switch (decision.kind) {
    case 'fatal-latched':
      return err(decision.error);
    case 'missing-path':
    case 'nonregular-entry':
      return err(decision.refusal);
    case 'captured-source':
    case 'cache-hit':
      return ok(decision.read);
    default:
      return assertNeverResult(
        decision,
        (unexpected) =>
          new EstateReviewError(
            'SNAPSHOT_INVALID',
            `unexpected auxiliary decision '${unexpected}'`,
          ),
      );
  }
}

function captureSourceBytes(
  sources: readonly SnapshotSource[],
): ReadonlyMap<RepoPath, CapturedAuxiliarySource> {
  const captured = new Map<RepoPath, CapturedAuxiliarySource>();
  for (const source of sources) {
    if ('bytes' in source) {
      captured.set(source.path, {
        bytes: Uint8Array.from(source.bytes),
        contentSha256: source.read.contentSha256,
      });
    }
  }
  return captured;
}

import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  EstateReviewError,
  MissingAuxiliaryBlobRefusal,
  NonRegularAuxiliaryBlobRefusal,
} from './errors.js';
import {
  applyAuxiliaryBlobFetch,
  decideAuxiliaryBlobRead,
  type AuxiliaryBlobCacheEntry,
  type AuxiliaryBlobCacheState,
  type AuxiliaryBlobReadDecisionInput,
} from './git-snapshot-auxiliary-decision.js';
import type { GitSnapshotLimits, RegularBlobTreeEntry } from './git-snapshot-model.js';

const LIMITS: GitSnapshotLimits = {
  maxTrackedPaths: 20,
  maxTreeListingBytes: 4096,
  maxGitStderrBytes: 1024,
  maxTotalSourceBytes: 4096,
  maxSourceBytesPerFile: 1024,
  maxTotalAuxiliaryBlobBytes: 8,
  maxAuxiliaryBlobBytesPerFile: 4,
};

const REGULAR_ENTRY: RegularBlobTreeEntry = {
  mode: '100644',
  type: 'blob',
  object: 'a'.repeat(40),
  size: 3,
};

const EMPTY_CACHE: AuxiliaryBlobCacheState = {
  entries: [],
  chargedBytes: 0,
  terminalError: null,
};

const FETCH_ACTION = {
  path: 'config.json',
  treeEntry: REGULAR_ENTRY,
  maxBytes: 4,
} as const;

describe('auxiliary blob read decision', () => {
  it('emits a fetch action only after a successful budget preflight', () => {
    const decision = decideAuxiliaryBlobRead({
      path: 'config.json',
      trackedEntry: REGULAR_ENTRY,
      isTypescriptPath: false,
      capturedSource: undefined,
      cache: EMPTY_CACHE,
      limits: LIMITS,
    });

    expect(decision).toEqual({
      kind: 'fetch-required',
      action: FETCH_ACTION,
    });
  });

  it('applies one successful fetch as a defensive, hashed, charged cache transition', () => {
    const bytes = Uint8Array.from([0x61, 0x62, 0x63]);
    const transition = applyAuxiliaryBlobFetch(EMPTY_CACHE, FETCH_ACTION, ok(bytes));
    bytes[0] = 0;

    expect(transition.state).toMatchObject({ chargedBytes: 3, terminalError: null });
    expect(transition.state.entries).toHaveLength(1);
    expect(transition.result).toEqual(
      ok({
        path: 'config.json',
        treeEntry: REGULAR_ENTRY,
        bytes: Uint8Array.from([0x61, 0x62, 0x63]),
        byteCount: 3,
        contentSha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      }),
    );

    const laterHit = decideAuxiliaryBlobRead({
      path: 'config.json',
      trackedEntry: REGULAR_ENTRY,
      isTypescriptPath: false,
      capturedSource: undefined,
      cache: transition.state,
      limits: LIMITS,
    });
    expect(laterHit).toMatchObject({
      kind: 'cache-hit',
      read: { bytes: Uint8Array.from([0x61, 0x62, 0x63]) },
    });
  });

  it('latches an operational fetch failure without changing the cache charge', () => {
    const failure = new EstateReviewError('SOURCE_READ_FAILED', 'read failed');

    const transition = applyAuxiliaryBlobFetch(EMPTY_CACHE, FETCH_ACTION, err(failure));

    expect(transition.state).toEqual({
      entries: [],
      chargedBytes: 0,
      terminalError: failure,
    });
    expect(transition.result).toEqual(err(failure));
  });
});

const CACHED_ENTRY: AuxiliaryBlobCacheEntry = {
  path: 'config.json',
  treeEntry: REGULAR_ENTRY,
  bytes: Uint8Array.from([0x61, 0x62, 0x63]),
  contentSha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
};

const CACHED_STATE: AuxiliaryBlobCacheState = {
  entries: [CACHED_ENTRY],
  chargedBytes: 3,
  terminalError: null,
};

const BASE_INPUT: AuxiliaryBlobReadDecisionInput = {
  path: 'config.json',
  trackedEntry: REGULAR_ENTRY,
  isTypescriptPath: false,
  capturedSource: undefined,
  cache: EMPTY_CACHE,
  limits: LIMITS,
};

describe('auxiliary blob read decision: every non-fetch branch is a no-action literal', () => {
  it('returns the latched terminal error before any other consideration', () => {
    const latched = new EstateReviewError('RESOURCE_LIMIT', 'already latched');

    const decision = decideAuxiliaryBlobRead({
      ...BASE_INPUT,
      cache: { ...EMPTY_CACHE, terminalError: latched },
    });

    expect(decision).toEqual({ kind: 'fatal-latched', error: latched });
  });

  it('refuses an untracked path without consulting budgets or the cache', () => {
    const decision = decideAuxiliaryBlobRead({ ...BASE_INPUT, trackedEntry: undefined });

    expect(decision).toEqual({
      kind: 'missing-path',
      refusal: new MissingAuxiliaryBlobRefusal('config.json'),
    });
  });

  it('refuses a non-regular tree entry as a per-path refusal', () => {
    const symlinkEntry = { mode: '120000', type: 'blob', object: 'f'.repeat(40), size: 3 };

    const decision = decideAuxiliaryBlobRead({ ...BASE_INPUT, trackedEntry: symlinkEntry });

    expect(decision).toEqual({
      kind: 'nonregular-entry',
      refusal: new NonRegularAuxiliaryBlobRefusal('config.json', symlinkEntry),
    });
  });

  it('serves a TypeScript path from captured bytes without charging the budget', () => {
    const decision = decideAuxiliaryBlobRead({
      ...BASE_INPUT,
      isTypescriptPath: true,
      capturedSource: {
        bytes: Uint8Array.from([0x61, 0x62, 0x63]),
        contentSha256: CACHED_ENTRY.contentSha256,
      },
    });

    expect(decision).toEqual({
      kind: 'captured-source',
      read: {
        path: 'config.json',
        treeEntry: REGULAR_ENTRY,
        bytes: Uint8Array.from([0x61, 0x62, 0x63]),
        byteCount: 3,
        contentSha256: CACHED_ENTRY.contentSha256,
      },
    });
  });

  it('reports a TypeScript path with no captured bytes as an invalid snapshot', () => {
    const decision = decideAuxiliaryBlobRead({ ...BASE_INPUT, isTypescriptPath: true });

    expect(decision).toEqual({
      kind: 'captured-source-missing',
      error: new EstateReviewError(
        'SNAPSHOT_INVALID',
        "regular TypeScript source 'config.json' has no captured bytes",
      ),
    });
  });

  it('serves a cached path without a second fetch or a second charge', () => {
    const decision = decideAuxiliaryBlobRead({ ...BASE_INPUT, cache: CACHED_STATE });

    expect(decision).toEqual({
      kind: 'cache-hit',
      read: {
        path: 'config.json',
        treeEntry: REGULAR_ENTRY,
        bytes: Uint8Array.from([0x61, 0x62, 0x63]),
        byteCount: 3,
        contentSha256: CACHED_ENTRY.contentSha256,
      },
    });
  });

  it('allows a blob at exactly the per-file limit', () => {
    const atLimit: RegularBlobTreeEntry = { ...REGULAR_ENTRY, size: 4 };

    const decision = decideAuxiliaryBlobRead({ ...BASE_INPUT, trackedEntry: atLimit });

    expect(decision).toEqual({
      kind: 'fetch-required',
      action: { path: 'config.json', treeEntry: atLimit, maxBytes: 4 },
    });
  });

  it('allows a blob whose size exactly equals the remaining run-wide budget', () => {
    const decision = decideAuxiliaryBlobRead({
      ...BASE_INPUT,
      path: 'other.json',
      cache: { ...CACHED_STATE, chargedBytes: 5 },
    });

    expect(decision).toEqual({
      kind: 'fetch-required',
      action: { path: 'other.json', treeEntry: REGULAR_ENTRY, maxBytes: 4 },
    });
  });

  it('refuses a blob over the per-file limit before any fetch action exists', () => {
    const oversized: RegularBlobTreeEntry = { ...REGULAR_ENTRY, size: 5 };

    const decision = decideAuxiliaryBlobRead({ ...BASE_INPUT, trackedEntry: oversized });

    expect(decision).toEqual({
      kind: 'budget-exceeded',
      error: new EstateReviewError(
        'RESOURCE_LIMIT',
        "auxiliary blob 'config.json' exceeds the per-file byte limit 4",
      ),
    });
  });

  it('refuses a blob over the remaining run-wide budget before any fetch action exists', () => {
    const decision = decideAuxiliaryBlobRead({
      ...BASE_INPUT,
      path: 'other.json',
      cache: { ...CACHED_STATE, chargedBytes: 6 },
    });

    expect(decision).toEqual({
      kind: 'budget-exceeded',
      error: new EstateReviewError(
        'RESOURCE_LIMIT',
        "auxiliary blob 'other.json' exceeds the remaining run-wide byte budget 2",
      ),
    });
  });

  it('latches a fetch whose bytes disagree with the indexed size', () => {
    const transition = applyAuxiliaryBlobFetch(
      EMPTY_CACHE,
      FETCH_ACTION,
      ok(Uint8Array.from([0x61, 0x62])),
    );

    expect(transition.state.terminalError).toEqual(
      new EstateReviewError(
        'SNAPSHOT_INVALID',
        "Git tree size and auxiliary bytes differ for 'config.json'",
      ),
    );
    expect(transition.state.entries).toEqual([]);
    expect(transition.result).toEqual(err(transition.state.terminalError));
  });

  it('latches a duplicate fetch for an already-cached path', () => {
    const transition = applyAuxiliaryBlobFetch(
      CACHED_STATE,
      FETCH_ACTION,
      ok(Uint8Array.from([0x61, 0x62, 0x63])),
    );

    expect(transition.state.terminalError).toEqual(
      new EstateReviewError(
        'SNAPSHOT_INVALID',
        "auxiliary blob 'config.json' was fetched after it had already been cached",
      ),
    );
    expect(transition.state.entries).toEqual([CACHED_ENTRY]);
    expect(transition.result).toEqual(err(transition.state.terminalError));
  });
});

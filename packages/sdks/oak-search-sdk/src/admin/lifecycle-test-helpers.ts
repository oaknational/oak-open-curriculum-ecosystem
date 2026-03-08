/**
 * Shared test helpers for index lifecycle service tests (ADR-130).
 *
 * Provides reusable fake dependency builders and test fixtures
 * for integration tests that use injected fakes (ADR-078).
 */

import { vi } from 'vitest';
import { ok } from '@oaknational/result';
import type { Logger } from '@oaknational/logger';
import type { AliasTargetMap, IndexLifecycleDeps } from '../types/index-lifecycle-types.js';
import type { IngestResult } from '../types/admin-types.js';

/** Minimal ingest result for test stubs. */
export const STUB_INGEST_RESULT: IngestResult = {
  filesProcessed: 6,
  lessonsIndexed: 100,
  unitsIndexed: 50,
  rollupsIndexed: 50,
  threadsIndexed: 20,
  sequencesIndexed: 10,
  sequenceFacetsIndexed: 10,
};

/** Default alias targets keyed by SearchIndexKind (existing alias state). */
export const DEFAULT_ALIAS_TARGETS = {
  lessons: { isAlias: true, targetIndex: 'oak_lessons_v2026-03-01-120000', isBareIndex: false },
  units: { isAlias: true, targetIndex: 'oak_units_v2026-03-01-120000', isBareIndex: false },
  unit_rollup: {
    isAlias: true,
    targetIndex: 'oak_unit_rollup_v2026-03-01-120000',
    isBareIndex: false,
  },
  sequences: {
    isAlias: true,
    targetIndex: 'oak_sequences_v2026-03-01-120000',
    isBareIndex: false,
  },
  sequence_facets: {
    isAlias: true,
    targetIndex: 'oak_sequence_facets_v2026-03-01-120000',
    isBareIndex: false,
  },
  threads: { isAlias: true, targetIndex: 'oak_threads_v2026-03-01-120000', isBareIndex: false },
} satisfies AliasTargetMap;

/** Alias targets with null targetIndex (no existing aliases — first run). */
export const NO_ALIAS_TARGETS = {
  lessons: { isAlias: false, targetIndex: null, isBareIndex: false },
  units: { isAlias: false, targetIndex: null, isBareIndex: false },
  unit_rollup: { isAlias: false, targetIndex: null, isBareIndex: false },
  sequences: { isAlias: false, targetIndex: null, isBareIndex: false },
  sequence_facets: { isAlias: false, targetIndex: null, isBareIndex: false },
  threads: { isAlias: false, targetIndex: null, isBareIndex: false },
} satisfies AliasTargetMap;

/** Alias targets where names are bare concrete indexes (first-run migration). */
export const BARE_INDEX_TARGETS = {
  lessons: { isAlias: false, targetIndex: null, isBareIndex: true },
  units: { isAlias: false, targetIndex: null, isBareIndex: true },
  unit_rollup: { isAlias: false, targetIndex: null, isBareIndex: true },
  sequences: { isAlias: false, targetIndex: null, isBareIndex: true },
  sequence_facets: { isAlias: false, targetIndex: null, isBareIndex: true },
  threads: { isAlias: false, targetIndex: null, isBareIndex: true },
} satisfies AliasTargetMap;

/** Fake logger for tests that need to assert on log calls. */
export function createFakeLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  };
}

/** Build a complete set of default fakes that all return success. */
function buildDefaultFakes(): IndexLifecycleDeps {
  return {
    createVersionedIndexes: vi.fn().mockResolvedValue(ok(undefined)),
    runVersionedIngest: vi.fn().mockResolvedValue(ok(STUB_INGEST_RESULT)),
    resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(DEFAULT_ALIAS_TARGETS)),
    atomicAliasSwap: vi.fn().mockResolvedValue(ok(undefined)),
    readIndexMeta: vi.fn().mockResolvedValue(ok(null)),
    writeIndexMeta: vi.fn().mockResolvedValue(ok(undefined)),
    listVersionedIndexes: vi.fn().mockResolvedValue(ok([])),
    deleteVersionedIndex: vi.fn().mockResolvedValue(ok(undefined)),
    verifyDocCounts: vi.fn().mockResolvedValue(ok(undefined)),
    generateVersion: vi.fn().mockReturnValue('v2026-03-07-143022'),
    target: 'primary',
    logger: undefined,
  };
}

/** Create a deps object with all fakes defaulting to success, overriding specific deps. */
export function createFakeDeps(overrides: Partial<IndexLifecycleDeps> = {}): IndexLifecycleDeps {
  return { ...buildDefaultFakes(), ...overrides };
}

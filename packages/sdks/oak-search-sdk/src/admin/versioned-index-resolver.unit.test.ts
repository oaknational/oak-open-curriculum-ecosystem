/**
 * Unit tests for the versioned index name resolver.
 *
 * Pure function tests — no IO, no mocks.
 */

import { describe, it, expect } from 'vitest';
import { createVersionedIndexResolver } from './versioned-index-resolver.js';

describe('createVersionedIndexResolver', () => {
  const version = 'v2026-03-07-143022';

  it('appends version to primary base name for all 6 index kinds', () => {
    const resolve = createVersionedIndexResolver(version);
    expect(resolve('lessons')).toBe('oak_lessons_v2026-03-07-143022');
    expect(resolve('unit_rollup')).toBe('oak_unit_rollup_v2026-03-07-143022');
    expect(resolve('units')).toBe('oak_units_v2026-03-07-143022');
    expect(resolve('sequences')).toBe('oak_sequences_v2026-03-07-143022');
    expect(resolve('sequence_facets')).toBe('oak_sequence_facets_v2026-03-07-143022');
    expect(resolve('threads')).toBe('oak_threads_v2026-03-07-143022');
  });

  it('appends version to sandbox base name for all 6 index kinds', () => {
    const resolve = createVersionedIndexResolver(version, 'sandbox');
    expect(resolve('lessons')).toBe('oak_lessons_sandbox_v2026-03-07-143022');
    expect(resolve('unit_rollup')).toBe('oak_unit_rollup_sandbox_v2026-03-07-143022');
    expect(resolve('units')).toBe('oak_units_sandbox_v2026-03-07-143022');
    expect(resolve('sequences')).toBe('oak_sequences_sandbox_v2026-03-07-143022');
    expect(resolve('sequence_facets')).toBe('oak_sequence_facets_sandbox_v2026-03-07-143022');
    expect(resolve('threads')).toBe('oak_threads_sandbox_v2026-03-07-143022');
  });
});

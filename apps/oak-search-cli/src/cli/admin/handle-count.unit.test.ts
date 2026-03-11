/**
 * Tests for handleCount — true parent document counts via _count API.
 */

import { describe, expect, it, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import { handleCount, type IndexDocCount } from './handle-count.js';

/** Creates a fake admin service with countDocs method. */
function createFakeAdmin(counts: readonly IndexDocCount[]) {
  return {
    countDocs: vi.fn(() => Promise.resolve(ok(counts))),
  };
}

describe('handleCount', () => {
  it('returns parent document counts for all known indexes', async () => {
    const counts: readonly IndexDocCount[] = [
      { kind: 'lessons', index: 'oak_lessons', count: 12864 },
      { kind: 'units', index: 'oak_units', count: 1664 },
      { kind: 'unit_rollup', index: 'oak_unit_rollup', count: 1664 },
      { kind: 'threads', index: 'oak_threads', count: 164 },
      { kind: 'sequences', index: 'oak_sequences', count: 30 },
      { kind: 'sequence_facets', index: 'oak_sequence_facets', count: 57 },
    ];
    const admin = createFakeAdmin(counts);

    const result = await handleCount(admin);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value).toHaveLength(6);

    const lessons = result.value.find((r) => r.kind === 'lessons');
    expect(lessons).toEqual({ kind: 'lessons', index: 'oak_lessons', count: 12864 });
  });

  it('returns whatever index names are provided by the admin service', async () => {
    const counts: readonly IndexDocCount[] = [
      { kind: 'lessons', index: 'oak_lessons_sandbox', count: 100 },
      { kind: 'units', index: 'oak_units_sandbox', count: 10 },
      { kind: 'unit_rollup', index: 'oak_unit_rollup_sandbox', count: 10 },
      { kind: 'threads', index: 'oak_threads_sandbox', count: 5 },
      { kind: 'sequences', index: 'oak_sequences_sandbox', count: 2 },
      { kind: 'sequence_facets', index: 'oak_sequence_facets_sandbox', count: 3 },
    ];
    const admin = createFakeAdmin(counts);

    const result = await handleCount(admin);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const lessons = result.value.find((r) => r.kind === 'lessons');
    expect(lessons).toEqual({ kind: 'lessons', index: 'oak_lessons_sandbox', count: 100 });
  });

  it('returns admin errors from the service', async () => {
    const admin = {
      countDocs: vi.fn(() =>
        Promise.resolve(
          err({
            type: 'es_error' as const,
            message: 'Connection refused',
          }),
        ),
      ),
    };

    const result = await handleCount(admin);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.type).toBe('es_error');
    expect(result.error.message).toContain('Connection refused');
  });
});

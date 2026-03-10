/**
 * Tests for handleCount — true parent document counts via _count API.
 */

import { describe, expect, it, vi } from 'vitest';
import { handleCount, type IndexDocCount } from './handle-count.js';

/** Creates a fake ES client with a count method. */
function createFakeClient(responses: Record<string, number>) {
  return {
    count: vi.fn(({ index }: { index: string }) =>
      Promise.resolve({ count: responses[index] ?? 0 }),
    ),
  };
}

describe('handleCount', () => {
  it('returns parent document counts for all known indexes', async () => {
    const client = createFakeClient({
      oak_lessons: 12864,
      oak_units: 1664,
      oak_unit_rollup: 1664,
      oak_threads: 164,
      oak_sequences: 30,
      oak_sequence_facets: 57,
    });

    const result = await handleCount(client, 'primary');

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value).toHaveLength(6);

    const lessons = result.value.find((r: IndexDocCount) => r.kind === 'lessons');
    expect(lessons).toEqual({ kind: 'lessons', index: 'oak_lessons', count: 12864 });
  });

  it('resolves sandbox index names when target is sandbox', async () => {
    const client = createFakeClient({
      oak_lessons_sandbox: 100,
      oak_units_sandbox: 10,
      oak_unit_rollup_sandbox: 10,
      oak_threads_sandbox: 5,
      oak_sequences_sandbox: 2,
      oak_sequence_facets_sandbox: 3,
    });

    const result = await handleCount(client, 'sandbox');

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const lessons = result.value.find((r: IndexDocCount) => r.kind === 'lessons');
    expect(lessons).toEqual({ kind: 'lessons', index: 'oak_lessons_sandbox', count: 100 });
  });

  it('returns es_error when a count request fails', async () => {
    const client = {
      count: vi.fn().mockRejectedValue(new Error('Connection refused')),
    };

    const result = await handleCount(client, 'primary');

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.type).toBe('es_error');
    expect(result.error.message).toContain('Connection refused');
  });
});

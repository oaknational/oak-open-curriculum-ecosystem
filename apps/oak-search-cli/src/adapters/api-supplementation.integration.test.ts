/**
 * Integration tests for API supplementation context building.
 *
 * Tests `buildKs4SupplementationContext` which wires the OakClient
 * to build a KS4 supplementation context from sequence/unit API data.
 */

import { describe, it, expect, vi } from 'vitest';
import { buildKs4SupplementationContext } from './api-supplementation.js';
import { createMockClient } from '../test-helpers/mock-oak-client';

// ============================================================================
// Tests: buildKs4SupplementationContext
// ============================================================================

describe('buildKs4SupplementationContext', () => {
  it('returns empty context when getSubjectSequences fails', async () => {
    const client = createMockClient({
      getSubjectSequences: vi.fn().mockResolvedValue({
        ok: false,
        error: 'Not found',
      }),
    });

    const context = await buildKs4SupplementationContext(client, 'maths');

    expect(context.unitContextMap.size).toBe(0);
    expect(context.subjectSlug).toBe('maths');
  });

  it('returns empty context when no sequences found', async () => {
    const client = createMockClient({
      getSubjectSequences: vi.fn().mockResolvedValue({
        ok: true,
        value: [],
      }),
    });

    const context = await buildKs4SupplementationContext(client, 'maths');

    expect(context.unitContextMap.size).toBe(0);
    expect(context.subjectSlug).toBe('maths');
  });

  it('builds context from sequence units with tiers', async () => {
    const client = createMockClient({
      getSubjectSequences: vi.fn().mockResolvedValue({
        ok: true,
        value: [{ sequenceSlug: 'maths-secondary', ks4Options: null }],
      }),
      getSequenceUnits: vi.fn().mockResolvedValue({
        ok: true,
        value: [
          {
            year: 10,
            tiers: [
              {
                tierSlug: 'foundation',
                tierTitle: 'Foundation',
                units: [{ unitSlug: 'algebra-foundation' }],
              },
              {
                tierSlug: 'higher',
                tierTitle: 'Higher',
                units: [{ unitSlug: 'algebra-higher' }],
              },
            ],
          },
        ],
      }),
    });

    const context = await buildKs4SupplementationContext(client, 'maths');

    expect(context.unitContextMap.size).toBe(2);
    expect(context.unitContextMap.has('algebra-foundation')).toBe(true);
    expect(context.unitContextMap.has('algebra-higher')).toBe(true);
  });
});

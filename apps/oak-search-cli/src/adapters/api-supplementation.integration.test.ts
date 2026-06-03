/**
 * Integration tests for API supplementation context building.
 *
 * Tests `buildKs4SupplementationContext` which wires the OakClient
 * to build a KS4 supplementation context from subject-detail
 * sequence enumeration plus per-sequence unit API data.
 */

import { describe, it, expect, vi } from 'vitest';
import { buildKs4SupplementationContext } from './api-supplementation.js';
import {
  createMockClient,
  createSubjectDetail,
  createSequenceEntry,
} from '../test-helpers/mock-oak-client';

// ============================================================================
// Tests: buildKs4SupplementationContext
// ============================================================================

describe('buildKs4SupplementationContext', () => {
  it('returns empty context when getSubjectDetail fails', async () => {
    const client = createMockClient({
      getSubjectDetail: vi.fn().mockResolvedValue({
        ok: false,
        error: 'Not found',
      }),
    });

    const context = await buildKs4SupplementationContext(client, 'maths');

    expect(context.unitContextMap.size).toBe(0);
    expect(context.subjectSlug).toBe('maths');
  });

  it('returns empty context when subject detail has no sequences', async () => {
    const client = createMockClient({
      getSubjectDetail: vi.fn().mockResolvedValue({
        ok: true,
        value: createSubjectDetail({ sequenceSlugs: [] }),
      }),
    });

    const context = await buildKs4SupplementationContext(client, 'maths');

    expect(context.unitContextMap.size).toBe(0);
    expect(context.subjectSlug).toBe('maths');
  });

  it('builds context from sequence units with tiers', async () => {
    const client = createMockClient({
      getSubjectDetail: vi.fn().mockResolvedValue({
        ok: true,
        value: createSubjectDetail({
          sequenceSlugs: [createSequenceEntry('maths-secondary')],
        }),
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

  it('enumerates per-board sequences from subject detail sequenceSlugs', async () => {
    const getSequenceUnits = vi.fn().mockResolvedValue({ ok: true, value: [] });
    const client = createMockClient({
      getSubjectDetail: vi.fn().mockResolvedValue({
        ok: true,
        value: createSubjectDetail({
          subjectTitle: 'Science',
          subjectSlug: 'science',
          sequenceSlugs: [
            createSequenceEntry('science-secondary-aqa'),
            createSequenceEntry('science-secondary-edexcel'),
            createSequenceEntry('science-secondary-ocr'),
          ],
        }),
      }),
      getSequenceUnits,
    });

    await buildKs4SupplementationContext(client, 'science');

    expect(getSequenceUnits).toHaveBeenCalledWith('science-secondary-aqa');
    expect(getSequenceUnits).toHaveBeenCalledWith('science-secondary-edexcel');
    expect(getSequenceUnits).toHaveBeenCalledWith('science-secondary-ocr');
  });
});

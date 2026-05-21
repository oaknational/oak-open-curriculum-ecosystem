import { describe, expect, it, vi } from 'vitest';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';
import { createSequenceFacetDoc, type CreateSequenceFacetDocParams } from './sequence-facets';
import {
  buildSequenceFacetSources,
  type SequenceFacetProcessingMetrics,
} from './sequence-facet-index';

describe('createSequenceFacetDoc', () => {
  it('creates a sequence facet document from input-agnostic params', () => {
    const params: CreateSequenceFacetDocParams = {
      sequenceSlug: 'maths-primary',
      subjectSlug: 'maths',
      phaseSlug: 'primary',
      phaseTitle: 'Primary',
      keyStage: 'ks1',
      keyStageTitle: 'Key Stage 1',
      years: ['11', '7', 'all-years', '10'],
      unitSlugs: ['unit-a', 'unit-b'],
      unitTitles: ['Unit A', 'Unit B'],
      lessonCount: 15,
      hasKs4Options: false,
    };

    const doc = createSequenceFacetDoc(params);

    expect(doc).toEqual({
      subject_slug: 'maths',
      sequence_slug: 'maths-primary',
      key_stages: ['ks1'],
      key_stage_title: 'Key Stage 1',
      phase_slug: 'primary',
      phase_title: 'Primary',
      years: ['7', '10', '11', 'all-years'],
      unit_slugs: ['unit-a', 'unit-b'],
      unit_titles: ['Unit A', 'Unit B'],
      unit_count: 2,
      lesson_count: 15,
      has_ks4_options: false,
      sequence_canonical_url: undefined,
    });
  });

  it('maps oak URL into sequence_canonical_url when provided', () => {
    const params: CreateSequenceFacetDocParams = {
      sequenceSlug: 'science-secondary',
      subjectSlug: 'science',
      phaseSlug: 'secondary',
      phaseTitle: 'Secondary',
      keyStage: 'ks4',
      keyStageTitle: 'Key Stage 4',
      years: ['10', '11'],
      unitSlugs: ['unit-x'],
      unitTitles: ['Unit X'],
      lessonCount: 20,
      hasKs4Options: true,
      oakUrl: 'https://example.com/science-secondary',
    };

    const doc = createSequenceFacetDoc(params);

    expect(doc.has_ks4_options).toBe(true);
    expect(doc.sequence_canonical_url).toBe('https://example.com/science-secondary');
  });
});

function makeSequenceEntry(overrides: Partial<SubjectSequenceEntry> = {}): SubjectSequenceEntry {
  const defaults: SubjectSequenceEntry = {
    sequenceSlug: 'programme-1',
    years: [1, 2],
    keyStages: [
      { keyStageSlug: 'ks1', keyStageTitle: 'Key stage 1' },
      { keyStageSlug: 'ks2', keyStageTitle: 'Key stage 2' },
    ],
    phaseSlug: 'primary',
    phaseTitle: 'Primary',
  };
  return { ...defaults, ...overrides };
}

describe('buildSequenceFacetSources', () => {
  it('emits instrumentation metrics for each processed sequence', async () => {
    const sequences: SubjectSequenceEntry[] = [
      makeSequenceEntry({ sequenceSlug: 'programme-1' }),
      makeSequenceEntry({
        sequenceSlug: 'programme-2',
        keyStages: [{ keyStageSlug: 'ks2', keyStageTitle: 'Key stage 2' }],
      }),
    ];

    const payloads: Record<string, unknown> = {
      'programme-1': [{ units: [{ unitSlug: 'unit-a' }] }],
      'programme-2': [],
    };

    const record = vi.fn<(metrics: SequenceFacetProcessingMetrics) => void>();

    await buildSequenceFacetSources(async (slug) => payloads[slug], sequences, {
      instrumentation: {
        record,
      },
    });

    expect(record).toHaveBeenCalledTimes(2);
    const firstCall = record.mock.calls[0][0];
    expect(firstCall.sequenceSlug).toBe('programme-1');
    expect(firstCall.unitCount).toBe(1);
    expect(firstCall.included).toBe(true);
    expect(firstCall.fetchDurationMs).toBeGreaterThanOrEqual(0);
    expect(firstCall.extractionDurationMs).toBeGreaterThanOrEqual(0);

    const secondCall = record.mock.calls[1][0];
    expect(secondCall.sequenceSlug).toBe('programme-2');
    expect(secondCall.unitCount).toBe(0);
    expect(secondCall.included).toBe(false);
  });
});

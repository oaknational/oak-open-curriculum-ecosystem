import { describe, expect, it, vi } from 'vitest';
import type { KeyStage, SearchUnitSummary, SearchSubjectSlug } from '../../types/oak';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';
import {
  createSequenceFacetDoc,
  createSequenceFacetDocuments,
  type CreateSequenceFacetDocParams,
  type SequenceFacetSource,
} from './sequence-facets';
import {
  buildSequenceFacetSources,
  type SequenceFacetProcessingMetrics,
} from './sequence-facet-index';

// ============================================================================
// Test for input-agnostic document builder (DRY - shared by bulk and API)
// ============================================================================

describe('createSequenceFacetDoc', () => {
  it('creates a sequence facet document from input-agnostic params', () => {
    const params: CreateSequenceFacetDocParams = {
      sequenceSlug: 'maths-primary',
      subjectSlug: 'maths',
      phaseSlug: 'primary',
      phaseTitle: 'Primary',
      keyStage: 'ks1',
      keyStageTitle: 'Key Stage 1',
      years: ['2', '1'], // Intentionally unsorted to test sorting
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
      years: ['1', '2'], // Sorted
      unit_slugs: ['unit-a', 'unit-b'],
      unit_titles: ['Unit A', 'Unit B'],
      unit_count: 2,
      lesson_count: 15,
      has_ks4_options: false,
      sequence_canonical_url: undefined,
    });
  });

  it('includes canonical URL when provided', () => {
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
      canonicalUrl: 'https://example.com/science-secondary',
    };

    const doc = createSequenceFacetDoc(params);

    expect(doc.has_ks4_options).toBe(true);
    expect(doc.sequence_canonical_url).toBe('https://example.com/science-secondary');
  });
});

// ============================================================================
// Test for API-specific adapter
// ============================================================================

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
    ks4Options: null,
  };
  return { ...defaults, ...overrides };
}

function makeUnitSummary(slug: string, title: string, lessonIds: string[]): SearchUnitSummary {
  return {
    unitSlug: slug,
    unitTitle: title,
    yearSlug: 'year-1',
    year: 1,
    phaseSlug: 'primary',
    subjectSlug: 'maths',
    keyStageSlug: 'ks1',
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    unitLessons: lessonIds.map((lessonSlug) => ({
      lessonSlug,
      lessonTitle: `${lessonSlug}-title`,
      state: 'published' as const,
    })),
  };
}

describe('createSequenceFacetDocuments', () => {
  it('builds facets per key stage using sequence and unit metadata', () => {
    const subject: SearchSubjectSlug = 'maths';
    const keyStage: KeyStage = 'ks1';
    const sequences: SubjectSequenceEntry[] = [
      makeSequenceEntry({ sequenceSlug: 'programme-1', years: [1, 2] }),
      makeSequenceEntry({
        sequenceSlug: 'programme-2',
        years: [3],
        keyStages: [{ keyStageSlug: 'ks2', keyStageTitle: 'Key stage 2' }],
      }),
    ];

    const sources = new Map<string, SequenceFacetSource>([
      [
        'programme-1',
        {
          sequenceSlug: 'programme-1',
          unitSlugs: ['unit-a', 'unit-b'],
        },
      ],
      [
        'programme-2',
        {
          sequenceSlug: 'programme-2',
          unitSlugs: ['unit-c'],
        },
      ],
    ]);

    const unitSummaries = new Map<string, SearchUnitSummary>([
      ['unit-a', makeUnitSummary('unit-a', 'Unit A', ['lesson-1', 'lesson-2'])],
      ['unit-b', makeUnitSummary('unit-b', 'Unit B', ['lesson-3'])],
      ['unit-c', makeUnitSummary('unit-c', 'Unit C', ['lesson-4', 'lesson-5', 'lesson-6'])],
    ]);

    const docs = createSequenceFacetDocuments({
      subject,
      keyStage,
      sequences,
      sequenceSources: sources,
      unitSummaries,
    });

    expect(docs).toHaveLength(1);
    expect(docs[0]).toMatchObject({
      subject_slug: 'maths',
      sequence_slug: 'programme-1',
      key_stages: ['ks1'],
      key_stage_title: 'Key stage 1',
      phase_slug: 'primary',
      phase_title: 'Primary',
      years: ['1', '2'],
      unit_slugs: ['unit-a', 'unit-b'],
      unit_titles: ['Unit A', 'Unit B'],
      unit_count: 2,
      lesson_count: 3,
    });
  });

  it('omits sequences without a matching key stage or units', () => {
    const subject: SearchSubjectSlug = 'maths';
    const keyStage: KeyStage = 'ks1';
    const sequences: SubjectSequenceEntry[] = [
      makeSequenceEntry({
        sequenceSlug: 'programme-1',
        keyStages: [{ keyStageSlug: 'ks2', keyStageTitle: 'Key stage 2' }],
      }),
      makeSequenceEntry({
        sequenceSlug: 'programme-2',
        keyStages: [{ keyStageSlug: 'ks1', keyStageTitle: 'Key stage 1' }],
      }),
    ];

    const sources = new Map<string, SequenceFacetSource>([
      [
        'programme-2',
        {
          sequenceSlug: 'programme-2',
          unitSlugs: [],
        },
      ],
    ]);

    const unitSummaries = new Map<string, SearchUnitSummary>();

    const docs = createSequenceFacetDocuments({
      subject,
      keyStage,
      sequences,
      sequenceSources: sources,
      unitSummaries,
    });

    expect(docs).toHaveLength(0);
  });

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

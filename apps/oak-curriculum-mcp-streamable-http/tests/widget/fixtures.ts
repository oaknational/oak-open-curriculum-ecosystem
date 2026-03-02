/**
 * Fixture data for widget Playwright and integration tests.
 *
 * All search fixtures use Zod-complete SDK shapes so contract tests
 * can validate against generated schemas. Field names are snake_case
 * matching what `formatToolResponse()` delivers.
 *
 * @see ../../src/widget-script.ts
 * @see ../../src/widget-renderer-registry.ts
 */

/** Lessons scope fixture — Zod-complete `SearchLessonsIndexDoc` per result. */
export const SEARCH_OUTPUT_FIXTURE = {
  scope: 'lessons',
  total: 15,
  took: 42,
  results: [
    {
      id: 'lesson-photosynthesis',
      rankScore: 0.95,
      lesson: {
        lesson_id: 'lesson-001',
        lesson_title: 'Introduction to Photosynthesis',
        lesson_slug: 'introduction-to-photosynthesis',
        subject_slug: 'science',
        subject_parent: 'science',
        subject_title: 'Science',
        key_stage: 'ks3',
        key_stage_title: 'KS3',
        lesson_url: 'https://teachers.thenational.academy/lessons/introduction-to-photosynthesis',
        unit_ids: ['unit-001'],
        unit_titles: ['Plant Biology'],
        unit_urls: ['https://teachers.thenational.academy/units/plant-biology'],
        has_transcript: true,
        doc_type: 'lesson',
      },
      highlights: [],
    },
    {
      id: 'lesson-light-dependent',
      rankScore: 0.88,
      lesson: {
        lesson_id: 'lesson-002',
        lesson_title: 'The Light-Dependent Reactions',
        lesson_slug: 'the-light-dependent-reactions',
        subject_slug: 'biology',
        subject_parent: 'science',
        subject_title: 'Biology',
        key_stage: 'ks4',
        key_stage_title: 'KS4',
        lesson_url: 'https://teachers.thenational.academy/lessons/the-light-dependent-reactions',
        unit_ids: ['unit-002'],
        unit_titles: ['Cellular Biology'],
        unit_urls: ['https://teachers.thenational.academy/units/cellular-biology'],
        has_transcript: false,
        doc_type: 'lesson',
      },
      highlights: [],
    },
  ],
} as const;

/** Empty search results — scoped shape with zero results. */
export const EMPTY_SEARCH_OUTPUT_FIXTURE = {
  scope: 'lessons',
  total: 0,
  took: 5,
  results: [],
} as const;

/** Generic JSON output — triggers neutral shell (no renderer matched). */
export const GENERIC_JSON_OUTPUT_FIXTURE = {
  customField: 'some value',
  nested: { data: 123, array: ['a', 'b', 'c'] },
  timestamp: '2025-11-30T12:00:00Z',
} as const;

/** Empty output — triggers neutral shell. */
export const EMPTY_OUTPUT_FIXTURE = {} as const;

/** Suggest fixture — NO `scope`/`results`, only `suggestions` and `cache`. */
export const SUGGEST_OUTPUT_FIXTURE = {
  suggestions: [
    {
      label: 'Photosynthesis in Plants',
      scope: 'lessons',
      url: 'https://teachers.thenational.academy/lessons/photosynthesis-in-plants',
      subject: 'science',
      keyStage: 'ks3',
      contexts: {},
    },
    {
      label: 'Plant Biology Unit',
      scope: 'units',
      url: 'https://teachers.thenational.academy/units/plant-biology',
      subject: 'biology',
      keyStage: 'ks4',
      contexts: {},
    },
    {
      label: 'Biology Programme',
      scope: 'sequences',
      url: 'https://teachers.thenational.academy/sequences/biology-ks4',
      subject: 'biology',
      contexts: {},
    },
  ],
  cache: { version: '1.0', ttlSeconds: 300 },
} as const;

/** Units fixture — Zod-complete `SearchUnitsIndexDoc`. `unit` can be `null`. */
export const UNITS_SEARCH_OUTPUT_FIXTURE = {
  scope: 'units',
  total: 8,
  took: 35,
  results: [
    {
      id: 'unit-plant-biology',
      rankScore: 0.92,
      unit: {
        unit_id: 'unit-001',
        unit_title: 'Plant Biology',
        unit_slug: 'plant-biology',
        subject_slug: 'biology',
        subject_parent: 'science',
        subject_title: 'Biology',
        key_stage: 'ks4',
        key_stage_title: 'KS4',
        unit_url: 'https://teachers.thenational.academy/units/plant-biology',
        subject_programmes_url: 'https://teachers.thenational.academy/subjects/biology/ks4',
        lesson_ids: ['lesson-001', 'lesson-002'],
        lesson_count: 12,
        doc_type: 'unit',
      },
      highlights: ['Plant <em>Biology</em> unit covering photosynthesis'],
    },
    {
      id: 'unit-ecosystems',
      rankScore: 0.85,
      unit: {
        unit_id: 'unit-002',
        unit_title: 'Ecosystems and Habitats',
        unit_slug: 'ecosystems-and-habitats',
        subject_slug: 'science',
        subject_parent: 'science',
        subject_title: 'Science',
        key_stage: 'ks3',
        key_stage_title: 'KS3',
        unit_url: 'https://teachers.thenational.academy/units/ecosystems-and-habitats',
        subject_programmes_url: 'https://teachers.thenational.academy/subjects/science/ks3',
        lesson_ids: ['lesson-003'],
        lesson_count: 8,
        doc_type: 'unit',
      },
      highlights: ['Understanding <em>ecosystems</em>'],
    },
  ],
} as const;

/** Threads fixture — `subject_slugs` (plural array), no `key_stage`. */
export const THREADS_SEARCH_OUTPUT_FIXTURE = {
  scope: 'threads',
  total: 4,
  took: 28,
  results: [
    {
      id: 'thread-evolution',
      rankScore: 0.89,
      thread: {
        thread_slug: 'evolution-and-inheritance',
        thread_title: 'Evolution and Inheritance',
        subject_slugs: ['biology', 'science'],
        unit_count: 12,
        thread_url: 'https://teachers.thenational.academy/threads/evolution-and-inheritance',
      },
      highlights: ['<em>Evolution</em> across key stages'],
    },
    {
      id: 'thread-forces',
      rankScore: 0.78,
      thread: {
        thread_slug: 'forces-and-motion',
        thread_title: 'Forces and Motion',
        subject_slugs: ['physics'],
        unit_count: 8,
        thread_url: 'https://teachers.thenational.academy/threads/forces-and-motion',
      },
      highlights: ['Understanding <em>forces</em>'],
    },
  ],
} as const;

/** Sequences fixture — NO `highlights`, uses `key_stages` (plural array). */
export const SEQUENCES_SEARCH_OUTPUT_FIXTURE = {
  scope: 'sequences',
  total: 2,
  took: 15,
  results: [
    {
      id: 'seq-biology-ks4',
      rankScore: 0.95,
      sequence: {
        sequence_id: 'seq-001',
        sequence_title: 'Biology KS4',
        sequence_slug: 'biology-ks4',
        subject_slug: 'science',
        subject_title: 'Biology',
        phase_slug: 'secondary',
        phase_title: 'Secondary',
        key_stages: ['ks4'],
        years: ['10', '11'],
        sequence_url: 'https://teachers.thenational.academy/sequences/biology-ks4',
        doc_type: 'sequence',
      },
    },
    {
      id: 'seq-science-ks3',
      rankScore: 0.88,
      sequence: {
        sequence_id: 'seq-002',
        sequence_title: 'Science KS3',
        sequence_slug: 'science-ks3',
        subject_slug: 'science',
        subject_title: 'Science',
        phase_slug: 'secondary',
        phase_title: 'Secondary',
        key_stages: ['ks3'],
        years: ['7', '8', '9'],
        sequence_url: 'https://teachers.thenational.academy/sequences/science-ks3',
        doc_type: 'sequence',
      },
    },
  ],
} as const;

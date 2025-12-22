import { describe, expect, it } from 'vitest';
import {
  lessonSummarySchema,
  unitSummarySchema,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
  SearchUnitSummary,
} from '../../types/oak';
import {
  createLessonDocument,
  createRollupDocument,
  createUnitDocument,
  extractPassage,
  normaliseYears,
} from './document-transforms';
import type { UnitContextMap } from './ks4-context-builder';

const mathsSubject: SearchSubjectSlug = 'maths';
const ks4: KeyStage = 'ks4';

// Empty context map for tests (no KS4 metadata)
const emptyContextMap: UnitContextMap = new Map();

// Use SDK types directly - the local interfaces were redundant
type UnitSummaryFixture = SearchUnitSummary;
type LessonSummaryFixture = SearchLessonSummary;

function buildUnitSummary(overrides: Partial<UnitSummaryFixture> = {}): UnitSummaryFixture {
  const base: UnitSummaryFixture = {
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    yearSlug: 'year-10',
    year: 'Year 10',
    phaseSlug: 'secondary',
    subjectSlug: mathsSubject,
    keyStageSlug: ks4,
    notes: undefined,
    description: 'Description',
    priorKnowledgeRequirements: ['Requirement 1'],
    nationalCurriculumContent: ['Content 1'],
    whyThisWhyNow: 'Because',
    threads: [
      { slug: 'sequence-1', title: 'Sequence 1', order: 1 },
      { slug: 'sequence-2', title: 'Sequence 2', order: 2 },
    ],
    categories: [
      {
        categoryTitle: 'Category 1',
        categorySlug: 'category-1',
      },
    ],
    unitLessons: [
      {
        lessonSlug: 'lesson-1',
        lessonTitle: 'Lesson 1',
        lessonOrder: 1,
        state: 'published',
      },
      {
        lessonSlug: 'lesson-2',
        lessonTitle: 'Lesson 2',
        lessonOrder: 2,
        state: 'published',
      },
    ],
    canonicalUrl: 'https://teachers.thenational.academy/units/unit-slug',
  };
  const summary: UnitSummaryFixture = { ...base, ...overrides };
  void unitSummarySchema.parse(summary);
  return summary;
}

function buildLessonSummary(overrides: Partial<LessonSummaryFixture> = {}): LessonSummaryFixture {
  const base: LessonSummaryFixture = {
    lessonTitle: 'Lesson Title',
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    subjectSlug: mathsSubject,
    subjectTitle: 'Mathematics',
    keyStageSlug: ks4,
    keyStageTitle: 'Key Stage 4',
    lessonKeywords: [
      { keyword: 'algebra', description: 'Algebra coverage' },
      { keyword: 'geometry', description: 'Geometry coverage' },
    ],
    keyLearningPoints: [
      { keyLearningPoint: 'Understand equations' },
      { keyLearningPoint: 'Apply formulas' },
    ],
    misconceptionsAndCommonMistakes: [
      { misconception: 'Confuse terms', response: 'Clarify definitions' },
    ],
    pupilLessonOutcome: 'Pupils can solve equations',
    teacherTips: [{ teacherTip: 'Model worked examples' }],
    contentGuidance: [
      {
        contentGuidanceArea: 'Mathematics',
        supervisionlevel_id: 1,
        contentGuidanceLabel: 'Low',
        contentGuidanceDescription: 'Suitable for most classrooms',
      },
    ],
    supervisionLevel: 'low',
    downloadsAvailable: true,
    canonicalUrl: 'https://teachers.thenational.academy/lessons/lesson-slug',
  };
  const summary: LessonSummaryFixture = { ...base, ...overrides };
  void lessonSummarySchema.parse(summary);
  return summary;
}

describe('normaliseYears', () => {
  it('returns a string array when given a numeric year', () => {
    expect(normaliseYears(7, undefined)).toEqual(['7']);
  });

  it('falls back to the year slug when year is missing', () => {
    expect(normaliseYears(undefined, 'year-5')).toEqual(['year-5']);
  });

  it('returns undefined when neither value is usable', () => {
    expect(normaliseYears(undefined, undefined)).toBeUndefined();
  });
});

describe('extractPassage', () => {
  it('returns the first two sentences trimmed to 300 characters', () => {
    const text = `${'Sentence. '.repeat(10)}Long tail content.`;
    const result = extractPassage(text);
    expect(result.split('.').length).toBeLessThanOrEqual(4);
    expect(result.length).toBeLessThanOrEqual(300);
  });
});

describe('createUnitDocument', () => {
  it('maps a unit summary into a search unit document', () => {
    const summary = buildUnitSummary();

    const doc: SearchUnitsIndexDoc = createUnitDocument({
      summary,
      subject: mathsSubject,
      keyStage: ks4,
      subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
      unitContextMap: emptyContextMap,
    });

    expect(doc.unit_id).toBe(summary.unitSlug);
    expect(doc.unit_title).toBe(summary.unitTitle);
    expect(doc.subject_programmes_url).toContain('maths-ks4');
    expect(doc.sequence_ids).toEqual(['sequence-1', 'sequence-2']);
    expect(doc.title_suggest?.contexts?.subject).toEqual([mathsSubject]);
    expect(doc.title_suggest?.contexts?.key_stage).toEqual([ks4]);
  });

  it('throws when the canonical URL is missing', () => {
    const summary = buildUnitSummary({ canonicalUrl: undefined });

    expect(() =>
      createUnitDocument({
        summary,
        subject: mathsSubject,
        keyStage: ks4,
        subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
        unitContextMap: emptyContextMap,
      }),
    ).toThrowError(/Missing canonical URL/);
  });

  it('uses lessonsByUnit when provided, overriding summary.unitLessons', () => {
    const summary = buildUnitSummary({
      unitSlug: 'surds',
      unitLessons: [
        // Summary only has 1 lesson (truncated)
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', lessonOrder: 1, state: 'published' },
      ],
    });

    // But aggregated data shows 12 lessons
    const lessonsByUnit = new Map<string, readonly string[]>([
      [
        'surds',
        [
          'lesson-1',
          'lesson-2',
          'lesson-3',
          'lesson-4',
          'lesson-5',
          'lesson-6',
          'lesson-7',
          'lesson-8',
          'lesson-9',
          'lesson-10',
          'lesson-11',
          'lesson-12',
        ],
      ],
    ]);

    const doc: SearchUnitsIndexDoc = createUnitDocument({
      summary,
      subject: mathsSubject,
      keyStage: ks4,
      subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
      unitContextMap: emptyContextMap,
      lessonsByUnit,
    });

    expect(doc.lesson_ids).toHaveLength(12);
    expect(doc.lesson_count).toBe(12);
    expect(doc.lesson_ids).toContain('lesson-12');
  });

  it('falls back to summary.unitLessons when lessonsByUnit not provided', () => {
    const summary = buildUnitSummary({
      unitLessons: [
        { lessonSlug: 'lesson-a', lessonTitle: 'Lesson A', lessonOrder: 1, state: 'published' },
        { lessonSlug: 'lesson-b', lessonTitle: 'Lesson B', lessonOrder: 2, state: 'published' },
      ],
    });

    const doc: SearchUnitsIndexDoc = createUnitDocument({
      summary,
      subject: mathsSubject,
      keyStage: ks4,
      subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
      unitContextMap: emptyContextMap,
      // No lessonsByUnit provided
    });

    expect(doc.lesson_ids).toEqual(['lesson-a', 'lesson-b']);
    expect(doc.lesson_count).toBe(2);
  });

  it('populates thread_slugs, thread_titles, and thread_orders from summary.threads', () => {
    const summary = buildUnitSummary({
      threads: [
        { slug: 'number-thread', title: 'Number', order: 1 },
        { slug: 'algebra-thread', title: 'Algebra', order: 2 },
      ],
    });

    const doc: SearchUnitsIndexDoc = createUnitDocument({
      summary,
      subject: mathsSubject,
      keyStage: ks4,
      subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
      unitContextMap: emptyContextMap,
    });

    expect(doc.thread_slugs).toEqual(['number-thread', 'algebra-thread']);
    expect(doc.thread_titles).toEqual(['Number', 'Algebra']);
    expect(doc.thread_orders).toEqual([1, 2]);
  });

  it('handles undefined threads gracefully', () => {
    const summary = buildUnitSummary({ threads: undefined });

    const doc: SearchUnitsIndexDoc = createUnitDocument({
      summary,
      subject: mathsSubject,
      keyStage: ks4,
      subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
      unitContextMap: emptyContextMap,
    });

    expect(doc.thread_slugs).toBeUndefined();
    expect(doc.thread_titles).toBeUndefined();
    expect(doc.thread_orders).toBeUndefined();
  });
});

describe('createLessonDocument', () => {
  it('maps lesson data into a search lesson document', () => {
    const lessonSummary = buildLessonSummary();

    const doc: SearchLessonsIndexDoc = createLessonDocument({
      lesson: { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
      transcript: 'Sentence one. Sentence two. Sentence three.',
      summary: lessonSummary,
      subject: mathsSubject,
      keyStage: ks4,
      years: ['Year 10'],
      lessonCount: 12,
      unitContextMap: emptyContextMap,
      units: [
        {
          unitSlug: 'unit-slug',
          unitTitle: 'Unit Title',
          canonicalUrl: 'https://teachers.thenational.academy/units/unit-slug',
        },
      ],
    });

    expect(doc.lesson_id).toBe('lesson-1');
    expect(doc.unit_urls).toEqual(['https://teachers.thenational.academy/units/unit-slug']);
    expect(doc.unit_ids).toEqual(['unit-slug']);
    expect(doc.unit_titles).toEqual(['Unit Title']);
    expect(doc.lesson_keywords).toEqual(['algebra', 'geometry']);
    expect(doc.key_learning_points).toEqual(['Understand equations', 'Apply formulas']);
    expect(doc.misconceptions_and_common_mistakes).toEqual(['Confuse terms → Clarify definitions']);
    // Lessons use subject + key_stage contexts only (not sequence - that's unit-level)
    expect(doc.title_suggest?.contexts?.subject).toEqual(['maths']);
    expect(doc.title_suggest?.contexts?.key_stage).toEqual(['ks4']);
    expect(doc.title_suggest?.contexts).not.toHaveProperty('sequence');
  });

  it('preserves ALL unit relationships for lessons appearing in multiple units', () => {
    const lessonSummary = buildLessonSummary();

    const doc: SearchLessonsIndexDoc = createLessonDocument({
      lesson: { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
      transcript: 'Multi-unit lesson content.',
      summary: lessonSummary,
      subject: mathsSubject,
      keyStage: ks4,
      years: ['Year 10'],
      lessonCount: 12,
      unitContextMap: emptyContextMap,
      units: [
        {
          unitSlug: 'unit-higher',
          unitTitle: 'Higher Unit',
          canonicalUrl: 'https://teachers.thenational.academy/units/unit-higher',
        },
        {
          unitSlug: 'unit-foundation',
          unitTitle: 'Foundation Unit',
          canonicalUrl: 'https://teachers.thenational.academy/units/unit-foundation',
        },
      ],
    });

    // ALL unit relationships are preserved - we never throw away information
    expect(doc.unit_ids).toEqual(['unit-higher', 'unit-foundation']);
    expect(doc.unit_titles).toEqual(['Higher Unit', 'Foundation Unit']);
    expect(doc.unit_urls).toEqual([
      'https://teachers.thenational.academy/units/unit-higher',
      'https://teachers.thenational.academy/units/unit-foundation',
    ]);
  });

  it('omits optional string arrays when the summary values are nullish', () => {
    const lessonSummary = buildLessonSummary({
      lessonKeywords: [],
      keyLearningPoints: [],
      misconceptionsAndCommonMistakes: [],
      teacherTips: [],
      contentGuidance: null,
    });

    const doc = createLessonDocument({
      lesson: { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
      transcript: 'Sentence one. Sentence two.',
      summary: lessonSummary,
      subject: mathsSubject,
      keyStage: ks4,
      years: undefined,
      lessonCount: 5,
      unitContextMap: emptyContextMap,
      units: [
        {
          unitSlug: 'unit-slug',
          unitTitle: 'Unit Title',
          canonicalUrl: 'https://teachers.thenational.academy/units/unit-slug',
        },
      ],
    });

    expect(doc.lesson_keywords).toBeUndefined();
    expect(doc.key_learning_points).toBeUndefined();
    expect(doc.misconceptions_and_common_mistakes).toBeUndefined();
    expect(doc.teacher_tips).toBeUndefined();
    expect(doc.content_guidance).toBeUndefined();
  });

  it('populates lesson_semantic with transcript content for ELSER semantic search', () => {
    const lessonSummary = buildLessonSummary();
    const transcript =
      'Pythagoras theorem states that in a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides.';

    const doc = createLessonDocument({
      lesson: { lessonSlug: 'pythagoras-lesson', lessonTitle: 'Using Pythagoras Theorem' },
      transcript,
      summary: lessonSummary,
      subject: mathsSubject,
      keyStage: ks4,
      years: ['Year 10'],
      lessonCount: 8,
      unitContextMap: emptyContextMap,
      units: [
        {
          unitSlug: 'trigonometry',
          unitTitle: 'Trigonometry',
          canonicalUrl: 'https://teachers.thenational.academy/units/trigonometry',
        },
      ],
    });

    // The lesson_content_semantic field must be populated for ELSER to generate embeddings
    expect(doc.lesson_content_semantic).toBeDefined();
    expect(doc.lesson_content_semantic).toContain('Pythagoras');
    expect(doc.lesson_content_semantic).toContain('hypotenuse');
  });

  it('throws when units array is empty', () => {
    const lessonSummary = buildLessonSummary();

    expect(() =>
      createLessonDocument({
        lesson: { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        transcript: 'Content.',
        summary: lessonSummary,
        subject: mathsSubject,
        keyStage: ks4,
        years: ['Year 10'],
        lessonCount: 12,
        unitContextMap: emptyContextMap,
        units: [],
      }),
    ).toThrow('Lesson lesson-1 has no unit relationships');
  });
});

describe('createRollupDocument', () => {
  it('maps a unit summary and snippets into a rollup document', () => {
    const summary = buildUnitSummary();

    const doc: SearchUnitRollupDoc = createRollupDocument({
      summary,
      snippets: ['Snippet one', 'Snippet two'],
      subject: mathsSubject,
      keyStage: ks4,
      subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
      unitContextMap: emptyContextMap,
    });

    // unit_content_semantic now contains curated semantic summary for ELSER (Phase 3 nomenclature)
    expect(doc.unit_content_semantic).toContain('Snippet two');
    // unit_structure_semantic contains curated semantic summary for ELSER (Phase 3 nomenclature)
    expect(doc.unit_structure_semantic).toContain('Unit Title is a ks4 maths unit');
    expect(doc.unit_structure_semantic).toContain('Lessons: Lesson 1, Lesson 2.');
    // unit_content contains aggregated snippets for BM25 search (Phase 3 nomenclature)
    expect(doc.unit_content).toContain('Snippet two');
    expect(doc.sequence_ids).toEqual(['sequence-1', 'sequence-2']);
    expect(doc.subject_slug).toBe(mathsSubject);
    expect(doc.key_stage).toBe(ks4);
    // Dense vectors removed per ADR-075 - E5 provides no benefit over BM25+ELSER
  });

  it('throws when the unit canonical URL is missing', () => {
    const summary = buildUnitSummary({ canonicalUrl: undefined });

    expect(() =>
      createRollupDocument({
        summary,
        snippets: [],
        subject: mathsSubject,
        keyStage: ks4,
        subjectProgrammesUrl: 'https://teachers.thenational.academy/programmes/maths-ks4',
        unitContextMap: emptyContextMap,
      }),
    ).toThrowError(/Missing canonical URL/);
  });
});

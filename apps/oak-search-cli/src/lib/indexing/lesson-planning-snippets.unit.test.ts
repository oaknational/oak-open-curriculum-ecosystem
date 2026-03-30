import { describe, expect, it } from 'vitest';
import type { SearchLessonSummary } from '../../types/oak';
import { lessonSummarySchema } from '@oaknational/curriculum-sdk/public/search.js';
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';

/**
 * Builds a typed lesson summary fixture.
 * Uses Zod schema parsing to ensure fixture matches SDK types.
 */
function buildLessonSummary(overrides: Partial<SearchLessonSummary> = {}): SearchLessonSummary {
  const base = {
    lessonTitle: 'Lesson Title',
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    subjectSlug: 'history',
    subjectTitle: 'History',
    keyStageSlug: 'ks4',
    keyStageTitle: 'Key Stage 4',
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'Learners can describe key ideas.',
    teacherTips: [],
    contentGuidance: [],
    supervisionLevel: 'low',
    downloadsAvailable: true,
    canonicalUrl: 'https://teachers.thenational.academy/lessons/lesson-slug',
    ...overrides,
  };
  // Parse through schema to get properly typed result
  const parsed = lessonSummarySchema.parse(base);
  return parsed;
}

describe('selectLessonPlanningSnippet', () => {
  it('includes key learning points when present', () => {
    const summary = buildLessonSummary({
      keyLearningPoints: [
        { keyLearningPoint: 'Analyse proportional relationships' },
        { keyLearningPoint: 'Apply ratios to problem solving' },
      ],
    });

    const snippet = selectLessonPlanningSnippet({
      summary,
      transcript: 'Fallback transcript sentence one. Sentence two.',
    });

    expect(snippet).toContain('key learning points:');
    expect(snippet).toContain('Analyse proportional relationships');
  });

  it('captures teacher tips when no key learning points exist', () => {
    const summary = buildLessonSummary({
      teacherTips: [
        { teacherTip: 'Display exemplar working' },
        { teacherTip: 'Encourage paired discussion' },
      ],
    });

    const snippet = selectLessonPlanningSnippet({
      summary,
      transcript: 'Fallback transcript sentence one. Sentence two.',
    });

    expect(snippet).toContain('teacher tips:');
    expect(snippet).toContain('Display exemplar working');
  });

  it('throws when no lesson-planning data is available', () => {
    const summary = buildLessonSummary();

    expect(() =>
      selectLessonPlanningSnippet({
        summary,
        transcript: 'First transcript sentence. Second transcript sentence with detail.',
      }),
    ).toThrow(/Lesson planning data missing/);
  });
});

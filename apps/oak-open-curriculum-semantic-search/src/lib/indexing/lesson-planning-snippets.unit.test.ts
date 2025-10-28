import { describe, expect, it } from 'vitest';
import { lessonSummarySchema } from '@oaknational/oak-curriculum-sdk';
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';

interface LessonSummaryFixture {
  lessonTitle: string;
  unitSlug: string;
  unitTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  lessonKeywords: readonly { keyword: string; description: string }[];
  keyLearningPoints: readonly { keyLearningPoint: string }[];
  misconceptionsAndCommonMistakes: readonly { misconception: string; response: string }[];
  pupilLessonOutcome: string;
  teacherTips: readonly { teacherTip: string }[];
  contentGuidance: readonly unknown[];
  supervisionLevel: string;
  downloadsAvailable: boolean;
  canonicalUrl: string;
}

function buildLessonSummary(overrides: Partial<LessonSummaryFixture> = {}): LessonSummaryFixture {
  const base: LessonSummaryFixture = {
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
  };
  const summary: LessonSummaryFixture = { ...base, ...overrides };
  void lessonSummarySchema.parse(summary);
  return summary;
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
    ).toThrowError(/Lesson planning data missing/);
  });
});

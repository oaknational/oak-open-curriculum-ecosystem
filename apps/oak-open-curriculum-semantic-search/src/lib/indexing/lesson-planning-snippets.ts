import type { SearchLessonSummary } from '../../types/oak';
import { extractPassage, normaliseContentGuidanceEntries } from './document-transforms';

type LessonKeyword = NonNullable<SearchLessonSummary['lessonKeywords']>[number];
type LessonKeyLearningPoint = NonNullable<SearchLessonSummary['keyLearningPoints']>[number];
type LessonTeacherTip = NonNullable<SearchLessonSummary['teacherTips']>[number];
type LessonMisconception = NonNullable<
  SearchLessonSummary['misconceptionsAndCommonMistakes']
>[number];

/** Parameters for selecting a formatted lesson-planning snippet. */
export interface SelectLessonPlanningSnippetParams {
  summary: SearchLessonSummary;
  transcript: string;
}

/**
 * Builds a structured lesson-planning snippet, raising if no planning data
 * exists. Transcript excerpts are only referenced in error messages.
 */
export function selectLessonPlanningSnippet({
  summary,
  transcript,
}: SelectLessonPlanningSnippetParams): string {
  const planningSections = collectLessonPlanningSections(summary);
  if (planningSections.length === 0) {
    throw new Error(
      `Lesson planning data missing for ${summary.lessonTitle}; add lesson planning snippets upstream. Transcript excerpt: ${extractPassage(transcript)}`,
    );
  }
  return planningSections.join('\n\n');
}

function collectLessonPlanningSections(summary: SearchLessonSummary): string[] {
  const sections: string[] = [];
  appendKeywordsSection(summary, sections);
  appendKeyLearningPointsSection(summary, sections);
  appendTeacherTipsSection(summary, sections);
  appendMisconceptionsSection(summary, sections);
  appendContentGuidanceSection(summary, sections);
  return sections;
}

function appendKeywordsSection(summary: SearchLessonSummary, sections: string[]): void {
  const lessonKeywords = summary.lessonKeywords?.map((item: LessonKeyword) => item.keyword);
  if (lessonKeywords && lessonKeywords.length > 0) {
    sections.push(`keywords: ${lessonKeywords.join('; ')}`);
  }
}

function appendKeyLearningPointsSection(summary: SearchLessonSummary, sections: string[]): void {
  const keyLearningPoints = summary.keyLearningPoints?.map(
    (item: LessonKeyLearningPoint) => item.keyLearningPoint,
  );
  if (keyLearningPoints && keyLearningPoints.length > 0) {
    sections.push(`key learning points: ${keyLearningPoints.join('; ')}`);
  }
}

function appendTeacherTipsSection(summary: SearchLessonSummary, sections: string[]): void {
  const teacherTips = summary.teacherTips?.map((item: LessonTeacherTip) => item.teacherTip);
  if (teacherTips && teacherTips.length > 0) {
    sections.push(`teacher tips: ${teacherTips.join('; ')}`);
  }
}

function appendMisconceptionsSection(summary: SearchLessonSummary, sections: string[]): void {
  const misconceptions = summary.misconceptionsAndCommonMistakes?.map(
    (item: LessonMisconception) => `${item.misconception} → ${item.response}`,
  );
  if (misconceptions && misconceptions.length > 0) {
    sections.push(`misconceptions: ${misconceptions.join('; ')}`);
  }
}

function appendContentGuidanceSection(summary: SearchLessonSummary, sections: string[]): void {
  const contentGuidance = normaliseContentGuidanceEntries(summary.contentGuidance);
  if (contentGuidance && contentGuidance.length > 0) {
    sections.push(`content guidance: ${contentGuidance.join('; ')}`);
  }
}

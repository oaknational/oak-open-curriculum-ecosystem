import { extractLessonPlanningFields, extractPassage } from './document-transforms';
import { expectLessonSummaryString } from './document-transform-helpers';

/** Parameters for selecting a formatted lesson-planning snippet. */
export interface SelectLessonPlanningSnippetParams {
  summary: unknown;
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
    const lessonTitle = expectLessonSummaryString(summary, 'lessonTitle', 'lesson title');
    throw new Error(
      `Lesson planning data missing for ${lessonTitle}; add lesson planning snippets upstream. Transcript excerpt: ${extractPassage(transcript)}`,
    );
  }
  return planningSections.join('\n\n');
}

function collectLessonPlanningSections(summary: unknown): string[] {
  const sections: string[] = [];
  const fields = extractLessonPlanningFields(summary);
  appendSection('keywords', fields.lessonKeywords, sections);
  appendSection('key learning points', fields.keyLearningPoints, sections);
  appendSection('teacher tips', fields.teacherTips, sections);
  appendSection('misconceptions', fields.misconceptions, sections);
  appendSection('content guidance', fields.contentGuidance, sections);
  return sections;
}

function appendSection(label: string, values: string[] | undefined, sections: string[]): void {
  if (values && values.length > 0) {
    sections.push(`${label}: ${values.join('; ')}`);
  }
}

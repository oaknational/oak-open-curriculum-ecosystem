/**
 * Semantic summary generators for ELSER embeddings.
 *
 * Creates information-dense ~200 token summaries optimised for embeddings.
 * These replace full transcripts/rollup text which dilute pedagogical signals.
 *
 * @module semantic-summary-generator
 * @see ADR-077 Semantic Summary Generation
 */

import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';

/** Maximum items to include from arrays (to keep summary concise). */
const MAX_ARRAY_ITEMS = 3;

/** Adds an optional string array field to parts if present. */
function addStringArrayField(parts: string[], items: string[] | undefined, prefix: string): void {
  if (items?.length) {
    const selected = items.slice(0, MAX_ARRAY_ITEMS);
    parts.push(`${prefix}: ${selected.join('; ')}.`);
  }
}

/** Generates a semantic summary for a lesson (~200 tokens). */
export function generateLessonSemanticSummary(summary: SearchLessonSummary): string {
  const parts: string[] = [];
  parts.push(
    `${summary.lessonTitle} is a ${summary.keyStageTitle} ${summary.subjectTitle} lesson.`,
  );

  // Extract string values from object arrays
  const keyLearningPoints = summary.keyLearningPoints?.map((p) => p.keyLearningPoint);
  const keywords = summary.lessonKeywords?.map((k) => k.keyword);
  const misconceptions = summary.misconceptionsAndCommonMistakes?.map((m) => m.misconception);

  addStringArrayField(parts, keyLearningPoints, 'Key learning');
  addStringArrayField(parts, keywords, 'Keywords');
  addStringArrayField(parts, misconceptions, 'Common misconception');

  if (summary.pupilLessonOutcome) {
    parts.push(`Pupil outcome: ${summary.pupilLessonOutcome}.`);
  }

  return parts.join('\n\n');
}

/**
 * Generates a semantic summary for a unit (~200 tokens).
 *
 * Template:
 * ```
 * {unitTitle} is a {keyStage} {subject} unit containing {lessonCount} lessons.
 * Overview: {whyThisWhyNow}.
 * Prior knowledge: {priorKnowledgeRequirements[0..2]}.
 * National curriculum: {nationalCurriculumContent[0..2]}.
 * Lessons: {lessonTitles as comma-separated list}.
 * ```
 */
export function generateUnitSemanticSummary(
  summary: SearchUnitSummary,
  keyStageTitle: string,
  subjectTitle: string,
): string {
  const parts: string[] = [];

  // Context line
  const lessonCount = summary.unitLessons.length;
  const contextLine = `${summary.unitTitle} is a ${keyStageTitle} ${subjectTitle} unit containing ${lessonCount} lessons`;
  parts.push(contextLine + '.');

  // Overview (whyThisWhyNow)
  if (summary.whyThisWhyNow) {
    parts.push(`Overview: ${summary.whyThisWhyNow}`);
  }

  // Description if available
  if (summary.description) {
    parts.push(`Description: ${summary.description}`);
  }

  // Prior knowledge requirements (first 3)
  if (summary.priorKnowledgeRequirements.length > 0) {
    const requirements = summary.priorKnowledgeRequirements.slice(0, MAX_ARRAY_ITEMS);
    parts.push(`Prior knowledge: ${requirements.join('; ')}.`);
  }

  // National curriculum content (first 3)
  if (summary.nationalCurriculumContent.length > 0) {
    const content = summary.nationalCurriculumContent.slice(0, MAX_ARRAY_ITEMS);
    parts.push(`National curriculum: ${content.join('; ')}.`);
  }

  // Lesson titles
  const lessonTitles = summary.unitLessons.map((lesson) => lesson.lessonTitle);
  if (lessonTitles.length > 0) {
    parts.push(`Lessons: ${lessonTitles.join(', ')}.`);
  }

  return parts.join('\n\n');
}

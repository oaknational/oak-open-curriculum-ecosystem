/**
 * Semantic summary generators for ELSER embeddings.
 *
 * Creates information-dense ~200 token summaries optimised for embeddings.
 * These replace full transcripts/rollup text which dilute pedagogical signals.
 *
 * @see ADR-077 Semantic Summary Generation
 */

import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';

/** Adds a formatted line to parts array if items exist. */
function addSection(parts: string[], label: string, items: string[]): void {
  if (items.length > 0) {
    parts.push(`${label}: ${items.join('; ')}.`);
  }
}

/** Adds a formatted line to parts array if items exist (comma-separated). */
function addCommaSeparatedSection(parts: string[], label: string, items: string[]): void {
  if (items.length > 0) {
    parts.push(`${label}: ${items.join(', ')}.`);
  }
}

/** Extracts lesson pedagogical content for semantic summary. */
function extractLessonPedagogicalContent(summary: SearchLessonSummary): string[] {
  const parts: string[] = [];
  addSection(
    parts,
    'Key learning',
    summary.keyLearningPoints.map((p) => p.keyLearningPoint),
  );
  addSection(
    parts,
    'Keywords',
    summary.lessonKeywords.map((k) =>
      k.description ? `${k.keyword} (${k.description})` : k.keyword,
    ),
  );
  addSection(
    parts,
    'Misconceptions',
    summary.misconceptionsAndCommonMistakes.map((m) => `${m.misconception} → ${m.response}`),
  );
  addSection(
    parts,
    'Teacher tips',
    summary.teacherTips.map((t) => t.teacherTip),
  );
  if (summary.contentGuidance) {
    addSection(
      parts,
      'Content guidance',
      summary.contentGuidance.map((g) => g.contentGuidanceDescription),
    );
  }
  if (summary.pupilLessonOutcome) {
    parts.push(`Pupil outcome: ${summary.pupilLessonOutcome}.`);
  }
  return parts;
}

/**
 * Generates a semantic summary for a lesson (~200-400 tokens).
 *
 * Enhanced in Phase 4 to include all available fields for richer embeddings.
 */
export function generateLessonSemanticSummary(summary: SearchLessonSummary): string {
  const contextLine = `${summary.lessonTitle} is a ${summary.keyStageTitle} ${summary.subjectTitle} lesson in the unit "${summary.unitTitle}".`;
  const pedagogicalParts = extractLessonPedagogicalContent(summary);
  return [contextLine, ...pedagogicalParts].join('\n\n');
}

/** Adds optional text field to parts array if present. */
function addOptionalField(parts: string[], label: string, value: string | undefined): void {
  if (value) {
    parts.push(`${label}: ${value}`);
  }
}

/** Extracts unit descriptive content for semantic summary. */
function extractUnitDescriptiveContent(summary: SearchUnitSummary): string[] {
  const parts: string[] = [];
  addOptionalField(parts, 'Overview', summary.whyThisWhyNow);
  addOptionalField(parts, 'Description', summary.description);
  addOptionalField(parts, 'Notes', summary.notes);
  addSection(parts, 'Prior knowledge', summary.priorKnowledgeRequirements);
  addSection(parts, 'National curriculum', summary.nationalCurriculumContent);
  return parts;
}

/** Extracts unit structural content for semantic summary. */
function extractUnitStructuralContent(summary: SearchUnitSummary): string[] {
  const parts: string[] = [];
  addCommaSeparatedSection(parts, 'Curriculum threads', summary.threads?.map((t) => t.title) ?? []);
  addCommaSeparatedSection(parts, 'Topics', summary.categories?.map((c) => c.categoryTitle) ?? []);
  addCommaSeparatedSection(
    parts,
    'Lessons',
    summary.unitLessons.map((l) => l.lessonTitle),
  );
  return parts;
}

/**
 * Generates a semantic summary for a unit (~200-400 tokens).
 *
 * Enhanced in Phase 4 to include all available fields for richer embeddings.
 */
export function generateUnitSemanticSummary(
  summary: SearchUnitSummary,
  keyStageTitle: string,
  subjectTitle: string,
): string {
  const lessonCount = summary.unitLessons.length;
  const contextLine = `${summary.unitTitle} is a ${keyStageTitle} ${subjectTitle} unit containing ${lessonCount} lessons.`;
  const descriptiveParts = extractUnitDescriptiveContent(summary);
  const structuralParts = extractUnitStructuralContent(summary);
  return [contextLine, ...descriptiveParts, ...structuralParts].join('\n\n');
}

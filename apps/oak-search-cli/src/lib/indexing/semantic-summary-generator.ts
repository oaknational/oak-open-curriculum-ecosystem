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

/**
 * Parameters for generating a sequence-level semantic summary.
 *
 * @see ADR-139 Sequence Semantic Contract and Ownership
 */
interface GenerateSequenceSemanticParams {
  /** The sequence title (e.g., 'Mathematics Primary'). */
  readonly sequenceTitle: string;
  /** The subject title (e.g., 'Mathematics'). */
  readonly subjectTitle: string;
  /** The phase title (e.g., 'Primary', 'Secondary'). */
  readonly phaseTitle: string;
  /** Years covered by this sequence, in display order. */
  readonly years: readonly string[];
  /** Key stages covered by this sequence, in display order. */
  readonly keyStages: readonly string[];
  /** Ordered unit summaries with their key stage and subject context. */
  readonly orderedUnitSummaries: readonly {
    readonly summary: SearchUnitSummary;
    readonly keyStageTitle: string;
    readonly subjectTitle: string;
  }[];
}

/**
 * Generates a deterministic sequence-level semantic summary from ordered unit sub-content.
 *
 * Constructs a context line followed by per-unit semantic summaries (reusing
 * {@link generateUnitSemanticSummary}), joined with double newlines.
 *
 * @param params - Sequence metadata and ordered unit summaries
 * @returns A non-empty deterministic semantic summary for ELSER embeddings
 * @throws If orderedUnitSummaries is empty, or any unit semantic trims to empty
 * @see ADR-139 Sequence Semantic Contract and Ownership
 */
export function generateSequenceSemanticSummary(params: GenerateSequenceSemanticParams): string {
  if (params.orderedUnitSummaries.length === 0) {
    throw new Error(
      'generateSequenceSemanticSummary: orderedUnitSummaries must not be empty — ' +
        `sequence "${params.sequenceTitle}" has no units to summarise.`,
    );
  }

  const contextLine =
    `${params.sequenceTitle} is a ${params.subjectTitle} ${params.phaseTitle} ` +
    `curriculum sequence covering ${params.keyStages.join(', ')} (${params.years.join(', ')}).`;

  const unitSemantics = params.orderedUnitSummaries.map((entry) => {
    const unitSemantic = generateUnitSemanticSummary(
      entry.summary,
      entry.keyStageTitle,
      entry.subjectTitle,
    );
    if (unitSemantic.trim().length === 0) {
      throw new Error(
        'generateSequenceSemanticSummary: unit semantic summary is empty after trimming — ' +
          `unit "${entry.summary.unitSlug}" in sequence "${params.sequenceTitle}".`,
      );
    }
    return unitSemantic;
  });

  const result = [contextLine, ...unitSemantics].join('\n\n');
  if (result.trim().length === 0) {
    throw new Error(
      'generateSequenceSemanticSummary: final sequence semantic is empty after trimming — ' +
        `sequence "${params.sequenceTitle}".`,
    );
  }

  return result;
}

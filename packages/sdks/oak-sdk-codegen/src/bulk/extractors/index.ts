/**
 * Vocabulary and data extractors for the bulk data processing pipeline.
 *
 * @remarks
 * All extractors are pure functions that take bulk download data
 * and return extracted data with metadata. These extracted
 * data structures can be used for ES indexing or other purposes.

 */

// ============================================================================
// Lesson-based extractors
// ============================================================================

export { extractKeywords, normaliseKeyword, type ExtractedKeyword } from './keyword-extractor.js';

export { extractMisconceptions, type ExtractedMisconception } from './misconception-extractor.js';

export { extractLearningPoints, type ExtractedLearningPoint } from './learning-point-extractor.js';

export { extractTeacherTips, type ExtractedTeacherTip } from './teacher-tip-extractor.js';

export { extractPupilOutcomes, type ExtractedPupilOutcome } from './pupil-outcome-extractor.js';

export {
  extractContentGuidance,
  getUniqueGuidanceAreas,
  type ExtractedContentGuidance,
  type ExtractedContentGuidanceItem,
} from './content-guidance-extractor.js';

export {
  extractTranscripts,
  extractTranscriptVocabulary,
  type ExtractedTranscript,
  type TranscriptSentence,
} from './transcript-extractor.js';

export {
  extractSupervisionLevels,
  summarizeSupervisionLevels,
  getUniqueSupervisionLevels,
  type ExtractedSupervisionLevel,
  type SupervisionLevelSummary,
} from './supervision-level-extractor.js';

// ============================================================================
// Unit-based extractors
// ============================================================================

export {
  extractPriorKnowledge,
  type ExtractedPriorKnowledge,
} from './prior-knowledge-extractor.js';

export { extractNCStatements, type ExtractedNCStatement } from './nc-statement-extractor.js';

export { extractThreads, type ExtractedThread, type ThreadUnit } from './thread-extractor.js';

export { extractWhyThisWhyNow, type ExtractedWhyThisWhyNow } from './why-this-why-now-extractor.js';

export {
  extractUnitDescriptions,
  type ExtractedUnitDescription,
} from './unit-description-extractor.js';

export {
  extractUnitLessons,
  createLessonToUnitMap,
  type ExtractedUnitLessons,
  type UnitLessonReference,
} from './unit-lesson-extractor.js';

export {
  extractYearPhaseInfo,
  summarizeYearPhaseInfo,
  type ExtractedYearInfo,
  type YearPhaseSummary,
} from './year-phase-extractor.js';

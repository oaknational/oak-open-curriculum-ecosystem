/**
 * Vocabulary extractors for the mining pipeline.

 *
 * @remarks
 * All extractors are pure functions that take bulk download data
 * and return extracted vocabulary with metadata.
 */

// Keyword extraction is consolidated to the canonical src/bulk copy (G4b-c1):
// the vocab-gen pipeline and the src/bulk generators share ONE extractor.
export {
  extractKeywords,
  normaliseKeyword,
  type ExtractedKeyword,
} from '../../src/bulk/extractors/keyword-extractor.js';
export { extractLessons, type ExtractedLesson } from './lesson-extractor.js';
export { extractMisconceptions, type ExtractedMisconception } from './misconception-extractor.js';
export {
  extractPriorKnowledge,
  type ExtractedPriorKnowledge,
} from './prior-knowledge-extractor.js';
export { extractNCStatements, type ExtractedNCStatement } from './nc-statement-extractor.js';
export { extractThreads, type ExtractedThread, type ThreadUnit } from './thread-extractor.js';
export { extractLearningPoints, type ExtractedLearningPoint } from './learning-point-extractor.js';
export { extractTeacherTips, type ExtractedTeacherTip } from './teacher-tip-extractor.js';

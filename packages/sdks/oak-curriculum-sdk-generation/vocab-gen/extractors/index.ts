/**
 * Vocabulary extractors for the mining pipeline.

 *
 * @remarks
 * All extractors are pure functions that take bulk download data
 * and return extracted vocabulary with metadata.
 */

export { extractKeywords, normaliseKeyword, type ExtractedKeyword } from './keyword-extractor.js';
export { extractMisconceptions, type ExtractedMisconception } from './misconception-extractor.js';
export {
  extractPriorKnowledge,
  type ExtractedPriorKnowledge,
} from './prior-knowledge-extractor.js';
export { extractNCStatements, type ExtractedNCStatement } from './nc-statement-extractor.js';
export { extractThreads, type ExtractedThread, type ThreadUnit } from './thread-extractor.js';
export { extractLearningPoints, type ExtractedLearningPoint } from './learning-point-extractor.js';
export { extractTeacherTips, type ExtractedTeacherTip } from './teacher-tip-extractor.js';

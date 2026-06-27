/**
 * Vocabulary extractors for the mining pipeline.
 *
 * @remarks
 * All extractors are pure functions that take bulk download data
 * and return extracted vocabulary with metadata.
 *
 * The extractor implementations are consolidated to the canonical
 * `src/bulk/extractors` copies (G4b-c1): the vocab-gen pipeline and the
 * src/bulk generators share ONE implementation per extractor. The `Unit` and
 * `Lesson` types these consume are re-exported from the same generated bulk
 * module (`vocab-gen/lib` re-exports `src/bulk`), so the canonical copies are
 * type-identical for both pipelines.
 */

export {
  extractKeywords,
  normaliseKeyword,
  type ExtractedKeyword,
} from '../../src/bulk/extractors/keyword-extractor.js';
export {
  extractLessons,
  type ExtractedLesson,
} from '../../src/bulk/extractors/lesson-extractor.js';
export {
  extractMisconceptions,
  type ExtractedMisconception,
} from '../../src/bulk/extractors/misconception-extractor.js';
export {
  extractPriorKnowledge,
  type ExtractedPriorKnowledge,
} from '../../src/bulk/extractors/prior-knowledge-extractor.js';
export {
  extractNCStatements,
  type ExtractedNCStatement,
} from '../../src/bulk/extractors/nc-statement-extractor.js';
export {
  extractThreads,
  type ExtractedThread,
  type ThreadUnit,
} from '../../src/bulk/extractors/thread-extractor.js';
export {
  extractLearningPoints,
  type ExtractedLearningPoint,
} from '../../src/bulk/extractors/learning-point-extractor.js';
export {
  extractTeacherTips,
  type ExtractedTeacherTip,
} from '../../src/bulk/extractors/teacher-tip-extractor.js';

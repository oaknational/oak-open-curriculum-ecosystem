/**
 * Curriculum graph subpath barrel: `@oaknational/graph-corpus-sdk/curriculum`.
 *
 * The generated one-graph corpus (G1a) plus the bounded anchored views over
 * it: `priorKnowledgeSubgraph` (G1b) answers "what is the prior knowledge of
 * these units?" as a depth-bounded predecessor subgraph;
 * `misconceptionsForLessons` / `misconceptionsForUnits` /
 * `misconceptionsForThread` (G2) answer "which misconceptions does this
 * anchor address?" over the thread→unit→lesson→misconception chain;
 * `progressionForThread` / `progressionsForSubjectKeyStage` (G3) answer "how
 * does this thread progress across years?" over the year-ordered sequences;
 * `keywordsForSubjectKeyStage` (G4b) answers "what is the key vocabulary for
 * this teaching context?" as a bounded frequency-ranked keyword page with
 * lesson decoration.
 */

export {
  graphCorpus,
  type GraphCorpus,
  type GraphCorpusEdge,
  type GraphCorpusLessonNode,
  type GraphCorpusMisconceptionNode,
  type GraphCorpusNodeId,
  type GraphCorpusSequence,
  type GraphCorpusSequencePlacement,
  type GraphCorpusThreadNode,
  type GraphCorpusUnitNode,
} from './graph-corpus.js';

export {
  DEFAULT_PREREQUISITE_DEPTH,
  MAX_PREREQUISITE_DEPTH,
  createCurriculumPriorKnowledgeView,
  priorKnowledgeSubgraph,
  type CurriculumPriorKnowledgeView,
  type PriorKnowledgeSubgraph,
} from './prior-knowledge-view.js';

export {
  buildCurriculumMisconceptionProjection,
  type CurriculumMisconceptionProjection,
} from './misconception-projection.js';

export {
  DEFAULT_THREAD_UNIT_LIMIT,
  MAX_THREAD_UNIT_LIMIT,
  misconceptionsForLessons,
  misconceptionsForThread,
  misconceptionsForUnits,
  type LessonMisconceptions,
  type LessonMisconceptionsSubgraph,
  type ThreadMisconceptions,
  type ThreadMisconceptionsSubgraph,
  type ThreadMisconceptionsWindow,
  type ThreadWindowInvalid,
  type UnitMisconceptions,
  type UnitMisconceptionsSubgraph,
} from './misconception-view.js';

export {
  buildCurriculumThreadProgressionsProjection,
  type CurriculumThreadProgressionsProjection,
} from './thread-progressions-projection.js';

export {
  progressionForThread,
  progressionsForSubjectKeyStage,
  threadProgressionStats,
  type ThreadDescriptor,
  type ThreadDiscovery,
  type ThreadProgression,
  type ThreadProgressionEntry,
  type ThreadProgressionStats,
  type ThreadProgressionSubgraph,
} from './thread-progressions-view.js';

export {
  buildCurriculumKeywordProjection,
  type CurriculumKeywordProjection,
} from './keyword-projection.js';

export {
  DEFAULT_KEYWORD_LIMIT,
  KEYWORD_LESSON_DECORATION_LIMIT,
  MAX_KEYWORD_LIMIT,
  keywordsForSubjectKeyStage,
  type KeywordLessons,
  type KeywordLimitInvalid,
  type KeywordRetrievalOptions,
  type KeywordSubgraph,
} from './keyword-view.js';

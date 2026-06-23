/**
 * Generated vocabulary graph artefacts.
 *
 * These files are produced by the vocab-gen pipeline from bulk download data.
 * Each graph captures a different aspect of curriculum knowledge.
 *
 * @remarks
 * Large datasets use the JSON loader pattern (data.json + types.ts + index.ts).
 * Import only what you need — do not import this entire module unless necessary.
 */

export { graphCorpus } from './graph-corpus/index.js';
export type {
  GraphCorpus,
  GraphCorpusUnitNode,
  GraphCorpusEdge,
  GraphCorpusNodeId,
  GraphCorpusStats,
  GraphCorpusDroppedEdge,
} from './graph-corpus/index.js';
export { vocabularyGraph } from './vocabulary-graph/index.js';
export type {
  VocabularyGraph,
  VocabularyGraphStats,
  VocabularyNode,
} from './vocabulary-graph/index.js';
export { ncCoverageGraph } from './nc-coverage-graph/index.js';
export type {
  NCCoverageGraph,
  NCCoverageGraphStats,
  NCStatementNode,
} from './nc-coverage-graph/index.js';
export { minedDefinitionSynonyms } from './synonyms/definition-synonyms.js';

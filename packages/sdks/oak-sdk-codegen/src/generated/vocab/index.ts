/**
 * Generated vocabulary graph artefacts.
 *
 * These files are produced by the vocab-gen pipeline from bulk download data.
 * Each graph captures a different aspect of curriculum knowledge.
 *
 * @remarks
 * These are large static data files (some exceeding 1MB). Import only what
 * you need — do not import this entire module unless necessary.
 */

export { threadProgressionGraph } from './thread-progression-data.js';
export { prerequisiteGraph } from './prerequisite-graph/index.js';
export type {
  PrerequisiteEdge,
  PrerequisiteGraph,
  PrerequisiteGraphStats,
  PrerequisiteNode,
} from './prerequisite-graph/index.js';
export { misconceptionGraph } from './misconception-graph-data.js';
export { vocabularyGraph } from './vocabulary-graph-data.js';
export { ncCoverageGraph } from './nc-coverage-graph-data.js';
export { minedDefinitionSynonyms } from './synonyms/definition-synonyms.js';

/**
 * Subpath barrel: `@oaknational/sdk-codegen/vocab`
 *
 * Static vocabulary graph data and authored domain ontology.
 * These are large data structures produced by the vocab-gen pipeline
 * (or hand-authored in the case of conceptGraph) and consumed at
 * runtime for LLM tool composition and curriculum knowledge queries.
 *
 * Pipeline APIs (readers, extractors, generators) remain in the
 * `/bulk` subpath — this subpath is data-only.
 */

export {
  threadProgressionGraph,
  prerequisiteGraph,
  misconceptionGraph,
  vocabularyGraph,
  ncCoverageGraph,
  minedDefinitionSynonyms,
} from './generated/vocab/index.js';

export { conceptGraph } from './mcp/property-graph-data.js';
export type {
  ConceptGraph,
  ConceptId,
  ConceptCategory,
  ConceptEdge,
} from './mcp/property-graph-data.js';

export type {
  MisconceptionGraph,
  MisconceptionGraphStats,
  MisconceptionNode,
  NCCoverageGraph,
  NCCoverageGraphStats,
  NCStatementNode,
  MinedSynonym,
  MinedSynonymsData,
  MinedSynonymsStats,
  PrerequisiteEdge,
  PrerequisiteGraph,
  PrerequisiteGraphStats,
  PrerequisiteNode,
  ThreadNode,
  ThreadProgressionGraph,
  ThreadProgressionStats,
  VocabularyGraph,
  VocabularyGraphStats,
  VocabularyNode,
} from './bulk/index.js';

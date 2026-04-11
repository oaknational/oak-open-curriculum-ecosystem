/**
 * Subpath barrel: `@oaknational/sdk-codegen/vocab`
 *
 * Types and hand-authored domain ontology for vocabulary graphs.
 *
 * Runtime graph DATA (large generated structures) is in the separate
 * `@oaknational/sdk-codegen/vocab-data` subpath to avoid loading
 * ~688K lines into the TypeScript project service during linting.
 *
 * Pipeline APIs (readers, extractors, generators) remain in the
 * `/bulk` subpath.
 */

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
  PriorKnowledgeEdge,
  PriorKnowledgeGraph,
  PriorKnowledgeGraphStats,
  PriorKnowledgeNode,
  ThreadNode,
  ThreadProgressionGraph,
  ThreadProgressionStats,
  VocabularyGraph,
  VocabularyGraphStats,
  VocabularyNode,
} from './bulk/index.js';

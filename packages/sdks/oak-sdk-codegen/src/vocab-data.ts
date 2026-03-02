/**
 * Subpath barrel: `@oaknational/sdk-codegen/vocab-data`
 *
 * Runtime graph data produced by the vocab-gen pipeline. These are
 * large static structures (~688K lines total) excluded from the lint
 * TypeScript program to prevent ESLint OOM.
 *
 * For types and the hand-authored concept graph, use
 * `@oaknational/sdk-codegen/vocab` instead.
 */

export {
  threadProgressionGraph,
  prerequisiteGraph,
  misconceptionGraph,
  vocabularyGraph,
  ncCoverageGraph,
  minedDefinitionSynonyms,
} from './generated/vocab/index.js';

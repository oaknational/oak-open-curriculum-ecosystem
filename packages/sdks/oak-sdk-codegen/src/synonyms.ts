/**
 * Subpath barrel: `@oaknational/sdk-codegen/synonyms`
 *
 * Curriculum domain synonyms and synonym export utilities.
 * The synonyms module is the single source of truth for all
 * synonym data used across MCP tools, search, and term normalisation.
 *
 * @see `src/synonyms/README.md` for synonym authoring guidance
 */

export {
  buildElasticsearchSynonyms,
  buildSynonymLookup,
  buildPhraseVocabulary,
  serialiseElasticsearchSynonyms,
  type ElasticsearchSynonymEntry,
  type ElasticsearchSynonymSet,
} from './synonym-export.js';

export { synonymsData, type SynonymsData } from './synonyms/index.js';

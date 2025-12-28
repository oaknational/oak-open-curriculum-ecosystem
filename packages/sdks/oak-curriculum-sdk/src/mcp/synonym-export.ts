/**
 * Utilities for exporting synonyms to various formats.
 *
 * The synonyms module (`./synonyms/index.ts`) is the SINGLE SOURCE OF TRUTH.
 * This module provides exports for:
 * - Elasticsearch synonym sets
 * - Flat lookup maps
 */

import { typeSafeEntries } from '../types/helpers/type-helpers.js';
import { synonymsData } from './synonyms/index.js';

/**
 * Elasticsearch synonym set entry format.
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/synonyms-apis.html
 */
export interface ElasticsearchSynonymEntry {
  readonly id: string;
  readonly synonyms: string;
}

/**
 * Full Elasticsearch synonym set payload.
 */
export interface ElasticsearchSynonymSet {
  readonly synonyms_set: readonly ElasticsearchSynonymEntry[];
}

/**
 * Type for synonym group objects (canonical -> alternatives mapping).
 */
type SynonymGroup = Readonly<Record<string, readonly string[]>>;

/**
 * Extracts entries from a synonym group in a type-safe manner.
 * Uses typeSafeEntries and ensures correct return typing.
 *
 * @param group - The synonym mapping (canonical term -> alternatives)
 * @returns Array of [canonical, alternatives] tuples
 */
function synonymGroupEntries(group: SynonymGroup): [string, readonly string[]][] {
  // For Record<string, readonly string[]>, typeSafeEntries returns [string, readonly string[]][]
  return typeSafeEntries(group);
}

/**
 * Processes a synonym group into Elasticsearch entries.
 *
 * @param categoryName - The category identifier for the ES entry ID
 * @param group - The synonym mapping (canonical term -> alternatives)
 * @returns Array of Elasticsearch synonym entries
 */
function processGroup(categoryName: string, group: SynonymGroup): ElasticsearchSynonymEntry[] {
  return synonymGroupEntries(group).map(([canonical, alternatives]) => ({
    id: `${categoryName}_${canonical}`,
    synonyms: [canonical, ...alternatives].join(', '),
  }));
}

/**
 * Builds a lookup map from a synonym group.
 *
 * @param group - The synonym mapping (canonical term -> alternatives)
 * @param lookup - The map to populate
 */
function populateLookup(group: SynonymGroup, lookup: Map<string, string>): void {
  for (const [canonical, alternatives] of synonymGroupEntries(group)) {
    // Map canonical to itself
    lookup.set(canonical.toLowerCase(), canonical);

    // Map each alternative to canonical
    for (const alt of alternatives) {
      lookup.set(alt.toLowerCase(), canonical);
    }
  }
}

/**
 * Builds an Elasticsearch-compatible synonym set from the SDK ontology data.
 *
 * @returns Elasticsearch synonym set JSON structure
 *
 * @example
 * ```typescript
 * import { buildElasticsearchSynonyms } from '@oaknational/oak-curriculum-sdk';
 *
 * const synonymSet = buildElasticsearchSynonyms();
 * // Write to file or POST to ES /_synonyms/oak-syns
 * ```
 */
export function buildElasticsearchSynonyms(): ElasticsearchSynonymSet {
  // Process each synonym group explicitly for type safety.
  // Dynamic iteration over a union of keys loses type information.
  const entries: ElasticsearchSynonymEntry[] = [
    ...processGroup('subjects', synonymsData.subjects),
    ...processGroup('keyStages', synonymsData.keyStages),
    ...processGroup('numbers', synonymsData.numbers),
    ...processGroup('geographyThemes', synonymsData.geographyThemes),
    ...processGroup('historyTopics', synonymsData.historyTopics),
    ...processGroup('mathsConcepts', synonymsData.mathsConcepts),
    ...processGroup('englishConcepts', synonymsData.englishConcepts),
    ...processGroup('scienceConcepts', synonymsData.scienceConcepts),
    ...processGroup('generic', synonymsData.generic),
    ...processGroup('educationalAcronyms', synonymsData.educationalAcronyms),
  ];

  return { synonyms_set: entries };
}

/**
 * Builds a flat map from alternative term to canonical term.
 * Useful for normalising user input before API calls.
 *
 * @returns Map where keys are alternative terms, values are canonical slugs
 *
 * @example
 * ```typescript
 * const map = buildSynonymLookup();
 * map.get('maths'); // 'maths' (canonical)
 * map.get('mathematics'); // 'maths'
 * map.get('key stage 1'); // 'ks1'
 * ```
 */
export function buildSynonymLookup(): ReadonlyMap<string, string> {
  const lookup = new Map<string, string>();

  // Process each synonym group explicitly for type safety.
  populateLookup(synonymsData.subjects, lookup);
  populateLookup(synonymsData.keyStages, lookup);
  populateLookup(synonymsData.numbers, lookup);
  populateLookup(synonymsData.geographyThemes, lookup);
  populateLookup(synonymsData.historyTopics, lookup);
  populateLookup(synonymsData.mathsConcepts, lookup);
  populateLookup(synonymsData.englishConcepts, lookup);
  populateLookup(synonymsData.scienceConcepts, lookup);
  populateLookup(synonymsData.generic, lookup);
  populateLookup(synonymsData.educationalAcronyms, lookup);

  return lookup;
}

/**
 * Serialises the ES synonym set to JSON string (for file writing).
 */
export function serialiseElasticsearchSynonyms(): string {
  return JSON.stringify(buildElasticsearchSynonyms(), null, 2);
}

/**
 * Extracts multi-word terms from a synonym group into a set.
 *
 * @param group - The synonym mapping (canonical term -> alternatives)
 * @param phrases - The set to populate with multi-word terms
 */
function collectPhrases(group: SynonymGroup, phrases: Set<string>): void {
  for (const [canonical, alternatives] of synonymGroupEntries(group)) {
    // Check canonical term for spaces
    if (canonical.includes(' ')) {
      phrases.add(canonical.toLowerCase());
    }

    // Check each alternative for spaces
    for (const alt of alternatives) {
      if (alt.includes(' ')) {
        phrases.add(alt.toLowerCase());
      }
    }
  }
}

/**
 * Extracts all multi-word terms from SDK synonym data.
 *
 * Returns a set of lowercased phrases (terms containing spaces) that should
 * be matched as phrases rather than individual tokens. Used by the search app
 * for phrase detection during query preprocessing.
 *
 * ES synonym filters apply after tokenization, so phrase synonyms like
 * "straight line => linear" cannot expand via the synonym filter. This vocabulary
 * enables phrase detection, a complementary mechanism that adds `match_phrase`
 * boosting to the RRF retriever for exact phrase matches.
 *
 * @returns ReadonlySet of multi-word curriculum terms
 *
 * @example
 * ```typescript
 * const vocab = buildPhraseVocabulary();
 * vocab.has('straight line');     // true
 * vocab.has('completing the square'); // true
 * vocab.has('trigonometry');      // false (single word)
 * ```
 *
 * @see {@link detectCurriculumPhrases} in search app for consumer
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.5
 */
export function buildPhraseVocabulary(): ReadonlySet<string> {
  const phrases = new Set<string>();

  // Process each synonym group explicitly for type safety.
  collectPhrases(synonymsData.subjects, phrases);
  collectPhrases(synonymsData.keyStages, phrases);
  collectPhrases(synonymsData.numbers, phrases);
  collectPhrases(synonymsData.geographyThemes, phrases);
  collectPhrases(synonymsData.historyTopics, phrases);
  collectPhrases(synonymsData.mathsConcepts, phrases);
  collectPhrases(synonymsData.englishConcepts, phrases);
  collectPhrases(synonymsData.scienceConcepts, phrases);
  collectPhrases(synonymsData.generic, phrases);
  collectPhrases(synonymsData.educationalAcronyms, phrases);

  return phrases;
}

/**
 * Utilities for exporting synonyms to various formats.
 *
 * The `ontologyData.synonyms` is the SINGLE SOURCE OF TRUTH.
 * This module provides exports for:
 * - Elasticsearch synonym sets
 * - Flat lookup maps
 *
 * @module synonym-export
 */

import { typeSafeEntries } from '../types/helpers/type-helpers.js';
import { ontologyData } from './ontology-data.js';

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
    ...processGroup('subjects', ontologyData.synonyms.subjects),
    ...processGroup('keyStages', ontologyData.synonyms.keyStages),
    ...processGroup('geographyThemes', ontologyData.synonyms.geographyThemes),
    ...processGroup('historyTopics', ontologyData.synonyms.historyTopics),
    ...processGroup('mathsConcepts', ontologyData.synonyms.mathsConcepts),
    ...processGroup('englishConcepts', ontologyData.synonyms.englishConcepts),
    ...processGroup('scienceConcepts', ontologyData.synonyms.scienceConcepts),
    ...processGroup('generic', ontologyData.synonyms.generic),
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
  populateLookup(ontologyData.synonyms.subjects, lookup);
  populateLookup(ontologyData.synonyms.keyStages, lookup);
  populateLookup(ontologyData.synonyms.geographyThemes, lookup);
  populateLookup(ontologyData.synonyms.historyTopics, lookup);
  populateLookup(ontologyData.synonyms.mathsConcepts, lookup);
  populateLookup(ontologyData.synonyms.englishConcepts, lookup);
  populateLookup(ontologyData.synonyms.scienceConcepts, lookup);
  populateLookup(ontologyData.synonyms.generic, lookup);

  return lookup;
}

/**
 * Serialises the ES synonym set to JSON string (for file writing).
 */
export function serialiseElasticsearchSynonyms(): string {
  return JSON.stringify(buildElasticsearchSynonyms(), null, 2);
}

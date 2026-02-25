/**
 * Elasticsearch analyser, normaliser, and filter configurations for Oak search indexes.
 *
 * These settings are applied at index creation time to enable consistent text analysis.
 */

/**
 * Elasticsearch analyzer configuration.
 */
export interface EsAnalyzerConfig {
  readonly type: 'custom';
  readonly tokenizer: string;
  readonly filter: readonly string[];
}

/**
 * Elasticsearch normalizer configuration.
 */
export interface EsNormalizerConfig {
  readonly type: 'custom';
  readonly filter: readonly string[];
}

/**
 * Elasticsearch filter configuration for synonyms.
 */
export interface EsFilterConfig {
  readonly type: 'synonym_graph';
  readonly synonyms_set: string;
  readonly updateable: boolean;
}

/**
 * Elasticsearch index settings structure.
 */
export interface EsSettings {
  readonly analysis: {
    readonly analyzer: Readonly<Record<string, EsAnalyzerConfig>>;
    readonly normalizer: Readonly<Record<string, EsNormalizerConfig>>;
    readonly filter: Readonly<Record<string, EsFilterConfig>>;
  };
}

/**
 * Analyzer configurations for Oak search indexes.
 *
 * - `oak_text_index`: Used at index time, applies lowercase normalisation.
 * - `oak_text_search`: Used at search time, includes synonym expansion.
 *
 * Note: Phase 3e tested stemming and stop words but they regressed hard query performance.
 * The simpler lowercase + synonyms configuration provides better results.
 *
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html
 */
export const ES_ANALYZER_CONFIG = {
  oak_text_index: {
    type: 'custom',
    tokenizer: 'standard',
    filter: ['lowercase'],
  },
  oak_text_search: {
    type: 'custom',
    tokenizer: 'standard',
    filter: ['lowercase', 'oak_syns_filter'],
  },
} as const satisfies Readonly<Record<string, EsAnalyzerConfig>>;

/**
 * Normalizer configurations for Oak search indexes.
 * - `oak_lower`: Applied to keyword fields for case-insensitive filtering.
 */
export const ES_NORMALIZER_CONFIG = {
  oak_lower: {
    type: 'custom',
    filter: ['lowercase', 'asciifolding'],
  },
} as const satisfies Readonly<Record<string, EsNormalizerConfig>>;

/**
 * Filter configurations for Oak search indexes.
 *
 * - `oak_syns_filter`: Updateable synonym graph filter using the oak-syns synonym set.
 *
 * Note: Phase 3e tested stop words and stemming but they regressed hard query performance.
 * Keeping type definitions for future use but not instantiating the filters.
 */
export const ES_FILTER_CONFIG = {
  oak_syns_filter: {
    type: 'synonym_graph',
    synonyms_set: 'oak-syns',
    updateable: true,
  },
} as const satisfies Readonly<Record<string, EsFilterConfig>>;

/**
 * Builds the ES index settings object with analyzers, normalizers, and filters.
 * @returns The complete ES settings object
 */
export function buildEsSettings(): EsSettings {
  return {
    analysis: {
      analyzer: ES_ANALYZER_CONFIG,
      normalizer: ES_NORMALIZER_CONFIG,
      filter: ES_FILTER_CONFIG,
    },
  };
}

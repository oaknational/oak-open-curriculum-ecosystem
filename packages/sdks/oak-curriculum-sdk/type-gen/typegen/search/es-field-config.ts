/**
 * @module es-field-config
 * @description Configuration for mapping Zod schema types to Elasticsearch field mappings.
 * Defines analyzers, normalizers, filters, and field type overrides used in search index generation.
 *
 * This module provides pure functions for converting Zod type descriptors to ES field mappings,
 * enabling the generator to produce valid Elasticsearch index mappings from the Zod schemas.
 *
 * @example
 * ```typescript
 * import { buildEsFieldMapping, LESSONS_FIELD_OVERRIDES } from './es-field-config.js';
 *
 * const mapping = buildEsFieldMapping(
 *   { type: 'string' },
 *   LESSONS_FIELD_OVERRIDES.lesson_semantic
 * );
 * // { type: 'semantic_text' }
 * ```
 */

// Re-export field overrides from separate module
export {
  LESSONS_FIELD_OVERRIDES,
  UNITS_FIELD_OVERRIDES,
  UNIT_ROLLUP_FIELD_OVERRIDES,
  SEQUENCES_FIELD_OVERRIDES,
  SEQUENCE_FACETS_FIELD_OVERRIDES,
  META_FIELD_OVERRIDES,
} from './es-field-overrides.js';

/**
 * Descriptor for a Zod type, used to determine the corresponding ES field type.
 */
export interface ZodTypeDescriptor {
  readonly type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  readonly items?: ZodTypeDescriptor;
}

/**
 * Elasticsearch field mapping configuration.
 * Supports all ES field types used in the search indexes.
 */
export interface EsFieldMapping {
  readonly type:
    | 'keyword'
    | 'text'
    | 'integer'
    | 'long'
    | 'boolean'
    | 'date'
    | 'semantic_text'
    | 'completion'
    | 'search_as_you_type'
    | 'object';
  readonly normalizer?: string;
  readonly analyzer?: string;
  readonly search_analyzer?: string;
  readonly ignore_above?: number;
  readonly term_vector?: string;
  readonly contexts?: readonly EsCompletionContext[];
  readonly fields?: Readonly<Record<string, EsFieldMapping>>;
  readonly enabled?: boolean;
}

/**
 * Completion field context configuration.
 */
export interface EsCompletionContext {
  readonly name: string;
  readonly type: 'category';
}

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
 * - `oak_text_index`: Used at index time, applies lowercase normalisation.
 * - `oak_text_search`: Used at search time, includes synonym expansion.
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
 * - `oak_syns_filter`: Updateable synonym graph filter using the oak-syns synonym set.
 */
export const ES_FILTER_CONFIG = {
  oak_syns_filter: {
    type: 'synonym_graph',
    synonyms_set: 'oak-syns',
    updateable: true,
  },
} as const satisfies Readonly<Record<string, EsFilterConfig>>;

/**
 * Maps a Zod type descriptor to the corresponding ES field type.
 *
 * @param descriptor - The Zod type descriptor to convert
 * @returns The ES field type string
 *
 * @example
 * ```typescript
 * zodTypeDescriptorToEsFieldType({ type: 'string' }); // 'keyword'
 * zodTypeDescriptorToEsFieldType({ type: 'number' }); // 'integer'
 * zodTypeDescriptorToEsFieldType({ type: 'array', items: { type: 'string' } }); // 'keyword'
 * ```
 */
export function zodTypeDescriptorToEsFieldType(
  descriptor: ZodTypeDescriptor,
): EsFieldMapping['type'] {
  switch (descriptor.type) {
    case 'string':
      return 'keyword';
    case 'number':
      return 'integer';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'date';
    case 'array':
      // Arrays use the same ES type as their items (ES handles multi-valued fields)
      if (descriptor.items) {
        return zodTypeDescriptorToEsFieldType(descriptor.items);
      }
      return 'keyword';
    case 'object':
      // Objects default to keyword; override should be provided for complex types
      return 'keyword';
    default: {
      // Exhaustiveness check - this should never execute
      const exhaustiveCheck: never = descriptor.type;
      throw new Error(`Unhandled Zod type: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * Builds an ES field mapping from a Zod type descriptor and optional override.
 *
 * @param descriptor - The Zod type descriptor
 * @param override - Optional ES-specific field configuration override
 * @returns The complete ES field mapping
 *
 * @example
 * ```typescript
 * // Simple keyword field with normalizer
 * buildEsFieldMapping({ type: 'string' });
 * // { type: 'keyword', normalizer: 'oak_lower' }
 *
 * // Semantic text field with override
 * buildEsFieldMapping({ type: 'string' }, { type: 'semantic_text' });
 * // { type: 'semantic_text' }
 * ```
 */
export function buildEsFieldMapping(
  descriptor: ZodTypeDescriptor,
  override?: EsFieldMapping,
): EsFieldMapping {
  // If an override is provided, use it directly
  if (override) {
    return override;
  }

  const esType = zodTypeDescriptorToEsFieldType(descriptor);

  // Apply default normalizer to keyword fields
  if (esType === 'keyword') {
    return {
      type: 'keyword',
      normalizer: 'oak_lower',
    };
  }

  // Non-keyword fields don't need normalizer
  return { type: esType };
}

/**
 * Builds the ES index settings object with analyzers, normalizers, and filters.
 *
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

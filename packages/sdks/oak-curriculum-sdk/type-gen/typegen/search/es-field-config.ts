/**
 * @module es-field-config
 * @description Configuration for mapping Zod schema types to Elasticsearch field mappings.
 * Provides pure functions for converting Zod type descriptors to ES field mappings.
 *
 * @example
 * ```typescript
 * import { buildEsFieldMapping, LESSONS_FIELD_OVERRIDES } from './es-field-config.js';
 * const mapping = buildEsFieldMapping({ type: 'string' }, LESSONS_FIELD_OVERRIDES.lesson_semantic);
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
} from './es-field-overrides/index.js';

// Re-export analyzer config from separate module
export {
  type EsAnalyzerConfig,
  type EsNormalizerConfig,
  type EsFilterConfig,
  type EsSettings,
  ES_ANALYZER_CONFIG,
  ES_NORMALIZER_CONFIG,
  ES_FILTER_CONFIG,
  buildEsSettings,
} from './es-analyzer-config.js';

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
    | 'object'
    | 'dense_vector';
  readonly normalizer?: string;
  readonly analyzer?: string;
  readonly search_analyzer?: string;
  readonly ignore_above?: number;
  readonly term_vector?: string;
  readonly contexts?: readonly EsCompletionContext[];
  readonly fields?: Readonly<Record<string, EsFieldMapping>>;
  readonly enabled?: boolean;
  /** Number of dimensions for dense_vector fields. */
  readonly dims?: number;
  /** Whether the dense_vector field is indexed for kNN search. */
  readonly index?: boolean;
  /** Similarity metric for dense_vector fields. */
  readonly similarity?: 'cosine' | 'dot_product' | 'l2_norm';
}

/**
 * Completion field context configuration.
 */
export interface EsCompletionContext {
  readonly name: string;
  readonly type: 'category';
}

/**
 * Maps a Zod type descriptor to the corresponding ES field type.
 * @param descriptor - The Zod type descriptor to convert
 * @returns The ES field type string
 *
 * @example
 * ```typescript
 * zodTypeDescriptorToEsFieldType({ type: 'string' }); // 'keyword'
 * zodTypeDescriptorToEsFieldType({ type: 'number' }); // 'integer'
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
 * @param descriptor - The Zod type descriptor
 * @param override - Optional ES-specific field configuration override
 * @returns The complete ES field mapping
 *
 * @example
 * ```typescript
 * buildEsFieldMapping({ type: 'string' }); // { type: 'keyword', normalizer: 'oak_lower' }
 * buildEsFieldMapping({ type: 'string' }, { type: 'semantic_text' }); // { type: 'semantic_text' }
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

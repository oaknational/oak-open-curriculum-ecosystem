/**
 * Core Elasticsearch field mapping types.
 *
 * Leaf module with zero dependencies — extracted to break the circular
 * dependency between `es-field-config.ts`, `es-field-overrides/common.ts`,
 * and the override modules. All override modules and `es-field-config.ts`
 * import types from here instead of creating a barrel-mediated cycle.
 *
 * @packageDocumentation
 */

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

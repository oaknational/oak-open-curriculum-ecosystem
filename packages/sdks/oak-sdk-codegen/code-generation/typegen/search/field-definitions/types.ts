/**
 * Shared type definitions for field-based index generation.
 *
 * This module defines the core types used across both curriculum and observability
 * field definitions. By centralising these types, we ensure consistent field
 * definition structure across all search indexes.
 */

/**
 * Zod type identifier for field definitions.
 *
 * Maps to Zod schema builders:
 * - `string` → `z.string().min(1)`
 * - `number` → `z.number().int().nonnegative()`
 * - `boolean` → `z.boolean()`
 * - `array-string` → `z.array(z.string().min(1))`
 * - `array-number` → `z.array(z.number())`
 * - `object` → `z.record(z.string(), z.unknown())` or specific schema reference
 */
export type ZodFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array-string'
  | 'array-number'
  | 'object';

/**
 * Definition for a single field in a search index document.
 *
 * This interface captures all information needed to generate both:
 * - A Zod schema field for runtime validation
 * - An Elasticsearch mapping field for index configuration
 *
 * - `name` — The field name as it appears in documents
 * - `zodType` — The Zod type category for this field
 * - `optional` — Whether the field is optional (affects `.optional()` in Zod)
 * - `enumRef` — Optional reference to an enum tuple (e.g., 'SUBJECT_TUPLE')
 */
export interface FieldDefinition {
  /** The field name as it appears in documents and mappings. */
  readonly name: string;

  /** The Zod type category for schema generation. */
  readonly zodType: ZodFieldType;

  /** Whether this field is optional in the document schema. */
  readonly optional: boolean;

  /**
   * Optional reference to an enum tuple constant name.
   * When specified, the Zod generator will use `z.enum(${enumRef})` instead of `z.string()`.
   * @example 'SUBJECT_TUPLE' | 'KEY_STAGE_TUPLE'
   */
  readonly enumRef?: string;
}

/**
 * A readonly array of field definitions representing all fields in a search index.
 *
 * @example
 * ```typescript
 * const fields: IndexFieldDefinitions = [
 *   { name: 'id', zodType: 'string', optional: false },
 *   { name: 'tags', zodType: 'array-string', optional: true },
 * ] as const;
 * ```
 */
export type IndexFieldDefinitions = readonly FieldDefinition[];

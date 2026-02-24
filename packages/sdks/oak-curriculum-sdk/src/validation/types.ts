/* eslint-disable max-lines -- validation types module with comprehensive type definitions */
/**
 * Type definitions for validation module
 * Pure types with no runtime behaviour
 */

import type { z, ZodError } from 'zod';
/** ZodIssue type derived from ZodError (not directly exported in Zod v4) */
type ZodIssue = ZodError['issues'][number];

import {
  curriculumSchemas,
  type CurriculumSchemaDefinition,
  type CurriculumSchemaName,
} from '@oaknational/curriculum-sdk-generation/zod';
import {
  SearchLessonsResponseSchema,
  SearchMultiScopeResponseSchema,
  SearchSequencesResponseSchema,
  SearchSuggestionResponseSchema,
  SearchUnitsResponseSchema,
  type SearchSuggestionResponse,
  type SearchScopeWithAll,
} from '@oaknational/curriculum-sdk-generation/search';

/**
 * Result type for validation operations
 * Discriminated union for type-safe error handling
 */
export interface ValidationSuccess<T> {
  ok: true;
  value: T;
}
export interface ValidationIssue {
  path: readonly (string | number)[];
  message?: string;
  code?: ZodIssue['code'] | 'VALIDATION_ERROR' | 'UNKNOWN_OPERATION' | 'NO_SCHEMA_FOR_STATUS';
  details?: {
    expected?: string;
    received?: string;
  };
}

/**
 * Traceability information to help locate where validation occurred
 */
export interface ValidationTrace {
  when: string;
  context?: {
    path?: string;
    method?: string;
    statusCode?: number;
    operationId?: string;
  };
}

export interface ValidationFailure {
  ok: false;
  issues: readonly ValidationIssue[];
  firstMessage?: string;
  trace?: ValidationTrace;
  zod?: {
    issues: readonly ZodIssue[];
  };
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Validation issue details
 */

/**
 * Options for the validated client wrapper
 */
export interface ValidatedClientOptions {
  /** Whether to validate requests before sending */
  validateRequest?: boolean;
  /** Whether to validate responses after receiving */
  validateResponse?: boolean;
  /** Whether to throw on validation failure (vs returning result) */
  strict?: boolean;
}

/**
 * HTTP methods supported by validation
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'trace';

/**
 * Type predicate to check if a validation result is successful
 * Enables type narrowing without type assertions
 */
export function isValidationSuccess<T>(
  result: ValidationResult<T>,
): result is ValidationSuccess<T> {
  return result.ok;
}

/**
 * Type predicate to check if a validation result is a failure
 * Enables type narrowing without type assertions
 */
export function isValidationFailure<T>(result: ValidationResult<T>): result is ValidationFailure {
  return !result.ok;
}

/**
 * Type-safe Zod parsing helper that eliminates need for type assertions
 * Returns a ValidationResult with proper type narrowing
 */
/**
 * Output type helper for Zod schemas consumed by the domain-specific parsing helpers.
 */
/** Input type for a Zod schema (uses infer which works for both input and output in most cases) */
export type SchemaInput<Schema extends z.ZodType> = z.infer<Schema>;

/** Output type for a Zod schema (Zod v4 compatible) */
export type SchemaOutput<Schema extends z.ZodType> = z.infer<Schema>;

const searchResponseSchemas = {
  all: SearchMultiScopeResponseSchema,
  lessons: SearchLessonsResponseSchema,
  units: SearchUnitsResponseSchema,
  sequences: SearchSequencesResponseSchema,
} as const;

export type SearchResponseSchemaMap = typeof searchResponseSchemas;

export type SearchResponseForScope<Scope extends SearchScopeWithAll> = SchemaOutput<
  SearchResponseSchemaMap[Scope]
>;
/**
 * Safely parse unknown data using a Zod schema and capture validation issues.
 */
const isInvalidTypeIssue = (
  issue: ZodIssue,
): issue is ZodIssue & { expected: unknown; received: unknown } =>
  issue.code === 'invalid_type' && 'expected' in issue && 'received' in issue;

const coerceString = (value: unknown): string =>
  typeof value === 'string' ? value : JSON.stringify(value);

/** Filter ZodIssue path to only include strings and numbers (Zod v4 paths can include symbols) */
function filterPathToStringOrNumber(path: readonly PropertyKey[]): readonly (string | number)[] {
  return path.filter(
    (segment): segment is string | number =>
      typeof segment === 'string' || typeof segment === 'number',
  );
}

function mapValidationIssues(zodIssues: readonly ZodIssue[]): readonly ValidationIssue[] {
  return zodIssues.map((issue) => {
    const base: ValidationIssue = {
      path: filterPathToStringOrNumber(issue.path),
      message: issue.message,
      code: issue.code,
    };

    if (isInvalidTypeIssue(issue)) {
      const details = {
        expected: coerceString(issue.expected),
        received: coerceString(issue.received),
      };
      return { ...base, details };
    }
    return base;
  });
}

function toValidationFailure(zodIssues: readonly ZodIssue[]): ValidationFailure {
  const issues = mapValidationIssues(zodIssues);
  return {
    ok: false,
    issues,
    firstMessage: issues[0]?.message,
    trace: { when: new Date().toISOString() },
    zod: { issues: zodIssues },
  };
}

function parseSchema<Schema extends z.ZodType>(
  schema: Schema,
  data: unknown,
): ValidationResult<SchemaOutput<Schema>> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, value: result.data };
  }
  return toValidationFailure(result.error.issues);
}

/**
 * Safely parse unknown data using a Zod schema and capture validation issues.
 */
export function parseWithCurriculumSchema<Name extends CurriculumSchemaName>(
  schemaName: Name,
  data: unknown,
): ValidationResult<SchemaOutput<CurriculumSchemaDefinition<Name>>> {
  const schema = curriculumSchemas[schemaName];
  return parseSchema(schema, data);
}

export function parseWithCurriculumSchemaInstance<Schema extends CurriculumSchemaDefinition>(
  schema: Schema,
  data: unknown,
): ValidationResult<SchemaOutput<Schema>> {
  return parseSchema(schema, data);
}

export function parseEndpointParameters<Schema extends z.ZodType>(
  schema: Schema,
  data: unknown,
): ValidationResult<SchemaOutput<Schema>> {
  return parseSchema(schema, data);
}

/** Parse search response with type-safe overloads for each scope */
export function parseSearchResponse(
  scope: 'all',
  data: unknown,
): ValidationResult<z.infer<typeof SearchMultiScopeResponseSchema>>;
export function parseSearchResponse(
  scope: 'lessons',
  data: unknown,
): ValidationResult<z.infer<typeof SearchLessonsResponseSchema>>;
export function parseSearchResponse(
  scope: 'units',
  data: unknown,
): ValidationResult<z.infer<typeof SearchUnitsResponseSchema>>;
export function parseSearchResponse(
  scope: 'sequences',
  data: unknown,
): ValidationResult<z.infer<typeof SearchSequencesResponseSchema>>;
export function parseSearchResponse<Scope extends SearchScopeWithAll>(
  scope: Scope,
  data: unknown,
): ValidationResult<SearchResponseForScope<Scope>>;
export function parseSearchResponse(
  scope: SearchScopeWithAll,
  data: unknown,
): ValidationResult<unknown> {
  const schema = searchResponseSchemas[scope];
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, value: result.data };
  }
  return toValidationFailure(result.error.issues);
}

export function parseSearchSuggestionResponse(
  data: unknown,
): ValidationResult<SearchSuggestionResponse> {
  return parseSchema(SearchSuggestionResponseSchema, data);
}

export function getSearchResponseSchema<Scope extends SearchScopeWithAll>(
  scope: Scope,
): SearchResponseSchemaMap[Scope] {
  return searchResponseSchemas[scope];
}

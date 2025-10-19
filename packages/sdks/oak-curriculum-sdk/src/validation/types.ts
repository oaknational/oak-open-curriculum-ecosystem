/**
 * Type definitions for validation module
 * Pure types with no runtime behaviour
 */

import type { SafeParseReturnType, ZodIssue, ZodTypeAny } from 'zod';
import {
  curriculumSchemas,
  type CurriculumSchemaDefinition,
  type CurriculumSchemaName,
} from '../types/generated/zod/curriculumZodSchemas.js';
import {
  SearchLessonsResponseSchema,
  SearchMultiScopeResponseSchema,
  SearchSequencesResponseSchema,
  SearchSuggestionResponseSchema,
  SearchUnitsResponseSchema,
  type SearchSuggestionResponse,
} from '../types/generated/search/index.js';
import { type SearchScopeWithAll } from '../types/generated/search/scopes.js';

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
export type SchemaInput<Schema extends ZodTypeAny> = Schema extends { _input: infer Input }
  ? Input
  : never;
export type SchemaOutput<Schema extends ZodTypeAny> = Schema extends { _output: infer Output }
  ? Output
  : never;

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

function mapValidationIssues(zodIssues: readonly ZodIssue[]): readonly ValidationIssue[] {
  return zodIssues.map((issue) => {
    const base: ValidationIssue = {
      path: issue.path,
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

function parseSchema<Schema extends ZodTypeAny>(
  schema: Schema,
  data: unknown,
): ValidationResult<SchemaOutput<Schema>> {
  const result: SafeParseReturnType<SchemaInput<Schema>, SchemaOutput<Schema>> = schema.safeParse(
    data,
  );
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

export function parseEndpointParameters<Schema extends ZodTypeAny>(
  schema: Schema,
  data: unknown,
): ValidationResult<SchemaOutput<Schema>> {
  return parseSchema(schema, data);
}

export function parseSearchResponse<Scope extends SearchScopeWithAll>(
  scope: Scope,
  data: unknown,
): ValidationResult<SearchResponseForScope<Scope>> {
  const schema = searchResponseSchemas[scope];
  return parseSchema(schema, data);
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

/**
 * Validation logic for search tool arguments.
 *
 * This module provides the validateSearchArgs function which validates and
 * normalises raw input into strongly-typed SearchArgs. Uses Zod for schema
 * validation and the generated type guards for enum validation.
 *
 * @module aggregated-search/validation
 */

import { z } from 'zod';
import {
  type KeyStage,
  isKeyStage,
  type Subject,
  isSubject,
} from '../../types/generated/api-schema/path-parameters.js';
import type { SearchArgs } from './types.js';

/** Error message for missing or invalid search query. */
const SEARCH_QUERY_ERROR_MESSAGE = 'search requires a non-empty query string ("query" or "q")';

/**
 * Zod schema for string-only search input.
 *
 * Allows users to pass just a query string instead of an object.
 */
const SearchStringSchema = z.string().trim().min(1, { message: SEARCH_QUERY_ERROR_MESSAGE });

/**
 * Zod schema for object-based search input.
 *
 * Validates the shape of the input object before type narrowing.
 */
const SearchObjectShape = z
  .object({
    query: z
      .string({ error: SEARCH_QUERY_ERROR_MESSAGE })
      .trim()
      .min(1, { message: SEARCH_QUERY_ERROR_MESSAGE })
      .optional(),
    q: z
      .string({ error: SEARCH_QUERY_ERROR_MESSAGE })
      .trim()
      .min(1, { message: SEARCH_QUERY_ERROR_MESSAGE })
      .optional(),
    keyStage: z.string({ error: 'keyStage must be one of ks1, ks2, ks3, ks4' }).optional(),
    subject: z.string({ error: 'subject must be a string' }).optional(),
    unit: z.string({ error: 'unit must be a string' }).optional(),
  })
  .strict();

/** Inferred type from the Zod object schema. */
type SearchObjectInput = z.infer<typeof SearchObjectShape>;

/**
 * Combined Zod schema accepting either string or object input.
 */
const SearchArgsSchema = z.union([SearchStringSchema, SearchObjectShape]);

/**
 * Validates and narrows a key stage string to the KeyStage type.
 *
 * Uses the generated isKeyStage type guard from path-parameters.ts
 * to ensure the value matches the upstream API schema.
 *
 * @param value - Raw key stage string from input
 * @returns Result object with narrowed KeyStage or error message
 */
function normaliseKeyStage(
  value: string | undefined,
): { ok: true; value?: KeyStage } | { ok: false; message: string } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (!isKeyStage(value)) {
    return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
  }
  return { ok: true, value };
}

/**
 * Validates and narrows a subject string to the Subject type.
 *
 * Uses the generated isSubject type guard from path-parameters.ts
 * to ensure the value matches the upstream API schema.
 *
 * @param value - Raw subject string from input
 * @returns Result object with narrowed Subject or error message
 */
function normaliseSubject(
  value: string | undefined,
): { ok: true; value?: Subject } | { ok: false; message: string } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (!isSubject(value)) {
    return { ok: false, message: 'subject must be a recognised subject slug' };
  }
  return { ok: true, value };
}

/**
 * Normalises a unit slug value by trimming whitespace.
 *
 * @param value - Raw unit string from input
 * @returns Trimmed unit slug or undefined if empty
 */
function normaliseUnit(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Maps a validated object input to SearchArgs.
 *
 * Applies normalisation to each field and returns a Result type.
 *
 * @param value - Zod-validated object input
 * @returns Result object with SearchArgs or error message
 */
function mapSearchObject(
  value: SearchObjectInput,
): { ok: true; value: SearchArgs } | { ok: false; message: string } {
  const query = value.q ?? value.query;
  if (query === undefined) {
    return { ok: false, message: SEARCH_QUERY_ERROR_MESSAGE };
  }

  const keyStageOutcome = normaliseKeyStage(value.keyStage);
  if (!keyStageOutcome.ok) {
    return keyStageOutcome;
  }

  const subjectOutcome = normaliseSubject(value.subject);
  if (!subjectOutcome.ok) {
    return subjectOutcome;
  }

  const unit = normaliseUnit(value.unit);

  return {
    ok: true,
    value: {
      q: query,
      keyStage: keyStageOutcome.value,
      subject: subjectOutcome.value,
      unit,
    },
  };
}

/**
 * Validates and normalises raw search input to strongly-typed SearchArgs.
 *
 * Accepts either a plain string (used as the query) or an object with
 * query, keyStage, subject, and unit fields. Returns a Result type
 * with either the validated SearchArgs or an error message.
 *
 * @param input - Raw input from MCP tool call (unknown type)
 * @returns Result object with validated SearchArgs or error message
 *
 * @example
 * ```typescript
 * // String input
 * const result1 = validateSearchArgs('photosynthesis');
 * // { ok: true, value: { q: 'photosynthesis' } }
 *
 * // Object input
 * const result2 = validateSearchArgs({ q: 'fractions', keyStage: 'ks2' });
 * // { ok: true, value: { q: 'fractions', keyStage: 'ks2' } }
 *
 * // Invalid input
 * const result3 = validateSearchArgs({ keyStage: 'invalid' });
 * // { ok: false, message: 'search requires a non-empty query string...' }
 * ```
 */
export function validateSearchArgs(
  input: unknown,
): { ok: true; value: SearchArgs } | { ok: false; message: string } {
  if (typeof input !== 'string' && (typeof input !== 'object' || input === null)) {
    return { ok: false, message: 'search expects a string or object input' };
  }

  const result = SearchArgsSchema.safeParse(input);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return { ok: false, message: firstIssue.message };
  }

  if (typeof result.data === 'string') {
    return { ok: true, value: { q: result.data } };
  }

  return mapSearchObject(result.data);
}

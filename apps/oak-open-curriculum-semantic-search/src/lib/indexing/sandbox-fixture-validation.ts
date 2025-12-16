/**
 * Validation utilities for sandbox fixture JSON parsing.
 *
 * These utilities handle the external data boundary when parsing fixture
 * JSON files. They use Zod for validation and provide type-safe access
 * to fixture data structures.
 */

import { z } from 'zod';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { isKeyStage, isSubject } from '../../adapters/sdk-guards';

/**
 * Zod schema for parsing JSON objects keyed by string at the boundary.
 * This is used when parsing fixture files where we need to iterate over keys.
 */
const stringKeyedObjectSchema = z.record(z.string(), z.unknown());

/**
 * Type for string-keyed objects from fixture JSON parsing.
 * Internal type - not exported to avoid exposing Record<string, unknown>.
 */
type StringKeyedObject = z.infer<typeof stringKeyedObjectSchema>;

/**
 * Returns the keys of a Zod-validated string-keyed object.
 * This is used at JSON parsing boundaries where keys are genuinely unknown strings.
 * @remarks The Object.keys usage is intentional here — we're at an external data boundary.
 */
export function getRecordKeys(record: StringKeyedObject): string[] {
  // eslint-disable-next-line no-restricted-properties -- At JSON boundary, keys are genuinely unknown strings
  return Object.keys(record);
}

/**
 * Parses and validates a string-keyed object at the external JSON boundary.
 * Uses Zod for validation, returning a properly typed object.
 */
export function parseStringKeyedObject(value: unknown, errorMessage: string): StringKeyedObject {
  const result = stringKeyedObjectSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`${errorMessage}: ${result.error.message}`);
  }
  return result.data;
}

export function ensureKeyStage(value: unknown, errorMessage: string): KeyStage {
  if (typeof value !== 'string' || !isKeyStage(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

export function ensureSubject(value: unknown, errorMessage: string): SearchSubjectSlug {
  if (typeof value !== 'string' || !isSubject(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

export function ensureNonEmptyString(value: unknown, errorMessage: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(errorMessage);
  }
  return value;
}

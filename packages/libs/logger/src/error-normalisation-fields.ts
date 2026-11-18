/**
 * Shared field extraction helpers for logger error normalisation.
 */

import {
  sanitiseForJson,
  sanitiseObject,
  type JsonObject,
  type JsonValue,
} from '@oaknational/observability';
import { typeSafeEntries, typeSafeKeys } from '@oaknational/type-helpers';
import { describeThrownObject, readConstructorName } from './thrown-object-description.js';
import type { LogContext } from './types.js';

const RESERVED_ERROR_KEYS = new Set([
  '__oakNormalizedError',
  'cause',
  'context',
  'message',
  'metadata',
  'name',
  'stack',
]);

/**
 * Structured error fields extracted from a native or thrown object.
 */
export interface ErrorNormalisationFields {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: unknown;
  readonly metadata?: LogContext;
}

/**
 * Extracts normalisation fields from a native `Error`.
 *
 * @param error - Native error value
 * @returns Structured error fields
 */
export function createNativeErrorFields(error: Error): ErrorNormalisationFields {
  const descriptors = Object.getOwnPropertyDescriptors(error);

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: readDescriptorValue(descriptors, 'cause'),
    metadata: mergeMetadata(
      createContextMetadata(readDescriptorValue(descriptors, 'context')),
      createMetadataFromDescriptors(descriptors),
    ),
  };
}

/**
 * Extracts normalisation fields from an arbitrary thrown object.
 *
 * Bad practice, kept until the logger's error boundary is made strict
 * (MCP-880). This function accepts a value that is not an `Error` and guesses
 * a name and a message for it through a chain of fallbacks (a `name` field,
 * then the class name; a `message` field, then the JSON form, then a custom
 * `toString`). A fallback chain hides the incorrect value where it should
 * surface it. The
 * estate is typed at every point, so a non-`Error` should be unable to reach
 * the logger as an error: the boundary takes an `Error`, and whatever catches
 * an `unknown` reports a value that is not an `Error` as a failure of its own
 * through `Result<T, E>`.
 *
 * @param value - Unknown thrown value
 * @returns Structured fields when the value is a non-array object
 */
export function createThrownObjectFields(value: unknown): ErrorNormalisationFields | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);
  const sanitisedObject = sanitiseToJsonObject(value);

  return {
    name: readStringValue(sanitisedObject, 'name') ?? readConstructorName(value) ?? 'Error',
    message:
      readStringValue(sanitisedObject, 'message') ?? describeThrownObject(value, sanitisedObject),
    stack: readStringValue(sanitisedObject, 'stack'),
    cause: readDescriptorValue(descriptors, 'cause'),
    metadata: mergeMetadata(
      createContextMetadata(readDescriptorValue(descriptors, 'context')),
      createMetadataFromDescriptors(descriptors),
    ),
  };
}

function createContextMetadata(value: unknown): LogContext | undefined {
  const sanitisedContext = sanitiseObject(value);
  return cleanMetadata(sanitisedContext ?? undefined);
}

function sanitiseToJsonObject(value: unknown): JsonObject | undefined {
  const sanitisedValue = sanitiseForJson(value);
  if (!isJsonObjectValue(sanitisedValue)) {
    return undefined;
  }

  return sanitisedValue;
}

function isJsonObjectValue(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readDescriptorValue(descriptors: PropertyDescriptorMap, key: string): unknown {
  return descriptors[key]?.value;
}

function readStringValue(source: JsonObject | undefined, key: string): string | undefined {
  const value = source?.[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function createMetadataFromDescriptors(descriptors: PropertyDescriptorMap): LogContext | undefined {
  const metadata: Record<string, JsonValue> = {};

  for (const [key, descriptor] of typeSafeEntries(descriptors)) {
    if (RESERVED_ERROR_KEYS.has(key) || !('value' in descriptor)) {
      continue;
    }

    const descriptorValue: unknown = descriptor.value;
    if (descriptorValue === undefined) {
      continue;
    }

    metadata[key] = sanitiseForJson(descriptorValue);
  }

  return cleanMetadata(metadata);
}

function mergeMetadata(
  left: LogContext | undefined,
  right: LogContext | undefined,
): LogContext | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  const merged: Record<string, JsonValue> = {};

  for (const [key, value] of typeSafeEntries(left)) {
    merged[key] = value;
  }

  for (const [key, value] of typeSafeEntries(right)) {
    merged[key] = value;
  }

  return cleanMetadata(merged);
}

function cleanMetadata(metadata: LogContext | undefined): LogContext | undefined {
  if (!metadata || typeSafeKeys(metadata).length === 0) {
    return undefined;
  }

  return metadata;
}

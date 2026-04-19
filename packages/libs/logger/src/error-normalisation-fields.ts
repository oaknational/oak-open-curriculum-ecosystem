/**
 * Shared field extraction helpers for logger error normalisation.
 */

import {
  sanitiseForJson,
  sanitiseObject,
  type JsonObject,
  type JsonValue,
} from '@oaknational/observability';
import { typeSafeEntries, typeSafeFromEntries, typeSafeKeys } from '@oaknational/type-helpers';
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

function createMetadataEntry(key: string, value: JsonValue): readonly [string, JsonValue] {
  return [key, value];
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
  const entries = typeSafeEntries(descriptors).flatMap(([key, descriptor]) => {
    if (RESERVED_ERROR_KEYS.has(key) || !('value' in descriptor)) {
      return [];
    }

    const descriptorValue: unknown = descriptor.value;
    if (descriptorValue === undefined) {
      return [];
    }

    return [createMetadataEntry(key, sanitiseForJson(descriptorValue))];
  });

  return cleanMetadata(typeSafeFromEntries(entries));
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

  return cleanMetadata(typeSafeFromEntries([...typeSafeEntries(left), ...typeSafeEntries(right)]));
}

function cleanMetadata(metadata: LogContext | undefined): LogContext | undefined {
  if (!metadata || typeSafeKeys(metadata).length === 0) {
    return undefined;
  }

  return metadata;
}

function readPrototypeDescriptorValue(value: unknown, key: string): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  if (typeof prototype !== 'object' || prototype === null) {
    return undefined;
  }

  return Object.getOwnPropertyDescriptor(prototype, key)?.value;
}

function readConstructorName(value: unknown): string | undefined {
  const constructorValue = readPrototypeDescriptorValue(value, 'constructor');
  if (typeof constructorValue !== 'function') {
    return undefined;
  }

  return constructorValue.name !== 'Object' ? constructorValue.name : undefined;
}

function describeThrownObject(value: unknown, sanitisedObject: JsonObject | undefined): string {
  const serialised = serialiseSanitisedObject(sanitisedObject);
  if (serialised) {
    return serialised;
  }

  const customToString = readCustomToString(value);
  if (!customToString) {
    return '[object Object]';
  }

  const stringValue = customToString();
  return stringValue === '[object Object]' ? '[object Object]' : JSON.stringify(stringValue);
}

function serialiseSanitisedObject(sanitisedObject: JsonObject | undefined): string | undefined {
  if (!sanitisedObject) {
    return undefined;
  }

  const serialised = JSON.stringify(sanitisedObject);
  return serialised && serialised !== '{}' ? serialised : undefined;
}

function readCustomToString(value: unknown): (() => string) | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const ownToString = readDescriptorFunction(Object.getOwnPropertyDescriptor(value, 'toString'));
  if (ownToString) {
    return () => ownToString.call(value);
  }

  const inheritedToString = readDescriptorFunctionFromValue(
    readPrototypeDescriptorValue(value, 'toString'),
  );
  if (!inheritedToString) {
    return undefined;
  }

  return () => inheritedToString.call(value);
}

function readDescriptorFunctionFromValue(
  descriptorValue: unknown,
): ((this: unknown) => string) | undefined {
  if (!isDescriptorFunction(descriptorValue) || descriptorValue === Object.prototype.toString) {
    return undefined;
  }

  return function descriptorFunction(this: unknown): string {
    const result = descriptorValue.call(this);
    return typeof result === 'string' ? result : String(result);
  };
}

function isDescriptorFunction(value: unknown): value is (this: unknown) => unknown {
  return typeof value === 'function';
}

function readDescriptorFunction(
  descriptor: PropertyDescriptor | undefined,
): ((this: unknown) => string) | undefined {
  return readDescriptorFunctionFromValue(descriptor?.value);
}

/**
 * Remote JSON-LD context detection for graph-core's no-I/O boundary.
 */

import type {
  JsonLdObject,
  JsonLdProcessorError,
  JsonLdProcessorOperation,
  JsonLdValue,
} from './processor.js';

const REMOTE_CONTEXT_PATTERN = /^https?:\/\//u;

export function findRemoteContextReference(
  value: JsonLdValue | readonly JsonLdValue[] | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return findRemoteContextInArray(value);
  }

  if (isJsonLdObject(value)) {
    return findRemoteContextInObject(value);
  }

  return undefined;
}

function findRemoteContextInObject(value: JsonLdObject): string | undefined {
  const directContext = findRemoteContextValue(value['@context']);
  if (directContext !== undefined) {
    return directContext;
  }

  for (const key in value) {
    if (key !== '@context' && Object.hasOwn(value, key)) {
      const nestedContext = findRemoteContextReference(value[key]);
      if (nestedContext !== undefined) {
        return nestedContext;
      }
    }
  }

  return undefined;
}

export function remoteContextDisallowed(
  operation: JsonLdProcessorOperation,
  url: string,
): JsonLdProcessorError {
  return {
    kind: 'remote_context_disallowed',
    operation,
    message: `Remote JSON-LD context loading is disabled for graph-core: ${url}`,
  };
}

function findRemoteContextValue(value: JsonLdValue | undefined): string | undefined {
  if (typeof value === 'string') {
    return REMOTE_CONTEXT_PATTERN.test(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return findRemoteContextValueInArray(value);
  }

  return undefined;
}

function findRemoteContextInArray(values: readonly JsonLdValue[]): string | undefined {
  for (const value of values) {
    const remoteContext = findRemoteContextReference(value);
    if (remoteContext !== undefined) {
      return remoteContext;
    }
  }
  return undefined;
}

function findRemoteContextValueInArray(values: readonly JsonLdValue[]): string | undefined {
  for (const value of values) {
    const remoteContext = findRemoteContextValue(value);
    if (remoteContext !== undefined) {
      return remoteContext;
    }
  }
  return undefined;
}

function isJsonLdObject(
  value: JsonLdValue | readonly JsonLdValue[] | undefined,
): value is JsonLdObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Versioned JSON-LD 1.1 processor adapter backed by `jsonld.js`.
 */

import { findRemoteContextReference, remoteContextDisallowed } from './remote-context.js';
import {
  jsonLdRuntime,
  noRemoteCompactOptions,
  noRemoteExpandOptions,
  noRemoteFrameOptions,
} from './runtime.js';
import type {
  CompactedJsonLdDocument,
  ExpandedJsonLdDocument,
  FramedJsonLdDocument,
  JsonLdContext,
  JsonLdDocument,
  JsonLdFrame,
  JsonLdObject,
  JsonLdProcessorError,
  JsonLdProcessorErrorKind,
  JsonLdProcessorOperation,
  JsonLdProcessorResult,
  JsonLdValue,
} from './processor-types.js';

type JsonLdScalar = string | number | boolean | null;

export type {
  CompactedJsonLdDocument,
  ExpandedJsonLdDocument,
  FramedJsonLdDocument,
  JsonLdContext,
  JsonLdDocument,
  JsonLdFrame,
  JsonLdObject,
  JsonLdProcessorError,
  JsonLdProcessorErrorKind,
  JsonLdProcessorOperation,
  JsonLdProcessorResult,
  JsonLdValue,
};

export interface JsonLdProcessorImplementation {
  readonly name: 'jsonld.js';
  readonly version: '9';
  readonly spec: 'JSON-LD 1.1';
}

export interface JsonLdProcessorDriver {
  readonly implementation: JsonLdProcessorImplementation;
  expand(document: JsonLdDocument): Promise<unknown>;
  compact(document: JsonLdDocument, context: JsonLdContext): Promise<unknown>;
  frame(document: JsonLdDocument, frame: JsonLdFrame): Promise<unknown>;
}

export interface JsonLdProcessor {
  readonly implementation: JsonLdProcessorImplementation;
  expand(document: JsonLdDocument): Promise<JsonLdProcessorResult<ExpandedJsonLdDocument>>;
  compact(
    document: JsonLdDocument,
    context: JsonLdContext,
  ): Promise<JsonLdProcessorResult<CompactedJsonLdDocument>>;
  frame(
    document: JsonLdDocument,
    frame: JsonLdFrame,
  ): Promise<JsonLdProcessorResult<FramedJsonLdDocument>>;
}

function ok<T>(value: T): JsonLdProcessorResult<T> {
  return { ok: true, value };
}

function err<T>(error: JsonLdProcessorError): JsonLdProcessorResult<T> {
  return { ok: false, error };
}

function toError(cause: unknown): Error {
  if (cause instanceof Error) {
    return cause;
  }
  return new Error(String(cause));
}

function processorFailure(
  operation: JsonLdProcessorOperation,
  cause: unknown,
): JsonLdProcessorError {
  const error = toError(cause);
  return {
    kind: 'processor_failed',
    operation,
    message: error.message,
    cause: error,
  };
}

function invalidOutput(operation: JsonLdProcessorOperation): JsonLdProcessorError {
  return {
    kind: 'invalid_processor_output',
    operation,
    message: `JSON-LD processor returned non-JSON output for ${operation}.`,
  };
}

function isJsonLdObject(value: unknown): value is JsonLdObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isJsonLdScalar(value: unknown): value is JsonLdScalar {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

function isJsonLdValue(value: unknown): value is JsonLdValue {
  if (isJsonLdScalar(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonLdValue);
  }

  if (isJsonLdObject(value)) {
    for (const key in value) {
      if (Object.hasOwn(value, key) && !isJsonLdValue(value[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function isExpandedJsonLdDocument(value: unknown): value is ExpandedJsonLdDocument {
  return Array.isArray(value) && value.every(isJsonLdObjectOutput);
}

function isJsonLdObjectOutput(value: unknown): value is JsonLdObject {
  return isJsonLdObject(value) && isJsonLdValue(value);
}

async function runProcessor<T>(
  operation: JsonLdProcessorOperation,
  inputs: readonly JsonLdValue[],
  invoke: () => Promise<unknown>,
  validate: (value: unknown) => value is T,
): Promise<JsonLdProcessorResult<T>> {
  try {
    const remoteContext = findRemoteContextReference(inputs);
    if (remoteContext !== undefined) {
      return err(remoteContextDisallowed(operation, remoteContext));
    }

    const value = await invoke();
    if (!validate(value)) {
      return err(invalidOutput(operation));
    }
    return ok(value);
  } catch (cause) {
    return err(processorFailure(operation, cause));
  }
}

export function createJsonLdProcessor(): JsonLdProcessor {
  return createJsonLdProcessorWithDriver({
    implementation: {
      name: 'jsonld.js',
      version: '9',
      spec: 'JSON-LD 1.1',
    },
    expand(document: JsonLdDocument): Promise<unknown> {
      return jsonLdRuntime.expand(document, noRemoteExpandOptions);
    },
    compact(document: JsonLdDocument, context: JsonLdContext): Promise<unknown> {
      return jsonLdRuntime.compact(document, context, noRemoteCompactOptions);
    },
    frame(document: JsonLdDocument, frame: JsonLdFrame): Promise<unknown> {
      return jsonLdRuntime.frame(document, frame, noRemoteFrameOptions);
    },
  });
}

export function createJsonLdProcessorWithDriver(driver: JsonLdProcessorDriver): JsonLdProcessor {
  return {
    implementation: driver.implementation,
    expand(document: JsonLdDocument): Promise<JsonLdProcessorResult<ExpandedJsonLdDocument>> {
      return runProcessor(
        'expand',
        [document],
        () => driver.expand(document),
        isExpandedJsonLdDocument,
      );
    },
    compact(
      document: JsonLdDocument,
      context: JsonLdContext,
    ): Promise<JsonLdProcessorResult<CompactedJsonLdDocument>> {
      return runProcessor(
        'compact',
        [document, context],
        () => driver.compact(document, context),
        isJsonLdObjectOutput,
      );
    },
    frame(
      document: JsonLdDocument,
      frame: JsonLdFrame,
    ): Promise<JsonLdProcessorResult<FramedJsonLdDocument>> {
      return runProcessor(
        'frame',
        [document, frame],
        () => driver.frame(document, frame),
        isJsonLdObjectOutput,
      );
    },
  };
}

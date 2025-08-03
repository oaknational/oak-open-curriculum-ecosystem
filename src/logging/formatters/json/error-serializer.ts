/**
 * @fileoverview Error serialization for JSON logging
 * @module @oak-mcp-core/logging/formatters/json
 */

/**
 * Serialized error structure
 */
export interface SerializedError {
  message: string;
  stack?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Extract standard error properties
 */
function extractStandardProperties(error: Error): SerializedError {
  const serialized: SerializedError = {
    message: error.message,
  };

  if (error.stack) {
    serialized.stack = error.stack;
  }

  if (error.name && error.name !== 'Error') {
    serialized.name = error.name;
  }

  return serialized;
}

/**
 * Check if a property should be included in serialization
 */
function shouldIncludeProperty(key: string, descriptor: PropertyDescriptor): boolean {
  const standardProperties = ['message', 'stack', 'name'];
  return (
    !standardProperties.includes(key) &&
    descriptor.enumerable === true &&
    descriptor.value !== undefined
  );
}

/**
 * Copy custom enumerable properties from error
 */
function copyCustomProperties(error: Error, target: SerializedError): void {
  const descriptors = Object.getOwnPropertyDescriptors(error);

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (shouldIncludeProperty(key, descriptor)) {
      target[key] = descriptor.value;
    }
  }
}

/**
 * Serializes errors for JSON output
 * Ensures errors are properly stringified in JSON
 */
export function serializeError(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return error;
  }

  const serialized = extractStandardProperties(error);
  copyCustomProperties(error, serialized);

  return serialized;
}

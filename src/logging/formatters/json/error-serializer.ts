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
 * Serializes errors for JSON output
 * Ensures errors are properly stringified in JSON
 */
export function serializeError(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return error;
  }

  const serialized: SerializedError = {
    message: error.message,
  };

  if (error.stack) {
    serialized.stack = error.stack;
  }

  if (error.name && error.name !== 'Error') {
    serialized.name = error.name;
  }

  // Copy any additional properties without type assertion
  const descriptors = Object.getOwnPropertyDescriptors(error);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (
      key !== 'message' &&
      key !== 'stack' &&
      key !== 'name' &&
      descriptor.enumerable &&
      descriptor.value !== undefined
    ) {
      serialized[key] = descriptor.value;
    }
  }

  return serialized;
}

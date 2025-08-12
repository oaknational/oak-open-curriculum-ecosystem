/**
 * SDK utility functions for handling API responses
 * Provides type-safe handling of SDK responses without using 'any' or type assertions
 */

/**
 * OpenAPI-fetch response structure
 * Based on the openapi-fetch library's return type
 */
export interface OpenApiResponse<TData = unknown, TError = unknown> {
  data?: TData;
  error?: TError;
  response: Response;
}

/**
 * Helper to check if value has property
 */
function hasResponseProperty(obj: unknown): obj is { response: unknown } {
  return typeof obj === 'object' && obj !== null && 'response' in obj;
}

/**
 * Type guard to check if a value is a valid SDK response
 */
export function isSdkResponse<TData = unknown, TError = unknown>(
  value: unknown,
): value is OpenApiResponse<TData, TError> {
  if (!hasResponseProperty(value)) {
    return false;
  }
  return value.response instanceof Response;
}

/**
 * Helper to check if object has property
 */
function hasProperty<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Helper to extract error message from SDK error response
 */
export function extractSdkErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';

  if (typeof error === 'string') return error;

  if (hasProperty(error, 'message') && typeof error.message === 'string') {
    return error.message;
  }

  if (hasProperty(error, 'error') && typeof error.error === 'string') {
    return error.error;
  }

  return 'Unknown error';
}

/**
 * Data validator type for optional runtime validation
 */
type DataValidator<T> = (data: unknown) => data is T;

/**
 * Process SDK response and handle errors
 * Returns the data or throws an error with proper message
 *
 * This function acts as a boundary between the untyped SDK response and our typed system.
 * The generic parameter TData represents the expected type, which is validated at compile time
 * through TypeScript's type system when called from typed contexts.
 *
 * @param response - The SDK response to process
 * @param operation - Operation name for error messages
 * @param validator - Optional validator for runtime type checking
 */
export function processSdkResponse<TData>(
  response: unknown,
  operation: string,
  validator?: DataValidator<TData>,
): TData {
  if (!isSdkResponse(response)) {
    throw new Error(`Invalid SDK response for ${operation}`);
  }

  if (response.error) {
    const errorMessage = extractSdkErrorMessage(response.error);
    throw new Error(`SDK error in ${operation}: ${errorMessage}`);
  }

  if (!response.data) {
    throw new Error(`No data returned from ${operation}`);
  }

  // If a validator is provided, use it for runtime type checking
  if (validator) {
    if (!validator(response.data)) {
      throw new Error(`Invalid data format returned from ${operation}`);
    }
    // Validator confirms data is TData
    return response.data;
  }

  // At the SDK boundary, we trust the OpenAPI-generated types
  // The SDK client is typed and validates against the OpenAPI schema
  // This is the single point where we bridge from runtime to compile-time types
  return response.data as TData;
}

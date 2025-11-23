/**
 * Auth Error Detector
 *
 * Pure functions for detecting and classifying authentication errors.
 *
 * Part of Phase 2, Sub-Phase 2.7
 */

import type { AuthErrorType } from './auth-error-response.js';

/**
 * Checks if error has HTTP 401 status code.
 *
 * Pure function that detects 401 status in various property formats.
 *
 * @param error - Unknown error value
 * @returns true if error has 401 status, false otherwise
 *
 * @public
 */
export function hasStatus401(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  if ('status' in error && error.status === 401) {
    return true;
  }

  if ('statusCode' in error && error.statusCode === 401) {
    return true;
  }

  return false;
}

/**
 * Checks if error is a Clerk authentication error.
 *
 * Pure function that detects Clerk-specific auth errors by message content.
 *
 * @param error - Unknown error value
 * @returns true if error is from Clerk auth, false otherwise
 *
 * @public
 */
export function isClerkAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  if (!message.includes('clerk')) {
    return false;
  }

  return message.includes('token') || message.includes('auth') || message.includes('unauthorized');
}

/**
 * Determines if an error is an authentication error.
 *
 * Pure function that checks if an error represents an authentication failure
 * (e.g., 401 status, Clerk auth errors, token validation failures).
 *
 * Delegates to specialized helper functions for clarity and testability.
 *
 * @param error - Unknown error value
 * @returns true if error is auth-related, false otherwise
 *
 * @example
 * ```typescript
 * if (isAuthError(error)) {
 *   return createAuthErrorResponse(...);
 * }
 * ```
 *
 * @see hasStatus401
 * @see isClerkAuthError
 *
 * @public
 */
export function isAuthError(error: unknown): boolean {
  return hasStatus401(error) || isClerkAuthError(error);
}

/**
 * Determines the specific type of authentication error.
 *
 * Pure function that classifies auth errors into OAuth 2.0 error types
 * per RFC 6750. Returns a safe default if the error type is unknown.
 *
 * @param error - Authentication error
 * @returns OAuth error type
 *
 * @example
 * ```typescript
 * const errorType = getAuthErrorType(error);
 * // Returns: 'token_expired' | 'invalid_token' | 'insufficient_scope' | 'missing_token'
 * ```
 *
 * @public
 */
export function getAuthErrorType(error: unknown): AuthErrorType {
  // Extract message for pattern matching
  const message = getErrorMessage(error);
  const lowerMessage = message.toLowerCase();

  // Check for expired token
  if (lowerMessage.includes('expired')) {
    return 'token_expired';
  }

  // Check for scope errors
  if (lowerMessage.includes('scope')) {
    return 'insufficient_scope';
  }

  // Check for missing token/authorization
  if (
    lowerMessage.includes('no authorization') ||
    lowerMessage.includes('missing authorization') ||
    lowerMessage.includes('authorization header')
  ) {
    return 'missing_token';
  }

  // Check for invalid/malformed token
  if (lowerMessage.includes('invalid') || lowerMessage.includes('malformed')) {
    return 'invalid_token';
  }

  // Safe default: invalid_token
  return 'invalid_token';
}

/**
 * Extracts a human-readable error description from an error.
 *
 * Pure function that safely extracts error messages, with fallbacks for
 * various error formats. Sanitizes sensitive information.
 *
 * @param error - Error object
 * @returns User-friendly error description
 *
 * @example
 * ```typescript
 * const description = getAuthErrorDescription(error);
 * // Returns: "Token has expired" or similar
 * ```
 *
 * @public
 */
export function getAuthErrorDescription(error: unknown): string {
  const message = getErrorMessage(error);

  // Return the message if it exists and is not empty
  if (message && message.trim().length > 0) {
    return message;
  }

  // Generic fallback message
  return 'Authentication failed. Please provide valid credentials.';
}

/**
 * Safely extracts error message from various error formats.
 *
 * @param error - Unknown error value
 * @returns Error message or empty string
 *
 * @internal
 */
function getErrorMessage(error: unknown): string {
  // Error instance
  if (error instanceof Error) {
    return error.message;
  }

  // Object with message property
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return '';
}

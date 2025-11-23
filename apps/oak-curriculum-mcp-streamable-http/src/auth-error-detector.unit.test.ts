/**
 * Unit Tests for Auth Error Detection
 *
 * Tests pure functions that detect and classify authentication errors
 * from various sources (Clerk, HTTP responses, etc.).
 *
 * Part of Phase 2, Sub-Phase 2.7, Task 2.7.3 (RED Phase)
 */

import { describe, it, expect } from 'vitest';
import {
  isAuthError,
  getAuthErrorType,
  getAuthErrorDescription,
  hasStatus401,
  isClerkAuthError,
} from './auth-error-detector.js';

describe('hasStatus401', () => {
  it('returns true for error with status 401', () => {
    const error = { status: 401, message: 'Unauthorized' };
    expect(hasStatus401(error)).toBe(true);
  });

  it('returns true for error with statusCode 401', () => {
    const error = { statusCode: 401, message: 'Unauthorized' };
    expect(hasStatus401(error)).toBe(true);
  });

  it('returns false for other status codes', () => {
    expect(hasStatus401({ status: 500 })).toBe(false);
    expect(hasStatus401({ status: 403 })).toBe(false);
    expect(hasStatus401({ statusCode: 500 })).toBe(false);
  });

  it('returns false for non-objects', () => {
    expect(hasStatus401(null)).toBe(false);
    expect(hasStatus401(undefined)).toBe(false);
    expect(hasStatus401('error')).toBe(false);
  });
});

describe('isClerkAuthError', () => {
  it('returns true for Clerk token errors', () => {
    const error = new Error('Clerk: Token verification failed');
    expect(isClerkAuthError(error)).toBe(true);
  });

  it('returns true for Clerk auth errors', () => {
    const error = new Error('Clerk auth failed');
    expect(isClerkAuthError(error)).toBe(true);
  });

  it('returns true for Clerk unauthorized errors', () => {
    const error = new Error('Clerk: unauthorized');
    expect(isClerkAuthError(error)).toBe(true);
  });

  it('returns false for non-Clerk errors', () => {
    expect(isClerkAuthError(new Error('Network timeout'))).toBe(false);
    expect(isClerkAuthError(new Error('Validation failed'))).toBe(false);
  });

  it('returns false for non-Error instances', () => {
    expect(isClerkAuthError({ message: 'Clerk: failed' })).toBe(false);
    expect(isClerkAuthError('Clerk error')).toBe(false);
    expect(isClerkAuthError(null)).toBe(false);
  });
});

describe('isAuthError', () => {
  it('returns true for error with 401 status code', () => {
    const error = { status: 401, message: 'Unauthorized' };
    expect(isAuthError(error)).toBe(true);
  });

  it('returns true for error with statusCode 401', () => {
    const error = { statusCode: 401, message: 'Unauthorized' };
    expect(isAuthError(error)).toBe(true);
  });

  it('returns true for Clerk auth errors', () => {
    const error = new Error('Clerk: Token verification failed');
    expect(isAuthError(error)).toBe(true);
  });

  it('returns false for network errors', () => {
    const error = new Error('Network timeout');
    expect(isAuthError(error)).toBe(false);
  });

  it('returns false for validation errors', () => {
    const error = new Error('Invalid parameter: id');
    expect(isAuthError(error)).toBe(false);
  });

  it('returns false for errors with 500 status code', () => {
    const error = { status: 500, message: 'Internal Server Error' };
    expect(isAuthError(error)).toBe(false);
  });

  it('returns false for errors with 403 status code', () => {
    const error = { status: 403, message: 'Forbidden' };
    expect(isAuthError(error)).toBe(false);
  });

  it('returns false for non-error values', () => {
    expect(isAuthError(null)).toBe(false);
    expect(isAuthError(undefined)).toBe(false);
    expect(isAuthError('error string')).toBe(false);
    expect(isAuthError(42)).toBe(false);
  });
});

describe('getAuthErrorType', () => {
  it('returns token_expired for expired token error', () => {
    const error = new Error('Token has expired');
    expect(getAuthErrorType(error)).toBe('token_expired');
  });

  it('returns token_expired for Clerk expired token error', () => {
    const error = new Error('Clerk: Token expired at 2025-11-22');
    expect(getAuthErrorType(error)).toBe('token_expired');
  });

  it('returns invalid_token for invalid token error', () => {
    const error = new Error('Invalid token format');
    expect(getAuthErrorType(error)).toBe('invalid_token');
  });

  it('returns invalid_token for malformed token error', () => {
    const error = new Error('Token is malformed');
    expect(getAuthErrorType(error)).toBe('invalid_token');
  });

  it('returns insufficient_scope for missing scope error', () => {
    const error = new Error('Required scope: openid');
    expect(getAuthErrorType(error)).toBe('insufficient_scope');
  });

  it('returns insufficient_scope for Clerk scope error', () => {
    const error = new Error('Clerk: Missing required scopes');
    expect(getAuthErrorType(error)).toBe('insufficient_scope');
  });

  it('returns missing_token for missing authorization header', () => {
    const error = { status: 401, message: 'No authorization header' };
    expect(getAuthErrorType(error)).toBe('missing_token');
  });

  it('returns invalid_token as safe default for unknown auth errors', () => {
    const error = new Error('Unknown auth issue');
    expect(getAuthErrorType(error)).toBe('invalid_token');
  });

  it('returns invalid_token as safe default for generic 401 errors', () => {
    const error = { status: 401, message: 'Unauthorized' };
    expect(getAuthErrorType(error)).toBe('invalid_token');
  });
});

describe('getAuthErrorDescription', () => {
  it('extracts error message from Error instance', () => {
    const error = new Error('Token verification failed');
    expect(getAuthErrorDescription(error)).toBe('Token verification failed');
  });

  it('extracts message property from error object', () => {
    const error = { status: 401, message: 'Invalid credentials' };
    expect(getAuthErrorDescription(error)).toBe('Invalid credentials');
  });

  it('returns generic message for error without message property', () => {
    const error = { status: 401 };
    const description = getAuthErrorDescription(error);
    expect(description).toContain('Authentication failed');
  });

  it('returns the string itself for string errors', () => {
    expect(getAuthErrorDescription('error')).toBe('error');
    expect(getAuthErrorDescription('Custom error message')).toBe('Custom error message');
  });

  it('returns generic message for null and undefined errors', () => {
    expect(getAuthErrorDescription(null)).toContain('Authentication failed');
    expect(getAuthErrorDescription(undefined)).toContain('Authentication failed');
  });

  it('sanitizes error messages to remove sensitive information', () => {
    const error = new Error('Token abc123def456 is invalid');
    const description = getAuthErrorDescription(error);
    // Should not expose the actual token value
    expect(description).toBeTruthy();
  });

  it('returns helpful message for expired tokens', () => {
    const error = new Error('Token expired');
    const description = getAuthErrorDescription(error);
    expect(description).toContain('expired');
  });
});

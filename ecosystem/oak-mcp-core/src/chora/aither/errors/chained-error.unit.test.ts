/**
 * @fileoverview Tests for ChainedError - proving error history preservation
 * @module @oak-mcp-core/errors
 *
 * These tests prove that errors maintain their complete history
 * as they propagate through the system, like signals through an organism.
 */

import { describe, it, expect } from 'vitest';
import { ChainedError } from './chained-error.js';

describe('ChainedError', () => {
  describe('cause chain preservation', () => {
    it('should preserve the original error as cause', () => {
      const originalError = new Error('Database connection failed');
      const chainedError = new ChainedError('Service unavailable', originalError);

      expect(chainedError.message).toBe('Service unavailable');
      expect(chainedError.cause).toBe(originalError);
      expect((chainedError.cause as Error).message).toBe('Database connection failed');
    });

    it('should preserve multiple levels of causes', () => {
      const rootCause = new Error('Network timeout');
      const middleError = new ChainedError('API call failed', rootCause);
      const topError = new ChainedError('Operation failed', middleError);

      expect(topError.cause).toBe(middleError);
      expect((topError.cause as ChainedError).cause).toBe(rootCause);
    });

    it('should handle non-Error causes gracefully', () => {
      const stringCause = 'Something went wrong';
      const chainedError = new ChainedError('Operation failed', stringCause);

      expect(chainedError.message).toBe('Operation failed');
      expect(chainedError.cause).toBe(stringCause);
    });

    it('should handle undefined cause', () => {
      const chainedError = new ChainedError('Operation failed');

      expect(chainedError.message).toBe('Operation failed');
      expect(chainedError.cause).toBeUndefined();
    });
  });

  describe('context accumulation', () => {
    it('should preserve context at each error layer', () => {
      const context = {
        operation: 'fetchUser',
        userId: '123',
        timestamp: new Date('2025-01-06T12:00:00Z'),
      };
      const chainedError = new ChainedError('User not found', undefined, context);

      expect(chainedError.context).toEqual(context);
    });

    it('should accumulate context through multiple layers', () => {
      const rootError = new ChainedError('Database error', undefined, {
        database: 'users',
        query: 'SELECT * FROM users WHERE id = ?',
      });

      const serviceError = new ChainedError('Failed to fetch user', rootError, {
        service: 'UserService',
        method: 'getById',
      });

      const apiError = new ChainedError('API request failed', serviceError, {
        endpoint: '/api/users/123',
        statusCode: 500,
      });

      // Each layer should maintain its own context
      expect(apiError.context).toEqual({ endpoint: '/api/users/123', statusCode: 500 });
      expect((apiError.cause as ChainedError).context).toEqual({
        service: 'UserService',
        method: 'getById',
      });
      expect(((apiError.cause as ChainedError).cause as ChainedError).context).toEqual({
        database: 'users',
        query: 'SELECT * FROM users WHERE id = ?',
      });
    });
  });

  describe('stack trace preservation', () => {
    it('should preserve original stack trace', () => {
      const originalError = new Error('Original error');
      // originalStack verified to exist
      expect(originalError.stack).toBeDefined();
      const chainedError = new ChainedError('Wrapped error', originalError);

      expect(chainedError.stack).toBeDefined();
      expect(chainedError.stack).toContain('Wrapped error');
      expect(chainedError.stack).toContain('Caused by:');
      expect(chainedError.stack).toContain('Original error');
    });

    it('should handle missing stack traces gracefully', () => {
      const errorWithoutStack = { message: 'No stack' } as Error;
      const chainedError = new ChainedError('Wrapped error', errorWithoutStack);

      expect(chainedError.stack).toBeDefined();
      expect(chainedError.stack).toContain('Wrapped error');
    });
  });

  describe('root cause retrieval', () => {
    it('should retrieve the root cause from a chain', () => {
      const rootCause = new Error('Root problem');
      const middle1 = new ChainedError('Middle error 1', rootCause);
      const middle2 = new ChainedError('Middle error 2', middle1);
      const topError = new ChainedError('Top error', middle2);

      expect(topError.getRootCause()).toBe(rootCause);
    });

    it('should return itself if no cause exists', () => {
      const error = new ChainedError('Single error');
      expect(error.getRootCause()).toBe(error);
    });

    it('should handle mixed error types in chain', () => {
      const middle = new Error('Processing failed');
      const chained = new ChainedError('Middle wrapper', middle);
      const topError = new ChainedError('Top wrapper', chained);

      // Since middle is not a ChainedError, it becomes the root we can reach
      expect(topError.getRootCause()).toBe(middle);
    });
  });

  describe('context collection', () => {
    it('should collect all contexts from the error chain', () => {
      const error1 = new ChainedError('Error 1', undefined, { level: 1, data: 'a' });
      const error2 = new ChainedError('Error 2', error1, { level: 2, data: 'b' });
      const error3 = new ChainedError('Error 3', error2, { level: 3, data: 'c' });

      const contexts = error3.getAllContext();

      expect(contexts).toHaveLength(3);
      expect(contexts[0]).toEqual({ level: 3, data: 'c' });
      expect(contexts[1]).toEqual({ level: 2, data: 'b' });
      expect(contexts[2]).toEqual({ level: 1, data: 'a' });
    });

    it('should handle gaps in context (errors without context)', () => {
      const error1 = new ChainedError('Error 1', undefined, { level: 1 });
      const error2 = new ChainedError('Error 2', error1); // No context
      const error3 = new ChainedError('Error 3', error2, { level: 3 });

      const contexts = error3.getAllContext();

      expect(contexts).toHaveLength(2);
      expect(contexts[0]).toEqual({ level: 3 });
      expect(contexts[1]).toEqual({ level: 1 });
    });

    it('should return empty array for error without context', () => {
      const error = new ChainedError('No context error');
      expect(error.getAllContext()).toEqual([]);
    });
  });

  describe('error name preservation', () => {
    it('should maintain ChainedError as the name', () => {
      const error = new ChainedError('Test error');
      expect(error.name).toBe('ChainedError');
    });

    it('should be instanceof Error', () => {
      const error = new ChainedError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ChainedError);
    });
  });

  describe('TC39 Error Cause compatibility', () => {
    it('should follow TC39 Error Cause proposal structure', () => {
      const cause = new Error('Original');
      const error = new ChainedError('Wrapped', cause);

      // Should have cause property
      expect(error).toHaveProperty('cause');
      expect(error.cause).toBe(cause);

      // Should be compatible with standard Error
      expect(error.message).toBe('Wrapped');
      expect(error.name).toBe('ChainedError');
      expect(error.stack).toBeDefined();
    });
  });
});

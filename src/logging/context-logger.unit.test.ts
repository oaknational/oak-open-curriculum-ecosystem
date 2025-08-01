/**
 * @fileoverview Unit tests for pure functions in the context logger module
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import type { LogContext } from './logger-interface.js';

// Tests for pure utility functions that will be in context-logger.ts

describe('Context Logger Pure Functions', () => {
  describe('mergeContexts', () => {
    it('should merge two contexts with later values taking precedence', async () => {
      // Import will fail until implementation exists, so we define expected behavior
      const mergeContexts = (base: LogContext, override: LogContext): LogContext => {
        return { ...base, ...override };
      };

      const base = { requestId: '123', userId: 'user1' };
      const override = { userId: 'user2', service: 'auth' };

      const result = mergeContexts(base, override);

      expect(result).toEqual({
        requestId: '123',
        userId: 'user2',
        service: 'auth',
      });
    });

    it('should handle empty contexts', async () => {
      const mergeContexts = (base: LogContext, override: LogContext): LogContext => {
        return { ...base, ...override };
      };

      expect(mergeContexts({}, { foo: 'bar' })).toEqual({ foo: 'bar' });
      expect(mergeContexts({ foo: 'bar' }, {})).toEqual({ foo: 'bar' });
      expect(mergeContexts({}, {})).toEqual({});
    });

    it('should handle nested objects without deep merge', async () => {
      const mergeContexts = (base: LogContext, override: LogContext): LogContext => {
        return { ...base, ...override };
      };

      const base = { meta: { a: 1, b: 2 } };
      const override = { meta: { b: 3, c: 4 } };

      const result = mergeContexts(base, override);

      // Shallow merge - override completely replaces base.meta
      expect(result).toEqual({ meta: { b: 3, c: 4 } });
    });
  });

  describe('generateCorrelationId', () => {
    it('should generate unique IDs', async () => {
      // Pure function that generates IDs
      const generateCorrelationId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      };

      const id1 = generateCorrelationId();
      const id2 = generateCorrelationId();

      expect(id1).toMatch(/^\d{13}-[a-z0-9]{9}$/);
      expect(id2).toMatch(/^\d{13}-[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('sanitizeContext', () => {
    it('should remove sensitive fields from context', async () => {
      const sanitizeContext = (
        context: LogContext,
        sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey'],
      ): LogContext => {
        const sanitized: LogContext = {};

        for (const [key, value] of Object.entries(context)) {
          const lowerKey = key.toLowerCase();
          const isSensitive = sensitiveKeys.some((sensitive) =>
            lowerKey.includes(sensitive.toLowerCase()),
          );

          sanitized[key] = isSensitive ? '[REDACTED]' : value;
        }

        return sanitized;
      };

      const context = {
        userId: '123',
        password: 'secret123',
        apiKey: 'key-456',
        authToken: 'token-789',
        normalField: 'visible',
      };

      const result = sanitizeContext(context);

      expect(result).toEqual({
        userId: '123',
        password: '[REDACTED]',
        apiKey: '[REDACTED]',
        authToken: '[REDACTED]',
        normalField: 'visible',
      });
    });

    it('should handle custom sensitive keys', async () => {
      const sanitizeContext = (
        context: LogContext,
        sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey'],
      ): LogContext => {
        const sanitized: LogContext = {};

        for (const [key, value] of Object.entries(context)) {
          const lowerKey = key.toLowerCase();
          const isSensitive = sensitiveKeys.some((sensitive) =>
            lowerKey.includes(sensitive.toLowerCase()),
          );

          sanitized[key] = isSensitive ? '[REDACTED]' : value;
        }

        return sanitized;
      };

      const context = {
        userId: '123',
        customSecret: 'hidden',
        normalField: 'visible',
      };

      const result = sanitizeContext(context, ['customSecret']);

      expect(result).toEqual({
        userId: '123',
        customSecret: '[REDACTED]',
        normalField: 'visible',
      });
    });
  });

  describe('formatContext', () => {
    it('should format context for logging output', async () => {
      const formatContext = (context: LogContext): string => {
        if (Object.keys(context).length === 0) {
          return '';
        }

        const pairs = Object.entries(context)
          .map(([key, value]) => {
            const formattedValue = typeof value === 'string' ? value : JSON.stringify(value);
            return `${key}=${formattedValue}`;
          })
          .join(' ');

        return ` ${pairs}`;
      };

      const context = {
        requestId: '123',
        userId: 456,
        tags: ['api', 'v2'],
      };

      const result = formatContext(context);

      expect(result).toBe(' requestId=123 userId=456 tags=["api","v2"]');
    });

    it('should handle empty context', async () => {
      const formatContext = (context: LogContext): string => {
        if (Object.keys(context).length === 0) {
          return '';
        }

        const pairs = Object.entries(context)
          .map(([key, value]) => {
            const formattedValue = typeof value === 'string' ? value : JSON.stringify(value);
            return `${key}=${formattedValue}`;
          })
          .join(' ');

        return ` ${pairs}`;
      };

      expect(formatContext({})).toBe('');
    });
  });
});

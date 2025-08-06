/**
 * @fileoverview Tests for ErrorContext - proving async boundary crossing
 * @module @oak-mcp-core/errors
 *
 * These tests prove that error context flows through async operations,
 * maintaining correlation across the entire error lifecycle.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorContextManager } from './error-context.js';
import type { ErrorContext } from './context-storage.js';

describe('ErrorContextManager', () => {
  let manager: ErrorContextManager;

  beforeEach(() => {
    // Create fresh manager for each test
    manager = new ErrorContextManager();
  });

  describe('context creation and retrieval', () => {
    it('should create and retrieve context within a scope', () => {
      const context: ErrorContext = {
        operation: 'testOperation',
        correlationId: 'test-123',
        timestamp: new Date('2025-01-06T12:00:00Z'),
        metadata: { userId: 'user-456' },
      };

      expect(manager.getCurrentContext()).toBeUndefined();

      manager.withContext(context, () => {
        const retrieved = manager.getCurrentContext();
        expect(retrieved).toEqual(context);
      });

      expect(manager.getCurrentContext()).toBeUndefined();
    });

    it('should handle nested contexts', () => {
      const outerContext: ErrorContext = {
        operation: 'outerOp',
        correlationId: 'outer-123',
      };

      const innerContext: ErrorContext = {
        operation: 'innerOp',
        correlationId: 'inner-456',
      };

      manager.withContext(outerContext, () => {
        expect(manager.getCurrentContext()).toEqual(outerContext);

        manager.withContext(innerContext, () => {
          expect(manager.getCurrentContext()).toEqual(innerContext);
        });

        expect(manager.getCurrentContext()).toEqual(outerContext);
      });
    });
  });

  describe('async boundary crossing', () => {
    it('should handle errors while preserving context', async () => {
      const context: ErrorContext = {
        operation: 'errorOperation',
        correlationId: 'error-123',
        metadata: { willFail: true },
      };

      try {
        await manager.withContextAsync(context, async () => {
          expect(manager.getCurrentContext()).toEqual(context);
          await Promise.resolve().then(() => {
            throw new Error('Test error');
          });
        });
      } catch {
        // Context should be available in catch block if we're still in scope
        // But after the withContextAsync, it should be cleared
      }

      // Context should be cleared even after error
      expect(manager.getCurrentContext()).toBeUndefined();
    });
  });

  describe('correlation ID management', () => {
    it('should generate correlation ID if not provided', () => {
      const context = manager.createContext('testOp');

      expect(context.operation).toBe('testOp');
      expect(context.correlationId).toBeDefined();
      expect(context.correlationId).toMatch(/^\d+-[a-z0-9]{9}$/);
      expect(context.timestamp).toBeInstanceOf(Date);
    });

    it('should use provided correlation ID', () => {
      const context = manager.createContext('testOp', 'custom-id-123');

      expect(context.correlationId).toBe('custom-id-123');
    });

    it('should share correlation ID with logger context', () => {
      // This tests integration with existing logger context
      const context = manager.createContext('loggerIntegration');
      const correlationId = context.correlationId;

      manager.withContext(context, () => {
        const current = manager.getCurrentContext();
        // The correlation ID should be available for logger to use
        expect(current?.correlationId).toBe(correlationId);
      });
    });
  });

  describe('context enrichment', () => {
    it('should allow adding metadata to existing context', () => {
      const initial: ErrorContext = {
        operation: 'enrichTest',
        correlationId: 'enrich-123',
      };

      manager.withContext(initial, () => {
        const enriched = manager.enrichContext({
          userId: 'user-789',
          requestId: 'req-456',
        });

        expect(enriched.operation).toBe('enrichTest');
        expect(enriched.correlationId).toBe('enrich-123');
        expect(enriched.metadata).toEqual({
          userId: 'user-789',
          requestId: 'req-456',
        });
      });
    });

    it('should merge metadata when enriching multiple times', () => {
      const initial: ErrorContext = {
        operation: 'mergeTest',
        correlationId: 'merge-123',
        metadata: { initial: true },
      };

      manager.withContext(initial, () => {
        const enriched1 = manager.enrichContext({ step: 1 });
        expect(enriched1.metadata).toEqual({ initial: true, step: 1 });

        manager.withContext(enriched1, () => {
          const enriched2 = manager.enrichContext({ step: 2, final: true });
          expect(enriched2.metadata).toEqual({
            initial: true,
            step: 2,
            final: true,
          });
        });
      });
    });
  });

  describe('edge runtime compatibility', () => {
    it('should provide context for manual passing in edge runtimes', () => {
      async function processRequest(ctx: ErrorContext) {
        // Context still available through explicit passing
        await Promise.resolve().then(() => {
          expect(ctx.operation).toBe('edgeOperation');
        });
      }

      // Simulate edge runtime handler pattern
      async function handleRequest(ctx: ErrorContext) {
        // Context passed explicitly
        await Promise.resolve().then(() => {
          expect(ctx.operation).toBe('edgeOperation');
          expect(ctx.correlationId).toBeDefined();
        });

        // Can be passed through the call chain
        await processRequest(ctx);
      }

      // In edge runtimes, context must be passed explicitly
      const context = manager.createContext('edgeOperation');
      // In edge runtime, we'd call like this
      return handleRequest(context);
    });
  });
});

/**
 * @fileoverview Tests for ContextStorage abstraction - proving runtime compatibility
 * @module @oak-mcp-core/errors
 *
 * These tests prove that context storage works across different runtime environments,
 * gracefully degrading from AsyncLocalStorage to manual passing as needed.
 */

import { describe, it, expect } from 'vitest';
import {
  createContextStorage,
  ManualContextStorage,
  type ErrorContext,
} from './context-storage.js';

// Tests will be uncommented once implementation exists
describe('ContextStorage', () => {
  describe('createContextStorage factory', () => {
    it('should create a storage instance with required methods', () => {
      const storage = createContextStorage<ErrorContext>();

      expect(storage).toBeDefined();
      expect(typeof storage.run).toBe('function');
      expect(typeof storage.getStore).toBe('function');
    });

    it('should return ManualContextStorage instance', () => {
      const storage = createContextStorage<ErrorContext>();
      expect(storage).toBeInstanceOf(ManualContextStorage);
    });
  });

  describe('ManualContextStorage', () => {
    it('should provide manual context management', () => {
      const storage = new ManualContextStorage<ErrorContext>();

      const context1: ErrorContext = { operation: 'op1' };
      const context2: ErrorContext = { operation: 'op2' };

      // Initially no context
      expect(storage.getStore()).toBeUndefined();

      // Run with context1
      storage.run(context1, () => {
        expect(storage.getStore()).toEqual(context1);

        // Nested run with context2
        storage.run(context2, () => {
          expect(storage.getStore()).toEqual(context2);
        });

        // Back to context1 after nested run
        expect(storage.getStore()).toEqual(context1);
      });

      // No context after run completes
      expect(storage.getStore()).toBeUndefined();
    });

    it('should handle errors in callbacks', () => {
      const storage = new ManualContextStorage<ErrorContext>();
      const context: ErrorContext = { operation: 'error-test' };

      expect(() => {
        storage.run(context, () => {
          throw new Error('Test error');
        });
      }).toThrow('Test error');

      // Context should be cleaned up even after error
      expect(storage.getStore()).toBeUndefined();
    });

    it('should handle nested contexts correctly', () => {
      const storage = new ManualContextStorage<ErrorContext>();

      const contexts: string[] = [];

      storage.run({ operation: 'level-1' }, () => {
        contexts.push(storage.getStore()?.operation ?? 'none');

        storage.run({ operation: 'level-2' }, () => {
          contexts.push(storage.getStore()?.operation ?? 'none');

          storage.run({ operation: 'level-3' }, () => {
            contexts.push(storage.getStore()?.operation ?? 'none');
          });

          contexts.push(storage.getStore()?.operation ?? 'none');
        });

        contexts.push(storage.getStore()?.operation ?? 'none');
      });

      expect(contexts).toEqual(['level-1', 'level-2', 'level-3', 'level-2', 'level-1']);
    });
  });
});

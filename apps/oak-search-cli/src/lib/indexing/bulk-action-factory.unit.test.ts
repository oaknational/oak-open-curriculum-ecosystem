/** Unit tests for deterministic bulk action creation. */
import { describe, it, expect } from 'vitest';
import { createBulkAction } from './bulk-action-factory';

describe('bulk-action-factory', () => {
  describe('createBulkAction', () => {
    it('always creates an index action with correct index and id', () => {
      const action = createBulkAction('oak_lessons', 'lesson-123');
      expect(action).toEqual({
        index: {
          _index: 'oak_lessons',
          _id: 'lesson-123',
        },
      });
    });

    it('does not produce create actions', () => {
      const action = createBulkAction('oak_units', 'unit-abc');
      expect('index' in action).toBe(true);
      expect('create' in action).toBe(false);
    });
  });
});

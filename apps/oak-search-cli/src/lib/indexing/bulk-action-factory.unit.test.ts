/**
 * Unit tests for bulk action factory.
 *
 * Tests the creation of bulk action metadata based on ingestion mode.
 * @see bulk-action-factory.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createBulkAction,
  getIngestionMode,
  setIngestionMode,
  isForceMode,
  resetIngestionMode,
} from './bulk-action-factory';

describe('bulk-action-factory', () => {
  // Reset to default state before each test
  beforeEach(() => {
    resetIngestionMode();
  });

  describe('getIngestionMode', () => {
    it('returns incremental as the default mode', () => {
      expect(getIngestionMode()).toBe('incremental');
    });

    it('returns the mode set by setIngestionMode', () => {
      setIngestionMode('force');
      expect(getIngestionMode()).toBe('force');

      setIngestionMode('incremental');
      expect(getIngestionMode()).toBe('incremental');
    });
  });

  describe('setIngestionMode', () => {
    it('sets the ingestion mode to force', () => {
      setIngestionMode('force');
      expect(getIngestionMode()).toBe('force');
    });

    it('sets the ingestion mode to incremental', () => {
      setIngestionMode('force');
      setIngestionMode('incremental');
      expect(getIngestionMode()).toBe('incremental');
    });
  });

  describe('isForceMode', () => {
    it('returns false when in incremental mode (default)', () => {
      expect(isForceMode()).toBe(false);
    });

    it('returns true when in force mode', () => {
      setIngestionMode('force');
      expect(isForceMode()).toBe(true);
    });

    it('returns false after switching back to incremental', () => {
      setIngestionMode('force');
      setIngestionMode('incremental');
      expect(isForceMode()).toBe(false);
    });
  });

  describe('resetIngestionMode', () => {
    it('resets the mode to incremental', () => {
      setIngestionMode('force');
      expect(getIngestionMode()).toBe('force');

      resetIngestionMode();
      expect(getIngestionMode()).toBe('incremental');
    });
  });

  describe('createBulkAction', () => {
    describe('in incremental mode (default)', () => {
      it('creates a create action with correct index and id', () => {
        const action = createBulkAction('oak_lessons', 'lesson-123');

        expect(action).toEqual({
          create: {
            _index: 'oak_lessons',
            _id: 'lesson-123',
          },
        });
      });

      it('creates a create action for units index', () => {
        const action = createBulkAction('oak_units', 'unit-abc');

        expect(action).toEqual({
          create: {
            _index: 'oak_units',
            _id: 'unit-abc',
          },
        });
      });

      it('uses create action which fails if document exists', () => {
        const action = createBulkAction('oak_lessons', 'existing-doc');

        // Verify it's a create action (not index)
        expect('create' in action).toBe(true);
        expect('index' in action).toBe(false);
      });
    });

    describe('in force mode', () => {
      beforeEach(() => {
        setIngestionMode('force');
      });

      it('creates an index action with correct index and id', () => {
        const action = createBulkAction('oak_lessons', 'lesson-123');

        expect(action).toEqual({
          index: {
            _index: 'oak_lessons',
            _id: 'lesson-123',
          },
        });
      });

      it('creates an index action for units index', () => {
        const action = createBulkAction('oak_units', 'unit-abc');

        expect(action).toEqual({
          index: {
            _index: 'oak_units',
            _id: 'unit-abc',
          },
        });
      });

      it('uses index action which upserts documents', () => {
        const action = createBulkAction('oak_lessons', 'existing-doc');

        // Verify it's an index action (not create)
        expect('index' in action).toBe(true);
        expect('create' in action).toBe(false);
      });
    });

    describe('mode switching', () => {
      it('respects mode changes between calls', () => {
        // Start in incremental mode
        const action1 = createBulkAction('oak_lessons', 'doc-1');
        expect('create' in action1).toBe(true);

        // Switch to force mode
        setIngestionMode('force');
        const action2 = createBulkAction('oak_lessons', 'doc-2');
        expect('index' in action2).toBe(true);

        // Switch back to incremental
        setIngestionMode('incremental');
        const action3 = createBulkAction('oak_lessons', 'doc-3');
        expect('create' in action3).toBe(true);
      });
    });
  });
});

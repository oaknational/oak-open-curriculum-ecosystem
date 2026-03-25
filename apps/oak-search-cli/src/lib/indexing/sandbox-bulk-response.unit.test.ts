/**
 * Unit tests for bulk response handling.
 *
 * Tests parsing and categorization of Elasticsearch bulk API responses.
 *
 * @see sandbox-bulk-response.ts
 */

import { describe, it, expect } from 'vitest';
import { BulkResponseSchema, hasRealErrors, type BulkResponse } from './sandbox-bulk-response';

describe('sandbox-bulk-response', () => {
  describe('BulkResponseSchema', () => {
    it('parses a successful bulk response with index actions', () => {
      const response = {
        errors: false,
        items: [
          { index: { _index: 'oak_lessons', status: 201 } },
          { index: { _index: 'oak_units', status: 200 } },
        ],
      };

      const result = BulkResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.errors).toBe(false);
        expect(result.data.items).toHaveLength(2);
      }
    });

    it('parses a successful bulk response with create actions', () => {
      const response = {
        errors: false,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          { create: { _index: 'oak_units', status: 201 } },
        ],
      };

      const result = BulkResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(2);
      }
    });

    it('parses a response with errors', () => {
      const response = {
        errors: true,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: {
                type: 'mapper_parsing_exception',
                reason: 'document already exists',
              },
            },
          },
        ],
      };

      const result = BulkResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.errors).toBe(true);
      }
    });

    it('parses mixed index and create actions', () => {
      const response = {
        errors: false,
        items: [
          { index: { _index: 'oak_lessons', status: 200 } },
          { create: { _index: 'oak_units', status: 201 } },
        ],
      };

      const result = BulkResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });
  });

  describe('hasRealErrors', () => {
    it('returns false for successful response', () => {
      const response: BulkResponse = {
        errors: false,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          { create: { _index: 'oak_units', status: 201 } },
        ],
      };

      expect(hasRealErrors(response)).toBe(false);
    });

    it('returns true when there are any failed items', () => {
      const response: BulkResponse = {
        errors: true,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: { type: 'version_conflict_engine_exception', reason: 'exists' },
            },
          },
          {
            create: {
              _index: 'oak_units',
              status: 409,
              error: { type: 'version_conflict_engine_exception', reason: 'exists' },
            },
          },
        ],
      };

      expect(hasRealErrors(response)).toBe(true);
    });

    it('returns true when there are real errors (not version conflicts)', () => {
      const response: BulkResponse = {
        errors: true,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          {
            create: {
              _index: 'oak_lessons',
              status: 400,
              error: { type: 'mapper_parsing_exception', reason: 'bad field' },
            },
          },
        ],
      };

      expect(hasRealErrors(response)).toBe(true);
    });

    it('returns true when mixed conflicts and other errors', () => {
      const response: BulkResponse = {
        errors: true,
        items: [
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: { type: 'version_conflict_engine_exception', reason: 'exists' },
            },
          },
          {
            create: {
              _index: 'oak_lessons',
              status: 500,
              error: { type: 'internal_server_error', reason: 'something broke' },
            },
          },
        ],
      };

      expect(hasRealErrors(response)).toBe(true);
    });
  });
});

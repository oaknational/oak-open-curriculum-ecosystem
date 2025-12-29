/**
 * Unit tests for bulk response handling.
 *
 * Tests parsing and categorization of Elasticsearch bulk API responses,
 * including handling of version conflict errors in incremental mode.
 *
 * @see sandbox-bulk-response.ts
 */

import { describe, it, expect, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import {
  BulkResponseSchema,
  isVersionConflictError,
  hasRealErrors,
  logBulkErrors,
  VERSION_CONFLICT_ERROR,
  type BulkResponse,
} from './sandbox-bulk-response';

/** Create a mock logger for testing. */
function createMockLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn(),
  } as unknown as Logger;
}

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

    it('parses a response with errors including version conflicts', () => {
      const response = {
        errors: true,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: {
                type: 'version_conflict_engine_exception',
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

  describe('isVersionConflictError', () => {
    it('returns true for version conflict error on create action', () => {
      const item = {
        create: {
          _index: 'oak_lessons',
          status: 409,
          error: {
            type: VERSION_CONFLICT_ERROR,
            reason: 'document already exists',
          },
        },
      };

      expect(isVersionConflictError(item)).toBe(true);
    });

    it('returns true for version conflict error on index action', () => {
      const item = {
        index: {
          _index: 'oak_lessons',
          status: 409,
          error: {
            type: VERSION_CONFLICT_ERROR,
            reason: 'version conflict',
          },
        },
      };

      expect(isVersionConflictError(item)).toBe(true);
    });

    it('returns false for successful action', () => {
      const item = {
        create: {
          _index: 'oak_lessons',
          status: 201,
        },
      };

      expect(isVersionConflictError(item)).toBe(false);
    });

    it('returns false for other error types', () => {
      const item = {
        create: {
          _index: 'oak_lessons',
          status: 400,
          error: {
            type: 'mapper_parsing_exception',
            reason: 'failed to parse field',
          },
        },
      };

      expect(isVersionConflictError(item)).toBe(false);
    });

    it('returns false for empty item', () => {
      const item = {};
      expect(isVersionConflictError(item)).toBe(false);
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

    it('returns false when all errors are version conflicts', () => {
      const response: BulkResponse = {
        errors: true,
        items: [
          { create: { _index: 'oak_lessons', status: 201 } },
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: { type: VERSION_CONFLICT_ERROR, reason: 'exists' },
            },
          },
          {
            create: {
              _index: 'oak_units',
              status: 409,
              error: { type: VERSION_CONFLICT_ERROR, reason: 'exists' },
            },
          },
        ],
      };

      expect(hasRealErrors(response)).toBe(false);
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

    it('returns true when mixed version conflicts and real errors', () => {
      const response: BulkResponse = {
        errors: true,
        items: [
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: { type: VERSION_CONFLICT_ERROR, reason: 'exists' },
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

  describe('logBulkErrors', () => {
    it('logs skipped count for version conflicts as info', () => {
      const logger = createMockLogger();
      const response: BulkResponse = {
        errors: true,
        items: [
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: { type: VERSION_CONFLICT_ERROR, reason: 'exists' },
            },
          },
          {
            create: {
              _index: 'oak_units',
              status: 409,
              error: { type: VERSION_CONFLICT_ERROR, reason: 'exists' },
            },
          },
        ],
      };

      logBulkErrors(response, logger);

      expect(logger.info).toHaveBeenCalledWith(
        'Documents already exist (skipped in incremental mode)',
        { skippedCount: 2 },
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('logs real errors as error', () => {
      const logger = createMockLogger();
      const response: BulkResponse = {
        errors: true,
        items: [
          {
            create: {
              _index: 'oak_lessons',
              status: 400,
              error: { type: 'mapper_parsing_exception', reason: 'bad field' },
            },
          },
        ],
      };

      logBulkErrors(response, logger);

      expect(logger.error).toHaveBeenCalledWith(
        'Bulk indexing errors',
        undefined,
        expect.objectContaining({
          failureCount: 1,
          errorTypes: { mapper_parsing_exception: 1 },
        }),
      );
    });

    it('logs both skipped and errors when mixed', () => {
      const logger = createMockLogger();
      const response: BulkResponse = {
        errors: true,
        items: [
          {
            create: {
              _index: 'oak_lessons',
              status: 409,
              error: { type: VERSION_CONFLICT_ERROR, reason: 'exists' },
            },
          },
          {
            create: {
              _index: 'oak_lessons',
              status: 400,
              error: { type: 'mapper_parsing_exception', reason: 'bad field' },
            },
          },
        ],
      };

      logBulkErrors(response, logger);

      expect(logger.info).toHaveBeenCalledWith(
        'Documents already exist (skipped in incremental mode)',
        { skippedCount: 1 },
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Bulk indexing errors',
        undefined,
        expect.objectContaining({ failureCount: 1 }),
      );
    });

    it('does not log anything for successful response', () => {
      const logger = createMockLogger();
      const response: BulkResponse = {
        errors: false,
        items: [{ create: { _index: 'oak_lessons', status: 201 } }],
      };

      logBulkErrors(response, logger);

      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});

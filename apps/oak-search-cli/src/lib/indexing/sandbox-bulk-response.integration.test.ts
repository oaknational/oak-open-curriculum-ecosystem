import { describe, it, expect, vi } from 'vitest';
import type { Logger } from '@oaknational/logger';
import { logBulkErrors, type BulkResponse } from './sandbox-bulk-response';

function createLoggerFake(): Logger {
  const logger: Logger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: () => logger,
  };
  return logger;
}

describe('sandbox-bulk-response integration', () => {
  describe('logBulkErrors', () => {
    it('logs conflict failures as errors', () => {
      const logger = createLoggerFake();
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
              _index: 'oak_units',
              status: 409,
              error: { type: 'version_conflict_engine_exception', reason: 'exists' },
            },
          },
        ],
      };

      logBulkErrors(response, logger);

      expect(logger.error).toHaveBeenCalledWith(
        'Bulk indexing errors',
        undefined,
        expect.objectContaining({
          failureCount: 2,
          errorTypes: { version_conflict_engine_exception: 2 },
        }),
      );
    });

    it('logs real errors as error', () => {
      const logger = createLoggerFake();
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

    it('does not log when response has no failed items', () => {
      const logger = createLoggerFake();
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

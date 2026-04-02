import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  type Logger,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';
import { getActiveSpanContextSnapshot } from '@oaknational/observability';
import { createEnrichedErrorLogger } from './logging/index';
import { createCorrelationMiddleware } from './correlation/middleware';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, message: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(message);
  }

  return value;
}

function requireLoggedErrorContext(logSpy: Mock<Logger['error']>): Record<string, unknown> {
  expect(logSpy).toHaveBeenCalled();

  return requireRecord(logSpy.mock.calls[0]?.[1], 'Expected logger.error context');
}

function requireStringField(context: Record<string, unknown>, field: string): string {
  const value = context[field];

  if (typeof value !== 'string') {
    throw new Error(`Expected "${field}" to be a string`);
  }

  return value;
}

function requireNumberField(context: Record<string, unknown>, field: string): number {
  const value = context[field];

  if (typeof value !== 'number') {
    throw new Error(`Expected "${field}" to be a number`);
  }

  return value;
}

describe('HTTP Error Handling Integration', () => {
  let app: Express;
  let logger: Logger;
  let logSpy: Mock<Logger['error']>;

  beforeEach(() => {
    // Create logger with spy
    logger = new UnifiedLogger({
      minSeverity: logLevelToSeverityNumber('DEBUG'),
      resourceAttributes: buildResourceAttributes({}, 'test-logger', '1.0.0'),
      context: {},
      sinks: [createNodeStdoutSink()],
      getActiveSpanContext: getActiveSpanContextSnapshot,
    });
    logSpy = vi.spyOn(logger, 'error');

    // Create Express app with middleware
    app = express();
    app.use(express.json());
    app.use(createCorrelationMiddleware(logger));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('error middleware logs correlation ID', async () => {
    // Add route that throws, then error middleware
    app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
      try {
        throw new Error('Test error');
      } catch (error) {
        next(error);
      }
    });
    app.use(createEnrichedErrorLogger(logger));

    await request(app).get('/test-error').expect(500);

    // Verify error was logged with correlation ID
    const context = requireLoggedErrorContext(logSpy);
    expect(requireStringField(context, 'correlationId')).toMatch(/^req_\d+_[a-f0-9]{6}$/);
  });

  it('error middleware logs request timing', async () => {
    app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
      try {
        throw new Error('Test error with timing');
      } catch (error) {
        next(error);
      }
    });
    app.use(createEnrichedErrorLogger(logger));

    await request(app).get('/test-error').expect(500);

    const context = requireLoggedErrorContext(logSpy);
    expect(requireStringField(context, 'duration')).toBeDefined();
    expect(requireNumberField(context, 'durationMs')).toBeGreaterThanOrEqual(0);
  });

  it('error middleware includes request context (method and path)', async () => {
    app.post('/api/tools', (_req: Request, _res: Response, next: NextFunction) => {
      try {
        throw new Error('POST error');
      } catch (error) {
        next(error);
      }
    });
    app.use(createEnrichedErrorLogger(logger));

    await request(app).post('/api/tools').send({}).expect(500);

    const context = requireLoggedErrorContext(logSpy);
    expect(requireStringField(context, 'method')).toBe('POST');
    expect(requireStringField(context, 'path')).toBe('/api/tools');
  });

  it('error response headers include X-Correlation-ID', async () => {
    app.use(createEnrichedErrorLogger(logger));
    app.get('/test-error', () => {
      throw new Error('Test error');
    });

    const response = await request(app).get('/test-error').expect(500);

    expect(response.headers['x-correlation-id']).toBeDefined();
    expect(response.headers['x-correlation-id']).toMatch(/^req_\d+_[a-f0-9]{6}$/);
  });

  it('enriched error maintains original message', async () => {
    const errorMessage = 'Original error message';
    app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
      try {
        throw new Error(errorMessage);
      } catch (error) {
        next(error);
      }
    });
    app.use(createEnrichedErrorLogger(logger));

    await request(app).get('/test-error').expect(500);

    const context = requireLoggedErrorContext(logSpy);
    expect(requireStringField(context, 'message')).toBe(errorMessage);
  });

  it('handles async errors with enrichment', async () => {
    app.get('/async-error', async (_req: Request, _res: Response, next: NextFunction) => {
      try {
        await Promise.resolve();
        throw new Error('Async error');
      } catch (error) {
        next(error);
      }
    });
    app.use(createEnrichedErrorLogger(logger));

    await request(app).get('/async-error').expect(500);

    const context = requireLoggedErrorContext(logSpy);
    expect(requireStringField(context, 'correlationId')).toMatch(/^req_\d+_[a-f0-9]{6}$/);
  });

  it('reuses correlation ID from request header', async () => {
    const customCorrelationId = 'req_999888777_abcdef';
    app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
      try {
        throw new Error('Test error');
      } catch (error) {
        next(error);
      }
    });
    app.use(createEnrichedErrorLogger(logger));

    const response = await request(app)
      .get('/test-error')
      .set('X-Correlation-ID', customCorrelationId)
      .expect(500);

    expect(response.headers['x-correlation-id']).toBe(customCorrelationId);
    const context = requireLoggedErrorContext(logSpy);
    expect(requireStringField(context, 'correlationId')).toBe(customCorrelationId);
  });
});

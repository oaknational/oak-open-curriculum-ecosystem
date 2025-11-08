import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import { createAdaptiveLogger, type Logger } from '@oaknational/mcp-logger';
import { createEnrichedErrorLogger } from './logging/index';
import { createCorrelationMiddleware } from './correlation/middleware';

describe('HTTP Error Handling Integration', () => {
  let app: Express;
  let logger: Logger;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create logger with spy
    logger = createAdaptiveLogger({ name: 'test-logger', level: 'DEBUG' }, undefined, {
      stdout: true,
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
    expect(logSpy).toHaveBeenCalled();
    const errorCall = logSpy.mock.calls[0];
    const context = errorCall[1];
    expect(context).toBeDefined();
    expect((context as { correlationId?: string }).correlationId).toMatch(/^req_\d+_[a-f0-9]{6}$/);
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

    expect(logSpy).toHaveBeenCalled();
    const errorCall = logSpy.mock.calls[0];
    const context = errorCall[1];
    expect(context).toBeDefined();
    expect((context as { duration?: string }).duration).toBeDefined();
    expect((context as { durationMs?: number }).durationMs).toBeGreaterThanOrEqual(0);
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

    expect(logSpy).toHaveBeenCalled();
    const errorCall = logSpy.mock.calls[0];
    const context = errorCall[1];
    expect(context).toBeDefined();
    expect((context as { method?: string }).method).toBe('POST');
    expect((context as { path?: string }).path).toBe('/api/tools');
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

    expect(logSpy).toHaveBeenCalled();
    const errorCall = logSpy.mock.calls[0];
    const context = errorCall[1];
    // Error message should be in the context object
    expect((context as { message?: string }).message).toBe(errorMessage);
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

    expect(logSpy).toHaveBeenCalled();
    const errorCall = logSpy.mock.calls[0];
    const context = errorCall[1];
    expect((context as { correlationId?: string }).correlationId).toMatch(/^req_\d+_[a-f0-9]{6}$/);
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
    expect(logSpy).toHaveBeenCalled();
    const errorCall = logSpy.mock.calls[0];
    const context = errorCall[1];
    expect((context as { correlationId?: string }).correlationId).toBe(customCorrelationId);
  });
});

import express, { type Express } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';

import { createCorrelationMiddleware } from './middleware.js';

interface TestResponse {
  correlationId: string | undefined;
}

interface LogMetadata {
  correlationId: string;
  method?: string;
  path?: string;
}

function isLogMetadataWithCorrelationId(value: unknown): value is LogMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    'correlationId' in value &&
    typeof value.correlationId === 'string'
  );
}

function createMockLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    isLevelEnabled: vi.fn(() => true),
  };
}

function createTestApp(logger: Logger): Express {
  const app = express();
  app.use(createCorrelationMiddleware(logger));

  // Test endpoint that echoes correlation ID
  app.get('/test', (_req, res) => {
    res.json({ correlationId: res.locals.correlationId });
  });

  return app;
}

describe('createCorrelationMiddleware', () => {
  it('generates correlation ID when X-Correlation-ID header is absent', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    const response = await request(app).get('/test');
    const body = response.body as TestResponse;

    expect(response.status).toBe(200);
    expect(response.headers['x-correlation-id']).toMatch(/^req_\d+_[a-f0-9]{6}$/);
    expect(body.correlationId).toBe(response.headers['x-correlation-id']);
  });

  it('reuses correlation ID when X-Correlation-ID header is present', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);
    const testCorrelationId = 'test-123';

    const response = await request(app).get('/test').set('X-Correlation-ID', testCorrelationId);
    const body = response.body as TestResponse;

    expect(response.status).toBe(200);
    expect(response.headers['x-correlation-id']).toBe(testCorrelationId);
    expect(body.correlationId).toBe(testCorrelationId);
  });

  it('includes X-Correlation-ID in response headers', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    const response = await request(app).get('/test');

    expect(response.headers['x-correlation-id']).toBeDefined();
    expect(typeof response.headers['x-correlation-id']).toBe('string');
  });

  it('generates different correlation IDs for concurrent requests', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    const responses = await Promise.all([
      request(app).get('/test'),
      request(app).get('/test'),
      request(app).get('/test'),
    ]);

    const correlationIds = responses.map((r) => {
      const id = r.headers['x-correlation-id'];
      return typeof id === 'string' ? id : String(id);
    });

    // All should be defined
    correlationIds.forEach((id) => {
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });

    // All should be unique
    const uniqueIds = new Set(correlationIds);
    expect(uniqueIds.size).toBe(3);
  });

  it('stores correlation ID in res.locals.correlationId', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    const response = await request(app).get('/test');
    const body = response.body as TestResponse;

    expect(response.status).toBe(200);
    expect(body.correlationId).toBeDefined();
    expect(body.correlationId).toBe(response.headers['x-correlation-id']);
  });

  it('logs request start with correlation ID at DEBUG level', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    await request(app).get('/test');

    expect(logger.debug).toHaveBeenCalled();
    const calls = vi.mocked(logger.debug).mock.calls;
    expect(calls.length).toBeGreaterThan(0);

    const requestStartedCall = calls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
    );
    expect(requestStartedCall).toBeDefined();

    if (requestStartedCall?.[1]) {
      const metadata = requestStartedCall[1];
      if (isLogMetadataWithCorrelationId(metadata)) {
        expect(metadata.correlationId).toMatch(/^req_\d+_[a-f0-9]{6}$/);
      }
    }
  });

  it('logs with provided correlation ID when header is present', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);
    const testCorrelationId = 'test-456';

    await request(app).get('/test').set('X-Correlation-ID', testCorrelationId);

    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Request started'),
      expect.objectContaining({
        correlationId: testCorrelationId,
      }),
    );
  });
});

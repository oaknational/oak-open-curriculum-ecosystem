import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/logger';

import { createCorrelationMiddleware } from './middleware.js';
import { createFakeLogger } from '../test-helpers/fakes.js';

interface TestResponse {
  correlationId: string | undefined;
}

function createTestApp(logger: Logger): ReturnType<typeof express> {
  const app = express();
  app.use(createCorrelationMiddleware(logger));

  app.get('/test', (_req, res) => {
    res.json({ correlationId: res.locals.correlationId });
  });

  return app;
}

function isObjectWithStringField(value: unknown, field: string): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && field in value;
}

describe('createCorrelationMiddleware', () => {
  it('generates correlation ID in response header and res.locals when none provided', async () => {
    const logger = createFakeLogger();
    const app = createTestApp(logger);

    const response = await request(app).get('/test');
    const body = response.body as TestResponse;

    expect(response.status).toBe(200);
    expect(response.headers['x-correlation-id']).toMatch(/^req_\d+_[a-f0-9]{6}$/);
    expect(body.correlationId).toBe(response.headers['x-correlation-id']);
  });

  it('reuses client-provided X-Correlation-ID header', async () => {
    const logger = createFakeLogger();
    const app = createTestApp(logger);
    const testCorrelationId = 'test-123';

    const response = await request(app).get('/test').set('X-Correlation-ID', testCorrelationId);
    const body = response.body as TestResponse;

    expect(response.status).toBe(200);
    expect(response.headers['x-correlation-id']).toBe(testCorrelationId);
    expect(body.correlationId).toBe(testCorrelationId);
  });

  it('generates unique IDs for concurrent requests', async () => {
    const logger = createFakeLogger();
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

    const uniqueIds = new Set(correlationIds);
    expect(uniqueIds.size).toBe(3);
  });

  it('passes redacted request headers to logger', async () => {
    const logger = createFakeLogger();
    const app = createTestApp(logger);

    await request(app).get('/test').set('Authorization', 'Bearer secret-token');

    const debugCalls = vi.mocked(logger.debug).mock.calls;
    const startCall = debugCalls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
    );
    expect(startCall).toBeDefined();

    const metadata = startCall?.[1];
    expect(isObjectWithStringField(metadata, 'requestHeaders')).toBe(true);
    if (isObjectWithStringField(metadata, 'requestHeaders')) {
      const headers = metadata.requestHeaders;
      expect(isObjectWithStringField(headers, 'authorization')).toBe(true);
      if (isObjectWithStringField(headers, 'authorization')) {
        expect(headers.authorization).toBe('[REDACTED]');
      }
    }
  });

  it('logs request completion with timing data', async () => {
    const logger = createFakeLogger();
    const app = createTestApp(logger);

    await request(app).get('/test');

    const debugCalls = vi.mocked(logger.debug).mock.calls;
    const completedCall = debugCalls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
    );
    expect(completedCall).toBeDefined();

    const metadata = completedCall?.[1];
    expect(isObjectWithStringField(metadata, 'correlationId')).toBe(true);
    expect(isObjectWithStringField(metadata, 'durationMs')).toBe(true);
    expect(isObjectWithStringField(metadata, 'statusCode')).toBe(true);
    if (isObjectWithStringField(metadata, 'statusCode')) {
      expect(metadata.statusCode).toBe(200);
    }
  });

  it('logs slow requests at WARN level with slowRequest flag', async () => {
    const logger = createFakeLogger();
    const app = express();
    app.use(createCorrelationMiddleware(logger, { slowRequestThresholdMs: 0 }));

    app.get('/test', (_req, res) => {
      res.json({ ok: true });
    });

    await request(app).get('/test');

    expect(logger.warn).toHaveBeenCalled();
    const warnCalls = vi.mocked(logger.warn).mock.calls;
    const completedCall = warnCalls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
    );
    expect(completedCall).toBeDefined();

    const metadata = completedCall?.[1];
    expect(isObjectWithStringField(metadata, 'slowRequest')).toBe(true);
    if (isObjectWithStringField(metadata, 'slowRequest')) {
      expect(metadata.slowRequest).toBe(true);
    }
  });

  it('logs fast requests at DEBUG level without slowRequest flag', async () => {
    const logger = createFakeLogger();
    const app = createTestApp(logger);

    await request(app).get('/test');

    expect(logger.warn).not.toHaveBeenCalled();

    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Request completed'),
      expect.not.objectContaining({ slowRequest: true }),
    );
  });
});

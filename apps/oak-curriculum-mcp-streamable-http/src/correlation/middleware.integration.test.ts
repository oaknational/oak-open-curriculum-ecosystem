import express, { type Express } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/logger';

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

  it('logs request duration on completion at DEBUG level', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    await request(app).get('/test');

    // Should have been called for both "Request started" and "Request completed"
    expect(logger.debug).toHaveBeenCalled();
    const calls = vi.mocked(logger.debug).mock.calls;

    const completedCall = calls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
    );
    expect(completedCall).toBeDefined();

    if (completedCall?.[1]) {
      const metadata = completedCall[1];
      expect(metadata).toHaveProperty('duration');
      expect(metadata).toHaveProperty('durationMs');
      expect(metadata).toHaveProperty('correlationId');
    }
  });

  it('logs slow request warning for requests exceeding 2s threshold', async () => {
    const logger = createMockLogger();
    const app = express();
    app.use(createCorrelationMiddleware(logger));

    // Add a slow endpoint that takes >2s
    app.get('/slow', async (_req, res) => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
      res.json({ status: 'slow' });
    });

    await request(app).get('/slow');

    // Should log at WARN level for slow requests
    expect(logger.warn).toHaveBeenCalled();
    const warnCalls = vi.mocked(logger.warn).mock.calls;

    const slowRequestCall = warnCalls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
    );
    expect(slowRequestCall).toBeDefined();

    if (slowRequestCall?.[1]) {
      const metadata = slowRequestCall[1];
      expect(metadata).toHaveProperty('slowRequest', true);
      expect(metadata).toHaveProperty('durationMs');
    }
  });

  it('includes timing data in all request completion logs', async () => {
    const logger = createMockLogger();
    const app = createTestApp(logger);

    await request(app).get('/test');

    const debugCalls = vi.mocked(logger.debug).mock.calls;
    const completedCall = debugCalls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
    );

    expect(completedCall).toBeDefined();
    if (completedCall?.[1]) {
      const metadata = completedCall[1];
      expect(metadata).toHaveProperty('duration');
      expect(metadata).toHaveProperty('durationMs');
      expect(metadata).toHaveProperty('method');
      expect(metadata).toHaveProperty('path');
      expect(metadata).toHaveProperty('statusCode');
    }
  });
});

describe('createCorrelationMiddleware - header redaction', () => {
  describe('request header redaction', () => {
    it('should redact Authorization header in request logs', async () => {
      const logger = createMockLogger();
      const app = createTestApp(logger);

      await request(app).get('/test').set('Authorization', 'Bearer secret-token-12345');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestStartedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
      );

      expect(requestStartedCall).toBeDefined();
      if (requestStartedCall?.[1]) {
        const metadata = requestStartedCall[1];
        expect(metadata).toHaveProperty('requestHeaders');
        const headers = (metadata as { requestHeaders?: Record<string, string> }).requestHeaders;
        expect(headers?.authorization).toBe('[REDACTED]');
      }
    });

    it('should redact Cookie header in request logs', async () => {
      const logger = createMockLogger();
      const app = createTestApp(logger);

      await request(app).get('/test').set('Cookie', 'session=abc123; user=john');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestStartedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
      );

      expect(requestStartedCall).toBeDefined();
      if (requestStartedCall?.[1]) {
        const metadata = requestStartedCall[1];
        expect(metadata).toHaveProperty('requestHeaders');
        const headers = (metadata as { requestHeaders?: Record<string, string> }).requestHeaders;
        expect(headers?.cookie).toBe('[REDACTED]');
      }
    });

    it('should partially redact CF-Connecting-IP header in request logs', async () => {
      const logger = createMockLogger();
      const app = createTestApp(logger);

      await request(app).get('/test').set('CF-Connecting-IP', '192.168.1.100');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestStartedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
      );

      expect(requestStartedCall).toBeDefined();
      if (requestStartedCall?.[1]) {
        const metadata = requestStartedCall[1];
        expect(metadata).toHaveProperty('requestHeaders');
        const headers = (metadata as { requestHeaders?: Record<string, string> }).requestHeaders;
        // CF-Connecting-IP is in the "interesting" headers list and should be partially redacted
        expect(headers?.['cf-connecting-ip']).toBe('192.....100');
      }
    });

    it('should redact X-API-Key header in request logs', async () => {
      const logger = createMockLogger();
      const app = createTestApp(logger);

      await request(app).get('/test').set('X-API-Key', 'REDACTED');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestStartedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
      );

      expect(requestStartedCall).toBeDefined();
      if (requestStartedCall?.[1]) {
        const metadata = requestStartedCall[1];
        expect(metadata).toHaveProperty('requestHeaders');
        const headers = (metadata as { requestHeaders?: Record<string, string> }).requestHeaders;
        // X-API-Key is not in the "interesting" headers list, so won't be logged
        expect(headers?.['x-api-key']).toBeUndefined();
      }
    });

    it('should handle mixed sensitive and non-sensitive headers in request logs', async () => {
      const logger = createMockLogger();
      const app = createTestApp(logger);

      await request(app)
        .get('/test')
        .set('Authorization', 'Bearer secret')
        .set('Accept', 'application/json')
        .set('Cookie', 'session=abc')
        .set('User-Agent', 'TestAgent/1.0');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestStartedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request started'),
      );

      expect(requestStartedCall).toBeDefined();
      if (requestStartedCall?.[1]) {
        const metadata = requestStartedCall[1];
        expect(metadata).toHaveProperty('requestHeaders');
        const headers = (metadata as { requestHeaders?: Record<string, string> }).requestHeaders;

        // Sensitive headers redacted
        expect(headers?.authorization).toBe('[REDACTED]');
        expect(headers?.cookie).toBe('[REDACTED]');

        // Non-sensitive headers preserved
        expect(headers?.accept).toBe('application/json');
        expect(headers?.['user-agent']).toBe('TestAgent/1.0');
      }
    });
  });

  describe('response header redaction', () => {
    it('should redact Set-Cookie header in response logs', async () => {
      const logger = createMockLogger();
      const app = express();
      app.use(createCorrelationMiddleware(logger));

      app.get('/test', (_req, res) => {
        res.setHeader('Set-Cookie', 'session=xyz; HttpOnly');
        res.json({ ok: true });
      });

      await request(app).get('/test');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestCompletedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
      );

      expect(requestCompletedCall).toBeDefined();
      if (requestCompletedCall?.[1]) {
        const metadata = requestCompletedCall[1];
        expect(metadata).toHaveProperty('responseHeaders');
        const headers = (metadata as { responseHeaders?: Record<string, string> }).responseHeaders;
        // Set-Cookie is not in the "interesting" headers list, so won't be logged
        expect(headers?.['set-cookie']).toBeUndefined();
      }
    });

    it('should preserve X-Correlation-ID header in response logs', async () => {
      const logger = createMockLogger();
      const app = createTestApp(logger);

      await request(app).get('/test');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestCompletedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
      );

      expect(requestCompletedCall).toBeDefined();
      if (requestCompletedCall?.[1]) {
        const metadata = requestCompletedCall[1];
        expect(metadata).toHaveProperty('responseHeaders');
        const headers = (metadata as { responseHeaders?: Record<string, string> }).responseHeaders;

        // X-Correlation-ID should be preserved (it's in interesting headers)
        expect(headers?.['x-correlation-id']).toBeDefined();
        expect(headers?.['x-correlation-id']).toMatch(/^req_\d+_[a-f0-9]{6}$/);
      }
    });

    it('should handle multiple response headers with proper redaction', async () => {
      const logger = createMockLogger();
      const app = express();
      app.use(createCorrelationMiddleware(logger));

      app.get('/test', (_req, res) => {
        res.setHeader('Set-Cookie', 'session=xyz');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Custom-Header', 'custom-value');
        res.json({ ok: true });
      });

      await request(app).get('/test');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestCompletedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
      );

      expect(requestCompletedCall).toBeDefined();
      if (requestCompletedCall?.[1]) {
        const metadata = requestCompletedCall[1];
        expect(metadata).toHaveProperty('responseHeaders');
        const headers = (metadata as { responseHeaders?: Record<string, string> }).responseHeaders;

        // Only interesting headers should be in summary
        expect(headers?.['content-type']).toBe('application/json; charset=utf-8');
        expect(headers?.['x-correlation-id']).toBeDefined();

        // Non-interesting headers should not be logged
        expect(headers?.['set-cookie']).toBeUndefined();
        expect(headers?.['x-custom-header']).toBeUndefined();
      }
    });

    it('should preserve WWW-Authenticate header in response logs', async () => {
      const logger = createMockLogger();
      const app = express();
      app.use(createCorrelationMiddleware(logger));

      app.get('/test', (_req, res) => {
        res.setHeader('WWW-Authenticate', 'Bearer realm="api"');
        res.status(401).json({ error: 'Unauthorized' });
      });

      await request(app).get('/test');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestCompletedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
      );

      expect(requestCompletedCall).toBeDefined();
      if (requestCompletedCall?.[1]) {
        const metadata = requestCompletedCall[1];
        expect(metadata).toHaveProperty('responseHeaders');
        const headers = (metadata as { responseHeaders?: Record<string, string> }).responseHeaders;

        // WWW-Authenticate is in interesting headers and should be preserved
        expect(headers?.['www-authenticate']).toBe('Bearer realm="api"');
      }
    });

    it('should preserve Clerk auth status headers in response logs', async () => {
      const logger = createMockLogger();
      const app = express();
      app.use(createCorrelationMiddleware(logger));

      app.get('/test', (_req, res) => {
        res.setHeader('X-Clerk-Auth-Status', 'signed_out');
        res.setHeader('X-Clerk-Auth-Reason', 'no_session');
        res.json({ ok: true });
      });

      await request(app).get('/test');

      const debugCalls = vi.mocked(logger.debug).mock.calls;
      const requestCompletedCall = debugCalls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Request completed'),
      );

      expect(requestCompletedCall).toBeDefined();
      if (requestCompletedCall?.[1]) {
        const metadata = requestCompletedCall[1];
        expect(metadata).toHaveProperty('responseHeaders');
        const headers = (metadata as { responseHeaders?: Record<string, string> }).responseHeaders;

        // Clerk headers are in interesting headers and should be preserved
        // Note: headers are normalized to lowercase in Node.js
        expect(headers?.['x-clerk-auth-status']).toBe('signed_out');
        expect(headers?.['x-clerk-auth-reason']).toBe('no_session');
      }
    });
  });
});

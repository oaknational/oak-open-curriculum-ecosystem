/**
 * Integration tests for the diagnostic test-error route.
 *
 * @remarks Uses supertest + a real Express app per the project's
 * established route-test pattern (`auth-routes.integration.test.ts`,
 * `oauth-proxy-routes.integration.test.ts`). Asserts:
 *
 * - Authentication: missing/wrong/length-mismatched secret returns
 *   401 and does NOT reach the mode dispatcher.
 * - Mode dispatch: each of `handled`, `unhandled`, `rejected`
 *   reaches its respective code path with a distinct error type.
 * - Validation: unrecognised modes return 400.
 * - `captureHandledError` contract: called with the expected
 *   boundary tag, mode, and token.
 *
 * Tests use lightweight fakes for `observability` and `log`
 * dependencies per ADR-078 (no global mocks; explicit injection).
 */

import express, { type Express, type ErrorRequestHandler, type RequestHandler } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createFakeLogger } from '../test-helpers/fakes.js';
import {
  isTestErrorMode,
  registerTestErrorRoute,
  TEST_ERROR_MODES,
  TestErrorHandled,
  TestErrorRejected,
  TestErrorUnhandled,
} from './test-error-route.js';

const SECRET = 'test-secret-1234567890';
const PASSTHROUGH_LIMITER: RequestHandler = (_req, _res, next) => {
  next();
};

interface CaptureRecord {
  readonly error: unknown;
  readonly context: unknown;
}

function makeFakeObservability(): {
  readonly captureHandledError: (error: unknown, context?: unknown) => void;
  readonly records: CaptureRecord[];
} {
  const records: CaptureRecord[] = [];
  return {
    captureHandledError(error, context) {
      records.push({ error, context });
    },
    records,
  };
}

function buildApp(
  observability: ReturnType<typeof makeFakeObservability>,
  log = createFakeLogger(),
): Express {
  const app = express();
  app.use(express.json());
  registerTestErrorRoute({
    app,
    secret: SECRET,
    rateLimiter: PASSTHROUGH_LIMITER,
    observability,
    log,
  });
  // Test error handler that surfaces the forwarded error in the
  // response so we can assert on its name (mirrors the real
  // setupExpressErrorHandler chain's effect: 5xx + Sentry capture).
  // The 4-arg signature is load-bearing: Express recognises error
  // middleware by arity, not by ErrorRequestHandler typing — `next`
  // must remain a parameter even though it is not invoked.
  const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    const e = err instanceof Error ? err : new Error(String(err));
    res.status(500).json({ error: e.name, message: e.message });
    void next;
  };
  app.use(errorHandler);
  return app;
}

describe('registerTestErrorRoute', () => {
  describe('authentication', () => {
    it('returns 401 when the secret header is absent', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app).post('/test-error?mode=handled').send({});

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
      expect(obs.records).toHaveLength(0);
      expect(log.warn).toHaveBeenCalledWith('test-error.auth.failed', { hasHeader: false });
    });

    it('returns 401 when the secret value is wrong but length matches', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error?mode=handled')
        .set('x-test-error-secret', 'wrong-secret-9999999')
        .send({});

      expect(response.status).toBe(401);
      expect(obs.records).toHaveLength(0);
    });

    it('returns 401 when the secret length differs (constant-time guard short-circuit)', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error?mode=handled')
        .set('x-test-error-secret', 'short')
        .send({});

      expect(response.status).toBe(401);
      expect(obs.records).toHaveLength(0);
    });
  });

  describe('mode=handled', () => {
    it('captures a TestErrorHandled with the expected boundary + token, returns 200', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error?mode=handled&token=tok-handled')
        .set('x-test-error-secret', SECRET)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'captured', mode: 'handled', token: 'tok-handled' });
      expect(obs.records).toHaveLength(1);
      const [record] = obs.records;
      if (record === undefined) {
        throw new Error('expected captured record');
      }
      expect(record.error).toBeInstanceOf(TestErrorHandled);
      const errorInstance = record.error;
      if (!(errorInstance instanceof Error)) {
        throw new Error('expected captured error to be an Error instance');
      }
      expect(errorInstance.message).toBe('[test-error] handled error token=tok-handled');
      expect(record.context).toEqual({
        boundary: 'test_error_route',
        mode: 'handled',
        token: 'tok-handled',
      });
    });

    it('takes mode and token from the request body when query is absent', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error')
        .set('x-test-error-secret', SECRET)
        .send({ mode: 'handled', token: 'from-body' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'captured', mode: 'handled', token: 'from-body' });
    });
  });

  describe('mode=unhandled', () => {
    it('forwards a TestErrorUnhandled to the error-handler chain (no captureHandledError call)', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error?mode=unhandled&token=tok-unhandled')
        .set('x-test-error-secret', SECRET)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('TestErrorUnhandled');
      expect(response.body.message).toContain('tok-unhandled');
      // captureHandledError must NOT be called for the unhandled
      // path — Sentry's `setupExpressErrorHandler` is responsible.
      expect(obs.records).toHaveLength(0);
    });
  });

  describe('mode=rejected', () => {
    it('forwards a TestErrorRejected from an async rejection (no captureHandledError call)', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error?mode=rejected&token=tok-rejected')
        .set('x-test-error-secret', SECRET)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('TestErrorRejected');
      expect(response.body.message).toContain('tok-rejected');
      expect(obs.records).toHaveLength(0);
    });
  });

  describe('mode validation', () => {
    it('returns 400 with the allowed-mode list when mode is unrecognised', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const response = await request(app)
        .post('/test-error?mode=garbage')
        .set('x-test-error-secret', SECRET)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'invalid_mode',
        allowed: ['handled', 'unhandled', 'rejected'],
      });
      expect(obs.records).toHaveLength(0);
    });
  });

  describe('default token derivation', () => {
    it('synthesises a default token when none is provided', async () => {
      const obs = makeFakeObservability();
      const log = createFakeLogger();
      const app = buildApp(obs, log);

      const before = Date.now();
      const response = await request(app)
        .post('/test-error?mode=handled')
        .set('x-test-error-secret', SECRET)
        .send({});
      const after = Date.now();

      expect(response.status).toBe(200);
      const tokenString = String(response.body.token);
      const tokenMatch = /^test-(\d+)$/.exec(tokenString);
      expect(tokenMatch).not.toBeNull();
      if (tokenMatch === null) {
        return;
      }
      const capturedDigits = tokenMatch[1];
      expect(capturedDigits).toBeDefined();
      if (capturedDigits === undefined) {
        return;
      }
      const tokenTime = Number(capturedDigits);
      expect(tokenTime).toBeGreaterThanOrEqual(before);
      expect(tokenTime).toBeLessThanOrEqual(after);
    });
  });

  describe('isTestErrorMode (pure helper)', () => {
    it.each(['handled', 'unhandled', 'rejected'])('accepts %s', (value) => {
      expect(isTestErrorMode(value)).toBe(true);
    });

    it.each(['', 'HANDLED', 'reject', 'fatal'])('rejects %s', (value) => {
      expect(isTestErrorMode(value)).toBe(false);
    });
  });

  describe('TEST_ERROR_MODES constant', () => {
    it('matches the allowed list shape', () => {
      expect(TEST_ERROR_MODES).toEqual({
        handled: 'handled',
        unhandled: 'unhandled',
        rejected: 'rejected',
      });
    });
  });

  describe('error class hierarchy', () => {
    const errorClassCases: readonly (readonly [new (token: string) => Error, string])[] = [
      [TestErrorHandled, '[test-error] handled error token=x'],
      [TestErrorUnhandled, '[test-error] unhandled error token=x'],
      [TestErrorRejected, '[test-error] rejected promise token=x'],
    ];

    it.each(errorClassCases)('carries the token in the message', (Ctor, expectedMessage) => {
      const e = new Ctor('x');
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe(expectedMessage);
      expect(e.name).toBe(Ctor.name);
    });
  });
});

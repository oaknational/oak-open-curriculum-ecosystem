/**
 * Diagnostic test-error route for repeatable Sentry capture validation.
 *
 * @remarks
 * Registers `POST /test-error` (gated by `TEST_ERROR_SECRET` env var,
 * forbidden in production by the env-schema super-refine) with three
 * modes that drive distinct Sentry capture paths:
 *
 * - `handled`: explicitly calls `observability.captureHandledError`
 *   (4xx-equivalent path; mirrors the production handler pattern in
 *   `oauth-proxy-routes.ts`).
 * - `unhandled`: forwards a synchronous error via `next(err)` so the
 *   Express error-handler chain captures it (5xx path).
 * - `rejected`: rejects an async promise so the Express async error
 *   handling chain captures it (5xx path; mirrors the
 *   `asyncRoute` pattern in `oauth-proxy-routes.ts`).
 *
 * Authentication uses constant-time comparison on the
 * `X-Test-Error-Secret` header. Rate-limited via the existing
 * `oauthRateLimiter` profile (30 req / 15 min / IP) so the route
 * cannot be used as a DoS amplifier.
 *
 * Why this exists:
 *   The Phase 1 baseline probes prove the transactions stream. The
 *   malformed-JSON probe in `scripts/probe-sentry-error-capture.sh`
 *   proves errors reach Sentry, but the resulting stack trace is
 *   entirely third-party (body-parser / raw-body) — it does NOT
 *   prove application-source symbolication or source-code upload
 *   for the current preview release. This route lets us throw from
 *   application code on demand and verify the full pipe end-to-end.
 *
 * @see ADR-163 for the release-identifier contract.
 * @see ../../scripts/probe-sentry-error-capture.sh for the probe driver.
 */

import { timingSafeEqual } from 'node:crypto';

import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';

import type { Logger } from '@oaknational/logger';

import type { HttpObservability } from '../observability/http-observability.js';

/**
 * Allowed `mode` values for the diagnostic probe. Constant-type-
 * predicate per ADR-153 — values are the source of truth, the type
 * is derived structurally.
 */
export const TEST_ERROR_MODES = {
  handled: 'handled',
  unhandled: 'unhandled',
  rejected: 'rejected',
} as const;

type TestErrorMode = (typeof TEST_ERROR_MODES)[keyof typeof TEST_ERROR_MODES];

const ALL_MODES: readonly TestErrorMode[] = [
  TEST_ERROR_MODES.handled,
  TEST_ERROR_MODES.unhandled,
  TEST_ERROR_MODES.rejected,
];

const ALL_MODE_VALUES: readonly string[] = ALL_MODES;

export function isTestErrorMode(value: string): value is TestErrorMode {
  return ALL_MODE_VALUES.includes(value);
}

/**
 * Branded error class for the unhandled-throw path.
 *
 * @remarks A distinct class makes the resulting Sentry issue easy
 * to filter via `error.type:TestErrorUnhandled` and avoids
 * collision with real production error groupings.
 */
export class TestErrorUnhandled extends Error {
  constructor(token: string) {
    super(`[test-error] unhandled error token=${token}`);
    this.name = 'TestErrorUnhandled';
  }
}

/** Branded error class for the handled-capture path. */
export class TestErrorHandled extends Error {
  constructor(token: string) {
    super(`[test-error] handled error token=${token}`);
    this.name = 'TestErrorHandled';
  }
}

/** Branded error class for the rejected-promise path. */
export class TestErrorRejected extends Error {
  constructor(token: string) {
    super(`[test-error] rejected promise token=${token}`);
    this.name = 'TestErrorRejected';
  }
}

/**
 * Constant-time string comparison.
 *
 * @remarks `timingSafeEqual` requires equal-length buffers. We
 * length-check first (length leaks aren't sensitive — the secret's
 * length is fixed by env-schema validation at \>= 16 chars). The
 * actual byte comparison is then constant-time within that length.
 */
function constantTimeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

interface RegisterTestErrorRouteDeps {
  readonly app: Express;
  readonly secret: string;
  readonly rateLimiter: RequestHandler;
  readonly observability: Pick<HttpObservability, 'captureHandledError'>;
  readonly log: Logger;
}

interface ParsedProbeInputs {
  readonly mode: TestErrorMode;
  readonly token: string;
}

const ProbeBodySchema = z
  .object({
    mode: z.string().optional(),
    token: z.string().optional(),
  })
  .partial();

function readBodyField(body: unknown, key: 'mode' | 'token'): string | undefined {
  const parsed = ProbeBodySchema.safeParse(body);
  return parsed.success ? parsed.data[key] : undefined;
}

function readQueryField(req: Request, key: 'mode' | 'token'): string | undefined {
  const value = req.query[key];
  return typeof value === 'string' ? value : undefined;
}

function parseProbeInputs(req: Request): ParsedProbeInputs | null {
  const rawMode =
    readQueryField(req, 'mode') ?? readBodyField(req.body, 'mode') ?? TEST_ERROR_MODES.handled;
  const token =
    readQueryField(req, 'token') ?? readBodyField(req.body, 'token') ?? `test-${Date.now()}`;
  return isTestErrorMode(rawMode) ? { mode: rawMode, token } : null;
}

function dispatchMode(
  mode: TestErrorMode,
  token: string,
  res: Response,
  next: NextFunction,
  observability: Pick<HttpObservability, 'captureHandledError'>,
): void {
  switch (mode) {
    case TEST_ERROR_MODES.handled: {
      observability.captureHandledError(new TestErrorHandled(token), {
        boundary: 'test_error_route',
        mode,
        token,
      });
      res.status(200).json({ status: 'captured', mode, token });
      return;
    }
    case TEST_ERROR_MODES.unhandled: {
      // Synchronous forward to the Express error-handler chain.
      // `setupExpressErrorHandler` from @sentry/node captures
      // status-less errors by default, producing a 500 response
      // and a Sentry issue tagged with the current release.
      next(new TestErrorUnhandled(token));
      return;
    }
    case TEST_ERROR_MODES.rejected: {
      // Async rejection path. Express forwards rejections passed
      // to `next()` to the same error-handler chain.
      Promise.reject(new TestErrorRejected(token)).catch(next);
      return;
    }
  }
}

/**
 * Registers `POST /test-error` on the provided Express app.
 *
 * @param deps - Injected dependencies (DI per ADR-078).
 * @example
 * ```ts
 * if (env.TEST_ERROR_SECRET) {
 *   registerTestErrorRoute({
 *     app,
 *     secret: env.TEST_ERROR_SECRET,
 *     rateLimiter: oauthRateLimiter,
 *     observability,
 *     log,
 *   });
 * }
 * ```
 */
export function registerTestErrorRoute(deps: RegisterTestErrorRouteDeps): void {
  const { app, secret, rateLimiter, observability, log } = deps;

  app.post('/test-error', rateLimiter, (req: Request, res: Response, next: NextFunction): void => {
    const provided = req.header('x-test-error-secret') ?? '';

    if (!constantTimeStringEqual(provided, secret)) {
      log.warn('test-error.auth.failed', { hasHeader: provided.length > 0 });
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const inputs = parseProbeInputs(req);
    if (inputs === null) {
      log.warn('test-error.invalid-mode');
      res.status(400).json({ error: 'invalid_mode', allowed: ALL_MODES });
      return;
    }

    log.info('test-error.invoked', { mode: inputs.mode, token: inputs.token });
    dispatchMode(inputs.mode, inputs.token, res, next, observability);
  });

  log.info('test-error.route.registered', { rateLimitProfile: 'oauth' });
}

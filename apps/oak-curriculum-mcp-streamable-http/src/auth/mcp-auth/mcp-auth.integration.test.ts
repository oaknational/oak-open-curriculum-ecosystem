/**
 * Integration tests for mcpAuth middleware.
 *
 * Tests that mcpAuth sets verified AuthInfo on `req.auth` when token
 * verification succeeds, and returns 401 when verification fails.
 * Uses a custom TokenVerifier to avoid Clerk dependencies.
 *
 * Uses `node-mocks-http` for Express Request/Response objects — properly
 * typed without assertions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { mcpAuth } from './mcp-auth.js';
import {
  createFakeLogger,
  createFakeAuthInfo,
  createMockExpressRequest,
  createMockExpressResponse,
} from '../../test-helpers/fakes.js';

const ALLOWED_HOSTS = ['localhost'] as const;

/** A verifier that accepts any credential it is shown: the control proving the guard sits upstream of it. */
function alwaysVerifies(): () => Promise<AuthInfo> {
  return vi.fn<() => Promise<AuthInfo>>().mockResolvedValue(createFakeAuthInfo());
}

/** One JWT segment: the base64url form of the JSON value. */
function jwtSegment(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

/** A JWT-format token carrying a chosen `aud`; decoded by the middleware, never verified. */
function tokenWithAudience(aud: string): string {
  return `${jwtSegment({ alg: 'none', typ: 'JWT' })}.${jwtSegment({ aud })}.${jwtSegment('signature')}`;
}

describe('mcpAuth middleware (Integration)', () => {
  const logger = createFakeLogger();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('auth storage on req.auth', () => {
    it('sets req.auth with verified authData after successful verification', async () => {
      const fakeAuthInfo = createFakeAuthInfo();
      const verifier = vi.fn<() => Promise<AuthInfo>>().mockResolvedValue(fakeAuthInfo);

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({ token: 'test-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req).toHaveProperty('auth', fakeAuthInfo);
    });

    it('does not set req.auth when verifier returns undefined (401)', async () => {
      const verifier = vi.fn<() => Promise<undefined>>().mockResolvedValue(undefined);

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({ token: 'test-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(401);
      expect(req).not.toHaveProperty('auth');
    });
  });

  /**
   * The authorisation invariant, stated over the states a CLIENT controls:
   * no request leaves `mcpAuth` via `next()` unless `verifyToken` returned a
   * truthy `AuthInfo`. Absence, emptiness, and a malformed or rejected
   * credential are all rejections, never bypasses.
   *
   * Scoped to this middleware, deliberately — `createMcpRouter` skips
   * `mcpAuth` entirely for a `resources/read` of a public resource URI
   * (ADR-057 / ADR-113 / ADR-205), so this is not a claim about the `/mcp`
   * route. Audience-mismatch rejection is the remaining reachable 401 and is
   * proven in the challenge test below.
   */
  describe('no unverified request reaches next()', () => {
    it.each([
      { label: 'no Authorization header at all', headers: {}, verifier: alwaysVerifies },
      {
        label: 'an empty Authorization header',
        headers: { authorization: '' },
        verifier: alwaysVerifies,
      },
      {
        label: 'a non-Bearer scheme',
        headers: { authorization: 'Basic YWRtaW46YWRtaW4=' },
        verifier: alwaysVerifies,
      },
      {
        // The credential-free request: well-formed shape, EMPTY credential.
        // This is the row that stops an empty-string token reaching the
        // verifier — the presence guard never sees it, because the header
        // itself is truthy.
        label: 'a Bearer prefix with an empty credential',
        headers: { authorization: 'Bearer ' },
        verifier: alwaysVerifies,
      },
      {
        label: 'a bare Bearer with no space',
        headers: { authorization: 'Bearer' },
        verifier: alwaysVerifies,
      },
      {
        // Pins a deliberate strictness: RFC 7235 makes the auth scheme
        // case-INsensitive, and this server rejects anyway.
        label: 'a lower-case bearer scheme',
        headers: { authorization: 'bearer plausible-looking-token' },
        verifier: alwaysVerifies,
      },
      {
        // Pins a deliberate strictness: RFC 6750 allows 1*SP between scheme
        // and credentials; this server accepts exactly one space.
        label: 'a multi-space Bearer prefix',
        headers: { authorization: 'Bearer  plausible-looking-token' },
        verifier: alwaysVerifies,
      },
      {
        // Node discards a duplicate `Authorization` header rather than
        // joining it, so this value cannot arrive from two client headers —
        // but a proxy may forward one header carrying both, and a client can
        // send this literal string directly.
        label: 'a single header carrying two comma-joined credentials',
        headers: { authorization: 'Bearer a, Bearer b' },
        verifier: alwaysVerifies,
      },
      {
        label: 'a well-formed token the verifier rejects',
        headers: { authorization: 'Bearer plausible-looking-token' },
        verifier: (): (() => Promise<undefined>) =>
          vi.fn<() => Promise<undefined>>().mockResolvedValue(undefined),
      },
    ])('rejects $label', async ({ headers, verifier }) => {
      const middleware = mcpAuth(verifier(), logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({ host: 'localhost' });
      Object.assign(req.headers, headers);
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(401);
      expect(req).not.toHaveProperty('auth');
    });

    /**
     * RFC 6750 §3: absent credentials get a bare challenge with NO error
     * code; a malformed value gets `error="invalid_request"`. The split is
     * client-facing contract — collapsing the two responses would pass the
     * rejection rows above, so the challenge shapes are pinned here.
     */
    it('keeps the RFC 6750 split: bare challenge when absent, invalid_request when malformed', async () => {
      const middleware = mcpAuth(alwaysVerifies(), logger, ALLOWED_HOSTS);

      const absentReq = createMockExpressRequest({ host: 'localhost' });
      const absentRes = createMockExpressResponse();
      await middleware(absentReq, absentRes, vi.fn());
      const absentChallenge = String(absentRes.getHeader('WWW-Authenticate') ?? '');
      expect(absentChallenge).toContain('Bearer resource_metadata=');
      expect(absentChallenge).not.toContain('error=');

      const malformedReq = createMockExpressRequest({ host: 'localhost' });
      Object.assign(malformedReq.headers, { authorization: 'Bearer' });
      const malformedRes = createMockExpressResponse();
      await middleware(malformedReq, malformedRes, vi.fn());
      expect(String(malformedRes.getHeader('WWW-Authenticate') ?? '')).toContain(
        'error="invalid_request"',
      );
    });

    /**
     * A verifier that THROWS is the one state where `next` is legitimately
     * called — with an error, which Express routes to its error pipeline and
     * not on to the MCP handler. The invariant still holds where it matters:
     * the request is not authenticated, and this middleware answers nothing
     * itself, so it cannot accidentally return a success. The 5xx belongs to
     * the error handler, which is why no status is asserted here.
     */
    it('hands a verifier failure to the error pipeline, unauthenticated and unanswered', async () => {
      const verifier = vi
        .fn<() => Promise<AuthInfo>>()
        .mockRejectedValue(new Error('token verification transport failure'));

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({ token: 'plausible-looking-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(req).not.toHaveProperty('auth');
      expect(res.headersSent).toBe(false);
    });
  });

  describe('audience mismatch challenge (RFC 8707, MCP-351)', () => {
    it('keeps token-derived text out of the challenge, so one metadata pointer survives', async () => {
      // An `aud` shaped to close error_description and append a second
      // resource_metadata — the value an authorization server would echo from
      // a client-supplied RFC 8707 `resource` parameter.
      const forgedAudience =
        'https://evil.example/mcp", error="invalid_token", resource_metadata="https://evil.example/pwned';
      const verifier = vi.fn<() => Promise<AuthInfo>>().mockResolvedValue(createFakeAuthInfo());

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({
        token: tokenWithAudience(forgedAudience),
        host: 'localhost',
      });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      const challenge = String(res.getHeader('WWW-Authenticate') ?? '');
      expect(res.statusCode).toBe(401);
      expect(next).not.toHaveBeenCalled();
      // The client is pointed at exactly one discovery document — this server's.
      expect(challenge.match(/resource_metadata=/g)).toHaveLength(1);
      expect(challenge).not.toContain('evil.example');
    });
  });

  describe('host validation (403, MCP-351)', () => {
    it('rejects a disallowed Host with 403 Forbidden and no auth challenge', async () => {
      const verifier = vi.fn<() => Promise<AuthInfo>>().mockResolvedValue(createFakeAuthInfo());

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({ token: 'test-token', host: 'evil.example' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(403);
      expect(res.getHeader('WWW-Authenticate')).toBeUndefined();
      expect(req).not.toHaveProperty('auth');
    });
  });
});
